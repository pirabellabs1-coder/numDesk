---
name: api-spec
description: >
  Utiliser ce skill pour concevoir, documenter ou implémenter des endpoints API
  REST sur Vocalia. Déclencher quand l'utilisateur dit "crée l'endpoint X",
  "l'API pour Y", "la route pour Z", "documente l'API", ou quand un endpoint
  Fastify doit être écrit. Garantit des endpoints cohérents, sécurisés et
  documentés selon les standards Vocalia.
---

# Skill — API Spec & Implémentation Vocalia

## Standards API Vocalia

### Format de réponse universel

```typescript
// Succès
{
  data: T,
  meta: {
    requestId: string,  // UUID v4
    timestamp: string,  // ISO 8601
    pagination?: {      // Si liste paginée
      page: number,
      pageSize: number,
      total: number,
      totalPages: number
    }
  }
}

// Erreur
{
  error: {
    code: string,       // SNAKE_CASE ex: NOT_FOUND, UNAUTHORIZED
    message: string,    // En français, lisible par l'utilisateur
    details?: Record<string, string>  // Erreurs de validation par champ
  }
}
```

### Codes d'erreur standards Vocalia

```typescript
const ERROR_CODES = {
  // Auth
  UNAUTHORIZED:           'Non authentifié. Veuillez vous connecter.',
  FORBIDDEN:              'Accès refusé à cette ressource.',
  TOKEN_INVALID:          'Token API invalide ou expiré.',
  TOKEN_EXPIRED:          'Token API expiré.',

  // Validation
  VALIDATION_ERROR:       'Les données envoyées sont invalides.',
  MISSING_FIELD:          'Un champ requis est manquant.',

  // Ressources
  NOT_FOUND:              'Ressource introuvable.',
  ALREADY_EXISTS:         'Cette ressource existe déjà.',
  WORKSPACE_NOT_FOUND:    'Workspace introuvable.',
  AGENT_NOT_FOUND:        'Agent introuvable.',

  // Métier
  MINUTES_EXHAUSTED:      'Les minutes du cycle sont épuisées.',
  OVERAGE_LIMIT_REACHED:  'Le plafond de dépassement est atteint.',
  AGENT_NOT_PUBLISHED:    'L\'agent doit être publié avant de lancer un appel.',
  NO_PHONE_NUMBER:        'Aucun numéro de téléphone configuré.',

  // Système
  INTERNAL_ERROR:         'Une erreur interne est survenue. Veuillez réessayer.',
  VAPI_ERROR:             'Erreur de communication avec le service d\'appels.',
  RATE_LIMIT_EXCEEDED:    'Trop de requêtes. Veuillez patienter.',
} as const
```

---

## Template d'endpoint Fastify

### Route CRUD complète (exemple : agents)

