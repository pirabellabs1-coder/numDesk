## ADDED Requirements

### Requirement: Ecosystem section SHALL display title and description

Le système MUST afficher le titre "Écosystème Ouvert" (Syne Bold, taille headline) et la description "Intégrez Vocalia dans votre workflow existant en quelques minutes via nos connecteurs natifs." en couleur `on-surface-variant`, accompagné d'un lien/bouton "Documentation API" aligné à droite avec style outline.

#### Scenario: Section écosystème visible

- **WHEN** l'utilisateur scrolle jusqu'à la section écosystème
- **THEN** le titre, la description et le lien Documentation API sont visibles

#### Scenario: Lien Documentation API cliqué

- **WHEN** l'utilisateur clique sur "Documentation API"
- **THEN** l'utilisateur est redirigé vers `/docs`

### Requirement: Ecosystem section SHALL display four integration cards

Le système MUST afficher 4 cartes d'intégration en grille horizontale : "SIP Trunking" (sous-titre : "Connexion directe PBX"), "Webhooks" (sous-titre : "Events temps-réel"), "Twilio" (sous-titre : "Intégration certifiée"), "SDK Node/Python" (sous-titre : "Déploiement rapide"). Chaque carte a un fond `surface-container` (#1F1F24), une icône en `on-surface-variant`, et un radius 12px.

#### Scenario: Quatre cartes d'intégration affichées

- **WHEN** la section écosystème est visible
- **THEN** les 4 cartes sont affichées en grille avec chacune une icône, un titre et un sous-titre

#### Scenario: Responsive des cartes intégration

- **WHEN** la largeur d'écran est inférieure à 768px
- **THEN** les cartes sont affichées en grille 2x2 ou empilées verticalement
