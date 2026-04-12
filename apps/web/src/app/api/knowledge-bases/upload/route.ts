import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { knowledgeBases } from "@vocalia/db";
import { eq } from "drizzle-orm";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/zip",
  "application/x-zip-compressed",
];

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const formData = await req.formData();
    const kbId = formData.get("kbId") as string;
    if (!kbId) return apiError("VALIDATION_ERROR", "kbId requis", 422);

    const db = getDb();
    const [kb] = await db.select().from(knowledgeBases).where(eq(knowledgeBases.id, kbId));
    if (!kb) return apiError("NOT_FOUND", "Base introuvable", 404);

    const files = formData.getAll("files") as File[];
    if (files.length === 0) return apiError("VALIDATION_ERROR", "Aucun fichier envoyé", 422);

    const existingFiles = (kb.files as Array<{ name: string; url: string; size: number; type: string }>) || [];
    const newFiles: Array<{ name: string; url: string; size: number; type: string }> = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return apiError("VALIDATION_ERROR", `Fichier "${file.name}" trop volumineux (max 20 Mo)`, 422);
      }

      // Store file content as base64 data URL for now (no external storage needed)
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;

      newFiles.push({
        name: file.name,
        url: dataUrl,
        size: file.size,
        type: file.type,
      });
    }

    const allFiles = [...existingFiles, ...newFiles];
    const [updated] = await db
      .update(knowledgeBases)
      .set({ files: allFiles })
      .where(eq(knowledgeBases.id, kbId))
      .returning();

    return apiSuccess(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
