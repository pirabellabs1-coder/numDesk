"use client";

import { useAdminAnomalies } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export default function AdminAnomaliesPage() {
  const { data: anomalies, isLoading } = useAdminAnomalies();
  if (isLoading) return <PageSkeleton />;
  const list = anomalies ?? [];
  const unresolved = list.filter((a: any) => !a.resolved).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Anomalies plateforme</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{unresolved} non résolue(s) · {list.length} totales</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ label: "Critiques", sev: "high", color: "text-error" }, { label: "Moyennes", sev: "medium", color: "text-orange-400" }, { label: "Faibles", sev: "low", color: "text-primary" }].map((s) => (
          <div key={s.sev} className="rounded-2xl border border-white/5 bg-card p-4 sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{s.label}</p>
            <p className={`mt-1 text-2xl sm:text-3xl font-bold ${s.color}`} style={{ fontFamily: "Inter, sans-serif" }}>{list.filter((a: any) => a.severity === s.sev).length}</p>
          </div>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead><tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            <th className="px-6 py-3">Anomalie</th><th className="px-6 py-3">Sévérité</th><th className="px-6 py-3">Détecté</th><th className="px-6 py-3">Statut</th>
          </tr></thead>
          <tbody>{list.map((a: any) => (
            <tr key={a.id} className="border-b border-white/5 last:border-0">
              <td className="px-6 py-3 text-sm font-bold text-on-surface">{a.title}</td>
              <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.severity === "high" ? "bg-error/10 text-error" : a.severity === "medium" ? "bg-orange-400/10 text-orange-400" : "bg-primary/10 text-primary"}`}>{a.severity === "high" ? "Critique" : a.severity === "medium" ? "Moyen" : "Faible"}</span></td>
              <td className="px-6 py-3 text-sm text-on-surface-variant">{new Date(a.detectedAt).toLocaleString("fr-FR")}</td>
              <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${a.resolved ? "bg-tertiary/10 text-tertiary" : "bg-error/10 text-error"}`}>{a.resolved ? "Résolu" : "Actif"}</span></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
