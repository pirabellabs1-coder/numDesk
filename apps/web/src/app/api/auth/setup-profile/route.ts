import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { users } from "@vocalia/db";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const { user } = await withAuth();
    const db = getDb();

    // Check if user profile already exists
    const existing = await db.select().from(users).where(eq(users.authId, user.id));
    if (existing.length > 0) {
      return apiSuccess(existing[0]);
    }

    // Create user profile
    try {
      const [created] = await db.insert(users).values({
        authId: user.id,
        email: user.email ?? "",
        firstName: user.user_metadata?.first_name ?? null,
        lastName: user.user_metadata?.last_name ?? null,
        agencyName: user.user_metadata?.agency_name ?? null,
        role: "member",
      }).returning();

      // Send welcome notification with beautiful email template
      try {
        const { notifyWelcome, notifyAdminNewUser } = await import("@/lib/notification-service");
        const firstName = user.user_metadata?.first_name || user.email?.split("@")[0] || "Utilisateur";
        const planSlug = user.user_metadata?.plan_slug || "trial";
        const planNames: Record<string, string> = { trial: "Essai gratuit", starter: "Starter", pro: "Pro", enterprise: "Enterprise" };
        const planName = planNames[planSlug] || "Essai gratuit";

        await notifyWelcome(created!.id, firstName, planName);

        // Notify admin of new user
        const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
        if (adminEmail) {
          const fullName = [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ") || user.email || "Inconnu";
          await notifyAdminNewUser(adminEmail, fullName, user.email || "", planName);
        }
      } catch {}

      return apiSuccess(created, 201);
    } catch {
      // Duplicate — race condition, just fetch
      const [found] = await db.select().from(users).where(eq(users.authId, user.id));
      return apiSuccess(found);
    }
  } catch (error) {
    return handleApiError(error);
  }
}
