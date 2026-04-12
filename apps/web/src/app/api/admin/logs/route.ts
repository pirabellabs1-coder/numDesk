import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { activityLog } from "@vocalia/db";
import { desc } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    const logs = await db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(100);
    return apiSuccess(logs);
  } catch (error) { return handleApiError(error); }
}
