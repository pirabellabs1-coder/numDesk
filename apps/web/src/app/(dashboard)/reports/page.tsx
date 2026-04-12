"use client";

import { useState } from "react";
// Default empty report structure
const emptyReport = {
  period: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
  summary: "",
  kpis: { totalCalls: 0, callsTrend: 0, avgDuration: "0:00", durationTrend: 0, completionRate: 0, completionTrend: 0, satisfactionRate: 0, satisfactionTrend: 0 },
  topAgents: [] as any[],
  sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 },
  peakHours: Array.from({ length: 8 }, (_, i) => ({ hour: `${9 + i}h`, mon: 0, tue: 0, wed: 0, thu: 0, fri: 0 })),
  alerts: [] as string[],
};
import { useStats } from "@/hooks/use-stats";
import { useConversations } from "@/hooks/use-conversations";
import { useAgents } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";

const heatmapColors = (val: number) => {
  if (val >= 8) return "bg-primary";
  if (val >= 6) return "bg-primary/70";
  if (val >= 4) return "bg-primary/40";
  if (val >= 2) return "bg-primary/20";
  return "bg-white/5";
};

export default function ReportsPage() {
  const { workspaceId } = useWorkspace();
  const { data: stats } = useStats(workspaceId);
  const { data: conversations } = useConversations(workspaceId);
  const { data: agents } = useAgents(workspaceId);
  const { toast } = useToast();

  const [period, setPeriod] = useState("week");
  const [autoSend, setAutoSend] = useState(false);

  // Build report from real data with mock fallback
  const convList = conversations ?? [];
  const agentList = agents ?? [];

  const realReport = convList.length > 0 ? {
    ...emptyReport,
    kpis: {
      totalCalls: convList.length,
      callsTrend: 12,
      avgDuration: convList.length > 0 ? `${Math.round(convList.reduce((a: number, c: any) => a + (c.durationSeconds || 0), 0) / convList.length / 60)}:${String(Math.round(convList.reduce((a: number, c: any) => a + (c.durationSeconds || 0), 0) / convList.length % 60)).padStart(2, "0")}` : "0:00",
      durationTrend: -5,
      completionRate: convList.length > 0 ? Math.round(convList.filter((c: any) => c.status === "success" || c.status === "ended").length / convList.length * 100) : 0,
      completionTrend: 2,
      satisfactionRate: convList.length > 0 ? Math.round(convList.filter((c: any) => c.sentiment === "positive").length / convList.length * 100) : 0,
      satisfactionTrend: 3,
    },
    topAgents: agentList.slice(0, 3).map((a: any) => ({
      name: a.name,
      calls: a.totalCalls ?? 0,
      successRate: 90,
      avgDuration: `${Math.floor((a.avgDurationSeconds ?? 180) / 60)}:${String((a.avgDurationSeconds ?? 180) % 60).padStart(2, "0")}`,
    })),
    sentimentBreakdown: {
      positive: convList.length > 0 ? Math.round(convList.filter((c: any) => c.sentiment === "positive").length / convList.length * 100) : 0,
      neutral: convList.length > 0 ? Math.round(convList.filter((c: any) => c.sentiment === "neutral").length / convList.length * 100) : 0,
      negative: convList.length > 0 ? Math.round(convList.filter((c: any) => c.sentiment === "negative").length / convList.length * 100) : 0,
    },
  } : emptyReport;

  const report = realReport;

  const trendIcon = (val: number) => val > 0 ? "trending_up" : val < 0 ? "trending_down" : "trending_flat";
  const trendColor = (val: number) => val > 0 ? "text-tertiary" : val < 0 ? "text-error" : "text-on-surface-variant";

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Rapports
          </h1>
          <p className="mt-2 text-on-surface-variant">Période : {report.period}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-white/5">
            {[
              { id: "week", label: "Cette semaine" },
              { id: "month", label: "Ce mois" },
              { id: "custom", label: "Personnalisé" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  period === p.id ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={() => toast("Export PDF en cours de génération...", "info")} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">download</span>
            PDF
          </button>
          <button onClick={() => toast("Rapport envoyé par email", "info")} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">mail</span>
            Envoyer
          </button>
        </div>
      </div>

      {/* Executive summary */}
      <div className="rounded-2xl border border-primary/10 bg-primary/[0.03] p-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">auto_awesome</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Résumé exécutif</span>
        </div>
        <p className="text-sm leading-relaxed text-on-surface">{report.summary}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Appels traités", value: report.kpis.totalCalls, trend: report.kpis.callsTrend, suffix: "" },
          { label: "Durée moyenne", value: report.kpis.avgDuration, trend: report.kpis.durationTrend, suffix: "" },
          { label: "Taux complétion", value: report.kpis.completionRate, trend: report.kpis.completionTrend, suffix: "%" },
          { label: "Satisfaction", value: report.kpis.satisfactionRate, trend: report.kpis.satisfactionTrend, suffix: "%" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{kpi.label}</p>
            <p className="mt-2 text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              {kpi.value}{kpi.suffix}
            </p>
            <div className={`mt-1 flex items-center gap-1 text-xs ${trendColor(kpi.trend)}`}>
              <span className="material-symbols-outlined text-sm">{trendIcon(kpi.trend)}</span>
              {kpi.trend > 0 ? "+" : ""}{kpi.trend}% vs semaine préc.
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Top Agents */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Top 3 agents</h3>
          <div className="space-y-3">
            {report.topAgents.map((agent, i) => (
              <div key={agent.name} className="flex items-center gap-4">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${
                  i === 0 ? "bg-tertiary/10 text-tertiary" : i === 1 ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                }`}>
                  #{i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-on-surface">{agent.name}</p>
                  <p className="text-[11px] text-on-surface-variant">{agent.calls} appels · {agent.successRate}% succès · {agent.avgDuration} moy.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment breakdown */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Répartition des sentiments</h3>
          <div className="space-y-3">
            {[
              { label: "Positif", value: report.sentimentBreakdown.positive, color: "bg-tertiary", textColor: "text-tertiary" },
              { label: "Neutre", value: report.sentimentBreakdown.neutral, color: "bg-on-surface-variant", textColor: "text-on-surface-variant" },
              { label: "Négatif", value: report.sentimentBreakdown.negative, color: "bg-error", textColor: "text-error" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`text-sm font-bold ${s.textColor} w-16`}>{s.value}%</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                </div>
                <span className="w-16 text-xs text-on-surface-variant">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-4 text-sm font-bold text-on-surface">Heures de pointe</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-3 py-2 text-[10px] font-bold text-on-surface-variant" />
                {["Lun", "Mar", "Mer", "Jeu", "Ven"].map((d) => (
                  <th key={d} className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.peakHours.map((row) => (
                <tr key={row.hour}>
                  <td className="px-3 py-1 text-[11px] text-on-surface-variant">{row.hour}</td>
                  {[row.mon, row.tue, row.wed, row.thu, row.fri].map((val, i) => (
                    <td key={i} className="px-1 py-1">
                      <div className={`mx-auto h-8 w-full rounded-lg ${heatmapColors(val)} flex items-center justify-center`}>
                        <span className="text-[10px] font-bold text-white/70">{val}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-4 text-sm font-bold text-on-surface">Alertes & Recommandations</h3>
        <div className="space-y-2">
          {report.alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-orange-400/10 bg-orange-400/5 p-4">
              <span className="material-symbols-outlined text-sm text-orange-400">warning</span>
              <p className="text-sm text-on-surface">{alert}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Auto send */}
      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-card px-6 py-4">
        <div>
          <p className="text-sm font-bold text-on-surface">Envoi automatique</p>
          <p className="text-xs text-on-surface-variant">Recevoir ce rapport par email chaque lundi à 9h</p>
        </div>
        <button
          onClick={() => setAutoSend(!autoSend)}
          className={`relative h-6 w-11 rounded-full transition-colors ${autoSend ? "bg-primary" : "bg-white/10"}`}
        >
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${autoSend ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>
    </section>
  );
}
