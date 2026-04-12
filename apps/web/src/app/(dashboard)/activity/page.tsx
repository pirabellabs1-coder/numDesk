"use client";

import { useState } from "react";
import { useActivity } from "@/hooks/use-activity";
import { useWorkspace } from "@/providers/workspace-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const typeConfig: Record<string, { icon: string; color: string; bg: string; label: string }> = {
  call: { icon: "call", color: "text-tertiary", bg: "bg-tertiary/10", label: "Appel" },
  creation: { icon: "add_circle", color: "text-primary", bg: "bg-primary/10", label: "Création" },
  modification: { icon: "edit", color: "text-secondary", bg: "bg-secondary/10", label: "Modification" },
  deletion: { icon: "delete", color: "text-error", bg: "bg-error/10", label: "Suppression" },
  campaign: { icon: "campaign", color: "text-orange-400", bg: "bg-orange-400/10", label: "Campagne" },
};

export default function ActivityPage() {
  const { workspaceId } = useWorkspace();
  const { data: activityData, isLoading } = useActivity(workspaceId);
  const [filterType, setFilterType] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;
  const activityLog = activityData ?? [];

  const types = [...new Set(activityLog.map((a: any) => a.type))];

  const filtered = filterType
    ? activityLog.filter((a: any) => a.type === filterType)
    : activityLog;

  return (
    <section className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Journal d&apos;activité
        </h1>
        <p className="mt-2 text-on-surface-variant">Historique de toutes les actions sur la plateforme</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterType(null)}
          className={`rounded-lg px-4 py-2 text-sm font-bold transition-all ${
            !filterType ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
          }`}
        >
          Tout
        </button>
        {types.map((type) => {
          const cfg = typeConfig[type]!;
          return (
            <button
              key={type}
              onClick={() => setFilterType(filterType === type ? null : type)}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                filterType === type ? `${cfg.bg} ${cfg.color}` : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${filterType === type ? cfg.color : ""}`}>{cfg.icon}</span>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <EmptyState icon="history" title="Aucune activité" description="L'historique apparaîtra ici quand vous commencerez à utiliser la plateforme." />
      ) : (
      <div className="relative space-y-0">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5" />

        {filtered.map((entry, i) => {
          const cfg = typeConfig[entry.type]!;
          return (
            <div key={entry.id} className="relative flex gap-5 py-4">
              {/* Dot */}
              <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cfg.bg}`}>
                <span className={`material-symbols-outlined text-lg ${cfg.color}`}>{cfg.icon}</span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 rounded-xl border border-white/5 bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-on-surface">{entry.description}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{entry.detail}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">person</span>
                    {entry.userName || entry.user || "Système"}
                  </div>
                  <span className="h-0.5 w-0.5 rounded-full bg-white/20" />
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString("fr-FR") : entry.timestamp}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
}
