import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { tags } from "@vocalia/db";

export async function GET() {
  try { await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(tags));
  } catch (error) { return handleApiError(error); }
}
