import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@vocalia/db";
import { workspaces, subscriptions } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { getProfileId } from "@/lib/get-profile-id";
import { PLANS, type PlanSlug } from "@vocalia/shared";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const db = getDb();
    const profileId = await getProfileId(user);

    const { workspaceId, planSlug } = await req.json();

    if (!workspaceId || !planSlug) {
      return apiError("VALIDATION_ERROR", "workspaceId et planSlug requis", 400);
    }

    if (!["starter", "pro", "enterprise"].includes(planSlug)) {
      return apiError("VALIDATION_ERROR", "Plan invalide", 400);
    }

    // Verify ownership
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!ws || ws.userId !== profileId) {
      return apiError("NOT_FOUND", "Workspace introuvable", 404);
    }

    const plan = PLANS[planSlug as PlanSlug];

    // Update workspace plan
    await db.update(workspaces)
      .set({ planSlug })
      .where(eq(workspaces.id, workspaceId));

    // Upsert subscription
    const [existingSub] = await db.select().from(subscriptions).where(eq(subscriptions.workspaceId, workspaceId));

    if (existingSub) {
      await db.update(subscriptions)
        .set({
          planSlug,
          status: "active",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.workspaceId, workspaceId));
    } else {
      await db.insert(subscriptions).values({
        workspaceId,
        planSlug,
        status: "active",
        currentPeriodStart: new Date(),
      });
    }

    // Send notification
    try {
      const { notifyPlanUpgrade } = await import("@/lib/notification-service");
      await notifyPlanUpgrade(ws.userId, plan.name);
    } catch {}

    return apiSuccess({
      planSlug,
      planName: plan.name,
      pricePerMinuteCents: plan.pricePerMinuteCents,
      maxAgents: plan.maxAgents,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
