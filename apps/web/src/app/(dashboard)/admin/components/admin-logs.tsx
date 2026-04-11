"use client";

import { useState, useEffect } from "react";

type LogLevel = "info" | "warning" | "error" | "debug";
type LogCategory = "call" | "api" | "webhook" | "billing" | "auth" | "system";

interface Log {
  id: string;
  ts: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  member?: string;
  meta?: string;
}

function tsNow(offset = 0): string {
  const d = new Date(Date.now() - offset * 1000);
  return d.toISOString().replace("T", " ").substring(0, 19);
}

const INITIAL_LOGS: Log[] = [
  { id: "l1", ts: tsNow(5), level: "info", category: "call", message: "Appel entrant démarré", member: "Agence IA Pro", meta: "vapi_call_id=call_abc123, agent=Support FR" },
  { id: "l2", ts: tsNow(12), level: "info", category: "call", message: "Appel terminé — durée 4m12s", member: "Agence IA Pro", meta: "minutes_billed=4.2, cost=0.34€" },
  { id: "l3", ts: tsNow(28), level: "warning", category: "webhook", message: "Webhook delivery failed — HTTP 502", member: "BotVoice Pro", meta: "url=https://mon-crm.fr/webhook, retry=1/3" },
  { id: "l4", ts: tsNow(45), level: "info", category: "api", message: "POST /v1/calls — succès", member: "Voix IA Enterprise", meta: "token=cmp_prod_xxxx, status=200, 42ms" },
  { id: "l5", ts: tsNow(60), level: "error", category: "webhook", message: "Webhook désactivé automatiquement — 5 échecs", member: "BotVoice Pro", meta: "url=https://mon-crm.fr/webhook" },
  { id: "l6", ts: tsNow(90), level: "info", category: "billing", message: "Cycle facturé — 2 156 min utilisées", member: "CallBot Agency", meta: "stripe_invoice=inv_abc, amount=156.80€" },
  { id: "l7", ts: tsNow(120), level: "info", category: "auth", message: "Nouvelle inscription — essai gratuit démarré", member: "VoicEdge", meta: "email=antoine@voicedge.fr" },
  { id: "l8", ts: tsNow(180), level: "info", category: "api", message: "GET /v1/agents — 200", member: "Agence IA Pro", meta: "token=cmp_crm_xxxx, status=200, 18ms" },
  { id: "l9", ts: tsNow(240), level: "warning", category: "system", message: "Latence Cartesia dégradée", meta: "P95=620ms (seuil: 500ms)" },
  { id: "l10", ts: tsNow(300), level: "debug", category: "call", message: "Tool call exécuté — rappel_tool", member: "CallPro Agency", meta: "duration=240ms, status=200" },
  { id: "l11", ts: tsNow(360), level: "info", category: "call", message: "Campagne terminée — 80/80 contacts", member: "Agence IA Pro", meta: "success_rate=89%, duration=2h" },
  { id: "l12", ts: tsNow(420), level: "info", category: "api", message: "PUT /v1/agents/agent-2 — 200", member: "BotVoice Pro", meta: "token=cmp_prod_xxxx, 31ms" },
  { id: "l13", ts: tsNow(600), level: "error", category: "call", message: "STT timeout — appel échoué", member: "VoicEdge", meta: "vapi_error=stt_timeout, agent=Support FR" },
  { id: "l14", ts: tsNow(720), level: "info", category: "billing", message: "Alerte quota 80% envoyée", member: "Agence IA Pro", meta: "minutes=4020/5000" },
  { id: "l15", ts: tsNow(900), level: "debug", category: "system", message: "Heartbeat Vapi OK — 142ms", meta: "provider=vapi, region=eu-west" },
];

const LEVEL_STYLE: Record<LogLevel, string> = {
  info: "text-primary bg-primary/10",
  warning: "text-orange-400 bg-orange-400/10",
  error: "text-error bg-error/10",
  debug: "text-on-surface-variant bg-white/5",
};
const CAT_ICON: Record<LogCategory, string> = {
  call: "phone", api: "api", webhook: "webhook", billing: "payments", auth: "lock", system: "settings",
};
const CAT_STYLE: Record<LogCategory, string> = {
  call: "text-tertiary", api: "text-primary", webhook: "text-secondary",
  billing: "text-orange-400", auth: "text-on-surface-variant", system: "text-on-surface-variant",
};

