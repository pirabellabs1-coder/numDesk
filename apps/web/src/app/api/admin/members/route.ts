import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { users, workspaces, agents, conversations, billingCycles } from "@vocalia/db";
import { eq, desc, count, sum, max, inArray } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const memberList = await db.select().from(users).orderBy(desc(users.createdAt));

    // Enrich with workspace count + aggregated stats
    const enriched = await Promise.all(memberList.map(async (member) => {
      const ws = await db.select().from(workspaces).where(eq(workspaces.userId, member.id));
      const wsIds = ws.map((w) => w.id);

      // Default stats when no workspaces
      let totalMinutesUsed = 0;
      let totalSpentCents = 0;
      let totalConversations = 0;
      let totalAgents = 0;
      let lastActivity: string | null = null;

      if (wsIds.length > 0) {
        // Sum minutesUsed from all workspaces
        totalMinutesUsed = ws.reduce((acc, w) => acc + (w.minutesUsed ?? 0), 0);

        // Sum amountTotalCents from billing cycles
        const [billingAgg] = await db
          .select({ total: sum(billingCycles.amountTotalCents) })
          .from(billingCycles)
          .where(inArray(billingCycles.workspaceId, wsIds));
        totalSpentCents = Number(billingAgg?.total ?? 0);

        // Count conversations
        const [convAgg] = await db
          .select({ total: count(), lastStartedAt: max(conversations.startedAt) })
          .from(conversations)
          .where(inArray(conversations.workspaceId, wsIds));
        totalConversations = Number(convAgg?.total ?? 0);
        lastActivity = convAgg?.lastStartedAt?.toISOString() ?? null;

        // Count agents
        const [agentAgg] = await db
          .select({ total: count() })
          .from(agents)
          .where(inArray(agents.workspaceId, wsIds));
        totalAgents = Number(agentAgg?.total ?? 0);
      }

      // Determine status: active if any workspace has minutes used or recent conversations
      const status = totalMinutesUsed > 0 || totalConversations > 0 ? "active" : "inactive";

      return {
        ...member,
        workspaceCount: ws.length,
        workspaces: ws,
        totalMinutesUsed,
        totalSpentCents,
        totalConversations,
        totalAgents,
        lastActivity: lastActivity ?? member.createdAt?.toISOString() ?? null,
        status,
      };
    }));

    return apiSuccess(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}
