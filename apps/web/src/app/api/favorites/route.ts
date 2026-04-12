import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { favorites } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createFavoriteSchema = z.object({
  type: z.enum(["agent", "contact", "campaign", "conversation"]),
  name: z.string().min(1),
  icon: z.string().optional(),
  href: z.string().min(1),
});

export async function GET() {
  try { const { user } = await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(favorites).where(eq(favorites.userId, user.id)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { const { user } = await withAuth();
    const body = createFavoriteSchema.parse(await req.json()); const db = getDb();
    const [created] = await db.insert(favorites).values({ ...body, userId: user.id }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
