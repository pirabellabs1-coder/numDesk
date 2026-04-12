import { pgTable, uuid, varchar, integer, date, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { offerTypeEnum, planSlugEnum } from "./enums";

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  planSlug: planSlugEnum("plan_slug").default("trial").notNull(),
  offerType: offerTypeEnum("offer_type").default("minutes").notNull(),
  minutesIncluded: integer("minutes_included").default(5).notNull(),
  minutesUsed: integer("minutes_used").default(0).notNull(),
  minutesOverageLimit: integer("minutes_overage_limit"),
  overageRateCents: integer("overage_rate_cents"),
  cycleStartDate: date("cycle_start_date"),
  cycleDurationDays: integer("cycle_duration_days").default(30).notNull(),
  vapiWorkspaceId: varchar("vapi_workspace_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
