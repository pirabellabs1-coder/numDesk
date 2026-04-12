"use client";

import { useState } from "react";

// ── Sections de la documentation ──
const sections = [
  { id: "intro", label: "Introduction", icon: "info" },
  { id: "auth", label: "Authentification", icon: "lock" },
  { id: "start", label: "Premiers pas", icon: "rocket_launch" },
  { id: "workspaces", label: "Workspaces", icon: "business" },
  { id: "agents", label: "Agents", icon: "smart_toy" },
  { id: "conversations", label: "Conversations", icon: "forum" },
  { id: "contacts", label: "Contacts", icon: "contacts" },
  { id: "campaigns", label: "Campagnes", icon: "campaign" },
  { id: "leads", label: "Leads", icon: "filter_alt" },
  { id: "tags", label: "Tags", icon: "label" },
  { id: "teams", label: "Équipes", icon: "groups" },
  { id: "notes", label: "Notes", icon: "sticky_note_2" },
  { id: "knowledge", label: "Connaissances", icon: "menu_book" },
  { id: "phone", label: "Numéros", icon: "call" },
  { id: "tokens", label: "Tokens API", icon: "key" },
  { id: "webhooks", label: "Webhooks", icon: "webhook" },
  { id: "billing", label: "Facturation", icon: "payments" },
  { id: "favorites", label: "Favoris", icon: "star" },
  { id: "recordings", label: "Enregistrements", icon: "graphic_eq" },
  { id: "activity", label: "Activité", icon: "history" },
  { id: "quality", label: "Qualité", icon: "speed" },
  { id: "anomalies", label: "Anomalies", icon: "warning" },
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "vapi", label: "Vapi", icon: "phone_in_talk" },
  { id: "errors", label: "Erreurs", icon: "error" },
];

const methodColors: Record<string, string> = {
  GET: "bg-tertiary/10 text-tertiary",
  POST: "bg-primary/10 text-primary",
  PATCH: "bg-orange-400/10 text-orange-400",
  DELETE: "bg-error/10 text-error",
};

type Endpoint = { method: string; path: string; description: string };

