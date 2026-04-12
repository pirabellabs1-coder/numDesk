import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@vocalia/db";
import { workspaces, subscriptions, creditPurchases } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { getProfileId } from "@/lib/get-profile-id";
import { PLANS, type PlanSlug } from "@vocalia/shared";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const db = getDb();
    const profileId = await getProfileId(user);

    const workspaceId = req.nextUrl.searchParams.get("workspace_id");

    // Get workspace
    const wsQuery = workspaceId
      ? db.select().from(workspaces).where(eq(workspaces.id, workspaceId))
      : db.select().from(workspaces).where(eq(workspaces.userId, profileId));

    const [ws] = await wsQuery;
    if (!ws) return apiSuccess({ plan: null });

    const planSlug = (ws.planSlug as PlanSlug) || "trial";
    const plan = PLANS[planSlug] || PLANS.trial;

    // Get subscription
    const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.workspaceId, ws.id));

    // Get recent purchases
    const purchases = await db
      .select()
      .from(creditPurchases)
      .where(eq(creditPurchases.workspaceId, ws.id))
      .orderBy(desc(creditPurchases.createdAt))
      .limit(10);

    const minutesRemaining = Math.max(0, ws.minutesIncluded - ws.minutesUsed);
    const usagePercent = ws.minutesIncluded > 0
      ? Math.round((ws.minutesUsed / ws.minutesIncluded) * 100)
      : 0;

    return apiSuccess({
      workspace: {
        id: ws.id,
        name: ws.name,
        planSlug,
        minutesIncluded: ws.minutesIncluded,
        minutesUsed: ws.minutesUsed,
        minutesRemaining,
        usagePercent,
      },
      plan: {
        slug: plan.slug,
        name: plan.name,
        pricePerMinuteCents: plan.pricePerMinuteCents,
        maxAgents: plan.maxAgents,
        restricted: plan.restricted,
        features: plan.features,
      },
      subscription: sub || null,
      purchases,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
