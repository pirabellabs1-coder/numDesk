import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { sipTrunks } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [deleted] = await db.delete(sipTrunks).where(eq(sipTrunks.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Trunk introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
