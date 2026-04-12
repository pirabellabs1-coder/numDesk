"use client";

import { useState } from "react";
import { X, Check, Crown, Zap, Building2, Loader2 } from "lucide-react";
import { PLANS, type PlanSlug } from "@vocalia/shared";
import { apiFetch } from "@/hooks/api-client";

interface UpgradePlanModalProps {
  workspaceId: string;
  currentPlan: PlanSlug;
  onClose: () => void;
  onSuccess: () => void;
}

const planCards = [
  {
    slug: "starter" as const,
    icon: Zap,
    price: "0.05€/min",
    desc: "Accès limité — 2 agents max",
    features: ["2 agents IA", "2 voix standard", "API REST", "Support email"],
    notIncluded: ["Campagnes", "Voice Studio", "RAG", "Analytics avancés"],
  },
  {
    slug: "pro" as const,
    icon: Crown,
    price: "0.12€/min",
    desc: "Accès complet — tout illimité",
    features: ["Agents illimités", "50+ voix premium", "Campagnes outbound", "Voice Studio", "RAG", "Analytics sentiment", "Support 24/7", "SLA 99.9%"],
    notIncluded: [],
  },
  {
    slug: "enterprise" as const,
    icon: Building2,
    price: "Sur mesure",
    desc: "Déploiement dédié",
    features: ["Tout de Pro +", "Voix custom", "On-premise", "SLA 99.99%", "Account Manager"],
    notIncluded: [],
  },
];

export function UpgradePlanModal({ workspaceId, currentPlan, onClose, onSuccess }: UpgradePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanSlug>(currentPlan === "trial" ? "pro" : currentPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    if (selectedPlan === "enterprise") {
      window.location.href = "mailto:enterprise@callpme.com";
      return;
    }

    setLoading(true);
    setError("");

    try {
      await apiFetch("/billing/upgrade", {
        method: "POST",
        body: JSON.stringify({ workspaceId, planSlug: selectedPlan }),
      });
      onSuccess();
    } catch (e: any) {
      setError(e.message || "Erreur");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl border border-white/5 bg-surface p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-on-surface">Choisir un plan</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {planCards.map((card) => {
            const isCurrent = currentPlan === card.slug;
            const isSelected = selectedPlan === card.slug;
            return (
              <button
                key={card.slug}
                onClick={() => setSelectedPlan(card.slug)}
                disabled={isCurrent}
                className={`flex flex-col rounded-xl border p-5 text-left transition-all ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : isCurrent
                      ? "border-white/10 bg-card opacity-50"
                      : "border-white/5 bg-card hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <card.icon size={16} className={isSelected ? "text-primary" : "text-on-surface-variant"} />
                  <span className="font-display text-sm font-bold text-on-surface">{PLANS[card.slug].name}</span>
                  {isCurrent && (
                    <span className="rounded-full bg-tertiary/10 px-2 py-0.5 text-[8px] font-bold text-tertiary uppercase">Actuel</span>
                  )}
                </div>
                <p className="mt-1 font-display text-xl font-bold text-on-surface">{card.price}</p>
                <p className="mt-1 text-[10px] text-on-surface-variant">{card.desc}</p>

                <ul className="mt-4 flex-1 space-y-1.5">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <Check size={12} className="text-tertiary" /> {f}
                    </li>
                  ))}
                  {card.notIncluded.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-on-surface-variant/30">
                      <X size={12} /> {f}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-on-surface-variant">
            Annuler
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading || selectedPlan === currentPlan}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {selectedPlan === "enterprise" ? "Contacter les ventes" : `Passer au plan ${PLANS[selectedPlan].name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
