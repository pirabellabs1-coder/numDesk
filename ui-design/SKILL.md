---
name: ui-design
description: >
  Utiliser ce skill pour tout développement d'interface graphique sur Vocalia :
  création de pages Next.js, composants React, layouts, formulaires, tableaux,
  modales, dashboards. Déclencher quand l'utilisateur dit "crée la page X",
  "fais le composant Y", "l'interface de Z", "le formulaire pour W".
  Ce skill garantit une cohérence visuelle parfaite avec la charte Vocalia.
---

# Skill — UI Design & Composants Vocalia

## Principes fondamentaux

Vocalia est une interface **professionnelle B2B**, claire et minimaliste.
L'utilisateur est une agence ou un indépendant qui gère des clients au quotidien.
Chaque écran doit être **rapide à lire, rapide à utiliser, sans friction**.

---

## Système de design Vocalia

### Tokens de base

```css
/* Couleurs */
--color-accent:      #3D8EFF;   /* CTA, liens, actif */
--color-accent-2:    #6C5CE7;   /* Secondaire, gradients */
--color-success:     #00C896;   /* Minutes OK, statut positif */
--color-warning:     #FF7F3F;   /* Dépassement, alertes */
--color-danger:      #FF4D6D;   /* Suppression, erreurs */
--color-text-1:      #1E2235;   /* Texte principal */
--color-text-2:      #555872;   /* Labels, descriptions */
--color-border:      #DDDFE8;   /* Bordures */
--color-bg-card:     #F4F5FA;   /* Fond des cartes */
--color-bg-page:     #FFFFFF;   /* Fond de page */

/* Typographie */
--font-ui:   'Plus Jakarta Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Espacements */
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 24px;  --space-6: 32px;
--space-8: 48px;  --space-10: 64px;

/* Radius */
--radius-sm: 6px;   --radius-md: 8px;
--radius-lg: 12px;  --radius-xl: 16px;
```

### Composants shadcn/ui à utiliser en priorité

```
Button, Input, Textarea, Select, Switch, Checkbox, Badge,
Card, Dialog, Sheet, Popover, DropdownMenu, Tooltip,
Table, Tabs, Progress, Skeleton, Alert, Toast (Sonner),
Form (avec react-hook-form), Separator, Avatar
```

**Ne JAMAIS installer une librairie UI supplémentaire** sans validation.

---

## Patterns de pages Vocalia

### Layout principal (workspace intérieur)

```tsx
// Structure obligatoire pour toutes les pages de workspace
<div className="flex h-screen bg-white">
  {/* Sidebar fixe */}
  <WorkspaceSidebar workspace={workspace} activeSection="agents" />

  {/* Zone de contenu scrollable */}
  <main className="flex-1 overflow-y-auto">
    {/* Header de section */}
    <div className="flex items-center justify-between px-8 py-6 border-b border-[#DDDFE8]">
      <div>
        <h1 className="text-2xl font-bold text-[#1E2235]">[Titre]</h1>
        <p className="text-sm text-[#555872] mt-1">[Sous-titre descriptif]</p>
      </div>
      <Button className="bg-[#3D8EFF] hover:bg-[#2d7ef0] text-white">
        + [Action principale]
      </Button>
    </div>

    {/* Contenu */}
    <div className="px-8 py-6">
      [contenu]
    </div>
  </main>
</div>
```

### Carte de workspace (page d'accueil)

```tsx
<Card className="p-5 border border-[#DDDFE8] rounded-xl hover:border-[#3D8EFF]
                 transition-colors cursor-pointer bg-white">
  <div className="flex items-start justify-between mb-3">
    <div>
      <h3 className="font-semibold text-[#1E2235]">{workspace.name}</h3>
      <span className="text-xs bg-[#EBF2FF] text-[#3D8EFF] px-2 py-0.5
                       rounded font-medium">Minutes</span>
    </div>
    <button className="text-[#555872] hover:text-[#1E2235]">
      <PencilIcon size={14} />
    </button>
  </div>

  <div className="space-y-1 text-xs text-[#555872] mb-3">
    <p><span className="font-medium">Offre :</span> Minutes mensuelles</p>
    <p><span className="font-medium">Cycle :</span> {formatDate(workspace.cycleStart)}</p>
  </div>

  {/* Barre de progression minutes */}
  <div className="mb-1 flex items-center gap-2 text-xs">
    <Clock size={12} className="text-[#555872]" />
    <span>Incluses : {workspace.minutesUsed}/{workspace.minutesIncluded} min</span>
  </div>
  <Progress
    value={(workspace.minutesUsed / workspace.minutesIncluded) * 100}
    className="h-1.5 bg-[#F4F5FA]"
    indicatorClassName="bg-[#00C896]"
  />

  <p className="text-xs text-[#555872] mt-3">
    Dépassement possible jusqu'à +{workspace.minutesOverageLimit} min,
    facturées à {(workspace.overageRateCents / 100).toFixed(2)}€/min
  </p>
</Card>
```

