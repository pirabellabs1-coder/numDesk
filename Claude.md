# CLAUDE.md — Vocalia

## Aperçu du projet

**Vocalia** est une plateforme SaaS B2B d'appels téléphoniques pilotés par l'IA, conçue pour le marché francophone. Elle permet à des agences ou indépendants (membres) de gérer plusieurs clients sous forme de **workspaces**, chacun avec ses propres agents IA, numéros de téléphone, campagnes d'appels et bases de connaissances.

L'objectif central est une expérience d'appel plus humaine : latence < 800ms, voix naturelles françaises (Cartesia, ElevenLabs), hésitations naturelles, interface entièrement en français.

**Modèle économique :** facturation à la minute par workspace, avec plafonds de dépassement configurables et cycles mensuels.

---

## Aperçu de l'architecture globale

```
┌──────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│           Next.js 14 (App Router) + TypeScript               │
│           Tailwind CSS + shadcn/ui                           │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTP / REST
┌────────────────────────▼─────────────────────────────────────┐
│                       BACKEND API                            │
│           Node.js + Fastify + TypeScript                     │
│           Auth : Clerk / NextAuth.js + JWT + RBAC            │
└──────┬──────────────────────────────┬────────────────────────┘
       │                              │
┌──────▼──────┐               ┌───────▼──────┐
│ PostgreSQL  │               │    Redis      │
│  (données)  │               │ (cache+queue) │
└─────────────┘               └──────────────┘
       │
┌──────▼───────────────────────────────────────────────────────┐
│                     SERVICES EXTERNES                        │
│  Vapi AI          — orchestrateur des appels                 │
│  Cartesia         — TTS voix française (premium)             │
│  ElevenLabs       — TTS voix française (backup)              │
│  Gemini 2.5 Flash — LLM par défaut                           │
│  SIP Trunk        — Twilio / Zadarma / Telnyx                │
│  Stripe           — facturation & crédits                    │
│  Cloudflare R2    — stockage fichiers (bases de connaissance) │
└──────────────────────────────────────────────────────────────┘
```

### Flux d'un appel entrant

```
1. L'appelant compose le numéro SIP assigné à un agent
2. Le trunk SIP redirige vers Vapi via webhook configuré
3. Vapi instancie l'agent (prompt + voix + outils)
4. Conversation temps réel : STT → LLM → TTS (< 800ms)
5. Les tool calls interrogent l'API Vocalia en temps réel
6. Fin d'appel → webhook end-of-call → Vocalia
7. Vocalia persiste la conversation + décompte les minutes
```

### Flux d'un appel sortant (campagne)

```
1. L'utilisateur crée une campagne avec une liste de contacts
2. Vocalia planifie les appels via queue Redis (Bull)
3. Pour chaque contact : appel API Vapi createCall
4. Gestion répondeur si activée (voicemail)
5. Résultats (statut, durée, tags) stockés en base
6. Minutes décomptées du wallet du workspace
```

---

## Style visuel

- Interface **claire et minimaliste**, fond blanc
- **Pas de mode sombre pour le MVP**
- Base de composants : **shadcn/ui** — ne pas surcharger visuellement
- Typographie :
  - `Plus Jakarta Sans` — titres et interface
  - `JetBrains Mono` — code, JSON, identifiants
- Palette de couleurs :

| Rôle | Hex |
|---|---|
| Accent principal | `#3D8EFF` |
| Accent secondaire | `#6C5CE7` |
| Succès / minutes OK | `#00C896` |
| Alerte dépassement | `#FF7F3F` |
| Danger / suppression | `#FF4D6D` |
| Texte principal | `#1E2235` |
| Texte secondaire | `#555872` |
| Bordures | `#DDDFE8` |
| Background carte | `#F4F5FA` |

- Densité modérée : espacement généreux, jamais d'interface surchargée
- Tous les labels, messages d'erreur et textes UI sont **en français**

---

## Contraintes et politiques

