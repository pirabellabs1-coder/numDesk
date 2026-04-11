## Why

La landing page Vocalia est en place. Il faut maintenant construire le cœur de la plateforme : l'application SaaS complète avec authentification, tableau de bord, gestion des agents IA, conversations, campagnes, facturation et administration — en suivant pixel-perfect les 13 maquettes de référence existantes.

## What Changes

- Création du système d'authentification complet (login, register, forgot-password)
- Création du layout SaaS partagé (sidebar 240px fixe + topbar glassmorphism)
- Création du tableau de bord principal avec KPIs, conversations récentes, activité live
- Création de la gestion des agents IA (liste + éditeur à 6 onglets)
- Création de la vue conversations avec transcript, audio player, filtres
- Création de la gestion des campagnes d'appels
- Création de la base de connaissances (upload fichiers, modes Full Context/RAG)
- Création de la gestion des numéros SIP et configuration Twilio
- Création de la section API & Webhooks (tokens, events, signatures)
- Création de la facturation & crédits (cycles, historique, Stripe)
- Création des paramètres workspace
- Création du dashboard admin global

## Capabilities

### New Capabilities

- `auth-pages`: Pages d'authentification — login, register, forgot-password avec layout centré dark
- `dashboard-shell`: Layout SaaS partagé — sidebar fixe 240px + topbar glassmorphism + route group (dashboard)
- `dashboard-home`: Tableau de bord principal — KPIs 4 stats, conversations récentes, activité live, quota usage
- `agents-list`: Liste des agents IA avec cartes, statut actif/inactif, actions (dupliquer, supprimer, tester)
- `agent-editor`: Éditeur d'agent à 6 onglets — Agent, Parole, Outils, Réglages, Analyses, API
- `conversations`: Liste et détail des conversations — filtres, transcript, audio, statut, sentiment
- `campaigns`: Gestion des campagnes — création, suivi temps réel, contacts CSV, plage horaire
- `knowledge-base`: Base de connaissances — upload PDF/DOCX/TXT, Full Context vs RAG, sync Vapi
- `phone-numbers`: Gestion numéros SIP + configuration trunks Twilio/SIP
- `api-webhooks`: Tokens API + webhooks — génération, révocation, événements, signature HMAC
- `billing`: Facturation & crédits — cycles mensuels, historique, intégration Stripe
- `workspace-settings`: Paramètres workspace — profil, membres, notifications, clés API providers
- `admin-dashboard`: Dashboard administrateur global — membres, workspaces, métriques, allocation minutes

### Modified Capabilities

_(aucune — toutes les capabilities sont nouvelles)_

## Impact

- Création de 25+ pages Next.js sous `app/(dashboard)/` et `app/(auth)/`
- Création des composants UI réutilisables : `components/ui/`, `components/dashboard/`
- Ajout de Material Symbols Outlined (Google Icons) dans globals.css
- Ajout shadcn/ui components (Table, Dialog, Tabs, Select, Switch, Badge, Progress)
- Aucune dépendance backend réelle (MVP statique avec données mock)
- Tous les écrans en français, design system "The Sonic Architect" strict
