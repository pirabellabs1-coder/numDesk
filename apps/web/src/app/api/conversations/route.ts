import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations, agents } from "@vocalia/db";
import { eq, and, desc } from "drizzle-orm";

const STATUS_LABELS: Record<string, string> = {
  ended: "Succès",
  success: "Succès",
  interrupted: "Interrompu",
  voicemail: "Messagerie",
  no_answer: "Pas de réponse",
  missed: "Manqué",
  unknown: "Inconnu",
  in_progress: "En cours",
  ringing: "Sonnerie",
};

const DIRECTION_LABELS: Record<string, string> = {
  inbound: "Entrant",
  outbound: "Sortant",
};

const AGENT_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-tertiary",
  "bg-orange-400",
  "bg-pink-400",
  "bg-cyan-400",
  "bg-amber-400",
  "bg-lime-400",
];

function formatDuration(seconds: number | null): string {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return `Aujourd'hui, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Hier, ${time}`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + `, ${time}`;
}

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    const status = req.nextUrl.searchParams.get("status");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "50");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();

    const conditions = [eq(conversations.workspaceId, workspaceId)];
    if (status) {
      conditions.push(eq(conversations.status, status as any));
    }

    const rows = await db
      .select({
        id: conversations.id,
        workspaceId: conversations.workspaceId,
        agentId: conversations.agentId,
        agentName: agents.name,
        vapiCallId: conversations.vapiCallId,
        type: conversations.type,
        direction: conversations.direction,
        callerNumber: conversations.callerNumber,
        phoneNumberId: conversations.phoneNumberId,
        status: conversations.status,
        sentiment: conversations.sentiment,
        durationSeconds: conversations.durationSeconds,
        costCents: conversations.costCents,
        isBilled: conversations.isBilled,
        transcript: conversations.transcript,
        summary: conversations.summary,
        tags: conversations.tags,
        audioUrl: conversations.audioUrl,
        startedAt: conversations.startedAt,
        endedAt: conversations.endedAt,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .leftJoin(agents, eq(conversations.agentId, agents.id))
      .where(and(...conditions))
      .orderBy(desc(conversations.createdAt))
      .limit(limit);

    // Build agent color map for consistent colors
    const agentColorMap = new Map<string, string>();
    let colorIdx = 0;
    for (const r of rows) {
      const aid = r.agentId;
      if (typeof aid === "string" && !agentColorMap.has(aid)) {
        agentColorMap.set(aid, AGENT_COLORS[colorIdx % AGENT_COLORS.length] ?? "bg-primary");
        colorIdx++;
      }
    }

    const results = rows.map((r) => ({
      ...r,
      agentName: r.agentName || "Agent inconnu",
      agentColor: agentColorMap.get(r.agentId ?? "") ?? "bg-on-surface-variant",
      callerNumber: r.callerNumber || "Inconnu",
      duration: formatDuration(r.durationSeconds),
      durationSeconds: r.durationSeconds || 0,
      statusLabel: STATUS_LABELS[r.status ?? "unknown"] ?? r.status ?? "Inconnu",
      typeLabel: DIRECTION_LABELS[r.direction ?? "inbound"] ?? r.direction ?? "—",
      date: formatDate(r.createdAt),
      transcript: r.transcript || [],
      tags: r.tags || [],
    }));

    return apiSuccess(results);
  } catch (error) {
    return handleApiError(error);
  }
}
