"use client";

import { useState } from "react";
import Link from "next/link";
import { useStats } from "@/hooks/use-stats";
import { useConversations } from "@/hooks/use-conversations";
import { useActivity } from "@/hooks/use-activity";
import { useAgents } from "@/hooks/use-agents";
import { useWorkspace } from "@/providers/workspace-provider";
import { useAuth } from "@/providers/auth-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const defaultWidgets = [
  { id: "w-1", type: "minutes" as const, title: "Minutes en temps réel", size: "1x1" as const, enabled: true },
  { id: "w-2", type: "calls_today" as const, title: "Appels aujourd'hui", size: "1x1" as const, enabled: true },
  { id: "w-3", type: "active_agents" as const, title: "Agents actifs", size: "1x1" as const, enabled: true },
  { id: "w-4", type: "answer_rate" as const, title: "Taux de réponse", size: "1x1" as const, enabled: true },
  { id: "w-5", type: "recent_conversations" as const, title: "Dernières conversations", size: "2x1" as const, enabled: true },
  { id: "w-6", type: "active_campaigns" as const, title: "Campagnes en cours", size: "1x1" as const, enabled: false },
  { id: "w-7", type: "sentiment" as const, title: "Sentiment du jour", size: "1x1" as const, enabled: false },
  { id: "w-8", type: "quota_forecast" as const, title: "Prévision quota", size: "1x1" as const, enabled: false },
  { id: "w-9", type: "recent_activity" as const, title: "Activité récente", size: "2x1" as const, enabled: false },
];

const statusStyles: Record<string, string> = {
  success: "bg-tertiary/10 text-tertiary",
  missed: "bg-white/5 text-on-surface-variant",
  interrupted: "bg-error/10 text-error",
  voicemail: "bg-secondary/10 text-secondary",
};

