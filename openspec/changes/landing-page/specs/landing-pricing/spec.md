## ADDED Requirements

### Requirement: Pricing section SHALL display title and subtitle

Le système MUST afficher le titre "Investissez dans l'Excellence" (Syne Bold, centré) et le sous-titre "Des tarifs transparents conçus pour la mise à l'échelle, de la startup à l'entreprise globale." en couleur `on-surface-variant`.

#### Scenario: Titre pricing visible

- **WHEN** l'utilisateur scrolle jusqu'à la section pricing
- **THEN** le titre et le sous-titre sont affichés centrés au-dessus de la grille tarifaire

### Requirement: Pricing section SHALL display three pricing tiers

Le système MUST afficher 3 colonnes de tarification :

1. **Starter** : 0.05€/min, inclut "2 Voix Standards", "Accès API REST", "Support Communauté", bouton "Démarrer gratuitement" (outline)
2. **Pro** : 0.12€/min, badge "PLUS POPULAIRE" en `secondary`, inclut "Toutes les Voix Premium", "Analyse de Sentiment Live", "Connecteur Twilio/SIP", "Support Prioritaire 24/7", bouton "Choisir Pro" (primaire gradient, pleine largeur)
3. **Enterprise** : "Sur mesure", inclut "Modèles de voix personnalisées", "Déploiement On-Premise", "SLA de 99.99%", "Key Account Manager", bouton "Contacter Ventes" (outline)

#### Scenario: Trois tiers affichés

- **WHEN** la section pricing est visible
- **THEN** les 3 colonnes Starter, Pro et Enterprise sont affichées côte à côte

#### Scenario: Plan Pro visuellement mis en avant

- **WHEN** la section pricing est visible
- **THEN** la carte Pro est visuellement surélevée par rapport aux autres, avec un badge "PLUS POPULAIRE" et un fond distinct (plus clair ou bordure `secondary`)

#### Scenario: Responsive pricing

- **WHEN** la largeur d'écran est inférieure à 768px
- **THEN** les 3 colonnes sont empilées verticalement avec le plan Pro affiché en premier

### Requirement: Pricing section SHALL include a final CTA block

Le système MUST afficher une section CTA finale avec un fond arrondi distinct (gradient ou surface surélevée), le titre "Prêt à réinventer votre voix ?", la description "Rejoignez les leaders du marché qui utilisent déjà Vocalia pour orchestrer leur relation client.", et deux boutons : "Lancer la Console" (outline) et "Parler à un expert" (primaire gradient).

#### Scenario: CTA finale visible

- **WHEN** l'utilisateur scrolle jusqu'à la fin de la section pricing
- **THEN** le bloc CTA est visible avec le titre, la description et les deux boutons

#### Scenario: Bouton "Parler à un expert" cliqué

- **WHEN** l'utilisateur clique sur "Parler à un expert"
- **THEN** l'utilisateur est redirigé vers un lien de contact (ex: `mailto:` ou `/contact`)
