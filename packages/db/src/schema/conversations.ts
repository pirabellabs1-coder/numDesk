import { pgTable, uuid, varchar, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { agents } from "./agents";
import { callTypeEnum, callDirectionEnum, callStatusEnum, sentimentEnum } from "./enums";

export const conversations = pgTable("conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "set null" }),
  vapiCallId: varchar("vapi_call_id", { length: 255 }).unique(),
  type: callTypeEnum("type").default("phone"),
  direction: callDirectionEnum("direction").default("inbound"),
  callerNumber: varchar("caller_number", { length: 50 }),
  phoneNumberId: uuid("phone_number_id"),
  status: callStatusEnum("status").default("ended"),
  sentiment: sentimentEnum("sentiment"),
  durationSeconds: integer("duration_seconds"),
  costCents: integer("cost_cents"),
  isBilled: boolean("is_billed").default(false),
  transcript: jsonb("transcript").$type<Array<{ role: string; content: string; ts: string }>>(),
  summary: text("summary"),
  tags: text("tags").array(),
  audioUrl: text("audio_url"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
