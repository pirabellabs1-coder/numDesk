import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { offers } from "@vocalia/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  try { await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(offers).orderBy(desc(offers.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = z.object({ name: z.string().min(1), minutesIncluded: z.number().int(), priceMonthly: z.number().int(), overageRateCents: z.number().int().optional(), maxWorkspaces: z.number().int().optional() }).parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(offers).values({ ...body, priceMonthly: body.priceMonthly }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}

export async function PATCH(req: NextRequest) {
  try { await withAuth();
    const body = await req.json();
    const { id, ...updates } = body;
    const db = getDb();
    const [updated] = await db.update(offers).set(updates).where(eq(offers.id, id)).returning();
    return apiSuccess(updated);
  } catch (error) { return handleApiError(error); }
}
