---
name: performance
description: >
  Utiliser ce skill pour analyser et optimiser les performances de Vocalia.
  Déclencher quand l'utilisateur dit "c'est lent", "optimise", "performance",
  "les requêtes sont lentes", "le chargement prend du temps", "Core Web Vitals",
  "LCP", "latence", ou avant une mise en production. Couvre frontend, backend,
  base de données et infrastructure.
---

# Skill — Performance Vocalia

## Objectifs de performance Vocalia

| Métrique | Cible | Critique si |
|---|---|---|
| LCP (Largest Contentful Paint) | < 1.5s | > 2.5s |
| FID / INP | < 100ms | > 300ms |
| CLS | < 0.1 | > 0.25 |
| TTFB (Time to First Byte) | < 200ms | > 600ms |
| Réponse API (endpoints simples) | < 100ms | > 500ms |
| Réponse API (listes paginées) | < 200ms | > 1000ms |
| Latence appel IA (Vapi → TTS) | < 800ms | > 1500ms |

---

## AXE 1 — Base de données (impact le plus fort)

### Détecter les requêtes N+1

```typescript
// ❌ N+1 — NE PAS FAIRE
const workspaces = await db.select().from(workspaces).where(eq(workspaces.userId, userId))
for (const ws of workspaces) {
  ws.agents = await db.select().from(agents).where(eq(agents.workspaceId, ws.id))
  // 1 requête par workspace !
}

// ✅ JOIN — Charger tout en une requête
const workspacesWithAgents = await db
  .select({
    workspace: workspaces,
    agent: agents,
  })
  .from(workspaces)
  .leftJoin(agents, eq(agents.workspaceId, workspaces.id))
  .where(eq(workspaces.userId, userId))
```

### Index essentiels à créer

```sql
-- Index sur les FKs (Drizzle ne les crée pas automatiquement)
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_agents_workspace_id ON agents(workspace_id);
CREATE INDEX idx_conversations_workspace_id ON conversations(workspace_id);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_conversations_started_at ON conversations(started_at DESC);
CREATE INDEX idx_campaigns_workspace_id ON campaigns(workspace_id);
CREATE INDEX idx_api_tokens_token_hash ON api_tokens(token_hash);

-- Index composé pour les filtres fréquents
CREATE INDEX idx_conversations_ws_agent ON conversations(workspace_id, agent_id);
CREATE INDEX idx_conversations_ws_status ON conversations(workspace_id, status);
```

### En Drizzle ORM

```typescript
// db/schema/conversations.ts
import { index } from 'drizzle-orm/pg-core'

export const conversations = pgTable('conversations', {
  // ... colonnes
}, (table) => ({
  workspaceIdx: index('idx_conversations_workspace_id').on(table.workspaceId),
  agentIdx: index('idx_conversations_agent_id').on(table.agentId),
  startedAtIdx: index('idx_conversations_started_at').on(table.startedAt),
  wsAgentIdx: index('idx_conversations_ws_agent').on(table.workspaceId, table.agentId),
}))
```

### Pagination obligatoire

```typescript
// Toujours paginer les listes — jamais de SELECT * sans LIMIT
const PAGE_SIZE = 20  // Défaut

// Utiliser cursor-based pagination pour les listes triées par date
const conversations = await db
  .select()
  .from(conversations)
  .where(and(
    eq(conversations.workspaceId, workspaceId),
    cursor ? lt(conversations.startedAt, cursor) : undefined,
  ))
  .orderBy(desc(conversations.startedAt))
  .limit(PAGE_SIZE + 1)  // +1 pour savoir s'il y a une page suivante

const hasNextPage = conversations.length > PAGE_SIZE
const items = conversations.slice(0, PAGE_SIZE)
```

---

## AXE 2 — Frontend Next.js

### Server Components vs Client Components

```typescript
// ✅ Server Component par défaut — données chargées côté serveur
// app/(dashboard)/workspace/[id]/agents/page.tsx
export default async function AgentsPage({ params }: { params: { id: string } }) {
  const agents = await agentService.list({ workspaceId: params.id })
  return <AgentList agents={agents} />
}

// ✅ Client Component uniquement si nécessaire
// components/agents/AgentSearch.tsx
'use client'
export function AgentSearch({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  // Logique interactive uniquement
}
```

### Cache Next.js

