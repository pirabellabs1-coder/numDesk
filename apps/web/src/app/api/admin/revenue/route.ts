import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { billingCycles, workspaces } from "@vocalia/db";
import { count, sum, desc } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    const [wsCount] = await db.select({ total: count() }).from(workspaces);
    const cycles = await db.select().from(billingCycles).orderBy(desc(billingCycles.cycleStart)).limit(50);

    // Calculate revenue from billing cycles
    const totalRevenue = cycles.reduce((a, c) => a + (c.amountTotalCents ?? 0), 0);
    const paidCycles = cycles.filter((c) => c.status === "paid");
    const mrr = paidCycles.length > 0 ? Math.round(paidCycles.reduce((a, c) => a + (c.amountTotalCents ?? 0), 0) / paidCycles.length) : 0;

    return apiSuccess({
      mrr: Math.round(mrr / 100),
      totalRevenue: Math.round(totalRevenue / 100),
      activeSubscriptions: Number(wsCount?.total ?? 0),
      cycles: cycles.slice(0, 12),
    });
  } catch (error) { return handleApiError(error); }
}
