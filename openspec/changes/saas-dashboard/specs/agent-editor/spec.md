## ADDED Requirements

### Requirement: Topbar éditeur agent
Le système SHALL afficher une topbar spécifique à l'éditeur avec : bouton retour, nom de l'agent, boutons SAUVEGARDER / ESSAYER / PUBLIER, et indicateur "Production".

#### Scenario: Affichage topbar éditeur
- **WHEN** l'utilisateur est sur `/agents/[id]`
- **THEN** la topbar affiche les boutons d'action de l'éditeur et le nom de l'agent

### Requirement: Navigation par onglets (6 tabs)
Le système SHALL afficher 6 onglets de navigation : AGENT, PAROLE, OUTILS, RÉGLAGES, ANALYSES, API.

#### Scenario: Navigation entre onglets
- **WHEN** l'utilisateur clique sur un onglet
- **THEN** le contenu de l'onglet sélectionné s'affiche, l'onglet actif est souligné en primary

### Requirement: Onglet AGENT
Le système SHALL afficher dans l'onglet AGENT : informations de base (nom, numéro entrant), prompt principal (textarea), messagerie vocale (toggle + message), première phrase (toggle + prompt + délai), silence/relance (toggle + délai + nb retries + prompt), bases de connaissances.

#### Scenario: Formulaire onglet Agent
- **WHEN** l'utilisateur sélectionne l'onglet AGENT
- **THEN** tous les champs de configuration de base sont visibles et editables

### Requirement: Onglet PAROLE
Le système SHALL afficher dans l'onglet PAROLE : langue ISO, sélecteur de voix (provider + nom + genre), bruit de fond, règles d'override, hésitations naturelles (toggle), prononciation des nombres.

#### Scenario: Sélection de voix
- **WHEN** l'utilisateur consulte l'onglet PAROLE
- **THEN** le sélecteur affiche les voix disponibles (ex: Cartesia - Gabriel - male - fr-FR)

### Requirement: Onglet RÉGLAGES
Le système SHALL afficher dans l'onglet RÉGLAGES : toggles enregistrement (session + audio), sélecteur LLM, sliders Top P (0→1) et Température (0→2), tags de conversation.

#### Scenario: Configuration LLM
- **WHEN** l'utilisateur consulte l'onglet RÉGLAGES
- **THEN** le sélecteur LLM propose Gemini 2.5 Flash, GPT-4o, Claude 3.5 Haiku

### Requirement: Onglet ANALYSES
Le système SHALL afficher dans l'onglet ANALYSES : métriques totales (appels, durée moyenne, taux de complétion), graphiques par période, distribution des statuts.

#### Scenario: Affichage des métriques agent
- **WHEN** l'utilisateur sélectionne l'onglet ANALYSES
- **THEN** les métriques de l'agent sont affichées avec graphiques (statiques/mock)

### Requirement: Onglet API
Le système SHALL afficher dans l'onglet API les IDs : Company ID, Workspace ID, Agent ID, avec boutons copier, et la configuration JSON en lecture seule.

#### Scenario: Copie d'un ID
- **WHEN** l'utilisateur clique sur "Copier" à côté d'un ID
- **THEN** l'ID est copié dans le presse-papiers et un feedback visuel s'affiche