const LOG_TEMPLATES: Array<Omit<Log, "id" | "ts">> = [
  { level: "info", category: "call", message: "Appel entrant démarré", member: "Agence IA Pro", meta: "vapi_call_id=call_new123" },
  { level: "info", category: "api", message: "POST /v1/calls — succès", member: "BotVoice Pro", meta: "200, 38ms" },
  { level: "debug", category: "system", message: "Heartbeat Telnyx OK — 16ms" },
  { level: "info", category: "call", message: "Appel terminé — 2m34s", member: "CallPro Agency", meta: "minutes_billed=2.6" },
];

let logCounter = INITIAL_LOGS.length + 1;

export function AdminLogs() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [levelFilter, setLevelFilter] = useState<"all" | LogLevel>("all");
  const [catFilter, setCatFilter] = useState<"all" | LogCategory>("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => {
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]!;
      const newLog: Log = {
        ...template,
        id: `l${++logCounter}`,
        ts: tsNow(0),
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
    }, 4000);
    return () => clearInterval(t);
  }, [live]);

  const filtered = logs.filter((l) => {
    const matchLevel = levelFilter === "all" || l.level === levelFilter;
    const matchCat = catFilter === "all" || l.category === catFilter;
    const matchSearch = !searchFilter || l.message.toLowerCase().includes(searchFilter.toLowerCase()) || l.member?.toLowerCase().includes(searchFilter.toLowerCase());
    return matchLevel && matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm">search</span>
          <input className="input-field pl-9 text-sm" placeholder="Filtrer les logs..." value={searchFilter} onChange={(e) => setSearchFilter(e.target.value)} />
        </div>
        <select className="input-field w-36" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as typeof levelFilter)}>
          <option value="all">Tous niveaux</option>
          <option value="error">Erreur</option>
          <option value="warning">Avertissement</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
        <select className="input-field w-36" value={catFilter} onChange={(e) => setCatFilter(e.target.value as typeof catFilter)}>
          <option value="all">Toutes catégories</option>
          <option value="call">Appels</option>
          <option value="api">API</option>
          <option value="webhook">Webhooks</option>
          <option value="billing">Facturation</option>
          <option value="auth">Auth</option>
          <option value="system">Système</option>
        </select>
        <button
          onClick={() => setLive(!live)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all ${live ? "bg-tertiary/10 text-tertiary" : "bg-surface-container-low text-on-surface-variant"}`}
        >
          {live && <span className="relative flex h-2 w-2"><span className="absolute animate-ping rounded-full h-full w-full bg-tertiary opacity-75" /><span className="relative rounded-full h-2 w-2 bg-tertiary" /></span>}
          {live ? "LIVE" : "Paused"}
        </button>
        <span className="text-xs text-on-surface-variant">{filtered.length} entrées</span>
      </div>

      {/* Log stream */}
      <div className="rounded-2xl border border-white/5 bg-card overflow-hidden">
        <div className="divide-y divide-white/5 max-h-[560px] overflow-y-auto">
          {filtered.map((l) => (
            <div key={l.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] group">
              <span className="font-mono text-[10px] text-on-surface-variant/50 whitespace-nowrap pt-0.5 w-40 shrink-0">{l.ts}</span>
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 ${LEVEL_STYLE[l.level]}`}>{l.level}</span>
              <span className={`material-symbols-outlined text-sm shrink-0 ${CAT_STYLE[l.category]}`}>{CAT_ICON[l.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-on-surface">{l.message}</p>
                <div className="mt-0.5 flex items-center gap-3 text-[10px] text-on-surface-variant">
                  {l.member && <span>{l.member}</span>}
                  {l.meta && <span className="font-mono">{l.meta}</span>}
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined mb-3 text-4xl opacity-20">search_off</span>
              <p className="text-sm">Aucun log correspondant</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
