## MODIFIED Requirements

### Requirement: Agent publish transmits voice overrides to sync-agent

Le flux de publication de l'agent SHALL transmettre les overrides `voiceProvider` et `voiceId` directement dans le body de la requête POST `/api/vapi/sync-agent`, en plus des données lues en DB, pour éviter les lectures périmées dues à la latence de réplication.

#### Scenario: Publication avec voix modifiée
- **WHEN** l'utilisateur modifie la voix dans l'onglet PAROLE, sauvegarde, puis clique "Publier"
- **THEN** la requête de publication inclut `voiceProvider` et `voiceId` des edits locaux dans le body, et l'assistant Vapi reçoit la voix correcte

#### Scenario: Publication sans modification de voix
- **WHEN** l'utilisateur publie un agent sans avoir modifié la voix
- **THEN** le système utilise les valeurs voix de la DB (pas d'override dans le body)

### Requirement: Agent save invalidates both agent list and detail queries

La sauvegarde d'un agent SHALL invalider les query keys `["agents"]` (liste) ET `["agent"]` (détail) dans React Query pour garantir la cohérence des données affichées après mutation.

#### Scenario: Sauvegarde avec invalidation
- **WHEN** l'utilisateur sauvegarde un agent via le hook `useUpdateAgent`
- **THEN** les deux query keys `["agents"]` et `["agent"]` sont invalidées, et les données affichées dans la liste et le détail sont rafraîchies
