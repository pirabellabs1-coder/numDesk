import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { users } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params; const db = getDb();
    const [member] = await db.select().from(users).where(eq(users.id, id));
    if (!member) return apiError("NOT_FOUND", "Membre introuvable", 404);
    return apiSuccess(member);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await withAuth(); const { id } = await params;
    const body = await req.json(); const db = getDb();
    const [updated] = await db.update(users).set({ ...body, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    if (!updated) return apiError("NOT_FOUND", "Membre introuvable", 404);
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}
