import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { leadStageEnum } from "./enums";

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  value: varchar("value", { length: 50 }),
  source: varchar("source", { length: 100 }),
  stage: leadStageEnum("stage").default("new").notNull(),
  agentId: uuid("agent_id"),
  lastContactDate: timestamp("last_contact_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
