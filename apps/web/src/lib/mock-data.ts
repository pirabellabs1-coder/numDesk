export const mockWorkspace = {
  id: "ws-1",
  name: "Global Agency",
  plan: "Pro Plan",
  minutesUsed: 1440,
  minutesIncluded: 2000,
  daysRemaining: 8,
  overageRate: 0.05,
};

export const mockAgents = [
  {
    id: "agent-1",
    name: "Agent Support FR",
    isActive: true,
    totalCalls: 1284,
    avgDuration: "3:42",
    voiceId: "Cartesia — Gabriel",
    color: "from-primary to-secondary",
    publishedAt: "12 jan. 2026",
  },
  {
    id: "agent-2",
    name: "Sales Assistant",
    isActive: true,
    totalCalls: 856,
    avgDuration: "2:15",
    voiceId: "Cartesia — Sophie",
    color: "from-secondary to-tertiary",
    publishedAt: "3 fév. 2026",
  },
  {
    id: "agent-3",
    name: "Knowledge Bot",
    isActive: false,
    totalCalls: 412,
    avgDuration: "5:08",
    voiceId: "ElevenLabs — Marie",
    color: "from-tertiary to-primary",
    publishedAt: "28 mars 2026",
  },
  {
    id: "agent-4",
    name: "Rappel Campagne",
    isActive: true,
    totalCalls: 2100,
    avgDuration: "1:30",
    voiceId: "Cartesia — Gabriel",
    color: "from-primary/80 to-error/60",
    publishedAt: "1 avr. 2026",
  },
];

export const mockConversations = [
  {
    id: "conv-1",
    callerNumber: "+33 6 12 •••• 89",
    agentName: "Agent Support FR",
    agentColor: "bg-tertiary",
    duration: "04:12",
    status: "success" as const,
    statusLabel: "Succès",
    date: "Aujourd'hui, 14:24",
    type: "inbound" as const,
    typeLabel: "Entrant",
    sentiment: "positive" as const,
    isBilled: true,
    transcript: [
      { role: "agent", content: "Bonjour, vous êtes bien chez Callpme, comment puis-je vous aider ?", ts: "14:20:01" },
      { role: "user", content: "Oui bonjour, j'aimerais savoir comment configurer mon agent.", ts: "14:20:08" },
      { role: "agent", content: "Bien sûr ! Pour configurer votre agent, rendez-vous dans la section Agents de votre tableau de bord.", ts: "14:20:15" },
    ],
    summary: "L'utilisateur souhaitait comprendre comment configurer son agent IA. L'agent a fourni les instructions de navigation vers la section Agents.",
  },
  {
    id: "conv-2",
    callerNumber: "+33 7 88 •••• 12",
    agentName: "Sales Assistant",
    agentColor: "bg-primary",
    duration: "01:45",
    status: "success" as const,
    statusLabel: "Succès",
    date: "Aujourd'hui, 13:05",
    type: "inbound" as const,
    typeLabel: "Entrant",
    sentiment: "positive" as const,
    isBilled: true,
    transcript: [
      { role: "agent", content: "Bonjour ! Sales Assistant à votre service.", ts: "13:04:00" },
      { role: "user", content: "Je voulais avoir des infos sur vos tarifs.", ts: "13:04:07" },
    ],
    summary: "Demande de renseignements sur les tarifs. Prospect qualifié, intérêt confirmé.",
  },
  {
    id: "conv-3",
    callerNumber: "+33 6 45 •••• 67",
    agentName: "Agent Support FR",
    agentColor: "bg-tertiary",
    duration: "00:30",
    status: "missed" as const,
    statusLabel: "Manqué",
    date: "Hier, 18:42",
    type: "inbound" as const,
    typeLabel: "Entrant",
    sentiment: "neutral" as const,
    isBilled: false,
    transcript: [],
    summary: "Appel manqué, aucun message laissé.",
  },
  {
    id: "conv-4",
    callerNumber: "+33 1 23 •••• 90",
    agentName: "Knowledge Bot",
    agentColor: "bg-secondary",
    duration: "12:54",
    status: "success" as const,
    statusLabel: "Succès",
    date: "Hier, 16:15",
    type: "outbound" as const,
    typeLabel: "Sortant",
    sentiment: "positive" as const,
    isBilled: true,
    transcript: [
      { role: "agent", content: "Bonjour, je vous contacte au sujet de votre demande.", ts: "16:14:10" },
      { role: "user", content: "Ah oui, bonjour !", ts: "16:14:18" },
    ],
    summary: "Appel sortant réussi. Client satisfait, problème résolu.",
  },
  {
    id: "conv-5",
    callerNumber: "+33 6 78 •••• 34",
    agentName: "Sales Assistant",
    agentColor: "bg-primary",
    duration: "02:10",
    status: "interrupted" as const,
    statusLabel: "Interrompu",
    date: "Hier, 11:30",
    type: "inbound" as const,
    typeLabel: "Entrant",
    sentiment: "negative" as const,
    isBilled: false,
    transcript: [
      { role: "agent", content: "Bonjour, bienvenue !", ts: "11:29:50" },
      { role: "user", content: "Je veux parler à quelqu'un.", ts: "11:29:58" },
    ],
    summary: "Appel interrompu, l'appelant souhaitait un agent humain.",
  },
];

export const mockCampaigns = [
  {
    id: "camp-1",
    name: "Relance Prospects Avril",
    agentName: "Sales Assistant",
    status: "active" as const,
    statusLabel: "Active",
    totalContacts: 150,
    calledCount: 87,
    successCount: 62,
    scheduledAt: "Démarré le 8 avr.",
    callWindowStart: "09:00",
    callWindowEnd: "18:00",
  },
  {
    id: "camp-2",
    name: "Rappel RDV Clients",
    agentName: "Agent Support FR",
    status: "paused" as const,
    statusLabel: "En pause",
    totalContacts: 45,
    calledCount: 23,
    successCount: 19,
    scheduledAt: "Démarré le 5 avr.",
    callWindowStart: "10:00",
    callWindowEnd: "17:00",
  },
  {
    id: "camp-3",
    name: "Campagne Onboarding",
    agentName: "Knowledge Bot",
    status: "completed" as const,
    statusLabel: "Terminée",
    totalContacts: 80,
    calledCount: 80,
    successCount: 71,
    scheduledAt: "Terminé le 1 avr.",
    callWindowStart: "09:00",
    callWindowEnd: "19:00",
  },
];

