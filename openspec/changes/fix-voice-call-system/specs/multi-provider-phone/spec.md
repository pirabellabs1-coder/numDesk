## ADDED Requirements

### Requirement: Phone number creation supports SIP Trunk and Twilio providers

Le système SHALL permettre la création de numéros de téléphone avec deux types de providers : SIP Trunk et Twilio, via un sélecteur visuel dans la modale d'ajout.

#### Scenario: Sélection SIP Trunk
- **WHEN** l'utilisateur ouvre la modale "Ajouter un numéro" et sélectionne "SIP Trunk"
- **THEN** le formulaire affiche les champs : Nom du numéro, Agent inbound (optionnel), Numéro de téléphone

#### Scenario: Sélection Twilio
- **WHEN** l'utilisateur sélectionne "Twilio" dans le sélecteur de provider
- **THEN** le formulaire affiche un champ supplémentaire "Twilio SID" en plus des champs standard

#### Scenario: Persistance du provider
- **WHEN** l'utilisateur crée un numéro avec le provider "twilio" et un SID
- **THEN** le numéro est enregistré en DB avec `provider: "twilio"` et le `twilioSid` associé

### Requirement: Phone number E.164 auto-formatting on creation

Le système SHALL auto-ajouter le préfixe `+` aux numéros de téléphone saisis sans ce préfixe lors de la création.

#### Scenario: Numéro sans préfixe
- **WHEN** l'utilisateur saisit `33187000000` dans le champ numéro
- **THEN** le numéro est enregistré en DB comme `+33187000000`

#### Scenario: Numéro avec préfixe existant
- **WHEN** l'utilisateur saisit `+33187000000`
- **THEN** le numéro est enregistré tel quel

### Requirement: Provider breakdown in KPI section

Le système SHALL afficher la répartition des numéros par provider (SIP Trunk vs Twilio) dans la section KPI de la page numéros.

#### Scenario: KPI providers
- **WHEN** le workspace contient 3 numéros SIP et 2 numéros Twilio
- **THEN** la carte KPI "Providers" affiche "3 SIP" et "2 Twilio" avec les badges de couleur correspondants
