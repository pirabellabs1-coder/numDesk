import { pgTable, uuid, varchar, integer, jsonb, timestamp, time } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { agents } from "./agents";
import { campaignStatusEnum } from "./enums";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "set null" }),
  phoneNumberId: uuid("phone_number_id"),
  name: varchar("name", { length: 255 }).notNull(),
  status: campaignStatusEnum("status").default("draft").notNull(),
  contacts: jsonb("contacts").$type<Array<{ name: string; phone: string; variables?: Record<string, string> }>>(),
  totalContacts: integer("total_contacts").default(0),
  calledCount: integer("called_count").default(0),
  successCount: integer("success_count").default(0),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  callWindowStart: time("call_window_start"),
  callWindowEnd: time("call_window_end"),
  maxRetries: integer("max_retries").default(2),
  retryDelayMinutes: integer("retry_delay_minutes").default(60),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
