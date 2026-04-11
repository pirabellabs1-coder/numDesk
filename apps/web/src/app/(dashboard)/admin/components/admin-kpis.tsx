"use client";

import { useState, useEffect } from "react";

const HEALTH_CHECKS = [
  { name: "Vapi AI", score: 99 },
  { name: "Telnyx SIP", score: 100 },
  { name: "Cartesia TTS", score: 97 },
  { name: "Gemini LLM", score: 98 },
];

const platformHealth = Math.round(
  HEALTH_CHECKS.reduce((s, h) => s + h.score, 0) / HEALTH_CHECKS.length
);

const KPIS = [
  { label: "Membres actifs", value: 24, unit: "", icon: "group", color: "text-primary", bg: "bg-primary/10", trend: +3, trendLabel: "ce mois" },
  { label: "Workspaces actifs", value: 87, unit: "", icon: "workspaces", color: "text-secondary", bg: "bg-secondary/10", trend: +12, trendLabel: "ce mois" },
  { label: "Minutes consommées", value: 48200, unit: " min", icon: "schedule", color: "text-tertiary", bg: "bg-tertiary/10", trend: +18, trendLabel: "% vs mois préc." },
  { label: "MRR estimé", value: 7340, unit: " €", icon: "payments", color: "text-orange-400", bg: "bg-orange-400/10", trend: +22, trendLabel: "% vs mois préc." },
];

const SPARKLINE_DATA = [
  [28, 35, 32, 45, 42, 55, 48, 62],
  [40, 44, 50, 47, 58, 62, 71, 87],
  [3200, 3800, 4200, 4600, 5100, 4800, 5400, 5800],
  [5200, 5600, 5900, 6100, 6400, 6800, 7100, 7340],
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
  const [activeCalls, setActiveCalls] = useState(7);

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
              <span className="text-6xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{platformHealth}</span>
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
                <div className={`text-lg font-bold ${h.score >= 99 ? "text-tertiary" : h.score >= 95 ? "text-orange-400" : "text-error"}`} style={{ fontFamily: "Syne, sans-serif" }}>
                  {h.score}%
                </div>
                <p className="text-[10px] text-on-surface-variant">{h.name}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-tertiary/20 bg-tertiary/5 p-5 text-center">
            <span className="material-symbols-outlined text-3xl text-tertiary">phone_in_talk</span>
            <div className="mt-1 text-2xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{activeCalls}</div>
            <p className="text-[10px] text-tertiary font-bold uppercase tracking-wider">Appels actifs</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map((k, i) => (
          <div key={k.label} className="group rounded-2xl border border-white/5 bg-card p-5 transition-all hover:border-white/10">
            <div className="mb-4 flex items-start justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.bg}`}>
                <span className={`material-symbols-outlined ${k.color}`}>{k.icon}</span>
              </div>
              <Sparkline data={SPARKLINE_DATA[i] ?? []} color={k.bg} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{k.label}</p>
            <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
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
    </div>
  );
}