```typescript
// Cache les données qui changent peu (plan de workspace, config)
const workspace = await fetch(`/api/workspace/${id}`, {
  next: { revalidate: 60 }  // Revalider toutes les 60s
})

// Invalider le cache après mutation
import { revalidatePath, revalidateTag } from 'next/cache'

// Après création d'un agent :
revalidatePath(`/workspace/${workspaceId}/agents`)
// Ou par tag :
revalidateTag(`workspace-${workspaceId}-agents`)
```

### Optimisation des images

```tsx
// Toujours utiliser next/image
import Image from 'next/image'

<Image
  src={user.avatarUrl}
  alt={`${user.firstName} ${user.lastName}`}
  width={40}
  height={40}
  className="rounded-full"
  priority={false}  // true uniquement pour les images above-the-fold
/>
```

### Lazy loading des composants lourds

```typescript
// Charger les éditeurs de code ou les graphiques à la demande
import dynamic from 'next/dynamic'

const AgentPromptEditor = dynamic(
  () => import('@/components/agents/AgentPromptEditor'),
  {
    loading: () => <Skeleton className="h-48 w-full" />,
    ssr: false,  // Si le composant utilise des APIs browser
  }
)
```

---

## AXE 3 — API & Backend Fastify

### Paralléliser les requêtes indépendantes

```typescript
// ❌ Séquentiel — lent
const workspace = await workspaceService.findById(workspaceId)
const agents = await agentService.listByWorkspace(workspaceId)
const stats = await conversationService.getStats(workspaceId)

// ✅ Parallèle — rapide
const [workspace, agents, stats] = await Promise.all([
  workspaceService.findById(workspaceId),
  agentService.listByWorkspace(workspaceId),
  conversationService.getStats(workspaceId),
])
```

### Cache Redis pour les données chaudes

```typescript
// lib/cache.ts
import { redis } from './redis'

export async function cached<T>(
  key: string,
  ttl: number,
  fn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key)
  if (cached) return JSON.parse(cached)

  const data = await fn()
  await redis.setex(key, ttl, JSON.stringify(data))
  return data
}

// Usage
const workspace = await cached(
  `workspace:${workspaceId}`,
  60,  // 60 secondes
  () => db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).then(r => r[0])
)

// Invalider après mutation
await redis.del(`workspace:${workspaceId}`)
```

### Connection pooling PostgreSQL

```typescript
// db/index.ts — Configuration optimale du pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,           // Max connexions simultanées
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

---

## AXE 4 — Latence Vocalia (spécifique appels IA)

Pour réduire la latence perçue des appels IA sous 800ms :

```
1. Choisir Cartesia Sonic-3 (modèle le plus rapide en fr-FR)
2. Activer le streaming TTS dans Vapi (ne pas attendre la phrase complète)
3. Éviter les prompts > 2000 tokens (ralentit le LLM)
4. Utiliser Gemini 2.5 Flash (plus rapide que GPT-4o pour le fr-FR)
5. Réduire le nombre de tool calls dans le prompt
6. Pré-charger les bases de connaissances en mode Full Context
   uniquement si < 50k tokens (sinon, RAG obligatoire)
7. Les endpoints de tool calls Vocalia doivent répondre < 500ms
   → Optimiser ces endpoints en priorité
```

---

## AXE 5 — Monitoring performance en continu

```typescript
// Middleware Fastify pour logger les requêtes lentes
fastify.addHook('onResponse', (request, reply, done) => {
  const responseTime = reply.getResponseTime()
  if (responseTime > 500) {
    // Log les requêtes lentes pour investigation
    logger.warn({
      method: request.method,
      url: request.url,
      responseTime: Math.round(responseTime),
      statusCode: reply.statusCode,
    }, 'Requête lente détectée')
  }
  done()
})
```

---

## Checklist performance avant mise en prod

```
[ ] Tous les index DB listés ci-dessus sont créés
[ ] Pas de requête N+1 dans les pages critiques (liste workspaces, agents, conversations)
[ ] Les listes sont paginées (pageSize max 50)
[ ] Les images utilisent next/image
[ ] Les composants lourds sont lazy-loadés
[ ] Le cache Redis est activé pour les données chaudes
[ ] Les requêtes indépendantes sont parallélisées
[ ] Les endpoints de tool calls répondent < 500ms
[ ] Lighthouse score > 85 sur la page d'accueil
[ ] Le TTFB est < 200ms sur les pages Server Components
```
