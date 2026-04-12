import { getDb } from "@vocalia/db";
import { workspaces } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { PLANS, type PlanSlug } from "@vocalia/shared";

export async function checkCredits(workspaceId: string) {
  const db = getDb();
  const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));

  if (!ws) {
    return { allowed: false, minutesRemaining: 0, planSlug: "trial" as PlanSlug, plan: PLANS.trial };
  }

  const minutesRemaining = Math.max(0, ws.minutesIncluded - ws.minutesUsed);
  const planSlug = (ws.planSlug as PlanSlug) || "trial";
  const plan = PLANS[planSlug] || PLANS.trial;

  return {
    allowed: minutesRemaining > 0,
    minutesRemaining,
    minutesUsed: ws.minutesUsed,
    minutesIncluded: ws.minutesIncluded,
    planSlug,
    plan,
  };
}
