## ADDED Requirements

### Requirement: Liste des conversations avec filtres
Le système SHALL afficher un tableau des conversations avec colonnes : Date, Type (tél/web), Sens (entrant/sortant), Agent, Numéro (pseudonymisé), Statut (badge), Durée, Facturé, Actions.

#### Scenario: Affichage liste conversations
- **WHEN** l'utilisateur accède à `/conversations`
- **THEN** le tableau affiche toutes les conversations avec les colonnes définies

#### Scenario: Filtres disponibles
- **WHEN** l'utilisateur utilise les filtres
- **THEN** les filtres disponibles sont : date (today/date/mois), agent (dropdown), sentiment (positif/neutre/négatif), statut

### Requirement: Panneau de détail conversation
Le système SHALL afficher un panneau de détail à droite (ou page dédiée) avec : transcript complet (format chat), audio player, résumé IA, métadonnées.

#### Scenario: Ouverture du détail
- **WHEN** l'utilisateur clique sur "Voir" ou sur une ligne de conversation
- **THEN** le panneau de détail s'ouvre avec le transcript, la durée, le numéro, l'agent, le statut

#### Scenario: Transcript format chat
- **WHEN** l'utilisateur consulte le transcript
- **THEN** les messages alternent agent (bulles à gauche, bg-surface-container-low) et utilisateur (bulles à droite), avec timestamp

### Requirement: Badges de statut conversation
Le système SHALL afficher des badges colorés pour les statuts : Succès (tertiary/10 text-tertiary), Manqué (white/5 text-on-surface-variant), Interrompu (error/10 text-error), Voicemail (secondary/10 text-secondary).

#### Scenario: Badge coloré selon statut
- **WHEN** la liste affiche une conversation terminée
- **THEN** le badge de statut utilise la couleur correspondante
