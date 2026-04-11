## ADDED Requirements

### Requirement: Dashboard campagnes
Le système SHALL afficher une page campagnes avec KPIs (appels total, succès, en attente), liste des campagnes actives avec progression, et bouton "Nouvelle Campagne".

#### Scenario: Affichage page campagnes
- **WHEN** l'utilisateur accède à `/campaigns`
- **THEN** la page affiche les KPIs et la liste des campagnes avec leur statut et progression

### Requirement: Liste des campagnes avec statuts
Le système SHALL afficher les campagnes sous forme de cartes ou tableau avec : nom, agent, statut (Draft/Active/En pause/Terminée), barre de progression (appelés/total), date, actions (pause/reprise/arrêt).

#### Scenario: Progression en temps réel visuelle
- **WHEN** une campagne est active
- **THEN** une barre de progression gradient indique le pourcentage d'appels effectués

#### Scenario: Actions sur campagne
- **WHEN** l'utilisateur clique sur Pause/Reprise/Arrêt
- **THEN** l'état visuel de la campagne se met à jour immédiatement

### Requirement: Formulaire de création campagne
Le système SHALL afficher un formulaire/modal de création avec : nom, agent (dropdown), numéro émetteur (dropdown), contacts (upload CSV ou saisie), plage horaire, nb tentatives max.

#### Scenario: Upload CSV contacts
- **WHEN** l'utilisateur sélectionne un fichier CSV
- **THEN** le nombre de contacts importés est affiché
