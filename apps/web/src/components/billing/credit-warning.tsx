"use client";

import Link from "next/link";
import { useWorkspace } from "@/providers/workspace-provider";
import { PLANS, type PlanSlug } from "@vocalia/shared";

export function CreditWarning() {
  const { workspace } = useWorkspace();
  if (!workspace) return null;

  const minutesRemaining = Math.max(0, workspace.minutesIncluded - workspace.minutesUsed);
  const usagePercent = workspace.minutesIncluded > 0
    ? (workspace.minutesUsed / workspace.minutesIncluded) * 100
    : 0;

  const planSlug = (workspace.planSlug as PlanSlug) || "trial";
  const isTrial = planSlug === "trial";

  // No warning if plenty of credits
  if (minutesRemaining > 0 && usagePercent < 80) return null;

  // Credits exhausted
  if (minutesRemaining === 0) {
    return (
      <div className="mx-8 mt-4 rounded-xl border border-error/20 bg-error/5 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-error">error</span>
            <div>
              <p className="text-sm font-bold text-error">
                {isTrial ? "Essai gratuit terminé" : "Minutes épuisées"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {isTrial
                  ? "Choisissez un plan pour continuer à utiliser Callpme."
                  : "Rechargez vos minutes pour continuer à passer des appels."
                }
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="shrink-0 rounded-lg bg-error/10 px-4 py-2 text-xs font-bold text-error hover:bg-error/20"
          >
            {isTrial ? "Choisir un plan" : "Recharger"}
          </Link>
        </div>
      </div>
    );
  }

  // Low credits warning (< 20% remaining)
  if (usagePercent >= 80) {
    return (
      <div className="mx-8 mt-4 rounded-xl border border-[#FF7F3F]/20 bg-[#FF7F3F]/5 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#FF7F3F]">warning</span>
            <div>
              <p className="text-sm font-bold text-[#FF7F3F]">
                Crédits bientôt épuisés
              </p>
              <p className="text-xs text-on-surface-variant">
                {minutesRemaining} minutes restantes sur {workspace.minutesIncluded}
              </p>
            </div>
          </div>
          <Link
            href="/billing"
            className="shrink-0 rounded-lg bg-[#FF7F3F]/10 px-4 py-2 text-xs font-bold text-[#FF7F3F] hover:bg-[#FF7F3F]/20"
          >
            Recharger
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
