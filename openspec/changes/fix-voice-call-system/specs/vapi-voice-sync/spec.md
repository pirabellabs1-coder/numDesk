## ADDED Requirements

### Requirement: Voice selection persists through save and publish

Le système SHALL persister le `voiceProvider` et le `voiceId` sélectionnés dans l'onglet PAROLE en base de données lors de la sauvegarde de l'agent, et SHALL transmettre ces valeurs directement dans le body de la requête POST `/api/vapi/sync-agent` lors de la publication, en override des valeurs lues en DB.

#### Scenario: Sauvegarde de la voix sélectionnée
- **WHEN** l'utilisateur sélectionne une voix Cartesia "Sophie (Calm)" dans l'onglet PAROLE et clique "Sauvegarder"
- **THEN** les champs `voice_provider` et `voice_id` de l'agent en DB sont mis à jour avec `"cartesia"` et `"a8a1eb38-5f15-4c1d-8722-7ac0f329727d"`

#### Scenario: Publication avec override voix dans le body
- **WHEN** l'utilisateur clique "Publier" après avoir sauvegardé un agent avec une voix Cartesia
- **THEN** la requête POST `/api/vapi/sync-agent` inclut `voiceProvider` et `voiceId` dans le body, et l'assistant Vapi est mis à jour avec la voix correspondante

#### Scenario: Pas de stale data lors de la publication immédiate
- **WHEN** l'utilisateur sauvegarde puis publie immédiatement (latence réplication DB)
- **THEN** les valeurs de voix transmises dans le body de sync-agent sont utilisées en priorité sur les valeurs lues en DB

### Requirement: Incompatible voice providers fall back to French Cartesia

Le système SHALL détecter les providers de voix non supportés par Vapi (notamment "google") et SHALL les remplacer par la voix Cartesia française Sophie (Calm) `a8a1eb38-5f15-4c1d-8722-7ac0f329727d` dans la fonction `getVoiceConfig`.

#### Scenario: Agent avec voix Google publiée vers Vapi
- **WHEN** un agent a `voice_provider: "google"` en DB et est publié vers Vapi
- **THEN** la voix envoyée à Vapi est `{ provider: "cartesia", voiceId: "a8a1eb38-5f15-4c1d-8722-7ac0f329727d" }`

#### Scenario: Provider inconnu
- **WHEN** un agent a un `voice_provider` non reconnu (ni cartesia, ni elevenlabs, ni deepgram)
- **THEN** la voix par défaut Cartesia Sophie (Calm) française est utilisée

### Requirement: Google voices filtered from voice selector

Le système SHALL filtrer les voix avec `provider === "google"` de la liste affichée dans l'onglet PAROLE du sélecteur de voix, car elles ne sont pas supportées par Vapi.

#### Scenario: Affichage du sélecteur de voix
- **WHEN** l'utilisateur ouvre l'onglet PAROLE de l'éditeur d'agent
- **THEN** seules les voix Cartesia, ElevenLabs et Deepgram sont affichées ; les voix Google sont masquées

#### Scenario: Voix Google toujours en DB
- **WHEN** une voix Google existe dans la table `voices` en DB
- **THEN** elle n'est pas supprimée de la DB (conservée pour un usage futur) mais n'apparaît pas dans le sélecteur
