import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaces } from "@vocalia/db";
import { eq, and } from "drizzle-orm";
import { updateWorkspaceSchema } from "@vocalia/shared";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await withAuth();
    const { id } = await params;
    const db = getDb();
    const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, id), eq(workspaces.userId, user.id)));
    if (!workspace) return apiError("NOT_FOUND", "Workspace introuvable", 404);
    return apiSuccess(workspace);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await withAuth();
    const { id } = await params;
    const body = await validateBody(req, updateWorkspaceSchema);
    const db = getDb();
    const [updated] = await db.update(workspaces).set(body).where(and(eq(workspaces.id, id), eq(workspaces.userId, user.id))).returning();
    if (!updated) return apiError("NOT_FOUND", "Workspace introuvable", 404);
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { user } = await withAuth();
    const { id } = await params;
    const db = getDb();
    const [deleted] = await db.delete(workspaces).where(and(eq(workspaces.id, id), eq(workspaces.userId, user.id))).returning();
    if (!deleted) return apiError("NOT_FOUND", "Workspace introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
