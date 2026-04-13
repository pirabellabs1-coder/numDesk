import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations } from "@vocalia/db";
import { sql, isNotNull } from "drizzle-orm";

// Keywords extracted from conversation tags — global platform view
export async function GET() {
  try {
    await withAuth();
    const db = getDb();

    // Use SQL unnest to expand the tags array, then count occurrences per tag.
    // Returns the top 100 keywords sorted by mention count descending.
    const rows = await db
      .select({
        word: sql<string>`unnest(${conversations.tags})`.as("word"),
        count: sql<number>`count(*)`.mapWith(Number).as("cnt"),
      })
      .from(conversations)
      .where(isNotNull(conversations.tags))
      .groupBy(sql`unnest(${conversations.tags})`)
      .orderBy(sql`count(*) DESC`)
      .limit(100);

    return apiSuccess(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
