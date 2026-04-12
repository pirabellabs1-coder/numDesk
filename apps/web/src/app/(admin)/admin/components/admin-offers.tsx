"use client";

import { useState } from "react";
import { useAdminOffers, useCreateOffer, useUpdateOffer } from "@/hooks/use-admin";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function AdminOffers() {
  const { data: offers, isLoading } = useAdminOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [newOffer, setNewOffer] = useState({ name: "", minutesIncluded: 2000, priceMonthly: 14900, overageRateCents: 5 });

  if (isLoading) return <PageSkeleton />;
  const offerList = offers ?? [];

  const handleCreate = async () => {
    if (!newOffer.name.trim()) return;
    try {
      await createOffer.mutateAsync(newOffer);
      toast("Offre créée");
      setShowCreate(false);
      setNewOffer({ name: "", minutesIncluded: 2000, priceMonthly: 14900, overageRateCents: 5 });
    } catch (e: any) { toast(e.message || "Erreur", "error"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Offres & Plans</h1>
          <p className="mt-1 text-sm text-on-surface-variant">{offerList.length} offre(s) configurée(s)</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white">
          <span className="material-symbols-outlined text-sm">add</span>Nouvelle offre
        </button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-primary/20 bg-card p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Créer une offre</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom</label><input value={newOffer.name} onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })} placeholder="Pro, Agency..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Minutes incluses</label><input type="number" value={newOffer.minutesIncluded} onChange={(e) => setNewOffer({ ...newOffer, minutesIncluded: +e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Prix mensuel (centimes)</label><input type="number" value={newOffer.priceMonthly} onChange={(e) => setNewOffer({ ...newOffer, priceMonthly: +e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
            <div><label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tarif dépassement (ct/min)</label><input type="number" value={newOffer.overageRateCents} onChange={(e) => setNewOffer({ ...newOffer, overageRateCents: +e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" /></div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowCreate(false)} className="text-sm text-on-surface-variant">Annuler</button>
            <button onClick={handleCreate} disabled={createOffer.isPending || !newOffer.name.trim()} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{createOffer.isPending ? "..." : "Créer"}</button>
          </div>
        </div>
      )}

      {offerList.length === 0 ? (
        <EmptyState icon="sell" title="Aucune offre" description="Créez vos plans tarifaires." actionLabel="Nouvelle offre" onAction={() => setShowCreate(true)} />
      ) : (
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {offerList.map((offer: any) => (
            <div key={offer.id} className={`rounded-2xl border p-6 ${offer.isActive ? "border-primary/20 bg-card" : "border-white/5 bg-card opacity-60"}`}>
              <h3 className="text-lg font-bold text-on-surface">{offer.name}</h3>
              <p className="mt-2 text-3xl font-bold text-primary" style={{ fontFamily: "Inter, sans-serif" }}>{(offer.priceMonthly / 100).toFixed(0)} €<span className="text-sm font-normal text-on-surface-variant">/mois</span></p>
              <div className="mt-4 space-y-2 text-xs text-on-surface-variant">
                <div className="flex justify-between"><span>Minutes incluses</span><span className="font-bold text-on-surface">{offer.minutesIncluded?.toLocaleString("fr-FR")}</span></div>
                <div className="flex justify-between"><span>Dépassement</span><span className="font-bold text-on-surface">{offer.overageRateCents} ct/min</span></div>
              </div>
              <span className={`mt-3 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${offer.isActive ? "bg-tertiary/10 text-tertiary" : "bg-white/5 text-on-surface-variant"}`}>{offer.isActive ? "Actif" : "Inactif"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
