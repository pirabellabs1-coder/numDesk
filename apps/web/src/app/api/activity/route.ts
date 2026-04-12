import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { activityLog } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(activityLog).where(eq(activityLog.workspaceId, workspaceId)).orderBy(desc(activityLog.createdAt)).limit(limit));
  } catch (error) { return handleApiError(error); }
}
