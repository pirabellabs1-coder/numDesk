import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { conversations } from "./conversations";
import { sentimentEnum } from "./enums";

export const recordings = pgTable("recordings", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "set null" }),
  agentName: text("agent_name"),
  callerNumber: text("caller_number"),
  audioUrl: text("audio_url"),
  durationSeconds: integer("duration_seconds").default(0),
  sentiment: sentimentEnum("sentiment"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
