import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { anomalies } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(anomalies).where(eq(anomalies.workspaceId, workspaceId)).orderBy(desc(anomalies.detectedAt)));
  } catch (error) { return handleApiError(error); }
}