- **NE JAMAIS exposer les clés API côté client** — toutes les clés (Vapi, Cartesia, ElevenLabs, Stripe, SIP) sont stockées uniquement en variables d'environnement serveur. Elles ne transitent jamais dans le bundle frontend ni dans les réponses des endpoints publics
- Les tokens API utilisateur sont stockés en **hash SHA-256** en base, jamais en clair. Seul le préfixe (`voc_xxxx`) est affiché
- Les credentials SIP/Twilio sont **chiffrés AES-256** au repos
- **RBAC strict** : un membre ne peut accéder qu'à ses propres workspaces. Seul le rôle `admin` a une vue globale de la plateforme
- **Rate limiting** obligatoire sur tous les endpoints API publics (100 req/min par token par défaut)
- Les webhooks sortants incluent toujours une signature **HMAC-SHA256** dans le header `X-Vocalia-Signature`
- Les numéros de téléphone des appelants sont **pseudonymisés** dans les logs et exports
- La mention légale IA (`aiTransparencyPrompt`) est obligatoire dans chaque agent publié

---

## Dépendances

- **Préférer les composants shadcn/ui existants** plutôt que d'ajouter de nouvelles bibliothèques UI. Si un besoin peut être couvert par un composant shadcn/ui ou une composition de composants existants, c'est la voie à suivre
- Avant d'installer une nouvelle dépendance npm, vérifier si le besoin n'est pas déjà couvert par une bibliothèque présente dans `package.json`
- Librairies déjà approuvées dans ce projet :

| Librairie | Usage |
|---|---|
| `zod` | Validation des schémas |
| `react-hook-form` | Gestion des formulaires |
| `date-fns` | Manipulation des dates |
| `bull` | Queues de tâches (campagnes) |
| `ioredis` | Client Redis |
| `drizzle-orm` | ORM PostgreSQL |
| `stripe` | Paiement et facturation |
| `@vapi-ai/server-sdk` | Intégration Vapi côté serveur |

---

## Tests interface graphique

À la fin de **chaque développement impliquant l'interface graphique**, tester systématiquement avec **`playwright-skill`** en vérifiant :

- L'interface est **responsive** : mobile 375px / tablette 768px / desktop 1280px+
- Tous les éléments interactifs sont **fonctionnels** : boutons, formulaires, navigation, modales
- Le développement **répond au besoin** décrit dans la spec ou la tâche
- Aucune **erreur console** JavaScript n'est présente
- Les **états vides** sont gérés (listes vides, loading states, erreurs API)

---

## Documentation

Les spécifications détaillées sont dans deux fichiers de référence :

- **@PRD.md** — Product Requirements Document : vision, fonctionnalités par phase (MVP / V1 / V2), parcours utilisateur, hors-périmètre
- **@ARCHITECTURE.md** — Architecture technique : stack, schéma de base de données complet, flux d'appels, spécification API REST, payloads webhooks, sécurité & RGPD

Ces fichiers font autorité. En cas de doute sur un comportement attendu ou une structure de données, s'y référer avant de demander des précisions.

---

## Context7

Utiliser **toujours Context7** dans les situations suivantes, sans attendre de demande explicite :

- Génération de code utilisant une bibliothèque tierce
- Étapes de configuration ou d'installation d'un outil ou service
- Consultation de documentation d'une bibliothèque ou d'une API

Cela signifie : utiliser automatiquement les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et récupérer la documentation à jour **avant** d'écrire le code correspondant.

---

## Langue et format des spécifications

- Toutes les spécifications sont rédigées **en français**, y compris les sections *Purpose* et *Scenarios* des specs OpenSpec
- Seuls les **titres de Requirements** restent en anglais avec les mots-clés `SHALL` / `MUST` pour la compatibilité avec la validation OpenSpec
- Les commentaires dans le code peuvent rester en anglais
- Les messages visibles par l'utilisateur final sont **toujours en français**

**Exemple de format OpenSpec correct :**

```markdown
## Création d'un workspace

**Purpose :** Permettre à un membre de créer un nouveau workspace client depuis la page d'accueil.

**Scenarios :**
- L'utilisateur clique sur "+ Nouveau Workspace", saisit un nom et valide
- Si le nom est vide, un message d'erreur en français s'affiche
- Le workspace créé apparaît immédiatement dans la liste

### Requirements

- R1: The system SHALL create a new workspace with a unique ID upon form submission
- R2: The system MUST validate that the workspace name is not empty before saving
- R3: The system SHALL redirect the user to the new workspace after creation
```