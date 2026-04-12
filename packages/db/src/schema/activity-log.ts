import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { activityTypeEnum } from "./enums";

export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  type: activityTypeEnum("type").notNull(),
  description: text("description").notNull(),
  detail: text("detail"),
  userId: uuid("user_id"),
  userName: varchar("user_name", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
