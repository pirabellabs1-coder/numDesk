## ADDED Requirements

### Requirement: Features section SHALL display Performance IA card

Le système MUST afficher une carte "Performance IA" sur fond `#0F1117` avec bordure `white/5`, contenant : le titre "Performance IA" (Syne SemiBold), une icône éclair en `primary`, la description "Réduction de la latence à moins de 200ms. Vos clients ne sauront jamais qu'ils parlent à une intelligence artificielle.", deux badges ("LIVE STATE" en `tertiary`, "ULTRA LOW LATENCY" en `primary`), et une visualisation waveform/spectre audio.

#### Scenario: Carte Performance IA rendue

- **WHEN** la page est chargée et l'utilisateur scrolle jusqu'à la section features
- **THEN** la carte Performance IA est visible avec tous ses éléments (titre, icône, description, badges, waveform)

#### Scenario: Badges affichés correctement

- **WHEN** la carte Performance IA est visible
- **THEN** les badges "LIVE STATE" et "ULTRA LOW LATENCY" sont affichés en uppercase, texte 10px bold, avec fond couleur/10 et texte couleur

### Requirement: Features section SHALL display Voix Naturelles card

Le système MUST afficher une carte "Voix Naturelles" sur fond `#0F1117` avec bordure `white/5`, contenant : le titre "Voix Naturelles", la description "Plus de 50 modèles de voix premium avec intonations émotionnelles ajustables.", et un sélecteur visuel montrant des exemples de voix (ex: "Modèle: Gabriel (FR)" actif en `primary`, "Modèle: Sophie (FR)" en état normal).

#### Scenario: Carte Voix Naturelles rendue

- **WHEN** la page est chargée et l'utilisateur scrolle jusqu'à la section features
- **THEN** la carte Voix Naturelles est visible avec le titre, la description et le sélecteur de voix

#### Scenario: Sélecteur de voix met en avant le modèle actif

- **WHEN** la carte Voix Naturelles est visible
- **THEN** le modèle "Gabriel (FR)" est visuellement mis en avant avec fond `primary/10` et texte `primary`, tandis que "Sophie (FR)" est en style neutre

### Requirement: Features section SHALL be responsive

Le système MUST afficher les deux cartes côte à côte sur desktop (grille 2 colonnes) et empilées verticalement sur mobile.

#### Scenario: Layout desktop

- **WHEN** la largeur d'écran est supérieure à 1024px
- **THEN** les deux cartes sont affichées côte à côte dans une grille 2 colonnes

#### Scenario: Layout mobile

- **WHEN** la largeur d'écran est inférieure à 768px
- **THEN** les deux cartes sont empilées verticalement, chacune prenant 100% de la largeur
