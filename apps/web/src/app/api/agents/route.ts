import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { getProfileId } from "@/lib/get-profile-id";
import { agents, workspaces } from "@vocalia/db";
import { eq, and } from "drizzle-orm";
import { createAgentSchema } from "@vocalia/shared";

export async function GET(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    const profileId = await getProfileId(user);
    const [ws] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, profileId)));
    if (!ws) return apiSuccess([]);
    const results = await db.select().from(agents).where(eq(agents.workspaceId, workspaceId));
    return apiSuccess(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const body = await validateBody(req, createAgentSchema);
    const db = getDb();
    const profileId = await getProfileId(user);
    const [ws] = await db.select().from(workspaces).where(and(eq(workspaces.id, body.workspaceId), eq(workspaces.userId, profileId)));
    if (!ws) return handleApiError(new Error("Workspace introuvable"));
    const [created] = await db.insert(agents).values({
      ...body,
      temperature: String(body.temperature),
      topP: String(body.topP),
    }).returning();
    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
