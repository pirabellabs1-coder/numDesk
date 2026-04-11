## Why

Vocalia a besoin d'une page d'accueil marketing (landing page) comme premier point de contact pour les prospects. C'est la vitrine de la plateforme — elle doit communiquer instantanément la proposition de valeur ("L'Architecture Sonore de votre Relation Client"), démontrer la qualité premium du produit à travers le design system "The Sonic Architect", et convertir les visiteurs vers l'inscription ou la demande de démo. Sans cette page, il n'y a aucun funnel d'acquisition.

## What Changes

- Création de la route `/` avec la landing page complète sur fond dark (#0A0B0F)
- **Navbar** : logo Vocalia, navigation (Platform, Solutions, Developers, Pricing), boutons Log In et Launch Console
- **Hero section** : headline "L'Architecture Sonore de votre Relation Client" avec gradient bleu→violet, sous-titre, deux CTA (Lancer la Console, Découvrir la démo), animation waveform
- **Section Features** : deux cartes — "Performance IA" (latence <200ms, badges, waveform animée) et "Voix Naturelles" (50+ modèles, sélecteur de voix)
- **Section Écosystème Ouvert** : 4 intégrations (SIP Trunking, Webhooks, Twilio, SDK Node/Python) avec lien Documentation API
- **Section Pricing** : 3 tiers (Starter 0.05€/min, Pro 0.12€/min mis en avant, Enterprise sur mesure)
- **Section CTA finale** : "Prêt à réinventer votre voix ?" avec deux boutons
- **Footer** : branding Vocalia, liens légaux (Privacy, Terms, Security, Status)

## Capabilities

### New Capabilities

- `landing-hero`: Section hero avec headline, sous-titre, CTA et animation waveform
- `landing-features`: Cartes de mise en avant des fonctionnalités clés (Performance IA, Voix Naturelles)
- `landing-ecosystem`: Section intégrations et écosystème ouvert avec liens API
- `landing-pricing`: Grille tarifaire à 3 niveaux avec mise en avant du plan Pro
- `landing-layout`: Navbar globale, footer et structure de page marketing

### Modified Capabilities

_(Aucune — c'est la première page du projet)_

## Impact

- **Fichiers créés** : route `app/(marketing)/page.tsx`, composants dans `components/landing/`, layout marketing dédié
- **Dépendances** : polices Google Fonts (Syne, Manrope, Space Grotesk), Tailwind CSS, shadcn/ui (Button, Badge, Card)
- **Aucune API backend requise** — page statique côté client avec liens vers `/login`, `/register`, `/docs`
- **SEO** : metadata Open Graph, titre et description en français
