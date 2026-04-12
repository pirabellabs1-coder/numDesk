import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { notes } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { updateNoteSchema } from "@vocalia/shared";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params;
    const body = await validateBody(req, updateNoteSchema); const db = getDb();
    const [updated] = await db.update(notes).set(body).where(eq(notes.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Note introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [deleted] = await db.delete(notes).where(eq(notes.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Note introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
