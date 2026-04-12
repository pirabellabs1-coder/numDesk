import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { phoneNumbers } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const createPhoneSchema = z.object({
  workspaceId: z.string().uuid(),
  number: z.string().min(1),
  provider: z.string().default("sip_trunk"),
  friendlyName: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(phoneNumbers).where(eq(phoneNumbers.workspaceId, workspaceId)).orderBy(desc(phoneNumbers.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = createPhoneSchema.parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(phoneNumbers).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
