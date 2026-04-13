"use client";

import { useAdminHealth, useAdminStats } from "@/hooks/use-admin";

type ProviderStatus = "operational" | "degraded" | "down";

const statusConfig: Record<ProviderStatus, { label: string; color: string; bg: string }> = {
  operational: { label: "Opérationnel", color: "text-tertiary", bg: "bg-tertiary/10" },
  degraded: { label: "Dégradé", color: "text-orange-400", bg: "bg-orange-400/10" },
  down: { label: "Hors ligne", color: "text-error", bg: "bg-error/10" },
};

const iconMap: Record<string, string> = {
  "Vapi AI": "smart_toy",
  "Cartesia TTS": "record_voice_over",
  "Gemini LLM": "psychology",
  "ElevenLabs": "graphic_eq",
  "Supabase": "database",
  "Base de données": "storage",
};

export function AdminMonitoring() {
  const { data: health, isLoading } = useAdminHealth();
  const { data: stats } = useAdminStats();

  const services = health?.services ?? [];
  const allOperational = services.length > 0 && services.every((s: any) => s.status === "operational");
  const activity = health?.activity ?? {};

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Monitoring en temps réel</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Latence et disponibilité des providers tiers — rafraîchi toutes les 60s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" /></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">LIVE</span>
        </div>
      </div>

      {/* Global status */}
      <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${allOperational ? "bg-tertiary/10" : "bg-error/10"}`}>
            <span className={`material-symbols-outlined text-3xl ${allOperational ? "text-tertiary" : "text-error"}`}>{allOperational ? "check_circle" : "warning"}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              {isLoading ? "Vérification en cours…" : allOperational ? "Tous les systèmes opérationnels" : health?.overall === "down" ? "Incident critique" : "Service dégradé détecté"}
            </p>
            <p className="text-xs text-on-surface-variant">
              {services.length} providers surveillés · {stats?.totalCalls ?? 0} appels traités au total
            </p>
          </div>
        </div>
      </div>

      {/* Activity metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Appels 24h", value: activity.callsLast24h ?? 0, icon: "call" },
          { label: "Appels 7j", value: activity.callsLast7d ?? 0, icon: "date_range" },
          { label: "Agents publiés", value: activity.publishedAgents ?? 0, icon: "smart_toy" },
          { label: "Workspaces actifs", value: activity.activeWorkspaces ?? 0, icon: "workspaces" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl border border-white/5 bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">{m.icon}</span>
              <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">{m.label}</p>
            </div>
            <p className="text-2xl font-bold text-on-surface">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Provider cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-card p-5 h-36" />
            ))
          : services.map((service: any) => {
              const status = statusConfig[service.status as ProviderStatus] ?? statusConfig.down;
              const icon = iconMap[service.name] ?? "cloud";
              return (
                <div key={service.name} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high">
                        <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{service.name}</p>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.bg} ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-container-lowest p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Latence</p>
                      <p className={`mt-1 text-lg font-bold ${
                        service.latencyMs === null
                          ? "text-on-surface-variant"
                          : service.latencyMs < 200
                            ? "text-tertiary"
                            : service.latencyMs < 500
                              ? "text-orange-400"
                              : "text-error"
                      }`}>
                        {service.latencyMs !== null ? `${service.latencyMs}ms` : "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-surface-container-lowest p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Statut</p>
                      <p className={`mt-1 text-lg font-bold ${status.color}`}>
                        {service.status === "operational" ? "OK" : service.status === "degraded" ? "Lent" : "KO"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
