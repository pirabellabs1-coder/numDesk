import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { knowledgeBases } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();
    const [kb] = await db.select().from(knowledgeBases).where(eq(knowledgeBases.id, id));
    if (!kb) return apiError("NOT_FOUND", "Base introuvable", 404);
    return apiSuccess(kb);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const body = await req.json();
    const db = getDb();

    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.content !== undefined) updates.content = body.content;
    if (body.files !== undefined) updates.files = body.files;

    if (Object.keys(updates).length === 0) {
      return apiError("VALIDATION_ERROR", "Rien à mettre à jour", 422);
    }

    const [updated] = await db.update(knowledgeBases).set(updates).where(eq(knowledgeBases.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Base introuvable", 404);
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
    const [deleted] = await db.delete(knowledgeBases).where(eq(knowledgeBases.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Base introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
