import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { tags } from "@vocalia/db";
import { eq } from "drizzle-orm";
import { createTagSchema } from "@vocalia/shared";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(tags).where(eq(tags.workspaceId, workspaceId)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = await validateBody(req, createTagSchema); const db = getDb();
    const [created] = await db.insert(tags).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
