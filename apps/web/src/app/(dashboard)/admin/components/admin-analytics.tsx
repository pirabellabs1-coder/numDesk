"use client";

import { useState } from "react";

const CALLS_30D = [
  288, 412, 356, 520, 489, 610, 385, 720, 680, 540,
  466, 398, 340, 488, 810, 762, 634, 590, 688, 740,
  520, 640, 790, 870, 710, 620, 680, 840, 760, 720,
];

const SENTIMENTS = [
  { label: "Positif", value: 62, color: "bg-tertiary" },
  { label: "Neutre", value: 24, color: "bg-primary" },
  { label: "Négatif", value: 14, color: "bg-error" },
];

const TOP_WORKSPACES = [
  { name: "Agence IA Pro", agency: "Marc Andrieu", calls: 1284, minutes: 4820, color: "from-primary to-secondary" },
  { name: "Voix IA Enterprise", agency: "Théo Martin", calls: 2100, minutes: 8640, color: "from-secondary to-tertiary" },
  { name: "CallPro Agency", agency: "Clara Petit", calls: 980, minutes: 3200, color: "from-tertiary to-primary" },
  { name: "BotVoice Pro", agency: "Lucas Dubois", calls: 756, minutes: 1680, color: "from-primary/80 to-secondary/80" },
  { name: "CallBot Agency", agency: "Sophie Leroux", calls: 620, minutes: 890, color: "from-secondary/80 to-tertiary/80" },
];

// 7 days × 24 hours heatmap (calls intensity)
const HEATMAP = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const isWeekend = day >= 5;
    const isWorkHour = hour >= 9 && hour <= 18;
    const base = isWeekend ? 5 : isWorkHour ? 80 : 10;
    const peak = (hour === 10 || hour === 14) ? 40 : 0;
    return Math.min(100, base + peak + Math.round(Math.random() * 15));
  })
);

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function heatColor(v: number) {
  if (v < 15) return "bg-surface-container-high";
  if (v < 35) return "bg-primary/20";
  if (v < 55) return "bg-primary/40";
  if (v < 75) return "bg-primary/65";
  return "bg-primary/90";
}

export function AdminAnalytics() {
  const [chartPeriod, setChartPeriod] = useState<"7j" | "30j">("30j");
  const maxCalls = Math.max(...CALLS_30D);
  const data = chartPeriod === "7j" ? CALLS_30D.slice(-7) : CALLS_30D;
  const maxData = Math.max(...data);

  return (
    <div className="space-y-6">
      {/* Calls chart */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Volume d'appels</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Total : <span className="text-on-surface font-bold">{CALLS_30D.reduce((a, b) => a + b).toLocaleString("fr-FR")}</span> appels ce mois
            </p>
          </div>
          <div className="flex gap-1 rounded-xl bg-surface-container-low p-1">
            {(["7j", "30j"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setChartPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${chartPeriod === p ? "bg-primary text-white" : "text-on-surface-variant"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-36 items-end gap-0.5">
          {data.map((v, i) => (
            <div
              key={i}
              className="group relative flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/80 hover:from-primary/70 hover:to-primary cursor-pointer transition-all"
              style={{ height: `${(v / maxData) * 100}%` }}
            >
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden rounded bg-surface-container-highest px-1.5 py-0.5 text-[10px] text-on-surface group-hover:block whitespace-nowrap">
                {v}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant">
          {chartPeriod === "30j" ? ["1 mars", "8 mars", "15 mars", "22 mars", "31 mars"] : ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Sentiment distribution */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-5 font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Distribution des sentiments</h3>
          <div className="space-y-4">
            {SENTIMENTS.map((s) => (
              <div key={s.label}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-on-surface-variant">{s.label}</span>
                  <span className="font-bold text-on-surface">{s.value}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-surface-container-high">
                  <div className={`h-full rounded-full ${s.color} transition-all`} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-tertiary/5 border border-tertiary/10 p-3">
            <p className="text-xs text-tertiary font-bold">Score de satisfaction IA</p>
            <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>8.7 <span className="text-lg font-normal text-on-surface-variant">/ 10</span></p>
            <p className="text-[10px] text-on-surface-variant">Basé sur l'analyse des transcripts</p>
          </div>
        </div>

        {/* Top workspaces */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-5 font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Top 5 Workspaces</h3>
          <div className="space-y-3">
            {TOP_WORKSPACES.map((w, i) => (
              <div key={w.name} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-on-surface-variant w-4">#{i + 1}</span>
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${w.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{w.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{w.agency}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-on-surface">{w.calls.toLocaleString("fr-FR")}</p>
                  <p className="text-[10px] text-on-surface-variant">{w.minutes.toLocaleString("fr-FR")} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly heatmap */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-5 font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Heatmap d'utilisation — Volume horaire</h3>
        <div className="space-y-1">
          {HEATMAP.map((row, d) => (
            <div key={d} className="flex items-center gap-1">
              <span className="w-8 text-[10px] text-on-surface-variant text-right">{DAYS[d]}</span>
              <div className="flex flex-1 gap-0.5">
                {row.map((v, h) => (
                  <div
                    key={h}
                    className={`h-4 flex-1 rounded-sm ${heatColor(v)} transition-all hover:opacity-80`}
                    title={`${DAYS[d]} ${String(h).padStart(2, "0")}h — ${v} appels`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between pl-9 text-[10px] text-on-surface-variant">
          {["0h", "4h", "8h", "10h", "12h", "14h", "16h", "18h", "20h", "23h"].map((h) => <span key={h}>{h}</span>)}
        </div>
        <div className="mt-3 flex items-center gap-3 text-[10px] text-on-surface-variant">
          <span>Faible</span>
          {["bg-surface-container-high", "bg-primary/20", "bg-primary/40", "bg-primary/65", "bg-primary/90"].map((c, i) => (
            <span key={i} className={`h-3 w-6 rounded-sm ${c}`} />
          ))}
          <span>Élevé</span>
        </div>
      </div>
    </div>
  );
}
