import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { sentimentEnum } from "./enums";

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  tags: text("tags").array(),
  totalCalls: integer("total_calls").default(0),
  lastCallDate: timestamp("last_call_date", { withTimezone: true }),
  lastAgentId: uuid("last_agent_id"),
  sentiment: sentimentEnum("sentiment"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
