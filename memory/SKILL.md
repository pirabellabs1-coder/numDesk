---
name: memory
description: >
  Utiliser ce skill au début de chaque session de travail sur Vocalia, ou quand
  l'utilisateur dit "reprends le contexte", "où en est-on", "rappelle-toi",
  "mémoire", "contexte", "resume". Ce skill charge l'état complet du projet :
  décisions prises, fichiers modifiés, tâches en cours, blocages identifiés.
  À utiliser aussi en FIN de session pour sauvegarder l'état avant de quitter.
---

# Skill — Mémoire & Contexte Projet Vocalia

## Rôle de ce skill

Ce skill permet à Claude de fonctionner comme s'il avait une mémoire persistante
entre les sessions. Il structure la façon de charger, maintenir et sauvegarder
le contexte du projet Vocalia à chaque session de travail.

---

## CHARGEMENT DE SESSION (début de session)

Quand l'utilisateur démarre une session ou demande le contexte, exécuter dans
cet ordre :

### Étape 1 — Lire les fichiers de référence

```
Lire dans cet ordre :
1. CLAUDE.md          → règles, contraintes, stack
2. MEMORY.md          → état sauvegardé de la dernière session
3. PRD.md             → fonctionnalités et périmètre
4. ARCHITECTURE.md    → structure technique
```

### Étape 2 — Lire MEMORY.md et extraire

Le fichier `MEMORY.md` à la racine du projet contient :

```markdown
# MEMORY.md — État du projet Vocalia

## Dernière session
- Date : [date]
- Durée : [durée]
- Développeur : [nom si connu]

## Ce qui a été fait
- [liste des tâches complétées avec fichiers modifiés]

## En cours (non terminé)
- [tâche en cours + où on s'est arrêté + fichier concerné]

## Décisions techniques prises
- [décision] → [raison] → [date]

## Problèmes connus / bugs ouverts
- [description] → [fichier] → [statut]

## Prochaines étapes prioritaires
1. [tâche 1]
2. [tâche 2]
3. [tâche 3]

## Variables d'environnement nécessaires
- [liste des .env requis pour la prochaine étape]

## Commandes utiles rappel
- [commandes fréquentes du projet]
```

### Étape 3 — Résumer à l'utilisateur

Présenter un résumé clair :

```
## Contexte chargé ✓

**Dernière session :** [date]
**Phase MVP :** [X/10 tâches complétées]

**Dernière action :** [description courte]
**En cours :** [ce qui était en cours]

**Prochaine étape suggérée :** [tâche 1 prioritaire]

Prêt à continuer ?
```

---

## SAUVEGARDE DE SESSION (fin de session)

Quand l'utilisateur dit "sauvegarde", "fin de session", "on s'arrête", mettre
à jour `MEMORY.md` avec :

- Date et heure de la session
- Liste précise des fichiers créés ou modifiés (avec chemin complet)
- Décisions techniques prises pendant la session et leur justification
- Tâches complétées (cocher dans le PRD.md si pertinent)
- Ce qui est en cours et où exactement on s'est arrêté
- Bugs ou problèmes découverts
- Les 3 prochaines étapes prioritaires dans l'ordre

### Format de mise à jour

Ne PAS réécrire tout le fichier. Ajouter une entrée datée EN HAUT du fichier
et archiver l'ancienne entrée dans une section `## Historique`.

---

## RÈGLES DE MÉMOIRE ACTIVE

Durant la session, maintenir mentalement :

1. **Fichiers touchés** — noter chaque fichier créé/modifié
2. **Décisions prises** — toute décision technique doit être justifiée et mémorisée
3. **Cohérence** — si une décision contredit une décision passée dans MEMORY.md,
   le signaler immédiatement à l'utilisateur avant d'agir
4. **Phase en cours** — toujours savoir si on est en MVP, V1 ou V2 et ne pas
   implémenter des fonctionnalités hors de la phase courante sans validation

---

## DÉTECTION AUTOMATIQUE DE CONTEXTE

Si l'utilisateur pose une question sans donner de contexte, chercher d'abord
dans MEMORY.md si le sujet a déjà été traité. Exemples :

- "Comment on a fait l'auth ?" → chercher dans MEMORY.md > Décisions techniques
- "Le bug sur les minutes ?" → chercher dans MEMORY.md > Problèmes connus
- "On avait décidé quoi pour les webhooks ?" → chercher dans MEMORY.md > Décisions

Ne jamais répondre "je ne me souviens pas" — toujours chercher dans MEMORY.md
avant d'admettre l'absence d'information.
