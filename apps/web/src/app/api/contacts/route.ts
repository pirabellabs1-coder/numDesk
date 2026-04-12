import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError, validateBody } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { contacts } from "@vocalia/db";
import { eq, ilike, or, desc } from "drizzle-orm";
import { createContactSchema } from "@vocalia/shared";

export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    const search = req.nextUrl.searchParams.get("search");
    if (!workspaceId) return apiSuccess([]);
    const db = getDb();
    let conditions = [eq(contacts.workspaceId, workspaceId)];
    if (search) {
      const results = await db.select().from(contacts).where(eq(contacts.workspaceId, workspaceId)).orderBy(desc(contacts.createdAt));
      const filtered = results.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search) || c.email?.toLowerCase().includes(search.toLowerCase())
      );
      return apiSuccess(filtered);
    }
    const results = await db.select().from(contacts).where(eq(contacts.workspaceId, workspaceId)).orderBy(desc(contacts.createdAt));
    return apiSuccess(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await withAuth();
    const body = await validateBody(req, createContactSchema);
    const db = getDb();
    const [created] = await db.insert(contacts).values(body).returning();
    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