export const mockKnowledgeBases = [
  {
    id: "kb-1",
    name: "FAQ Produit",
    mode: "full_context" as const,
    modeLabel: "Full Context",
    files: ["faq-produit.pdf", "guide-utilisateur.docx"],
    fileCount: 2,
    createdAt: "12 jan. 2026",
  },
  {
    id: "kb-2",
    name: "Documentation Technique",
    mode: "rag" as const,
    modeLabel: "RAG",
    files: ["api-docs.pdf", "integration-guide.pdf", "webhooks.txt"],
    fileCount: 3,
    createdAt: "28 mars 2026",
  },
];

export const mockPhoneNumbers = [
  {
    id: "num-1",
    number: "+33 1 87 XX XX XX",
    provider: "sip_trunk",
    trunkName: "Trunk Principal FR",
    friendlyName: "Numéro Support",
    isActive: true,
    assignedAgent: "Agent Support FR",
  },
  {
    id: "num-2",
    number: "+33 7 56 XX XX XX",
    provider: "sip_trunk",
    trunkName: "Trunk Principal FR",
    friendlyName: "Numéro Sales",
    isActive: true,
    assignedAgent: "Sales Assistant",
  },
  {
    id: "num-3",
    number: "+33 9 72 XX XX XX",
    provider: "sip_trunk",
    trunkName: "Trunk Backup",
    friendlyName: "Numéro Backup",
    isActive: false,
    assignedAgent: null,
  },
];

export const mockApiTokens = [
  {
    id: "tok-1",
    name: "Production API",
    prefix: "cmp_prod_xxxx",
    lastUsed: "Il y a 2 minutes",
    createdAt: "1 jan. 2026",
  },
  {
    id: "tok-2",
    name: "Integration CRM",
    prefix: "cmp_crm_xxxx",
    lastUsed: "Il y a 3 heures",
    createdAt: "15 fév. 2026",
  },
];

export const mockWebhooks = [
  {
    id: "wh-1",
    url: "https://mon-crm.fr/webhook/callpme",
    events: ["call.started", "call.ended"],
    isActive: true,
    lastTriggered: "Il y a 5 min",
    lastStatus: 200,
  },
];

export const mockBillingCycles = [
  {
    id: "cycle-1",
    period: "Avr. 2026",
    cycleStart: "1 avr.",
    cycleEnd: "30 avr.",
    minutesIncluded: 2000,
    minutesUsed: 1440,
    minutesOverage: 0,
    amountBase: 149,
    amountOverage: 0,
    amountTotal: 149,
    status: "open" as const,
    statusLabel: "Ouvert",
  },
  {
    id: "cycle-2",
    period: "Mars 2026",
    cycleStart: "1 mars",
    cycleEnd: "31 mars",
    minutesIncluded: 2000,
    minutesUsed: 2156,
    minutesOverage: 156,
    amountBase: 149,
    amountOverage: 7.8,
    amountTotal: 156.8,
    status: "paid" as const,
    statusLabel: "Payé",
  },
  {
    id: "cycle-3",
    period: "Fév. 2026",
    cycleStart: "1 fév.",
    cycleEnd: "28 fév.",
    minutesIncluded: 2000,
    minutesUsed: 1890,
    minutesOverage: 0,
    amountBase: 149,
    amountOverage: 0,
    amountTotal: 149,
    status: "paid" as const,
    statusLabel: "Payé",
  },
];

export const mockStats = {
  minutesUsed: 1284,
  minutesRemaining: 716,
  totalCalls: 4812,
  answerRate: 92.4,
  minutesTrend: +12,
  callsTrend: +24,
  answerTrend: -3,
};

// ── Live Call Monitor ──

export const mockLiveCalls = [
  {
    id: "live-1",
    agentName: "Agent Support FR",
    agentColor: "bg-tertiary",
    callerNumber: "+33 6 12 •••• 89",
    direction: "inbound" as const,
    startedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    sentiment: "positive" as const,
    status: "in_progress" as const,
  },
  {
    id: "live-2",
    agentName: "Sales Assistant",
    agentColor: "bg-primary",
    callerNumber: "+33 7 45 •••• 23",
    direction: "outbound" as const,
    startedAt: new Date(Date.now() - 7 * 60000).toISOString(),
    sentiment: "neutral" as const,
    status: "in_progress" as const,
  },
  {
    id: "live-3",
    agentName: "Rappel Campagne",
    agentColor: "bg-secondary",
    callerNumber: "+33 1 98 •••• 56",
    direction: "outbound" as const,
    startedAt: new Date(Date.now() - 1 * 60000).toISOString(),
    sentiment: "positive" as const,
    status: "ringing" as const,
  },
];

export const mockRecentEndedCalls = [
  { id: "ended-1", agentName: "Agent Support FR", callerNumber: "+33 6 34 •••• 12", duration: "02:45", status: "success" as const, endedAt: "Il y a 2 min" },
  { id: "ended-2", agentName: "Sales Assistant", callerNumber: "+33 7 89 •••• 01", duration: "05:12", status: "success" as const, endedAt: "Il y a 8 min" },
  { id: "ended-3", agentName: "Knowledge Bot", callerNumber: "+33 6 56 •••• 78", duration: "00:23", status: "missed" as const, endedAt: "Il y a 12 min" },
  { id: "ended-4", agentName: "Agent Support FR", callerNumber: "+33 1 22 •••• 90", duration: "08:34", status: "success" as const, endedAt: "Il y a 25 min" },
  { id: "ended-5", agentName: "Rappel Campagne", callerNumber: "+33 6 67 •••• 45", duration: "01:10", status: "voicemail" as const, endedAt: "Il y a 31 min" },
];

// ── Contacts / Mini-CRM ──

