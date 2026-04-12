import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { leads } from "@vocalia/db";
import { desc } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(leads).orderBy(desc(leads.createdAt)));
  } catch (error) { return handleApiError(error); }
}
