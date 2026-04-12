import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { users, workspaces, conversations, agents } from "@vocalia/db";
import { count, sum } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();

    const [memberCount] = await db.select({ total: count() }).from(users);
    const [workspaceCount] = await db.select({ total: count() }).from(workspaces);
    const [convStats] = await db.select({
      totalCalls: count(),
      totalMinutes: sum(conversations.durationSeconds),
    }).from(conversations);
    const [agentCount] = await db.select({ total: count() }).from(agents);

    const totalMinutes = Math.round(Number(convStats?.totalMinutes ?? 0) / 60);

    return apiSuccess({
      members: Number(memberCount?.total ?? 0),
      workspaces: Number(workspaceCount?.total ?? 0),
      minutesConsumed: totalMinutes,
      totalCalls: Number(convStats?.totalCalls ?? 0),
      agents: Number(agentCount?.total ?? 0),
      mrr: 0, // Will be calculated from Stripe when integrated
    });
  } catch (error) {
    return handleApiError(error);
  }
}
