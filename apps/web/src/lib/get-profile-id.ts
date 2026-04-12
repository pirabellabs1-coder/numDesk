import { getDb } from "@/lib/db";
import { users } from "@vocalia/db";
import { eq } from "drizzle-orm";

/**
 * Get the internal user profile ID from the Supabase Auth user.
 * Creates the profile if it doesn't exist.
 */
export async function getProfileId(authUser: { id: string; email?: string; user_metadata?: any }): Promise<string> {
  const db = getDb();
  let [profile] = await db.select().from(users).where(eq(users.authId, authUser.id));

  if (!profile) {
    try {
      [profile] = await db.insert(users).values({
        authId: authUser.id,
        email: authUser.email ?? "",
        firstName: authUser.user_metadata?.first_name ?? null,
        lastName: authUser.user_metadata?.last_name ?? null,
        agencyName: authUser.user_metadata?.agency_name ?? null,
        role: "member",
      }).returning();
    } catch {
      // Race condition
      [profile] = await db.select().from(users).where(eq(users.authId, authUser.id));
    }
  }

  return profile!.id;
}