### Tableau standard (agents, conversations...)

```tsx
<div className="rounded-xl border border-[#DDDFE8] overflow-hidden">
  <Table>
    <TableHeader className="bg-[#F4F5FA]">
      <TableRow className="border-b border-[#DDDFE8]">
        <TableHead className="text-xs font-semibold text-[#555872] uppercase
                              tracking-wider py-3 px-4">
          [Colonne]
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map((item) => (
        <TableRow key={item.id}
          className="border-b border-[#DDDFE8] hover:bg-[#F4F5FA] transition-colors">
          <TableCell className="py-3 px-4 text-sm text-[#1E2235]">
            {item.value}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### État vide (empty state)

```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  <div className="w-16 h-16 rounded-2xl bg-[#F4F5FA] flex items-center
                  justify-center mb-4">
    <[Icon] size={28} className="text-[#DDDFE8]" />
  </div>
  <h3 className="text-base font-semibold text-[#1E2235] mb-1">
    Aucun(e) [entité]
  </h3>
  <p className="text-sm text-[#555872] mb-6">
    [Description de l'action pour commencer]
  </p>
  <Button className="bg-[#3D8EFF] text-white hover:bg-[#2d7ef0]">
    + [Action]
  </Button>
</div>
```

### Badge de statut

```tsx
// Mapping des statuts Vocalia
const statusConfig = {
  ended:       { label: 'Terminée',    bg: '#E5FBF5', text: '#00C896' },
  interrupted: { label: 'Interrompue', bg: '#FFF4ED', text: '#FF7F3F' },
  voicemail:   { label: 'Messagerie',  bg: '#EBF2FF', text: '#3D8EFF' },
  no_answer:   { label: 'Sans réponse',bg: '#F4F5FA', text: '#555872' },
  active:      { label: 'Active',      bg: '#E5FBF5', text: '#00C896' },
  draft:       { label: 'Brouillon',   bg: '#F4F5FA', text: '#555872' },
  failed:      { label: 'Échouée',     bg: '#FFF0F3', text: '#FF4D6D' },
}

<span style={{ backgroundColor: config.bg, color: config.text }}
      className="px-2 py-0.5 rounded text-xs font-medium">
  {config.label}
</span>
```

### Formulaire standard

```tsx
// Toujours : react-hook-form + zod resolver + shadcn Form
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(255),
  // ...
})

const form = useForm({ resolver: zodResolver(schema) })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField control={form.control} name="name" render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-medium text-[#1E2235]">
          Nom <span className="text-[#FF4D6D]">*</span>
        </FormLabel>
        <FormControl>
          <Input placeholder="Ex: Permis 75" {...field}
                 className="border-[#DDDFE8] focus:border-[#3D8EFF]" />
        </FormControl>
        <FormMessage className="text-xs text-[#FF4D6D]" />
      </FormItem>
    )} />

    <div className="flex justify-end gap-3 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Annuler
      </Button>
      <Button type="submit" className="bg-[#3D8EFF] text-white"
              disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? 'Enregistrement...' : 'Sauvegarder'}
      </Button>
    </div>
  </form>
</Form>
```

---

## Règles UI non négociables

1. **Fond blanc uniquement** — `bg-white` ou `bg-[#F4F5FA]` pour les cartes
2. **Textes en français** — labels, placeholders, messages d'erreur, toasts
3. **Pas de dark mode** — ne pas ajouter de classes `dark:`
4. **Toujours gérer** : loading state, empty state, error state
5. **Toujours valider** les formulaires côté client ET côté serveur
6. **Icônes** : utiliser `lucide-react` uniquement (déjà dans shadcn)
7. **Toasts** : utiliser `sonner` pour les notifications (succès/erreur)
8. **Responsive** : mobile-first, breakpoints `sm:` et `lg:` suffisent

---

## Checklist avant de livrer un composant

```
[ ] Fonctionne sur mobile 375px (pas de overflow horizontal)
[ ] Fonctionne sur desktop 1280px
[ ] État vide géré
[ ] État de chargement géré (Skeleton ou spinner)
[ ] État d'erreur géré (message en français)
[ ] Formulaires : validation zod côté client
[ ] Pas de clé API visible dans le code
[ ] Composants shadcn/ui utilisés (pas de custom CSS excessif)
[ ] Textes en français
[ ] Accessible : labels sur les inputs, role sur les boutons icônes
```
