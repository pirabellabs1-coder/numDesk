import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { webhooks } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";
import { z } from "zod";

const createWebhookSchema = z.object({
  workspaceId: z.string().uuid(),
  url: z.url(),
  events: z.array(z.string()).min(1),
});

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(webhooks).where(eq(webhooks.workspaceId, workspaceId)).orderBy(desc(webhooks.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = createWebhookSchema.parse(await req.json());
    const secret = `whsec_${randomUUID().replace(/-/g, "")}`;
    const db = getDb();
    const [created] = await db.insert(webhooks).values({ ...body, secret }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
