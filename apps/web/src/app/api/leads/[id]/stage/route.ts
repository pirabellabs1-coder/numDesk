import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { leads } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { updateLeadStageSchema } from "@vocalia/shared";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params;
    const { stage } = await validateBody(req, updateLeadStageSchema); const db = getDb();
    const [updated] = await db.update(leads).set({ stage, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Lead introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}
