---
name: superpower
description: >
  Utiliser ce skill quand l'utilisateur veut maximiser la productivité sur une
  session : "mode superpower", "full speed", "on se lance", "implémente tout",
  "fais-le complet", "go", ou quand il donne une grande fonctionnalité à
  développer d'un coup. Ce skill active un mode d'exécution structuré,
  autonome et exhaustif qui minimise les allers-retours.
---

# Skill — Mode Superpower Vocalia

## Principe

En mode Superpower, Claude travaille comme un développeur senior autonome :
il analyse, planifie, exécute et valide sans attendre de confirmation à chaque
étape. Les allers-retours sont réduits au minimum. La livraison est complète
et directement utilisable.

---

## Protocole d'activation

Quand ce skill est activé sur une tâche, suivre ce protocole dans l'ordre :

### 1. ANALYSE (30 secondes mentales, pas de message)

Avant d'écrire une seule ligne de code, analyser silencieusement :
- Quels fichiers vont être créés ou modifiés ?
- Quelles dépendances sont nécessaires (déjà installées ?) ?
- Quels types TypeScript doivent être définis ?
- Quelles routes API sont nécessaires ?
- Quels composants UI sont nécessaires ?
- Y a-t-il des risques sécurité à anticiper ?

### 2. PLAN (afficher à l'utilisateur)

Avant de coder, présenter un plan en 10 secondes de lecture :

```markdown
## Plan d'exécution — [Fonctionnalité]

**Fichiers à créer :**
- `app/(dashboard)/workspace/[id]/agents/page.tsx`
- `app/api/agents/route.ts`
- `components/agents/AgentCard.tsx`
- `lib/agents.ts`

**Fichiers à modifier :**
- `server/routes/agents.ts` — ajouter les endpoints CRUD

**Ordre d'exécution :**
1. Types TypeScript (Agent, CreateAgentInput)
2. Service backend (lib/agents.ts)
3. Routes API (app/api/agents/)
4. Composants UI (AgentCard, AgentList)
5. Page principale
6. Tests Playwright

Durée estimée : ~20 fichiers, je commence maintenant.
```

### 3. EXÉCUTION (mode autonome)

Exécuter dans l'ordre optimal :

```
TypeScript types → DB queries → API routes → Server actions
→ Composants UI (du plus petit au plus grand)
→ Page principale → Tests
```

**Règles d'exécution autonome :**
- Ne pas demander de confirmation pour des choix évidents
- Prendre les décisions techniques seul (nommage, structure) en respectant
  les conventions Vocalia déjà établies
- Si un choix est vraiment ambigu, faire une note en commentaire `// TODO: valider`
  et continuer plutôt que de bloquer
- Chaque fichier livré est complet et fonctionnel — pas de `// TODO: implement`

### 4. LIVRAISON

À la fin, présenter un résumé structuré :

```markdown
## Livraison — [Fonctionnalité] ✅

### Fichiers créés
- `[chemin]` — [rôle du fichier]

### Fichiers modifiés
- `[chemin]` — [ce qui a changé]

### Variables d'environnement nécessaires
- `VAPI_API_KEY=` — clé API Vapi (côté serveur uniquement)

### Pour tester
1. `npm run dev`
2. Aller sur `/workspace/[id]/agents`
3. Cliquer sur "+ Nouvel Agent"

### Tests Playwright générés
- `tests/e2e/agents.spec.ts` — 8 tests couvrant les parcours principaux

### Prochaine étape suggérée
[Tâche suivante logique dans le MVP]
```

---

## Heuristiques de décision autonome

En mode Superpower, appliquer ces règles sans demander :

| Situation | Décision automatique |
|---|---|
| Nom de fichier ambigu | Suivre la convention Next.js App Router |
| Type de retour API | `{ data: T, meta: { requestId, timestamp } }` |
| Gestion d'erreur | try/catch + log serveur + réponse 400/500 en français |
| Validation formulaire | zod côté client ET côté serveur |
| Composant ou page ? | Page si route, composant si réutilisable |
| Fetch côté client ou serveur ? | Serveur par défaut, client si interaction nécessaire |
| Nom de variable en FR ou EN ? | Anglais dans le code, français dans les labels UI |
| Loading state | Skeleton pour les listes, spinner pour les actions |
| Toast succès | "X créé avec succès" ou "X sauvegardé" |
| Toast erreur | "Une erreur est survenue. Veuillez réessayer." |

---

## Limites du mode autonome

Interrompre et demander validation uniquement si :
- Une décision va modifier le schéma de base de données existant
- Une décision va supprimer des données ou des fichiers existants
- Une dépendance npm non approuvée est nécessaire
- Une fonctionnalité est hors périmètre MVP/V1 (selon PRD.md)
- Il y a un conflit de sécurité évident

Dans ces cas, présenter le problème en une phrase et proposer 2 options maximum.
Ne pas faire un long exposé — l'utilisateur veut de la vitesse.

---

## Mode Superpower + Mémoire

En fin de session Superpower, toujours :
1. Mettre à jour MEMORY.md avec tous les fichiers créés/modifiés
2. Cocher les tâches dans PRD.md si des fonctionnalités MVP sont terminées
3. Indiquer la prochaine étape prioritaire
