import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { chatChannels } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(chatChannels).where(eq(chatChannels.workspaceId, workspaceId)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = z.object({ workspaceId: z.string().uuid(), name: z.string().min(1), icon: z.string().optional() }).parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(chatChannels).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
