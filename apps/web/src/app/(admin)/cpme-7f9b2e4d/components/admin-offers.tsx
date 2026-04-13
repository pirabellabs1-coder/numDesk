"use client";

import { useState } from "react";
import { useAdminOffers, useCreateOffer, useUpdateOffer } from "@/hooks/use-admin";
import { useToast } from "@/providers/toast-provider";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { PLANS } from "@vocalia/shared";

const SLUG_STYLE: Record<string, { gradient: string; border: string; badge: string }> = {
  trial: { gradient: "from-white/5 to-white/[0.02]", border: "border-white/10", badge: "bg-white/10 text-on-surface-variant" },
  starter: { gradient: "from-primary/10 to-primary/5", border: "border-primary/20", badge: "bg-primary/10 text-primary" },
  pro: { gradient: "from-secondary/10 to-tertiary/5", border: "border-secondary/20", badge: "bg-secondary/10 text-secondary" },
  enterprise: { gradient: "from-tertiary/10 to-tertiary/5", border: "border-tertiary/20", badge: "bg-tertiary/10 text-tertiary" },
};

const FEATURES_MAP: Record<string, { label: string; plans: string[] }> = {
  agents1: { label: "1 agent IA", plans: ["trial"] },
  agents2: { label: "Jusqu'a 2 agents", plans: ["starter"] },
  agentsUnlimited: { label: "Agents illimites", plans: ["pro", "enterprise"] },
  campaigns: { label: "Campagnes outbound", plans: ["pro", "enterprise"] },
  voiceStudio: { label: "Voice Studio", plans: ["pro", "enterprise"] },
  knowledgeRag: { label: "Base connaissances RAG", plans: ["pro", "enterprise"] },
  advancedAnalytics: { label: "Analytics avances", plans: ["pro", "enterprise"] },
  apiAccess: { label: "API REST", plans: ["starter", "pro", "enterprise"] },
  webhooks: { label: "Webhooks", plans: ["starter", "pro", "enterprise"] },
  support: { label: "Support prioritaire", plans: ["pro", "enterprise"] },
  sla: { label: "SLA 99.9%+", plans: ["pro", "enterprise"] },
  dedicated: { label: "Support dedie", plans: ["enterprise"] },
};

