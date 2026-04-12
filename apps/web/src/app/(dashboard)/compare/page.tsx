"use client";

import { useState } from "react";
import { useStats } from "@/hooks/use-stats";
import { useConversations } from "@/hooks/use-conversations";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function ComparePage() {
  const { workspaceId } = useWorkspace();
  const { data: stats, isLoading } = useStats(workspaceId);
  const { data: conversations } = useConversations(workspaceId);
  const [period, setPeriod] = useState<"week" | "month">("week");

  if (isLoading) return <PageSkeleton />;

  // Calculate real stats from conversations
  const convList = conversations ?? [];
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const filterByRange = (start: Date, end: Date) =>
    convList.filter((c: any) => {
      const d = new Date(c.createdAt);
      return d >= start && d <= end;
    });

  const currentRange = period === "week" ? filterByRange(weekAgo, now) : filterByRange(monthAgo, now);
  const previousRange = period === "week" ? filterByRange(twoWeeksAgo, weekAgo) : filterByRange(twoMonthsAgo, monthAgo);

  const calcStats = (convs: any[]) => ({
    calls: convs.length,
    minutes: Math.round(convs.reduce((a, c) => a + (c.durationSeconds || 0), 0) / 60),
    completion: convs.length > 0 ? Math.round(convs.filter((c) => c.status === "success" || c.status === "ended").length / convs.length * 100) : 0,
    sentiment: convs.length > 0 ? Math.round(convs.filter((c) => c.sentiment === "positive").length / convs.length * 100) : 0,
  });

  const current = { label: period === "week" ? "Cette semaine" : "Ce mois", ...calcStats(currentRange) };
  const previous = { label: period === "week" ? "Semaine précédente" : "Mois précédent", ...calcStats(previousRange) };

  // If no real data, use workspace stats as baseline
  const displayCurrent = current;
  const displayPrevious = previous;

  const metrics = [
    { label: "Appels traités", icon: "call", currentVal: displayCurrent.calls, prevVal: displayPrevious.calls, suffix: "" },
    { label: "Minutes consommées", icon: "timer", currentVal: displayCurrent.minutes, prevVal: displayPrevious.minutes, suffix: " min" },
    { label: "Taux de complétion", icon: "check_circle", currentVal: displayCurrent.completion, prevVal: displayPrevious.completion, suffix: "%" },
    { label: "Sentiment positif", icon: "sentiment_satisfied", currentVal: displayCurrent.sentiment, prevVal: displayPrevious.sentiment, suffix: "%" },
  ];

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Comparaison de périodes</h1>
          <p className="mt-2 text-on-surface-variant">{displayCurrent.label} vs {displayPrevious.label}</p>
        </div>
        <div className="flex rounded-lg border border-white/5">
          <button onClick={() => setPeriod("week")} className={`px-4 py-2 text-xs font-bold ${period === "week" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Semaine</button>
          <button onClick={() => setPeriod("month")} className={`px-4 py-2 text-xs font-bold ${period === "month" ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Mois</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{displayCurrent.label}</p>
          <p className="mt-2 text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{displayCurrent.calls} appels</p>
          <p className="mt-1 text-xs text-on-surface-variant">{displayCurrent.minutes} min · {displayCurrent.completion}% complétion</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{displayPrevious.label}</p>
          <p className="mt-2 text-3xl font-bold text-on-surface-variant" style={{ fontFamily: "Inter, sans-serif" }}>{displayPrevious.calls} appels</p>
          <p className="mt-1 text-xs text-on-surface-variant">{displayPrevious.minutes} min · {displayPrevious.completion}% complétion</p>
        </div>
      </div>

      {/* Metric comparisons */}
      <div className="space-y-4">
        {metrics.map((m) => {
          const diff = m.currentVal - m.prevVal;
          const pctChange = m.prevVal > 0 ? Math.round((diff / m.prevVal) * 100) : 0;
          const isPositive = diff > 0;
          const max = Math.max(m.currentVal, m.prevVal) || 1;

          return (
            <div key={m.label} className="rounded-2xl border border-white/5 bg-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">{m.icon}</span>
                  <span className="text-sm font-bold text-on-surface">{m.label}</span>
                </div>
                <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${isPositive ? "bg-tertiary/10 text-tertiary" : diff < 0 ? "bg-error/10 text-error" : "bg-white/5 text-on-surface-variant"}`}>
                  <span className="material-symbols-outlined text-xs">{isPositive ? "trending_up" : diff < 0 ? "trending_down" : "trending_flat"}</span>
                  {isPositive ? "+" : ""}{pctChange}%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">{displayCurrent.label}</p>
                  <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{m.currentVal.toLocaleString("fr-FR")}{m.suffix}</p>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${(m.currentVal / max) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{displayPrevious.label}</p>
                  <p className="text-3xl font-bold text-on-surface-variant" style={{ fontFamily: "Inter, sans-serif" }}>{m.prevVal.toLocaleString("fr-FR")}{m.suffix}</p>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-on-surface-variant/30 transition-all" style={{ width: `${(m.prevVal / max) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
