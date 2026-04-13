import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import {
  users,
  workspaces,
  agents,
  conversations,
  billingCycles,
  creditPurchases,
  subscriptions,
} from "@vocalia/db";
import { eq, desc, count, sum, max, inArray, and } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const memberList = await db.select().from(users).orderBy(desc(users.createdAt));

    const enriched = await Promise.all(
      memberList.map(async (member) => {
        const ws = await db
          .select()
          .from(workspaces)
          .where(eq(workspaces.userId, member.id));
        const wsIds = ws.map((w) => w.id);

        // Default stats when no workspaces
        let totalMinutesUsed = 0;
        let totalMinutesIncluded = 0;
        let totalSpentCents = 0;
        let totalConversations = 0;
        let totalAgents = 0;
        let publishedAgents = 0;
        let lastActivity: string | null = null;
        let planSlug: string | null = null;
        let subscriptionStatus: string | null = null;

        // Per-workspace enrichment data
        let workspacesEnriched: Array<{
          id: string;
          name: string;
          planSlug: string;
          minutesUsed: number;
          minutesIncluded: number;
          agentCount: number;
          subscriptionStatus: string | null;
        }> = [];

        if (wsIds.length > 0) {
          // Sum minutesUsed and minutesIncluded from all workspaces
          totalMinutesUsed = ws.reduce((acc, w) => acc + (w.minutesUsed ?? 0), 0);
          totalMinutesIncluded = ws.reduce((acc, w) => acc + (w.minutesIncluded ?? 0), 0);

          // Fetch all subscriptions for this member's workspaces
          const wsSubs = await db
            .select()
            .from(subscriptions)
            .where(inArray(subscriptions.workspaceId, wsIds));
          const subsByWsId = new Map(wsSubs.map((s) => [s.workspaceId, s]));

          // Primary workspace subscription (first workspace)
          const primarySub = subsByWsId.get(wsIds[0]!);
          planSlug = primarySub?.planSlug ?? ws[0]?.planSlug ?? null;
          subscriptionStatus = primarySub?.status ?? null;

          // Sum amountTotalCents from billing cycles
          const [billingAgg] = await db
            .select({ total: sum(billingCycles.amountTotalCents) })
            .from(billingCycles)
            .where(inArray(billingCycles.workspaceId, wsIds));
          const billingTotal = Number(billingAgg?.total ?? 0);

          // Sum amountCents from credit purchases
          const [creditAgg] = await db
            .select({ total: sum(creditPurchases.amountCents) })
            .from(creditPurchases)
            .where(inArray(creditPurchases.workspaceId, wsIds));
          const creditTotal = Number(creditAgg?.total ?? 0);

          totalSpentCents = billingTotal + creditTotal;

          // Count conversations + last conversation date
          const [convAgg] = await db
            .select({
              total: count(),
              lastStartedAt: max(conversations.startedAt),
            })
            .from(conversations)
            .where(inArray(conversations.workspaceId, wsIds));
          totalConversations = Number(convAgg?.total ?? 0);
          const lastConvDate = convAgg?.lastStartedAt?.toISOString() ?? null;

          // Last credit purchase date
          const [creditDateAgg] = await db
            .select({ lastCreatedAt: max(creditPurchases.createdAt) })
            .from(creditPurchases)
            .where(inArray(creditPurchases.workspaceId, wsIds));
          const lastCreditDate = creditDateAgg?.lastCreatedAt?.toISOString() ?? null;

          // lastActivity = most recent of conversation startedAt or creditPurchase createdAt
          if (lastConvDate && lastCreditDate) {
            lastActivity = lastConvDate > lastCreditDate ? lastConvDate : lastCreditDate;
          } else {
            lastActivity = lastConvDate ?? lastCreditDate;
          }

          // Count all agents + published agents
          const [agentAgg] = await db
            .select({ total: count() })
            .from(agents)
            .where(inArray(agents.workspaceId, wsIds));
          totalAgents = Number(agentAgg?.total ?? 0);

          const [publishedAgg] = await db
            .select({ total: count() })
            .from(agents)
            .where(
              and(
                inArray(agents.workspaceId, wsIds),
                eq(agents.isPublished, true)
              )
            );
          publishedAgents = Number(publishedAgg?.total ?? 0);

          // Build per-workspace enriched data
          // Fetch agent counts per workspace in one query
          const agentCountsByWs = await db
            .select({
              workspaceId: agents.workspaceId,
              total: count(),
            })
            .from(agents)
            .where(inArray(agents.workspaceId, wsIds))
            .groupBy(agents.workspaceId);
          const agentCountMap = new Map(
            agentCountsByWs.map((r) => [r.workspaceId, Number(r.total)])
          );

          workspacesEnriched = ws.map((w) => {
            const sub = subsByWsId.get(w.id);
            return {
              id: w.id,
              name: w.name,
              planSlug: sub?.planSlug ?? w.planSlug,
              minutesUsed: w.minutesUsed ?? 0,
              minutesIncluded: w.minutesIncluded ?? 0,
              agentCount: agentCountMap.get(w.id) ?? 0,
              subscriptionStatus: sub?.status ?? null,
            };
          });
        }

        // Determine status: active if any subscription is active or trialing
        const hasActiveSub = workspacesEnriched.some(
          (w) => w.subscriptionStatus === "active" || w.subscriptionStatus === "trialing"
        );
        const status = hasActiveSub ? "active" : "inactive";

        return {
          ...member,
          planSlug,
          subscriptionStatus,
          workspaceCount: ws.length,
          totalMinutesUsed,
          totalMinutesIncluded,
          totalSpentCents,
          totalConversations,
          totalAgents,
          publishedAgents,
          lastActivity: lastActivity ?? member.createdAt?.toISOString() ?? null,
          status,
          workspaces: workspacesEnriched,
        };
      })
    );

    return apiSuccess(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}
