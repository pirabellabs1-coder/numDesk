"use client";

import { useState, useEffect } from "react";
import { useWorkspace } from "@/providers/workspace-provider";
import { apiFetch } from "@/hooks/api-client";
import { useToast } from "@/providers/toast-provider";
import { type PlanSlug } from "@vocalia/shared";
import { PurchaseCreditsModal } from "@/components/billing/purchase-credits-modal";
import { UpgradePlanModal } from "@/components/billing/upgrade-plan-modal";

interface BillingData {
  workspace: {
    id: string;
    name: string;
    planSlug: PlanSlug;
    minutesIncluded: number;
    minutesUsed: number;
    minutesRemaining: number;
    usagePercent: number;
  };
  plan: {
    slug: string;
    name: string;
    pricePerMinuteCents: number;
    maxAgents: number | null;
    restricted: boolean;
    features: Record<string, boolean>;
  };
  subscription: any;
  purchases: { id: string; minutesPurchased: number; amountCents: number; createdAt: string }[];
}

export default function BillingPage() {
  const { activeWorkspace } = useWorkspace();
  const { toast } = useToast();
  const [data, setData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPurchase, setShowPurchase] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const fetchBilling = async () => {
    if (!activeWorkspace) {
      // Try without workspace_id — API will use profile's first workspace
      try {
        const res = await apiFetch<BillingData>("/billing/plan");
        setData(res);
      } catch {
        // silently fail, workspace may still be loading
      }
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch<BillingData>(`/billing/plan?workspace_id=${activeWorkspace.id}`);
      setData(res);
    } catch {
      toast("Erreur chargement facturation", "error");
    }
    setLoading(false);
  };

  useEffect(() => { fetchBilling(); }, [activeWorkspace]);

  // Check URL params for success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast(`${params.get("minutes") || ""} minutes ajoutées avec succès`, "success");
      fetchBilling();
      window.history.replaceState({}, "", "/billing");
    }
    if (params.get("canceled") === "true") {
      toast("Achat annulé", "error");
      window.history.replaceState({}, "", "/billing");
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data?.workspace) {
    return (
      <div className="py-20 text-center text-on-surface-variant">
        Aucun workspace trouvé.
      </div>
    );
  }

  const { workspace: ws, plan, purchases } = data;
  const planSlug = ws.planSlug as PlanSlug;
  const isTrial = planSlug === "trial";
  const usageColor = ws.usagePercent >= 90 ? "bg-error" : ws.usagePercent >= 70 ? "bg-[#FF7F3F]" : "bg-tertiary";

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface" style={{ fontFamily: "Inter, sans-serif" }}>
          Facturation
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Gérez votre plan, vos minutes et vos achats.
        </p>
      </div>

      {/* Plan Card */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-on-surface">
                Plan {plan.name}
              </h2>
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isTrial
                  ? "bg-white/5 text-on-surface-variant"
                  : planSlug === "pro"
                    ? "bg-secondary/10 text-secondary"
                    : "bg-primary/10 text-primary"
              }`}>
                {isTrial ? "Essai" : planSlug === "pro" ? "Accès complet" : "Accès limité"}
              </span>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              {isTrial
                ? "5 minutes offertes — fonctionnalités restreintes"
                : `${(plan.pricePerMinuteCents / 100).toFixed(2)}€ par minute — ${plan.maxAgents ? `${plan.maxAgents} agents max` : "agents illimités"}`
              }
            </p>
          </div>
          <button
            onClick={() => setShowUpgrade(true)}
            className="rounded-xl border border-white/10 px-5 py-2 text-sm font-bold text-on-surface-variant transition-all hover:border-primary/30 hover:text-primary"
          >
            {isTrial ? "Choisir un plan" : "Changer de plan"}
          </button>
        </div>

        {/* Usage bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">
              {ws.minutesUsed} / {ws.minutesIncluded} minutes utilisées
            </span>
            <span className="font-bold text-on-surface">
              {ws.minutesRemaining} min restantes
            </span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full rounded-full ${usageColor} transition-all`}
              style={{ width: `${Math.min(100, ws.usagePercent)}%` }}
            />
          </div>
          {ws.minutesRemaining === 0 && (
            <p className="mt-2 text-sm font-bold text-error">
              Vos minutes sont épuisées. Rechargez pour continuer à utiliser Callpme.
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          {!isTrial && (
            <button
              onClick={() => setShowPurchase(true)}
              className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Recharger des minutes
            </button>
          )}
          {isTrial && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="rounded-xl bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Passer à un plan payant
            </button>
          )}
        </div>
      </div>

      {/* Restricted access warning */}
      {plan.restricted && (
        <div className="rounded-2xl border border-[#FF7F3F]/20 bg-[#FF7F3F]/5 p-5">
          <p className="text-sm font-bold text-[#FF7F3F]">
            Accès restreint — Plan {plan.name}
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            {isTrial
              ? "Passez à un plan payant pour débloquer toutes les fonctionnalités."
              : "Passez au plan Pro pour accéder aux campagnes, Voice Studio, RAG et analytics avancés."
            }
          </p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="mt-3 rounded-lg bg-[#FF7F3F]/10 px-4 py-2 text-sm font-bold text-[#FF7F3F] hover:bg-[#FF7F3F]/20"
          >
            Voir les plans
          </button>
        </div>
      )}

      {/* Purchase History */}
      <div className="rounded-2xl border border-white/5 bg-card p-6">
        <h3 className="font-display text-lg font-bold text-on-surface">Historique des achats</h3>
        {purchases.length === 0 ? (
          <p className="mt-4 text-sm text-on-surface-variant">Aucun achat de minutes pour le moment.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {purchases.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-surface-container-lowest px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-on-surface">+{p.minutesPurchased} minutes</p>
                  <p className="text-[10px] text-on-surface-variant">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className="font-display text-sm font-bold text-on-surface">
                  {(p.amountCents / 100).toFixed(2)}€
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showPurchase && (
        <PurchaseCreditsModal
          workspaceId={ws.id}
          planSlug={planSlug}
          onClose={() => setShowPurchase(false)}
          onSuccess={() => { setShowPurchase(false); fetchBilling(); toast("Minutes ajoutées avec succès", "success"); }}
        />
      )}
      {showUpgrade && (
        <UpgradePlanModal
          workspaceId={ws.id}
          currentPlan={planSlug}
          onClose={() => setShowUpgrade(false)}
          onSuccess={() => { setShowUpgrade(false); fetchBilling(); toast("Plan mis à jour", "success"); }}
        />
      )}
    </div>
  );
}
