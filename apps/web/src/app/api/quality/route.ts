import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents, conversations } from "@vocalia/db";
import { eq, and, sql, count, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();

    const agentList = await db.select().from(agents).where(eq(agents.workspaceId, workspaceId));
    if (agentList.length === 0) return apiSuccess([]);

    // Get per-agent conversation stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const scores = await Promise.all(
      agentList.map(async (agent) => {
        // Total conversations for this agent
        const [totalRow] = await db
          .select({ total: count() })
          .from(conversations)
          .where(eq(conversations.agentId, agent.id));
        const totalConvs = Number(totalRow?.total ?? 0);

        // Successful (ended) conversations
        const [endedRow] = await db
          .select({ total: count() })
          .from(conversations)
          .where(and(eq(conversations.agentId, agent.id), eq(conversations.status, "ended")));
        const endedConvs = Number(endedRow?.total ?? 0);

        // Positive sentiment conversations
        const [positiveRow] = await db
          .select({ total: count() })
          .from(conversations)
          .where(and(eq(conversations.agentId, agent.id), eq(conversations.sentiment, "positive")));
        const positiveConvs = Number(positiveRow?.total ?? 0);

        // Average duration from real conversations
        const [avgRow] = await db
          .select({ avg: sql<number>`coalesce(avg(${conversations.durationSeconds}), 0)`.mapWith(Number) })
          .from(conversations)
          .where(and(eq(conversations.agentId, agent.id), sql`${conversations.durationSeconds} > 0`));
        const avgDuration = Math.round(Number(avgRow?.avg ?? 0));

        // Recent week conversations count
        const [recentRow] = await db
          .select({ total: count() })
          .from(conversations)
          .where(and(eq(conversations.agentId, agent.id), gte(conversations.createdAt, sevenDaysAgo)));
        const recentConvs = Number(recentRow?.total ?? 0);

        // Previous week conversations count (for trend)
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const [prevRow] = await db
          .select({ total: count() })
          .from(conversations)
          .where(
            and(
              eq(conversations.agentId, agent.id),
              gte(conversations.createdAt, fourteenDaysAgo),
              sql`${conversations.createdAt} < ${sevenDaysAgo}`
            )
          );
        const prevConvs = Number(prevRow?.total ?? 0);

        // Calculate real metrics
        const completionRate = totalConvs > 0 ? Math.round((endedConvs / totalConvs) * 100) : 0;
        const sentimentPositive = totalConvs > 0 ? Math.round((positiveConvs / totalConvs) * 100) : 0;
        const trend = prevConvs > 0 ? Math.round(((recentConvs - prevConvs) / prevConvs) * 100) : 0;

        // Overall quality score: weighted average of completion rate + sentiment
        const score = totalConvs > 0
          ? Math.min(100, Math.round(completionRate * 0.5 + sentimentPositive * 0.3 + Math.min(100, avgDuration > 0 ? 80 : 0) * 0.2))
          : 0;

        // Build weekly history from daily counts (last 7 days)
        const history: number[] = [];
        for (let d = 6; d >= 0; d--) {
          const dayStart = new Date();
          dayStart.setDate(dayStart.getDate() - d);
          dayStart.setHours(0, 0, 0, 0);
          const dayEnd = new Date(dayStart);
          dayEnd.setDate(dayEnd.getDate() + 1);

          const [dayRow] = await db
            .select({ total: count() })
            .from(conversations)
            .where(
              and(
                eq(conversations.agentId, agent.id),
                gte(conversations.createdAt, dayStart),
                sql`${conversations.createdAt} < ${dayEnd}`
              )
            );
          history.push(Number(dayRow?.total ?? 0));
        }

        return {
          agentId: agent.id,
          name: agent.name,
          score,
          completionRate,
          sentimentPositive,
          avgDuration,
          responseTime: 0,
          trend,
          totalCalls: totalConvs,
          history,
        };
      })
    );

    return apiSuccess(scores);
  } catch (error) {
    return handleApiError(error);
  }
}
