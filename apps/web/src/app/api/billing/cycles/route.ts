import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { billingCycles } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(billingCycles).where(eq(billingCycles.workspaceId, workspaceId)).orderBy(desc(billingCycles.cycleStart)));
  } catch (error) { return handleApiError(error); }
}
