import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@vocalia/db";
import { workspaces, creditPurchases, promoCodes } from "@vocalia/db";
import { eq, and, sql } from "drizzle-orm";
import { getProfileId } from "@/lib/get-profile-id";
import { PLANS, CREDIT_PACKAGES, type PlanSlug } from "@vocalia/shared";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const db = getDb();
    const profileId = await getProfileId(user);

    const body = await req.json();
    const { workspaceId, minutes, promoCode } = body;

    if (!workspaceId || !minutes || minutes < 10 || minutes > 100000) {
      return apiError("VALIDATION_ERROR", "Minutes doivent être entre 10 et 100 000", 400);
    }

    // Get workspace & verify ownership
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!ws || ws.userId !== profileId) {
      return apiError("NOT_FOUND", "Workspace introuvable", 404);
    }

    const planSlug = (ws.planSlug as PlanSlug) || "trial";
    const plan = PLANS[planSlug] || PLANS.trial;

    if (planSlug === "trial") {
      return apiError("FORBIDDEN", "Choisissez un plan payant pour acheter des minutes", 403);
    }

    // Calculate base price
    let baseAmountCents = minutes * plan.pricePerMinuteCents;

    // Apply volume discount
    const pkg = CREDIT_PACKAGES.find((p) => p.minutes === minutes);
    const volumeDiscount = pkg ? pkg.discount : 0;
    let discountPercent: number = volumeDiscount;
    let discountLabel = volumeDiscount > 0 ? `Réduction volume -${volumeDiscount}%` : "";

    // Apply promo code
    let promoApplied = false;
    if (promoCode && typeof promoCode === "string") {
      const normalizedCode = promoCode.trim().toUpperCase();
      const [promo] = await db
        .select()
        .from(promoCodes)
        .where(and(eq(promoCodes.code, normalizedCode), eq(promoCodes.isActive, true)));

      if (promo) {
        const notExpired = !promo.expiresAt || new Date(promo.expiresAt) >= new Date();
        const notMaxed = !promo.maxUses || promo.currentUses < promo.maxUses;
        const meetsMin = minutes >= (promo.minMinutes ?? 0);

        if (notExpired && notMaxed && meetsMin) {
          // Stack promo on top of volume discount
          discountPercent = Math.min(50, discountPercent + promo.discountPercent);
          discountLabel = volumeDiscount > 0
            ? `Volume -${volumeDiscount}% + Promo ${normalizedCode} -${promo.discountPercent}%`
            : `Promo ${normalizedCode} -${promo.discountPercent}%`;
          promoApplied = true;

          // Increment usage
          await db.update(promoCodes)
            .set({ currentUses: sql`${promoCodes.currentUses} + 1` })
            .where(eq(promoCodes.id, promo.id));
        }
      }
    }

    const finalAmountCents = Math.round(baseAmountCents * (1 - discountPercent / 100));

    // If Stripe is configured, create a checkout session
    if (isStripeConfigured()) {
      const stripe = await getStripe();
      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          line_items: [{
            price_data: {
              currency: "eur",
              unit_amount: Math.round(finalAmountCents / minutes),
              product_data: {
                name: `${minutes} minutes Callpme (${plan.name})`,
                description: discountLabel || `Pack de ${minutes} minutes`,
              },
            },
            quantity: minutes,
          }],
          metadata: { workspaceId, minutes: String(minutes), planSlug, promoCode: promoCode || "" },
          success_url: `${req.nextUrl.origin}/billing?success=true&minutes=${minutes}`,
          cancel_url: `${req.nextUrl.origin}/billing?canceled=true`,
        });
        return apiSuccess({ checkoutUrl: session.url, amountCents: finalAmountCents });
      }
    }

    // Sandbox mode — add credits directly
    await db.update(workspaces)
      .set({ minutesIncluded: sql`${workspaces.minutesIncluded} + ${minutes}` })
      .where(eq(workspaces.id, workspaceId));

    await db.insert(creditPurchases).values({
      workspaceId,
      minutesPurchased: minutes,
      amountCents: finalAmountCents,
    });

    // Send notification
    try {
      const { notifyCreditsPurchased } = await import("@/lib/notification-service");
      await notifyCreditsPurchased(ws.userId, workspaceId, minutes, finalAmountCents);
    } catch {}

    return apiSuccess({
      checkoutUrl: null,
      activated: true,
      minutesAdded: minutes,
      baseAmountCents,
      discountPercent,
      discountLabel,
      finalAmountCents,
      promoApplied,
      totalMinutes: ws.minutesIncluded + minutes,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
