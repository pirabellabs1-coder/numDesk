## Context

La landing page Vocalia est déployée sur Next.js 15 avec Tailwind v4 et le design system "The Sonic Architect". Il faut maintenant construire l'application SaaS complète. Les 13 maquettes de référence (HTML + PNG) à la racine du projet définissent l'apparence exacte de chaque écran. L'implémentation est MVP-statique : données mock, pas de backend réel pour l'instant.

## Goals / Non-Goals

**Goals:**
- Reproduire pixel-perfect les 13 écrans des maquettes
- Créer une navigation fonctionnelle entre toutes les pages
- Implémenter les états UI (hover, active, loading, empty states)
- Utiliser le design system existant (globals.css tokens déjà définis)
- Ajouter Material Symbols Outlined pour les icônes (comme dans les maquettes)
- Données mock réalistes en TypeScript (pas de fetch réel)

**Non-Goals:**
- Pas de backend Supabase/API pour ce change (MVP statique)
- Pas d'authentification réelle (pages visuelles uniquement)
- Pas de vraie intégration Vapi/Stripe pour l'instant

## Decisions

### 1. Structure des routes Next.js

Deux route groups principaux :
```
app/
├── (auth)/              # Layout centré, fond dark sans sidebar
│   ├── login/
│   ├── register/
│   └── forgot-password/
└── (dashboard)/         # Layout sidebar + topbar
    ├── layout.tsx        # Shell SaaS partagé
    ├── dashboard/        # Tableau de bord principal
    ├── agents/
    │   ├── page.tsx      # Liste agents
    │   └── [id]/page.tsx # Éditeur agent
    ├── conversations/
    ├── campaigns/
    ├── knowledge/
    ├── phone-numbers/
    ├── api-webhooks/
    ├── billing/
    ├── settings/
    └── admin/
```

**Pourquoi ce choix :** Route groups Next.js permettent des layouts différents pour auth vs dashboard sans duplication. L'URL `/dashboard` correspond à la maquette "Tableau de bord".

### 2. Icônes : Material Symbols Outlined

Les maquettes utilisent Google Material Symbols Outlined via `<link>` CDN + `<span class="material-symbols-outlined">nom_icone</span>`. On adopte la même approche plutôt que lucide-react pour correspondre exactement aux maquettes.

Ajout dans `app/(dashboard)/layout.tsx` via `<link>` dans le head, ou dans globals.css via `@import url()`.

### 3. Données mock TypeScript

Chaque page reçoit des données mock définies directement dans le composant ou dans un fichier `lib/mock-data.ts`. Pas de Server Components async avec fetch — tout est synchrone et statique pour l'instant.

### 4. Sidebar : composant `DashboardShell`

Le layout `(dashboard)/layout.tsx` rend :
- `<Sidebar />` : w-[240px] fixe, bg-surface (#121317), z-50
- `<Topbar />` : fixed top-0 right-0 left-[240px], glassmorphism h-16
- `<main className="ml-[240px] pt-16">` : contenu scrollable

Le workspace switcher dans la sidebar est un composant statique (pas de dropdown fonctionnel au MVP).

### 5. Tabs agent editor : `useSearchParams` ou tabs state

L'éditeur d'agent a 6 onglets. On utilise `useState` local pour le tab actif + `shadcn/ui Tabs` component pour l'accessibilité. Pas de route par onglet pour simplifier.

### 6. Composants UI shadcn/ui à installer

Composants nécessaires (via `npx shadcn@latest add`) :
- `table` — conversations, API tokens
- `tabs` — agent editor
- `dialog` — modals de confirmation
- `select` — dropdowns
- `switch` — toggles agent
- `badge` — statuts
- `progress` — quota usage
- `input`, `textarea`, `button` — formulaires

### 7. Tailwind v4 + tokens existants

Le design system est déjà dans `globals.css` avec `@theme {}`. On utilise les tokens définis :
- `bg-background` (#0A0B0F), `bg-surface` (#121317), `bg-card` (#0F1117)
- `text-primary` (#4F7FFF), `text-secondary` (#7B5CFA), `text-tertiary` (#00D4AA)
- `text-on-surface` (#E3E2E8), `text-on-surface-variant` (#C3C6D7)

Ajouter dans `@theme {}` les tokens manquants pour les maquettes :
- `--color-surface-container-low: #1A1B20`
- `--color-surface-container: #1F1F24`
- `--color-surface-container-high: #292A2E`
- `--color-surface-container-highest: #343439`

## Risks / Trade-offs

- [Static data] Les données mock rendent la navigation possible mais sans persistance → Mitigation: Suffisant pour le MVP visuel, sera remplacé par Supabase ensuite
- [shadcn install] L'installation de shadcn peut modifier globals.css → Mitigation: Vérifier et restaurer les tokens @theme après installation
- [Material Symbols] Chargement Google CDN peut être lent → Mitigation: Ajouter `<link rel="preconnect" href="https://fonts.googleapis.com">` dans le layout
- [Scope] 13 pages = beaucoup de composants → Mitigation: Priorité au dashboard shell + 3 pages core (dashboard, agents, conversations), puis les autres
