import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@vocalia/db";
import { promoCodes } from "@vocalia/db";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const db = getDb();
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return apiError("VALIDATION_ERROR", "Code promo requis", 400);
    }

    const normalizedCode = code.trim().toUpperCase();

    const [promo] = await db
      .select()
      .from(promoCodes)
      .where(and(eq(promoCodes.code, normalizedCode), eq(promoCodes.isActive, true)));

    if (!promo) {
      return apiError("NOT_FOUND", "Code promo invalide ou expiré", 404);
    }

    // Check expiry
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return apiError("NOT_FOUND", "Ce code promo a expiré", 404);
    }

    // Check max uses
    if (promo.maxUses && promo.currentUses >= promo.maxUses) {
      return apiError("NOT_FOUND", "Ce code promo a atteint sa limite d'utilisation", 404);
    }

    return apiSuccess({
      code: promo.code,
      discountPercent: promo.discountPercent,
      minMinutes: promo.minMinutes,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
