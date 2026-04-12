import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { alerts } from "@vocalia/db";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(alerts).orderBy(desc(alerts.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req: NextRequest) {
  try { await withAuth();
    const { id, isAcknowledged } = await req.json();
    const db = getDb();
    const [updated] = await db.update(alerts).set({ isAcknowledged }).where(eq(alerts.id, id)).returning();
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}
