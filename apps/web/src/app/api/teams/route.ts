import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { teams, teamMembers } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { createTeamSchema } from "@vocalia/shared";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    const teamList = await db.select().from(teams).where(eq(teams.workspaceId, workspaceId));
    const result = await Promise.all(teamList.map(async (team) => {
      const members = await db.select().from(teamMembers).where(eq(teamMembers.teamId, team.id));
      return { ...team, members };
    }));
    return apiSuccess(result);
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = await validateBody(req, createTeamSchema); const db = getDb();
    const [created] = await db.insert(teams).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
