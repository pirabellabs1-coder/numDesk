import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { campaigns } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { updateCampaignSchema } from "@vocalia/shared";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [item] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    if (!item) return apiError("NOT_FOUND", "Campagne introuvable", 404);
    return apiSuccess(item);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params;
    const body = await validateBody(req, updateCampaignSchema); const db = getDb();
    const [updated] = await db.update(campaigns).set(body).where(eq(campaigns.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Campagne introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [deleted] = await db.delete(campaigns).where(eq(campaigns.id, id)).returning();
    if (!deleted) return apiError("NOT_FOUND", "Campagne introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) { return handleApiError(error); }
}
