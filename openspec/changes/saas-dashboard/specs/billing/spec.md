## ADDED Requirements

### Requirement: Solde et quota du cycle en cours
Le système SHALL afficher en haut de page le cycle actuel avec : minutes utilisées/incluses, barre de progression, jours restants, montant estimé.

#### Scenario: Affichage quota cycle
- **WHEN** l'utilisateur accède à `/billing`
- **THEN** le cycle en cours est affiché avec progression et estimation de facturation

### Requirement: Historique des cycles de facturation
Le système SHALL afficher un tableau des cycles passés avec : période, minutes incluses, minutes utilisées, dépassement, montant total, statut (Ouvert/Payé/Annulé), lien facture.

#### Scenario: Affichage historique
- **WHEN** l'utilisateur consulte la facturation
- **THEN** le tableau des cycles passés est visible avec tous les champs définis

### Requirement: Bouton recharge de crédits
Le système SHALL afficher un bouton "Recharger des crédits" permettant d'acheter des minutes supplémentaires.

#### Scenario: Recharge
- **WHEN** l'utilisateur clique sur "Recharger"
- **THEN** un modal ou formulaire de sélection de pack de minutes s'affiche
