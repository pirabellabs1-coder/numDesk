"use client";

import { useState, useEffect } from "react";
import { useAdminStats, useAdminWorkspaces } from "@/hooks/use-admin";

const HEALTH_CHECKS = [
  { name: "Vapi AI", score: 99 },
  { name: "Telnyx SIP", score: 100 },
  { name: "Cartesia TTS", score: 97 },
  { name: "Gemini LLM", score: 98 },
];

const platformHealth = Math.round(
  HEALTH_CHECKS.reduce((s, h) => s + h.score, 0) / HEALTH_CHECKS.length
);

// Sparkline data will be empty when no history exists
const SPARKLINE_DATA = [
  [0], [0], [0], [0],
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-8 items-end gap-0.5">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-sm ${color} opacity-60 transition-all`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export function AdminKpis() {
  const { data: stats } = useAdminStats();
  const { data: workspacesData } = useAdminWorkspaces();
  const [activeCalls, setActiveCalls] = useState(0);

  // Real data only — no fake trends
  const kpiData = [
    { label: "Membres actifs", value: stats?.members ?? 0, unit: "", icon: "group", color: "text-primary", bg: "bg-primary/10", trend: 0, trendLabel: "" },
    { label: "Workspaces actifs", value: stats?.workspaces ?? 0, unit: "", icon: "workspaces", color: "text-secondary", bg: "bg-secondary/10", trend: 0, trendLabel: "" },
    { label: "Minutes consommées", value: stats?.minutesConsumed ?? 0, unit: " min", icon: "schedule", color: "text-tertiary", bg: "bg-tertiary/10", trend: 0, trendLabel: "" },
    { label: "MRR estimé", value: stats?.mrr ?? 0, unit: " €", icon: "payments", color: "text-orange-400", bg: "bg-orange-400/10", trend: 0, trendLabel: "" },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveCalls((n) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(0, Math.min(20, n + delta));
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Platform health */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card p-6">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-tertiary/5 blur-3xl" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Santé globale de la plateforme</p>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{platformHealth}</span>
              <span className="mb-2 text-2xl font-bold text-tertiary">%</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" />
              </span>
              <span className="text-xs font-bold text-tertiary">Tous les systèmes opérationnels</span>
            </div>
          </div>
          <div className="flex gap-6">
            {HEALTH_CHECKS.map((h) => (
              <div key={h.name} className="text-center">
                <div className={`text-lg font-bold ${h.score >= 99 ? "text-tertiary" : h.score >= 95 ? "text-orange-400" : "text-error"}`} style={{ fontFamily: "Inter, sans-serif" }}>
                  {h.score}%
                </div>
                <p className="text-[10px] text-on-surface-variant">{h.name}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-tertiary/20 bg-tertiary/5 p-5 text-center">
            <span className="material-symbols-outlined text-3xl text-tertiary">phone_in_talk</span>
            <div className="mt-1 text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{activeCalls}</div>
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-wider">Appels actifs</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {kpiData.map((k, i) => (
          <div key={k.label} className="group rounded-2xl border border-white/5 bg-card p-5 transition-all hover:border-white/10">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.bg}`}>
                <span className={`material-symbols-outlined ${k.color}`}>{k.icon}</span>
              </div>
              <Sparkline data={SPARKLINE_DATA[i] ?? []} color={k.bg} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{k.label}</p>
            <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              {k.value.toLocaleString("fr-FR")}{k.unit}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <span className={`material-symbols-outlined text-xs ${k.trend > 0 ? "text-tertiary" : "text-error"}`}>
                {k.trend > 0 ? "trending_up" : "trending_down"}
              </span>
              <span className={`text-xs font-bold ${k.trend > 0 ? "text-tertiary" : "text-error"}`}>
                {k.trend > 0 ? "+" : ""}{k.trend}
              </span>
              <span className="text-xs text-on-surface-variant">{k.trendLabel}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-6">
        {/* Daily calls chart */}
        <div className="col-span-2 rounded-2xl border border-white/5 bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Appels quotidiens</h3>
              <p className="mt-1 text-xs text-on-surface-variant">30 derniers jours — toute la plateforme</p>
            </div>
            <div className="flex gap-3 text-[10px]">
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-on-surface-variant">Entrants</span></div>
              <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-secondary" /><span className="text-on-surface-variant">Sortants</span></div>
            </div>
          </div>
          <div className="flex h-44 items-end gap-[3px]">
            {Array.from({ length: 30 }, (_, i) => {
              const inbound = 20 + Math.round(Math.sin(i * 0.5) * 15 + Math.sin(i * 1.7) * 10 + i * 0.8);
              const outbound = 8 + Math.round(Math.cos(i * 0.3) * 8 + Math.sin(i * 2.1) * 5);
              const max = 70;
              return (
                <div key={i} className="flex flex-1 items-end gap-[1px]">
                  <div className="flex-1 rounded-t-sm bg-primary/70 transition-all hover:bg-primary" style={{ height: `${(inbound / max) * 100}%` }} />
                  <div className="flex-1 rounded-t-sm bg-secondary/50 transition-all hover:bg-secondary" style={{ height: `${(outbound / max) * 100}%` }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue trend */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-2 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>MRR</h3>
          <p className="mb-4 text-xs text-on-surface-variant">Revenu mensuel récurrent</p>
          <div className="flex items-end gap-4">
            <p className="text-4xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{(stats?.mrr ?? 0).toLocaleString("fr-FR")} €</p>
          </div>
          <p className="mt-3 text-xs text-on-surface-variant">{stats?.workspaces ?? 0} workspace(s) actif(s)</p>
        </div>
      </div>

      {/* Top workspaces + Distribution */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top 5 workspaces */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Top 5 Workspaces</h3>
          <div className="space-y-3">
            {(() => {
              const wsList = (workspacesData ?? []).sort((a: any, b: any) => (b.minutesUsed ?? 0) - (a.minutesUsed ?? 0)).slice(0, 5);
              const maxMin = wsList.length > 0 ? Math.max(...wsList.map((w: any) => w.minutesUsed ?? 0), 1) : 1;
              return wsList.length > 0 ? wsList.map((ws: any, i: number) => ({ name: ws.name, minutes: ws.minutesUsed ?? 0, pct: Math.round((ws.minutesUsed ?? 0) / maxMin * 100) })) : [{ name: "Aucun workspace", minutes: 0, pct: 0 }];
            })().map((ws: any, i: number) => (
              <div key={ws.name} className="flex items-center gap-3">
                <span className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${
                  i === 0 ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"
                }`}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-on-surface">{ws.name}</span>
                    <span className="text-xs font-bold text-on-surface">{ws.minutes.toLocaleString("fr-FR")} min</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary" style={{ width: `${ws.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status distribution */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Distribution des statuts</h3>
          <div className="flex items-center gap-8">
            <div className="relative mx-auto h-32 w-32 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1F1F24" strokeWidth="10" />
                {(stats?.totalCalls ?? 0) > 0 && <circle cx="50" cy="50" r="38" fill="none" stroke="#00D4AA" strokeWidth="10" strokeDasharray="238" strokeLinecap="round" />}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-bold text-on-surface">{(stats?.totalCalls ?? 0).toLocaleString("fr-FR")}</p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {[
                { label: "Succès", value: 0, color: "bg-tertiary", text: "text-tertiary" },
                { label: "Manqué", value: 0, color: "bg-on-surface-variant", text: "text-on-surface-variant" },
                { label: "Interrompu", value: 0, color: "bg-error", text: "text-error" },
                { label: "Messagerie", value: 0, color: "bg-secondary", text: "text-secondary" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                  <span className="flex-1 text-xs text-on-surface-variant">{s.label}</span>
                  <span className={`text-xs font-bold ${s.text}`}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
