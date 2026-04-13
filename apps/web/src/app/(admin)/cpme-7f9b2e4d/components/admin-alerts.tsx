"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminAlerts, useAckAlert } from "@/hooks/use-admin";
import { apiFetch } from "@/hooks/api-client";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const severityConfig: Record<string, { color: string; bg: string; icon: string }> = {
  critical: { color: "text-error", bg: "bg-error/10", icon: "error" },
  warning: { color: "text-orange-400", bg: "bg-orange-400/10", icon: "warning" },
  info: { color: "text-primary", bg: "bg-primary/10", icon: "info" },
};

export function AdminAlerts() {
  const qc = useQueryClient();
  const { data: alertsData, isLoading } = useAdminAlerts();
  const ackAlert = useAckAlert();
  const { toast } = useToast();
  const [scanning, setScanning] = useState(false);

  if (isLoading) return <PageSkeleton />;
  const alertList = alertsData ?? [];
  const unacked = alertList.filter((a: any) => !a.isAcknowledged).length;

  const handleAck = async (id: string) => {
    try { await ackAlert.mutateAsync(id); toast("Alerte acquittée"); }
    catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      const result = await apiFetch<any>("/admin/detect-anomalies", { method: "POST" });
      toast(`Scan terminé — ${result.alertsInserted} nouvelle(s) alerte(s), ${result.anomaliesInserted} anomalie(s)`);
      qc.invalidateQueries({ queryKey: ["admin-alerts"] });
    } catch (e: any) { toast(e.message || "Erreur scan", "error"); }
    setScanning(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Centre d&apos;alertes</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{unacked} alerte(s) non acquittée(s)</p>
        </div>
        <button onClick={handleScan} disabled={scanning} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
          <span className="material-symbols-outlined text-sm">{scanning ? "hourglass_empty" : "radar"}</span>
          {scanning ? "Scan en cours..." : "Scanner la plateforme"}
        </button>
      </div>

      {alertList.length === 0 ? (
        <EmptyState icon="notifications" title="Aucune alerte" description="Les alertes système apparaîtront ici automatiquement." />
      ) : (
        <div className="space-y-3">
          {alertList.map((alert: any) => {
            const sev = severityConfig[alert.severity as string] ?? severityConfig["info"]!;
            return (
              <div key={alert.id} className={`rounded-2xl border p-4 sm:p-5 ${alert.isAcknowledged ? "border-white/5 bg-card opacity-50" : "border-white/5 bg-card"}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${sev.bg}`}>
                    <span className={`material-symbols-outlined ${sev.color}`}>{sev.icon}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-on-surface">{alert.title}</p>
                    {alert.message && <p className="mt-1 text-sm text-on-surface-variant">{alert.message}</p>}
                    <p className="mt-2 text-[11px] text-on-surface-variant">{new Date(alert.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                  {!alert.isAcknowledged && (
                    <button onClick={() => handleAck(alert.id)} disabled={ackAlert.isPending} className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface disabled:opacity-50">Acquitter</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
