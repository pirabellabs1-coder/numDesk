export const CALL_STATUS_LABELS = {
  success: "Succès",
  missed: "Manqué",
  interrupted: "Interrompu",
  voicemail: "Messagerie",
  no_answer: "Sans réponse",
  in_progress: "En cours",
  ringing: "Sonnerie",
  ended: "Terminé",
} as const;

export const CAMPAIGN_STATUS_LABELS = {
  draft: "Brouillon",
  active: "Active",
  paused: "En pause",
  completed: "Terminée",
  failed: "Échouée",
} as const;

export const SENTIMENT_LABELS = {
  positive: "Positif",
  neutral: "Neutre",
  negative: "Négatif",
} as const;

export const DIRECTION_LABELS = {
  inbound: "Entrant",
  outbound: "Sortant",
} as const;

export const LEAD_STAGE_LABELS = {
  new: "Nouveau",
  contacted: "Contacté",
  qualified: "Qualifié",
  converted: "Converti",
  lost: "Perdu",
} as const;

export const BILLING_STATUS_LABELS = {
  open: "Ouvert",
  finalized: "Finalisé",
  paid: "Payé",
  void: "Annulé",
} as const;

export const ANOMALY_SEVERITY_LABELS = {
  high: "Critique",
  medium: "Moyen",
  low: "Faible",
} as const;

export const SUGGESTION_IMPACT_LABELS = {
  high: "Impact élevé",
  medium: "Impact moyen",
  low: "Impact faible",
} as const;

export const NOTE_ACTION_LABELS = {
  rappel: "Rappel",
  email: "Email",
  transfert: "Transfert",
  none: "Aucune",
} as const;

// ── Plans & Billing ──

export type PlanSlug = "trial" | "starter" | "pro" | "enterprise";

export const PLANS = {
  trial: {
    slug: "trial" as const,
    name: "Essai gratuit",
    minutesIncluded: 5,
    pricePerMinuteCents: 0,
    maxAgents: 1,
    restricted: true,
    features: {
      campaigns: false,
      voiceStudio: false,
      knowledgeBaseRag: false,
      advancedAnalytics: false,
      apiAccess: false,
      webhooks: false,
    },
  },
  starter: {
    slug: "starter" as const,
    name: "Starter",
    minutesIncluded: 0,
    pricePerMinuteCents: 5,
    maxAgents: 2,
    restricted: true,
    features: {
      campaigns: false,
      voiceStudio: false,
      knowledgeBaseRag: false,
      advancedAnalytics: false,
      apiAccess: true,
      webhooks: true,
    },
  },
  pro: {
    slug: "pro" as const,
    name: "Pro",
    minutesIncluded: 0,
    pricePerMinuteCents: 12,
    maxAgents: null,
    restricted: false,
    features: {
      campaigns: true,
      voiceStudio: true,
      knowledgeBaseRag: true,
      advancedAnalytics: true,
      apiAccess: true,
      webhooks: true,
    },
  },
  enterprise: {
    slug: "enterprise" as const,
    name: "Enterprise",
    minutesIncluded: 0,
    pricePerMinuteCents: 0,
    maxAgents: null,
    restricted: false,
    features: {
      campaigns: true,
      voiceStudio: true,
      knowledgeBaseRag: true,
      advancedAnalytics: true,
      apiAccess: true,
      webhooks: true,
    },
  },
} as const;

export const PLAN_LABELS: Record<PlanSlug, string> = {
  trial: "Essai gratuit",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export const SUBSCRIPTION_STATUS_LABELS = {
  trialing: "Période d'essai",
  active: "Actif",
  past_due: "Paiement en retard",
  canceled: "Annulé",
} as const;

export const CREDIT_PACKAGES = [
  { minutes: 100, label: "100 minutes", discount: 0 },
  { minutes: 500, label: "500 minutes", discount: 5 },
  { minutes: 1000, label: "1 000 minutes", discount: 10 },
  { minutes: 5000, label: "5 000 minutes", discount: 20 },
] as const;

// Restricted routes per plan — pages that require Pro or Enterprise
export const PRO_ONLY_ROUTES = [
  "/campaigns",
  "/recordings",
  "/knowledge",
] as const;

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  CONFLICT: "CONFLICT",
} as const;
