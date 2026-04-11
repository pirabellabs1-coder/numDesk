## ADDED Requirements

### Requirement: Onglets API & Webhooks
Le système SHALL afficher 3 onglets : "Tokens API", "Token Providers", "Webhooks".

#### Scenario: Navigation onglets API
- **WHEN** l'utilisateur accède à `/api-webhooks`
- **THEN** les 3 onglets sont visibles avec Tokens API actif par défaut

### Requirement: Gestion des tokens API
Le système SHALL afficher les tokens API avec : nom, préfixe (cmp_xxxx), dernière utilisation, date création, bouton Révoquer. Bouton "Créer un token" affiché en haut.

#### Scenario: Création token
- **WHEN** l'utilisateur clique sur "Créer un token"
- **THEN** un modal demande le nom du token, puis affiche le token complet une seule fois avec alerte de sécurité

#### Scenario: Révocation token
- **WHEN** l'utilisateur clique sur "Révoquer"
- **THEN** un dialog de confirmation s'affiche avant de supprimer le token visuellement

### Requirement: Configuration webhooks
Le système SHALL afficher les webhooks configurés avec : URL, événements cochés, statut actif/inactif, dernière livraison, bouton tester.

#### Scenario: Ajout webhook
- **WHEN** l'utilisateur clique sur "+ Ajouter un webhook"
- **THEN** un formulaire avec URL, sélection d'événements (checkboxes), et secret HMAC s'affiche

#### Scenario: Événements disponibles
- **WHEN** l'utilisateur configure un webhook
- **THEN** les événements disponibles sont : call.started, call.ended, call.transferred, campaign.completed
