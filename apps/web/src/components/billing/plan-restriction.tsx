"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Lock, Crown, ArrowRight, Zap } from "lucide-react";
import { useWorkspace } from "@/providers/workspace-provider";
import { PLANS, type PlanSlug } from "@vocalia/shared";

// Routes that require Pro plan
const PRO_ROUTES = [
  "/campaigns",
  "/recordings",
  "/knowledge",
  "/quality",
  "/compare",
  "/keywords",
  "/reports",
  "/geo",
];

// Routes that require at least Starter (blocked for trial)
const STARTER_ROUTES = [
  "/api-webhooks",
  "/integrations",
];

// Routes always accessible (even trial)
const ALWAYS_ALLOWED = [
  "/dashboard",
  "/agents",
  "/conversations",
  "/contacts",
  "/leads",
  "/phone-numbers",
  "/billing",
  "/settings",
  "/docs",
  "/live",
  "/calendar",
  "/chat",
  "/notes",
  "/teams",
  "/tags",
  "/favorites",
  "/activity",
  "/anomalies",
  "/suggestions",
  "/templates",
];

const proFeatureNames: Record<string, string> = {
  "/campaigns": "Campagnes d'appels sortants",
  "/recordings": "Enregistrements audio",
  "/knowledge": "Base de connaissances (RAG)",
  "/quality": "Score de qualité",
  "/compare": "Comparaison d'agents",
  "/keywords": "Analyse de mots-clés",
  "/reports": "Rapports avancés",
  "/geo": "Carte géographique",
};

const starterFeatureNames: Record<string, string> = {
  "/api-webhooks": "API & Webhooks",
  "/integrations": "Intégrations",
};

interface PlanRestrictionProps {
  children: React.ReactNode;
}

export function PlanRestriction({ children }: PlanRestrictionProps) {
  const pathname = usePathname();
  const { workspace, loading } = useWorkspace();

  if (loading || !workspace) return <>{children}</>;

  const planSlug = ((workspace as any)?.planSlug as PlanSlug) || "trial";
  const plan = PLANS[planSlug] || PLANS.trial;
  const basePath = "/" + (pathname.split("/")[1] || "dashboard");

  // Check if route requires Pro
  const needsPro = PRO_ROUTES.some((r) => basePath.startsWith(r));
  const needsStarter = STARTER_ROUTES.some((r) => basePath.startsWith(r));

  // Pro routes: blocked for trial AND starter
  if (needsPro && planSlug !== "pro" && planSlug !== "enterprise") {
    const featureName = proFeatureNames[basePath] || "Cette fonctionnalité";
    return (
      <RestrictedOverlay
        featureName={featureName}
        requiredPlan="Pro"
        requiredPrice="0.12€/min"
        currentPlan={plan.name}
        features={[
          "Agents IA illimités",
          "Campagnes d'appels sortants",
          "Voice Studio & voix custom",
          "Base de connaissances RAG",
          "Analytics avancés + sentiment",
          "Support prioritaire 24/7",
        ]}
      />
    );
  }

  // Starter routes: blocked for trial only
  if (needsStarter && planSlug === "trial") {
    const featureName = starterFeatureNames[basePath] || "Cette fonctionnalité";
    return (
      <RestrictedOverlay
        featureName={featureName}
        requiredPlan="Starter"
        requiredPrice="0.05€/min"
        currentPlan={plan.name}
        features={[
          "2 agents IA",
          "API REST complète",
          "Webhooks (2 events)",
          "Support email",
        ]}
      />
    );
  }

  return <>{children}</>;
}

function RestrictedOverlay({
  featureName,
  requiredPlan,
  requiredPrice,
  currentPlan,
  features,
}: {
  featureName: string;
  requiredPlan: string;
  requiredPrice: string;
  currentPlan: string;
  features: string[];
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-secondary/20 to-primary/20">
          <Lock size={36} className="text-secondary" />
        </div>

        <h2 className="mt-6 font-display text-2xl font-bold text-on-surface">
          {featureName}
        </h2>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5">
          <span className="text-xs text-on-surface-variant">
            Votre plan : <span className="font-bold text-on-surface">{currentPlan}</span>
          </span>
          <span className="text-on-surface-variant/30">→</span>
          <span className="text-xs font-bold text-secondary">
            Requis : {requiredPlan}
          </span>
        </div>

        <p className="mt-4 font-body text-sm leading-relaxed text-on-surface-variant">
          Cette fonctionnalité est réservée au plan{" "}
          <strong className="text-secondary">{requiredPlan}</strong> ({requiredPrice}).
          Mettez à niveau pour débloquer toutes les fonctionnalités.
        </p>

        {/* Features included */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-card p-5 text-left">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Inclus dans le plan {requiredPlan}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-2">
                <Crown size={12} className="shrink-0 text-secondary" />
                <span className="text-xs text-on-surface-variant">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/billing"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-8 py-3.5 font-nav text-sm font-bold text-white transition-all hover:brightness-110"
          >
            <Crown size={16} />
            Passer au plan {requiredPlan}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard"
            className="font-nav text-xs text-on-surface-variant hover:text-on-surface"
          >
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
