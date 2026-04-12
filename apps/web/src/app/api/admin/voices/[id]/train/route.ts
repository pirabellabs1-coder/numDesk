import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { voices } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();

    // Update status to training
    const [updated] = await db.update(voices).set({
      trainingStatus: "training",
      trainingProgress: 0,
    }).where(eq(voices.id, id)).returning();

    if (!updated) return apiError("NOT_FOUND", "Voix introuvable", 404);

    // Simulate training progress (in production, this would trigger a Replicate/RunPod job)
    // The training would run async and update progress via webhook
    setTimeout(async () => {
      try {
        await db.update(voices).set({ trainingProgress: 25 }).where(eq(voices.id, id));
        setTimeout(async () => {
          await db.update(voices).set({ trainingProgress: 50 }).where(eq(voices.id, id));
          setTimeout(async () => {
            await db.update(voices).set({ trainingProgress: 75 }).where(eq(voices.id, id));
            setTimeout(async () => {
              await db.update(voices).set({ trainingStatus: "completed", trainingProgress: 100 }).where(eq(voices.id, id));
            }, 5000);
          }, 5000);
        }, 5000);
      } catch {}
    }, 3000);

    return apiSuccess({ message: "Entraînement lancé", voiceId: id });
  } catch (error) { return handleApiError(error); }
}
