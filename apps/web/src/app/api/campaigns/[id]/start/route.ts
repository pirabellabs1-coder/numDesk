import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { campaigns } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [updated] = await db.update(campaigns).set({ status: "active" }).where(eq(campaigns.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Campagne introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}
