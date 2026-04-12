import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { notes } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { createNoteSchema } from "@vocalia/shared";

export async function GET(req: NextRequest) {
  try { const { user } = await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(notes).where(eq(notes.workspaceId, workspaceId)).orderBy(desc(notes.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { const { user } = await withAuth();
    const body = await validateBody(req, createNoteSchema); const db = getDb();
    const [created] = await db.insert(notes).values({ ...body, author: user.email ?? "Utilisateur" }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
