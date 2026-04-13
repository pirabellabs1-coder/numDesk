## MODIFIED Requirements

### Requirement: Voice preview uses Cartesia sonic-2 model

Le preview audio des voix Cartesia SHALL utiliser le modèle `sonic-2` avec le paramètre `language: "fr"` au lieu du modèle déprécié `sonic-french`.

#### Scenario: Preview voix Cartesia
- **WHEN** l'utilisateur clique sur le bouton de preview d'une voix Cartesia dans l'onglet PAROLE
- **THEN** la requête TTS envoyée à Cartesia utilise `model_id: "sonic-2"` et `language: "fr"`

#### Scenario: Format de sortie audio
- **WHEN** le preview est généré avec succès
- **THEN** le fichier audio retourné est au format MP3, encodé en base64, sample rate 24000 Hz

### Requirement: Chatbot test uses current Gemini model

Le chatbot de test SHALL utiliser le modèle `gemini-2.5-flash` au lieu du modèle déprécié `gemini-2.0-flash`.

#### Scenario: Test chatbot
- **WHEN** l'utilisateur ouvre le mode CHATBOT dans la modale de test
- **THEN** les requêtes sont envoyées au endpoint Gemini avec le modèle `gemini-2.5-flash`

#### Scenario: Erreur modèle déprécié
- **WHEN** le modèle configuré n'est plus disponible chez Google
- **THEN** le système utilise le dernier modèle Gemini stable configuré (`gemini-2.5-flash`)
