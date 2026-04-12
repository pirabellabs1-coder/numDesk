import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { suggestionTypeEnum, suggestionImpactEnum } from "./enums";

export const suggestions = pgTable("suggestions", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  agentId: uuid("agent_id"),
  type: suggestionTypeEnum("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  impact: suggestionImpactEnum("impact").default("medium"),
  applied: boolean("applied").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
