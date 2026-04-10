# Vocalia — Documentation Complète du Projet

> Plateforme d'appels IA pour le marché français
> Version 1.0 — Avril 2026

---

## Table des matières

1. [Vision & Positionnement](#1-vision--positionnement)
2. [Architecture Technique](#2-architecture-technique)
3. [Modèle de Données](#3-modèle-de-données)
4. [Fonctionnalités Détaillées](#4-fonctionnalités-détaillées)
5. [Espace Administrateur](#5-espace-administrateur)
6. [API REST](#6-api-rest)
7. [Sécurité & RGPD](#7-sécurité--rgpd)
8. [Périmètre par Phase](#8-périmètre-par-phase)
9. [Roadmap de Développement](#9-roadmap-de-développement)
10. [Identité & Branding](#10-identité--branding)

---

## 1. Vision & Positionnement

### 1.1 Résumé exécutif

Vocalia est une plateforme SaaS B2B dédiée aux agents d'appels téléphoniques propulsés par l'IA, conçue spécifiquement pour le marché francophone. Elle permet à des agences ou indépendants (membres) de gérer plusieurs clients (workspaces), chacun disposant de ses propres agents IA, numéros de téléphone, campagnes d'appels et bases de connaissances.

La proposition de valeur centrale est une expérience d'appel plus humaine : latence réduite, voix naturelles françaises (Cartesia, ElevenLabs), hésitations naturelles, et une interface de configuration simple et entièrement en français.

### 1.2 Objectifs clés

- Offrir une alternative francophone à Vapi avec une UX supérieure
- Permettre la gestion multi-clients (agence → N clients/workspaces)
- Réduire la latence perçue des cold bots à moins de 800ms
- Facturation à la minute avec plafonds configurables par workspace
- Intégrations SIP/Twilio et webhooks pour connexions CRM/ERP

### 1.3 Utilisateurs cibles

| Profil | Description | Cas d'usage principal |
|---|---|---|
| Agence IA | Revente de bots vocaux à leurs clients | Gestion multi-workspaces |
| Auto-école | Rappel automatisé des candidats | Campagnes outbound |
| Immobilier | Qualification leads entrants | Inbound avec CRM |
| E-commerce | Support client automatisé | Inbound 24h/24 |
| Indépendant | Propre service callbot | Workspace unique |

### 1.4 Différenciation vs Dipler (concurrent principal)

| Critère | Dipler | Vocalia |
|---|---|---|
| Marché cible | Français + agences | Même cible, meilleure UX |
| Design | Dark standard, dense | Dark premium, épuré |
| Voix | Cartesia fr-FR | Cartesia + ElevenLabs + preview |
| Latence | Standard Vapi | Optimisée < 800ms |
| Branding | Blanc-label limité | Blanc-label complet (V2) |
| API | Disponible | REST complète + webhooks étendus |
| Documentation | Externe | Intégrée à l'interface |

---

## 2. Architecture Technique

### 2.1 Stack technologique

| Couche | Technologies |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| Backend API | Node.js + Fastify (ou NestJS) + TypeScript |
| Base de données | PostgreSQL (principale) + Redis (cache & queues) |
| Auth | Clerk ou NextAuth.js + JWT + RBAC |
| Téléphonie | Vapi AI (orchestrateur) + SIP Trunk (Twilio, Zadarma, Telnyx) |
| Voix TTS | Cartesia (premium, fr-FR) + ElevenLabs (backup) |
| LLM | Gemini 2.5 Flash (défaut) + GPT-4o (option premium) |
| Stockage fichiers | AWS S3 ou Cloudflare R2 (bases de connaissances) |
| Emails transac. | Resend ou Postmark |
| Paiement | Stripe (abonnements + crédits à la demande) |
| Monitoring | Sentry + PostHog + Grafana |
| Déploiement | Railway ou Fly.io (backend) + Vercel (frontend) |

### 2.2 Flux d'un appel entrant

```
Appelant
  → compose le numéro SIP/Twilio assigné à un agent
  → Trunk SIP redirige vers Vapi via webhook configuré
  → Vapi instancie l'agent (prompt + voix + outils)
  → Conversation : STT → LLM → TTS en < 800ms
  → Tool calls → API Vocalia en temps réel
  → Fin d'appel → webhook end-of-call → Vocalia
  → Vocalia persiste la conversation + décompte les minutes
```

### 2.3 Flux d'un appel sortant (campagne)

```
Utilisateur crée une campagne (liste de contacts)
  → Vocalia planifie les appels via queue Redis (Bull)
  → Pour chaque contact : appel API Vapi createCall
  → Gestion répondeur (messagerie vocale) si activée
  → Résultats (statut, durée, tags) stockés en base
```

---

## 3. Modèle de Données

### 3.1 Table : `users`

```sql
id            UUID PRIMARY KEY
email         VARCHAR(255) UNIQUE NOT NULL
first_name    VARCHAR(100)
last_name     VARCHAR(100)
agency_name   VARCHAR(255)           -- Nom de l'agence
role          ENUM(admin, member)    DEFAULT member
avatar_url    TEXT
created_at    TIMESTAMPTZ            DEFAULT NOW()
updated_at    TIMESTAMPTZ
```

### 3.2 Table : `workspaces`

```sql
id                      UUID PRIMARY KEY
user_id                 UUID FK → users.id
name                    VARCHAR(255)           -- Nom du client/projet
offer_type              ENUM(minutes, calls)   DEFAULT minutes
minutes_included        INTEGER                -- Minutes incluses dans le cycle
minutes_used            INTEGER                DEFAULT 0
minutes_overage_limit   INTEGER                -- Plafond de dépassement autorisé
overage_rate_cents      INTEGER                -- Tarif dépassement (centimes/min)
cycle_start_date        DATE                   -- Date début du cycle en cours
cycle_duration_days     INTEGER                DEFAULT 30
vapi_workspace_id       VARCHAR(255)           -- ID Vapi correspondant
created_at              TIMESTAMPTZ            DEFAULT NOW()
```

### 3.3 Table : `agents`

```sql
id                    UUID PRIMARY KEY
workspace_id          UUID FK → workspaces.id
name                  VARCHAR(255)
vapi_agent_id         VARCHAR(255)           -- ID de l'agent chez Vapi
prompt                TEXT                   -- Prompt système complet
first_message         TEXT                   -- Phrase d'accueil
language              VARCHAR(10)            DEFAULT 'fr-FR'
voice_provider        ENUM(cartesia, elevenlabs, deepgram)
voice_id              VARCHAR(255)
llm_model             VARCHAR(100)           DEFAULT 'gemini-2.5-flash'
temperature           DECIMAL(3,2)           DEFAULT 0.4
top_p                 DECIMAL(3,2)           DEFAULT 1.0
silence_timeout_sec   INTEGER                DEFAULT 7
max_silence_retries   INTEGER                DEFAULT 2
silence_prompt        TEXT
voicemail_enabled     BOOLEAN                DEFAULT false
voicemail_message     TEXT
record_session        BOOLEAN                DEFAULT true
record_audio          BOOLEAN                DEFAULT true
is_published          BOOLEAN                DEFAULT false
published_at          TIMESTAMPTZ
created_at            TIMESTAMPTZ            DEFAULT NOW()
```

### 3.4 Table : `conversations`

```sql
id                UUID PRIMARY KEY
workspace_id      UUID FK → workspaces.id
agent_id          UUID FK → agents.id
vapi_call_id      VARCHAR(255) UNIQUE
type              ENUM(phone, web)
direction         ENUM(inbound, outbound)
caller_number     VARCHAR(50)
phone_number_id   UUID FK → phone_numbers.id
status            ENUM(ended, interrupted, voicemail, no_answer, unknown)
sentiment         ENUM(positive, neutral, negative)
duration_seconds  INTEGER
cost_cents        INTEGER
is_billed         BOOLEAN                DEFAULT false
transcript        JSONB                  -- [{role, content, timestamp}]
summary           TEXT
tags              TEXT[]
audio_url         TEXT
started_at        TIMESTAMPTZ
ended_at          TIMESTAMPTZ
```

### 3.5 Table : `tools`

```sql
id            UUID PRIMARY KEY
workspace_id  UUID FK → workspaces.id
name          VARCHAR(100)     -- Identifiant technique (snake_case)
display_name  VARCHAR(255)
description   TEXT             -- Description pour le LLM
method        ENUM(GET, POST, PUT, PATCH, DELETE)
url           TEXT
headers       JSONB
parameters    JSONB            -- Schéma JSON Schema des paramètres
timeout_ms    INTEGER          DEFAULT 5000
created_at    TIMESTAMPTZ      DEFAULT NOW()
```

### 3.6 Table : `phone_numbers`

```sql
id             UUID PRIMARY KEY
workspace_id   UUID FK → workspaces.id
number         VARCHAR(50)      -- Format E.164 ex: +33612345678
provider       ENUM(sip_trunk, twilio)
sip_trunk_id   UUID FK → sip_trunks.id
twilio_sid     VARCHAR(100)
friendly_name  VARCHAR(255)
country_code   VARCHAR(5)
is_active      BOOLEAN          DEFAULT true
created_at     TIMESTAMPTZ      DEFAULT NOW()
```

### 3.7 Table : `campaigns`

```sql
id                    UUID PRIMARY KEY
workspace_id          UUID FK → workspaces.id
agent_id              UUID FK → agents.id
phone_number_id       UUID FK → phone_numbers.id
name                  VARCHAR(255)
status                ENUM(draft, active, paused, completed, failed)
contacts              JSONB       -- [{name, phone, variables}]
total_contacts        INTEGER
called_count          INTEGER     DEFAULT 0
success_count         INTEGER     DEFAULT 0
scheduled_at          TIMESTAMPTZ
call_window_start     TIME
call_window_end       TIME
max_retries           INTEGER     DEFAULT 2
retry_delay_minutes   INTEGER     DEFAULT 60
created_at            TIMESTAMPTZ DEFAULT NOW()
```

### 3.8 Table : `knowledge_bases`

```sql
id            UUID PRIMARY KEY
workspace_id  UUID FK → workspaces.id
name          VARCHAR(255)
mode          ENUM(full_context, rag)
vapi_kb_id    VARCHAR(255)
files         JSONB        -- [{name, url, size, type}]
created_at    TIMESTAMPTZ  DEFAULT NOW()
```

### 3.9 Table : `billing_cycles`

```sql
id                    UUID PRIMARY KEY
workspace_id          UUID FK → workspaces.id
cycle_start           DATE
cycle_end             DATE
minutes_included      INTEGER
minutes_used          INTEGER
minutes_overage       INTEGER
amount_base_cents     INTEGER
amount_overage_cents  INTEGER
amount_total_cents    INTEGER
stripe_invoice_id     VARCHAR(100)
status                ENUM(open, finalized, paid, void)
created_at            TIMESTAMPTZ DEFAULT NOW()
```

### 3.10 Table : `api_tokens`

```sql
id            UUID PRIMARY KEY
workspace_id  UUID FK → workspaces.id
name          VARCHAR(255)     -- Label du token
token_hash    VARCHAR(255)     -- SHA-256 (jamais stocké en clair)
token_prefix  VARCHAR(10)      -- voc_xxxx (affiché uniquement)
last_used_at  TIMESTAMPTZ
expires_at    TIMESTAMPTZ
created_at    TIMESTAMPTZ      DEFAULT NOW()
```

### 3.11 Table : `webhooks`

```sql
id                  UUID PRIMARY KEY
workspace_id        UUID FK → workspaces.id
url                 TEXT
events              TEXT[]   -- [call.started, call.ended, campaign.completed]
secret              VARCHAR(255)  -- HMAC secret
is_active           BOOLEAN       DEFAULT true
last_triggered_at   TIMESTAMPTZ
created_at          TIMESTAMPTZ   DEFAULT NOW()
```

### 3.12 Table : `sip_trunks`

```sql
id          UUID PRIMARY KEY
user_id     UUID FK → users.id   -- Propriétaire (admin ou membre)
name        VARCHAR(255)
host        VARCHAR(255)
port        INTEGER               DEFAULT 5060
username    VARCHAR(255)
password    VARCHAR(255)          -- Chiffré AES-256
is_global   BOOLEAN               DEFAULT false  -- Trunk admin partagé
created_at  TIMESTAMPTZ           DEFAULT NOW()
```

---

## 4. Fonctionnalités Détaillées

### 4.1 Page d'accueil — Liste des Workspaces

Vue principale après connexion. Affiche tous les workspaces (clients) de l'utilisateur sous forme de cartes.

**Chaque carte affiche :**
- Nom du client + badge type d'offre (Minutes)
- Date de renouvellement du cycle
- Minutes utilisées / incluses avec barre de progression visuelle
- Dépassement possible (plafond + tarif/min)
- Icône raccourci vers les cycles de facturation

**Fonctionnalités de la page :**
- Barre de recherche pour filtrer les workspaces
- Bouton `+ Nouveau Workspace`
- Renommage inline de chaque workspace (icône crayon)
- Compteur de crédits globaux de l'agence (haut droite)
- Accès aux SIP Trunks globaux depuis la topbar

### 4.2 Profil & Paramètres utilisateur

- Prénom, nom, email
- Nom de l'agence (affiché dans la topbar)
- Photo de profil
- Langue de l'interface
- Changement de mot de passe

### 4.3 Navigation dans un Workspace

Lorsqu'on entre dans un workspace, la sidebar affiche :

**Résumé du plan (en haut) :**
- Nom du workspace + nom de l'agence
- Offre + date de cycle
- Minutes utilisées / incluses + barre
- Info dépassement

**Navigation :**
- Agents
- Conversations
- Connaissances
- Campagnes
- Téléphonie
- API & Webhooks
- Doc Tool Calls
- Cycles de facturation
- Déconnexion

---

### 4.4 Agents IA

#### Liste des agents

- Tableau : Nom | Date de création | Actions
- Actions par agent : Tester (appel) | Dupliquer | Exporter | Supprimer
- Bouton `+ Nouvel Agent`
- Recherche par nom

#### Éditeur d'agent — Onglet `AGENT`

```
Informations de base
├── Nom de l'agent (champ texte)
├── Numéro de téléphone entrant (dropdown des numéros du workspace)
└── Prompt principal (textarea + compteur de tokens)

Messagerie vocale (appels outbound)
├── Toggle : laisser un message vocal
└── Message vocal personnalisé

Première phrase
├── Toggle : activer la première phrase
├── Prompt de génération de la phrase d'accueil
└── Délai avant première phrase en outbound (secondes)

Relancer après silence
├── Toggle : relancer après X secondes de silence
├── Délai de silence avant relance (secondes, défaut : 7)
├── Nombre de rappels max avant raccrochage (défaut : 2)
└── Prompt de génération de la phrase de silence

Bases de connaissances
├── Base de connaissance — Mode Full Context
└── Base de connaissance — Mode RAG (Tool Call)
```

#### Éditeur d'agent — Onglet `PAROLE`

```
Langue de démarrage
└── Code langue ISO (ex: fr-FR)

Voix par défaut
└── Sélecteur : Provider + Nom + Genre + Langue
    Exemples : Cartesia (premium) - Fabien - male - fr-FR

Bruit de fond
└── Son d'ambiance (sélecteur + bouton Choisir)

Règles d'override par langue
└── Bouton + Ajouter une règle d'override

Paramètres de parole
├── Toggle : hésitations naturelles (euh, ah, bien, alors)
└── Prononciation des nombres (française : Soixante-dix)
```

#### Éditeur d'agent — Onglet `OUTILS`

```
Internal Tools
└── Raccrochage (toggle on/off)

External Tools
├── Liste des outils créés (toggle actif/inactif | Supprimer | Déplier)
└── Bouton + Ajouter un outil

Configuration d'un outil externe
├── Nom technique (snake_case, ex: rappel_tool)
├── Nom d'affichage
├── Description LLM (ce que l'outil fait, quand l'utiliser)
├── Méthode HTTP (GET, POST, PUT, PATCH, DELETE)
├── URL endpoint
├── Headers personnalisés (clé/valeur)
└── Paramètres (JSON Schema)
    Chaque paramètre :
    ├── Nom
    ├── Type (string, number, boolean, enum)
    ├── Description (ex: "Nom de famille de la personne")
    └── Requis (boolean)
```

#### Éditeur d'agent — Onglet `RÉGLAGES`

```
Enregistrement
├── Toggle : enregistrer la session en base de données
└── Toggle : enregistrer l'audio

Modèles
├── Modèle LLM (Gemini 2.5 Flash, GPT-4o, Claude 3.5 Haiku...)
├── Top P (slider 0 → 1, défaut : 1)
└── Température (slider 0 → 2, défaut : 0.4)

Tags de conversation
├── Boutons Tout décocher / Tout cocher
├── Toggle : Pouvoir forcer de reprendre la parole (force)
└── Toggle : Pouvoir désactiver le timeout d'inactivité (pausing)
```

#### Éditeur d'agent — Onglet `ANALYSES`

- Nombre total d'appels
- Durée moyenne
- Taux de complétion
- Graphiques par jour / semaine / mois
- Distribution des statuts (Terminée, Interrompue, Rappeler moi, Voicemail...)

#### Éditeur d'agent — Onglet `TESTS`

- Déclencher un appel test vers un numéro réel
- Simulateur de conversation textuelle (chat)

#### Éditeur d'agent — Onglet `API`

```
Company ID     [valeur] [copier]
Workspace ID   [valeur] [copier]
Agent ID       [valeur] [copier]
Configuration actuelle (JSON) [lecture seule] [copier]
```

#### Topbar de l'éditeur d'agent

```
← [Nom de l'agent]       [SAUVEGARDER] [▶ ESSAYER] [🚀 PUBLIER] [+]
   Éditeur d'agent
   Production : Aucune version publiée
```

---

### 4.5 Conversations

#### Liste

| Colonne | Détail |
|---|---|
| Date | Date + heure |
| Type | Tél / Web |
| Sens | Entrant / Sortant |
| Call Status | Icône succès/échec |
| Agent | Nom de l'agent |
| Utilisateur | Numéro appelant |
| Conv. Status | Terminée / Interrompue / Rappeler moi / Pas commenté |
| Durée | ex: 1min 41s |
| Tags | Tags libres |
| Facturé | Oui / Non |
| Actions | Voir | Supprimer |

**Filtres disponibles :**
- Identifiant personne (numéro ou nom)
- Date : Today / Date précise / Mois
- Agent (dropdown)
- Sentiment (Positif / Neutre / Négatif)
- Statut d'appel

**Vue détail d'une conversation :**
- Transcript complet (format chat)
- Audio player intégré
- Résumé IA de l'appel
- Variables extraites par les outils
- Métadonnées (durée, coût, agent, numéro)

---

### 4.6 Base de Connaissances

- Liste des bases avec nom, mode, nombre de fichiers
- Création : nom + upload de fichiers (PDF, DOCX, TXT, CSV)
- **Mode Full Context** : tout le contenu injecté dans le prompt
- **Mode RAG** : recherche vectorielle, seuls les passages pertinents sont injectés
- Synchronisation automatique avec Vapi

---

### 4.7 Campagnes d'appels

**Liste des campagnes :**
- Nom | Agent | Statut | Progression | Date | Actions

**Statuts :** Draft | Active | En pause | Terminée | Échouée

**Création d'une campagne :**
- Nom
- Agent assigné
- Numéro de téléphone émetteur
- Liste de contacts (upload CSV ou saisie manuelle)
- Plage horaire d'appels (ex: 09h00 – 18h00)
- Nombre de tentatives max
- Délai entre tentatives (minutes)

**Suivi en temps réel :**
- Nb appelés / total
- Taux de succès
- Boutons Pause / Reprise / Arrêt

---

### 4.8 Téléphonie

**Onglet SIP Trunk Numbers :**
- Liste des numéros SIP du workspace
- Filtrer par numéro
- Bouton `+ Ajouter un numéro SIP`
- Chaque numéro : format E.164, trunk associé, nom

**Onglet Twilio (deprecated) :**
- Ancienne intégration maintenue pour rétrocompatibilité

---

### 4.9 API & Webhooks

#### Onglet API Tokens

- Créer un token avec un nom (label)
- Token affiché **une seule fois** à la création (format : `voc_xxxxxxxxxxxx`)
- Liste : nom | préfixe | dernière utilisation | date création | Révoquer
- Révocation individuelle

#### Onglet Token API Providers

- Saisir les clés API de providers tiers (ElevenLabs, OpenAI, etc.)
- Utilisées côté backend pour les appels aux services voix

#### Onglet Webhooks

- URL cible + sélection des événements déclencheurs
- **Événements disponibles :**
  - `call.started`
  - `call.ended`
  - `call.transferred`
  - `campaign.completed`
- Secret HMAC pour validation de signature
- Historique des derniers envois avec statut HTTP

---

### 4.10 Documentation Tool Calls

Section de documentation interactive générée automatiquement pour chaque outil créé dans le workspace. Explique la structure des appels que Vocalia envoie aux endpoints, avec exemples JSON de requête et réponse attendue.

---

### 4.11 Cycles de Facturation

- Historique des cycles par workspace
- Détail par cycle : minutes incluses | utilisées | dépassement | montant base | montant dépassement | total
- Lien vers facture Stripe
- Statuts : Ouvert | Finalisé | Payé | Annulé

---

## 5. Espace Administrateur

### 5.1 Dashboard global

- Total membres, total workspaces actifs, minutes consommées ce mois, revenus du mois
- Graphique des appels quotidiens (30 derniers jours)
- Top 5 des workspaces les plus actifs

### 5.2 Gestion des membres

- Liste de tous les membres
- Détail d'un membre : infos, workspaces, crédits restants
- **Ajouter des minutes manuellement** à un workspace
- Réinitialiser un cycle de facturation
- Suspendre / réactiver un compte
- Modifier le plan (offre) d'un workspace

### 5.3 Gestion des SIP Trunks globaux

- Configurer les trunks SIP disponibles pour la plateforme
- Credentials SIP (host, port, username, password — chiffrés)
- Les membres assignent leurs numéros à ces trunks

### 5.4 Gestion des offres & tarifs

- Créer et modifier les offres (minutes incluses, tarif dépassement)
- Définir les modèles de pricing par plan

### 5.5 Monitoring & Logs

- Logs d'appels en temps réel (toutes plateformes)
- Alertes : workspace proche du plafond, erreurs Vapi, webhooks en échec
- Métriques de latence moyenne par provider voix

---

## 6. API REST

### 6.1 Authentification

Toutes les requêtes API nécessitent un token Bearer :

```
Authorization: Bearer voc_xxxxxxxxxxxxxxxxxxxx
```

### 6.2 Format des réponses

**Succès :**
```json
{
  "data": { ... },
  "meta": {
    "requestId": "uuid",
    "timestamp": "2026-04-10T16:30:00Z"
  }
}
```

**Erreur :**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Agent introuvable"
  }
}
```

### 6.3 Endpoints

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/calls` | Déclencher un appel sortant |
| `GET` | `/v1/calls` | Lister les appels du workspace |
| `GET` | `/v1/calls/:id` | Détail d'un appel |
| `GET` | `/v1/calls/:id/transcript` | Transcript d'un appel |
| `GET` | `/v1/agents` | Lister les agents |
| `GET` | `/v1/agents/:id` | Détail d'un agent |
| `POST` | `/v1/agents` | Créer un agent |
| `PUT` | `/v1/agents/:id` | Modifier un agent |
| `DELETE` | `/v1/agents/:id` | Supprimer un agent |
| `GET` | `/v1/campaigns` | Lister les campagnes |
| `POST` | `/v1/campaigns` | Créer une campagne |
| `POST` | `/v1/campaigns/:id/start` | Lancer une campagne |
| `POST` | `/v1/campaigns/:id/pause` | Mettre en pause |
| `GET` | `/v1/phone-numbers` | Lister les numéros |
| `POST` | `/v1/phone-numbers` | Ajouter un numéro SIP |
| `GET` | `/v1/workspace` | Infos du workspace (minutes, cycle) |

### 6.4 Webhooks — Payloads

#### `call.ended`

```json
{
  "event": "call.ended",
  "call_id": "uuid",
  "workspace_id": "uuid",
  "agent_id": "uuid",
  "direction": "inbound",
  "caller_number": "+33612345678",
  "status": "ended",
  "duration_seconds": 92,
  "cost_cents": 65,
  "transcript": [
    { "role": "agent", "content": "Bonjour...", "timestamp": "..." },
    { "role": "user", "content": "Oui bonjour...", "timestamp": "..." }
  ],
  "variables": {
    "nom": "Dupont",
    "email": "dupont@email.com"
  },
  "timestamp": "2026-04-10T16:30:00Z"
}
```

#### `call.started`

```json
{
  "event": "call.started",
  "call_id": "uuid",
  "workspace_id": "uuid",
  "caller_number": "+33612345678",
  "timestamp": "2026-04-10T16:29:28Z"
}
```

#### `campaign.completed`

```json
{
  "event": "campaign.completed",
  "campaign_id": "uuid",
  "workspace_id": "uuid",
  "total_contacts": 150,
  "called_count": 150,
  "success_count": 87,
  "timestamp": "2026-04-10T18:00:00Z"
}
```

---

## 7. Sécurité & RGPD

### 7.1 Sécurité applicative

- Tokens API stockés en hash SHA-256 (jamais en clair)
- HTTPS obligatoire (TLS 1.3) sur tous les endpoints
- Rate limiting par token (100 req/min par défaut)
- RBAC strict : membre = accès à ses workspaces uniquement, admin = accès global
- Webhook signatures HMAC-SHA256 pour valider l'origine
- Credentials SIP/Twilio chiffrés au repos (AES-256)

### 7.2 Conformité RGPD

- Enregistrements audio désactivables par workspace
- Durée de rétention configurable (défaut : 90 jours)
- Export des données utilisateur sur demande
- Suppression définitive sur demande (droit à l'oubli)
- Numéros de téléphone pseudonymisés dans les logs
- Mention légale IA obligatoire dans les agents (`aiTransparencyPrompt`)

---

## 8. Périmètre par Phase

### 🟢 MVP — 8 à 10 semaines

> Objectif : une plateforme fonctionnelle end-to-end permettant d'onboarder les premiers clients.

**Auth & Comptes**
- [ ] Inscription / connexion (email + mot de passe)
- [ ] Profil utilisateur (prénom, nom, agence)
- [ ] Rôles admin / membre

**Workspaces**
- [ ] Créer, renommer, supprimer un workspace
- [ ] Vue liste avec cartes (minutes, progression, cycle)
- [ ] Barre de recherche
- [ ] Compteur de crédits global

**Agents IA**
- [ ] Créer / renommer / supprimer / dupliquer un agent
- [ ] Onglet AGENT : prompt, première phrase, silence/relance, numéro entrant
- [ ] Onglet PAROLE : langue, voix Cartesia fr-FR, hésitations naturelles
- [ ] Onglet RÉGLAGES : LLM, température, top P, enregistrement
- [ ] Synchronisation avec Vapi (create / update / delete)

**Conversations**
- [ ] Liste avec filtres basiques (date, agent, statut)
- [ ] Détail : transcript, durée, numéro appelant, statut
- [ ] Décompte automatique des minutes utilisées

**Téléphonie**
- [ ] Ajout de numéros SIP Trunk
- [ ] Assignation d'un numéro à un agent

**Facturation & Minutes**
- [ ] Cycle mensuel par workspace
- [ ] Comptage des minutes en temps réel
- [ ] Affichage du dépassement possible (tarif/min)

**Admin basique**
- [ ] Liste de tous les membres
- [ ] Vue détail d'un workspace
- [ ] Ajout manuel de minutes

---

### 🔵 V1 — 4 à 6 semaines après le MVP

> Objectif : fidéliser les clients et se différencier de Dipler.

**Agents — fonctionnalités avancées**
- [ ] Onglet OUTILS (tool calls externes complets)
- [ ] Messagerie vocale outbound
- [ ] Onglet ANALYSES par agent
- [ ] Onglet API (IDs + config JSON)

**Campagnes d'appels**
- [ ] Créer une campagne (agent, numéro, contacts CSV)
- [ ] Planification horaire
- [ ] Suivi en temps réel
- [ ] Pause / reprise / arrêt

**Base de connaissances**
- [ ] Upload de fichiers (PDF, DOCX, TXT)
- [ ] Mode Full Context
- [ ] Mode RAG (vectoriel)
- [ ] Synchronisation Vapi

**API & Webhooks**
- [ ] Génération de tokens API (`voc_xxx`)
- [ ] Endpoints REST publics : `/v1/calls`, `/v1/agents`
- [ ] Webhooks `call.started` et `call.ended` avec signature HMAC

**Facturation**
- [ ] Historique des cycles par workspace
- [ ] Intégration Stripe (crédits à la demande)

**Conversations**
- [ ] Filtre par sentiment
- [ ] Résumé IA de l'appel
- [ ] Audio player intégré

---

### 🟡 V2 — 6 à 8 semaines après la V1

> Objectif : scaler et ouvrir de nouveaux marchés.

**Agents**
- [ ] Onglet TESTS (simulateur textuel + appel test réel)
- [ ] Règles d'override de voix par langue détectée
- [ ] Bruit de fond d'ambiance

**Campagnes**
- [ ] Retry automatique avec délai configurable
- [ ] Variables dynamiques par contact (`{{prenom}}`)
- [ ] Export des résultats en CSV

**API étendue**
- [ ] Endpoints campagnes : `/v1/campaigns`
- [ ] Webhook `campaign.completed`
- [ ] Token API providers tiers (ElevenLabs, OpenAI)

**Documentation interactive**
- [ ] Doc Tool Calls générée automatiquement par workspace
- [ ] Playground API intégré

**Admin avancé**
- [ ] Dashboard graphiques (appels/jour, revenus/mois)
- [ ] Alertes : plafond proche, webhooks en échec
- [ ] Métriques de latence par provider voix
- [ ] Gestion des offres & tarifs depuis l'interface

**Blanc-label**
- [ ] Domaine personnalisé par agence
- [ ] Logo et couleurs personnalisables

---

### ⛔ Hors-périmètre

Ces fonctionnalités sont identifiées mais volontairement écartées pour ne pas diluer le focus initial :

- Application mobile native (iOS / Android)
- Intégrations CRM natives (HubSpot, Pipedrive, Salesforce)
- Support multi-langue dans une même conversation (détection automatique)
- Facturation à l'appel (seule la facturation à la minute est prévue)
- Marketplace d'agents (templates partagés entre membres)
- Interface de transcription live (streaming temps réel)
- Prise en charge de la vidéo

---

## 9. Roadmap de Développement

```
Semaine 1-2   Auth, base de données, structure Next.js + API
Semaine 3-4   Workspaces, sidebar, navigation workspace
Semaine 5-6   Éditeur agent (Agent + Parole + Réglages) + sync Vapi
Semaine 7-8   Conversations + décompte minutes + téléphonie SIP
Semaine 9-10  Admin basique + cycles de facturation + stabilisation MVP
──────────────────────────────────────────────────────────────────
Semaine 11-12 Outil builder + base de connaissances
Semaine 13-14 Campagnes d'appels
Semaine 15-16 API tokens + Webhooks + Stripe
──────────────────────────────────────────────────────────────────
Semaine 17-18 Tests agents + analyses + Doc Tool Calls
Semaine 19-20 Admin avancé + alertes + blanc-label
```

---

## 10. Identité & Branding

### Nom

**Vocalia** — à vérifier : `vocalia.app` / `vocalia.fr` / `vocalia.io`

### Palette de couleurs

| Couleur | Hex | Usage |
|---|---|---|
| Accent principal | `#3D8EFF` | CTA, liens, éléments actifs |
| Accent secondaire | `#6C5CE7` | Gradient logo, accents |
| Succès / Minutes | `#00C896` | Barres de progression, statut OK |
| Alerte dépassement | `#FF7F3F` | Avertissements |
| Danger | `#FF4D6D` | Suppression, erreurs critiques |
| Background global | `#0D0E14` | Fond dark mode |
| Background carte | `#1A1D2E` | Cartes, panels |
| Texte principal | `#E8EAF6` | Texte principal |
| Texte secondaire | `#8B90B0` | Labels, descriptions |

### Typographie

| Usage | Police | Poids |
|---|---|---|
| Titres / Logo | Plus Jakarta Sans | Bold 700 |
| Interface | Plus Jakarta Sans | Regular 400 / Medium 500 |
| Code / JSON | JetBrains Mono | Regular 400 |

---

*Document généré le 10 avril 2026 — Vocalia Platform v1.0*