import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaces, users, subscriptions } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { createWorkspaceSchema, PLANS } from "@vocalia/shared";
import type { PlanSlug } from "@vocalia/shared";

// Helper to get or create the user profile ID
async function getUserProfileId(authUser: any) {
  const db = getDb();
  let [profile] = await db.select().from(users).where(eq(users.authId, authUser.id));
  if (!profile) {
    [profile] = await db.insert(users).values({
      authId: authUser.id,
      email: authUser.email ?? "",
      firstName: authUser.user_metadata?.first_name ?? null,
      lastName: authUser.user_metadata?.last_name ?? null,
      agencyName: authUser.user_metadata?.agency_name ?? null,
      role: "member",
    }).returning();
  }
  return profile!.id;
}

export async function GET() {
  try {
    const { user } = await withAuth();
    const db = getDb();
    const profileId = await getUserProfileId(user);
    const results = await db.select().from(workspaces).where(eq(workspaces.userId, profileId));
    return apiSuccess(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const body = await validateBody(req, createWorkspaceSchema);
    const db = getDb();
    const profileId = await getUserProfileId(user);

    const planSlug = (body.planSlug || "trial") as PlanSlug;
    const plan = PLANS[planSlug] || PLANS.trial;
    const minutesIncluded = body.minutesIncluded ?? plan.minutesIncluded;

    const [created] = await db.insert(workspaces).values({
      name: body.name,
      offerType: body.offerType || "minutes",
      planSlug,
      minutesIncluded,
      minutesOverageLimit: body.minutesOverageLimit,
      overageRateCents: body.overageRateCents ?? plan.pricePerMinuteCents,
      userId: profileId,
      cycleStartDate: new Date().toISOString().split("T")[0],
    }).returning();

    // Create subscription record
    await db.insert(subscriptions).values({
      workspaceId: created!.id,
      planSlug,
      status: planSlug === "trial" ? "trialing" : "active",
      currentPeriodStart: new Date(),
      trialEndsAt: planSlug === "trial" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
    });

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
