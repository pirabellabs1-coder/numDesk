## ADDED Requirements

### Requirement: Liste des agents en cartes
Le système SHALL afficher les agents sous forme de cartes avec : avatar gradient, nom, statut (actif/inactif toggle), nombre d'appels, durée moyenne, boutons action (tester, dupliquer, supprimer).

#### Scenario: Affichage de la liste des agents
- **WHEN** l'utilisateur accède à `/agents`
- **THEN** les agents sont affichés en grille de cartes avec toutes les informations définies

#### Scenario: Toggle actif/inactif
- **WHEN** l'utilisateur clique sur le toggle d'un agent
- **THEN** l'état visuel bascule entre actif (tertiary) et inactif (surface-container-high)

### Requirement: Bouton "Nouvel Agent"
Le système SHALL afficher un bouton "Nouvel Agent" en gradient dans la topbar ou en en-tête de page.

#### Scenario: Création d'agent
- **WHEN** l'utilisateur clique sur "+ Nouvel Agent"
- **THEN** la navigation redirige vers `/agents/new` ou un modal de création s'ouvre

### Requirement: Navigation vers l'éditeur
Le système SHALL permettre d'accéder à l'éditeur d'un agent en cliquant sur sa carte.

#### Scenario: Ouverture éditeur
- **WHEN** l'utilisateur clique sur une carte d'agent
- **THEN** la navigation redirige vers `/agents/[id]`

### Requirement: État vide (no agents)
Le système SHALL afficher un état vide illustré quand aucun agent n'existe encore.

#### Scenario: Liste vide
- **WHEN** l'utilisateur n'a aucun agent créé
- **THEN** un écran d'état vide avec illustration et bouton "Créer votre premier agent" est affiché
