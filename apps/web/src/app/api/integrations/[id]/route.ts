import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { integrations } from "@vocalia/db";
import { eq } from "drizzle-orm";

// Disconnect
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();
    const [updated] = await db.update(integrations).set({ isConnected: false }).where(eq(integrations.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Intégration introuvable", 404);
    return apiSuccess({ disconnected: true });
  } catch (error) { return handleApiError(error); }
}
