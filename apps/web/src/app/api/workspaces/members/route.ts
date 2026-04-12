import { NextRequest } from "next/server";
import { withAuth, apiSuccess, apiError, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { workspaceMembers, workspaceInvitations, users, workspaces } from "@vocalia/db";
import { eq, and } from "drizzle-orm";
import { sendDirectEmail } from "@/lib/notification-service";
import { randomUUID } from "crypto";

async function getProfileId(authUser: any) {
  const db = getDb();
  const [profile] = await db.select().from(users).where(eq(users.authId, authUser.id));
  return profile?.id;
}

// GET — List workspace members + pending invitations
export async function GET(req: NextRequest) {
  try {
    await withAuth();
    const workspaceId = req.nextUrl.searchParams.get("workspace_id");
    if (!workspaceId) return apiSuccess({ members: [], invitations: [] });

    const db = getDb();

    // Get workspace owner
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!workspace) return apiError("NOT_FOUND", "Workspace introuvable", 404);

    // Get owner info
    const [owner] = await db.select().from(users).where(eq(users.id, workspace.userId));

    // Get members
    const memberRows = await db
      .select({
        id: workspaceMembers.id,
        userId: workspaceMembers.userId,
        role: workspaceMembers.role,
        joinedAt: workspaceMembers.joinedAt,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        avatarUrl: users.avatarUrl,
      })
      .from(workspaceMembers)
      .leftJoin(users, eq(workspaceMembers.userId, users.id))
      .where(eq(workspaceMembers.workspaceId, workspaceId));

    // Get pending invitations
    const invitationRows = await db
      .select()
      .from(workspaceInvitations)
      .where(and(eq(workspaceInvitations.workspaceId, workspaceId), eq(workspaceInvitations.accepted, false)));

    // Build full member list (owner + members)
    const allMembers = [
      {
        id: "owner",
        userId: workspace.userId,
        role: "owner",
        joinedAt: workspace.createdAt,
        email: owner?.email || "",
        firstName: owner?.firstName || "",
        lastName: owner?.lastName || "",
        avatarUrl: owner?.avatarUrl || null,
      },
      ...memberRows,
    ];

    return apiSuccess({ members: allMembers, invitations: invitationRows });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST — Send invitation
export async function POST(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const userId = await getProfileId(user);
    if (!userId) return apiError("UNAUTHORIZED", "Utilisateur introuvable", 401);
    const { workspaceId, email, role } = await req.json();

    if (!workspaceId || !email) {
      return apiError("VALIDATION_ERROR", "workspaceId et email requis", 422);
    }

    const db = getDb();

    // Verify workspace exists and user has access
    const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (!workspace) return apiError("NOT_FOUND", "Workspace introuvable", 404);
    if (workspace.userId !== userId) {
      return apiError("FORBIDDEN", "Seul le propriétaire peut inviter des membres", 403);
    }

    // Check if user is already a member
    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
    if (existingUser) {
      const [existingMember] = await db
        .select()
        .from(workspaceMembers)
        .where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, existingUser.id)));
      if (existingMember) {
        return apiError("CONFLICT", "Cet utilisateur est déjà membre de ce workspace", 409);
      }
      if (existingUser.id === workspace.userId) {
        return apiError("CONFLICT", "Vous ne pouvez pas vous inviter vous-même", 409);
      }
    }

    // Check if invitation already pending
    const [existingInvite] = await db
      .select()
      .from(workspaceInvitations)
      .where(and(
        eq(workspaceInvitations.workspaceId, workspaceId),
        eq(workspaceInvitations.email, email.toLowerCase()),
        eq(workspaceInvitations.accepted, false),
      ));
    if (existingInvite) {
      return apiError("CONFLICT", "Une invitation est déjà en attente pour cet email", 409);
    }

    // Create invitation token
    const token = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const [invitation] = await db.insert(workspaceInvitations).values({
      workspaceId,
      email: email.toLowerCase(),
      token,
      role: role || "member",
      invitedBy: userId,
      expiresAt,
    }).returning();

    // Get inviter info for the email
    const [inviter] = await db.select().from(users).where(eq(users.id, userId));
    const inviterName = `${inviter?.firstName || ""} ${inviter?.lastName || ""}`.trim() || inviter?.email || "Un membre";

    // Send invitation email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://callpme.com";
    const acceptUrl = `${baseUrl}/invite/${token}`;

    const emailHtml = buildInvitationEmail(inviterName, workspace.name, acceptUrl);
    await sendDirectEmail(email.toLowerCase(), `${inviterName} vous invite à rejoindre "${workspace.name}" sur Callpme`, emailHtml);

    return apiSuccess({ invitation, message: "Invitation envoyée" });
  } catch (error) {
    return handleApiError(error);
  }
}

function buildInvitationEmail(inviterName: string, workspaceName: string, acceptUrl: string) {
  return `
    <div style="font-family:'Inter',system-ui,sans-serif;max-width:580px;margin:0 auto;padding:40px 20px;background:#0A0B0F;">
      <div style="background:#121317;border-radius:16px;border:1px solid rgba(255,255,255,0.05);padding:40px 36px;">
        <div style="text-align:center;margin-bottom:32px;">
          <span style="font-size:26px;font-weight:800;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Callpme</span>
        </div>

        <h2 style="color:#E3E2E8;font-size:22px;text-align:center;margin:0 0 8px;font-weight:700;">
          Vous êtes invité !
        </h2>
        <p style="color:#8B90B0;font-size:14px;text-align:center;line-height:1.6;margin:0 0 32px;">
          <strong style="color:#E3E2E8;">${inviterName}</strong> vous invite à rejoindre le workspace <strong style="color:#E3E2E8;">"${workspaceName}"</strong> sur Callpme.
        </p>

        <div style="text-align:center;margin:32px 0;">
          <a href="${acceptUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#4F7FFF,#7B5CFA);color:#ffffff;text-decoration:none;border-radius:12px;font-weight:700;font-size:15px;letter-spacing:0.5px;">
            Accepter l'invitation
          </a>
        </div>

        <p style="color:#5A5D73;font-size:12px;text-align:center;line-height:1.6;margin-top:24px;">
          Ce lien expire dans 7 jours. Si vous n'avez pas de compte Callpme, un compte sera créé automatiquement.
        </p>

        <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
          <p style="color:#434654;font-size:11px;">Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.</p>
        </div>
      </div>
      <p style="color:#5A5D73;font-size:11px;text-align:center;margin-top:24px;">Callpme — Une solution Pirabel Labs</p>
    </div>
  `;
}
