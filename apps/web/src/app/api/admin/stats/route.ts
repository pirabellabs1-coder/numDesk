import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { users, workspaces, conversations, agents, creditPurchases, billingCycles } from "@vocalia/db";
import { count, sum, eq, gte, sql } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();

    const [memberCount] = await db.select({ total: count() }).from(users);
    const [workspaceCount] = await db.select({ total: count() }).from(workspaces);
    const [convStats] = await db.select({
      totalCalls: count(),
      totalMinutes: sum(conversations.durationSeconds),
      sentimentPositive: count(
        sql`CASE WHEN ${conversations.sentiment} = 'positive' THEN 1 END`
      ),
      sentimentNeutral: count(
        sql`CASE WHEN ${conversations.sentiment} = 'neutral' THEN 1 END`
      ),
      sentimentNegative: count(
        sql`CASE WHEN ${conversations.sentiment} = 'negative' THEN 1 END`
      ),
    }).from(conversations);
    const [agentCount] = await db.select({ total: count() }).from(agents);
    const [publishedAgentCount] = await db
      .select({ total: count() })
      .from(agents)
      .where(eq(agents.isPublished, true));

    // MRR: sum of credit purchases from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const [recentCredits] = await db
      .select({ total: sum(creditPurchases.amountCents) })
      .from(creditPurchases)
      .where(gte(creditPurchases.createdAt, thirtyDaysAgo));

    // Total revenue: all credit purchases + all billing cycles
    const [allCredits] = await db
      .select({ total: sum(creditPurchases.amountCents) })
      .from(creditPurchases);
    const [allBilling] = await db
      .select({ total: sum(billingCycles.amountTotalCents) })
      .from(billingCycles);

    // Hourly distribution for heatmap (day_of_week 0=Sun..6=Sat, hour 0-23, count)
    const hourlyRows = await db
      .select({
        dow: sql<number>`extract(dow from ${conversations.createdAt})`.mapWith(Number),
        hour: sql<number>`extract(hour from ${conversations.createdAt})`.mapWith(Number),
        total: count(),
      })
      .from(conversations)
      .groupBy(
        sql`extract(dow from ${conversations.createdAt})`,
        sql`extract(hour from ${conversations.createdAt})`
      );

    // Build 7x24 matrix (Mon=0..Sun=6 in our UI)
    // PostgreSQL dow: 0=Sunday, 1=Monday ... 6=Saturday → remap to Mon=0..Sun=6
    const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    let maxHeatVal = 1;
    for (const r of hourlyRows) {
      const uiDay = r.dow === 0 ? 6 : r.dow - 1; // Sun→6, Mon→0, Tue→1...
      heatmap[uiDay]![r.hour] = Number(r.total);
      if (Number(r.total) > maxHeatVal) maxHeatVal = Number(r.total);
    }
    // Normalize to 0-100 scale
    const heatmapNorm = heatmap.map((row) =>
      row.map((v) => Math.round((v / maxHeatVal) * 100))
    );

    const totalMinutes = Math.round(Number(convStats?.totalMinutes ?? 0) / 60);
    const mrr = Math.round(Number(recentCredits?.total ?? 0) / 100);
    const totalRevenue = Math.round(
      (Number(allCredits?.total ?? 0) + Number(allBilling?.total ?? 0)) / 100
    );

    return apiSuccess({
      members: Number(memberCount?.total ?? 0),
      workspaces: Number(workspaceCount?.total ?? 0),
      minutesConsumed: totalMinutes,
      totalCalls: Number(convStats?.totalCalls ?? 0),
      agents: Number(agentCount?.total ?? 0),
      publishedAgents: Number(publishedAgentCount?.total ?? 0),
      mrr,
      totalRevenue,
      sentimentPositive: Number(convStats?.sentimentPositive ?? 0),
      sentimentNeutral: Number(convStats?.sentimentNeutral ?? 0),
      sentimentNegative: Number(convStats?.sentimentNegative ?? 0),
      heatmap: heatmapNorm,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
