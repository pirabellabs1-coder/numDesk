import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { createVapiAssistant, updateVapiAssistant } from "@/lib/vapi";

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const { agentId } = await req.json();
    if (!agentId) return apiError("VALIDATION_ERROR", "agentId requis", 422);

    const db = getDb();
    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId));
    if (!agent) return apiError("NOT_FOUND", "Agent introuvable", 404);

    let vapiAssistant;

    if (agent.vapiAgentId) {
      // Update existing Vapi assistant
      vapiAssistant = await updateVapiAssistant(agent.vapiAgentId, {
        name: agent.name,
        prompt: agent.prompt || undefined,
        firstMessage: agent.firstMessage || undefined,
        voiceProvider: agent.voiceProvider || undefined,
        voiceId: agent.voiceId || undefined,
        llmModel: agent.llmModel || "gemini-2.5-flash",
        language: agent.language || undefined,
        temperature: Number(agent.temperature) || 0.4,
      });

      // Update published status in DB
      await db.update(agents).set({
        isPublished: true,
        publishedAt: new Date(),
      }).where(eq(agents.id, agentId));
    } else {
      // Create new Vapi assistant
      vapiAssistant = await createVapiAssistant({
        name: agent.name,
        prompt: agent.prompt || "Tu es un assistant téléphonique professionnel.",
        firstMessage: agent.firstMessage || undefined,
        voiceProvider: agent.voiceProvider || undefined,
        voiceId: agent.voiceId || undefined,
        llmModel: agent.llmModel || "gemini-2.5-flash",
        language: agent.language || "fr-FR",
        temperature: Number(agent.temperature) || 0.4,
      });

      // Save Vapi assistant ID in our DB
      await db.update(agents).set({
        vapiAgentId: vapiAssistant.id,
        isPublished: true,
        publishedAt: new Date(),
      }).where(eq(agents.id, agentId));
    }

    return apiSuccess({ vapiAssistantId: vapiAssistant.id, synced: true });
  } catch (error) {
    return handleApiError(error);
  }
}
