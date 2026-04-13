## ADDED Requirements

### Requirement: Auto-detect Vapi phoneNumberId for outbound calls

Le système SHALL auto-détecter le `phoneNumberId` Vapi en appelant `listVapiPhoneNumbers()` lorsque aucun `phoneNumberId` n'est fourni à `createVapiCall`. Le premier numéro disponible est utilisé.

#### Scenario: Numéro Vapi disponible
- **WHEN** `createVapiCall` est appelé sans `phoneNumberId` et au moins un numéro est enregistré dans Vapi
- **THEN** le système utilise automatiquement l'ID du premier numéro Vapi disponible pour l'appel sortant

#### Scenario: Aucun numéro Vapi enregistré
- **WHEN** `createVapiCall` est appelé sans `phoneNumberId` et aucun numéro n'est enregistré dans Vapi
- **THEN** le système lève une erreur avec le message français : "Aucun numéro de téléphone configuré dans Vapi. Importez d'abord un numéro Twilio ou SIP dans votre compte Vapi pour passer des appels sortants."

### Requirement: E.164 phone number normalization

Le système SHALL normaliser les numéros de téléphone au format E.164 (préfixe `+`) côté client (test-modal) et côté serveur (call-test API) avant tout appel Vapi.

#### Scenario: Numéro sans préfixe +
- **WHEN** l'utilisateur saisit `33612345678` dans le champ de test d'appel CUSTOM
- **THEN** le numéro est normalisé en `+33612345678` avant l'envoi à Vapi

#### Scenario: Numéro déjà au format E.164
- **WHEN** l'utilisateur saisit `+33612345678`
- **THEN** le numéro est envoyé tel quel sans modification

#### Scenario: Normalisation côté serveur (double sécurité)
- **WHEN** la route `/api/vapi/call-test` reçoit un numéro sans `+`
- **THEN** le serveur ajoute le préfixe `+` avant de passer l'appel à Vapi

### Requirement: Clear French error messages for call failures

Le système SHALL afficher des messages d'erreur en français explicites pour tous les cas d'échec d'appel sortant, incluant la cause et l'action corrective.

#### Scenario: Erreur Vapi générique
- **WHEN** Vapi retourne une erreur HTTP lors de la création d'un appel
- **THEN** le message d'erreur affiché contient le code HTTP et le détail Vapi, en français

#### Scenario: Erreur numéro manquant
- **WHEN** l'appel échoue car aucun `phoneNumberId` n'est disponible
- **THEN** le message guide l'utilisateur vers la configuration Vapi pour importer un numéro
