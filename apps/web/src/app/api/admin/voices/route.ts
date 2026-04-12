import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { voices } from "@vocalia/db";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const createVoiceSchema = z.object({
  name: z.string().min(1),
  provider: z.enum(["cartesia", "elevenlabs", "google", "custom"]),
  voiceId: z.string().optional(),
  language: z.string().default("fr-FR"),
  gender: z.string().default("female"),
  quality: z.enum(["premium", "standard", "custom"]).default("standard"),
  sampleUrl: z.string().optional(),
});

export async function GET() {
  try {
    await withAuth();
    const db = getDb();
    return apiSuccess(await db.select().from(voices).orderBy(desc(voices.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const body = createVoiceSchema.parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(voices).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
