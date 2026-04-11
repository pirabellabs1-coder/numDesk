## Context

Vocalia n'a actuellement aucune page publique. La landing page est la première route à implémenter — elle est purement statique (pas d'API backend), mais doit incarner le design system "The Sonic Architect" défini dans ARCHITECTURE.md et servir de fondation pour les composants réutilisables (Navbar, Footer, boutons, cartes).

La maquette de référence est disponible dans `page_d_accueil_vocalia/screen.png`. Elle définit la structure exacte des sections, la hiérarchie typographique et les interactions visuelles.

## Goals / Non-Goals

**Goals :**
- Implémenter fidèlement la maquette en Next.js 15 (App Router) avec un layout marketing dédié
- Établir le design system (tokens Tailwind, polices, composants de base) pour tout le projet
- Page responsive (mobile 375px, tablette 768px, desktop 1280px+)
- Performance optimale : page statique, pas de JS côté client sauf animations CSS
- SEO : metadata complètes en français, Open Graph

**Non-Goals :**
- Pas de fonctionnalité d'authentification (les boutons Log In / Launch Console sont des liens vers des routes futures)
- Pas de formulaire de contact ou d'inscription fonctionnel
- Pas de blog, pas de pages secondaires (Solutions, Developers, etc.)
- Pas d'internationalisation — français uniquement
- Pas d'intégration Stripe pour le pricing (liens vers `/register` ou `mailto:`)

## Decisions

### D1 : Layout marketing séparé du dashboard

Le layout `(marketing)` vit dans `app/(marketing)/layout.tsx` avec sa propre Navbar et son Footer, complètement indépendant du layout `(dashboard)` futur.

**Pourquoi** : la landing page a un fond dark (#0A0B0F) pleine page sans sidebar, tandis que le dashboard aura une sidebar et un fond surface. Route groups Next.js permettent cette séparation sans duplication.

### D2 : Configuration Tailwind avec tokens du design system

Étendre `tailwind.config.ts` avec les tokens exacts de "The Sonic Architect" :

```typescript
colors: {
  background: '#0A0B0F',
  surface: '#121317',
  'surface-container-lowest': '#0D0E12',
  'surface-container-low': '#1A1B20',
  'surface-container': '#1F1F24',
  'surface-container-high': '#292A2E',
  'surface-container-highest': '#343439',
  primary: '#4F7FFF',
  secondary: '#7B5CFA',
  tertiary: '#00D4AA',
  'on-surface': '#E3E2E8',
  'on-surface-variant': '#C3C6D7',
  'outline-variant': '#434654',
  error: '#FFB4AB',
},
fontFamily: {
  display: ['Syne', 'sans-serif'],
  body: ['Manrope', 'sans-serif'],
  nav: ['Space Grotesk', 'monospace'],
},
```

**Pourquoi** : utiliser les noms de tokens directement dans les classes (`text-on-surface`, `bg-surface-container-high`) garantit la cohérence et facilite la maintenance.

### D3 : Structure des composants

```
components/
├── landing/
│   ├── navbar.tsx            # Navbar marketing (glassmorphism, fixed)
│   ├── hero.tsx              # Hero section + waveform animation
│   ├── features.tsx          # Cartes Performance IA + Voix Naturelles
│   ├── ecosystem.tsx         # Section intégrations
│   ├── pricing.tsx           # Grille 3 tiers
│   ├── cta-section.tsx       # CTA finale
│   ├── footer.tsx            # Footer avec liens légaux
│   └── waveform.tsx          # Animation waveform réutilisable (CSS)
```

**Pourquoi** : un composant par section permet le lazy loading futur et la maintenance indépendante. Le dossier `landing/` isole ces composants du reste de l'app.

### D4 : Animations CSS-only (pas de Framer Motion)

Les animations (waveform, gradient text, hover effects) sont réalisées en CSS pur via Tailwind + keyframes custom.

**Pourquoi** : page statique = pas de bundle JS supplémentaire. Les animations CSS sont plus performantes et suffisent pour les effets demandés (barres ondulantes, pulse live indicator).

### D5 : Polices via `next/font/google`

```typescript
import { Syne, Manrope, Space_Grotesk } from 'next/font/google'
```

**Pourquoi** : optimisation automatique par Next.js (self-hosted, pas de requête externe, font-display swap).

### D6 : Grain texture en overlay CSS

```css
.grain::after {
  content: '';
  position: fixed;
  inset: 0;
  opacity: 0.02;
  background-image: url("data:image/svg+xml,..."); /* noise pattern inline */
  pointer-events: none;
  z-index: 50;
}
```

**Pourquoi** : l'effet grain film est subtil (2% opacité) mais élimine le banding sur les gradients dark et ajoute la qualité tactile du design system.

## Risks / Trade-offs

- **[Polices non-standard]** → Les 3 polices (Syne, Manrope, Space Grotesk) augmentent le FOUT. Mitigation : `next/font` avec `display: swap` et preload automatique.
- **[Animations CSS complexes]** → La waveform animée peut être lourde sur mobile bas de gamme. Mitigation : utiliser `prefers-reduced-motion` pour désactiver les animations, limiter le nombre de barres.
- **[Responsive de la grille pricing]** → 3 colonnes avec le tier Pro surélevé est délicat en mobile. Mitigation : stack vertical en mobile avec le Pro toujours en premier (visuellement proéminent).
- **[Liens morts temporaires]** → Les CTA pointent vers `/login`, `/register`, `/docs` qui n'existent pas encore. Mitigation : utiliser `href` avec les bonnes routes dès maintenant, Next.js affichera une 404 gracieuse.
