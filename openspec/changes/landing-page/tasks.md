## 1. Initialisation du projet Next.js et configuration

- [x] 1.1 Initialiser le monorepo avec `pnpm` et créer la structure `apps/web/` avec Next.js 15 (App Router), TypeScript, Tailwind CSS — fichiers : `package.json`, `turbo.json`, `tsconfig.base.json`, `apps/web/package.json`, `apps/web/tsconfig.json`, `apps/web/next.config.ts`
- [x] 1.2 Installer et configurer shadcn/ui dans `apps/web/` — fichiers : `components.json`, `apps/web/lib/utils.ts`, `apps/web/app/globals.css`
- [x] 1.3 Configurer les tokens du design system "The Sonic Architect" dans `tailwind.config.ts` — couleurs (background, surface, primary, secondary, tertiary, on-surface, etc.), fontFamily (Syne, Manrope, Space Grotesk), et keyframes custom (waveform, pulse)
- [x] 1.4 Configurer les polices via `next/font/google` (Syne, Manrope, Space Grotesk) dans `apps/web/app/layout.tsx` avec les variables CSS

## 2. Layout marketing et composants structurels

- [x] 2.1 Créer le layout marketing `apps/web/app/(marketing)/layout.tsx` — fond `#0A0B0F`, overlay grain texture CSS à 2% d'opacité, import des polices
- [x] 2.2 Créer le composant Navbar `apps/web/components/landing/navbar.tsx` — fixe en haut, glassmorphism (backdrop-blur-xl, fond surface/70%, border-b white/10), logo "Vocalia", liens nav (Platform, Solutions, Developers, Pricing), boutons Log In + Launch Console
- [x] 2.3 Ajouter le menu hamburger responsive dans la Navbar pour mobile (<768px) — utiliser le composant Sheet de shadcn/ui
- [x] 2.4 Créer le composant Footer `apps/web/components/landing/footer.tsx` — branding Vocalia à gauche, copyright, liens légaux à droite (Privacy Policy, Terms of Service, Security, Status)

## 3. Section Hero

- [x] 3.1 Créer le composant Hero `apps/web/components/landing/hero.tsx` — surtitre "THE SONIC ARCHITECT" (secondary, uppercase, tracking-wider), headline "L'Architecture Sonore / de votre Relation Client" (Syne Bold 3.5rem, gradient text primary→secondary sur la 2e ligne), sous-titre descriptif (on-surface-variant, Manrope)
- [x] 3.2 Ajouter les deux boutons CTA dans le Hero — "Lancer la Console" (gradient primary→secondary, glow hover, lien `/register`) et "Découvrir la démo" (ghost/outline, icône play, lien `/demo`)
- [x] 3.3 Créer le composant Waveform `apps/web/components/landing/waveform.tsx` — barres verticales arrondies animées en CSS (keyframes), gradient primary→secondary→tertiary, support `prefers-reduced-motion`

## 4. Section Features

- [x] 4.1 Créer le composant Features `apps/web/components/landing/features.tsx` — grille 2 colonnes desktop, stack mobile
- [x] 4.2 Implémenter la carte "Performance IA" — titre + icône éclair, description latence <200ms, badges "LIVE STATE" (tertiary/10) et "ULTRA LOW LATENCY" (primary/10), mini waveform/spectre audio en bas de carte
- [x] 4.3 Implémenter la carte "Voix Naturelles" — titre, description 50+ modèles, sélecteur visuel de voix avec "Gabriel (FR)" actif (primary/10) et "Sophie (FR)" neutre

## 5. Section Écosystème Ouvert

- [x] 5.1 Créer le composant Ecosystem `apps/web/components/landing/ecosystem.tsx` — titre "Écosystème Ouvert" (Syne Bold), description, bouton/lien "Documentation API" (outline, lien `/docs`)
- [x] 5.2 Implémenter les 4 cartes d'intégration en grille — SIP Trunking, Webhooks, Twilio, SDK Node/Python — chaque carte avec icône, titre et sous-titre sur fond `surface-container`

## 6. Section Pricing

- [x] 6.1 Créer le composant Pricing `apps/web/components/landing/pricing.tsx` — titre "Investissez dans l'Excellence", sous-titre, grille 3 colonnes
- [x] 6.2 Implémenter les 3 tiers tarifaires — Starter (0.05€/min, outline CTA), Pro (0.12€/min, badge "PLUS POPULAIRE", gradient CTA, visuellement surélevé), Enterprise (Sur mesure, outline CTA "Contacter Ventes")
- [x] 6.3 Responsive pricing : stack vertical en mobile avec Pro en premier

## 7. Section CTA finale

- [x] 7.1 Créer le composant CtaSection `apps/web/components/landing/cta-section.tsx` — bloc avec fond arrondi distinct, titre "Prêt à réinventer votre voix ?", description, deux boutons (Lancer la Console outline, Parler à un expert gradient)

## 8. Page d'assemblage et SEO

- [x] 8.1 Créer la page `apps/web/app/(marketing)/page.tsx` — assembler tous les composants (Navbar, Hero, Features, Ecosystem, Pricing, CtaSection, Footer), définir les metadata Next.js (titre, description, Open Graph)

## 9. Tests et validation

- [ ] 9.1 Tester la page avec playwright-skill — vérifier le responsive (375px, 768px, 1280px), l'absence d'erreurs console, les éléments interactifs fonctionnels, et les états visuels conformes à la maquette `page_d_accueil_vocalia/screen.png`
