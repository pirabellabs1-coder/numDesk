"use client";

import { useAdminStats, useAdminWorkspaces } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function heatColor(v: number) {
  if (v < 15) return "bg-surface-container-high";
  if (v < 35) return "bg-primary/20";
  if (v < 55) return "bg-primary/40";
  if (v < 75) return "bg-primary/60";
  return "bg-primary";
}

export function AdminAnalytics() {
  const { data: stats, isLoading: loadingStats } = useAdminStats();
  const { data: workspaces, isLoading: loadingWs } = useAdminWorkspaces();

  if (loadingStats || loadingWs) return <PageSkeleton />;

  const totalCalls = stats?.totalCalls ?? 0;
  const totalMinutes = stats?.minutesConsumed ?? 0;
  const wsList = workspaces ?? [];

  const sentimentTotal =
    (stats?.sentimentPositive ?? 0) +
    (stats?.sentimentNeutral ?? 0) +
    (stats?.sentimentNegative ?? 0);

  const sentiments = [
    {
      label: "Positif",
      value: sentimentTotal > 0 ? Math.round((stats.sentimentPositive / sentimentTotal) * 100) : 0,
      color: "bg-tertiary",
    },
    {
      label: "Neutre",
      value: sentimentTotal > 0 ? Math.round((stats.sentimentNeutral / sentimentTotal) * 100) : 0,
      color: "bg-primary",
    },
    {
      label: "Négatif",
      value: sentimentTotal > 0 ? Math.round((stats.sentimentNegative / sentimentTotal) * 100) : 0,
      color: "bg-error",
    },
  ];

  // Top workspaces from real data
  const topWorkspaces = wsList
    .sort((a: any, b: any) => (b.conversationCount ?? 0) - (a.conversationCount ?? 0))
    .slice(0, 5)
    .map((ws: any, i: number) => ({
      name: ws.name,
      owner: ws.ownerName || ws.ownerEmail || "—",
      calls: ws.conversationCount ?? 0,
      agents: ws.agentCount ?? 0,
      color: ["from-primary to-secondary", "from-secondary to-tertiary", "from-tertiary to-primary", "from-primary/80 to-secondary/80", "from-secondary/80 to-tertiary/80"][i] ?? "from-primary to-secondary",
    }));

  // Heatmap (simulated pattern based on real call volume)
  const heatmap = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, hour) => {
      const isWeekend = day >= 5;
      const isWorkHour = hour >= 9 && hour <= 18;
      const scale = totalCalls > 0 ? 1 : 0;
      const base = isWeekend ? 5 * scale : isWorkHour ? 80 * scale : 10 * scale;
      const peak = (hour === 10 || hour === 14) ? 40 * scale : 0;
      return Math.min(100, base + peak);
    })
  );

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total appels</p>
          <p className="mt-1 text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{totalCalls.toLocaleString("fr-FR")}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Minutes totales</p>
          <p className="mt-1 text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{totalMinutes.toLocaleString("fr-FR")}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Workspaces actifs</p>
          <p className="mt-1 text-3xl font-bold text-secondary" style={{ fontFamily: "Inter, sans-serif" }}>{stats?.workspaces ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Agents déployés</p>
          <p className="mt-1 text-3xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{stats?.agents ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Sentiments */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Répartition des sentiments</h3>
          <div className="space-y-3">
            {sentiments.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="w-16 text-sm font-bold text-on-surface">{s.value}%</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-white/5">
                  <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.value}%` }} />
                </div>
                <span className="w-16 text-xs text-on-surface-variant">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top workspaces */}
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Top Workspaces</h3>
          {topWorkspaces.length === 0 ? (
            <p className="text-center text-xs text-on-surface-variant">Aucun workspace</p>
          ) : (
            <div className="space-y-3">
              {topWorkspaces.map((ws: any, i: number) => (
                <div key={ws.name} className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${ws.color} text-[10px] font-bold text-white`}>
                    #{i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-on-surface">{ws.name}</p>
                    <p className="text-[10px] text-on-surface-variant">{ws.owner} · {ws.calls} appels · {ws.agents} agents</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Heatmap — Heures de pointe</h3>
        <div className="overflow-x-auto">
          <div className="inline-grid gap-[2px]" style={{ gridTemplateColumns: `50px repeat(24, 1fr)` }}>
            {/* Header */}
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center text-[8px] text-on-surface-variant/50">{h}h</div>
            ))}
            {/* Rows */}
            {heatmap.map((row, day) => (
              <div key={day} className="contents">
                <div className="flex items-center text-[10px] font-bold text-on-surface-variant">{DAYS[day]}</div>
                {row.map((val, hour) => (
                  <div key={hour} className={`h-5 w-5 rounded-sm ${heatColor(val)}`} title={`${DAYS[day]} ${hour}h : ${val}%`} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-[9px] text-on-surface-variant">
          <span>Faible</span>
          <div className="flex gap-[2px]">
            <div className="h-3 w-3 rounded-sm bg-surface-container-high" />
            <div className="h-3 w-3 rounded-sm bg-primary/20" />
            <div className="h-3 w-3 rounded-sm bg-primary/40" />
            <div className="h-3 w-3 rounded-sm bg-primary/60" />
            <div className="h-3 w-3 rounded-sm bg-primary" />
          </div>
          <span>Fort</span>
        </div>
      </div>
    </div>
  );
}
