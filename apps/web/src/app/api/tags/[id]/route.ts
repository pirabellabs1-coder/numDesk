import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { tags } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { updateTagSchema } from "@vocalia/shared";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params;
    const body = await validateBody(req, updateTagSchema); const db = getDb();
    const [updated] = await db.update(tags).set(body).where(eq(tags.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Tag introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [deleted] = await db.delete(tags).where(eq(tags.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Tag introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
