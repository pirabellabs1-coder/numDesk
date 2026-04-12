import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaceInvitations, workspaceMembers, users } from "@vocalia/db";
import { eq, and } from "drizzle-orm";

async function getProfileId(authUser: any) {
  const db = getDb();
  const [profile] = await db.select().from(users).where(eq(users.authId, authUser.id));
  return profile?.id;
}

// POST — Accept invitation by token
export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const userId = await getProfileId(user);
    if (!userId) return apiError("UNAUTHORIZED", "Utilisateur introuvable", 401);
    const { token } = await req.json();

    if (!token) return apiError("VALIDATION_ERROR", "Token requis", 422);

    const db = getDb();

    // Find invitation
    const [invitation] = await db
      .select()
      .from(workspaceInvitations)
      .where(and(eq(workspaceInvitations.token, token), eq(workspaceInvitations.accepted, false)));

    if (!invitation) {
      return apiError("NOT_FOUND", "Invitation introuvable ou déjà acceptée", 404);
    }

    // Check expiry
    if (new Date() > new Date(invitation.expiresAt)) {
      return apiError("GONE", "Cette invitation a expiré", 410);
    }

    // Check if already a member
    const [existing] = await db
      .select()
      .from(workspaceMembers)
      .where(and(eq(workspaceMembers.workspaceId, invitation.workspaceId), eq(workspaceMembers.userId, userId)));

    if (existing) {
      // Mark invitation as accepted anyway
      await db.update(workspaceInvitations).set({ accepted: true }).where(eq(workspaceInvitations.id, invitation.id));
      return apiSuccess({ message: "Vous êtes déjà membre de ce workspace", workspaceId: invitation.workspaceId });
    }

    // Add as member
    await db.insert(workspaceMembers).values({
      workspaceId: invitation.workspaceId,
      userId,
      role: invitation.role,
      invitedBy: invitation.invitedBy,
    });

    // Mark invitation as accepted
    await db.update(workspaceInvitations).set({ accepted: true }).where(eq(workspaceInvitations.id, invitation.id));

    return apiSuccess({ message: "Invitation acceptée", workspaceId: invitation.workspaceId });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE — Cancel/revoke invitation
export async function DELETE(req: NextRequest) {
  try {
    await withAuth();
    const invitationId = req.nextUrl.searchParams.get("id");
    if (!invitationId) return apiError("VALIDATION_ERROR", "id requis", 422);

    const db = getDb();
    await db.delete(workspaceInvitations).where(eq(workspaceInvitations.id, invitationId));

    return apiSuccess({ message: "Invitation annulée" });
  } catch (error) {
    return handleApiError(error);
  }
}
