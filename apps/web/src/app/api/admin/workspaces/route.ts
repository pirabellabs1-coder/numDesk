import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaces, users, agents, conversations } from "@vocalia/db";
import { eq, count, desc } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const wsList = await db.select().from(workspaces).orderBy(desc(workspaces.createdAt));

    const enriched = await Promise.all(wsList.map(async (ws) => {
      const [owner] = await db.select().from(users).where(eq(users.id, ws.userId));
      const [agentCountResult] = await db.select({ total: count() }).from(agents).where(eq(agents.workspaceId, ws.id));
      const [convCountResult] = await db.select({ total: count() }).from(conversations).where(eq(conversations.workspaceId, ws.id));
      return {
        ...ws,
        ownerName: owner ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim() || owner.email : "Inconnu",
        ownerEmail: owner?.email,
        agentCount: Number(agentCountResult?.total ?? 0),
        conversationCount: Number(convCountResult?.total ?? 0),
      };
    }));

    return apiSuccess(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}
