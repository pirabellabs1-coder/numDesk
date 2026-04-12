import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { knowledgeBases } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const createKBSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1),
  mode: z.enum(["full_context", "rag"]).default("full_context"),
});

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(knowledgeBases).where(eq(knowledgeBases.workspaceId, workspaceId)).orderBy(desc(knowledgeBases.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = createKBSchema.parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(knowledgeBases).values({ ...body, files: [] }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
