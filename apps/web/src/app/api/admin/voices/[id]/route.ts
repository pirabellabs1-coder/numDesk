import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { voices } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const body = await req.json();
    const db = getDb();
    const [updated] = await db.update(voices).set(body).where(eq(voices.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Voix introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();
    const [deleted] = await db.delete(voices).where(eq(voices.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Voix introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
