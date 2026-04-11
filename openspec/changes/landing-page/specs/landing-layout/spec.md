## ADDED Requirements

### Requirement: Marketing layout with dedicated navbar and footer

Le système SHALL fournir un layout marketing dédié (`app/(marketing)/layout.tsx`) distinct du layout dashboard, appliquant le fond global `#0A0B0F` et le grain texture à 2% d'opacité sur l'ensemble de la page.

#### Scenario: Page d'accueil chargée

- **WHEN** l'utilisateur accède à la route `/`
- **THEN** la page affiche la navbar en haut, le contenu principal, et le footer en bas, sur un fond `#0A0B0F`

#### Scenario: Grain texture visible

- **WHEN** la page est rendue
- **THEN** un overlay de bruit (grain) à 2% d'opacité couvre l'ensemble de la page sans bloquer les interactions (`pointer-events: none`)

### Requirement: Navbar SHALL display logo, navigation links, and action buttons

La navbar MUST être fixe en haut de page avec un effet glassmorphism (`backdrop-filter: blur(12px)`, fond `surface/70%`, bordure basse `white/10`). Elle contient : le logo "Vocalia" à gauche, les liens de navigation (Platform, Solutions, Developers, Pricing) au centre, et les boutons "Log In" (texte) et "Launch Console" (bouton primaire) à droite.

#### Scenario: Navbar visible au scroll

- **WHEN** l'utilisateur scrolle vers le bas
- **THEN** la navbar reste fixe en haut avec l'effet glassmorphism (fond semi-transparent + blur)

#### Scenario: Navigation links hover

- **WHEN** l'utilisateur survole un lien de navigation
- **THEN** le lien change de couleur vers `primary` (#4F7FFF)

#### Scenario: Responsive mobile navbar

- **WHEN** la largeur d'écran est inférieure à 768px
- **THEN** les liens de navigation et boutons sont accessibles via un menu hamburger

### Requirement: Footer SHALL display branding and legal links

Le footer MUST afficher "Vocalia" (logo/texte) à gauche, le copyright "© 2024 VOCALIA AI. BUILT FOR THE SONIC ARCHITECT." en bas à gauche, et les liens légaux (Privacy Policy, Terms of Service, Security, Status) alignés à droite.

#### Scenario: Footer rendu

- **WHEN** la page est complètement chargée
- **THEN** le footer est visible en bas de page avec le branding et les liens légaux sur fond `background` (#0A0B0F)

#### Scenario: Liens légaux cliquables

- **WHEN** l'utilisateur clique sur un lien légal (ex: Privacy Policy)
- **THEN** le lien redirige vers la route correspondante (ex: `/privacy`)

### Requirement: Page SHALL include SEO metadata

Le système MUST définir les metadata Next.js avec le titre "Vocalia — L'Architecture Sonore de votre Relation Client", une description en français, et les balises Open Graph appropriées.

#### Scenario: Metadata présentes dans le HTML

- **WHEN** un moteur de recherche crawle la page `/`
- **THEN** les balises `<title>`, `<meta name="description">`, et `<meta property="og:*">` sont présentes avec du contenu en français
