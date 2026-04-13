import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import {
  workspaces,
  users,
  agents,
  conversations,
  billingCycles,
  creditPurchases,
  subscriptions,
} from "@vocalia/db";
import { eq, count, desc, sum, max, and } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const wsList = await db.select().from(workspaces).orderBy(desc(workspaces.createdAt));

    const enriched = await Promise.all(
      wsList.map(async (ws) => {
        // Owner info
        const [owner] = await db
          .select()
          .from(users)
          .where(eq(users.id, ws.userId));

        // Subscription info
        const [sub] = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.workspaceId, ws.id));

        // Agent counts (total + published)
        const [agentCountResult] = await db
          .select({ total: count() })
          .from(agents)
          .where(eq(agents.workspaceId, ws.id));

        const [publishedAgentResult] = await db
          .select({ total: count() })
          .from(agents)
          .where(
            and(
              eq(agents.workspaceId, ws.id),
              eq(agents.isPublished, true)
            )
          );

        // Conversation count + last call date
        const [convResult] = await db
          .select({
            total: count(),
            lastStartedAt: max(conversations.startedAt),
          })
          .from(conversations)
          .where(eq(conversations.workspaceId, ws.id));

        // Sum billing cycles amountTotalCents
        const [billingAgg] = await db
          .select({ total: sum(billingCycles.amountTotalCents) })
          .from(billingCycles)
          .where(eq(billingCycles.workspaceId, ws.id));
        const billingTotal = Number(billingAgg?.total ?? 0);

        // Sum credit purchases amountCents
        const [creditAgg] = await db
          .select({ total: sum(creditPurchases.amountCents) })
          .from(creditPurchases)
          .where(eq(creditPurchases.workspaceId, ws.id));
        const creditTotal = Number(creditAgg?.total ?? 0);

        const minutesUsed = ws.minutesUsed ?? 0;
        const minutesIncluded = ws.minutesIncluded ?? 0;

        return {
          ...ws,
          ownerName: owner
            ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim() || owner.email
            : "Inconnu",
          ownerEmail: owner?.email ?? null,
          planSlug: sub?.planSlug ?? ws.planSlug,
          subscriptionStatus: sub?.status ?? null,
          minutesUsed,
          minutesIncluded,
          minutesRemaining: Math.max(0, minutesIncluded - minutesUsed),
          agentCount: Number(agentCountResult?.total ?? 0),
          publishedAgentCount: Number(publishedAgentResult?.total ?? 0),
          conversationCount: Number(convResult?.total ?? 0),
          totalSpentCents: billingTotal + creditTotal,
          lastCallDate: convResult?.lastStartedAt?.toISOString() ?? null,
        };
      })
    );

    return apiSuccess(enriched);
  } catch (error) {
    return handleApiError(error);
  }
}
