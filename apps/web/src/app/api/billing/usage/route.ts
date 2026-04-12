import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaces } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess({});
    const db = getDb();
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!ws) return apiSuccess({});
    return apiSuccess({
      minutesUsed: ws.minutesUsed,
      minutesIncluded: ws.minutesIncluded,
      minutesRemaining: Math.max(0, ws.minutesIncluded - ws.minutesUsed),
      daysRemaining: ws.cycleDurationDays,
    });
  } catch (error) { return handleApiError(error); }
}
