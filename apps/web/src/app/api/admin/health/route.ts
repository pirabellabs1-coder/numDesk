import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations, agents, workspaces, users } from "@vocalia/db";
import { count, gte, sql } from "drizzle-orm";

interface ServiceHealth {
  name: string;
  status: "operational" | "degraded" | "down";
  latencyMs: number | null;
}

async function checkService(
  name: string,
  url: string,
  headers: Record<string, string> = {},
  method: string = "GET"
): Promise<ServiceHealth> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method, headers, signal: controller.signal });
    clearTimeout(timeout);
    const latencyMs = Date.now() - start;
    if (res.ok || res.status === 401 || res.status === 403) {
      // 401/403 means the service is reachable but auth differs — still operational
      return { name, status: latencyMs > 3000 ? "degraded" : "operational", latencyMs };
    }
    return { name, status: "degraded", latencyMs };
  } catch {
    return { name, status: "down", latencyMs: null };
  }
}

export async function GET() {
  try {
    await withAuth();
    const db = getDb();

    // Check external services in parallel
    const vapiKey = process.env.VAPI_API_KEY;
    const cartesiaKey = process.env.CARTESIA_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

    const [vapi, cartesia, gemini, supabaseHealth, elevenLabs] = await Promise.all([
      checkService("Vapi AI", "https://api.vapi.ai/assistant", {
        Authorization: `Bearer ${vapiKey}`,
      }),
      checkService("Cartesia TTS", "https://api.cartesia.ai/voices", {
        "X-API-Key": cartesiaKey ?? "",
        "Cartesia-Version": "2024-06-10",
      }),
      checkService(
        "Gemini LLM",
        `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey ?? ""}`,
      ),
      checkService("Supabase", process.env.NEXT_PUBLIC_SUPABASE_URL + "/rest/v1/", {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
      }),
      checkService("ElevenLabs", "https://api.elevenlabs.io/v1/voices", {
        "xi-api-key": elevenLabsKey ?? "",
      }),
    ]);

    // DB health: check if we can query
    let dbStatus: ServiceHealth = { name: "Base de données", status: "operational", latencyMs: null };
    const dbStart = Date.now();
    try {
      await db.select({ total: count() }).from(users);
      dbStatus.latencyMs = Date.now() - dbStart;
      if (dbStatus.latencyMs > 3000) dbStatus.status = "degraded";
    } catch {
      dbStatus = { name: "Base de données", status: "down", latencyMs: null };
    }

    // Platform activity metrics (last 24h)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [callsToday] = await db
      .select({ total: count() })
      .from(conversations)
      .where(gte(conversations.startedAt, oneDayAgo));

    const [callsWeek] = await db
      .select({ total: count() })
      .from(conversations)
      .where(gte(conversations.startedAt, sevenDaysAgo));

    const [activeAgents] = await db
      .select({ total: count() })
      .from(agents)
      .where(sql`${agents.isPublished} = true`);

    const [totalWorkspaces] = await db.select({ total: count() }).from(workspaces);

    const services = [vapi, cartesia, gemini, elevenLabs, supabaseHealth, dbStatus];
    const operationalCount = services.filter((s) => s.status === "operational").length;
    const degradedCount = services.filter((s) => s.status === "degraded").length;

    let overallStatus: "operational" | "degraded" | "down" = "operational";
    if (degradedCount > 0) overallStatus = "degraded";
    if (services.some((s) => s.name === "Vapi AI" && s.status === "down")) overallStatus = "down";
    if (services.some((s) => s.name === "Base de données" && s.status === "down")) overallStatus = "down";

    return apiSuccess({
      overall: overallStatus,
      services,
      operationalCount,
      totalServices: services.length,
      activity: {
        callsLast24h: Number(callsToday?.total ?? 0),
        callsLast7d: Number(callsWeek?.total ?? 0),
        publishedAgents: Number(activeAgents?.total ?? 0),
        activeWorkspaces: Number(totalWorkspaces?.total ?? 0),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