export const mockContacts = [
  { id: "ct-1", firstName: "Marie", lastName: "Dupont", phone: "+33 6 12 34 56 78", email: "marie.dupont@email.fr", tags: ["VIP", "Prospect chaud"], totalCalls: 8, lastCallDate: "Aujourd'hui", lastAgent: "Agent Support FR", sentiment: "positive" as const },
  { id: "ct-2", firstName: "Jean", lastName: "Martin", phone: "+33 7 23 45 67 89", email: "j.martin@entreprise.fr", tags: ["Client actif"], totalCalls: 12, lastCallDate: "Hier", lastAgent: "Sales Assistant", sentiment: "positive" as const },
  { id: "ct-3", firstName: "Sophie", lastName: "Bernard", phone: "+33 6 34 56 78 90", email: "sophie.b@gmail.com", tags: ["À rappeler"], totalCalls: 3, lastCallDate: "10 avr.", lastAgent: "Agent Support FR", sentiment: "neutral" as const },
  { id: "ct-4", firstName: "Pierre", lastName: "Moreau", phone: "+33 1 45 67 89 01", email: "p.moreau@corp.fr", tags: ["Prospect chaud", "VIP"], totalCalls: 5, lastCallDate: "9 avr.", lastAgent: "Knowledge Bot", sentiment: "positive" as const },
  { id: "ct-5", firstName: "Camille", lastName: "Petit", phone: "+33 6 56 78 90 12", email: "camille.petit@mail.fr", tags: ["Problème technique"], totalCalls: 2, lastCallDate: "8 avr.", lastAgent: "Agent Support FR", sentiment: "negative" as const },
  { id: "ct-6", firstName: "Lucas", lastName: "Robert", phone: "+33 7 67 89 01 23", email: "lucas.r@startup.io", tags: ["Client actif"], totalCalls: 15, lastCallDate: "Aujourd'hui", lastAgent: "Sales Assistant", sentiment: "positive" as const },
  { id: "ct-7", firstName: "Emma", lastName: "Richard", phone: "+33 6 78 90 12 34", email: "emma.richard@pro.fr", tags: ["Nouveau"], totalCalls: 1, lastCallDate: "7 avr.", lastAgent: "Rappel Campagne", sentiment: "neutral" as const },
  { id: "ct-8", firstName: "Hugo", lastName: "Durand", phone: "+33 1 89 01 23 45", email: "hugo.d@company.com", tags: ["À rappeler", "VIP"], totalCalls: 7, lastCallDate: "6 avr.", lastAgent: "Agent Support FR", sentiment: "positive" as const },
  { id: "ct-9", firstName: "Léa", lastName: "Leroy", phone: "+33 6 90 12 34 56", email: "lea.leroy@agence.fr", tags: ["Prospect chaud"], totalCalls: 4, lastCallDate: "5 avr.", lastAgent: "Sales Assistant", sentiment: "neutral" as const },
  { id: "ct-10", firstName: "Antoine", lastName: "Fournier", phone: "+33 7 01 23 45 67", email: "a.fournier@tech.fr", tags: ["Client actif"], totalCalls: 20, lastCallDate: "Aujourd'hui", lastAgent: "Knowledge Bot", sentiment: "positive" as const },
  { id: "ct-11", firstName: "Chloé", lastName: "Girard", phone: "+33 6 12 45 78 90", email: "chloe.g@mail.com", tags: ["Nouveau"], totalCalls: 1, lastCallDate: "4 avr.", lastAgent: "Rappel Campagne", sentiment: "neutral" as const },
  { id: "ct-12", firstName: "Thomas", lastName: "Bonnet", phone: "+33 1 23 56 89 01", email: "t.bonnet@enterprise.fr", tags: ["Problème technique", "À rappeler"], totalCalls: 6, lastCallDate: "3 avr.", lastAgent: "Agent Support FR", sentiment: "negative" as const },
];

// ── Templates d'agents ──

