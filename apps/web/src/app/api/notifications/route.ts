import { NextRequest } from "next/server";
import { withAuth, apiSuccess, handleApiError } from "@/lib/api-helpers";
import { getDb } from "@/lib/db";
import { notifications } from "@vocalia/db";
import { eq, and, desc, count } from "drizzle-orm";
import { getProfileId } from "@/lib/get-profile-id";

export async function GET(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const db = getDb();
    const profileId = await getProfileId(user);

    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "20");
    const unreadOnly = req.nextUrl.searchParams.get("unread") === "true";

    const conditions = unreadOnly
      ? and(eq(notifications.userId, profileId), eq(notifications.isRead, false))
      : eq(notifications.userId, profileId);

    const items = await db.select()
      .from(notifications)
      .where(conditions)
      .orderBy(desc(notifications.createdAt))
      .limit(limit);

    const [unreadCount] = await db.select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, profileId), eq(notifications.isRead, false)));

    return apiSuccess({
      notifications: items,
      unreadCount: Number(unreadCount?.count ?? 0),
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const { user } = await withAuth();
    const db = getDb();
    const profileId = await getProfileId(user);
    const { ids, markAll } = await req.json();

    if (markAll) {
      await db.update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.userId, profileId), eq(notifications.isRead, false)));
    } else if (ids && Array.isArray(ids)) {
      for (const id of ids) {
        await db.update(notifications)
          .set({ isRead: true })
          .where(and(eq(notifications.id, id), eq(notifications.userId, profileId)));
      }
    }

    return apiSuccess({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
