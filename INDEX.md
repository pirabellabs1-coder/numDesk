# SKILLS — Index Vocalia

Ce dossier contient les 10 skills Claude Code du projet Vocalia.
Placer ce dossier à la racine du projet : `/skills/`

## Liste des skills

| # | Dossier | Nom | Se déclenche quand... |
|---|---|---|---|
| 1 | `memory/` | **Mémoire & Contexte** | "reprends le contexte", "où en est-on", début/fin de session |
| 2 | `code-review/` | **Code Review** | "vérifie ce code", "review", "est-ce que c'est bon" |
| 3 | `ui-design/` | **UI Design** | "crée la page X", "le composant Y", toute tâche d'interface |
| 4 | `playwright-test/` | **Tests Playwright** | après chaque page UI, "teste l'interface", "e2e" |
| 5 | `superpower/` | **Mode Superpower** | "go", "implémente tout", "full speed", grande fonctionnalité |
| 6 | `api-spec/` | **API & Endpoints** | "crée l'endpoint X", "la route pour Y", "l'API de Z" |
| 7 | `database/` | **Base de Données** | "crée la table", "migration", "requête pour", "schéma" |
| 8 | `security-audit/` | **Audit Sécurité** | "audit sécurité", "est-ce sécurisé", avant chaque prod |
| 9 | `performance/` | **Performance** | "c'est lent", "optimise", "Core Web Vitals", avant prod |
| 10 | `onboarding/` | **Onboarding** | nouvelle machine, nouveau dev, "comment démarrer" |

## Utilisation dans CLAUDE.md

Ajouter cette section dans votre CLAUDE.md :

```markdown
## Skills disponibles

Les skills sont dans le dossier `/skills/`. Claude doit les lire
automatiquement selon le contexte, sans attendre de demande explicite.

- **Début de session** → lire `skills/memory/SKILL.md`
- **Toute tâche UI** → lire `skills/ui-design/SKILL.md`
- **Après toute tâche UI** → lire `skills/playwright-test/SKILL.md`
- **Tâche API/endpoint** → lire `skills/api-spec/SKILL.md`
- **Tâche DB/migration** → lire `skills/database/SKILL.md`
- **Mode productivité max** → lire `skills/superpower/SKILL.md`
- **Avant merge/commit** → lire `skills/code-review/SKILL.md`
- **Avant mise en prod** → lire `skills/security-audit/SKILL.md`
                           + lire `skills/performance/SKILL.md`
- **Nouveau dev/machine** → lire `skills/onboarding/SKILL.md`
- **Fin de session** → mettre à jour via `skills/memory/SKILL.md`
```

## Structure cible du projet

```
vocalia/
├── CLAUDE.md            ← Règles globales Claude Code
├── MEMORY.md            ← État persistant entre sessions
├── PRD.md               ← Fonctionnalités et périmètre
├── ARCHITECTURE.md      ← Architecture technique
├── skills/
│   ├── INDEX.md         ← Ce fichier
│   ├── memory/SKILL.md
│   ├── code-review/SKILL.md
│   ├── ui-design/SKILL.md
│   ├── playwright-test/SKILL.md
│   ├── superpower/SKILL.md
│   ├── api-spec/SKILL.md
│   ├── database/SKILL.md
│   ├── security-audit/SKILL.md
│   ├── performance/SKILL.md
│   └── onboarding/SKILL.md
├── app/
├── components/
├── db/
├── server/
└── tests/
```
