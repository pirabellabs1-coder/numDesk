## ADDED Requirements

### Requirement: Onglets numéros SIP et Twilio
Le système SHALL afficher deux onglets : "SIP Trunk Numbers" et "Twilio" (deprecated).

#### Scenario: Navigation onglets téléphonie
- **WHEN** l'utilisateur accède à `/phone-numbers`
- **THEN** les deux onglets sont visibles, SIP Trunk actif par défaut

### Requirement: Liste des numéros SIP
Le système SHALL afficher les numéros SIP en tableau avec : numéro (format E.164), trunk associé, nom, statut actif/inactif, actions (supprimer).

#### Scenario: Affichage tableau numéros
- **WHEN** l'utilisateur consulte l'onglet SIP Trunk Numbers
- **THEN** les numéros sont listés avec toutes les colonnes définies

### Requirement: Formulaire ajout numéro SIP
Le système SHALL afficher un formulaire d'ajout de numéro avec : numéro E.164, sélection du trunk SIP, nom personnalisé.

#### Scenario: Ajout d'un numéro
- **WHEN** l'utilisateur clique sur "+ Ajouter un numéro SIP"
- **THEN** un modal ou formulaire s'ouvre avec les champs requis

### Requirement: Configuration SIP Trunk
Le système SHALL afficher une page de configuration des trunks SIP avec : host, port, username, password (masqué), toggle global.

#### Scenario: Affichage config SIP
- **WHEN** l'utilisateur accède à la configuration SIP
- **THEN** les champs de configuration du trunk sont visibles avec mot de passe masqué par défaut
