import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { contacts, workspaces } from "@vocalia/db";
import { eq, count, desc } from "drizzle-orm";

export async function GET() {
  try { await withAuth(); const db = getDb();
    const wsList = await db.select().from(workspaces);
    const result = await Promise.all(wsList.map(async (ws) => {
      const [ct] = await db.select({ total: count() }).from(contacts).where(eq(contacts.workspaceId, ws.id));
      return { workspace: ws.name, workspaceId: ws.id, total: Number(ct?.total ?? 0) };
    }));
    return apiSuccess(result.filter((r) => r.total > 0).sort((a, b) => b.total - a.total));
  } catch (error) { return handleApiError(error); }
}
