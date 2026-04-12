import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { teams } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { updateTeamSchema } from "@vocalia/shared";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [item] = await db.select().from(teams).where(eq(teams.id, id));
    if (!item) return apiError("NOT_FOUND", "Équipe introuvable", 404);
    return apiSuccess(item);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params;
    const body = await validateBody(req, updateTeamSchema); const db = getDb();
    const [updated] = await db.update(teams).set(body).where(eq(teams.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Équipe introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [deleted] = await db.delete(teams).where(eq(teams.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Équipe introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
