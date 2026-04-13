"use client";

import { useAdminRevenue } from "@/hooks/use-admin";
import { PageSkeleton } from "@/components/ui/page-skeleton";

export function AdminRevenue() {
  const { data: revenue, isLoading } = useAdminRevenue();

  if (isLoading) return <PageSkeleton />;
  const rev = revenue ?? { mrr: 0, totalRevenue: 0, activeSubscriptions: 0, cycles: [], recentPurchases: [] };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Revenus & Facturation</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Vue globale des revenus de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">MRR</p>
          <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-tertiary" style={{ fontFamily: "Inter, sans-serif" }}>{rev.mrr.toLocaleString("fr-FR")} €</p>
          <p className="mt-1 text-xs text-on-surface-variant">Revenu mensuel récurrent</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Revenu total</p>
          <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>{rev.totalRevenue.toLocaleString("fr-FR")} €</p>
          <p className="mt-1 text-xs text-on-surface-variant">Depuis le lancement</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Abonnements actifs</p>
          <p className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{rev.activeSubscriptions}</p>
          <p className="mt-1 text-xs text-on-surface-variant">Workspaces avec plan actif</p>
        </div>
      </div>

      {/* Recent credit purchases */}
      {rev.recentPurchases?.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Achats de crédits récents</h3>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full min-w-[500px]">
              <thead><tr className="text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <th className="px-4 py-2">Date</th><th className="px-4 py-2">Workspace</th><th className="px-4 py-2">Minutes</th><th className="px-4 py-2">Montant</th>
              </tr></thead>
              <tbody>{rev.recentPurchases.map((p: any) => (
                <tr key={p.id} className="border-t border-white/5">
                  <td className="px-4 py-2 text-sm text-on-surface-variant">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-2 text-sm text-on-surface">{p.workspaceName || "—"}</td>
                  <td className="px-4 py-2 text-sm font-bold text-on-surface">{(p.minutesPurchased ?? 0).toLocaleString("fr-FR")} min</td>
                  <td className="px-4 py-2 text-sm font-bold text-tertiary">{((p.amountCents ?? 0) / 100).toFixed(2)} €</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing cycles */}
      {rev.cycles.length > 0 && (
        <div className="rounded-2xl border border-white/5 bg-card p-4 sm:p-6">
          <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Derniers cycles de facturation</h3>
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full min-w-[500px]">
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

      {rev.cycles.length === 0 && (!rev.recentPurchases || rev.recentPurchases.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-card p-12">
          <span className="material-symbols-outlined mb-3 text-4xl text-on-surface-variant/50">payments</span>
          <p className="text-sm font-medium text-on-surface">Aucune transaction</p>
          <p className="mt-1 text-xs text-on-surface-variant">Les transactions apparaîtront ici lorsque vos clients achèteront des crédits</p>
        </div>
      )}
    </div>
  );
}
