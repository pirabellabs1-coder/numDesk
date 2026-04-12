import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { noteActionEnum } from "./enums";

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  conversationId: uuid("conversation_id"),
  author: varchar("author", { length: 255 }).notNull(),
  content: text("content").notNull(),
  action: noteActionEnum("action").default("none"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
