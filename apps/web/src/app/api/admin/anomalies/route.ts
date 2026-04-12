import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { anomalies } from "@vocalia/db";
import { desc } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(anomalies).orderBy(desc(anomalies.detectedAt)));
  } catch (error) { return handleApiError(error); }
}
