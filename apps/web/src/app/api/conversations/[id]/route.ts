import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { conversations } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();
    const [conv] = await db.select().from(conversations).where(eq(conversations.id, id));
    if (!conv) return apiError("NOT_FOUND", "Conversation introuvable", 404);
    return apiSuccess(conv);
  } catch (error) {
    return handleApiError(error);
  }
}
