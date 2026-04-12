import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { apiTokens } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { randomUUID, createHash } from "crypto";
import { z } from "zod";

const createTokenSchema = z.object({
  workspaceId: z.string().uuid(),
  name: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(apiTokens).where(eq(apiTokens.workspaceId, workspaceId)).orderBy(desc(apiTokens.createdAt)));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { await withAuth();
    const body = createTokenSchema.parse(await req.json());
    const rawToken = `voc_${randomUUID().replace(/-/g, "")}`;
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const tokenPrefix = rawToken.slice(0, 12) + "...";
    const db = getDb();
    const [created] = await db.insert(apiTokens).values({
      workspaceId: body.workspaceId,
      name: body.name,
      tokenHash,
      tokenPrefix,
    }).returning();
    return apiSuccess({ ...created, rawToken }, 201);
  } catch (error) { return handleApiError(error); }
}
