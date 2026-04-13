import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { integrations } from "@vocalia/db";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const rows = await db.select().from(integrations);
    return apiSuccess(rows);
  } catch (error) {
    return handleApiError(error);
  }
}
