import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { users, workspaces } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const memberList = await db.select().from(users).orderBy(desc(users.createdAt));

    // Enrich with workspace count
    const enriched = await Promise.all(memberList.map(async (member) => {
      const ws = await db.select().from(workspaces).where(eq(workspaces.userId, member.id));
      return { ...member, workspaceCount: ws.length, workspaces: ws };
    }));

    return apiSuccess(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}
