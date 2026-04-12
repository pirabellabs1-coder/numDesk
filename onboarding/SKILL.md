---
name: onboarding
description: >
  Utiliser ce skill quand un nouveau développeur ou agent IA rejoint le projet,
  quand l'utilisateur dit "explique le projet", "comment démarrer", "setup",
  "install", "je reprends le projet", "nouvelle machine", "clone et lance",
  ou au tout début d'une session sur une machine fraîche. Ce skill fournit
  tout ce qu'il faut pour être opérationnel en moins de 30 minutes.
---

# Skill — Onboarding Vocalia

## Pour un développeur humain

### Prérequis

```bash
node --version   # >= 20.x
npm --version    # >= 10.x
psql --version   # PostgreSQL >= 15
redis-cli ping   # Redis >= 7
```

### Installation en 5 étapes

```bash
# 1. Cloner le repo
git clone https://github.com/[org]/vocalia.git
cd vocalia

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir .env.local avec les valeurs réelles (voir section Variables ci-dessous)

# 4. Initialiser la base de données
npx drizzle-kit migrate

# 5. Démarrer en développement
npm run dev
# → http://localhost:3000
```

### Variables d'environnement requises

```bash
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/vocalia

# Redis
REDIS_URL=redis://localhost:6379

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Vapi (côté serveur UNIQUEMENT)
VAPI_API_KEY=...
VAPI_WEBHOOK_SECRET=...

# Cartesia (côté serveur UNIQUEMENT)
CARTESIA_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudflare R2 (stockage fichiers)
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=vocalia-dev

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Commandes du projet

```bash
npm run dev          # Démarrer en développement
npm run build        # Build de production
npm run start        # Démarrer en production
npm run lint         # ESLint
npm run type-check   # Vérification TypeScript
npm run test         # Tests unitaires (Jest)
npm run test:e2e     # Tests Playwright
npm run db:migrate   # Appliquer les migrations DB
npm run db:studio    # Drizzle Studio (interface visuelle DB)
npm run db:seed      # Données de test
```

---

## Structure du projet

```
vocalia/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Pages d'authentification (login, register)
│   ├── (dashboard)/              # Pages authentifiées
│   │   ├── page.tsx              # Liste des workspaces
│   │   ├── workspace/
│   │   │   └── [id]/
│   │   │       ├── agents/       # Gestion des agents
│   │   │       ├── conversations/# Historique des appels
│   │   │       ├── campaigns/    # Campagnes d'appels
│   │   │       ├── knowledge/    # Bases de connaissances
│   │   │       ├── telephony/    # Numéros SIP
│   │   │       ├── api/          # Tokens & Webhooks
│   │   │       └── billing/      # Cycles de facturation
│   │   └── admin/                # Espace administrateur
│   └── api/                      # Routes API Next.js
│       ├── webhooks/             # Réception webhooks Vapi
│       └── [...]/                # Endpoints publics v1
├── components/
│   ├── ui/                       # Composants shadcn/ui (ne pas modifier)
│   ├── layout/                   # Sidebar, topbar, layout général
│   ├── workspace/                # Composants liés aux workspaces
│   ├── agents/                   # Composants éditeur d'agent
│   ├── conversations/            # Composants tableau conversations
│   └── shared/                   # Composants réutilisables
├── lib/
│   ├── vapi.ts                   # Client Vapi (serveur uniquement)
│   ├── stripe.ts                 # Client Stripe
│   ├── redis.ts                  # Client Redis
│   ├── cache.ts                  # Helpers de cache
│   └── utils.ts                  # Utilitaires généraux
├── server/
│   ├── services/                 # Logique métier (agentService, etc.)
│   ├── middleware/               # Auth, RBAC, rate limiting
│   └── routes/                   # Routes Fastify (API publique v1)
├── db/
│   ├── schema/                   # Schémas Drizzle
│   ├── migrations/               # Migrations SQL générées
│   └── index.ts                  # Instance db exportée
├── tests/
│   ├── unit/                     # Tests unitaires Jest
│   └── e2e/                      # Tests Playwright
├── CLAUDE.md                     # ← LIRE EN PREMIER
├── MEMORY.md                     # État du projet (session précédente)
├── PRD.md                        # Fonctionnalités et périmètre
└── ARCHITECTURE.md               # Architecture technique détaillée
```

---

## Pour un agent IA (Claude Code)

Quand Claude Code démarre sur ce projet, exécuter dans l'ordre :

### Étape 1 — Lire les fichiers fondamentaux

```
1. CLAUDE.md       → Règles absolues, stack, contraintes
2. MEMORY.md       → État de la dernière session, où on en est
3. PRD.md          → Ce qui doit être fait (MVP, V1, V2)
4. ARCHITECTURE.md → Structure technique de référence
```

### Étape 2 — Comprendre la phase en cours

Identifier dans PRD.md quelle phase est active :
- **MVP** : fonctionnalités fondamentales (auth, workspaces, agents basiques, conversations)
- **V1** : différenciation (tools, campagnes, KB, API publique)
- **V2** : scale (tests, analytics, blanc-label)

Ne jamais implémenter des fonctionnalités d'une phase future sans validation.

### Étape 3 — Vérifier l'environnement

```bash
# Vérifier que le projet compile
npm run type-check

