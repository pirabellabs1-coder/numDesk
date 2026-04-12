import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";

// Agent templates are static/seeded data
const templates = [
  { id: "tpl-1", name: "Support Client FR", description: "Agent de support client généraliste.", icon: "support_agent", category: "Support", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash", prompt: "Tu es un agent de support client professionnel et empathique..." },
  { id: "tpl-2", name: "Assistant Commercial", description: "Qualification de leads entrants.", icon: "storefront", category: "Sales", voice: "Cartesia — Gabriel", llm: "GPT-4o", prompt: "Tu es un assistant commercial chevronné..." },
  { id: "tpl-3", name: "Rappel de RDV", description: "Appels sortants pour confirmer des rendez-vous.", icon: "event", category: "Admin", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash", prompt: "Tu appelles pour confirmer un rendez-vous..." },
  { id: "tpl-4", name: "Qualification Leads", description: "Pré-qualification des prospects.", icon: "filter_alt", category: "Sales", voice: "Cartesia — Gabriel", llm: "GPT-4o", prompt: "Tu es un agent de qualification de leads..." },
  { id: "tpl-5", name: "Enquête Satisfaction", description: "Sondage post-service (NPS, CSAT).", icon: "sentiment_satisfied", category: "Support", voice: "ElevenLabs — Marie", llm: "Gemini 2.5 Flash", prompt: "Tu réalises une enquête de satisfaction..." },
  { id: "tpl-6", name: "Confirmation Commande", description: "Confirmation de commande et livraison.", icon: "shopping_cart", category: "Admin", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash", prompt: "Tu appelles pour confirmer une commande..." },
  { id: "tpl-7", name: "Relance Impayés", description: "Relance courtoise des factures impayées.", icon: "receipt_long", category: "Admin", voice: "Cartesia — Gabriel", llm: "GPT-4o", prompt: "Tu es un agent de recouvrement courtois..." },
  { id: "tpl-8", name: "Accueil Standard", description: "Standard téléphonique IA.", icon: "phone_forwarded", category: "Support", voice: "Cartesia — Sophie", llm: "Gemini 2.5 Flash", prompt: "Tu es le standard téléphonique..." },
];

export async function GET() {
  try { await withAuth();
    return apiSuccess(templates);
  } catch (error) { return handleApiError(error); }
}