```typescript
// server/routes/agents.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authenticate } from '../middleware/auth'
import { checkWorkspaceAccess } from '../middleware/rbac'
import { agentService } from '../services/agent.service'
import { ERROR_CODES } from '../constants/errors'
import { createRequestMeta } from '../utils/response'

// Schémas Zod
const createAgentSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(255),
  prompt: z.string().optional(),
  firstMessage: z.string().optional(),
  language: z.string().default('fr-FR'),
  voiceProvider: z.enum(['cartesia', 'elevenlabs', 'deepgram']).default('cartesia'),
  voiceId: z.string().optional(),
  llmModel: z.string().default('gemini-2.5-flash'),
  temperature: z.number().min(0).max(2).default(0.4),
  topP: z.number().min(0).max(1).default(1),
  silenceTimeoutSec: z.number().int().min(1).max(30).default(7),
  maxSilenceRetries: z.number().int().min(0).max(5).default(2),
  recordSession: z.boolean().default(true),
  recordAudio: z.boolean().default(true),
})

const updateAgentSchema = createAgentSchema.partial()

export async function agentRoutes(fastify: FastifyInstance) {

  // GET /api/agents — Liste des agents du workspace
  fastify.get('/', {
    preHandler: [authenticate, checkWorkspaceAccess],
    schema: {
      querystring: z.object({
        search: z.string().optional(),
        page: z.coerce.number().int().positive().default(1),
        pageSize: z.coerce.number().int().min(1).max(100).default(20),
      }),
    },
  }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { workspaceId } = req.params as { workspaceId: string }
    const { search, page, pageSize } = req.query as any

    const { agents, total } = await agentService.list({
      workspaceId,
      search,
      page,
      pageSize,
    })

    return reply.code(200).send({
      data: agents,
      meta: {
        ...createRequestMeta(),
        pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      },
    })
  })

  // GET /api/agents/:agentId — Détail d'un agent
  fastify.get('/:agentId', {
    preHandler: [authenticate, checkWorkspaceAccess],
  }, async (req, reply) => {
    const { workspaceId, agentId } = req.params as any

    const agent = await agentService.findById(agentId, workspaceId)
    if (!agent) {
      return reply.code(404).send({
        error: { code: 'AGENT_NOT_FOUND', message: ERROR_CODES.AGENT_NOT_FOUND },
      })
    }

    return reply.code(200).send({ data: agent, meta: createRequestMeta() })
  })

  // POST /api/agents — Créer un agent
  fastify.post('/', {
    preHandler: [authenticate, checkWorkspaceAccess],
  }, async (req, reply) => {
    const { workspaceId } = req.params as any
    const body = createAgentSchema.safeParse(req.body)

    if (!body.success) {
      return reply.code(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: ERROR_CODES.VALIDATION_ERROR,
          details: body.error.flatten().fieldErrors,
        },
      })
    }

    const agent = await agentService.create(workspaceId, body.data)
    return reply.code(201).send({ data: agent, meta: createRequestMeta() })
  })

  // PUT /api/agents/:agentId — Modifier un agent
  fastify.put('/:agentId', {
    preHandler: [authenticate, checkWorkspaceAccess],
  }, async (req, reply) => {
    const { workspaceId, agentId } = req.params as any
    const body = updateAgentSchema.safeParse(req.body)

    if (!body.success) {
      return reply.code(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: ERROR_CODES.VALIDATION_ERROR,
          details: body.error.flatten().fieldErrors,
        },
      })
    }

    const agent = await agentService.update(agentId, workspaceId, body.data)
    if (!agent) {
      return reply.code(404).send({
        error: { code: 'AGENT_NOT_FOUND', message: ERROR_CODES.AGENT_NOT_FOUND },
      })
    }

    return reply.code(200).send({ data: agent, meta: createRequestMeta() })
  })

  // DELETE /api/agents/:agentId — Supprimer un agent
  fastify.delete('/:agentId', {
    preHandler: [authenticate, checkWorkspaceAccess],
  }, async (req, reply) => {
    const { workspaceId, agentId } = req.params as any

    await agentService.delete(agentId, workspaceId)
    return reply.code(204).send()
  })
}
```

---

## Middleware d'authentification

```typescript
// server/middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { verifyToken } from '../lib/auth'

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return reply.code(401).send({
      error: { code: 'UNAUTHORIZED', message: 'Non authentifié. Veuillez vous connecter.' }
    })
  }

  const token = authHeader.slice(7)
  const user = await verifyToken(token)
  if (!user) {
    return reply.code(401).send({
      error: { code: 'TOKEN_INVALID', message: 'Token API invalide ou expiré.' }
    })
  }

  req.user = user  // Attaché pour les handlers suivants
}
```

## Middleware RBAC workspace

```typescript
// server/middleware/rbac.ts
export async function checkWorkspaceAccess(req: FastifyRequest, reply: FastifyReply) {
  const { workspaceId } = req.params as { workspaceId: string }
  const userId = req.user.id
  const isAdmin = req.user.role === 'admin'

  // Les admins ont accès à tout
  if (isAdmin) return

  // Vérifier que le workspace appartient à l'utilisateur
  const workspace = await db.query.workspaces.findFirst({
    where: and(
      eq(workspaces.id, workspaceId),
      eq(workspaces.userId, userId)
    )
  })

  if (!workspace) {
    return reply.code(403).send({
      error: { code: 'FORBIDDEN', message: 'Accès refusé à cette ressource.' }
    })
  }

  req.workspace = workspace
}
```

---

## Checklist avant de livrer un endpoint

```
[ ] Schéma zod de validation de l'input
[ ] Middleware authenticate appliqué
[ ] Middleware checkWorkspaceAccess appliqué (si endpoint workspace)
[ ] Vérification que l'entité appartient au bon workspace (anti IDOR)
[ ] Réponse success avec format { data, meta }
[ ] Réponse erreur avec format { error: { code, message } }
[ ] Messages d'erreur en français
[ ] Code HTTP correct (200, 201, 204, 400, 401, 403, 404, 500)
[ ] Pas de données sensibles dans les logs
[ ] Rate limiting activé (middleware global)
[ ] Test unitaire ou e2e de l'endpoint
```
