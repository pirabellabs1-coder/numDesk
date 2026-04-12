import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { teamMembers, users, workspaceMembers, workspaces, teams } from "@vocalia/db";
import { eq, and } from "drizzle-orm";

// GET — list team members with user info
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id } = await params;
    const db = getDb();

    const members = await db
      .select({
        id: teamMembers.id,
        userId: teamMembers.userId,
        role: teamMembers.role,
        joinedAt: teamMembers.createdAt,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
      })
      .from(teamMembers)
      .leftJoin(users, eq(teamMembers.userId, users.id))
      .where(eq(teamMembers.teamId, id));

    return apiSuccess(members);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST — add member to team
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id: teamId } = await params;
    const { userId, role } = await req.json();

    if (!userId) return apiError("VALIDATION_ERROR", "userId requis", 422);

    const db = getDb();

    // Check team exists
    const [team] = await db.select().from(teams).where(eq(teams.id, teamId));
    if (!team) return apiError("NOT_FOUND", "Équipe introuvable", 404);

    // Check not already a member
    const [existing] = await db
      .select()
      .from(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)));
    if (existing) return apiError("CONFLICT", "Ce membre fait déjà partie de l'équipe", 409);

    const [created] = await db
      .insert(teamMembers)
      .values({ teamId, userId, role: role || "member" })
      .returning();

    return apiSuccess(created, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE — remove member from team
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await withAuth();
    const { id: teamId } = await params;
    const memberId = req.nextUrl.searchParams.get("member_id");
    if (!memberId) return apiError("VALIDATION_ERROR", "member_id requis", 422);

    const db = getDb();
    const [deleted] = await db
      .delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.id, memberId)))
      .returning();

    if (!deleted) return apiError("NOT_FOUND", "Membre introuvable", 404);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
