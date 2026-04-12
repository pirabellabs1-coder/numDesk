import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations, workspaces } from "@vocalia/db";
import { eq, count, sum, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess({});

    const db = getDb();

    // Workspace data
    const [ws] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));

    // Call stats
    const [callStats] = await db.select({
      totalCalls: count(),
      totalSeconds: sum(conversations.durationSeconds),
    }).from(conversations).where(eq(conversations.workspaceId, workspaceId));

    // Answer rate: calls with status 'ended' or 'success' vs total
    const [answeredStats] = await db.select({
      answered: count(),
    }).from(conversations).where(
      and(
        eq(conversations.workspaceId, workspaceId),
        sql`${conversations.status} IN ('ended', 'success')`
      )
    );

    // Sentiment breakdown
    const sentimentRows = await db.select({
      sentiment: conversations.sentiment,
      cnt: count(),
    }).from(conversations)
      .where(and(eq(conversations.workspaceId, workspaceId), sql`${conversations.sentiment} IS NOT NULL`))
      .groupBy(conversations.sentiment);

    const totalWithSentiment = sentimentRows.reduce((s, r) => s + Number(r.cnt), 0);
    const sentimentBreakdown = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    for (const row of sentimentRows) {
      if (row.sentiment && row.sentiment in sentimentBreakdown) {
        sentimentBreakdown[row.sentiment as keyof typeof sentimentBreakdown] =
          totalWithSentiment > 0 ? Math.round((Number(row.cnt) / totalWithSentiment) * 100) : 0;
      }
    }

    const total = Number(callStats?.totalCalls ?? 0);
    const answered = Number(answeredStats?.answered ?? 0);
    const answerRate = total > 0 ? Math.round((answered / total) * 1000) / 10 : 0;
    const totalMinutesFromCalls = Math.round(Number(callStats?.totalSeconds ?? 0) / 60);

    // Cycle dates
    const cycleStart = ws?.cycleStartDate ? new Date(ws.cycleStartDate) : new Date();
    const cycleEnd = new Date(cycleStart);
    cycleEnd.setDate(cycleEnd.getDate() + (ws?.cycleDurationDays ?? 30));
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((cycleEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return apiSuccess({
      minutesUsed: ws?.minutesUsed ?? 0,
      minutesIncluded: ws?.minutesIncluded ?? 5,
      minutesRemaining: Math.max(0, (ws?.minutesIncluded ?? 5) - (ws?.minutesUsed ?? 0)),
      totalCalls: total,
      answerRate,
      daysRemaining,
      totalMinutesFromCalls,
      sentimentBreakdown,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
