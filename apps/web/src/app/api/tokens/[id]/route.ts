import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { apiTokens } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [deleted] = await db.delete(apiTokens).where(eq(apiTokens.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Token introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
