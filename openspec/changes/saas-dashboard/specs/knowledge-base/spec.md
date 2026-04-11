## ADDED Requirements

### Requirement: Liste des bases de connaissances
Le système SHALL afficher les bases de connaissances existantes avec : nom, mode (Full Context / RAG), nombre de fichiers, date de création, actions (modifier, supprimer).

#### Scenario: Affichage liste KB
- **WHEN** l'utilisateur accède à `/knowledge`
- **THEN** les bases de connaissances sont listées en cartes avec mode badge et fichiers count

### Requirement: Création et upload de fichiers
Le système SHALL permettre de créer une base avec un nom, choisir le mode, et uploader des fichiers (PDF, DOCX, TXT, CSV) par drag-and-drop ou clic.

#### Scenario: Upload de fichier
- **WHEN** l'utilisateur dépose un fichier dans la zone d'upload
- **THEN** le fichier s'affiche dans la liste avec son nom, taille et type

#### Scenario: Badge mode Full Context vs RAG
- **WHEN** l'utilisateur consulte une base
- **THEN** le mode est affiché comme badge : Full Context (primary/10) ou RAG (secondary/10)
