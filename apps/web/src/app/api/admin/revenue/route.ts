import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { billingCycles, workspaces, creditPurchases, subscriptions } from "@vocalia/db";
import { count, sum, desc, eq, gte, or } from "drizzle-orm";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();

    // Billing cycles (keep existing list)
    const cycles = await db
      .select()
      .from(billingCycles)
      .orderBy(desc(billingCycles.cycleStart))
      .limit(50);

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

    // Active subscriptions: status = 'active' or 'trialing'
    const [activeSubCount] = await db
      .select({ total: count() })
      .from(subscriptions)
      .where(
        or(
          eq(subscriptions.status, "active"),
          eq(subscriptions.status, "trialing")
        )
      );

    // Recent credit purchases with workspace name
    const recentPurchases = await db
      .select({
        id: creditPurchases.id,
        workspaceId: creditPurchases.workspaceId,
        workspaceName: workspaces.name,
        minutesPurchased: creditPurchases.minutesPurchased,
        amountCents: creditPurchases.amountCents,
        createdAt: creditPurchases.createdAt,
      })
      .from(creditPurchases)
      .leftJoin(workspaces, eq(creditPurchases.workspaceId, workspaces.id))
      .orderBy(desc(creditPurchases.createdAt))
      .limit(20);

    const mrr = Math.round(Number(recentCredits?.total ?? 0) / 100);
    const totalRevenue = Math.round(
      (Number(allCredits?.total ?? 0) + Number(allBilling?.total ?? 0)) / 100
    );

    return apiSuccess({
      mrr,
      totalRevenue,
      activeSubscriptions: Number(activeSubCount?.total ?? 0),
      recentPurchases,
      cycles: cycles.slice(0, 12),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