export default function DashboardPage() {
  const { workspaceId, workspace } = useWorkspace();
  const { user } = useAuth();
  const { data: statsData, isLoading: loadingStats } = useStats(workspaceId);
  const { data: convData } = useConversations(workspaceId, { limit: 4 });
  const { data: actData } = useActivity(workspaceId, 4);
  const { data: agentsData } = useAgents(workspaceId);

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [widgets, setWidgets] = useState(defaultWidgets);

  const toggleWidget = (id: string) => {
    setWidgets(widgets.map((w) => w.id === id ? { ...w, enabled: !w.enabled } : w));
  };

  if (loadingStats) return <PageSkeleton />;

  // Real data — use workspace data as source of truth for minutes
  const wsMinIncluded = workspace?.minutesIncluded ?? 5;
  const wsMinUsed = workspace?.minutesUsed ?? 0;
  const stats = statsData ?? { minutesUsed: wsMinUsed, minutesIncluded: wsMinIncluded, minutesRemaining: wsMinIncluded - wsMinUsed, totalCalls: 0, answerRate: 0, daysRemaining: 30, sentimentBreakdown: { positive: 0, neutral: 0, negative: 0 } };
  const ws = workspace ?? { minutesUsed: 0, minutesIncluded: 5, daysRemaining: 30 };

  const quotaPercent = (stats.minutesIncluded ?? wsMinIncluded) > 0
    ? Math.round(((stats.minutesUsed ?? wsMinUsed) / (stats.minutesIncluded ?? wsMinIncluded)) * 100)
    : 0;
  const convList = convData ?? [];
  const recent = convList.slice(0, 4);
  const recentActivity = (actData ?? []).slice(0, 4);

  const activeAgents = (agentsData ?? []).filter((a: any) => a.isActive).length;
  const userName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "vous";

  // Sentiment from API (real data computed server-side)
  const sentiment = stats.sentimentBreakdown ?? { positive: 0, neutral: 0, negative: 0 };
  const positiveCount = sentiment.positive;
  const neutralCount = sentiment.neutral;
  const negativeCount = sentiment.negative;
  const total = positiveCount + neutralCount + negativeCount;
  const sentimentToday = total > 0
    ? { positive: Math.round(positiveCount / total * 100), neutral: Math.round(neutralCount / total * 100), negative: Math.round(negativeCount / total * 100) }
    : { positive: 0, neutral: 0, negative: 0 };

  return (
    <section className="mx-auto max-w-7xl space-y-10">
      {/* Customize panel */}
      {isCustomizing && (
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">dashboard_customize</span>
              <span className="text-sm font-bold text-on-surface">Personnaliser le tableau de bord</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setWidgets(defaultWidgets)}
                className="rounded-lg px-3 py-1.5 text-xs text-on-surface-variant hover:text-on-surface"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsCustomizing(false)}
                className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary"
              >
                Terminé
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {widgets.map((w) => (
              <button
                key={w.id}
                onClick={() => toggleWidget(w.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold transition-all ${
                  w.enabled
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-white/5 text-on-surface-variant hover:border-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-xs">{w.enabled ? "check_box" : "check_box_outline_blank"}</span>
                {w.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-4xl font-bold tracking-tight text-on-surface lg:text-5xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Bonjour, {userName}
            </h1>
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="rounded-lg p-2 text-on-surface-variant transition-colors hover:text-primary"
              title="Personnaliser"
            >
              <span className="material-symbols-outlined text-lg">dashboard_customize</span>
            </button>
          </div>
          <p className="mt-2 max-w-md text-on-surface-variant">
            {(stats.totalCalls ?? 0) > 0
              ? `${stats.totalCalls} appels traités · ${activeAgents} agent(s) actif(s) · ${stats.minutesUsed ?? 0} minutes consommées`
              : "Créez votre premier agent pour commencer à automatiser vos appels."
            }
          </p>
        </div>

        {/* Quota card */}
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/5 bg-card p-5 md:w-80">
          <div className="absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Usage Quota
            </span>
            <span className="text-xs font-bold text-primary">{quotaPercent}%</span>
          </div>
          <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-low">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-on-surface">
              {((stats.minutesUsed ?? 0)).toLocaleString("fr-FR")} /{" "}
              {((stats.minutesIncluded ?? wsMinIncluded)).toLocaleString("fr-FR")} min
            </span>
            <span className="text-on-surface-variant/60">
              {((stats.daysRemaining ?? 30))} jours restants
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: "timer",
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
            label: "Minutes utilisées",
            value: (stats.minutesUsed ?? 0).toLocaleString("fr-FR"),
            unit: "min",
            trend: "",
            trendColor: "text-on-surface-variant/40",
            trendIcon: null,
          },
          {
            icon: "hourglass_empty",
            iconBg: "bg-secondary/10",
            iconColor: "text-secondary",
            label: "Minutes restantes",
            value: (stats.minutesRemaining ?? 0).toLocaleString("fr-FR"),
            unit: "min",
            trend: "",
            trendColor: "text-on-surface-variant/40",
            trendIcon: null,
          },
          {
            icon: "call",
            iconBg: "bg-tertiary/10",
            iconColor: "text-tertiary",
            label: "Total Appels",
            value: (stats.totalCalls ?? 0).toLocaleString("fr-FR"),
            unit: "",
            trend: "",
            trendColor: "text-on-surface-variant/40",
            trendIcon: null,
          },
          {
            icon: "percent",
            iconBg: "bg-orange-400/10",
            iconColor: "text-orange-400",
            label: "Taux de décroché",
            value: (stats.answerRate ?? 0),
            unit: "%",
            trend: "",
            trendColor: "text-on-surface-variant/40",
            trendIcon: null,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group flex flex-col justify-between rounded-2xl border border-white/5 bg-card p-6 transition-colors duration-300 hover:bg-surface-container-low"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`rounded-lg p-2 ${stat.iconBg} ${stat.iconColor}`}
              >
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-bold ${stat.trendColor}`}
              >
                {stat.trendIcon && (
                  <span className="material-symbols-outlined text-sm">
                    {stat.trendIcon}
                  </span>
                )}
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {stat.label}
              </p>
              <h3
                className="text-3xl font-bold text-on-surface"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {stat.value}{" "}
                {stat.unit && (
                  <span className="text-sm font-normal text-on-surface-variant/50">
                    {stat.unit}
                  </span>
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calls per day chart — from real conversations */}
        <div className="rounded-2xl border border-white/5 bg-card p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Appels par jour</h2>
              <p className="mt-1 text-xs text-on-surface-variant">14 derniers jours</p>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /><span className="text-on-surface-variant">Entrants</span></div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-secondary" /><span className="text-on-surface-variant">Sortants</span></div>
            </div>
          </div>
          <div className="flex h-40 items-end gap-2">
            {(() => {
              // Build daily call data from real conversations
              const days = Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - 13 + i);
                const dayConvs = convList.filter((c: any) => {
                  const d = new Date(c.createdAt);
                  return d.toDateString() === date.toDateString();
                });
                return {
                  inbound: dayConvs.filter((c: any) => c.direction === "inbound").length,
                  outbound: dayConvs.filter((c: any) => c.direction === "outbound").length,
                  label: `${date.getDate()}/${date.getMonth() + 1}`,
                };
              });
              const max = Math.max(...days.map((d) => d.inbound + d.outbound), 1);
              return days.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full items-end gap-[2px]" style={{ height: "100%" }}>
                    <div className="flex-1 rounded-t-sm bg-primary/80 transition-all hover:bg-primary" style={{ height: `${(d.inbound / max) * 100}%`, minHeight: d.inbound > 0 ? "4px" : "0" }} />
                    <div className="flex-1 rounded-t-sm bg-secondary/60 transition-all hover:bg-secondary" style={{ height: `${(d.outbound / max) * 100}%`, minHeight: d.outbound > 0 ? "4px" : "0" }} />
                  </div>
                  <span className="text-[8px] text-on-surface-variant/40">{d.label}</span>
                </div>
              ));
            })()}
          </div>
          {convList.length === 0 && <p className="mt-4 text-center text-xs text-on-surface-variant/50">Les données apparaîtront avec vos premiers appels</p>}
        </div>

        {/* Donut chart - Agent distribution — from real agents */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h2 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Répartition par agent</h2>
          {(() => {
            const agentsList = agentsData ?? [];
            const totalAgentCalls = agentsList.reduce((a: number, ag: any) => a + (ag.totalCalls ?? 0), 0);
            const agentDistrib = agentsList.map((ag: any, i: number) => ({
              name: ag.name,
              calls: ag.totalCalls ?? 0,
              pct: totalAgentCalls > 0 ? Math.round((ag.totalCalls ?? 0) / totalAgentCalls * 100) : 0,
              color: ["bg-primary", "bg-secondary", "bg-tertiary", "bg-orange-400"][i % 4]!,
              hex: ["#4F7FFF", "#7B5CFA", "#00D4AA", "#FF7F3F"][i % 4]!,
            }));
            // Build conic gradient
            let gradientParts: string[] = [];
            let cumPct = 0;
            agentDistrib.forEach((ag) => {
              gradientParts.push(`${ag.hex} ${cumPct}% ${cumPct + ag.pct}%`);
              cumPct += ag.pct;
            });
            if (gradientParts.length === 0) gradientParts = ["#1F1F24 0% 100%"];

            return (
              <>
                <div className="mx-auto mb-6 flex h-36 w-36 items-center justify-center">
                  <div className="relative h-full w-full rounded-full" style={{ background: `conic-gradient(${gradientParts.join(", ")})` }}>
                    <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-on-surface">{(stats.totalCalls ?? totalAgentCalls).toLocaleString("fr-FR")}</p>
                        <p className="text-[9px] text-on-surface-variant">appels total</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {agentDistrib.length > 0 ? agentDistrib.map((a) => (
                    <div key={a.name} className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${a.color}`} />
                      <span className="flex-1 text-xs text-on-surface-variant">{a.name}</span>
                      <span className="text-xs font-bold text-on-surface">{a.pct}%</span>
                    </div>
                  )) : <p className="text-center text-xs text-on-surface-variant/50">Aucun agent</p>}
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Trend line + Sentiment arc */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Minutes consumption curve — from real stats */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Consommation de minutes</h2>
            <span className="text-xs text-on-surface-variant">Ce mois</span>
          </div>
          <div className="relative h-32">
            {[0, 25, 50, 75, 100].map((pct) => (
              <div key={pct} className="absolute left-0 right-0 border-t border-white/[0.03]" style={{ top: `${100 - pct}%` }} />
            ))}
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F7FFF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4F7FFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {(() => {
                const used = stats.minutesUsed ?? 0;
                const included = stats.minutesIncluded ?? wsMinIncluded;
                const pctUsed = Math.min(used / Math.max(included, 1), 1);
                const endY = 100 - pctUsed * 85;
                return (
                  <>
                    <path d={`M0,100 C50,${100 - pctUsed * 20} 100,${100 - pctUsed * 40} 150,${100 - pctUsed * 55} C200,${100 - pctUsed * 65} 250,${100 - pctUsed * 75} 300,${endY}`} fill="none" stroke="#4F7FFF" strokeWidth="2" />
                    <path d={`M0,100 C50,${100 - pctUsed * 20} 100,${100 - pctUsed * 40} 150,${100 - pctUsed * 55} C200,${100 - pctUsed * 65} 250,${100 - pctUsed * 75} 300,${endY} L300,120 L0,120 Z`} fill="url(#curveGrad)" />
                  </>
                );
              })()}
            </svg>
            <div className="absolute bottom-0 left-0 text-[9px] text-on-surface-variant/50">1 avr.</div>
            <div className="absolute bottom-0 right-0 text-[9px] text-on-surface-variant/50">Aujourd&apos;hui</div>
            <div className="absolute right-0 top-[12%] text-[9px] font-bold text-primary">{(stats.minutesUsed ?? 0).toLocaleString("fr-FR")} min</div>
          </div>
        </div>

        {/* Sentiment overview */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h2 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Sentiments des appels
          </h2>
          <div className="flex items-center gap-8">
            {/* Semi-circle gauge */}
            <div className="relative h-24 w-24 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1F1F24" strokeWidth="10" strokeDasharray="251" strokeDashoffset="125" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#00D4AA" strokeWidth="10" strokeDasharray="251" strokeDashoffset={251 - 251 * 0.5 * (sentimentToday.positive / 100)} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold text-tertiary">{sentimentToday.positive}%</p>
                  <p className="text-[8px] text-on-surface-variant">positif</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: "Positif", value: positiveCount, icon: "sentiment_satisfied", color: "text-tertiary", bg: "bg-tertiary" },
                { label: "Neutre", value: neutralCount, icon: "sentiment_neutral", color: "text-on-surface-variant", bg: "bg-on-surface-variant" },
                { label: "Négatif", value: negativeCount, icon: "sentiment_dissatisfied", color: "text-error", bg: "bg-error" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <span className={`material-symbols-outlined text-base ${s.color}`}>{s.icon}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full rounded-full ${s.bg}`} style={{ width: `${s.value}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs font-bold text-on-surface">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent conversations */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between px-2">
            <h2
              className="text-xl font-bold text-on-surface"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Conversations Récentes
            </h2>
            <Link
              href="/conversations"
              className="text-xs font-bold uppercase tracking-widest text-primary transition-all hover:underline"
            >
              Voir tout
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    {["Appelant", "Agent IA", "Durée", "Statut", "Date"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${
                            h === "Date" ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recent.map((conv) => (
                    <tr
                      key={conv.id}
                      className="transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                            <span className="material-symbols-outlined text-sm">
                              person
                            </span>
                          </div>
                          <span className="text-sm font-medium text-on-surface">
                            {conv.callerNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${conv.agentColor}`}
                          />
                          <span className="text-sm text-on-surface">
                            {conv.agentName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                        {conv.duration}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[conv.status]}`}
                        >
                          {conv.statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right text-xs text-on-surface-variant">
                        {conv.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right widgets */}
        <div className="space-y-6">
          {/* Live activity — from real data */}
          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Activité</h3>
              <Link href="/live" className="flex items-center gap-2 text-xs text-primary hover:underline">
                Voir le live <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </Link>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Agents actifs</p>
                <p className="mt-1 text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{activeAgents}</p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Conversations récentes</p>
                <p className="mt-1 text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{recent.length}</p>
              </div>
              {recent.length > 0 && (
                <div className="rounded-2xl bg-surface-container-low p-4">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Dernier appel</p>
                  <p className="mt-1 text-sm font-bold text-on-surface">{(recent[0] as any)?.callerNumber || "—"}</p>
                  <p className="text-[10px] text-on-surface-variant">{(recent[0] as any)?.status || ""}</p>
                </div>
              )}
            </div>
          </div>

          {/* Optimize card */}
          <Link
            href="/knowledge"
            className="block rounded-3xl border border-white/5 bg-gradient-to-br from-surface-container-low to-card p-6 transition-all hover:border-primary/20"
          >
            <span className="material-symbols-outlined mb-2 text-3xl text-primary">
              auto_awesome
            </span>
            <h4
              className="mb-2 text-lg font-bold text-on-surface"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Optimisez vos agents
            </h4>
            <p className="mb-4 text-xs leading-relaxed text-on-surface-variant">
              Ajoutez des documents PDF ou des URLs pour enrichir la base de
              connaissances de vos agents.
            </p>
            <div className="w-full rounded-xl border border-white/5 bg-white/5 py-3 text-center text-xs font-bold text-on-surface transition-all hover:bg-white/10">
              Configurer le savoir
            </div>
          </Link>
        </div>
      </div>
      {/* Extra widgets (togglable) */}
      {widgets.some((w) => w.enabled && ["active_campaigns", "sentiment", "recent_activity"].includes(w.type)) && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Active campaigns widget */}
          {widgets.find((w) => w.type === "active_campaigns")?.enabled && (
            <div className="rounded-2xl border border-white/5 bg-card p-6">
              <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                Campagnes en cours
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface">Relance Prospects</span>
                  <span className="text-xs font-bold text-tertiary">58%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[58%] rounded-full bg-tertiary" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-on-surface">Rappel RDV</span>
                  <span className="text-xs font-bold text-primary">51%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full w-[51%] rounded-full bg-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Sentiment widget */}
          {widgets.find((w) => w.type === "sentiment")?.enabled && (
            <div className="rounded-2xl border border-white/5 bg-card p-6">
              <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                Sentiment du jour
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Positif", value: sentimentToday.positive, color: "bg-tertiary" },
                  { label: "Neutre", value: sentimentToday.neutral, color: "bg-on-surface-variant" },
                  { label: "Négatif", value: sentimentToday.negative, color: "bg-error" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="w-14 text-xs text-on-surface-variant">{s.label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs font-bold text-on-surface">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent activity widget */}
          {widgets.find((w) => w.type === "recent_activity")?.enabled && (
            <div className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                  Activité récente
                </h3>
                <Link href="/activity" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
                  Tout voir
                </Link>
              </div>
              <div className="space-y-3">
                {recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-sm text-on-surface-variant">
                      {entry.type === "call" ? "call" : entry.type === "creation" ? "add_circle" : entry.type === "modification" ? "edit" : "campaign"}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs text-on-surface">{entry.description}</p>
                      <p className="text-[10px] text-on-surface-variant">{entry.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
