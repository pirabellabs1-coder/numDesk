"use client";

import { useState } from "react";
import { X, ShoppingCart, Loader2, Tag, Check, Percent } from "lucide-react";
import { CREDIT_PACKAGES, type PlanSlug, PLANS } from "@vocalia/shared";
import { apiFetch } from "@/hooks/api-client";

interface PurchaseCreditsModalProps {
  workspaceId: string;
  planSlug: PlanSlug;
  onClose: () => void;
  onSuccess: () => void;
}

export function PurchaseCreditsModal({ workspaceId, planSlug, onClose, onSuccess }: PurchaseCreditsModalProps) {
  const [selectedMinutes, setSelectedMinutes] = useState(500);
  const [customMinutes, setCustomMinutes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoValid, setPromoValid] = useState<{ discountPercent: number; code: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const plan = PLANS[planSlug] || PLANS.starter;
  const minutes = customMinutes ? parseInt(customMinutes) || 0 : selectedMinutes;

  // Volume discount
  const pkg = CREDIT_PACKAGES.find((p) => p.minutes === minutes);
  const volumeDiscount = pkg ? pkg.discount : 0;

  // Total discount (volume + promo)
  const promoDiscount = promoValid ? promoValid.discountPercent : 0;
  const totalDiscount = Math.min(50, volumeDiscount + promoDiscount);

  // Price calculation
  const basePrice = minutes * plan.pricePerMinuteCents;
  const finalPrice = Math.round(basePrice * (1 - totalDiscount / 100));
  const savings = basePrice - finalPrice;

  const validatePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoValid(null);
    try {
      const res = await apiFetch<{ code: string; discountPercent: number; minMinutes: number }>("/billing/validate-promo", {
        method: "POST",
        body: JSON.stringify({ code: promoCode }),
      });
      if (minutes < (res.minMinutes || 0)) {
        setPromoError(`Minimum ${res.minMinutes} minutes pour ce code`);
      } else {
        setPromoValid({ code: res.code, discountPercent: res.discountPercent });
      }
    } catch {
      setPromoError("Code promo invalide ou expiré");
    }
    setPromoLoading(false);
  };

  const handlePurchase = async () => {
    if (minutes < 10) { setError("Minimum 10 minutes"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch<{ checkoutUrl: string | null; activated?: boolean }>("/billing/purchase-credits", {
        method: "POST",
        body: JSON.stringify({ workspaceId, minutes, promoCode: promoValid?.code || undefined }),
      });
      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else if (res.activated) {
        onSuccess();
      }
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'achat");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-white/5 bg-surface p-6" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShoppingCart size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-on-surface">Acheter des minutes</h3>
              <p className="text-xs text-on-surface-variant">Plan {plan.name} — {(plan.pricePerMinuteCents / 100).toFixed(2)}€/min</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface"><X size={20} /></button>
        </div>

        {/* Package selection */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {CREDIT_PACKAGES.map((p) => {
            const pkgPrice = p.minutes * plan.pricePerMinuteCents;
            const pkgFinal = Math.round(pkgPrice * (1 - p.discount / 100));
            return (
              <button
                key={p.minutes}
                onClick={() => { setSelectedMinutes(p.minutes); setCustomMinutes(""); }}
                className={`relative rounded-xl border p-4 text-center transition-all ${
                  selectedMinutes === p.minutes && !customMinutes
                    ? "border-primary/40 bg-primary/10"
                    : "border-white/5 bg-card hover:border-white/10"
                }`}
              >
                {p.discount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center gap-0.5 rounded-full bg-tertiary px-2 py-0.5 text-[9px] font-bold text-white">
                    <Percent size={8} /> -{p.discount}%
                  </span>
                )}
                <p className="font-display text-lg font-bold text-on-surface">{p.label}</p>
                <div className="mt-1">
                  {p.discount > 0 ? (
                    <>
                      <span className="text-[10px] text-on-surface-variant line-through">{(pkgPrice / 100).toFixed(2)}€</span>
                      <span className="ml-1.5 text-xs font-bold text-tertiary">{(pkgFinal / 100).toFixed(2)}€</span>
                    </>
                  ) : (
                    <span className="text-xs text-on-surface-variant">{(pkgPrice / 100).toFixed(2)}€</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom amount */}
        <div className="mt-4">
          <label className="mb-1.5 block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            Montant personnalisé
          </label>
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="Ex: 2500"
            min={10}
            max={100000}
            className="input-field"
          />
        </div>

        {/* Promo code */}
        <div className="mt-4">
          <label className="mb-1.5 block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
            <Tag size={10} className="mr-1 inline" /> Code promo
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoValid(null); setPromoError(""); }}
              placeholder="BIENVENUE"
              className="input-field flex-1"
              disabled={!!promoValid}
            />
            {promoValid ? (
              <button
                onClick={() => { setPromoValid(null); setPromoCode(""); }}
                className="shrink-0 rounded-lg bg-tertiary/10 px-4 text-xs font-bold text-tertiary"
              >
                <Check size={14} className="mr-1 inline" /> -{promoValid.discountPercent}%
              </button>
            ) : (
              <button
                onClick={validatePromo}
                disabled={!promoCode.trim() || promoLoading}
                className="shrink-0 rounded-lg bg-primary/10 px-4 text-xs font-bold text-primary hover:bg-primary/20 disabled:opacity-50"
              >
                {promoLoading ? <Loader2 size={14} className="animate-spin" /> : "Appliquer"}
              </button>
            )}
          </div>
          {promoError && <p className="mt-1 text-xs text-error">{promoError}</p>}
        </div>

        {/* Summary */}
        <div className="mt-6 rounded-xl bg-surface-container-lowest p-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-on-surface-variant">
            <span>{minutes} min × {(plan.pricePerMinuteCents / 100).toFixed(2)}€</span>
            <span>{(basePrice / 100).toFixed(2)}€</span>
          </div>
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-tertiary">
                {volumeDiscount > 0 && `Volume -${volumeDiscount}%`}
                {volumeDiscount > 0 && promoDiscount > 0 && " + "}
                {promoDiscount > 0 && `Promo -${promoDiscount}%`}
              </span>
              <span className="font-bold text-tertiary">-{(savings / 100).toFixed(2)}€</span>
            </div>
          )}
          <div className="border-t border-white/5 pt-2 flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface">Total</span>
            <span className="font-display text-xl font-bold text-on-surface">{(finalPrice / 100).toFixed(2)}€</span>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-error">{error}</p>}

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-on-surface-variant hover:border-white/20">
            Annuler
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading || minutes < 10}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? "Traitement..." : `Acheter — ${(finalPrice / 100).toFixed(2)}€`}
          </button>
        </div>
      </div>
    </div>
  );
}
