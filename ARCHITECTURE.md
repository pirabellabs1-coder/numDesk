# Vocalia — Architecture Technique

> Plateforme SaaS B2B d'appels IA pour le marché français
> Avril 2026

---

## Stack retenue

| Couche | Technologie | Rôle |
|--------|-------------|------|
| Frontend | Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui | Interface SaaS dark premium |
| Backend CRUD | Next.js Route Handlers (même repo) | API REST, partage de types |
| Backend Worker | Fastify + BullMQ (process séparé) | Webhooks Vapi, campagnes, jobs longue durée |
| Base de données | Supabase (PostgreSQL 15) | DB + Auth + Storage + Realtime + RLS |
| ORM | Drizzle ORM | Schéma typé, JSONB natif, edge-compatible |
| Auth | Supabase Auth | Inclus, RLS natif, pages 100% custom |
| Orchestrateur vocal | Vapi.ai | STT + LLM + TTS + téléphonie en un appel API |
| TTS | Cartesia (défaut) + ElevenLabs (premium) | Voix FR naturelles, latence 150ms |
| LLM conversation | Gemini 2.5 Flash (défaut) + GPT-4o-mini (fallback) | Latence + coût + qualité FR |
| Téléphonie | Telnyx (principal) + Twilio (fallback) | Numéros FR +33, SIP, intégration Vapi native |
| Cache & Queues | Redis (Railway) + BullMQ | Campagnes, rate limiting, concurrency |
| Stockage fichiers | Supabase Storage | KB files, RLS par workspace |
| Paiement | Stripe | Abonnements + metered billing (minutes) |
| Emails | Resend + React Email | Templates TSX, transactionnel |
| Monitoring | Sentry + PostHog + Better Stack | Errors, analytics produit, uptime |
| Déploiement | Vercel (frontend) + Railway (worker + Redis) | EU, ~$55/mois au lancement |
| Real-time | Supabase Realtime | Suivi campagnes, statut appels |

---

## Architecture monorepo

```
vocalia/
├── apps/
│   ├── web/                        # Next.js 15 — frontend + API CRUD
│   │   ├── app/
│   │   │   ├── (auth)/             # Login, register, forgot-password
│   │   │   ├── (dashboard)/        # Espace membre (workspaces, agents, etc.)
│   │   │   ├── (admin)/            # Dashboard admin global
│   │   │   └── api/                # Route handlers CRUD
│   │   ├── components/             # Composants UI (shadcn)
│   │   ├── lib/                    # Supabase client, helpers
│   │   └── middleware.ts           # Auth guard, redirect
│   │
│   └── worker/                     # Fastify — webhooks + jobs
│       ├── src/
│       │   ├── webhooks/           # POST /webhooks/vapi
│       │   ├── jobs/               # BullMQ processors (campaigns, billing)
│       │   ├── services/           # Vapi SDK, Stripe sync
│       │   └── server.ts           # Entrypoint Fastify
│       └── Dockerfile              # Déploiement Railway
│
├── packages/
│   ├── db/                         # Drizzle schema + migrations
│   │   ├── schema/                 # Définitions de tables typées
│   │   ├── migrations/             # SQL généré par drizzle-kit
│   │   ├── drizzle.config.ts
│   │   └── index.ts                # Export client + types
│   │
│   ├── shared/                     # Code partagé web ↔ worker
│   │   ├── types/                  # Types métier
│   │   ├── validators/             # Schémas Zod
│   │   └── constants.ts            # Enums, config, error codes
│   │
│   └── emails/                     # Templates React Email
│       └── templates/              # Welcome, alert, invoice, etc.
│
├── supabase/                       # Config Supabase locale
│   ├── migrations/                 # RLS policies, fonctions SQL
│   └── config.toml
│
├── turbo.json                      # Turborepo
├── package.json                    # Workspace root (pnpm)
├── tsconfig.base.json              # Config TS partagée
└── .env.example
```

**Gestionnaire de paquets** : pnpm (workspaces natifs, symlinks, vitesse)

**Build system** : Turborepo (cache local, parallélisation des builds)

---

## Choix et justifications

### Frontend — Next.js 15 + shadcn/ui

