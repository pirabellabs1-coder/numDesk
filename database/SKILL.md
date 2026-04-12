---
name: database
description: >
  Utiliser ce skill pour tout ce qui touche à la base de données PostgreSQL
  de Vocalia : créer ou modifier des tables, écrire des requêtes Drizzle ORM,
  générer des migrations, optimiser des requêtes lentes, concevoir des relations.
  Déclencher quand l'utilisateur dit "crée la table X", "ajoute la colonne Y",
  "requête pour Z", "migration", "schéma", "drizzle", "SQL".
---

# Skill — Base de Données Vocalia (PostgreSQL + Drizzle ORM)

## Stack base de données

- **PostgreSQL** — base de données principale
- **Drizzle ORM** — ORM TypeScript, typage strict, migrations SQL
- **Redis** — cache des sessions actives + queues Bull (campagnes)

---

## Schéma Drizzle complet Vocalia

### Setup et configuration

```typescript
// db/schema/index.ts — exports centralisés
export * from './users'
export * from './workspaces'
export * from './agents'
export * from './conversations'
export * from './tools'
export * from './phone-numbers'
export * from './campaigns'
export * from './knowledge-bases'
export * from './billing-cycles'
export * from './api-tokens'
export * from './webhooks'
export * from './sip-trunks'
```

```typescript
// db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool, { schema })
export type DB = typeof db
```

### Table users

