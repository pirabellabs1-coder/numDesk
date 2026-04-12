import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { updateAgentSchema } from "@vocalia/shared";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return apiError("VALIDATION_ERROR", "ID invalide", 422);
    }
    const db = getDb();
    const [agent] = await db.select().from(agents).where(eq(agents.id, id));
    if (!agent) return apiError("NOT_FOUND", "Agent introuvable", 404);
    return apiSuccess(agent);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const body = await validateBody(req, updateAgentSchema);
    const db = getDb();
    const values: Record<string, unknown> = { ...body };
    if (body.temperature !== undefined) values.temperature = String(body.temperature);
    if (body.topP !== undefined) values.topP = String(body.topP);
    const [updated] = await db.update(agents).set(values).where(eq(agents.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Agent introuvable", 404);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();
    const [deleted] = await db.delete(agents).where(eq(agents.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Agent introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