export const mockTemplates = [
  { id: "tpl-1", name: "Support Client FR", description: "Agent de support client généraliste, formé pour répondre aux questions fréquentes et escalader les cas complexes.", icon: "support_agent", category: "Support" as const, prompt: "Tu es un agent de support client professionnel et empathique...", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash" },
  { id: "tpl-2", name: "Assistant Commercial", description: "Qualification de leads entrants, présentation de l'offre et prise de rendez-vous.", icon: "storefront", category: "Sales" as const, prompt: "Tu es un assistant commercial chevronné...", voice: "Cartesia — Gabriel", llm: "GPT-4o" },
  { id: "tpl-3", name: "Rappel de RDV", description: "Appels sortants automatisés pour confirmer ou rappeler des rendez-vous.", icon: "event", category: "Admin" as const, prompt: "Tu appelles pour confirmer un rendez-vous...", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash" },
  { id: "tpl-4", name: "Qualification Leads", description: "Pré-qualification des prospects avec scoring automatique basé sur les réponses.", icon: "filter_alt", category: "Sales" as const, prompt: "Tu es un agent de qualification de leads...", voice: "Cartesia — Gabriel", llm: "GPT-4o" },
  { id: "tpl-5", name: "Enquête Satisfaction", description: "Sondage post-achat ou post-service pour mesurer la satisfaction client (NPS, CSAT).", icon: "sentiment_satisfied", category: "Support" as const, prompt: "Tu réalises une enquête de satisfaction client...", voice: "ElevenLabs — Marie", llm: "Gemini 2.5 Flash" },
  { id: "tpl-6", name: "Confirmation Commande", description: "Appel de confirmation de commande avec vérification des coordonnées de livraison.", icon: "shopping_cart", category: "Admin" as const, prompt: "Tu appelles pour confirmer une commande...", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash" },
  { id: "tpl-7", name: "Relance Impayés", description: "Relance courtoise mais ferme des factures impayées avec proposition d'échéancier.", icon: "receipt_long", category: "Admin" as const, prompt: "Tu es un agent de recouvrement courtois...", voice: "Cartesia — Gabriel", llm: "GPT-4o" },
  { id: "tpl-8", name: "Accueil Standard", description: "Standard téléphonique IA : accueil, orientation vers le bon service, transfert d'appels.", icon: "phone_forwarded", category: "Support" as const, prompt: "Tu es le standard téléphonique de l'entreprise...", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash" },
];

// ── Enregistrements / Call Library ──

export const mockRecordings = [
  { id: "rec-1", date: "Aujourd'hui, 14:24", agentName: "Agent Support FR", callerNumber: "+33 6 12 •••• 89", duration: "04:12", sentiment: "positive" as const, tags: ["VIP"], durationSeconds: 252 },
  { id: "rec-2", date: "Aujourd'hui, 13:05", agentName: "Sales Assistant", callerNumber: "+33 7 88 •••• 12", duration: "01:45", sentiment: "positive" as const, tags: ["Prospect chaud"], durationSeconds: 105 },
  { id: "rec-3", date: "Hier, 16:15", agentName: "Knowledge Bot", callerNumber: "+33 1 23 •••• 90", duration: "12:54", sentiment: "positive" as const, tags: ["Client actif"], durationSeconds: 774 },
  { id: "rec-4", date: "Hier, 11:30", agentName: "Sales Assistant", callerNumber: "+33 6 78 •••• 34", duration: "02:10", sentiment: "negative" as const, tags: ["Problème technique"], durationSeconds: 130 },
  { id: "rec-5", date: "9 avr., 09:45", agentName: "Agent Support FR", callerNumber: "+33 7 45 •••• 67", duration: "06:30", sentiment: "neutral" as const, tags: [], durationSeconds: 390 },
  { id: "rec-6", date: "9 avr., 15:20", agentName: "Rappel Campagne", callerNumber: "+33 6 89 •••• 01", duration: "01:05", sentiment: "positive" as const, tags: ["Rappel RDV"], durationSeconds: 65 },
  { id: "rec-7", date: "8 avr., 10:12", agentName: "Agent Support FR", callerNumber: "+33 1 56 •••• 34", duration: "08:45", sentiment: "positive" as const, tags: ["VIP", "Client actif"], durationSeconds: 525 },
  { id: "rec-8", date: "8 avr., 14:55", agentName: "Knowledge Bot", callerNumber: "+33 6 23 •••• 78", duration: "03:20", sentiment: "neutral" as const, tags: [], durationSeconds: 200 },
  { id: "rec-9", date: "7 avr., 11:00", agentName: "Sales Assistant", callerNumber: "+33 7 34 •••• 56", duration: "05:55", sentiment: "positive" as const, tags: ["Prospect chaud"], durationSeconds: 355 },
  { id: "rec-10", date: "7 avr., 16:40", agentName: "Agent Support FR", callerNumber: "+33 6 45 •••• 90", duration: "02:30", sentiment: "negative" as const, tags: ["À rappeler"], durationSeconds: 150 },
];

// ── Journal d'activité ──

export const mockActivityLog = [
  { id: "act-1", type: "call" as const, description: "Appel entrant traité par Agent Support FR", detail: "+33 6 12 •••• 89 — 4min 12s", user: "Système", timestamp: "Aujourd'hui, 14:24" },
  { id: "act-2", type: "creation" as const, description: "Agent \"Rappel Campagne\" créé", detail: "Voix : Cartesia Gabriel, LLM : Gemini 2.5 Flash", user: "Alex Rivera", timestamp: "Aujourd'hui, 11:30" },
  { id: "act-3", type: "campaign" as const, description: "Campagne \"Relance Prospects Avril\" lancée", detail: "150 contacts, plage 09h-18h", user: "Alex Rivera", timestamp: "Aujourd'hui, 09:00" },
  { id: "act-4", type: "modification" as const, description: "Prompt de Agent Support FR modifié", detail: "324 caractères ajoutés au prompt principal", user: "Alex Rivera", timestamp: "Hier, 17:45" },
  { id: "act-5", type: "call" as const, description: "Appel sortant par Knowledge Bot", detail: "+33 1 23 •••• 90 — 12min 54s", user: "Système", timestamp: "Hier, 16:15" },
  { id: "act-6", type: "deletion" as const, description: "Token API \"Test Dev\" révoqué", detail: "Préfixe : cmp_test_xxxx", user: "Alex Rivera", timestamp: "Hier, 14:20" },
  { id: "act-7", type: "creation" as const, description: "Base de connaissances \"FAQ Produit\" créée", detail: "Mode Full Context, 2 fichiers", user: "Alex Rivera", timestamp: "Hier, 10:00" },
  { id: "act-8", type: "campaign" as const, description: "Campagne \"Rappel RDV Clients\" mise en pause", detail: "23/45 contacts appelés", user: "Alex Rivera", timestamp: "10 avr., 16:30" },
  { id: "act-9", type: "modification" as const, description: "Voix de Sales Assistant changée", detail: "Cartesia Gabriel → Cartesia Sophie", user: "Alex Rivera", timestamp: "10 avr., 14:00" },
  { id: "act-10", type: "call" as const, description: "5 appels manqués sur Agent Support FR", detail: "Période : 12h-13h (pause déjeuner)", user: "Système", timestamp: "10 avr., 13:05" },
  { id: "act-11", type: "creation" as const, description: "Numéro SIP +33 9 72 XX XX XX ajouté", detail: "Trunk Backup, non assigné", user: "Alex Rivera", timestamp: "10 avr., 11:15" },
  { id: "act-12", type: "modification" as const, description: "Plage horaire de la campagne modifiée", detail: "Relance Prospects : 09h-18h → 10h-17h", user: "Alex Rivera", timestamp: "9 avr., 16:00" },
  { id: "act-13", type: "call" as const, description: "Appel entrant — interruption par l'appelant", detail: "+33 6 78 •••• 34 — 2min 10s", user: "Système", timestamp: "9 avr., 11:30" },
  { id: "act-14", type: "creation" as const, description: "Webhook CRM configuré", detail: "https://mon-crm.fr/webhook/callpme", user: "Alex Rivera", timestamp: "9 avr., 09:45" },
  { id: "act-15", type: "campaign" as const, description: "Campagne \"Onboarding\" terminée", detail: "71/80 succès (89%)", user: "Système", timestamp: "8 avr., 19:00" },
  { id: "act-16", type: "modification" as const, description: "Température LLM de Knowledge Bot ajustée", detail: "0.4 → 0.6", user: "Alex Rivera", timestamp: "8 avr., 15:30" },
  { id: "act-17", type: "creation" as const, description: "Agent \"Knowledge Bot\" créé", detail: "Template : Support Client FR", user: "Alex Rivera", timestamp: "8 avr., 10:00" },
  { id: "act-18", type: "deletion" as const, description: "Base de connaissances \"Ancien FAQ\" supprimée", detail: "3 fichiers supprimés", user: "Alex Rivera", timestamp: "7 avr., 17:00" },
  { id: "act-19", type: "call" as const, description: "Premier appel réussi avec Sales Assistant", detail: "+33 7 23 •••• 89 — 3min 45s", user: "Système", timestamp: "7 avr., 14:30" },
  { id: "act-20", type: "creation" as const, description: "Agent \"Sales Assistant\" publié en production", detail: "Version 1.0", user: "Alex Rivera", timestamp: "7 avr., 11:00" },
];

// ── Tags Manager ──

export const mockTags = [
  { id: "tag-1", name: "VIP", color: "#7B5CFA", conversationCount: 24 },
  { id: "tag-2", name: "Prospect chaud", color: "#FF7F3F", conversationCount: 45 },
  { id: "tag-3", name: "À rappeler", color: "#4F7FFF", conversationCount: 18 },
  { id: "tag-4", name: "Client actif", color: "#00D4AA", conversationCount: 67 },
  { id: "tag-5", name: "Problème technique", color: "#FFB4AB", conversationCount: 12 },
  { id: "tag-6", name: "Nouveau", color: "#C3C6D7", conversationCount: 31 },
  { id: "tag-7", name: "Rappel RDV", color: "#FF7F3F", conversationCount: 22 },
  { id: "tag-8", name: "Satisfait", color: "#00D4AA", conversationCount: 89 },
  { id: "tag-9", name: "Insatisfait", color: "#FFB4AB", conversationCount: 8 },
  { id: "tag-10", name: "Qualifié", color: "#7B5CFA", conversationCount: 56 },
];

// ── Agent Versions ──

export const mockAgentVersions = [
  { id: "ver-1", version: "1.3", status: "live" as const, date: "Aujourd'hui, 11:30", author: "Alex Rivera", changes: "Prompt principal refondu pour améliorer la gestion des objections", promptPreview: "Tu es un agent de support client professionnel et empathique. Tu travailles pour l'entreprise Callpme..." },
  { id: "ver-2", version: "1.2", status: "archived" as const, date: "8 avr., 15:30", author: "Alex Rivera", changes: "Ajout de l'outil rappel_tool pour la prise de RDV", promptPreview: "Tu es un agent de support client. Tu dois aider les utilisateurs avec leurs questions..." },
  { id: "ver-3", version: "1.1", status: "archived" as const, date: "5 avr., 10:00", author: "Alex Rivera", changes: "Voix changée de Gabriel à Sophie + hésitations activées", promptPreview: "Tu es un agent de support client. Réponds aux questions des utilisateurs..." },
  { id: "ver-4", version: "1.0", status: "archived" as const, date: "3 avr., 14:00", author: "Alex Rivera", changes: "Première version publiée en production", promptPreview: "Tu es un agent d'accueil téléphonique. Tu réponds aux appels entrants..." },
  { id: "ver-5", version: "0.9-draft", status: "archived" as const, date: "1 avr., 09:00", author: "Alex Rivera", changes: "Version initiale (brouillon)", promptPreview: "Agent de test — prompt initial de développement..." },
];

// ── Marketplace Intégrations ──

export const mockIntegrations = [
  { id: "int-1", name: "Zapier", icon: "bolt", description: "Connectez Callpme à 5000+ applications via des Zaps automatisés.", category: "Productivité" as const, status: "connected" as const },
  { id: "int-2", name: "Google Sheets", icon: "table_chart", description: "Exportez automatiquement les données d'appels vers Google Sheets.", category: "Productivité" as const, status: "connected" as const },
  { id: "int-3", name: "HubSpot", icon: "hub", description: "Synchronisez vos contacts et créez des deals automatiquement après chaque appel.", category: "CRM" as const, status: "available" as const },
  { id: "int-4", name: "Salesforce", icon: "cloud", description: "Intégration native avec Salesforce pour la gestion des leads et opportunités.", category: "CRM" as const, status: "soon" as const },
  { id: "int-5", name: "Pipedrive", icon: "filter_alt", description: "Créez et mettez à jour vos deals Pipedrive après chaque conversation.", category: "CRM" as const, status: "soon" as const },
  { id: "int-6", name: "Slack", icon: "tag", description: "Recevez des notifications d'appels en temps réel dans vos channels Slack.", category: "Communication" as const, status: "available" as const },
  { id: "int-7", name: "Google Calendar", icon: "calendar_month", description: "Planifiez des rendez-vous directement depuis les conversations d'agents.", category: "Productivité" as const, status: "available" as const },
  { id: "int-8", name: "Make (Integromat)", icon: "settings_suggest", description: "Créez des scénarios d'automatisation complexes avec Make.", category: "Productivité" as const, status: "available" as const },
  { id: "int-9", name: "n8n", icon: "account_tree", description: "Workflows d'automatisation open-source avec n8n.", category: "Productivité" as const, status: "soon" as const },
  { id: "int-10", name: "Airtable", icon: "grid_view", description: "Synchronisez les données de contacts et conversations avec Airtable.", category: "Productivité" as const, status: "soon" as const },
  { id: "int-11", name: "Notion", icon: "edit_note", description: "Envoyez les résumés d'appels et notes dans votre base Notion.", category: "Productivité" as const, status: "soon" as const },
  { id: "int-12", name: "Discord", icon: "forum", description: "Notifications d'appels et résumés dans vos serveurs Discord.", category: "Communication" as const, status: "soon" as const },
  { id: "int-13", name: "Microsoft Teams", icon: "groups", description: "Intégration avec Teams pour les notifications et la collaboration.", category: "Communication" as const, status: "soon" as const },
  { id: "int-14", name: "WhatsApp Business", icon: "chat", description: "Envoyez des suivis WhatsApp après les appels terminés.", category: "Communication" as const, status: "soon" as const },
  { id: "int-15", name: "Webhook Custom", icon: "webhook", description: "Envoyez les événements d'appels vers n'importe quel endpoint HTTP.", category: "Productivité" as const, status: "connected" as const },
];

// ── Rapport hebdomadaire ──

export const mockWeeklyReport = {
  period: "7 — 13 avril 2026",
  summary: "87 appels traités cette semaine, en hausse de 12% par rapport à la semaine précédente. Le taux de satisfaction est de 91%.",
  kpis: {
    totalCalls: 87,
    callsTrend: +12,
    avgDuration: "3:42",
    durationTrend: -5,
    completionRate: 94,
    completionTrend: +2,
    satisfactionRate: 91,
    satisfactionTrend: +3,
  },
  topAgents: [
    { name: "Agent Support FR", calls: 42, successRate: 96, avgDuration: "4:15" },
    { name: "Sales Assistant", calls: 28, successRate: 92, avgDuration: "2:50" },
    { name: "Knowledge Bot", calls: 17, successRate: 88, avgDuration: "5:30" },
  ],
  sentimentBreakdown: { positive: 62, neutral: 25, negative: 13 },
  peakHours: [
    { hour: "09h", mon: 3, tue: 5, wed: 4, thu: 6, fri: 2 },
    { hour: "10h", mon: 7, tue: 8, wed: 6, thu: 9, fri: 5 },
    { hour: "11h", mon: 5, tue: 6, wed: 8, thu: 7, fri: 4 },
    { hour: "12h", mon: 2, tue: 1, wed: 2, thu: 3, fri: 1 },
    { hour: "14h", mon: 6, tue: 7, wed: 5, thu: 8, fri: 6 },
    { hour: "15h", mon: 8, tue: 9, wed: 7, thu: 6, fri: 7 },
    { hour: "16h", mon: 5, tue: 6, wed: 4, thu: 5, fri: 3 },
    { hour: "17h", mon: 3, tue: 4, wed: 3, thu: 2, fri: 2 },
  ],
  alerts: [
    "Le quota de minutes sera atteint d'ici 8 jours à ce rythme",
    "L'agent Knowledge Bot a un taux de complétion inférieur à 90%",
    "5 appels manqués pendant la pause déjeuner (12h-13h)",
  ],
};

// ── Dashboard Widgets ──

export const mockDashboardWidgets = [
  { id: "w-1", type: "minutes" as const, title: "Minutes en temps réel", size: "1x1" as const, enabled: true },
  { id: "w-2", type: "calls_today" as const, title: "Appels aujourd'hui", size: "1x1" as const, enabled: true },
  { id: "w-3", type: "active_agents" as const, title: "Agents actifs", size: "1x1" as const, enabled: true },
  { id: "w-4", type: "answer_rate" as const, title: "Taux de réponse", size: "1x1" as const, enabled: true },
  { id: "w-5", type: "recent_conversations" as const, title: "Dernières conversations", size: "2x1" as const, enabled: true },
  { id: "w-6", type: "active_campaigns" as const, title: "Campagnes en cours", size: "1x1" as const, enabled: false },
  { id: "w-7", type: "sentiment" as const, title: "Sentiment du jour", size: "1x1" as const, enabled: false },
  { id: "w-8", type: "quota_forecast" as const, title: "Prévision quota", size: "1x1" as const, enabled: false },
  { id: "w-9", type: "recent_activity" as const, title: "Activité récente", size: "2x1" as const, enabled: false },
];

// ── Chat interne ──

export const mockChatChannels = [
  { id: "ch-1", name: "Général", icon: "tag", unread: 3, lastMessage: "Alex : On lance la campagne avril demain", lastTime: "14:32" },
  { id: "ch-2", name: "Support", icon: "support_agent", unread: 0, lastMessage: "Sarah : L'agent FR est mis à jour", lastTime: "11:20" },
  { id: "ch-3", name: "Sales", icon: "storefront", unread: 1, lastMessage: "Marc : Nouveau lead qualifié", lastTime: "09:45" },
  { id: "ch-4", name: "Technique", icon: "code", unread: 0, lastMessage: "Alex : Latence Cartesia stable", lastTime: "Hier" },
];

export const mockChatMessages = [
  { id: "msg-1", channel: "ch-1", author: "Alex Rivera", avatar: "AR", content: "On lance la campagne avril demain matin à 9h, tout est prêt ?", time: "14:32", isMe: true },
  { id: "msg-2", channel: "ch-1", author: "Sarah Martin", avatar: "SM", content: "Oui, l'agent est configuré et les contacts sont importés. 150 contacts au total.", time: "14:28", isMe: false },
  { id: "msg-3", channel: "ch-1", author: "Marc Dupont", avatar: "MD", content: "Le SIP trunk est opérationnel, j'ai testé ce matin.", time: "14:15", isMe: false },
  { id: "msg-4", channel: "ch-1", author: "Alex Rivera", avatar: "AR", content: "Parfait. On garde la plage 9h-18h comme prévu.", time: "14:10", isMe: true },
  { id: "msg-5", channel: "ch-1", author: "Sarah Martin", avatar: "SM", content: "J'ai aussi ajouté 3 nouvelles phrases de relance dans le prompt.", time: "13:50", isMe: false },
  { id: "msg-6", channel: "ch-1", author: "Marc Dupont", avatar: "MD", content: "Bonne idée. On devrait voir une amélioration du taux de conversion.", time: "13:45", isMe: false },
];

// ── Notes sur les appels ──

export const mockCallNotes = [
  { id: "note-1", callId: "conv-1", author: "Alex Rivera", content: "Client VIP — à rappeler la semaine prochaine pour le renouvellement.", createdAt: "Aujourd'hui, 14:30", action: "rappel" as const },
  { id: "note-2", callId: "conv-2", author: "Alex Rivera", content: "Prospect intéressé par le plan Pro. Envoyer devis par email.", createdAt: "Aujourd'hui, 13:10", action: "email" as const },
  { id: "note-3", callId: "conv-4", author: "Sarah Martin", content: "Problème résolu. Le client est satisfait de la solution proposée.", createdAt: "Hier, 16:20", action: "none" as const },
  { id: "note-4", callId: "conv-5", author: "Alex Rivera", content: "L'appelant veut parler à un humain. Transférer au service commercial.", createdAt: "Hier, 11:35", action: "transfert" as const },
];

// ── Calendrier d'appels ──

export const mockCalendarEvents = [
  { id: "evt-1", title: "Campagne Relance Prospects", type: "campaign" as const, date: "2026-04-11", startTime: "09:00", endTime: "18:00", agent: "Sales Assistant", status: "active" as const },
  { id: "evt-2", title: "Rappel RDV — Marie Dupont", type: "scheduled" as const, date: "2026-04-11", startTime: "10:30", endTime: "10:45", agent: "Agent Support FR", status: "pending" as const },
  { id: "evt-3", title: "Test agent Knowledge Bot", type: "test" as const, date: "2026-04-11", startTime: "14:00", endTime: "14:15", agent: "Knowledge Bot", status: "completed" as const },
  { id: "evt-4", title: "Campagne Rappel RDV", type: "campaign" as const, date: "2026-04-12", startTime: "10:00", endTime: "17:00", agent: "Agent Support FR", status: "pending" as const },
  { id: "evt-5", title: "Appel planifié — Pierre Moreau", type: "scheduled" as const, date: "2026-04-12", startTime: "11:00", endTime: "11:15", agent: "Sales Assistant", status: "pending" as const },
  { id: "evt-6", title: "Demo client — Cabinet Martin", type: "scheduled" as const, date: "2026-04-14", startTime: "15:00", endTime: "15:30", agent: "Agent Support FR", status: "pending" as const },
  { id: "evt-7", title: "Campagne Onboarding V2", type: "campaign" as const, date: "2026-04-15", startTime: "09:00", endTime: "19:00", agent: "Rappel Campagne", status: "pending" as const },
];

// ── Score de qualité agent ──

export const mockAgentScores = [
  { agentId: "agent-1", name: "Agent Support FR", score: 92, completionRate: 96, avgDuration: 222, sentimentPositive: 78, responseTime: 1.2, trend: +3, history: [85, 87, 88, 90, 89, 91, 92] },
  { agentId: "agent-2", name: "Sales Assistant", score: 87, completionRate: 92, avgDuration: 135, sentimentPositive: 72, responseTime: 1.5, trend: +5, history: [78, 80, 82, 84, 85, 86, 87] },
  { agentId: "agent-3", name: "Knowledge Bot", score: 74, completionRate: 88, avgDuration: 308, sentimentPositive: 65, responseTime: 2.1, trend: -2, history: [80, 78, 77, 76, 75, 75, 74] },
  { agentId: "agent-4", name: "Rappel Campagne", score: 83, completionRate: 91, avgDuration: 90, sentimentPositive: 70, responseTime: 0.8, trend: +1, history: [79, 80, 81, 82, 82, 83, 83] },
];

// ── Détection d'anomalies ──

export const mockAnomalies = [
  { id: "anom-1", type: "spike" as const, severity: "high" as const, title: "Pic d'appels manqués", description: "12 appels manqués entre 12h et 13h — 4x la moyenne", detectedAt: "Aujourd'hui, 13:05", agent: "Agent Support FR", resolved: false },
  { id: "anom-2", type: "drop" as const, severity: "medium" as const, title: "Chute du sentiment positif", description: "Sentiment positif passé de 78% à 52% sur les 2 dernières heures", detectedAt: "Aujourd'hui, 11:30", agent: "Sales Assistant", resolved: false },
  { id: "anom-3", type: "latency" as const, severity: "low" as const, title: "Latence TTS élevée", description: "Cartesia TTS latence moyenne à 450ms (seuil : 300ms)", detectedAt: "Hier, 16:45", agent: null, resolved: true },
  { id: "anom-4", type: "spike" as const, severity: "high" as const, title: "Consommation de minutes anormale", description: "340 minutes consommées en 2h — 3x le rythme habituel", detectedAt: "Hier, 14:00", agent: null, resolved: true },
  { id: "anom-5", type: "drop" as const, severity: "medium" as const, title: "Taux de complétion en baisse", description: "Knowledge Bot : complétion passée de 88% à 71% aujourd'hui", detectedAt: "10 avr., 17:00", agent: "Knowledge Bot", resolved: true },
];

// ── Suggestions IA ──

export const mockAiSuggestions = [
  { id: "sug-1", agentId: "agent-1", type: "prompt" as const, title: "Améliorer la gestion des objections", description: "Basé sur 12 conversations où l'appelant a exprimé une objection prix. Suggère d'ajouter une section dédiée dans le prompt.", impact: "high" as const, applied: false },
  { id: "sug-2", agentId: "agent-2", type: "voice" as const, title: "Changer la voix pour les appels sortants", description: "La voix Gabriel a un taux de raccrochage 15% plus élevé que Sophie sur les appels outbound.", impact: "medium" as const, applied: false },
  { id: "sug-3", agentId: "agent-3", type: "prompt" as const, title: "Réduire la longueur des réponses", description: "Les réponses de Knowledge Bot sont en moyenne 40% plus longues que les autres agents, ce qui augmente la durée des appels.", impact: "medium" as const, applied: true },
  { id: "sug-4", agentId: "agent-1", type: "tool" as const, title: "Ajouter un outil de prise de RDV", description: "23% des appels se terminent par une demande de rendez-vous. Un outil automatisé réduirait le temps de traitement.", impact: "high" as const, applied: false },
  { id: "sug-5", agentId: "agent-4", type: "prompt" as const, title: "Optimiser le message de messagerie vocale", description: "Le taux de rappel après messagerie est de 8%. Un message plus court et direct pourrait l'améliorer.", impact: "low" as const, applied: false },
];

// ── Kanban Leads ──

export const mockLeads = [
  { id: "lead-1", name: "Marie Dupont", company: "Immo Paris", phone: "+33 6 12 34 56 78", value: "2 400 €", source: "Appel entrant", stage: "new" as const, agent: "Sales Assistant", lastContact: "Aujourd'hui" },
  { id: "lead-2", name: "Pierre Moreau", company: "Tech Corp", phone: "+33 1 45 67 89 01", value: "5 800 €", source: "Campagne", stage: "new" as const, agent: "Sales Assistant", lastContact: "Hier" },
  { id: "lead-3", name: "Lucas Robert", company: "StartupAI", phone: "+33 7 67 89 01 23", value: "3 200 €", source: "Appel entrant", stage: "contacted" as const, agent: "Agent Support FR", lastContact: "Aujourd'hui" },
  { id: "lead-4", name: "Sophie Bernard", company: "Agence Web", phone: "+33 6 34 56 78 90", value: "1 800 €", source: "Campagne", stage: "contacted" as const, agent: "Sales Assistant", lastContact: "10 avr." },
  { id: "lead-5", name: "Jean Martin", company: "Cabinet Martin", phone: "+33 7 23 45 67 89", value: "4 500 €", source: "Appel entrant", stage: "qualified" as const, agent: "Sales Assistant", lastContact: "9 avr." },
  { id: "lead-6", name: "Emma Richard", company: "Auto-École R.", phone: "+33 6 78 90 12 34", value: "2 100 €", source: "Campagne", stage: "qualified" as const, agent: "Rappel Campagne", lastContact: "8 avr." },
  { id: "lead-7", name: "Antoine Fournier", company: "E-Shop Pro", phone: "+33 7 01 23 45 67", value: "7 200 €", source: "Appel entrant", stage: "converted" as const, agent: "Sales Assistant", lastContact: "7 avr." },
  { id: "lead-8", name: "Hugo Durand", company: "Durand & Fils", phone: "+33 1 89 01 23 45", value: "3 600 €", source: "Appel entrant", stage: "converted" as const, agent: "Agent Support FR", lastContact: "5 avr." },
];

// ── Équipes ──

export const mockTeams = [
  {
    id: "team-1", name: "Équipe Support", color: "#4F7FFF", members: [
      { id: "m-1", name: "Alex Rivera", role: "Lead", avatar: "AR" },
      { id: "m-2", name: "Sarah Martin", role: "Agent", avatar: "SM" },
    ],
    agents: ["Agent Support FR", "Knowledge Bot"],
    activeCalls: 3,
  },
  {
    id: "team-2", name: "Équipe Sales", color: "#7B5CFA", members: [
      { id: "m-3", name: "Marc Dupont", role: "Lead", avatar: "MD" },
      { id: "m-4", name: "Julie Chen", role: "Agent", avatar: "JC" },
      { id: "m-5", name: "Thomas Bonnet", role: "Agent", avatar: "TB" },
    ],
    agents: ["Sales Assistant", "Rappel Campagne"],
    activeCalls: 5,
  },
  {
    id: "team-3", name: "Équipe Tech", color: "#00D4AA", members: [
      { id: "m-6", name: "Alex Rivera", role: "Lead", avatar: "AR" },
      { id: "m-7", name: "Léa Leroy", role: "Dev", avatar: "LL" },
    ],
    agents: [],
    activeCalls: 0,
  },
];

// ── Favoris ──

export const mockFavorites = [
  { id: "fav-1", type: "agent" as const, name: "Agent Support FR", icon: "smart_toy", href: "/agents/agent-1" },
  { id: "fav-2", type: "contact" as const, name: "Marie Dupont", icon: "person", href: "/contacts" },
  { id: "fav-3", type: "campaign" as const, name: "Relance Prospects", icon: "campaign", href: "/campaigns" },
  { id: "fav-4", type: "conversation" as const, name: "Conv. #conv-1", icon: "forum", href: "/conversations" },
  { id: "fav-5", type: "agent" as const, name: "Sales Assistant", icon: "smart_toy", href: "/agents/agent-2" },
];

// ── Carte géographique ──

export const mockGeoData = [
  { region: "Île-de-France", code: "IDF", calls: 1842, pct: 38, color: "#4F7FFF" },
  { region: "Auvergne-Rhône-Alpes", code: "ARA", calls: 624, pct: 13, color: "#7B5CFA" },
  { region: "Provence-Alpes-Côte d'Azur", code: "PACA", calls: 512, pct: 11, color: "#00D4AA" },
  { region: "Occitanie", code: "OCC", calls: 389, pct: 8, color: "#FF7F3F" },
  { region: "Nouvelle-Aquitaine", code: "NAQ", calls: 345, pct: 7, color: "#4F7FFF" },
  { region: "Hauts-de-France", code: "HDF", calls: 298, pct: 6, color: "#7B5CFA" },
  { region: "Grand Est", code: "GES", calls: 256, pct: 5, color: "#00D4AA" },
  { region: "Pays de la Loire", code: "PDL", calls: 198, pct: 4, color: "#FF7F3F" },
  { region: "Bretagne", code: "BRE", calls: 156, pct: 3, color: "#4F7FFF" },
  { region: "Normandie", code: "NOR", calls: 112, pct: 2, color: "#7B5CFA" },
  { region: "Bourgogne-Franche-Comté", code: "BFC", calls: 89, pct: 2, color: "#00D4AA" },
  { region: "Centre-Val de Loire", code: "CVL", calls: 67, pct: 1, color: "#FF7F3F" },
];

// ── Comparaison de périodes ──

export const mockPeriodComparison = {
  current: { label: "Cette semaine", calls: 87, minutes: 342, completion: 94, sentiment: 72, revenue: 1250 },
  previous: { label: "Semaine précédente", calls: 78, minutes: 305, completion: 91, sentiment: 68, revenue: 1120 },
};

// ── Mots-clés fréquents ──

export const mockKeywords = [
  { word: "rendez-vous", count: 145, trend: +12 },
  { word: "tarif", count: 98, trend: +8 },
  { word: "problème", count: 87, trend: -3 },
  { word: "livraison", count: 76, trend: +15 },
  { word: "rappeler", count: 72, trend: +5 },
  { word: "facture", count: 65, trend: -2 },
  { word: "annulation", count: 54, trend: +22 },
  { word: "remboursement", count: 48, trend: +10 },
  { word: "horaires", count: 45, trend: -8 },
  { word: "disponibilité", count: 42, trend: +3 },
  { word: "devis", count: 38, trend: +18 },
  { word: "réclamation", count: 35, trend: -5 },
  { word: "assistance", count: 32, trend: +2 },
  { word: "confirmation", count: 28, trend: +7 },
  { word: "paiement", count: 25, trend: -1 },
  { word: "inscription", count: 22, trend: +30 },
  { word: "réservation", count: 20, trend: +9 },
  { word: "délai", count: 18, trend: -4 },
  { word: "garantie", count: 15, trend: +1 },
  { word: "contrat", count: 12, trend: +6 },
];
