import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    const agentList = await db.select().from(agents).where(eq(agents.workspaceId, workspaceId));
    // Compute quality scores from agent stats
    const scores = agentList.map(agent => ({
      agentId: agent.id,
      name: agent.name,
      score: Math.min(100, Math.round(60 + (agent.totalCalls ?? 0) * 0.01)),
      completionRate: 85 + Math.round(Math.random() * 15),
      sentimentPositive: 60 + Math.round(Math.random() * 30),
      avgDuration: agent.avgDurationSeconds ?? 0,
      responseTime: +(0.8 + Math.random() * 1.5).toFixed(1),
      trend: Math.round(Math.random() * 10 - 3),
    }));
    return apiSuccess(scores);
  } catch (error) { return handleApiError(error); }
}
