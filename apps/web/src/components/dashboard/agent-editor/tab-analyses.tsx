"use client";

import { useState, useMemo } from "react";
import { useConversations } from "@/hooks/use-conversations";
import { useWorkspace } from "@/providers/workspace-provider";

interface TabAnalysesProps {
  agentId: string;
}

export function TabAnalyses({ agentId }: TabAnalysesProps) {
  const { workspaceId } = useWorkspace();
  const { data: allConversations } = useConversations(workspaceId, { limit: 500 });
  const [period, setPeriod] = useState<"7j" | "30j" | "90j">("7j");

  const periodDays = period === "7j" ? 7 : period === "30j" ? 30 : 90;

  const stats = useMemo(() => {
    if (!allConversations) return { total: 0, avgDuration: "0:00", completionRate: 0, pickupRate: 0, dailyCounts: [] as number[] };

    // Filter conversations for this agent
    const agentConvs = allConversations.filter((c: any) => c.agentId === agentId);

    // Filter by period
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodDays);
    const filtered = agentConvs.filter((c: any) => new Date(c.createdAt || c.startedAt) >= cutoff);

    const total = filtered.length;

    // Average duration
    const durations = filtered.map((c: any) => c.durationSeconds || 0).filter((d: number) => d > 0);
    const avgSec = durations.length > 0 ? Math.round(durations.reduce((a: number, b: number) => a + b, 0) / durations.length) : 0;
    const avgMin = Math.floor(avgSec / 60);
    const avgSecRem = avgSec % 60;
    const avgDuration = `${avgMin}:${avgSecRem.toString().padStart(2, "0")}`;

    // Completion rate (ended vs total)
    const completed = filtered.filter((c: any) => c.status === "ended").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Pickup rate (not no_answer)
    const answered = filtered.filter((c: any) => c.status !== "no_answer" && c.status !== "unknown").length;
    const pickupRate = total > 0 ? Math.round((answered / total) * 100) : 0;

    // Daily counts for chart
    const dailyCounts: number[] = [];
    for (let i = periodDays - 1; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);
      const count = filtered.filter((c: any) => {
        const cDate = (c.createdAt || c.startedAt || "").slice(0, 10);
        return cDate === dayStr;
      }).length;
      dailyCounts.push(count);
    }

    return { total, avgDuration, completionRate, pickupRate, dailyCounts };
  }, [allConversations, agentId, periodDays]);

  const maxDaily = Math.max(...stats.dailyCounts, 1);

  const metrics = [
    { label: "Total Appels", value: String(stats.total), icon: "call", color: "text-primary" },
    { label: "Durée Moyenne", value: stats.avgDuration, icon: "timer", color: "text-secondary" },
    { label: "Taux de complétion", value: `${stats.completionRate}%`, icon: "check_circle", color: "text-tertiary" },
    { label: "Taux de décroché", value: `${stats.pickupRate}%`, icon: "percent", color: "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <div className={`mb-3 flex items-center gap-2 ${m.color}`}>
              <span className="material-symbols-outlined text-sm">{m.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                {m.label}
              </span>
            </div>
            <p className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Appels par jour
          </h3>
          <div className="flex gap-2">
            {(["7j", "30j", "90j"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-md px-3 py-1 text-xs font-bold transition-colors ${
                  period === p ? "bg-primary/10 text-primary" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-32 items-end gap-1">
          {stats.dailyCounts.length > 0 ? (
            stats.dailyCounts.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary/20 to-primary/60 transition-all hover:to-primary"
                style={{ height: `${Math.max((v / maxDaily) * 100, v > 0 ? 8 : 2)}%` }}
                title={`${v} appel${v !== 1 ? "s" : ""}`}
              />
            ))
          ) : (
            <p className="w-full py-8 text-center text-sm text-on-surface-variant">Aucune donnée pour cette période</p>
          )}
        </div>
      </div>
    </div>
  );
}
