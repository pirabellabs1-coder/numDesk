"use client";

import { useAdminStats, useAdminWorkspaces, useAdminHealth } from "@/hooks/use-admin";

export function AdminKpis() {
  const { data: stats } = useAdminStats();
  const { data: workspacesData } = useAdminWorkspaces();
  const { data: health } = useAdminHealth();

  const totalCalls = stats?.totalCalls ?? 0;
  const services = health?.services ?? [];
  const overallStatus = health?.overall ?? "operational";
  const activity = health?.activity ?? {};

  const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
    operational: { label: "Opérationnel", color: "text-tertiary", dotColor: "bg-tertiary" },
    degraded: { label: "Dégradé", color: "text-orange-400", dotColor: "bg-orange-400" },
    down: { label: "Hors ligne", color: "text-error", dotColor: "bg-error" },
  };

  const overallConfig = statusConfig[overallStatus] ?? statusConfig["operational"]!;
  const overallLabel =
    overallStatus === "operational"
      ? "Tous les systèmes opérationnels"
      : overallStatus === "degraded"
        ? "Certains services dégradés"
        : "Services critiques hors ligne";

  const kpiData = [
    { label: "Membres inscrits", value: stats?.members ?? 0, unit: "", icon: "group", color: "text-primary", bg: "bg-primary/10" },
    { label: "Workspaces actifs", value: stats?.workspaces ?? 0, unit: "", icon: "workspaces", color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Minutes consommées", value: stats?.minutesConsumed ?? 0, unit: " min", icon: "schedule", color: "text-tertiary", bg: "bg-tertiary/10" },
    { label: "Revenus total", value: stats?.totalRevenue ?? stats?.mrr ?? 0, unit: " €", icon: "payments", color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Platform health */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-tertiary/5 blur-3xl" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Santé de la plateforme</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${overallConfig.dotColor} opacity-75`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${overallConfig.dotColor}`} />
              </span>
              <span className={`text-xs sm:text-sm font-bold ${overallConfig.color}`}>{overallLabel}</span>
            </div>
            {(activity.callsLast24h > 0 || activity.callsLast7d > 0) && (
              <div className="mt-2 flex flex-wrap gap-3 sm:gap-4 text-[10px] text-on-surface-variant">
                <span>{activity.callsLast24h} appel(s) / 24h</span>
                <span>{activity.callsLast7d} appel(s) / 7j</span>
                <span>{activity.publishedAgents} agent(s) publiés</span>
              </div>
            )}
          </div>
          <div className="hidden md:flex gap-6">
            {services.length > 0 ? services.map((s: any) => {
              const sc = statusConfig[s.status] ?? statusConfig["operational"]!;
              return (
                <div key={s.name} className="text-center">
                  <div className={`text-xs font-bold ${sc.color}`}>{sc.label}</div>
                  <p className="text-[10px] text-on-surface-variant">{s.name}</p>
                  {s.latencyMs != null && <p className="text-[9px] text-on-surface-variant/50">{s.latencyMs}ms</p>}
                </div>
              );
            }) : (
              ["Vapi AI", "Cartesia TTS", "Gemini LLM", "Supabase"].map((name) => (
                <div key={name} className="text-center">
                  <div className="text-xs font-bold text-on-surface-variant/50">...</div>
                  <p className="text-[10px] text-on-surface-variant">{name}</p>
                </div>
              ))
            )}
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 sm:p-5 text-center">
            <span className="material-symbols-outlined text-2xl sm:text-3xl text-primary">call</span>
            <div className="mt-1 text-xl sm:text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{totalCalls.toLocaleString("fr-FR")}</div>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Appels traités</p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {kpiData.map((k) => (
          <div key={k.label} className="group rounded-2xl border border-white/5 bg-card p-4 sm:p-5 transition-all hover:border-white/10">
            <div className="mb-3 sm:mb-4 flex items-start justify-between">
              <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl ${k.bg}`}>
                <span className={`material-symbols-outlined text-lg sm:text-xl ${k.color}`}>{k.icon}</span>
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{k.label}</p>
            <p className="mt-1 text-2xl sm:text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              {k.value.toLocaleString("fr-FR")}{k.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Daily calls chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
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
          {totalCalls > 0 ? (
            <div className="flex h-44 items-end justify-center">
              <p className="text-sm text-on-surface-variant">Graphique disponible prochainement</p>
            </div>
          ) : (
            <div className="flex h-44 items-center justify-center rounded-xl bg-white/[0.02]">
              <div className="text-center">
                <span className="material-symbols-outlined text-3xl text-on-surface-variant/50">bar_chart</span>
                <p className="mt-2 text-sm text-on-surface-variant">Les données seront disponibles après les premiers appels</p>
              </div>
            </div>
          )}
        </div>

        {/* Revenue trend */}
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <h3 className="mb-2 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Revenus</h3>
          <p className="mb-4 text-xs text-on-surface-variant">Revenus de la plateforme</p>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">MRR (30 jours)</p>
              <p className="text-2xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{(stats?.mrr ?? 0).toLocaleString("fr-FR")} €</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Total cumulé</p>
              <p className="text-2xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{(stats?.totalRevenue ?? 0).toLocaleString("fr-FR")} €</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-on-surface-variant">
            <span>{stats?.workspaces ?? 0} workspace(s)</span>
            <span>{stats?.publishedAgents ?? 0} agent(s) publiés</span>
          </div>
        </div>
      </div>

      {/* Top workspaces + Distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Top 5 workspaces */}
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
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
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <h3 className="mb-1 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Distribution des statuts</h3>
          <p className="mb-4 text-[10px] text-on-surface-variant">Basé sur les conversations enregistrées</p>
          <div className="flex items-center gap-8">
            <div className="relative mx-auto h-32 w-32 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#1F1F24" strokeWidth="10" />
                {totalCalls > 0 && <circle cx="50" cy="50" r="38" fill="none" stroke="#00D4AA" strokeWidth="10" strokeDasharray="238" strokeLinecap="round" />}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-bold text-on-surface">{totalCalls.toLocaleString("fr-FR")}</p>
              </div>
            </div>
            <div className="flex-1 space-y-2.5">
              {totalCalls > 0 ? (
                [
                  { label: "Succès", color: "bg-tertiary", text: "text-tertiary" },
                  { label: "Manqué", color: "bg-on-surface-variant", text: "text-on-surface-variant" },
                  { label: "Interrompu", color: "bg-error", text: "text-error" },
                  { label: "Messagerie", color: "bg-secondary", text: "text-secondary" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                    <span className="flex-1 text-xs text-on-surface-variant">{s.label}</span>
                    <span className={`text-xs font-bold ${s.text}`}>--</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-on-surface-variant">Aucune conversation enregistrée pour le moment</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
