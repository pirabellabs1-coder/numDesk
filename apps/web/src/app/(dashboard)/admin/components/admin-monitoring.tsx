"use client";

import { useState, useEffect } from "react";

type ProviderStatus = "operational" | "degraded" | "incident";

interface Provider {
  id: string;
  name: string;
  category: string;
  icon: string;
  latency: number;
  uptime: number;
  status: ProviderStatus;
  lastIncident: string;
  calls24h?: number;
}

const PROVIDERS: Provider[] = [
  { id: "vapi", name: "Vapi AI", category: "Orchestrateur", icon: "hub", latency: 142, uptime: 99.97, status: "operational", lastIncident: "Il y a 30 jours", calls24h: 1284 },
  { id: "cartesia", name: "Cartesia TTS", category: "Synthèse vocale", icon: "record_voice_over", latency: 148, uptime: 99.94, status: "operational", lastIncident: "Il y a 12 jours" },
  { id: "elevenlabs", name: "ElevenLabs", category: "Synthèse vocale", icon: "mic", latency: 210, uptime: 99.8, status: "operational", lastIncident: "Il y a 5 jours" },
  { id: "gemini", name: "Gemini 2.5 Flash", category: "LLM", icon: "psychology", latency: 320, uptime: 99.92, status: "operational", lastIncident: "Il y a 20 jours" },
  { id: "telnyx", name: "Telnyx SIP", category: "Téléphonie", icon: "call", latency: 18, uptime: 100, status: "operational", lastIncident: "Aucun incident" },
  { id: "supabase", name: "Supabase DB", category: "Base de données", icon: "database", latency: 6, uptime: 100, status: "operational", lastIncident: "Aucun incident" },
];

const STATUS_LABELS: Record<ProviderStatus, string> = { operational: "Opérationnel", degraded: "Dégradé", incident: "Incident" };
const STATUS_COLORS: Record<ProviderStatus, string> = {
  operational: "text-tertiary bg-tertiary/10",
  degraded: "text-orange-400 bg-orange-400/10",
  incident: "text-error bg-error/10",
};
const STATUS_DOT: Record<ProviderStatus, string> = {
  operational: "bg-tertiary",
  degraded: "bg-orange-400",
  incident: "bg-error",
};

const LATENCY_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}h`,
  vapi: 120 + Math.round(Math.sin(i * 0.5) * 30 + Math.random() * 20),
  cartesia: 140 + Math.round(Math.cos(i * 0.4) * 25 + Math.random() * 15),
}));

export function AdminMonitoring() {
  const [liveLatencies, setLiveLatencies] = useState<Record<string, number>>(
    Object.fromEntries(PROVIDERS.map((p) => [p.id, p.latency]))
  );

  useEffect(() => {
    const t = setInterval(() => {
      setLiveLatencies((prev) => {
        const next = { ...prev };
        for (const p of PROVIDERS) {
          next[p.id] = Math.max(5, p.latency + Math.round((Math.random() - 0.5) * 20));
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const maxLatency = Math.max(...LATENCY_HISTORY.map((h) => Math.max(h.vapi, h.cartesia)));

  return (
    <div className="space-y-6">
      {/* Provider cards */}
      <div className="grid grid-cols-3 gap-4">
        {PROVIDERS.map((p) => (
          <div key={p.id} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low">
                  <span className="material-symbols-outlined text-on-surface-variant">{p.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-on-surface">{p.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{p.category}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[p.status]}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status]}`} />
                {STATUS_LABELS[p.status]}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-surface-container-low py-3">
                <p className="text-xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
                  {liveLatencies[p.id]} <span className="text-sm font-normal text-on-surface-variant">ms</span>
                </p>
                <p className="text-[10px] text-on-surface-variant">Latence P95</p>
              </div>
              <div className="rounded-xl bg-surface-container-low py-3">
                <p className={`text-xl font-bold ${p.uptime >= 99.9 ? "text-tertiary" : p.uptime >= 99 ? "text-orange-400" : "text-error"}`} style={{ fontFamily: "Syne, sans-serif" }}>
                  {p.uptime}%
                </p>
                <p className="text-[10px] text-on-surface-variant">Uptime 30j</p>
              </div>
            </div>
            {p.calls24h && (
              <p className="mt-3 text-center text-xs text-on-surface-variant">
                <span className="font-bold text-on-surface">{p.calls24h.toLocaleString("fr-FR")}</span> appels routés (24h)
              </p>
            )}
            <p className="mt-2 text-center text-[10px] text-on-surface-variant/50">Dernier incident : {p.lastIncident}</p>
          </div>
        ))}
      </div>

      {/* Latency chart 24h */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Latence P95 — 24 dernières heures</h3>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-primary/70" />Vapi AI</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-tertiary/70" />Cartesia</span>
          </div>
        </div>
        <div className="relative h-28">
          <div className="flex h-full items-end gap-0.5">
            {LATENCY_HISTORY.map((h, i) => (
              <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-0.5">
                <div className="w-full rounded-sm bg-primary/60 hover:bg-primary transition-all" style={{ height: `${(h.vapi / maxLatency) * 100}%` }} />
                <div className="w-full rounded-sm bg-tertiary/60 hover:bg-tertiary transition-all" style={{ height: `${(h.cartesia / maxLatency) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant/50">
          {["00h", "04h", "08h", "12h", "16h", "20h", "23h"].map((h) => <span key={h}>{h}</span>)}
        </div>
        <p className="mt-3 text-xs text-on-surface-variant">
          Objectif SLA : <span className="text-on-surface font-bold">&lt; 800ms</span> end-to-end — Latence actuelle : <span className="text-tertiary font-bold">~420ms</span> médiane
        </p>
      </div>
    </div>
  );
}
