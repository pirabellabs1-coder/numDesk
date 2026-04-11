## ADDED Requirements

### Requirement: Sidebar de navigation fixe
Le système SHALL afficher une sidebar fixe de 240px à gauche avec : logo Vocalia bleu, workspace switcher, navigation principale, et profil utilisateur en bas.

#### Scenario: Affichage sidebar
- **WHEN** l'utilisateur est dans une page dashboard
- **THEN** la sidebar est visible à gauche, fixe, bg-surface (#121317), avec les éléments de navigation définis

#### Scenario: Item de navigation actif
- **WHEN** l'utilisateur est sur une page (ex: /agents)
- **THEN** l'item "Agents" dans la sidebar affiche text-primary (#4F7FFF) et bg-surface-container-low (#1A1B20) avec border-radius 8px

#### Scenario: Navigation entre pages
- **WHEN** l'utilisateur clique sur un item de navigation
- **THEN** la page correspondante se charge et l'item devient actif

### Requirement: Topbar fixe glassmorphism
Le système SHALL afficher une topbar fixe en haut (h-16) avec glassmorphism, nom de l'agence, breadcrumb, boutons recherche/notifications/action principale.

#### Scenario: Affichage topbar
- **WHEN** l'utilisateur est dans une page dashboard
- **THEN** la topbar est visible en haut, bg-surface/70% avec backdrop-blur-xl, border-b border-white/10

#### Scenario: Bouton action contextuelle
- **WHEN** l'utilisateur est sur la page agents
- **THEN** la topbar affiche un bouton "Créer un agent" en gradient primary→secondary

### Requirement: Contenu principal scrollable
Le système SHALL afficher le contenu des pages dans une zone ml-[240px] pt-16 pb-12 overflow-y-auto.

#### Scenario: Scroll du contenu
- **WHEN** le contenu dépasse la hauteur de l'écran
- **THEN** seul le contenu principal défile, sidebar et topbar restent fixes

### Requirement: Navigation sidebar items
La sidebar SHALL contenir ces items dans l'ordre : Tableau de bord (dashboard), Agents (smart_toy), Conversations (forum), Campagnes (campaign), Base de connaissances (menu_book) — séparateur — Numéros (call), API & Webhooks (code), Documentation (description). En bas : Paramètres (settings) + avatar utilisateur.

#### Scenario: Structure complète de la sidebar
- **WHEN** l'utilisateur ouvre une page dashboard
- **THEN** tous les items de navigation listés sont présents dans l'ordre défini
