import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { agents } from "./agents";
import { versionStatusEnum } from "./enums";

export const agentVersions = pgTable("agent_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: uuid("agent_id").references(() => agents.id, { onDelete: "cascade" }).notNull(),
  version: varchar("version", { length: 20 }).notNull(),
  status: versionStatusEnum("status").default("archived").notNull(),
  author: varchar("author", { length: 255 }),
  changes: text("changes"),
  promptPreview: text("prompt_preview"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