// ── Tous les endpoints regroupés par section ──
const endpointGroups: Record<string, Endpoint[]> = {
  workspaces: [
    { method: "GET", path: "/api/workspaces", description: "Lister vos workspaces" },
    { method: "POST", path: "/api/workspaces", description: "Créer un workspace" },
    { method: "GET", path: "/api/workspaces/{id}", description: "Détail d'un workspace" },
    { method: "PATCH", path: "/api/workspaces/{id}", description: "Modifier un workspace" },
    { method: "DELETE", path: "/api/workspaces/{id}", description: "Supprimer un workspace" },
  ],
  agents: [
    { method: "GET", path: "/api/agents?workspace_id={id}", description: "Lister les agents" },
    { method: "POST", path: "/api/agents", description: "Créer un agent" },
    { method: "GET", path: "/api/agents/{id}", description: "Détail d'un agent" },
    { method: "PATCH", path: "/api/agents/{id}", description: "Modifier un agent" },
    { method: "DELETE", path: "/api/agents/{id}", description: "Supprimer un agent" },
  ],
  conversations: [
    { method: "GET", path: "/api/conversations?workspace_id={id}", description: "Lister les conversations" },
    { method: "GET", path: "/api/conversations?workspace_id={id}&status={status}", description: "Filtrer par statut" },
    { method: "GET", path: "/api/conversations/{id}", description: "Détail d'une conversation" },
  ],
  contacts: [
    { method: "GET", path: "/api/contacts?workspace_id={id}", description: "Lister les contacts" },
    { method: "GET", path: "/api/contacts?workspace_id={id}&search={term}", description: "Rechercher un contact" },
    { method: "POST", path: "/api/contacts", description: "Créer un contact" },
    { method: "GET", path: "/api/contacts/{id}", description: "Détail d'un contact" },
    { method: "PATCH", path: "/api/contacts/{id}", description: "Modifier un contact" },
    { method: "DELETE", path: "/api/contacts/{id}", description: "Supprimer un contact" },
  ],
  campaigns: [
    { method: "GET", path: "/api/campaigns?workspace_id={id}", description: "Lister les campagnes" },
    { method: "POST", path: "/api/campaigns", description: "Créer une campagne" },
    { method: "GET", path: "/api/campaigns/{id}", description: "Détail d'une campagne" },
    { method: "PATCH", path: "/api/campaigns/{id}", description: "Modifier une campagne" },
    { method: "DELETE", path: "/api/campaigns/{id}", description: "Supprimer une campagne" },
    { method: "POST", path: "/api/campaigns/{id}/start", description: "Lancer la campagne" },
    { method: "POST", path: "/api/campaigns/{id}/pause", description: "Mettre en pause" },
    { method: "POST", path: "/api/campaigns/{id}/stop", description: "Arrêter la campagne" },
  ],
  leads: [
    { method: "GET", path: "/api/leads?workspace_id={id}", description: "Lister les leads" },
    { method: "POST", path: "/api/leads", description: "Créer un lead" },
    { method: "GET", path: "/api/leads/{id}", description: "Détail d'un lead" },
    { method: "PATCH", path: "/api/leads/{id}", description: "Modifier un lead" },
    { method: "PATCH", path: "/api/leads/{id}/stage", description: "Changer l'étape" },
    { method: "DELETE", path: "/api/leads/{id}", description: "Supprimer un lead" },
  ],
  tags: [
    { method: "GET", path: "/api/tags?workspace_id={id}", description: "Lister les tags" },
    { method: "POST", path: "/api/tags", description: "Créer un tag" },
    { method: "PATCH", path: "/api/tags/{id}", description: "Modifier un tag" },
    { method: "DELETE", path: "/api/tags/{id}", description: "Supprimer un tag" },
  ],
  teams: [
    { method: "GET", path: "/api/teams?workspace_id={id}", description: "Lister les équipes" },
    { method: "POST", path: "/api/teams", description: "Créer une équipe" },
    { method: "GET", path: "/api/teams/{id}", description: "Détail d'une équipe" },
    { method: "PATCH", path: "/api/teams/{id}", description: "Modifier une équipe" },
    { method: "DELETE", path: "/api/teams/{id}", description: "Supprimer une équipe" },
  ],
  notes: [
    { method: "GET", path: "/api/notes?workspace_id={id}", description: "Lister les notes" },
    { method: "POST", path: "/api/notes", description: "Créer une note" },
    { method: "PATCH", path: "/api/notes/{id}", description: "Modifier une note" },
    { method: "DELETE", path: "/api/notes/{id}", description: "Supprimer une note" },
  ],
  knowledge: [
    { method: "GET", path: "/api/knowledge-bases?workspace_id={id}", description: "Lister les bases" },
    { method: "POST", path: "/api/knowledge-bases", description: "Créer une base" },
    { method: "DELETE", path: "/api/knowledge-bases/{id}", description: "Supprimer une base" },
  ],
  phone: [
    { method: "GET", path: "/api/phone-numbers?workspace_id={id}", description: "Lister les numéros" },
    { method: "POST", path: "/api/phone-numbers", description: "Ajouter un numéro SIP" },
    { method: "DELETE", path: "/api/phone-numbers/{id}", description: "Supprimer un numéro" },
  ],
  tokens: [
    { method: "GET", path: "/api/tokens?workspace_id={id}", description: "Lister les tokens" },
    { method: "POST", path: "/api/tokens", description: "Créer un token API" },
    { method: "DELETE", path: "/api/tokens/{id}", description: "Révoquer un token" },
  ],
  webhooks: [
    { method: "GET", path: "/api/webhooks?workspace_id={id}", description: "Lister les webhooks" },
    { method: "POST", path: "/api/webhooks", description: "Créer un webhook" },
    { method: "DELETE", path: "/api/webhooks/{id}", description: "Supprimer un webhook" },
  ],
  billing: [
    { method: "GET", path: "/api/billing/cycles?workspace_id={id}", description: "Historique des cycles" },
    { method: "GET", path: "/api/billing/usage?workspace_id={id}", description: "Usage courant" },
    { method: "GET", path: "/api/stats?workspace_id={id}", description: "KPIs du dashboard" },
  ],
  favorites: [
    { method: "GET", path: "/api/favorites", description: "Lister les favoris" },
    { method: "POST", path: "/api/favorites", description: "Ajouter un favori" },
    { method: "DELETE", path: "/api/favorites/{id}", description: "Retirer un favori" },
  ],
  recordings: [
    { method: "GET", path: "/api/recordings?workspace_id={id}", description: "Lister les enregistrements" },
  ],
  activity: [
    { method: "GET", path: "/api/activity?workspace_id={id}", description: "Journal d'activité" },
    { method: "GET", path: "/api/activity?workspace_id={id}&limit={n}", description: "Limiter le nombre" },
  ],
  quality: [
    { method: "GET", path: "/api/quality?workspace_id={id}", description: "Scores de qualité des agents" },
  ],
  anomalies: [
    { method: "GET", path: "/api/anomalies?workspace_id={id}", description: "Lister les anomalies" },
    { method: "POST", path: "/api/anomalies/{id}/resolve", description: "Marquer une anomalie résolue" },
  ],
  chat: [
    { method: "GET", path: "/api/chat/channels?workspace_id={id}", description: "Lister les channels" },
    { method: "POST", path: "/api/chat/channels", description: "Créer un channel" },
    { method: "GET", path: "/api/chat/messages?channel_id={id}", description: "Lister les messages" },
    { method: "POST", path: "/api/chat/messages", description: "Envoyer un message" },
  ],
  vapi: [
    { method: "POST", path: "/api/vapi/sync-agent", description: "Synchroniser un agent avec Vapi" },
    { method: "POST", path: "/api/vapi/call-test", description: "Lancer un appel test" },
    { method: "GET", path: "/api/vapi/assistants", description: "Lister les assistants Vapi" },
  ],
};