- **App Router** avec React Server Components pour les dashboards lourds (listes d'appels, analytics)
- **shadcn/ui** : composants Radix + Tailwind, parfaitement adaptés au thème dark premium, entièrement personnalisables (pas de CSS vendor à overrider)
- **Server Actions** pour les mutations simples (CRUD agents, workspaces)
- Le design system dark est central à l'identité Vocalia face à Dipler

### Backend hybride — Next.js API + Fastify worker

Le CRUD classique (agents, workspaces, KB, tokens) reste dans les Route Handlers Next.js pour :
- Partage direct des types Drizzle et Zod entre frontend et API
- Déploiement simplifié (un seul service Vercel)
- Colocation du code UI et API

Le worker Fastify séparé gère ce que le serverless ne peut pas faire :
- **Webhooks Vapi** : `call.started`, `call.ended`, etc. — haute fréquence, processing immédiat
- **Campagnes BullMQ** : orchestration de dizaines/centaines d'appels avec rate limiting, retry, plages horaires
- **Billing sync** : décompte des minutes, synchronisation Stripe, alertes de dépassement
- **Long-running** : process persistant sur Railway, pas de timeout 60s

### Base de données — Supabase

Supabase remplace 4 services séparés à lui seul :

| Besoin | Sans Supabase | Avec Supabase |
|--------|---------------|---------------|
| Auth | Clerk ($25/mois) | Inclus |
| Stockage fichiers KB | S3 / R2 | Supabase Storage (inclus) |
| Real-time campagnes | Pusher / Ably | Supabase Realtime (inclus) |
| Multi-tenant isolation | Code applicatif | Row Level Security natif |

**RLS (Row Level Security)** : chaque requête est filtrée au niveau PostgreSQL par `auth.uid()`. Un membre ne peut jamais accéder aux données d'un autre membre, même en cas de bug applicatif.

**pgvector** : extension activée pour le mode RAG des knowledge bases (recherche vectorielle).

**Région** : Frankfurt (eu-central) pour conformité RGPD.

### ORM — Drizzle

- Typage SQL-first : les types TypeScript sont inférés directement du schéma, pas générés par un CLI externe
- JSONB typé nativement (critique pour `transcript`, `parameters`, `contacts`, `files`)
- Pas de query engine binaire (contrairement à Prisma) : bundle léger, compatible edge et Node.js
- `drizzle-kit push` pour le prototypage, `drizzle-kit generate` pour les migrations de production

### Orchestrateur vocal — Vapi.ai

Vapi intègre toute la chaîne vocale en un seul appel API :
```
Appel entrant → STT (transcription) → LLM (réponse) → TTS (synthèse vocale) → Retour audio
```

- Supporte Cartesia (meilleure voix FR), ElevenLabs, et les principaux LLMs
- Tool calling compatible OpenAI function calling schema
- Webhooks structurés (`call.started`, `call.ended`, `tool-calls`, etc.)
- Campaign API pour les appels sortants en batch
- Knowledge Base intégrée (RAG)

Le PRD est architecturé autour de Vapi (`vapi_agent_id`, `vapi_call_id`, `vapi_kb_id`).

**Stratégie V2** : migration progressive vers un orchestrateur custom (Twilio + Deepgram + Cartesia) pour réduire les coûts et la latence sur les comptes premium.

### Paiement — Stripe

Modèle de facturation Vocalia :
1. **Abonnement de base** : X minutes incluses/mois
2. **Dépassement** : facturé à la minute au-delà du quota
3. **Crédits top-up** : achat de minutes supplémentaires

Stripe est le seul à supporter nativement le **metered billing** via `subscriptionItems.createUsageRecord()`. Le worker enregistre la consommation minute par minute, Stripe génère la facture automatiquement en fin de cycle.

### Queues — Redis + BullMQ

Les campagnes d'appels nécessitent :
- **Rate limiting** : respecter les plages horaires (ex: 09h-18h)
- **Concurrency control** : pas plus de N appels simultanés par workspace
- **Retry avec backoff** : rappeler les numéros en échec après un délai
- **Priority queues** : campagnes urgentes passent devant
- **Progression** : pourcentage de complétion visible en temps réel via BullBoard

Redis hébergé sur Railway ($5/mois), même infrastructure que le worker.

---

## Flux principaux

### Appel entrant

```
Appelant → Numéro Telnyx (+33...)
  → SIP trunk redirige vers Vapi (webhook configuré)
  → Vapi charge l'agent (prompt + voix Cartesia + outils)
  → Boucle conversation : STT → Gemini 2.5 Flash → TTS Cartesia (< 800ms)
  → Tool calls optionnels → API Vocalia en temps réel
  → Fin d'appel → webhook POST /webhooks/vapi/call-ended
  → Worker : persiste conversation, décompte minutes, déclenche webhooks client
```

### Campagne d'appels sortants

```
Membre crée une campagne (contacts CSV + agent + plage horaire)
  → API Next.js crée la campagne en DB (status: draft)
  → Membre lance la campagne → API enqueue dans BullMQ
  → Worker BullMQ :
    ├── Vérifie la plage horaire
    ├── Rate-limit le nombre d'appels simultanés
    ├── Pour chaque contact : POST Vapi createCall
    ├── Réceptionne les webhooks de fin d'appel
    ├── Met à jour la progression en DB (Supabase Realtime push)
    └── Retry les échecs avec backoff exponentiel
  → Campagne terminée → webhook campaign.completed → email rapport
```

### Auth + multi-tenant

```
Membre se connecte (email + mot de passe)
  → Supabase Auth retourne un JWT avec auth.uid()
  → Middleware Next.js vérifie le JWT, injecte la session
  → Chaque requête DB passe par RLS :
    WHERE workspace.user_id = auth.uid()
  → Isolation totale entre membres au niveau PostgreSQL
```

---

## Déploiement

| Service | Plateforme | Région | Coût estimé |
|---------|------------|--------|-------------|
| apps/web | Vercel Pro | EU (Frankfurt) | $20/mois |
| apps/worker | Railway | EU (eu-west) | $5-15/mois |
| Redis | Railway | EU (eu-west) | $5/mois |
| PostgreSQL + Auth + Storage + Realtime | Supabase Pro | EU (Frankfurt) | $25/mois |
| **Total fixe** | | | **~$55-65/mois** |

Les coûts variables (Vapi, Telnyx, Gemini, Stripe fees) sont refacturés aux clients avec marge.

### Scaling

- **Vercel** : auto-scale serverless, CDN global, preview deployments par PR
- **Railway** : scaling horizontal du worker (replicas), scaling vertical Redis
- **Supabase** : connection pooling via Supavisor, compute scalable, read replicas en Pro

---

## Sécurité & RGPD

- **Multi-tenant** : RLS PostgreSQL (isolation au niveau DB, pas applicatif)
- **Tokens API** : stockés en SHA-256, préfixe `voc_` affiché, jamais en clair
- **Webhooks** : signature HMAC-SHA256 pour valider l'origine
- **SIP credentials** : chiffrés AES-256 au repos
- **Rate limiting** : 100 req/min par token API (middleware Fastify)
- **RGPD** :
  - Résidence des données : EU (Frankfurt)
  - Enregistrements audio désactivables par workspace
  - Rétention configurable (défaut 90 jours)
  - Export et suppression sur demande
  - Numéros pseudonymisés dans les logs

---

## Variables d'environnement

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# Vapi
VAPI_API_KEY=
VAPI_WEBHOOK_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Telnyx
TELNYX_API_KEY=
TELNYX_WEBHOOK_SECRET=

# LLM (pour tool calls custom en V2)
GEMINI_API_KEY=
OPENAI_API_KEY=

# TTS (pour preview voix)
CARTESIA_API_KEY=
ELEVENLABS_API_KEY=

# Resend
RESEND_API_KEY=

# Redis (worker)
REDIS_URL=

# Sentry
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

---

## Design System — "The Sonic Architect"

Direction artistique : **Organic Brutalism** — l'esthétique d'un studio d'enregistrement haut de gamme croisé avec un cockpit aérospatial. Typographie éditoriale bold (Syne) + profondeur atmosphérique (glassmorphism, glows).

### Palette de couleurs

Fond basé sur le noir profond `#0A0B0F`, la lumière est traitée comme une émission, pas un remplissage.

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0A0B0F` | Fond global |
| `surface` | `#121317` | Sidebar, topbar, base des zones |
| `surface-container-lowest` | `#0D0E12` | Zones en creux (inputs focus, wells) |
| `surface-container-low` | `#1A1B20` | Item actif sidebar, sections subtiles |
| `surface-container` | `#1F1F24` | Conteneurs moyens |
| `surface-container-high` | `#292A2E` | Éléments interactifs en relief |
| `surface-container-highest` | `#343439` | Relief maximum |
| `primary` | `#4F7FFF` | Bleu électrique — actions, focus, liens actifs |
| `secondary` | `#7B5CFA` | Violet — intelligence IA, insights automatisés |
| `tertiary` | `#00D4AA` | Émeraude — états live, succès, indicateurs positifs |
| `on-surface` | `#E3E2E8` | Texte principal (jamais `#FFFFFF` pur) |
| `on-surface-variant` | `#C3C6D7` | Texte secondaire, labels, metadata |
| `outline-variant` | `#434654` | Bordures fantômes (10% opacity max) |
| `error` | `#FFB4AB` | Erreurs, alertes critiques |

### Règle "No-Line"

Pas de bordures `1px solid` pour séparer les zones. La séparation structurelle se fait **uniquement par changement de couleur de fond**. Exception : `border border-white/5` sur les cartes pour une subtile "ghost border".

### Glassmorphism

Éléments flottants (modals, popovers, topbar) :
```css
background: rgba(41, 42, 46, 0.7);  /* surface-container-high @ 70% */
backdrop-filter: blur(12px);
```

### Grain texture

Overlay de grain à 2% d'opacité sur le fond global pour éliminer le banding et ajouter une qualité tactile filmique.

### Typographie

| Rôle | Font | Taille | Poids | Usage |
|------|------|--------|-------|-------|
| Display LG | Syne | 3.5rem | Bold | Hero, métriques clés |
| Headline MD | Syne | 1.75rem | Semi-Bold | Titres de section |
| Title SM | DM Sans | 1.0rem | Medium | Sous-titres |
| Body MD | Manrope | 0.875rem | Regular | Corps de texte, transcripts |
| Label SM | Manrope | 0.6875rem | Bold, ALL CAPS | Metadata, tags, tracking +5% |

Polices : **Syne** (titres, display) + **Manrope** (body, labels) + **Space Grotesk** (navigation sidebar, code)

### Composants clés

**Boutons primaires** : gradient `from-primary to-secondary` (bleu→violet), radius 8px, pas de bordure. Hover : saturation accrue + glow 10px à 20% d'opacité.

**Inputs** : fond `surface-container-lowest`, pas de bordure, stroke bottom 1px `primary` au focus uniquement. Radius 8px.

**Cartes** : fond `#0F1117`, radius 12-16px, border `white/5`. Pas de dividers internes — séparation par whitespace 16-24px ou changement de fond.

**Sidebar** : largeur fixe 240px, fond `surface` (#121317). Item actif : texte `primary`, fond `surface-container-low`, radius 8px.

**Topbar** : fixe, fond `surface/70%` + `backdrop-blur-xl` + `border-b border-white/10`.

**Status badges** : fond couleur/10 + texte couleur, text 10px bold uppercase tracking-wider.
- Succès : `bg-tertiary/10 text-tertiary`
- En cours : `bg-primary/10 text-primary`
- Erreur : `bg-error/10 text-error`
- Neutre : `bg-white/5 text-on-surface-variant`

**Pulse indicator (Live)** : point `tertiary` (#00D4AA) avec anneaux concentriques animés (ping).

**Waveform** : barres verticales arrondies de hauteurs variables, gradient `primary → secondary → tertiary`.

### Pages identifiées (maquettes)

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | Landing page | `/` | Page d'accueil marketing avec pricing |
| 2 | Tableau de bord | `/dashboard` | KPIs, conversations récentes, activité live |
| 3 | Mes Agents | `/agents` | Liste des agents en cartes (avatar, stats, toggle) |
| 4 | Éditeur d'agent | `/agents/[id]` | 6 onglets : Général, Vue, Instructions, Outils, Réglages + simulateur |
| 5 | Conversations | `/conversations` | Liste filtrée + panneau détail (transcript, audio, metadata) |
| 6 | Campagnes | `/campaigns` | KPIs, campagnes actives avec progression, action rapide |
| 7 | Base de connaissances | `/knowledge` | Upload fichiers, modes Full Context / RAG |
| 8 | Numéros (gestion) | `/phone-numbers` | Tableau numéros actifs/inactifs, agent assigné, SIP/Twilio |
| 9 | Numéros (config SIP) | `/phone-numbers/config` | Configuration Twilio/SIP trunks |
| 10 | API & Webhooks | `/api-webhooks` | Tokens API, config webhook, exemple cURL, métriques |
| 11 | Documentation API | `/docs` | Guide intégration, auth, first call, webhook events |
| 12 | Facturation & crédits | `/billing` | Solde minutes, recharge, historique factures, moyens de paiement |
| 13 | Paramètres workspace | `/settings` | Identité, logo, langue, clés API, onglets Profil/Facturation/Membres/Notifications |
| 14 | Dashboard admin | `/admin` | Modal allocation de minutes, gestion membres (overlay) |

---

## Conventions de développement

- **Langage** : TypeScript strict partout (`strict: true`, `noUncheckedIndexedAccess: true`)
- **Validation** : Zod pour toutes les entrées (API, formulaires, webhooks) — schémas partagés dans `packages/shared`
- **Formatage** : Biome (lint + format, plus rapide qu'ESLint + Prettier)
- **Tests** : Vitest (unit + intégration), Playwright (E2E)
- **Commits** : Conventional Commits (`feat:`, `fix:`, `chore:`)
- **CI** : GitHub Actions (typecheck, lint, test, build)
- **Preview** : Vercel preview deployments par PR
