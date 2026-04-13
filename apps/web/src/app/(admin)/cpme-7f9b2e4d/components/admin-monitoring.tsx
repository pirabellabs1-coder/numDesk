"use client";

import { useState, useEffect } from "react";
import { useAdminStats } from "@/hooks/use-admin";

type ProviderStatus = "operational" | "degraded" | "incident";

interface Provider {
  name: string;
  status: ProviderStatus;
  latency: number;
  uptime: number;
  icon: string;
}

const statusConfig: Record<ProviderStatus, { label: string; color: string; bg: string }> = {
  operational: { label: "Opérationnel", color: "text-tertiary", bg: "bg-tertiary/10" },
  degraded: { label: "Dégradé", color: "text-orange-400", bg: "bg-orange-400/10" },
  incident: { label: "Incident", color: "text-error", bg: "bg-error/10" },
};

export function AdminMonitoring() {
  const { data: stats } = useAdminStats();
  const [providers, setProviders] = useState<Provider[]>([
    { name: "Vapi AI", status: "operational", latency: 145, uptime: 99.9, icon: "smart_toy" },
    { name: "Telnyx SIP", status: "operational", latency: 32, uptime: 100, icon: "cell_tower" },
    { name: "Cartesia TTS", status: "operational", latency: 180, uptime: 99.7, icon: "record_voice_over" },
    { name: "Gemini LLM", status: "operational", latency: 210, uptime: 99.8, icon: "psychology" },
    { name: "Supabase DB", status: "operational", latency: 12, uptime: 100, icon: "database" },
    { name: "Supabase Auth", status: "operational", latency: 45, uptime: 100, icon: "lock" },
  ]);

  // Simulate latency variations
  useEffect(() => {
    const interval = setInterval(() => {
      setProviders((prev) => prev.map((p) => ({
        ...p,
        latency: Math.max(5, p.latency + Math.round((Math.random() - 0.5) * 20)),
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allOperational = providers.every((p) => p.status === "operational");

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Monitoring en temps réel</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Latence et disponibilité des providers tiers</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" /></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">LIVE</span>
        </div>
      </div>

      {/* Global status */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="flex items-center gap-4">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${allOperational ? "bg-tertiary/10" : "bg-error/10"}`}>
            <span className={`material-symbols-outlined text-3xl ${allOperational ? "text-tertiary" : "text-error"}`}>{allOperational ? "check_circle" : "warning"}</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{allOperational ? "Tous les systèmes opérationnels" : "Incident détecté"}</p>
            <p className="text-xs text-on-surface-variant">{providers.length} providers surveillés · {stats?.totalCalls ?? 0} appels traités au total</p>
          </div>
        </div>
      </div>

      {/* Provider cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {providers.map((provider) => {
          const status = statusConfig[provider.status];
          return (
            <div key={provider.name} className="rounded-2xl border border-white/5 bg-card p-5">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high">
                    <span className="material-symbols-outlined text-on-surface-variant">{provider.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">{provider.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${status.bg} ${status.color}`}>{status.label}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-surface-container-lowest p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Latence</p>
                  <p className={`mt-1 text-lg font-bold ${provider.latency < 200 ? "text-tertiary" : provider.latency < 500 ? "text-orange-400" : "text-error"}`}>{provider.latency}ms</p>
                </div>
                <div className="rounded-lg bg-surface-container-lowest p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Uptime</p>
                  <p className="mt-1 text-lg font-bold text-on-surface">{provider.uptime}%</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
