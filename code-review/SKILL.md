---
name: code-review
description: >
  Utiliser ce skill quand l'utilisateur demande une revue de code, un audit,
  "vérifie ce fichier", "est-ce que c'est bon ?", "review", "check mon code",
  ou avant tout merge/commit important. Effectue une revue exhaustive selon
  les standards du projet Vocalia : sécurité, performance, cohérence avec
  l'architecture, qualité du code TypeScript/React/Fastify.
---

# Skill — Code Review Vocalia

## Processus de revue

Toujours effectuer la revue dans cet ordre. Ne pas sauter d'étape.

---

## ÉTAPE 1 — Lecture et compréhension

Avant tout commentaire :
- Lire le fichier entier, pas seulement les parties modifiées
- Identifier le rôle du fichier dans l'architecture Vocalia
- Vérifier dans ARCHITECTURE.md si la structure attendue est respectée
- Identifier les dépendances et leur usage

---

## ÉTAPE 2 — Checklist Sécurité (CRITIQUE — bloquant)

Ces points sont **bloquants**. Un seul échec = la PR ne peut pas merger.

```
[ ] Aucune clé API, secret ou credential dans le code (même en commentaire)
[ ] Toutes les variables d'env utilisées sont préfixées correctement
    - Client : NEXT_PUBLIC_ uniquement pour les valeurs non-sensibles
    - Serveur : jamais de NEXT_PUBLIC_ pour les secrets
[ ] Les entrées utilisateur sont validées avec zod avant tout traitement
[ ] Les routes API vérifient l'authentification et les permissions RBAC
    - Un membre ne peut accéder qu'à ses workspaces
    - Les IDs dans les URLs sont vérifiés contre l'utilisateur connecté
[ ] Pas de SQL brut (utiliser drizzle-orm uniquement)
[ ] Les tokens API sont hashés SHA-256 avant stockage
[ ] Les webhooks sortants signent le payload HMAC-SHA256
[ ] Pas de console.log contenant des données sensibles (tokens, passwords, numéros)
[ ] Les credentials SIP sont chiffrés avant persistance
```

---

## ÉTAPE 3 — Checklist Architecture (Important — peut bloquer)

```
[ ] Le fichier est dans le bon répertoire selon la convention Next.js App Router
    - /app/(dashboard)/... pour les pages authentifiées
    - /app/api/... pour les routes API
    - /components/ui/... pour les composants shadcn/ui
    - /components/... pour les composants métier
    - /lib/... pour les utilitaires et services
    - /server/... pour la logique Fastify
[ ] Les Server Components et Client Components sont correctement séparés
    - "use client" uniquement si nécessaire (state, events, browser APIs)
    - Pas de fetch dans les Client Components → utiliser des Server Actions ou hooks
[ ] Les appels à Vapi sont faits côté serveur uniquement
[ ] La structure des types TypeScript correspond aux tables de ARCHITECTURE.md
[ ] Pas de logique métier dans les composants UI
[ ] Les erreurs sont gérées et retournées en français à l'utilisateur
```

---

## ÉTAPE 4 — Checklist Qualité TypeScript

```
[ ] Pas de `any` explicite (utiliser `unknown` + type guard si nécessaire)
[ ] Pas de `as` forcé sans commentaire justificatif
[ ] Les types sont exportés et réutilisés (pas de duplication)
[ ] Les fonctions async ont leur gestion d'erreur (try/catch ou .catch())
[ ] Les props des composants React sont typées avec une interface nommée
[ ] Les réponses API ont un type de retour explicite
[ ] Pas de variables non utilisées
[ ] Les imports sont triés : externes → internes → relatifs
```

---

## ÉTAPE 5 — Checklist Performance

```
[ ] Les requêtes base de données sont dans des Server Components ou Server Actions
[ ] Pas de N+1 : les relations sont chargées avec JOIN, pas en boucle
[ ] Les images utilisent next/image avec width et height
[ ] Les composants lourds sont lazy-loadés si pertinent
[ ] Les listes longues utilisent une pagination ou virtualisation
[ ] Pas de useEffect pour des données qui peuvent être fetchées côté serveur
[ ] Le cache Next.js est utilisé correctement (revalidate, tags)
```

---

## ÉTAPE 6 — Checklist UI/UX (spécifique Vocalia)

```
[ ] Fond blanc, pas de dark mode (règle MVP du CLAUDE.md)
[ ] Composants shadcn/ui utilisés sans sur-personnalisation
[ ] Textes et labels en français
[ ] Les états vides sont gérés (empty states avec illustration et CTA)
[ ] Les états de chargement sont gérés (skeleton ou spinner)
[ ] Les erreurs API affichent un message compréhensible en français
[ ] Interface responsive : vérifier au moins 375px et 1280px
[ ] Les formulaires ont une validation côté client (react-hook-form + zod)
    ET côté serveur (zod)
```

---

## FORMAT DE RETOUR

Toujours structurer le retour de cette façon :

```markdown
## Code Review — [nom du fichier]

### 🔴 Bloquants (à corriger avant de continuer)
- [problème] → [ligne X] → [correction suggérée]

### 🟡 Importants (à corriger dans cette session)
- [problème] → [ligne X] → [correction suggérée]

### 🟢 Suggestions (à faire si le temps le permet)
- [amélioration] → [ligne X] → [pourquoi c'est mieux]

### ✅ Points positifs
- [ce qui est bien fait]

### Score global
Sécurité : X/10 | Architecture : X/10 | Qualité : X/10 | UI : X/10
```

Si tout est bon : le dire clairement avec "✅ Code approuvé — aucun problème détecté."
Ne pas inventer des problèmes pour paraître exhaustif.
