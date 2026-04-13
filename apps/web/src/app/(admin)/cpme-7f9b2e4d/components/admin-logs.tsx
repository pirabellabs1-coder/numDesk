"use client";

import { useState } from "react";
import { useAdminLogs } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  call: { icon: "call", color: "text-tertiary", bg: "bg-tertiary/10" },
  creation: { icon: "add_circle", color: "text-primary", bg: "bg-primary/10" },
  modification: { icon: "edit", color: "text-secondary", bg: "bg-secondary/10" },
  deletion: { icon: "delete", color: "text-error", bg: "bg-error/10" },
  campaign: { icon: "campaign", color: "text-orange-400", bg: "bg-orange-400/10" },
};

export function AdminLogs() {
  const { data: logs, isLoading } = useAdminLogs();
  const [filterType, setFilterType] = useState<string | null>(null);

  if (isLoading) return <PageSkeleton />;
  const logList = logs ?? [];
  const types = [...new Set(logList.map((l: any) => l.type).filter(Boolean))];

  const filtered = filterType ? logList.filter((l: any) => l.type === filterType) : logList;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Journal des événements</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{logList.length} événement(s) · Rafraîchi toutes les 10s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tertiary" /></span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary">LIVE</span>
        </div>
      </div>

      {/* Filters */}
      {types.length > 0 && (
        <div className="flex gap-2">
          <button onClick={() => setFilterType(null)} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${!filterType ? "bg-primary/10 text-primary" : "text-on-surface-variant"}`}>Tout</button>
          {types.map((type: string) => {
            const cfg = typeConfig[type] ?? typeConfig["creation"]!;
            return <button key={type} onClick={() => setFilterType(filterType === type ? null : type)} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${filterType === type ? `${cfg.bg} ${cfg.color}` : "text-on-surface-variant"}`}><span className="material-symbols-outlined text-xs">{cfg.icon}</span>{type}</button>;
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState icon="terminal" title="Aucun événement" description="Les logs apparaîtront ici au fur et à mesure de l'activité." />
      ) : (
        <div className="space-y-1 overflow-x-auto">
          {filtered.map((log: any) => {
            const cfg = typeConfig[log.type] ?? typeConfig["creation"]!;
            return (
              <div key={log.id} className="flex items-center gap-3 rounded-lg px-3 sm:px-4 py-2.5 transition-all hover:bg-white/[0.02] min-w-[500px]">
                <span className={`material-symbols-outlined text-sm ${cfg.color}`}>{cfg.icon}</span>
                <span className="font-mono text-[10px] text-on-surface-variant/50">{new Date(log.createdAt).toLocaleTimeString("fr-FR")}</span>
                <span className="flex-1 text-sm text-on-surface">{log.description}</span>
                {log.detail && <span className="text-xs text-on-surface-variant">{log.detail}</span>}
                <span className="text-[10px] text-on-surface-variant">{log.userName || "Système"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