# Vérifier que la DB est accessible
npx drizzle-kit status

# Vérifier les tests
npm run test
```

### Étape 4 — Confirmer le contexte à l'utilisateur

Résumer en 5 lignes :
- Phase en cours
- Dernière tâche complétée (depuis MEMORY.md)
- Tâche en cours si applicable
- Prochaine étape suggérée
- Prêt à commencer

---

## Conventions de code Vocalia

### Nommage

```typescript
// Fichiers : kebab-case
agent-service.ts
workspace-card.tsx
use-agents.ts

// Composants React : PascalCase
AgentCard, WorkspaceList, ConversationTable

// Fonctions et variables : camelCase
createAgent(), workspaceId, isPublished

// Types et interfaces : PascalCase
type Agent = ...
interface CreateAgentInput = ...

// Constantes : SCREAMING_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3
const VAPI_WEBHOOK_ENDPOINT = '/api/webhooks/vapi'

// Enums : PascalCase avec valeurs snake_case (comme la DB)
enum CallStatus { Ended = 'ended', Interrupted = 'interrupted' }
```

### Structure d'un composant

```typescript
// Ordre dans un fichier composant :
// 1. Imports (externes → internes → relatifs)
// 2. Types/interfaces locaux
// 3. Constantes locales
// 4. Composant principal
// 5. Sous-composants (si petits)
// 6. Export

'use client'  // Si nécessaire, toujours en premier

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { agentService } from '@/lib/agent-service'

interface AgentCardProps {
  agent: Agent
  onDelete: (id: string) => void
}

export function AgentCard({ agent, onDelete }: AgentCardProps) {
  // ...
}
```

---

## Données de test (seed)

```bash
# Créer des données de test réalistes
npm run db:seed

# Crée :
# - 1 compte admin (admin@vocalia.test / password)
# - 2 comptes membres (membre1@vocalia.test, membre2@vocalia.test)
# - 3 workspaces avec agents et conversations
# - Données de facturation des 3 derniers mois
```

---

## Ressources clés

| Ressource | URL |
|---|---|
| Vapi Documentation | https://docs.vapi.ai |
| Cartesia API | https://docs.cartesia.ai |
| Drizzle ORM | https://orm.drizzle.team |
| shadcn/ui | https://ui.shadcn.com |
| Fastify | https://fastify.dev |
| Playwright | https://playwright.dev |
| Stripe | https://stripe.com/docs |

**Rappel Context7 :** Pour toute question sur ces librairies,
utiliser Context7 automatiquement pour obtenir la doc à jour.