// ── Descriptions par section ──
const sectionInfo: Record<string, { title: string; subtitle: string; details?: string }> = {
  workspaces: { title: "Workspaces", subtitle: "Gérez les espaces de travail de votre agence. Chaque workspace représente un client.", details: "Un workspace contient ses propres agents, contacts, campagnes et paramètres de facturation." },
  agents: { title: "Agents IA", subtitle: "Créez et gérez vos agents d'appels téléphoniques IA.", details: "Chaque agent a un prompt, une voix, un modèle LLM et peut être publié sur Vapi pour recevoir des appels." },
  conversations: { title: "Conversations", subtitle: "Accédez à l'historique des appels avec transcripts et métadonnées.", details: "Filtrez par statut (success, missed, interrupted, voicemail), agent ou sentiment." },
  contacts: { title: "Contacts", subtitle: "Gérez votre base de contacts avec tags et historique d'appels.", details: "Recherchez par nom, téléphone ou email. Exportez en CSV." },
  campaigns: { title: "Campagnes d'appels", subtitle: "Créez et pilotez des campagnes d'appels sortants.", details: "Importez des contacts, définissez des plages horaires, et suivez la progression en temps réel." },
  leads: { title: "Pipeline Leads", subtitle: "Gérez votre pipeline commercial avec un kanban.", details: "Étapes : new → contacted → qualified → converted. Chaque lead a une valeur estimée." },
  tags: { title: "Tags", subtitle: "Organisez vos conversations avec des tags personnalisés.", details: "Chaque tag a un nom et une couleur. Ils sont utilisés pour catégoriser les conversations." },
  teams: { title: "Équipes", subtitle: "Organisez vos membres en équipes avec des agents assignés." },
  notes: { title: "Notes d'appels", subtitle: "Ajoutez des notes manuelles sur vos conversations.", details: "Chaque note peut avoir une action associée : rappel, email, transfert." },
  knowledge: { title: "Base de connaissances", subtitle: "Enrichissez vos agents avec des documents.", details: "Deux modes : Full Context (tout injecté dans le prompt) ou RAG (recherche vectorielle)." },
  phone: { title: "Numéros de téléphone", subtitle: "Gérez les numéros SIP assignés à vos agents." },
  tokens: { title: "Tokens API", subtitle: "Créez et révoquez des tokens d'authentification API.", details: "Les tokens sont hashés en SHA-256. Le token complet n'est affiché qu'une seule fois à la création." },
  webhooks: { title: "Webhooks", subtitle: "Recevez des notifications en temps réel sur les événements.", details: "Événements : call.started, call.ended, call.transferred, campaign.completed. Signature HMAC-SHA256." },
  billing: { title: "Facturation", subtitle: "Accédez aux cycles de facturation et à l'usage courant." },
  favorites: { title: "Favoris", subtitle: "Épinglez vos agents, contacts et campagnes fréquents." },
  recordings: { title: "Enregistrements", subtitle: "Accédez aux enregistrements audio de vos appels." },
  activity: { title: "Journal d'activité", subtitle: "Consultez l'historique de toutes les actions sur le workspace." },
  quality: { title: "Score de qualité", subtitle: "Évaluez la performance de vos agents automatiquement.", details: "Score basé sur le taux de complétion, le sentiment, la durée et le temps de réponse." },
  anomalies: { title: "Anomalies", subtitle: "Détectez et résolvez les comportements anormaux.", details: "Types : pic d'appels manqués, chute de sentiment, latence élevée." },
  chat: { title: "Chat interne", subtitle: "Messagerie entre membres de l'agence.", details: "Créez des channels par sujet et échangez en temps réel." },
  vapi: { title: "Intégration Vapi", subtitle: "Synchronisez vos agents et lancez des appels via Vapi AI.", details: "Publiez un agent pour le rendre opérationnel, puis testez avec un appel réel." },
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CopyBtn = ({ code, id }: { code: string; id: string }) => (
    <button onClick={() => copyCode(code, id)} className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-on-surface">
      <span className="material-symbols-outlined text-xs">{copied === id ? "check" : "content_copy"}</span>
      {copied === id ? "Copié" : "Copier"}
    </button>
  );

  const Code = ({ code, id, lang }: { code: string; id: string; lang: string }) => (
    <div className="rounded-2xl border border-white/5 bg-card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface">{lang}</h3>
        <CopyBtn code={code} id={id} />
      </div>
      <div className="overflow-x-auto rounded-lg bg-surface-container-lowest p-4">
        <pre className="whitespace-pre-wrap text-xs text-on-surface-variant">{code}</pre>
      </div>
    </div>
  );

  const EndpointList = ({ endpoints }: { endpoints: Endpoint[] }) => (
    <div className="space-y-2">
      {endpoints.map((ep, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-white/5 bg-card px-5 py-3.5 transition-all hover:border-white/10">
          <span className={`w-16 shrink-0 rounded px-2 py-1 text-center text-[10px] font-bold ${methodColors[ep.method]}`}>{ep.method}</span>
          <code className="min-w-0 flex-1 text-sm text-on-surface">{ep.path}</code>
          <span className="shrink-0 text-xs text-on-surface-variant">{ep.description}</span>
        </div>
      ))}
    </div>
  );

  const Info = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-5">
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-primary">info</span>
        <div><p className="text-sm font-bold text-on-surface">{title}</p><div className="mt-1 text-sm text-on-surface-variant">{children}</div></div>
      </div>
    </div>
  );

  // ── Exemples de code ──
  const examples = {
    curlList: `curl -X GET "https://app.callpme.com/api/agents?workspace_id=YOUR_WORKSPACE_ID" \\
  -H "Authorization: Bearer voc_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json"`,

    curlCreate: `curl -X POST "https://app.callpme.com/api/agents" \\
  -H "Authorization: Bearer voc_xxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "workspaceId": "YOUR_WORKSPACE_ID",
    "name": "Agent Support FR",
    "prompt": "Tu es un agent de support client professionnel.",
    "voiceId": "Cartesia — Sophie",
    "llmModel": "gemini-2.5-flash"
  }'`,

    jsList: `const response = await fetch(
  "https://app.callpme.com/api/agents?workspace_id=YOUR_WORKSPACE_ID",
  {
    headers: {
      "Authorization": "Bearer voc_xxxxxxxxxxxx",
      "Content-Type": "application/json",
    },
  }
);
const { data: agents } = await response.json();`,

    jsContact: `await fetch("https://app.callpme.com/api/contacts", {
  method: "POST",
  headers: {
    "Authorization": "Bearer voc_xxxxxxxxxxxx",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    workspaceId: "YOUR_WORKSPACE_ID",
    firstName: "Marie",
    lastName: "Dupont",
    phone: "+33612345678",
    email: "marie@example.fr",
    tags: ["VIP", "Prospect chaud"],
  }),
});`,

    response: `{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Agent Support FR",
    "workspaceId": "...",
    "isPublished": false,
    "isActive": true,
    "createdAt": "2026-04-12T10:30:00.000Z"
  },
  "meta": {
    "requestId": "a1b2c3d4-...",
    "timestamp": "2026-04-12T10:30:00.000Z"
  }
}`,

    error: `{
  "error": {
    "code": "NOT_FOUND",
    "message": "Agent introuvable"
  }
}`,

    webhookPayload: `{
  "event": "call.ended",
  "call_id": "550e8400-...",
  "workspace_id": "...",
  "agent_id": "...",
  "direction": "inbound",
  "caller_number": "+33612345678",
  "status": "ended",
  "duration_seconds": 92,
  "transcript": [
    { "role": "agent", "content": "Bonjour, comment puis-je vous aider ?" },
    { "role": "user", "content": "Oui bonjour, j'ai une question..." }
  ],
  "sentiment": "positive",
  "timestamp": "2026-04-12T16:30:00Z"
}`,

    webhookVerify: `const crypto = require("crypto");

function verifySignature(body, signature, secret) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(body))
    .digest("hex");
  return signature === expected;
}

// Vérifiez le header X-Callpme-Signature
const isValid = verifySignature(
  req.body,
  req.headers["x-callpme-signature"],
  "whsec_votre_secret"
);`,

    vapiSync: `// Publier un agent sur Vapi
await fetch("https://app.callpme.com/api/vapi/sync-agent", {
  method: "POST",
  headers: {
    "Authorization": "Bearer voc_xxxxxxxxxxxx",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ agentId: "AGENT_UUID" }),
});`,

    vapiCall: `// Lancer un appel test
await fetch("https://app.callpme.com/api/vapi/call-test", {
  method: "POST",
  headers: {
    "Authorization": "Bearer voc_xxxxxxxxxxxx",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    agentId: "AGENT_UUID",
    phoneNumber: "+33612345678",
  }),
});`,
  };

  // Total endpoints count
  const totalEndpoints = Object.values(endpointGroups).flat().length;

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="w-48 shrink-0">
          <h1 className="mb-2 text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Documentation</h1>
          <p className="mb-6 text-[10px] text-on-surface-variant">{totalEndpoints} endpoints</p>
          <nav className="space-y-[2px]">
            {sections.map((s) => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-[7px] text-[13px] transition-all ${activeSection === s.id ? "bg-primary/10 font-bold text-primary" : "text-on-surface-variant hover:text-on-surface"}`}>
                <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-6">

          {/* ── INTRODUCTION ── */}
          {activeSection === "intro" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>API Callpme</h2>
                <p className="mt-2 text-on-surface-variant">L&apos;API REST Callpme vous permet de gérer vos agents IA, contacts, campagnes, leads et bien plus depuis vos applications.</p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h3 className="mb-3 text-sm font-bold text-on-surface">Base URL</h3>
                <div className="flex items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3">
                  <code className="flex-1 text-sm text-primary">https://app.callpme.com/api</code>
                  <CopyBtn code="https://app.callpme.com/api" id="base" />
                </div>
              </div>

              <Code code={examples.response} id="response-format" lang="Format des réponses (succès)" />
              <Code code={examples.error} id="error-format" lang="Format des erreurs" />

              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h3 className="mb-4 text-sm font-bold text-on-surface">Toutes les ressources ({totalEndpoints} endpoints)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(endpointGroups).map(([key, eps]) => (
                    <button key={key} onClick={() => setActiveSection(key)} className="flex items-center gap-3 rounded-lg bg-surface-container-lowest px-4 py-3 text-left transition-all hover:bg-surface-container-low">
                      <span className="text-sm font-bold text-on-surface">{sectionInfo[key]?.title || key}</span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-on-surface-variant">{eps.length}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── AUTH ── */}
          {activeSection === "auth" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Authentification</h2>
                <p className="mt-2 text-on-surface-variant">Toutes les requêtes nécessitent un token Bearer.</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h3 className="mb-3 text-sm font-bold text-on-surface">Header requis</h3>
                <div className="rounded-lg bg-surface-container-lowest px-4 py-3">
                  <code className="text-sm text-primary">Authorization: Bearer voc_xxxxxxxxxxxxxxxxxxxx</code>
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h3 className="mb-3 text-sm font-bold text-on-surface">Créer un token</h3>
                <ol className="space-y-2 text-sm text-on-surface-variant">
                  <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">1</span>Allez dans <strong className="text-on-surface">API & Webhooks</strong></li>
                  <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">2</span>Cliquez <strong className="text-on-surface">Créer le token</strong></li>
                  <li className="flex items-start gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">3</span>Copiez-le <strong className="text-on-surface">immédiatement</strong> — il ne sera plus affiché</li>
                </ol>
              </div>
              <Info title="Rate limiting"><p>100 requêtes/minute par token. Code <code className="text-primary">429</code> en cas de dépassement.</p></Info>
              <Info title="Sécurité"><p>Tokens stockés en hash SHA-256. Seul le préfixe <code className="text-primary">voc_xxxx...</code> est conservé.</p></Info>
            </div>
          )}

          {/* ── PREMIERS PAS ── */}
          {activeSection === "start" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Premiers pas</h2>
                <p className="mt-2 text-on-surface-variant">Effectuez vos premières requêtes à l&apos;API Callpme.</p>
              </div>
              <Code code={examples.curlList} id="curl-list" lang="cURL — Lister vos agents" />
              <Code code={examples.jsList} id="js-list" lang="JavaScript — Lister vos agents" />
              <Code code={examples.curlCreate} id="curl-create" lang="cURL — Créer un agent" />
              <Code code={examples.jsContact} id="js-contact" lang="JavaScript — Créer un contact" />
            </div>
          )}

          {/* ── SECTIONS ENDPOINTS (toutes les ressources) ── */}
          {Object.keys(endpointGroups).includes(activeSection) && sectionInfo[activeSection] && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{sectionInfo[activeSection]!.title}</h2>
                <p className="mt-2 text-on-surface-variant">{sectionInfo[activeSection]!.subtitle}</p>
              </div>

              {sectionInfo[activeSection]!.details && (
                <Info title="À savoir"><p>{sectionInfo[activeSection]!.details}</p></Info>
              )}

              <EndpointList endpoints={endpointGroups[activeSection]!} />

              {/* ── Body et réponse par section ── */}
              {activeSection === "workspaces" && (
                <>
                  <Code code={`// POST /api/workspaces
{
  "name": "Mon Client",              // requis, string
  "offerType": "minutes",            // "minutes" | "calls", défaut: "minutes"
  "minutesIncluded": 2000,           // integer, défaut: 2000
  "minutesOverageLimit": 500,        // integer, optionnel
  "overageRateCents": 5              // integer (centimes/min), optionnel
}`} id="ws-body" lang="Body — Créer un workspace" />
                  <Code code={`// Réponse 201
{
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Mon Client",
    "offerType": "minutes",
    "minutesIncluded": 2000,
    "minutesUsed": 0,
    "cycleDurationDays": 30,
    "createdAt": "2026-04-12T..."
  },
  "meta": { "requestId": "...", "timestamp": "..." }
}`} id="ws-resp" lang="Réponse — Workspace créé" />
                </>
              )}

              {activeSection === "agents" && (
                <>
                  <Code code={`// POST /api/agents
{
  "workspaceId": "uuid",             // requis
  "name": "Agent Support FR",        // requis, string
  "prompt": "Tu es un agent...",     // string, le prompt système
  "firstMessage": "Bonjour !",       // string, phrase d'accueil
  "language": "fr-FR",               // défaut: "fr-FR"
  "voiceProvider": "cartesia",       // "cartesia" | "elevenlabs" | "deepgram"
  "voiceId": "Cartesia — Sophie",    // identifiant de la voix
  "llmModel": "gemini-2.5-flash",    // "gemini-2.5-flash" | "gpt-4o" | "gpt-4o-mini" | "claude-3.5-haiku"
  "temperature": 0.4,                // 0 à 2, défaut: 0.4
  "topP": 1.0,                       // 0 à 1, défaut: 1.0
  "silenceTimeoutSec": 7,            // secondes avant relance, défaut: 7
  "maxSilenceRetries": 2,            // nombre de relances, défaut: 2
  "voicemailEnabled": false,          // boolean
  "recordSession": true,             // enregistrer en DB, défaut: true
  "recordAudio": true                // enregistrer l'audio, défaut: true
}`} id="agent-body" lang="Body — Créer un agent" />
                  <Code code={examples.curlCreate} id="curl-agent" lang="cURL — Créer un agent" />
                  <Info title="Publication sur Vapi">
                    <p>Après création, l&apos;agent est en statut <code className="text-primary">brouillon</code>. Pour le rendre opérationnel :</p>
                    <ol className="mt-2 space-y-1">
                      <li>1. Configurez le prompt, la voix et le modèle LLM</li>
                      <li>2. Publiez avec <code className="text-primary">POST /api/vapi/sync-agent</code></li>
                      <li>3. L&apos;agent reçoit un <code className="text-primary">vapiAgentId</code> et peut recevoir des appels</li>
                    </ol>
                  </Info>
                </>
              )}

              {activeSection === "conversations" && (
                <>
                  <div className="rounded-2xl border border-white/5 bg-card p-6">
                    <h3 className="mb-3 text-sm font-bold text-on-surface">Paramètres de query</h3>
                    <div className="space-y-2">
                      {[
                        { param: "workspace_id", type: "uuid", desc: "Requis. ID du workspace." },
                        { param: "status", type: "string", desc: "Filtrer : success, missed, interrupted, voicemail" },
                        { param: "limit", type: "integer", desc: "Nombre max de résultats (défaut: 50)" },
                      ].map((p) => (
                        <div key={p.param} className="flex items-center gap-4 rounded-lg bg-surface-container-lowest px-4 py-2.5">
                          <code className="w-28 text-xs font-bold text-primary">{p.param}</code>
                          <span className="w-16 text-[10px] text-on-surface-variant">{p.type}</span>
                          <span className="text-xs text-on-surface-variant">{p.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Code code={`// Réponse — Objet conversation
{
  "id": "uuid",
  "workspaceId": "uuid",
  "agentId": "uuid",
  "type": "phone",                // "phone" | "web"
  "direction": "inbound",         // "inbound" | "outbound"
  "callerNumber": "+33612345678",
  "status": "success",            // success | missed | interrupted | voicemail
  "sentiment": "positive",        // positive | neutral | negative
  "durationSeconds": 245,
  "isBilled": true,
  "transcript": [
    { "role": "agent", "content": "Bonjour...", "ts": "14:20:01" },
    { "role": "user", "content": "Oui...", "ts": "14:20:08" }
  ],
  "summary": "L'utilisateur souhaitait...",
  "tags": ["VIP"],
  "startedAt": "2026-04-12T14:20:00Z",
  "endedAt": "2026-04-12T14:24:05Z"
}`} id="conv-resp" lang="Structure — Objet conversation" />
                </>
              )}

              {activeSection === "contacts" && (
                <>
                  <Code code={`// POST /api/contacts
{
  "workspaceId": "uuid",             // requis
  "firstName": "Marie",              // requis, string
  "lastName": "Dupont",              // requis, string
  "phone": "+33612345678",           // string, optionnel
  "email": "marie@example.fr",      // email valide, optionnel
  "tags": ["VIP", "Prospect chaud"] // tableau de strings, optionnel
}`} id="contact-body" lang="Body — Créer un contact" />
                  <Code code={examples.jsContact} id="js-contact2" lang="JavaScript — Créer un contact" />
                </>
              )}

              {activeSection === "campaigns" && (
                <>
                  <Code code={`// POST /api/campaigns
{
  "workspaceId": "uuid",             // requis
  "agentId": "uuid",                 // requis, l'agent qui passera les appels
  "name": "Relance Prospects",       // requis, string
  "contacts": [                      // tableau de contacts à appeler
    { "name": "Marie Dupont", "phone": "+33612345678" },
    { "name": "Jean Martin", "phone": "+33723456789" }
  ],
  "callWindowStart": "09:00",        // heure de début (HH:MM)
  "callWindowEnd": "18:00",          // heure de fin (HH:MM)
  "maxRetries": 2,                   // tentatives max par contact
  "retryDelayMinutes": 60            // délai entre tentatives (minutes)
}`} id="camp-body" lang="Body — Créer une campagne" />
                  <Info title="Flux d'une campagne">
                    <ol className="mt-2 space-y-1">
                      <li>1. Créez la campagne → statut <code className="text-primary">draft</code></li>
                      <li>2. Lancez : <code className="text-primary">POST /api/campaigns/&#123;id&#125;/start</code> → statut <code className="text-primary">active</code></li>
                      <li>3. Pause : <code className="text-primary">POST .../pause</code> → statut <code className="text-primary">paused</code></li>
                      <li>4. Arrêt : <code className="text-primary">POST .../stop</code> → statut <code className="text-primary">completed</code></li>
                    </ol>
                  </Info>
                  <div className="rounded-2xl border border-white/5 bg-card p-6">
                    <h3 className="mb-3 text-sm font-bold text-on-surface">Statuts possibles</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { s: "draft", c: "bg-secondary/10 text-secondary" },
                        { s: "active", c: "bg-tertiary/10 text-tertiary" },
                        { s: "paused", c: "bg-orange-400/10 text-orange-400" },
                        { s: "completed", c: "bg-white/5 text-on-surface-variant" },
                        { s: "failed", c: "bg-error/10 text-error" },
                      ].map((st) => (
                        <span key={st.s} className={`rounded-full px-3 py-1 text-xs font-bold ${st.c}`}>{st.s}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeSection === "leads" && (
                <>
                  <Code code={`// POST /api/leads
{
  "workspaceId": "uuid",             // requis
  "name": "Marie Dupont",            // requis, string
  "company": "Immo Paris",           // string, optionnel
  "phone": "+33612345678",           // string, optionnel
  "email": "marie@immo.fr",         // string, optionnel
  "value": "2 400 €",               // valeur estimée, string
  "source": "Appel entrant",        // origine du lead
  "stage": "new"                     // new | contacted | qualified | converted | lost
}

// PATCH /api/leads/{id}/stage — Changer l'étape
{ "stage": "qualified" }`} id="lead-body" lang="Body — Créer / déplacer un lead" />
                  <Info title="Pipeline de vente">
                    <div className="mt-2 flex items-center gap-2">
                      {["new", "contacted", "qualified", "converted"].map((s, i) => (
                        <div key={s} className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{s}</span>
                          {i < 3 && <span className="text-on-surface-variant">→</span>}
                        </div>
                      ))}
                    </div>
                  </Info>
                </>
              )}

              {activeSection === "tags" && (
                <Code code={`// POST /api/tags
{
  "workspaceId": "uuid",             // requis
  "name": "VIP",                     // requis, string (max 100 car.)
  "color": "#7B5CFA"                 // requis, hex (#RRGGBB)
}

// PATCH /api/tags/{id}
{ "name": "Prospect chaud", "color": "#FF7F3F" }`} id="tag-body" lang="Body — Créer / modifier un tag" />
              )}

              {activeSection === "teams" && (
                <Code code={`// POST /api/teams
{
  "workspaceId": "uuid",             // requis
  "name": "Équipe Support",          // requis, string
  "color": "#4F7FFF"                 // hex, défaut: #4F7FFF
}`} id="team-body" lang="Body — Créer une équipe" />
              )}

              {activeSection === "notes" && (
                <Code code={`// POST /api/notes
{
  "workspaceId": "uuid",             // requis
  "conversationId": "uuid",          // optionnel, lier à un appel
  "content": "Client à rappeler...", // requis, string
  "action": "rappel"                 // "rappel" | "email" | "transfert" | "none"
}`} id="note-body" lang="Body — Créer une note" />
              )}

              {activeSection === "knowledge" && (
                <Code code={`// POST /api/knowledge-bases
{
  "workspaceId": "uuid",             // requis
  "name": "FAQ Produit",             // requis, string
  "mode": "full_context"             // "full_context" | "rag"
}

// full_context : tout le contenu injecté dans le prompt de l'agent
// rag : recherche vectorielle, seuls les passages pertinents sont injectés`} id="kb-body" lang="Body — Créer une base de connaissances" />
              )}

              {activeSection === "phone" && (
                <Code code={`// POST /api/phone-numbers
{
  "workspaceId": "uuid",             // requis
  "number": "+33187000000",          // requis, format E.164
  "provider": "sip_trunk",           // "sip_trunk" (défaut)
  "friendlyName": "Numéro Support"   // optionnel, nom d'affichage
}`} id="phone-body" lang="Body — Ajouter un numéro" />
              )}

              {activeSection === "tokens" && (
                <>
                  <Code code={`// POST /api/tokens
{
  "workspaceId": "uuid",             // requis
  "name": "Production API"           // requis, label du token
}

// Réponse 201 — Le token complet n'est retourné QU'UNE SEULE FOIS
{
  "data": {
    "id": "uuid",
    "name": "Production API",
    "tokenPrefix": "voc_a1b2c3d4...",
    "rawToken": "voc_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",  // ⚠️ À copier immédiatement
    "createdAt": "2026-04-12T..."
  }
}`} id="token-body" lang="Body & Réponse — Créer un token" />
                  <Info title="Important">
                    <p>Le champ <code className="text-primary">rawToken</code> n&apos;est retourné <strong>qu&apos;à la création</strong>. Il est ensuite stocké en hash SHA-256 et ne peut plus être récupéré. Copiez-le immédiatement.</p>
                  </Info>
                </>
              )}

              {activeSection === "webhooks" && (
                <>
                  <Code code={`// POST /api/webhooks
{
  "workspaceId": "uuid",             // requis
  "url": "https://votre-app.com/webhook",  // requis, URL valide
  "events": ["call.ended", "campaign.completed"]  // requis, min 1
}

// Un secret HMAC est auto-généré : whsec_xxxxxxxxxxxx`} id="wh-body" lang="Body — Créer un webhook" />
                  <div className="rounded-2xl border border-white/5 bg-card p-6">
                    <h3 className="mb-3 text-sm font-bold text-on-surface">Événements disponibles</h3>
                    <div className="space-y-2">
                      {[
                        { event: "call.started", desc: "Un appel vient de démarrer — contient l'ID de l'agent et le numéro appelant" },
                        { event: "call.ended", desc: "Un appel s'est terminé — inclut le transcript complet, la durée, le sentiment et le résumé IA" },
                        { event: "call.transferred", desc: "Un appel a été transféré vers un autre numéro ou agent" },
                        { event: "campaign.completed", desc: "Tous les contacts d'une campagne ont été appelés — inclut les statistiques finales" },
                      ].map((ev) => (
                        <div key={ev.event} className="rounded-lg bg-surface-container-lowest px-4 py-3">
                          <code className="text-sm font-bold text-primary">{ev.event}</code>
                          <p className="mt-1 text-xs text-on-surface-variant">{ev.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Code code={examples.webhookPayload} id="wh-payload" lang="Payload — call.ended" />
                  <Code code={examples.webhookVerify} id="wh-verify" lang="Node.js — Vérifier la signature" />
                  <Info title="Signature HMAC">
                    <p>Chaque requête webhook inclut le header <code className="text-primary">X-Callpme-Signature</code>. Vérifiez-le pour vous assurer que la requête vient bien de Callpme et n&apos;a pas été altérée.</p>
                  </Info>
                </>
              )}

              {activeSection === "billing" && (
                <Code code={`// GET /api/billing/usage?workspace_id={id}
// Réponse :
{
  "data": {
    "minutesUsed": 1440,
    "minutesIncluded": 2000,
    "minutesRemaining": 560,
    "daysRemaining": 18
  }
}

// GET /api/stats?workspace_id={id}
// Réponse :
{
  "data": {
    "minutesUsed": 1440,
    "minutesIncluded": 2000,
    "minutesRemaining": 560,
    "totalCalls": 487,
    "answerRate": 92.4,
    "daysRemaining": 18
  }
}`} id="billing-resp" lang="Réponses — Facturation & Stats" />
              )}

              {activeSection === "favorites" && (
                <Code code={`// POST /api/favorites
{
  "type": "agent",                   // "agent" | "contact" | "campaign" | "conversation"
  "name": "Agent Support FR",        // requis, nom affiché
  "icon": "smart_toy",               // Material Symbols icon name
  "href": "/agents/uuid"             // requis, lien vers la ressource
}`} id="fav-body" lang="Body — Ajouter un favori" />
              )}

              {activeSection === "chat" && (
                <>
                  <Code code={`// POST /api/chat/channels
{
  "workspaceId": "uuid",             // requis
  "name": "Général",                 // requis, nom du channel
  "icon": "tag"                      // Material Symbols icon, optionnel
}

// POST /api/chat/messages
{
  "channelId": "uuid",               // requis
  "content": "Bonjour l'équipe !"    // requis, contenu du message
}
// L'auteur est automatiquement rempli depuis la session`} id="chat-body" lang="Body — Channels & Messages" />
                  <Info title="Temps réel">
                    <p>Les messages sont rafraîchis automatiquement toutes les 5 secondes. Une intégration Supabase Realtime est prévue pour des notifications instantanées.</p>
                  </Info>
                </>
              )}

              {activeSection === "vapi" && (
                <>
                  <Code code={`// POST /api/vapi/sync-agent
{
  "agentId": "uuid"                  // requis, ID de l'agent Callpme
}
// → Crée ou met à jour l'assistant Vapi correspondant
// → L'agent reçoit un vapiAgentId et passe en statut "publié"

// POST /api/vapi/call-test
{
  "agentId": "uuid",                 // requis, agent avec vapiAgentId
  "phoneNumber": "+33612345678"      // requis, numéro à appeler (format E.164)
}
// → Lance un vrai appel téléphonique via Vapi`} id="vapi-body" lang="Body — Synchronisation & Appel test" />
                  <Code code={examples.vapiSync} id="vapi-sync" lang="JavaScript — Publier un agent" />
                  <Code code={examples.vapiCall} id="vapi-call" lang="JavaScript — Lancer un appel test" />
                  <Info title="Prérequis">
                    <p>L&apos;agent doit être <strong>sauvegardé</strong> avec un prompt valide avant la publication. Le bouton <strong>PUBLIER</strong> dans l&apos;éditeur d&apos;agent effectue automatiquement la synchronisation Vapi.</p>
                  </Info>
                </>
              )}

              {activeSection === "anomalies" && (
                <Code code={`// POST /api/anomalies/{id}/resolve
// Aucun body requis — marque l'anomalie comme résolue
// Réponse :
{
  "data": {
    "id": "uuid",
    "type": "spike",              // "spike" | "drop" | "latency"
    "severity": "high",           // "high" | "medium" | "low"
    "title": "Pic d'appels manqués",
    "description": "12 appels manqués entre 12h et 13h",
    "resolved": true,
    "resolvedAt": "2026-04-12T..."
  }
}`} id="anomaly-resp" lang="Réponse — Résoudre une anomalie" />
              )}

              {activeSection === "quality" && (
                <Code code={`// GET /api/quality?workspace_id={id}
// Réponse :
{
  "data": [
    {
      "agentId": "uuid",
      "name": "Agent Support FR",
      "score": 92,                // /100, calculé automatiquement
      "completionRate": 96,       // % d'appels complétés
      "sentimentPositive": 78,    // % de sentiment positif
      "avgDuration": 222,         // durée moyenne en secondes
      "responseTime": 1.2,        // temps de réponse en secondes
      "trend": 3                  // évolution du score cette semaine
    }
  ]
}`} id="quality-resp" lang="Réponse — Scores de qualité" />
              )}

              {activeSection === "activity" && (
                <Code code={`// GET /api/activity?workspace_id={id}&limit=20
// Réponse :
{
  "data": [
    {
      "id": "uuid",
      "type": "creation",         // "call" | "creation" | "modification" | "deletion" | "campaign"
      "description": "Agent Support FR créé",
      "detail": "Voix : Cartesia Sophie",
      "userName": "Alex Rivera",
      "createdAt": "2026-04-12T..."
    }
  ]
}`} id="activity-resp" lang="Réponse — Journal d'activité" />
              )}

              {activeSection === "recordings" && (
                <Code code={`// GET /api/recordings?workspace_id={id}
// Réponse :
{
  "data": [
    {
      "id": "uuid",
      "conversationId": "uuid",
      "agentName": "Agent Support FR",
      "callerNumber": "+33 6 12 •••• 89",
      "audioUrl": "https://storage.../recording.mp3",
      "durationSeconds": 252,
      "sentiment": "positive",
      "tags": ["VIP"],
      "createdAt": "2026-04-12T..."
    }
  ]
}`} id="recordings-resp" lang="Réponse — Enregistrements" />
              )}
            </div>
          )}

          {/* ── ERREURS ── */}
          {activeSection === "errors" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gestion des erreurs</h2>
                <p className="mt-2 text-on-surface-variant">Format standardisé pour toutes les erreurs.</p>
              </div>
              <Code code={examples.error} id="err-format" lang="Format d'erreur" />
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h3 className="mb-4 text-sm font-bold text-on-surface">Codes HTTP</h3>
                <div className="space-y-2">
                  {[
                    { code: "200", label: "OK", desc: "Requête réussie", c: "text-tertiary" },
                    { code: "201", label: "Created", desc: "Ressource créée", c: "text-tertiary" },
                    { code: "401", label: "Unauthorized", desc: "Token invalide", c: "text-error" },
                    { code: "403", label: "Forbidden", desc: "Accès refusé", c: "text-error" },
                    { code: "404", label: "Not Found", desc: "Ressource introuvable", c: "text-orange-400" },
                    { code: "422", label: "Validation", desc: "Données invalides", c: "text-orange-400" },
                    { code: "429", label: "Rate Limit", desc: "Trop de requêtes", c: "text-error" },
                    { code: "500", label: "Server Error", desc: "Erreur interne", c: "text-error" },
                  ].map((e) => (
                    <div key={e.code} className="flex items-center gap-4 rounded-lg bg-surface-container-lowest px-4 py-2.5">
                      <span className={`w-10 text-sm font-bold ${e.c}`}>{e.code}</span>
                      <span className="w-28 text-sm font-bold text-on-surface">{e.label}</span>
                      <span className="text-xs text-on-surface-variant">{e.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/5 bg-card p-6">
                <h3 className="mb-4 text-sm font-bold text-on-surface">Codes d&apos;erreur</h3>
                <div className="space-y-2">
                  {[
                    { code: "UNAUTHORIZED", desc: "Token invalide ou expiré" },
                    { code: "FORBIDDEN", desc: "Accès non autorisé" },
                    { code: "NOT_FOUND", desc: "Ressource inexistante" },
                    { code: "VALIDATION_ERROR", desc: "Données du body invalides" },
                    { code: "INTERNAL_ERROR", desc: "Erreur serveur" },
                    { code: "CONFLICT", desc: "Ressource déjà existante" },
                  ].map((e) => (
                    <div key={e.code} className="flex items-center gap-4 rounded-lg bg-surface-container-lowest px-4 py-2.5">
                      <code className="w-40 text-xs font-bold text-error">{e.code}</code>
                      <span className="text-xs text-on-surface-variant">{e.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
