import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { promoCodes } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    const codes = await db.select().from(promoCodes).orderBy(desc(promoCodes.createdAt));
    return apiSuccess(codes);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const db = getDb();
    const body = await req.json();

    const { code, discountPercent, maxUses, minMinutes, expiresAt } = body;

    if (!code || !discountPercent) {
      return apiError("VALIDATION_ERROR", "Code et pourcentage de réduction requis", 400);
    }

    if (discountPercent < 1 || discountPercent > 50) {
      return apiError("VALIDATION_ERROR", "La réduction doit être entre 1% et 50%", 400);
    }

    const [created] = await db.insert(promoCodes).values({
      code: code.trim().toUpperCase(),
      discountPercent,
      maxUses: maxUses || null,
      minMinutes: minMinutes || 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }).returning();

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await withAuth();
    const db = getDb();
    const { id } = await req.json();

    if (!id) return apiError("VALIDATION_ERROR", "ID requis", 400);

    await db.delete(promoCodes).where(eq(promoCodes.id, id));
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
