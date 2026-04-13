import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { recordings, conversations, agents } from "@vocalia/db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();

    // Check if the dedicated recordings table has data for this workspace
    const [recCount] = await db
      .select({ total: count() })
      .from(recordings)
      .where(eq(recordings.workspaceId, workspaceId));

    if (Number(recCount?.total ?? 0) > 0) {
      // Use the dedicated recordings table
      const rows = await db
        .select()
        .from(recordings)
        .where(eq(recordings.workspaceId, workspaceId))
        .orderBy(desc(recordings.createdAt));

      const results = rows.map((r) => ({
        ...r,
        agentName: r.agentName || "Agent inconnu",
        callerNumber: r.callerNumber || "Inconnu",
        durationSeconds: r.durationSeconds || 0,
        duration: formatDuration(r.durationSeconds || 0),
        sentiment: r.sentiment || "neutral",
        tags: r.tags || [],
      }));

      return apiSuccess(results);
    }

    // Fallback: pull from conversations that have audioUrl
    const rows = await db
      .select({
        id: conversations.id,
        workspaceId: conversations.workspaceId,
        agentId: conversations.agentId,
        agentName: agents.name,
        callerNumber: conversations.callerNumber,
        audioUrl: conversations.audioUrl,
        durationSeconds: conversations.durationSeconds,
        sentiment: conversations.sentiment,
        tags: conversations.tags,
        direction: conversations.direction,
        status: conversations.status,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .leftJoin(agents, eq(conversations.agentId, agents.id))
      .where(
        and(
          eq(conversations.workspaceId, workspaceId),
          sql`${conversations.audioUrl} IS NOT NULL`
        )
      )
      .orderBy(desc(conversations.createdAt));

    const results = rows.map((r) => ({
      ...r,
      agentName: r.agentName || "Agent inconnu",
      callerNumber: r.callerNumber || "Inconnu",
      durationSeconds: r.durationSeconds || 0,
      duration: formatDuration(r.durationSeconds || 0),
      sentiment: r.sentiment || "neutral",
      tags: r.tags || [],
    }));

    return apiSuccess(results);
  } catch (error) {
    return handleApiError(error);
  }
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
