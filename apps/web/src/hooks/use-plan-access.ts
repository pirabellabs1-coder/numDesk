"use client";

import { useWorkspace } from "@/providers/workspace-provider";
import { PLANS, type PlanSlug } from "@vocalia/shared";

export function usePlanAccess() {
  const { workspace } = useWorkspace();

  const planSlug = ((workspace as any)?.planSlug as PlanSlug) || "trial";
  const plan = PLANS[planSlug] || PLANS.trial;

  const minutesRemaining = workspace
    ? Math.max(0, workspace.minutesIncluded - workspace.minutesUsed)
    : 0;

  return {
    planSlug,
    plan,
    isTrial: planSlug === "trial",
    isStarter: planSlug === "starter",
    isPro: planSlug === "pro" || planSlug === "enterprise",
    isEnterprise: planSlug === "enterprise",
    restricted: plan.restricted,
    minutesRemaining,
    hasCredits: minutesRemaining > 0,
    maxAgents: plan.maxAgents,
    features: plan.features,
    // Feature checks
    canUseCampaigns: plan.features.campaigns,
    canUseVoiceStudio: plan.features.voiceStudio,
    canUseRAG: plan.features.knowledgeBaseRag,
    canUseAdvancedAnalytics: plan.features.advancedAnalytics,
    canUseAPI: plan.features.apiAccess,
    canUseWebhooks: plan.features.webhooks,
  };
}
