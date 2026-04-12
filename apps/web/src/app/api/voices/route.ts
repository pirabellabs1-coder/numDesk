import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { voices } from "@vocalia/db";
import { eq, and, desc } from "drizzle-orm";

// Public route — returns all active voices for agent configuration
export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const activeVoices = await db.select().from(voices)
      .where(and(eq(voices.isActive, true)))
      .orderBy(desc(voices.createdAt));

    return apiSuccess(activeVoices);
  } catch (error) {
    return handleApiError(error);
  }
}
