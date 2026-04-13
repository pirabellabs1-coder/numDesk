import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { offers } from "@vocalia/db";
import { desc, eq, count } from "drizzle-orm";
import { z } from "zod";

const SEED_PLANS = [
  {
    name: "Essai gratuit",
    slug: "trial",
    description: "5 minutes offertes pour tester la plateforme. 1 agent, fonctionnalités limitées.",
    minutesIncluded: 5,
    priceMonthly: 0,
    pricePerMinuteCents: 0,
    overageRateCents: 0,
    maxAgents: 1,
    isActive: true,
  },
  {
    name: "Starter",
    slug: "starter",
    description: "Pour les indépendants et petites agences. 2 agents, accès API et webhooks.",
    minutesIncluded: 0,
    priceMonthly: 0,
    pricePerMinuteCents: 5,
    overageRateCents: 5,
    maxAgents: 2,
    isActive: true,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "Accès complet : agents illimités, campagnes, Voice Studio, RAG, analytics avancés.",
    minutesIncluded: 0,
    priceMonthly: 0,
    pricePerMinuteCents: 12,
    overageRateCents: 12,
    maxAgents: null,
    isActive: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    description: "Sur mesure. Agents illimités, support dédié, SLA 99.99%.",
    minutesIncluded: 0,
    priceMonthly: 0,
    pricePerMinuteCents: 0,
    overageRateCents: 0,
    maxAgents: null,
    isActive: true,
  },
];

async function seedPlansIfEmpty(db: ReturnType<typeof getDb>) {
  const result = await db.select({ total: count() }).from(offers);
  const total = result[0]?.total ?? 0;
  if (Number(total) === 0) {
    await db.insert(offers).values(SEED_PLANS);
  }
}

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    await seedPlansIfEmpty(db);
    return apiSuccess(await db.select().from(offers).orderBy(desc(offers.createdAt)));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const body = z
      .object({
        name: z.string().min(1),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        minutesIncluded: z.number().int(),
        priceMonthly: z.number().int(),
        pricePerMinuteCents: z.number().int().optional(),
        overageRateCents: z.number().int().optional(),
        maxAgents: z.number().int().nullable().optional(),
        maxWorkspaces: z.number().int().optional(),
      })
      .parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(offers).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await withAuth();
    const body = await req.json();
    const { id, ...updates } = body;
    const db = getDb();
    const [updated] = await db
      .update(offers)
      .set(updates)
      .where(eq(offers.id, id))
      .returning();
    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
