import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { conversations, workspaces, agents } from "@vocalia/db";
import { eq, sql } from "drizzle-orm";

/**
 * Vapi Webhook Handler
 * Receives call events from Vapi and updates the database.
 * This endpoint is public (no auth) — verified by Vapi webhook secret.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const type = message.type;
    const db = getDb();

    // ── call.ended ──
    if (type === "end-of-call-report" || type === "call.ended") {
      const call = message.call || message;
      const vapiCallId = call.id || call.call_id;
      const durationSeconds = call.duration || call.durationSeconds || 0;
      const durationMinutes = Math.ceil(durationSeconds / 60);
      const transcript = call.transcript || call.messages || [];
      const summary = call.summary || call.analysis?.summary || null;
      const sentiment = call.analysis?.sentiment || null;
      const callerNumber = call.customer?.number || call.phoneNumber?.number || null;

      // Find the agent by vapiAgentId
      const vapiAgentId = call.assistantId || call.assistant_id;
      let agentId: string | null = null;
      let workspaceId: string | null = null;

      if (vapiAgentId) {
        const [agent] = await db.select().from(agents).where(eq(agents.vapiAgentId, vapiAgentId));
        if (agent) {
          agentId = agent.id;
          workspaceId = agent.workspaceId;
        }
      }

      if (!workspaceId) {
        // Try to get workspace from metadata
        workspaceId = call.metadata?.workspaceId || null;
      }

      if (!workspaceId) {
        console.log("[Vapi Webhook] No workspace found for call:", vapiCallId);
        return NextResponse.json({ ok: true });
      }

      // Map Vapi status to our status
      const statusMap: Record<string, string> = {
        ended: "ended",
        completed: "ended",
        failed: "interrupted",
        "no-answer": "no_answer",
        busy: "missed",
      };
      const status = statusMap[call.status] || "ended";

      // Map sentiment
      const sentimentMap: Record<string, string> = {
        positive: "positive",
        negative: "negative",
        neutral: "neutral",
      };
      const mappedSentiment = sentiment ? (sentimentMap[sentiment.toLowerCase()] || null) : null;

      // Insert conversation
      const costCents = durationMinutes * 5; // base cost, adjusted by plan
      await db.insert(conversations).values({
        workspaceId,
        agentId,
        vapiCallId,
        type: "phone",
        direction: call.type === "outbound" ? "outbound" : "inbound",
        callerNumber,
        status: status as any,
        sentiment: mappedSentiment as any,
        durationSeconds,
        costCents,
        isBilled: true,
        transcript: Array.isArray(transcript)
          ? transcript.map((m: any) => ({
              role: m.role || "agent",
              content: m.content || m.message || "",
              ts: m.timestamp || m.time || new Date().toISOString(),
            }))
          : [],
        summary,
        startedAt: call.startedAt ? new Date(call.startedAt) : new Date(Date.now() - durationSeconds * 1000),
        endedAt: call.endedAt ? new Date(call.endedAt) : new Date(),
      }).onConflictDoNothing();

      // Increment minutesUsed on workspace
      if (durationMinutes > 0) {
        await db.update(workspaces)
          .set({
            minutesUsed: sql`${workspaces.minutesUsed} + ${durationMinutes}`,
          })
          .where(eq(workspaces.id, workspaceId));

        console.log(`[Vapi Webhook] Call ${vapiCallId}: ${durationMinutes} min billed to workspace ${workspaceId}`);
      }

      // Update agent total calls
      if (agentId) {
        await db.update(agents)
          .set({
            totalCalls: sql`COALESCE(${agents.totalCalls}, 0) + 1`,
          })
          .where(eq(agents.id, agentId));
      }

      // Send notifications
      try {
        const { notifyCallEnded, notifyCreditsLow, notifyCreditsExhausted } = await import("@/lib/notification-service");

        // Get workspace owner
        const [wsData] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
        if (wsData) {
          const agentName = agentId ? (await db.select().from(agents).where(eq(agents.id, agentId)))[0]?.name || "Agent" : "Agent";
          await notifyCallEnded(wsData.userId, workspaceId, agentName, durationSeconds, mappedSentiment || undefined);

          // Check remaining credits
          const remaining = Math.max(0, wsData.minutesIncluded - wsData.minutesUsed - durationMinutes);
          const usagePct = wsData.minutesIncluded > 0 ? ((wsData.minutesUsed + durationMinutes) / wsData.minutesIncluded) * 100 : 100;

          if (remaining === 0) {
            await notifyCreditsExhausted(wsData.userId, workspaceId);
          } else if (usagePct >= 80) {
            await notifyCreditsLow(wsData.userId, workspaceId, remaining, wsData.minutesIncluded);
          }
        }
      } catch (e: any) {
        console.error("[Vapi Webhook] Notification error:", e.message);
      }

      return NextResponse.json({ ok: true, minutesBilled: durationMinutes });
    }

    // ── call.started ──
    if (type === "call.started" || type === "status-update") {
      // Log but don't process yet
      console.log(`[Vapi Webhook] Call event: ${type}`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("[Vapi Webhook] Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
