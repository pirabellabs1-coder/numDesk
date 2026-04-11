import { mockBillingCycles, mockWorkspace } from "@/lib/mock-data";

const statusStyles: Record<string, string> = {
  open: "bg-primary/10 text-primary",
  paid: "bg-tertiary/10 text-tertiary",
  void: "bg-white/5 text-on-surface-variant",
  finalized: "bg-secondary/10 text-secondary",
};

export default function BillingPage() {
  const quotaPct = Math.round((mockWorkspace.minutesUsed / mockWorkspace.minutesIncluded) * 100);

  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
          Facturation & Crédits
        </h1>
        <p className="mt-2 text-on-surface-variant">Gérez votre consommation et vos factures</p>
      </div>

      {/* Current cycle */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-card p-6">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Cycle en cours</p>
            <h2 className="text-2xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
              Avril 2026
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Estimation</p>
            <p className="text-2xl font-bold text-primary" style={{ fontFamily: "Syne, sans-serif" }}>149,00 €</p>
          </div>
        </div>

        <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-low">
          <div
            className={`h-full rounded-full transition-all ${quotaPct > 90 ? "bg-error" : "bg-gradient-to-r from-primary to-secondary"}`}
            style={{ width: `${quotaPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-on-surface">{mockWorkspace.minutesUsed.toLocaleString("fr-FR")} / {mockWorkspace.minutesIncluded.toLocaleString("fr-FR")} min utilisées</span>
          <span className="text-on-surface-variant">{quotaPct}% · {mockWorkspace.daysRemaining} jours restants</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-bold text-white">
            <span className="material-symbols-outlined text-sm">add</span>
            Recharger des crédits
          </button>
          <button className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface">
            Voir la facture courante
          </button>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="mb-4 text-lg font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>
          Historique des cycles
        </h2>
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                {["Période", "Min. incluses", "Min. utilisées", "Dépassement", "Montant total", "Statut", ""].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockBillingCycles.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm font-medium text-on-surface">{c.period}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{c.minutesIncluded.toLocaleString("fr-FR")}</td>
                  <td className="px-6 py-4 text-sm text-on-surface">{c.minutesUsed.toLocaleString("fr-FR")}</td>
                  <td className="px-6 py-4 text-sm">
                    {c.minutesOverage > 0 ? (
                      <span className="text-error">+{c.minutesOverage} min</span>
                    ) : (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-on-surface">{c.amountTotal.toFixed(2)} €</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[c.status]}`}>
                      {c.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.status === "paid" && (
                      <button className="text-xs text-primary hover:underline">Facture</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
