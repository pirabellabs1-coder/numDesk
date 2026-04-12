import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { teams, teamMembers } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    const teamList = await db.select().from(teams).orderBy(desc(teams.createdAt));
    const enriched = await Promise.all(teamList.map(async (t) => {
      const members = await db.select().from(teamMembers).where(eq(teamMembers.teamId, t.id));
      return { ...t, memberCount: members.length };
    }));
    return apiSuccess(enriched);
  } catch (error) { return handleApiError(error); }
}
