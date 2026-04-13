import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations } from "@vocalia/db";
import { sql, isNotNull, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();

    const rows = await db
      .select({
        word: sql<string>`unnest(${conversations.tags})`.as("word"),
        count: sql<number>`count(*)`.mapWith(Number).as("cnt"),
      })
      .from(conversations)
      .where(
        sql`${conversations.workspaceId} = ${workspaceId} AND ${conversations.tags} IS NOT NULL`
      )
      .groupBy(sql`unnest(${conversations.tags})`)
      .orderBy(sql`count(*) DESC`)
      .limit(100);

    return apiSuccess(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
