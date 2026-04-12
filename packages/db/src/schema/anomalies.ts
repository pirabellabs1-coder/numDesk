import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { anomalyTypeEnum, anomalySeverityEnum } from "./enums";

export const anomalies = pgTable("anomalies", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  type: anomalyTypeEnum("type").notNull(),
  severity: anomalySeverityEnum("severity").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  agentId: uuid("agent_id"),
  resolved: boolean("resolved").default(false),
  detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
});