export function AdminOffers() {
  const { data: offers, isLoading } = useAdminOffers();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const { toast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState({
    name: "",
    slug: "",
    description: "",
    minutesIncluded: 0,
    priceMonthly: 0,
    pricePerMinuteCents: 5,
    overageRateCents: 5,
    maxAgents: null as number | null,
  });

  if (isLoading) return <PageSkeleton />;
  const offerList = offers ?? [];

  // Sort by plan order: trial, starter, pro, enterprise, then others
  const planOrder = ["trial", "starter", "pro", "enterprise"];
  const sorted = [...offerList].sort((a: any, b: any) => {
    const ia = planOrder.indexOf(a.slug ?? "");
    const ib = planOrder.indexOf(b.slug ?? "");
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });

  const handleCreate = async () => {
    if (!newOffer.name.trim()) return;
    try {
      await createOffer.mutateAsync(newOffer);
      toast("Offre creee");
      setShowCreate(false);
      setNewOffer({ name: "", slug: "", description: "", minutesIncluded: 0, priceMonthly: 0, pricePerMinuteCents: 5, overageRateCents: 5, maxAgents: null });
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleToggleActive = async (offer: any) => {
    try {
      await updateOffer.mutateAsync({ id: offer.id, isActive: !offer.isActive });
      toast(offer.isActive ? "Offre desactivee" : "Offre activee");
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const handleUpdateField = async (id: string, field: string, value: any) => {
    try {
      await updateOffer.mutateAsync({ id, [field]: value });
      toast("Offre mise a jour");
      setEditId(null);
    } catch (e: any) {
      toast(e.message || "Erreur", "error");
    }
  };

  const getPlanConfig = (slug: string | null) => {
    return slug && slug in PLANS ? PLANS[slug as keyof typeof PLANS] : null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
            Offres & Plans
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {offerList.length} offre(s) configuree(s) — Plans de la plateforme Callpme
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-4 py-2 text-sm font-bold text-white"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nouvelle offre
        </button>
      </div>

      {showCreate && (
        <div className="rounded-2xl border border-primary/20 bg-card p-6">
          <h3 className="mb-4 text-sm font-bold text-on-surface">Creer une offre</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Nom</label>
              <input value={newOffer.name} onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })} placeholder="Pro, Agency..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Slug</label>
              <input value={newOffer.slug} onChange={(e) => setNewOffer({ ...newOffer, slug: e.target.value })} placeholder="pro, starter..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</label>
              <input value={newOffer.description} onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} placeholder="Description du plan..." className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Minutes incluses</label>
              <input type="number" value={newOffer.minutesIncluded} onChange={(e) => setNewOffer({ ...newOffer, minutesIncluded: +e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Prix par minute (centimes)</label>
              <input type="number" value={newOffer.pricePerMinuteCents} onChange={(e) => setNewOffer({ ...newOffer, pricePerMinuteCents: +e.target.value })} className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Max agents (vide = illimite)</label>
              <input type="number" value={newOffer.maxAgents ?? ""} onChange={(e) => setNewOffer({ ...newOffer, maxAgents: e.target.value ? +e.target.value : null })} placeholder="Illimite" className="w-full rounded-lg bg-surface-container-lowest px-4 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowCreate(false)} className="text-sm text-on-surface-variant">
              Annuler
            </button>
            <button onClick={handleCreate} disabled={createOffer.isPending || !newOffer.name.trim()} className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
              {createOffer.isPending ? "..." : "Creer"}
            </button>
          </div>
        </div>
      )}

      {offerList.length === 0 ? (
        <EmptyState icon="sell" title="Aucune offre" description="Creez vos plans tarifaires." actionLabel="Nouvelle offre" onAction={() => setShowCreate(true)} />
      ) : (
        <>
          {/* Plans grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {sorted.map((offer: any) => {
              const style = SLUG_STYLE[offer.slug] ?? SLUG_STYLE["trial"]!;
              const planConfig = getPlanConfig(offer.slug);
              const isEditing = editId === offer.id;

              return (
                <div key={offer.id} className={`relative rounded-2xl border bg-gradient-to-b p-6 ${style.gradient} ${style.border} ${!offer.isActive ? "opacity-50" : ""}`}>
                  {/* Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${style.badge}`}>
                      {offer.slug?.toUpperCase() ?? "CUSTOM"}
                    </span>
                    <button
                      onClick={() => handleToggleActive(offer)}
                      className="text-[10px] text-on-surface-variant hover:text-on-surface"
                    >
                      {offer.isActive ? "Desactiver" : "Activer"}
                    </button>
                  </div>

                  {/* Name + Price */}
                  <h3 className="text-xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                    {offer.name}
                  </h3>
                  {offer.description && (
                    <p className="mt-1 text-xs text-on-surface-variant">{offer.description}</p>
                  )}

                  <div className="mt-4">
                    {offer.slug === "trial" ? (
                      <div>
                        <span className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Gratuit</span>
                        <p className="mt-1 text-xs text-on-surface-variant">{offer.minutesIncluded} minutes offertes</p>
                      </div>
                    ) : offer.slug === "enterprise" ? (
                      <div>
                        <span className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>Sur mesure</span>
                        <p className="mt-1 text-xs text-on-surface-variant">Contactez-nous</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-3xl font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
                          {((offer.pricePerMinuteCents ?? 0) / 100).toFixed(2)} EUR
                        </span>
                        <span className="text-sm text-on-surface-variant"> / minute</span>
                        {offer.minutesIncluded > 0 && (
                          <p className="mt-1 text-xs text-on-surface-variant">{offer.minutesIncluded} min incluses</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-4 space-y-2 border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-on-surface-variant">Max agents</span>
                      <span className="font-bold text-on-surface">{offer.maxAgents ?? "Illimite"}</span>
                    </div>
                    {offer.pricePerMinuteCents > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant">Tarif minute</span>
                        <span className="font-bold text-on-surface">{offer.pricePerMinuteCents} ct</span>
                      </div>
                    )}
                    {offer.minutesIncluded > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-on-surface-variant">Minutes incluses</span>
                        <span className="font-bold text-on-surface">{offer.minutesIncluded}</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  {planConfig && (
                    <div className="mt-4 space-y-1.5 border-t border-white/5 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Fonctionnalites</p>
                      {Object.entries(FEATURES_MAP).map(([key, feat]) => {
                        const included = feat.plans.includes(offer.slug ?? "");
                        return (
                          <div key={key} className="flex items-center gap-2 text-xs">
                            <span className={`material-symbols-outlined text-sm ${included ? "text-tertiary" : "text-on-surface-variant/30"}`}>
                              {included ? "check_circle" : "cancel"}
                            </span>
                            <span className={included ? "text-on-surface" : "text-on-surface-variant/40"}>
                              {feat.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => setEditId(isEditing ? null : offer.id)}
                    className="mt-4 w-full rounded-lg border border-white/10 py-2 text-xs font-bold text-on-surface-variant hover:text-on-surface"
                  >
                    {isEditing ? "Fermer" : "Modifier"}
                  </button>

                  {/* Inline edit */}
                  {isEditing && (
                    <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Prix / minute (ct)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            defaultValue={offer.pricePerMinuteCents ?? 0}
                            id={`ppm-${offer.id}`}
                            className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            onClick={() => {
                              const el = document.getElementById(`ppm-${offer.id}`) as HTMLInputElement;
                              if (el) handleUpdateField(offer.id, "pricePerMinuteCents", +el.value);
                            }}
                            className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Minutes incluses</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            defaultValue={offer.minutesIncluded ?? 0}
                            id={`min-${offer.id}`}
                            className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            onClick={() => {
                              const el = document.getElementById(`min-${offer.id}`) as HTMLInputElement;
                              if (el) handleUpdateField(offer.id, "minutesIncluded", +el.value);
                            }}
                            className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Max agents (vide = illimite)</label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            defaultValue={offer.maxAgents ?? ""}
                            id={`agents-${offer.id}`}
                            placeholder="Illimite"
                            className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <button
                            onClick={() => {
                              const el = document.getElementById(`agents-${offer.id}`) as HTMLInputElement;
                              handleUpdateField(offer.id, "maxAgents", el?.value ? +el.value : null);
                            }}
                            className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white"
                          >
                            OK
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active status dot */}
                  <div className="absolute right-4 top-4">
                    <span className={`relative flex h-2.5 w-2.5 ${offer.isActive ? "" : "opacity-30"}`}>
                      {offer.isActive && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />}
                      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${offer.isActive ? "bg-tertiary" : "bg-on-surface-variant"}`} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparison table */}
          <div className="rounded-2xl border border-white/5 bg-card p-6">
            <h3 className="mb-4 font-bold text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
              Comparaison des plans
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5 text-left text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <th className="px-4 py-3">Fonctionnalite</th>
                    {sorted.map((o: any) => (
                      <th key={o.id} className="px-4 py-3 text-center">{o.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-sm text-on-surface">Tarif</td>
                    {sorted.map((o: any) => (
                      <td key={o.id} className="px-4 py-2.5 text-center text-sm font-bold text-on-surface">
                        {o.slug === "trial" ? "Gratuit" : o.slug === "enterprise" ? "Sur mesure" : `${((o.pricePerMinuteCents ?? 0) / 100).toFixed(2)} EUR/min`}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-sm text-on-surface">Minutes incluses</td>
                    {sorted.map((o: any) => (
                      <td key={o.id} className="px-4 py-2.5 text-center text-sm text-on-surface">
                        {o.minutesIncluded > 0 ? o.minutesIncluded : "—"}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="px-4 py-2.5 text-sm text-on-surface">Max agents</td>
                    {sorted.map((o: any) => (
                      <td key={o.id} className="px-4 py-2.5 text-center text-sm text-on-surface">
                        {o.maxAgents ?? "Illimite"}
                      </td>
                    ))}
                  </tr>
                  {Object.entries(FEATURES_MAP).filter(([key]) => !key.startsWith("agents")).map(([key, feat]) => (
                    <tr key={key} className="border-b border-white/5">
                      <td className="px-4 py-2.5 text-sm text-on-surface">{feat.label}</td>
                      {sorted.map((o: any) => {
                        const included = feat.plans.includes(o.slug ?? "");
                        return (
                          <td key={o.id} className="px-4 py-2.5 text-center">
                            <span className={`material-symbols-outlined text-base ${included ? "text-tertiary" : "text-on-surface-variant/20"}`}>
                              {included ? "check" : "close"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
