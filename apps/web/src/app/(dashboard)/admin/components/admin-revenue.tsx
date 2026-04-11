"use client";

import { useState } from "react";

const MONTHLY_REVENUE = [
  { month: "Jan", base: 1200, overage: 180, total: 1380 },
  { month: "Fév", base: 2100, overage: 310, total: 2410 },
  { month: "Mar", base: 3400, overage: 520, total: 3920 },
  { month: "Avr", base: 5080, overage: 840, total: 5920 },
  { month: "Mai", base: 5800, overage: 920, total: 6720 },
  { month: "Jun", base: 6200, overage: 780, total: 6980 },
  { month: "Jul", base: 6600, overage: 860, total: 7460 },
  { month: "Aoû", base: 6900, overage: 740, total: 7640 },
  { month: "Sep", base: 7100, overage: 950, total: 8050 },
  { month: "Oct", base: 7340, overage: 880, total: 8220 },
  { month: "Nov", base: 7340, overage: 0, total: 7340 },
  { month: "Déc", base: 7340, overage: 0, total: 7340 },
];

const INVOICES = [
  { id: "inv-1", member: "Voix IA Enterprise", period: "Avr. 2026", amount: 999, overage: 0, status: "open", plan: "Enterprise" },
  { id: "inv-2", member: "Agence IA Pro", period: "Avr. 2026", amount: 349, overage: 0, status: "open", plan: "Agency" },
  { id: "inv-3", member: "BotVoice Pro", period: "Avr. 2026", amount: 149, overage: 0, status: "open", plan: "Pro" },
  { id: "inv-4", member: "CallBot Agency", period: "Avr. 2026", amount: 349, overage: 24, status: "open", plan: "Agency" },
  { id: "inv-5", member: "Voix IA Enterprise", period: "Mars 2026", amount: 999, overage: 120, status: "paid", plan: "Enterprise" },
  { id: "inv-6", member: "Agence IA Pro", period: "Mars 2026", amount: 349, overage: 45, status: "paid", plan: "Agency" },
  { id: "inv-7", member: "CallBot Agency", period: "Mars 2026", amount: 349, overage: 0, status: "paid", plan: "Agency" },
  { id: "inv-8", member: "BotVoice Pro", period: "Mars 2026", amount: 149, overage: 12, status: "paid", plan: "Pro" },
  { id: "inv-9", member: "CallPro Agency", period: "Mars 2026", amount: 349, overage: 0, status: "paid", plan: "Agency" },
];

const STATUS_STYLE: Record<string, string> = {
  open: "bg-primary/10 text-primary",
  paid: "bg-tertiary/10 text-tertiary",
  void: "bg-white/5 text-on-surface-variant",
};

const maxTotal = Math.max(...MONTHLY_REVENUE.map((m) => m.total));
const mrr = MONTHLY_REVENUE[9]!.total;
const prevMrr = MONTHLY_REVENUE[8]!.total;
const mrrGrowth = Math.round(((mrr - prevMrr) / prevMrr) * 100);

export function AdminRevenue() {
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const displayedInvoices = showAllInvoices ? INVOICES : INVOICES.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "MRR actuel", value: `${mrr.toLocaleString("fr-FR")} €`, trend: `+${mrrGrowth}% vs mois préc.`, color: "text-tertiary", icon: "payments" },
          { label: "ARR estimé", value: `${(mrr * 12).toLocaleString("fr-FR")} €`, trend: "Projection annuelle", color: "text-primary", icon: "trending_up" },
          { label: "ARPU moyen", value: `${Math.round(mrr / 24).toLocaleString("fr-FR")} €`, trend: "Par membre actif", color: "text-secondary", icon: "person" },
          { label: "Revenus dépassement", value: `880 €`, trend: "Ce mois (11%)", color: "text-orange-400", icon: "bolt" },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-white/5 bg-card p-5">
            <span className={`material-symbols-outlined ${k.color}`}>{k.icon}</span>
            <p className="mt-3 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{k.label}</p>
            <p className="mt-1 text-2xl font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>{k.value}</p>
            <p className={`mt-1 text-xs ${k.color}`}>{k.trend}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Revenus mensuels — 2026</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">Base + dépassements</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-primary/70" />Abonnements</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-orange-400/70" />Dépassements</span>
          </div>
        </div>
        <div className="flex h-40 items-end gap-1.5">
          {MONTHLY_REVENUE.map((m, i) => (
            <div key={i} className="group relative flex flex-1 flex-col items-center gap-0">
              <div
                className="w-full rounded-t bg-orange-400/60 hover:bg-orange-400/80 transition-all"
                style={{ height: `${(m.overage / maxTotal) * 100}%` }}
              />
              <div
                className="w-full bg-primary/60 hover:bg-primary/80 transition-all"
                style={{ height: `${(m.base / maxTotal) * 100}%` }}
              />
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden rounded bg-surface-container-highest px-1.5 py-0.5 text-[10px] text-on-surface group-hover:block whitespace-nowrap">
                {m.total.toLocaleString("fr-FR")} €
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant">
          {MONTHLY_REVENUE.map((m) => <span key={m.month}>{m.month}</span>)}
        </div>
      </div>

      {/* Invoices */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-on-surface" style={{ fontFamily: "Syne, sans-serif" }}>Factures récentes</h3>
          <button className="flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">download</span>
            Exporter CSV
          </button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-card">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-container-low/50">
                {["Membre", "Période", "Plan", "Abonnement", "Dépassement", "Total", "Statut"].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {displayedInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5 text-sm font-medium text-on-surface">{inv.member}</td>
                  <td className="px-5 py-3.5 text-sm text-on-surface-variant">{inv.period}</td>
                  <td className="px-5 py-3.5 text-xs text-on-surface-variant">{inv.plan}</td>
                  <td className="px-5 py-3.5 text-sm text-on-surface">{inv.amount} €</td>
                  <td className="px-5 py-3.5 text-sm">
                    {inv.overage > 0 ? <span className="text-orange-400">+{inv.overage} €</span> : <span className="text-on-surface-variant">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-sm font-bold text-on-surface">{(inv.amount + inv.overage)} €</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLE[inv.status]}`}>
                      {inv.status === "open" ? "Ouvert" : "Payé"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!showAllInvoices && INVOICES.length > 6 && (
          <button onClick={() => setShowAllInvoices(true)} className="mt-3 w-full rounded-xl bg-surface-container-low py-3 text-xs font-bold text-on-surface-variant hover:text-on-surface">
            Voir toutes les factures ({INVOICES.length})
          </button>
        )}
      </div>
    </div>
  );
}
