import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { integrations } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

const connectSchema = z.object({
  workspaceId: z.string().uuid(),
  provider: z.string().min(1),
  config: z.record(z.string(), z.string()).optional(),
});

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(integrations).where(eq(integrations.workspaceId, workspaceId)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const body = connectSchema.parse(await req.json());
    const db = getDb();

    // Check if already exists
    const existing = await db.select().from(integrations)
      .where(eq(integrations.workspaceId, body.workspaceId));
    const found = existing.find((i) => i.provider === body.provider);

    if (found) {
      // Update existing
      const [updated] = await db.update(integrations).set({
        isConnected: true,
        config: body.config || {},
        connectedAt: new Date(),
      }).where(eq(integrations.id, found.id)).returning();
      return apiSuccess(updated);
    }

    // Create new
    const [created] = await db.insert(integrations).values({
      workspaceId: body.workspaceId,
      provider: body.provider,
      isConnected: true,
      config: body.config || {},
      connectedAt: new Date(),
    }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
