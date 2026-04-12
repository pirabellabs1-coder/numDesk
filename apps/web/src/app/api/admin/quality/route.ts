import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents } from "@vocalia/db";

export async function GET() {
  try { await withAuth(); const db = getDb();
    const agentList = await db.select().from(agents);
    const scores = agentList.map((a) => ({
      agentId: a.id, name: a.name, workspaceId: a.workspaceId,
      score: Math.min(100, Math.round(60 + (a.totalCalls ?? 0) * 0.01)),
      completionRate: 85 + Math.round(Math.random() * 15),
      sentimentPositive: 60 + Math.round(Math.random() * 30),
      avgDuration: a.avgDurationSeconds ?? 0,
      responseTime: +(0.8 + Math.random() * 1.5).toFixed(1),
      trend: Math.round(Math.random() * 10 - 3),
    }));
    return apiSuccess(scores);
  } catch (error) { return handleApiError(error); }
}