```typescript
// db/schema/users.ts
import { pgTable, uuid, varchar, pgEnum, timestamp } from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('user_role', ['admin', 'member'])

export const users = pgTable('users', {
  id:         uuid('id').primaryKey().defaultRandom(),
  email:      varchar('email', { length: 255 }).notNull().unique(),
  firstName:  varchar('first_name', { length: 100 }),
  lastName:   varchar('last_name', { length: 100 }),
  agencyName: varchar('agency_name', { length: 255 }),
  role:       roleEnum('role').default('member').notNull(),
  avatarUrl:  varchar('avatar_url', { length: 500 }),
  createdAt:  timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt:  timestamp('updated_at', { withTimezone: true }),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### Table workspaces

```typescript
// db/schema/workspaces.ts
import { pgTable, uuid, varchar, integer, date, pgEnum, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const offerTypeEnum = pgEnum('offer_type', ['minutes', 'calls'])

export const workspaces = pgTable('workspaces', {
  id:                   uuid('id').primaryKey().defaultRandom(),
  userId:               uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name:                 varchar('name', { length: 255 }).notNull(),
  offerType:            offerTypeEnum('offer_type').default('minutes').notNull(),
  minutesIncluded:      integer('minutes_included').notNull().default(400),
  minutesUsed:          integer('minutes_used').notNull().default(0),
  minutesOverageLimit:  integer('minutes_overage_limit').notNull().default(400),
  overageRateCents:     integer('overage_rate_cents').notNull().default(42),
  cycleStartDate:       date('cycle_start_date').notNull(),
  cycleDurationDays:    integer('cycle_duration_days').notNull().default(30),
  vapiWorkspaceId:      varchar('vapi_workspace_id', { length: 255 }),
  createdAt:            timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Workspace = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert
```

### Table agents

```typescript
// db/schema/agents.ts
import { pgTable, uuid, varchar, text, boolean, decimal,
         integer, timestamp, pgEnum } from 'drizzle-orm/pg-core'
import { workspaces } from './workspaces'

export const voiceProviderEnum = pgEnum('voice_provider', ['cartesia', 'elevenlabs', 'deepgram'])

export const agents = pgTable('agents', {
  id:                 uuid('id').primaryKey().defaultRandom(),
  workspaceId:        uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name:               varchar('name', { length: 255 }).notNull(),
  vapiAgentId:        varchar('vapi_agent_id', { length: 255 }),
  prompt:             text('prompt'),
  firstMessage:       text('first_message'),
  language:           varchar('language', { length: 10 }).default('fr-FR').notNull(),
  voiceProvider:      voiceProviderEnum('voice_provider').default('cartesia').notNull(),
  voiceId:            varchar('voice_id', { length: 255 }),
  llmModel:           varchar('llm_model', { length: 100 }).default('gemini-2.5-flash').notNull(),
  temperature:        decimal('temperature', { precision: 3, scale: 2 }).default('0.4').notNull(),
  topP:               decimal('top_p', { precision: 3, scale: 2 }).default('1.0').notNull(),
  silenceTimeoutSec:  integer('silence_timeout_sec').default(7).notNull(),
  maxSilenceRetries:  integer('max_silence_retries').default(2).notNull(),
  silencePrompt:      text('silence_prompt'),
  voicemailEnabled:   boolean('voicemail_enabled').default(false).notNull(),
  voicemailMessage:   text('voicemail_message'),
  recordSession:      boolean('record_session').default(true).notNull(),
  recordAudio:        boolean('record_audio').default(true).notNull(),
  isPublished:        boolean('is_published').default(false).notNull(),
  publishedAt:        timestamp('published_at', { withTimezone: true }),
  createdAt:          timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export type Agent = typeof agents.$inferSelect
export type NewAgent = typeof agents.$inferInsert
```

### Table conversations

```typescript
// db/schema/conversations.ts
import { pgTable, uuid, varchar, integer, boolean, text,
         jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const callDirectionEnum = pgEnum('call_direction', ['inbound', 'outbound'])
export const callStatusEnum = pgEnum('call_status', ['ended', 'interrupted', 'voicemail', 'no_answer', 'unknown'])
export const sentimentEnum = pgEnum('sentiment', ['positive', 'neutral', 'negative'])
export const callTypeEnum = pgEnum('call_type', ['phone', 'web'])

export const conversations = pgTable('conversations', {
  id:              uuid('id').primaryKey().defaultRandom(),
  workspaceId:     uuid('workspace_id').notNull(),
  agentId:         uuid('agent_id'),
  vapiCallId:      varchar('vapi_call_id', { length: 255 }).unique(),
  type:            callTypeEnum('type').default('phone').notNull(),
  direction:       callDirectionEnum('direction').notNull(),
  callerNumber:    varchar('caller_number', { length: 50 }),
  phoneNumberId:   uuid('phone_number_id'),
  status:          callStatusEnum('status').default('unknown').notNull(),
  sentiment:       sentimentEnum('sentiment'),
  durationSeconds: integer('duration_seconds'),
  costCents:       integer('cost_cents'),
  isBilled:        boolean('is_billed').default(false).notNull(),
  transcript:      jsonb('transcript'),  // [{role, content, timestamp}]
  summary:         text('summary'),
  tags:            text('tags').array(),
  audioUrl:        text('audio_url'),
  startedAt:       timestamp('started_at', { withTimezone: true }),
  endedAt:         timestamp('ended_at', { withTimezone: true }),
})

export type Conversation = typeof conversations.$inferSelect
```

---

## Patterns de requêtes Drizzle

### Liste paginée avec recherche

```typescript
import { db } from '@/db'
import { agents } from '@/db/schema'
import { eq, and, ilike, desc, count } from 'drizzle-orm'

export async function listAgents(params: {
  workspaceId: string
  search?: string
  page?: number
  pageSize?: number
}) {
  const { workspaceId, search, page = 1, pageSize = 20 } = params
  const offset = (page - 1) * pageSize

  const where = and(
    eq(agents.workspaceId, workspaceId),
    search ? ilike(agents.name, `%${search}%`) : undefined,
  )

  const [items, [{ total }]] = await Promise.all([
    db.select().from(agents)
      .where(where)
      .orderBy(desc(agents.createdAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ total: count() }).from(agents).where(where),
  ])

  return { agents: items, total: Number(total) }
}
```

### Jointure workspace → agents → conversations

```typescript
export async function getWorkspaceStats(workspaceId: string) {
  return db
    .select({
      workspaceName: workspaces.name,
      agentName: agents.name,
      totalCalls: count(conversations.id),
      totalMinutes: sql<number>`COALESCE(SUM(${conversations.durationSeconds}) / 60, 0)`,
    })
    .from(workspaces)
    .leftJoin(agents, eq(agents.workspaceId, workspaces.id))
    .leftJoin(conversations, eq(conversations.agentId, agents.id))
    .where(eq(workspaces.id, workspaceId))
    .groupBy(workspaces.name, agents.name)
}
```

### Transaction (ex: créer workspace + initialiser cycle)

```typescript
export async function createWorkspaceWithCycle(data: NewWorkspace) {
  return db.transaction(async (tx) => {
    const [workspace] = await tx.insert(workspaces).values(data).returning()

    await tx.insert(billingCycles).values({
      workspaceId: workspace.id,
      cycleStart: data.cycleStartDate,
      cycleEnd: addDays(new Date(data.cycleStartDate), data.cycleDurationDays),
      minutesIncluded: data.minutesIncluded,
      minutesUsed: 0,
      status: 'open',
    })

    return workspace
  })
}
```

---

## Migrations Drizzle

```bash
# Générer une migration après modification du schéma
npx drizzle-kit generate

# Appliquer les migrations
npx drizzle-kit migrate

# Voir l'état des migrations
npx drizzle-kit status

# Studio visuel (dev uniquement)
npx drizzle-kit studio
```

### drizzle.config.ts

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './db/schema/index.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config
```

---

## Règles base de données Vocalia

1. **Toujours utiliser Drizzle** — jamais de SQL brut (`db.execute` interdit sauf cas exceptionnel documenté)
2. **UUIDs** pour tous les IDs primaires — jamais d'auto-increment
3. **Soft delete** — ajouter `deletedAt` plutôt que supprimer physiquement les conversations et agents
4. **Indexes** — créer un index sur toute FK et tout champ fréquemment filtré
5. **Transactions** pour toute opération multi-tables
6. **Types inférés** — toujours utiliser `typeof table.$inferSelect` pour les types
7. **Migrations nommées** — `YYYY-MM-DD_description_courte.sql`

---

## Checklist avant une migration

```
[ ] Le schéma Drizzle est modifié ET committé
[ ] La migration générée est relue (pas de DROP involontaire)
[ ] Les données existantes sont préservées (migration reversible ?)
[ ] Les index nécessaires sont ajoutés
[ ] Les types TypeScript exportés sont mis à jour
[ ] MEMORY.md est mis à jour avec la décision de schéma
```
