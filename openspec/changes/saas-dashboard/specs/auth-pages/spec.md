## ADDED Requirements

### Requirement: Page de connexion
Le système SHALL afficher une page de connexion avec email et mot de passe sur fond dark centré, logo Vocalia, bouton gradient primary→secondary, et lien vers register.

#### Scenario: Affichage de la page login
- **WHEN** l'utilisateur accède à `/login`
- **THEN** la page affiche le logo Vocalia en haut, un formulaire centré (email + mot de passe), bouton "Se connecter" en gradient, lien "Créer un compte" et lien "Mot de passe oublié"

#### Scenario: Navigation vers register
- **WHEN** l'utilisateur clique sur "Créer un compte"
- **THEN** la navigation redirige vers `/register`

### Requirement: Page d'inscription
Le système SHALL afficher une page d'inscription avec prénom, nom, email, mot de passe, nom d'agence et bouton de création de compte.

#### Scenario: Affichage de la page register
- **WHEN** l'utilisateur accède à `/register`
- **THEN** la page affiche un formulaire avec champs prénom, nom, agence, email, mot de passe, et bouton "Créer mon compte"

#### Scenario: Navigation vers login
- **WHEN** l'utilisateur clique sur "J'ai déjà un compte"
- **THEN** la navigation redirige vers `/login`

### Requirement: Layout auth centré
Le système SHALL utiliser un layout auth séparé sans sidebar, avec fond bg-background (#0A0B0F), grain overlay, et contenu centré verticalement.

#### Scenario: Layout isolé
- **WHEN** l'utilisateur est sur une page auth
- **THEN** aucune sidebar ni topbar dashboard n'est visible, seule la page auth centrée s'affiche
