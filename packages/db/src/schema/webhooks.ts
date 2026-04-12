import { pgTable, uuid, text, boolean, varchar, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const webhooks = pgTable("webhooks", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  events: text("events").array(),
  secret: varchar("secret", { length: 255 }),
  isActive: boolean("is_active").default(true),
  lastTriggeredAt: timestamp("last_triggered_at", { withTimezone: true }),
  lastStatusCode: varchar("last_status_code", { length: 10 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
