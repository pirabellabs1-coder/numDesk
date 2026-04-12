---
name: playwright-test
description: >
  Utiliser ce skill après chaque développement d'interface graphique sur Vocalia,
  ou quand l'utilisateur demande "teste l'interface", "vérifie que ça marche",
  "lance les tests", "playwright", "e2e", "teste la page X". Ce skill génère et
  exécute des tests Playwright complets couvrant les parcours utilisateur Vocalia,
  la responsivité et les états de l'interface.
---

# Skill — Tests Playwright Vocalia

## Principe

Chaque fonctionnalité UI de Vocalia doit être testée avec Playwright avant d'être
considérée comme terminée. Les tests couvrent trois dimensions :
1. **Fonctionnel** — le parcours utilisateur fonctionne de bout en bout
2. **Responsive** — l'interface s'affiche correctement sur mobile et desktop
3. **États** — loading, empty state, erreur, succès sont correctement gérés

---

## Configuration de base

### playwright.config.ts (référence)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    locale: 'fr-FR',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile',  use: { ...devices['iPhone 13'] } },
    { name: 'tablet',  use: { ...devices['iPad (gen 7)'] } },
  ],
})
```

### Helpers réutilisables

```typescript
// tests/e2e/helpers/auth.ts
export async function loginAs(page: Page, role: 'admin' | 'member') {
  await page.goto('/login')
  await page.fill('[name="email"]', role === 'admin'
    ? process.env.TEST_ADMIN_EMAIL!
    : process.env.TEST_MEMBER_EMAIL!)
  await page.fill('[name="password"]', process.env.TEST_PASSWORD!)
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
}

// tests/e2e/helpers/workspace.ts
export async function createTestWorkspace(page: Page, name: string) {
  await page.click('text=+ Nouveau Workspace')
  await page.fill('[name="name"]', name)
  await page.click('button[type="submit"]')
  await page.waitForSelector(`text=${name}`)
}
```

---

## Templates de tests par fonctionnalité

### Test — Page liste des workspaces

```typescript
import { test, expect } from '@playwright/test'
import { loginAs } from '../helpers/auth'

test.describe('Liste des workspaces', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'member')
  })

  test('affiche les workspaces sous forme de cartes', async ({ page }) => {
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1, h2').filter({ hasText: 'Clients' })).toBeVisible()
    // Au moins une carte visible
    await expect(page.locator('[data-testid="workspace-card"]').first()).toBeVisible()
  })

  test('affiche les minutes utilisées et la barre de progression', async ({ page }) => {
    const card = page.locator('[data-testid="workspace-card"]').first()
    await expect(card.locator('[data-testid="minutes-display"]')).toContainText('min')
    await expect(card.locator('[data-testid="progress-bar"]')).toBeVisible()
  })

  test('permet de rechercher un workspace', async ({ page }) => {
    const search = page.locator('[placeholder*="Rechercher"]')
    await search.fill('Permis')
    await expect(page.locator('[data-testid="workspace-card"]')).toHaveCount({ min: 0 })
  })

  test('ouvre le formulaire de création', async ({ page }) => {
    await page.click('text=+ Nouveau Workspace')
    await expect(page.locator('[role="dialog"]')).toBeVisible()
    await expect(page.locator('[name="name"]')).toBeVisible()
  })

  test('affiche le compteur de crédits globaux', async ({ page }) => {
    await expect(page.locator('[data-testid="credits-display"]')).toBeVisible()
    await expect(page.locator('[data-testid="credits-display"]')).toContainText('€')
  })
})

