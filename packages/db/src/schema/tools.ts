import { pgTable, uuid, varchar, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { httpMethodEnum } from "./enums";

export const tools = pgTable("tools", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  displayName: varchar("display_name", { length: 255 }),
  description: text("description"),
  method: httpMethodEnum("method").default("GET"),
  url: text("url"),
  headers: jsonb("headers").$type<Record<string, string>>(),
  parameters: jsonb("parameters"),
  timeoutMs: integer("timeout_ms").default(5000),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
