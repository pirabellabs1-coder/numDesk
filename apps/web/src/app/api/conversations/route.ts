import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations } from "@vocalia/db";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    const status = req.nextUrl.searchParams.get("status");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    let query = db.select().from(conversations).where(eq(conversations.workspaceId, workspaceId)).orderBy(desc(conversations.createdAt)).limit(limit);
    if (status) {
      query = db.select().from(conversations).where(and(eq(conversations.workspaceId, workspaceId), eq(conversations.status, status as any))).orderBy(desc(conversations.createdAt)).limit(limit);
    }
    const results = await query;
    return apiSuccess(results);
  } catch (error) {
    return handleApiError(error);
  }
}
