## ADDED Requirements

### Requirement: Dashboard admin global
Le système SHALL afficher une page admin avec KPIs globaux : total membres, workspaces actifs, minutes consommées ce mois, revenus du mois.

#### Scenario: Accès admin
- **WHEN** l'utilisateur admin accède à `/admin`
- **THEN** les KPIs globaux de la plateforme sont affichés

### Requirement: Liste des membres et workspaces
Le système SHALL afficher la liste de tous les membres avec : email, nb workspaces, statut, boutons (voir détail, suspendre).

#### Scenario: Affichage liste membres
- **WHEN** l'utilisateur admin consulte la section membres
- **THEN** tous les membres sont listés avec leurs informations et actions disponibles

### Requirement: Allocation manuelle de minutes
Le système SHALL permettre d'ajouter des minutes manuellement à un workspace via un modal.

#### Scenario: Allocation minutes
- **WHEN** l'admin clique sur "Ajouter des minutes" pour un workspace
- **THEN** un modal s'ouvre avec un champ numérique pour saisir les minutes à ajouter et un bouton de confirmation

### Requirement: Graphique activité globale
Le système SHALL afficher un graphique des appels quotidiens sur les 30 derniers jours.

#### Scenario: Graphique mock
- **WHEN** l'admin consulte le dashboard
- **THEN** un graphique (barres ou courbe) illustre l'activité des 30 derniers jours avec données mock
