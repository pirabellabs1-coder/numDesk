import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { campaigns } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { createCampaignSchema } from "@vocalia/shared";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    const results = await db.select().from(campaigns).where(eq(campaigns.workspaceId, workspaceId)).orderBy(desc(campaigns.createdAt));
    return apiSuccess(results);
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = await validateBody(req, createCampaignSchema); const db = getDb();
    const totalContacts = body.contacts?.length ?? 0;
    const [created] = await db.insert(campaigns).values({ ...body, totalContacts }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
