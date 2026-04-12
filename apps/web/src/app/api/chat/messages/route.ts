import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { chatMessages } from "@vocalia/db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try { await withAuth();
    const channelId = req.nextUrl.searchParams.get("channel_id");
    if (!channelId) return apiSuccess([]);
    const db = getDb();
    return apiSuccess(await db.select().from(chatMessages).where(eq(chatMessages.channelId, channelId)).orderBy(desc(chatMessages.createdAt)).limit(100));
  } catch (error) { return handleApiError(error); }
}

export async function POST(req: NextRequest) {
  try { const { user } = await withAuth();
    const body = z.object({ channelId: z.string().uuid(), content: z.string().min(1) }).parse(await req.json());
    const db = getDb();
    const [created] = await db.insert(chatMessages).values({
      channelId: body.channelId,
      authorId: user.id,
      authorName: user.user_metadata?.first_name ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ""}`.trim() : user.email || "Utilisateur",
      authorAvatar: ((user.user_metadata?.first_name?.[0] || "") + (user.user_metadata?.last_name?.[0] || "")).toUpperCase() || "U",
      content: body.content,
    }).returning();
    return apiSuccess(created, 201);
  } catch (error) { return handleApiError(error); }
}
