import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { createVapiCall } from "@/lib/vapi";
import { checkCredits } from "@/lib/check-credits";

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const { agentId, phoneNumber: rawPhone } = await req.json();

    if (!agentId || !rawPhone) {
      return apiError("VALIDATION_ERROR", "agentId et phoneNumber requis", 422);
    }

    // Normalize to E.164 format
    let phoneNumber = rawPhone.trim().replace(/\s+/g, "");
    if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+" + phoneNumber;
    }

    const db = getDb();
    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId));
    if (!agent) return apiError("NOT_FOUND", "Agent introuvable", 404);

    if (!agent.vapiAgentId) {
      return apiError("VALIDATION_ERROR", "L'agent doit d'abord être publié sur Vapi", 422);
    }

    // Check credits before allowing the call
    const credits = await checkCredits(agent.workspaceId);
    if (!credits.allowed) {
      return apiError("FORBIDDEN", "Minutes épuisées. Rechargez vos crédits pour passer un appel.", 403);
    }

    const call = await createVapiCall(agent.vapiAgentId, phoneNumber);

    return apiSuccess({
      callId: call.id,
      status: call.status,
      message: "Appel test lancé avec succès",
      minutesRemaining: credits.minutesRemaining,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
