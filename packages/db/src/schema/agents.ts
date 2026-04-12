import { pgTable, uuid, varchar, text, integer, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { voiceProviderEnum } from "./enums";

export const agents = pgTable("agents", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  vapiAgentId: varchar("vapi_agent_id", { length: 255 }),
  prompt: text("prompt"),
  firstMessage: text("first_message"),
  language: varchar("language", { length: 10 }).default("fr-FR").notNull(),
  voiceProvider: voiceProviderEnum("voice_provider").default("cartesia"),
  voiceId: varchar("voice_id", { length: 255 }),
  llmModel: varchar("llm_model", { length: 100 }).default("gemini-2.5-flash"),
  temperature: decimal("temperature", { precision: 3, scale: 2 }).default("0.4"),
  topP: decimal("top_p", { precision: 3, scale: 2 }).default("1.0"),
  silenceTimeoutSec: integer("silence_timeout_sec").default(7),
  maxSilenceRetries: integer("max_silence_retries").default(2),
  silencePrompt: text("silence_prompt"),
  voicemailEnabled: boolean("voicemail_enabled").default(false),
  voicemailMessage: text("voicemail_message"),
  recordSession: boolean("record_session").default(true),
  recordAudio: boolean("record_audio").default(true),
  isPublished: boolean("is_published").default(false),
  isActive: boolean("is_active").default(true),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  color: varchar("color", { length: 100 }),
  totalCalls: integer("total_calls").default(0),
  avgDurationSeconds: integer("avg_duration_seconds").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
