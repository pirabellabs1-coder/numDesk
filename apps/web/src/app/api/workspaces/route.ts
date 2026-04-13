import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaces, users, subscriptions, workspaceMembers } from "@vocalia/db";
import { eq, or } from "drizzle-orm";
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

    // Get owned workspaces
    const owned = await db.select().from(workspaces).where(eq(workspaces.userId, profileId));

    // Get workspaces where user is a member (invited)
    const memberRows = await db.select({ workspaceId: workspaceMembers.workspaceId }).from(workspaceMembers).where(eq(workspaceMembers.userId, profileId));
    const memberWorkspaceIds = memberRows.map((r) => r.workspaceId);

    let shared: typeof owned = [];
    if (memberWorkspaceIds.length > 0) {
      shared = await db.select().from(workspaces).where(
        or(...memberWorkspaceIds.map((id) => eq(workspaces.id, id)))
      );
    }

    // Merge and deduplicate, tagging owned vs shared
    const ownedIds = new Set(owned.map((w) => w.id));
    const merged = owned.map((w) => ({ ...w, isOwned: true }));
    for (const w of shared) {
      if (!ownedIds.has(w.id)) merged.push({ ...w, isOwned: false });
    }

    return apiSuccess(merged);
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
