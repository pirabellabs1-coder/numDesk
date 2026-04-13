## Context

Le système actuel présente un flux de synchronisation voix cassé entre 3 couches : l'UI (tab-parole.tsx), la DB PostgreSQL (table `agents`), et l'API Vapi (assistants). Les voix Google dans la DB ne sont pas supportées par Vapi. Le fallback Cartesia utilisait un voiceId inconnu potentiellement anglais. Les appels sortants via Vapi nécessitent un `phoneNumberId` que le code ne fournissait pas. Le chatbot de test utilisait un modèle Gemini obsolète (2.0-flash).

**État actuel des fichiers clés :**
- `apps/web/src/lib/vapi.ts` — Fonctions `getVoiceConfig`, `createVapiAssistant`, `updateVapiAssistant`, `createVapiCall`
- `apps/web/src/app/api/vapi/sync-agent/route.ts` — Endpoint de publication vers Vapi
- `apps/web/src/components/dashboard/agent-editor/tab-parole.tsx` — Sélecteur de voix
- `apps/web/src/components/dashboard/agent-editor/test-modal.tsx` — Modal de test (VOCAL/CHATBOT/CUSTOM)
- `apps/web/src/app/(dashboard)/phone-numbers/page.tsx` — Gestion des numéros

## Goals / Non-Goals

**Goals:**
- Garantir que la voix sélectionnée dans l'UI est persistée en DB et synchronisée avec Vapi lors de la publication
- Fournir un message d'erreur explicite en français quand un appel sortant est impossible (pas de phoneNumberId)
- Corriger tous les modèles TTS/LLM obsolètes (Gemini 2.0-flash, Cartesia sonic-french)
- Supporter SIP Trunk et Twilio dans l'interface de gestion des numéros
- Filtrer les voix incompatibles Vapi (Google) du sélecteur

**Non-Goals:**
- Enregistrement automatique de numéros dans Vapi (nécessite accès au dashboard Vapi)
- Migration vers un orchestrateur vocal custom (prévu V2)
- Voice Studio / clonage de voix
- Gestion des credentials Twilio/SIP dans l'interface

## Decisions

### 1. Override voix dans le body de sync-agent (vs lecture DB)
**Choix** : Passer `voiceProvider` et `voiceId` directement dans le body de la requête POST `/api/vapi/sync-agent`, en plus de la lecture DB.
**Pourquoi** : Éviter le problème de stale data. Quand l'utilisateur sauvegarde puis publie immédiatement, la mutation DB peut ne pas être reflétée dans le SELECT suivant (latence réplication). L'override dans le body garantit que les valeurs fraîches sont utilisées.
**Alternative rejetée** : Attendre un `refetch` complet avant publication — trop lent et complexe.

### 2. Voix Cartesia Sophie (Calm) comme fallback
**Choix** : Utiliser `a8a1eb38-5f15-4c1d-8722-7ac0f329727d` (Sophie Calm, voix française) comme voix par défaut dans `getVoiceConfig`.
**Pourquoi** : L'ancien fallback `a0e99841-438c-4a64-b679-ae501e7d6091` n'était pas dans notre table `voices` et pouvait être anglais. Sophie Calm est une voix Cartesia française confirmée dans notre DB.
**Alternative rejetée** : Utiliser Pierre (Baryton) — préféré Sophie car voix féminine plus neutre pour un assistant.

### 3. Filtrer les voix Google côté client
**Choix** : `voiceList.filter(v => v.provider !== "google")` dans tab-parole.tsx.
**Pourquoi** : Vapi ne supporte pas le provider "google". Afficher ces voix est trompeur. Elles restent en DB pour une éventuelle utilisation future (preview via Google TTS API).
**Alternative rejetée** : Supprimer les voix Google de la DB — trop destructif, elles servent encore pour le preview.

### 4. Auto-détection phoneNumberId pour appels sortants
**Choix** : `createVapiCall` appelle `listVapiPhoneNumbers()` et utilise le premier numéro disponible. Si aucun → erreur explicite en français.
**Pourquoi** : L'utilisateur ne connaît pas les IDs internes Vapi. L'auto-détection simplifie le flux. L'erreur claire guide vers la solution.
**Alternative rejetée** : Demander à l'utilisateur de saisir un phoneNumberId — mauvaise UX.

### 5. Modèle Cartesia sonic-2 avec language: "fr"
**Choix** : Remplacer `sonic-french` par `sonic-2` avec paramètre `language: "fr"` pour les previews.
**Pourquoi** : `sonic-french` a été retiré par Cartesia. `sonic-2` est le modèle multilingue actuel qui supporte le français via le paramètre `language`.

## Risks / Trade-offs

- **[Pas de numéro Vapi enregistré]** → L'appel sortant (CUSTOM) reste impossible tant qu'aucun numéro n'est importé dans Vapi. Mitigation : message d'erreur explicite orientant l'utilisateur vers la configuration Vapi.
- **[Voix Google masquées]** → Les utilisateurs ayant déjà des agents avec voix Google verront leur voix changer au fallback Cartesia lors de la prochaine publication. Mitigation : correction directe en DB des agents existants.
- **[Latence preview voix]** → Le changement de modèle Cartesia (`sonic-2`) peut affecter la latence du preview. Mitigation : le modèle sonic-2 est plus rapide que sonic-french selon la documentation Cartesia.
- **[Single phoneNumberId]** → L'auto-détection utilise le premier numéro disponible. Si l'utilisateur a plusieurs numéros Vapi, il ne peut pas choisir. Mitigation : suffisant pour le MVP, sélecteur de numéro prévu en V1.
