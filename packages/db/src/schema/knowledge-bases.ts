import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { kbModeEnum } from "./enums";

export const knowledgeBases = pgTable("knowledge_bases", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  mode: kbModeEnum("mode").default("full_context").notNull(),
  vapiKbId: varchar("vapi_kb_id", { length: 255 }),
  content: text("content"),
  files: jsonb("files").$type<Array<{ name: string; url: string; size: number; type: string }>>(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
