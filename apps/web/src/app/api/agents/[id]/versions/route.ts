import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agentVersions } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      return apiSuccess([]);
    }
    const db = getDb();
    return apiSuccess(await db.select().from(agentVersions).where(eq(agentVersions.agentId, id)).orderBy(desc(agentVersions.createdAt)));
  } catch (error) { return handleApiError(error); }
}
