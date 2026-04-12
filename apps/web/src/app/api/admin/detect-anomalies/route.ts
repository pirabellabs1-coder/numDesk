import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { agents, conversations, workspaces, anomalies, alerts } from "@vocalia/db";
import { eq, count, desc, and, gte } from "drizzle-orm";

/**
 * Scans the platform for anomalies and generates alerts automatically.
 * Call this periodically or on-demand from the admin panel.
 */
export async function POST() {
  try {
    await withAuth();
    const db = getDb();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const detectedAnomalies: any[] = [];
    const detectedAlerts: any[] = [];

    // Get all workspaces
    const wsList = await db.select().from(workspaces);

    for (const ws of wsList) {
      // Get conversations for this workspace
      const convs = await db.select().from(conversations).where(eq(conversations.workspaceId, ws.id));
      const recentConvs = convs.filter((c) => c.createdAt && new Date(c.createdAt) >= oneDayAgo);
      const lastHourConvs = convs.filter((c) => c.createdAt && new Date(c.createdAt) >= oneHourAgo);

      // 1. Check for high missed call rate
      if (recentConvs.length > 3) {
        const missed = recentConvs.filter((c) => c.status === "missed").length;
        const missedRate = missed / recentConvs.length;
        if (missedRate > 0.3) {
          detectedAnomalies.push({
            workspaceId: ws.id,
            type: "spike",
            severity: missedRate > 0.5 ? "high" : "medium",
            title: `Taux d'appels manqués élevé — ${ws.name}`,
            description: `${Math.round(missedRate * 100)}% des appels manqués (${missed}/${recentConvs.length}) dans les dernières 24h`,
          });
        }
      }

      // 2. Check for negative sentiment spike
      if (recentConvs.length > 3) {
        const negative = recentConvs.filter((c) => c.sentiment === "negative").length;
        const negRate = negative / recentConvs.length;
        if (negRate > 0.25) {
          detectedAnomalies.push({
            workspaceId: ws.id,
            type: "drop",
            severity: negRate > 0.4 ? "high" : "medium",
            title: `Sentiment négatif en hausse — ${ws.name}`,
            description: `${Math.round(negRate * 100)}% de conversations négatives (${negative}/${recentConvs.length}) dans les dernières 24h`,
          });
        }
      }

      // 3. Check quota usage > 90%
      if (ws.minutesIncluded > 0) {
        const usagePct = (ws.minutesUsed / ws.minutesIncluded) * 100;
        if (usagePct > 90) {
          detectedAlerts.push({
            type: "quota",
            severity: usagePct > 100 ? "critical" : "warning",
            title: `Quota de minutes ${usagePct > 100 ? "dépassé" : "bientôt atteint"} — ${ws.name}`,
            message: `${ws.minutesUsed}/${ws.minutesIncluded} minutes utilisées (${Math.round(usagePct)}%)`,
          });
        }
      }

      // 4. Check for inactive agents (published but no calls in 7 days)
      const agentList = await db.select().from(agents).where(eq(agents.workspaceId, ws.id));
      for (const agent of agentList) {
        if (agent.isPublished && (agent.totalCalls ?? 0) === 0) {
          detectedAlerts.push({
            type: "agent",
            severity: "info",
            title: `Agent inactif — ${agent.name}`,
            message: `L'agent "${agent.name}" est publié mais n'a reçu aucun appel. Vérifiez la configuration du numéro SIP.`,
          });
        }
      }
    }

    // 5. Global checks — unpublished agents
    const allAgents = await db.select().from(agents);
    const unpublished = allAgents.filter((a) => !a.isPublished);
    if (unpublished.length > 0 && allAgents.length > 0) {
      const pct = Math.round((unpublished.length / allAgents.length) * 100);
      if (pct > 50) {
        detectedAlerts.push({
          type: "config",
          severity: "warning",
          title: `${pct}% des agents non publiés`,
          message: `${unpublished.length} agents sur ${allAgents.length} sont en brouillon. Publiez-les pour qu'ils soient opérationnels.`,
        });
      }
    }

    // Insert anomalies (avoid duplicates by checking title)
    let insertedAnomalies = 0;
    for (const a of detectedAnomalies) {
      const existing = await db.select().from(anomalies).where(and(eq(anomalies.workspaceId, a.workspaceId), eq(anomalies.title, a.title)));
      if (existing.length === 0) {
        await db.insert(anomalies).values(a);
        insertedAnomalies++;
      }
    }

    // Insert alerts (avoid duplicates)
    let insertedAlerts = 0;
    for (const a of detectedAlerts) {
      const existing = await db.select().from(alerts).where(eq(alerts.title, a.title));
      if (existing.length === 0) {
        await db.insert(alerts).values(a);
        insertedAlerts++;
      }
    }

    return apiSuccess({
      scanned: wsList.length,
      anomaliesDetected: detectedAnomalies.length,
      anomaliesInserted: insertedAnomalies,
      alertsDetected: detectedAlerts.length,
      alertsInserted: insertedAlerts,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
