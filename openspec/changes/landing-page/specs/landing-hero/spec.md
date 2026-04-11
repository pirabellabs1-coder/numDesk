## ADDED Requirements

### Requirement: Hero section SHALL display headline with gradient text

La section hero MUST afficher le surtitre "THE SONIC ARCHITECT" en petites capitales couleur `secondary` (#7B5CFA), suivi du headline principal "L'Architecture Sonore" en blanc et "de votre Relation Client" en gradient `primary` → `secondary` (#4F7FFF → #7B5CFA). Police : Syne Bold, taille display (3.5rem desktop).

#### Scenario: Headline rendu correctement

- **WHEN** la page `/` est chargée
- **THEN** le headline "L'Architecture Sonore de votre Relation Client" est visible avec la deuxième ligne en texte gradient bleu-violet

#### Scenario: Responsive headline

- **WHEN** la largeur d'écran est inférieure à 768px
- **THEN** la taille du headline est réduite proportionnellement tout en restant lisible et centré

### Requirement: Hero section SHALL display subtitle text

Le système MUST afficher un sous-titre descriptif sous le headline : "Transformez chaque interaction téléphonique en une expérience cinématographique. Une latence ultra-faible, une voix indiscernable de l'humain." en couleur `on-surface-variant` (#C3C6D7), police Manrope.

#### Scenario: Sous-titre visible

- **WHEN** la page est chargée
- **THEN** le sous-titre est affiché centré sous le headline principal, en texte secondaire

### Requirement: Hero section SHALL display two CTA buttons

Le système MUST afficher deux boutons côte à côte sous le sous-titre : "Lancer la Console" (bouton primaire avec gradient `primary` → `secondary`, radius 8px) et "Découvrir la démo" (bouton outline/ghost avec icône play).

#### Scenario: CTA primaire cliqué

- **WHEN** l'utilisateur clique sur "Lancer la Console"
- **THEN** l'utilisateur est redirigé vers `/register`

#### Scenario: CTA secondaire cliqué

- **WHEN** l'utilisateur clique sur "Découvrir la démo"
- **THEN** l'utilisateur est redirigé vers une ancre ou une page de démo

#### Scenario: CTA hover effect

- **WHEN** l'utilisateur survole le bouton "Lancer la Console"
- **THEN** le bouton affiche un effet glow (ombre 10px à 20% opacité de la couleur primaire)

### Requirement: Hero section SHALL display animated waveform

Le système MUST afficher une animation waveform (barres verticales arrondies de hauteurs variables) sous les CTA, utilisant un gradient `primary` → `secondary` → `tertiary`. L'animation est en CSS pur (keyframes).

#### Scenario: Waveform animée visible

- **WHEN** la page est chargée
- **THEN** la waveform est visible et animée avec des barres oscillant en continu

#### Scenario: Animation désactivée si préférence utilisateur

- **WHEN** l'utilisateur a activé `prefers-reduced-motion`
- **THEN** la waveform est affichée statiquement sans animation
