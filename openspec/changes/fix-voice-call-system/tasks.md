## 1. Synchronisation voix agent → Vapi

- [ ] 1.1 Mettre à jour `getVoiceConfig` dans `apps/web/src/lib/vapi.ts` : fallback vers Sophie (Calm) `a8a1eb38-5f15-4c1d-8722-7ac0f329727d`, rejeter les providers non supportés (google, etc.)
- [ ] 1.2 Modifier `apps/web/src/app/api/vapi/sync-agent/route.ts` : accepter `voiceProvider` et `voiceId` en override dans le body de la requête POST, les utiliser en priorité sur les valeurs DB
- [ ] 1.3 Modifier `apps/web/src/app/(dashboard)/agents/[id]/page.tsx` : transmettre `edits.voiceProvider` et `edits.voiceId` dans le body lors de la publication
- [ ] 1.4 Filtrer les voix Google dans `apps/web/src/components/dashboard/agent-editor/tab-parole.tsx` : `voiceList.filter(v => v.provider !== "google")`
- [ ] 1.5 Mettre à jour `apps/web/src/hooks/use-agents.ts` : invalider les query keys `["agents"]` et `["agent"]` après mutation

## 2. Appels sortants (CUSTOM)

- [ ] 2.1 Ajouter `listVapiPhoneNumbers()` dans `apps/web/src/lib/vapi.ts` : GET `/phone-number` avec gestion d'erreur
- [ ] 2.2 Mettre à jour `createVapiCall` dans `apps/web/src/lib/vapi.ts` : auto-détection du `phoneNumberId` via `listVapiPhoneNumbers()`, erreur française si aucun numéro
- [ ] 2.3 Normaliser le numéro E.164 côté client dans `apps/web/src/components/dashboard/agent-editor/test-modal.tsx` : auto-ajout du `+` et indication format
- [ ] 2.4 Normaliser le numéro E.164 côté serveur dans `apps/web/src/app/api/vapi/call-test/route.ts` : double sécurité auto-ajout du `+`

## 3. Preview voix & Chatbot test

- [ ] 3.1 Corriger le modèle Cartesia dans `apps/web/src/app/api/voices/preview/route.ts` : remplacer `sonic-french` par `sonic-2` avec `language: "fr"`
- [ ] 3.2 Corriger le modèle Gemini dans `apps/web/src/app/api/agents/chat-test/route.ts` : remplacer `gemini-2.0-flash` par `gemini-2.5-flash`
- [ ] 3.3 Ajouter `GEMINI_API_KEY` dans `.env.local` et variables Vercel

## 4. Support multi-provider téléphonie

- [ ] 4.1 Ajouter le sélecteur visuel SIP Trunk / Twilio dans la modale d'ajout de `apps/web/src/app/(dashboard)/phone-numbers/page.tsx`
- [ ] 4.2 Ajouter le champ conditionnel Twilio SID quand le provider Twilio est sélectionné
- [ ] 4.3 Afficher la répartition SIP / Twilio dans les KPI de la page numéros
- [ ] 4.4 Auto-ajout du préfixe `+` à la création de numéros dans `handleCreate`

## 5. Corrections DB existantes

- [ ] 5.1 Mettre à jour les agents avec `voice_provider: "google"` vers `"cartesia"` + voix Sophie en DB Supabase
- [ ] 5.2 Supprimer les voix en doublon dans la table `voices` (Calm French Woman, Gabriel)
- [ ] 5.3 Mettre à jour les assistants Vapi existants avec la bonne voix française via PATCH API

## 6. Vérification

- [ ] 6.1 Tester la sauvegarde + publication d'un agent avec voix Cartesia sélectionnée : vérifier que Vapi reçoit la bonne voix
- [ ] 6.2 Tester le mode VOCAL dans la modale de test : vérifier que l'agent parle français
- [ ] 6.3 Tester le mode CHATBOT : vérifier que gemini-2.5-flash répond correctement
- [ ] 6.4 Tester le preview voix Cartesia : vérifier que l'audio est généré en français
- [ ] 6.5 Tester le mode CUSTOM : vérifier le message d'erreur si aucun numéro Vapi n'est enregistré
- [ ] 6.6 Tester l'ajout d'un numéro SIP Trunk et d'un numéro Twilio dans la page numéros
