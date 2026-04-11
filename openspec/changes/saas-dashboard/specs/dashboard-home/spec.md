## ADDED Requirements

### Requirement: En-tête de bienvenue et quota usage
Le système SHALL afficher un en-tête avec "Bonjour, [Prénom]", sous-titre activité, et une carte quota usage (barre de progression, minutes utilisées/incluses, jours restants).

#### Scenario: Affichage du tableau de bord principal
- **WHEN** l'utilisateur accède à `/dashboard`
- **THEN** la page affiche "Bonjour, [nom]", le sous-titre d'activité, et la carte quota en haut à droite

### Requirement: Grille de 4 stats KPI
Le système SHALL afficher 4 cartes de métriques : Minutes utilisées (icône timer, tendance %), Minutes restantes (hourglass), Total Appels (call, tendance %), Taux de décroché (percent).

#### Scenario: Affichage des KPIs
- **WHEN** l'utilisateur consulte le tableau de bord
- **THEN** les 4 cartes KPI sont visibles en grille 4 colonnes sur desktop, avec icône colorée, valeur en Syne bold, et indicateur de tendance (tertiary ou error)

### Requirement: Table des conversations récentes
Le système SHALL afficher un tableau des 4-5 dernières conversations avec colonnes : Appelant (numéro pseudonymisé), Agent IA, Durée (format MM:SS), Statut (badge coloré), Date.

#### Scenario: Affichage des conversations récentes
- **WHEN** l'utilisateur consulte le tableau de bord
- **THEN** le tableau affiche les dernières conversations avec les colonnes définies, bordures divide-white/5, hover:bg-white/[0.02]

#### Scenario: Lien "Voir tout"
- **WHEN** l'utilisateur clique sur "Voir tout"
- **THEN** la navigation redirige vers `/conversations`

### Requirement: Widget activité en direct
Le système SHALL afficher un widget "Activité en direct" avec : badge LIVE (tertiary pulsant), waveform visuelle, carte "Appel en cours", carte "Traitement AI".

#### Scenario: Affichage activité live
- **WHEN** l'utilisateur consulte le tableau de bord
- **THEN** le widget activité en direct est visible avec point tertiary animé (animate-ping), waveform bars, et 2 cartes d'état

### Requirement: Card "Optimisez vos agents"
Le système SHALL afficher une carte d'incitation avec icône auto_awesome, titre, description et bouton "Configurer le savoir" reliant vers `/knowledge`.

#### Scenario: Navigation vers knowledge base
- **WHEN** l'utilisateur clique sur "Configurer le savoir"
- **THEN** la navigation redirige vers `/knowledge`
