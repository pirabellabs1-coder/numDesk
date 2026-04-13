"use client";

import { useAdminRevenue } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export function AdminRevenue() {
  const { data: revenue, isLoading } = useAdminRevenue();

  if (isLoading) return <PageSkeleton />;
  const rev = revenue ?? { mrr: 0, totalRevenue: 0, activeSubscriptions: 0, cycles: [] };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Revenus & Facturation</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Vue globale des revenus de la plateforme</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">MRR</p>
          <p className="mt-2 text-4xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{rev.mrr.toLocaleString("fr-FR")} €</p>
          <p className="mt-1 text-xs text-on-surface-variant">Revenu mensuel récurrent</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Revenu total</p>
          <p className="mt-2 text-4xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{rev.totalRevenue.toLocaleString("fr-FR")} €</p>
          <p className="mt-1 text-xs text-on-surface-variant">Depuis le lancement</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Abonnements actifs</p>
          <p className="mt-2 text-4xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{rev.activeSubscriptions}</p>
          <p className="mt-1 text-xs text-on-surface-variant">Workspaces avec plan actif</p>
        </div>
      </div>

      {/* Billing cycles */}
      {rev.cycles.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-card p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Derniers cycles de facturation</h3>
          <div className="overflow-hidden rounded-lg">
            <table className="w-full">
              <thead><tr className="text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-2">Période</th><th className="px-4 py-2">Min. utilisées</th><th className="px-4 py-2">Montant</th><th className="px-4 py-2">Statut</th>
              </tr></thead>
              <tbody>{rev.cycles.map((c: any) => (
                <tr key={c.id} className="border-t border-white/5">
                  <td className="px-4 py-2 text-sm text-on-surface">{new Date(c.cycleStart).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-2 text-sm text-on-surface">{(c.minutesUsed ?? 0).toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-2 text-sm font-bold text-on-surface">{((c.amountTotalCents ?? 0) / 100).toFixed(2)} €</td>
                  <td className="px-4 py-2"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${c.status === "paid" ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>{c.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
