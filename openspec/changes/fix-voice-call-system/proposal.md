## Why

Le système de voix et d'appels téléphoniques de Callpme présente plusieurs dysfonctionnements critiques qui empêchent l'utilisation en production : la voix sélectionnée dans l'éditeur d'agent ne se synchronise pas correctement avec Vapi lors de la publication, les appels sortants échouent faute de numéro Vapi enregistré (`phoneNumberId`), le chatbot de test utilisait un modèle Gemini obsolète, et les previews vocales Cartesia ne fonctionnaient pas (mauvais modèle TTS). Ces problèmes bloquent toute démonstration client et tout déploiement commercial.

## What Changes

- **Synchronisation voix agent → Vapi** : Garantir que la voix sélectionnée (provider + voiceId) est correctement persistée en DB et synchronisée avec l'assistant Vapi lors de la sauvegarde ET de la publication.
- **Gestion des providers voix incompatibles** : Filtrer les voix Google (non supportées par Vapi) du sélecteur, utiliser une voix française Cartesia comme fallback au lieu d'une voix anglaise inconnue.
- **Appels sortants (CUSTOM)** : Ajouter la gestion du `phoneNumberId` Vapi obligatoire pour les appels outbound, avec message d'erreur clair en français si aucun numéro n'est configuré.
- **Chatbot test** : Migrer de `gemini-2.0-flash` (obsolète) vers `gemini-2.5-flash`.
- **Preview voix Cartesia** : Corriger le modèle TTS de `sonic-french` (inexistant) vers `sonic-2` avec `language: "fr"`.
- **Numéros de téléphone** : Supporter les deux types de providers (SIP Trunk + Twilio) dans l'interface d'ajout avec sélecteur visuel.
- **Format E.164** : Auto-ajout du préfixe `+` sur les numéros de téléphone saisis.

## Capabilities

### New Capabilities
- `vapi-voice-sync`: Synchronisation fiable de la voix sélectionnée entre l'éditeur d'agent, la base de données et l'assistant Vapi
- `outbound-call-management`: Gestion des appels sortants via Vapi avec auto-détection du phoneNumberId et messages d'erreur explicites
- `multi-provider-phone`: Support SIP Trunk et Twilio dans la gestion des numéros de téléphone

### Modified Capabilities
- `agent-editor`: Le flux sauvegarde/publication transmet maintenant les overrides voix directement au sync-agent pour éviter les lectures DB périmées
- `voice-preview`: Le preview audio utilise le modèle Cartesia `sonic-2` au lieu de `sonic-french`

## Impact

- **API Routes** : `/api/vapi/sync-agent`, `/api/vapi/call-test`, `/api/agents/chat-test`, `/api/voices/preview`
- **Lib** : `apps/web/src/lib/vapi.ts` (getVoiceConfig, createVapiCall, listVapiPhoneNumbers)
- **Composants** : `tab-parole.tsx`, `test-modal.tsx`, `phone-numbers/page.tsx`
- **Hooks** : `use-agents.ts` (invalidation des query keys)
- **DB** : Correction directe des agents avec `voice_provider: "google"` → `"cartesia"`, suppression des voix en doublon
- **Vapi** : Mise à jour directe des assistants Vapi avec la bonne voix française
- **Env** : Ajout de `GEMINI_API_KEY` dans `.env.local` et Vercel
