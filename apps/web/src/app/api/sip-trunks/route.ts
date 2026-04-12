import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { sipTrunks } from "@vocalia/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  try { const { user } = await withAuth(); const db = getDb();
    return apiSuccess(await db.select().from(sipTrunks).orderBy(desc(sipTrunks.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { const { user } = await withAuth();
    const body = z.object({ name: z.string().min(1), host: z.string().min(1), port: z.number().int().default(5060), username: z.string().optional(), password: z.string().optional(), isGlobal: z.boolean().default(false) }).parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(sipTrunks).values({ ...body, userId: user.id }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
