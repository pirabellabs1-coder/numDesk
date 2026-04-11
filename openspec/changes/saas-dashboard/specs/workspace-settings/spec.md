## ADDED Requirements

### Requirement: Onglets paramètres workspace
Le système SHALL afficher 4 onglets : "Profil", "Membres", "Notifications", "Clés API Providers".

#### Scenario: Navigation onglets paramètres
- **WHEN** l'utilisateur accède à `/settings`
- **THEN** les 4 onglets sont visibles avec Profil actif par défaut

### Requirement: Onglet Profil
Le système SHALL afficher et permettre l'édition de : prénom, nom, email, nom d'agence, photo de profil, langue de l'interface.

#### Scenario: Modification du profil
- **WHEN** l'utilisateur modifie ses informations et clique sur "Sauvegarder"
- **THEN** un feedback de succès s'affiche (toast ou message inline)

### Requirement: Onglet Clés API Providers
Le système SHALL afficher des champs pour saisir les clés API des providers tiers (ElevenLabs, OpenAI, Cartesia) avec masquage du contenu.

#### Scenario: Saisie clé API provider
- **WHEN** l'utilisateur saisit une clé API ElevenLabs
- **THEN** la clé est masquée par défaut (type password) avec toggle visibilité