test.describe('Liste des workspaces — Responsive', () => {
  test('affiche en grille sur desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await loginAs(page, 'member')
    const grid = page.locator('[data-testid="workspaces-grid"]')
    await expect(grid).toHaveCSS('display', 'grid')
  })

  test('affiche en colonne unique sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await loginAs(page, 'member')
    // Pas de scroll horizontal
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)
  })
})
```

### Test — Éditeur d'agent

```typescript
test.describe('Éditeur d\'agent', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'member')
    await page.goto('/workspace/[id]/agents')
  })

  test('crée un nouvel agent', async ({ page }) => {
    await page.click('text=+ Nouvel Agent')
    await page.fill('[name="name"]', 'Agent Test Playwright')
    await page.click('text=Créer')
    await expect(page.locator('text=Agent Test Playwright')).toBeVisible()
  })

  test('navigue entre les onglets de l\'éditeur', async ({ page }) => {
    await page.locator('[data-testid="agent-row"]').first().click()

    // Onglet AGENT (défaut)
    await expect(page.locator('[data-testid="tab-agent"]')).toHaveClass(/active|selected/)
    await expect(page.locator('[name="prompt"]')).toBeVisible()

    // Onglet PAROLE
    await page.click('text=PAROLE')
    await expect(page.locator('text=Langue de démarrage')).toBeVisible()

    // Onglet RÉGLAGES
    await page.click('text=RÉGLAGES')
    await expect(page.locator('text=Modèle LLM')).toBeVisible()
  })

  test('sauvegarde le prompt correctement', async ({ page }) => {
    await page.locator('[data-testid="agent-row"]').first().click()
    await page.fill('[name="prompt"]', 'Nouveau prompt de test')
    await page.click('text=SAUVEGARDER')
    // Toast de succès
    await expect(page.locator('[data-sonner-toast]')).toContainText('sauvegardé')
  })

  test('valide que le nom est requis', async ({ page }) => {
    await page.click('text=+ Nouvel Agent')
    await page.click('text=Créer') // submit sans nom
    await expect(page.locator('text=Le nom est requis')).toBeVisible()
  })
})
```

### Test — Conversations

```typescript
test.describe('Conversations', () => {
  test('affiche le tableau avec les bonnes colonnes', async ({ page }) => {
    await loginAs(page, 'member')
    await page.goto('/workspace/[id]/conversations')

    const colonnes = ['Date', 'Type', 'Sens', 'Agent', 'Durée', 'Actions']
    for (const col of colonnes) {
      await expect(page.locator(`th:has-text("${col}")`)).toBeVisible()
    }
  })

  test('filtre par agent', async ({ page }) => {
    await loginAs(page, 'member')
    await page.goto('/workspace/[id]/conversations')

    await page.click('[data-testid="filter-agent"]')
    await page.click('[role="option"]')
    // La liste se met à jour
    await page.waitForResponse('**/api/conversations*')
  })

  test('ouvre le détail d\'une conversation', async ({ page }) => {
    await loginAs(page, 'member')
    await page.goto('/workspace/[id]/conversations')

    await page.locator('[data-testid="conv-row"]').first()
      .locator('[data-testid="action-view"]').click()
    await expect(page.locator('[data-testid="transcript"]')).toBeVisible()
  })
})
```

---

## Checklist de tests à générer pour chaque nouvelle page

Pour toute nouvelle page développée, générer des tests couvrant :

```
[ ] Rendu initial sans erreur (pas de crash)
[ ] Affichage des données mockées
[ ] Action principale (CTA) fonctionne
[ ] Formulaires : validation des champs requis
[ ] Formulaires : soumission réussie → toast succès
[ ] Formulaires : erreur API → toast erreur en français
[ ] État vide : affiché quand aucune donnée
[ ] État de chargement : skeleton visible pendant le fetch
[ ] Pas de scroll horizontal sur mobile 375px
[ ] Affichage correct sur desktop 1280px
[ ] RBAC : accès refusé si mauvais rôle (tester avec admin ET membre)
```

---

## Commandes d'exécution

```bash
# Lancer tous les tests
npx playwright test

# Lancer en mode visuel (debug)
npx playwright test --ui

# Lancer un fichier spécifique
npx playwright test tests/e2e/workspaces.spec.ts

# Lancer sur mobile uniquement
npx playwright test --project=mobile

# Générer le rapport HTML
npx playwright show-report
```

---

## Règles de nommage des tests

```
✅ "affiche les workspaces sous forme de cartes"
✅ "valide que le nom est requis"
✅ "sauvegarde le prompt correctement"
✅ "affiche une erreur si l'email est invalide"

❌ "test 1"
❌ "should work"
❌ "renders correctly"
```

Les noms de tests sont **en français** et décrivent le comportement attendu,
pas l'implémentation.
