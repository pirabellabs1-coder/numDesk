import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents, conversations } from "@vocalia/db";
import { count, avg, gte, sql } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();

    const agentList = await db.select().from(agents);

    // Get per-agent conversation stats in a single query
    const agentStats = await db
      .select({
        agentId: conversations.agentId,
        totalCalls: count(),
        avgDuration: avg(conversations.durationSeconds),
        completedCalls: count(
          sql`CASE WHEN ${conversations.status} IN ('success', 'ended') THEN 1 END`
        ),
        positiveSentiment: count(
          sql`CASE WHEN ${conversations.sentiment} = 'positive' THEN 1 END`
        ),
      })
      .from(conversations)
      .groupBy(conversations.agentId);

    // Get per-agent call counts for this week vs last week for trend calculation
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const weeklyStats = await db
      .select({
        agentId: conversations.agentId,
        thisWeek: count(
          sql`CASE WHEN ${conversations.startedAt} >= ${startOfThisWeek} THEN 1 END`
        ),
        lastWeek: count(
          sql`CASE WHEN ${conversations.startedAt} >= ${startOfLastWeek} AND ${conversations.startedAt} < ${startOfThisWeek} THEN 1 END`
        ),
      })
      .from(conversations)
      .where(gte(conversations.startedAt, startOfLastWeek))
      .groupBy(conversations.agentId);

    // Build lookup maps
    const statsMap = new Map(agentStats.map((s) => [s.agentId, s]));
    const weeklyMap = new Map(weeklyStats.map((w) => [w.agentId, w]));

    const scores = agentList.map((a) => {
      const s = statsMap.get(a.id);
      const w = weeklyMap.get(a.id);

      const totalCalls = Number(s?.totalCalls ?? 0);
      const completedCalls = Number(s?.completedCalls ?? 0);
      const positiveSentiment = Number(s?.positiveSentiment ?? 0);
      const avgDuration = Math.round(Number(s?.avgDuration ?? 0));

      const completionRate = totalCalls > 0
        ? Math.round((completedCalls / totalCalls) * 100)
        : 0;
      const sentimentPositive = totalCalls > 0
        ? Math.round((positiveSentiment / totalCalls) * 100)
        : 0;

      // Trend: % change between this week and last week
      const thisWeek = Number(w?.thisWeek ?? 0);
      const lastWeek = Number(w?.lastWeek ?? 0);
      const trend = lastWeek > 0
        ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100)
        : thisWeek > 0 ? 100 : 0;

      // Score: weighted combination of completion rate, sentiment, and volume
      const score = totalCalls > 0
        ? Math.min(100, Math.round(completionRate * 0.5 + sentimentPositive * 0.3 + Math.min(20, totalCalls * 0.2)))
        : 0;

      return {
        agentId: a.id,
        name: a.name,
        workspaceId: a.workspaceId,
        score,
        completionRate,
        sentimentPositive,
        avgDuration,
        totalCalls,
        trend,
      };
    });

    return apiSuccess(scores);
  } catch (error) {
    return handleApiError(error);
  }
}
