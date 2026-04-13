"use client";

import { useAnomalies, useResolveAnomaly } from "@/hooks/use-anomalies";
import { useWorkspace } from "@/providers/workspace-provider";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { ErrorState } from "@/components/ui/error-state";

const severityConfig: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "Critique", color: "text-error", bg: "bg-error/10" },
  medium: { label: "Moyen", color: "text-orange-400", bg: "bg-orange-400/10" },
  low: { label: "Faible", color: "text-primary", bg: "bg-primary/10" },
};
const typeIcons: Record<string, string> = { spike: "trending_up", drop: "trending_down", latency: "speed" };

export default function AnomaliesPage() {
  const { workspaceId } = useWorkspace();
  const { data: anomalies, isLoading, error, refetch } = useAnomalies(workspaceId);
  const resolveAnomaly = useResolveAnomaly();
  const { toast } = useToast();

  const handleResolve = async (id: string) => {
    try {
      await resolveAnomaly.mutateAsync(id);
      toast("Anomalie marquée comme résolue");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorState message="Impossible de charger les anomalies" onRetry={() => refetch()} />;

  const anomalyList = anomalies ?? [];
  const unresolvedCount = anomalyList.filter((a: any) => !a.resolved).length;

  return (
    <section className="mx-auto max-w-5xl space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Détection d&apos;anomalies</h1>
          <p className="mt-2 text-on-surface-variant">{unresolvedCount} anomalie(s) non résolue(s)</p>
        </div>
        {unresolvedCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 px-4 py-2">
            <span className="material-symbols-outlined text-sm text-error">warning</span>
            <span className="text-xs font-bold text-error">{unresolvedCount} alerte(s) active(s)</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {anomalyList.map((anomaly: any) => {
          const sev = severityConfig[anomaly.severity as string] ?? severityConfig["low"]!;
          return (
            <div key={anomaly.id} className={`rounded-2xl border p-4 sm:p-5 transition-all ${anomaly.resolved ? "border-white/5 bg-card opacity-60" : "border-error/10 bg-card"}`}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                <div className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${sev.bg}`}>
                  <span className={`material-symbols-outlined text-lg sm:text-xl ${sev.color}`}>{typeIcons[anomaly.type] || "warning"}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                    <p className="text-sm font-bold text-on-surface">{anomaly.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${sev.bg} ${sev.color}`}>{sev.label}</span>
                    {anomaly.resolved && <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[10px] font-bold text-tertiary">Résolu</span>}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-on-surface-variant">{anomaly.description}</p>
                  <p className="mt-2 text-[11px] text-on-surface-variant">{new Date(anomaly.detectedAt).toLocaleString("fr-FR")}</p>
                </div>
                {!anomaly.resolved && (
                  <button onClick={() => handleResolve(anomaly.id)} disabled={resolveAnomaly.isPending} className="w-fit shrink-0 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] sm:px-3 sm:text-xs font-bold text-on-surface-variant hover:text-on-surface disabled:opacity-50">
                    {resolveAnomaly.isPending ? "..." : "Marquer résolu"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
