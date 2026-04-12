import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const phoneNumbers = pgTable("phone_numbers", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  number: varchar("number", { length: 50 }).notNull(),
  provider: varchar("provider", { length: 20 }).default("sip_trunk"),
  sipTrunkId: uuid("sip_trunk_id"),
  twilioSid: varchar("twilio_sid", { length: 100 }),
  friendlyName: varchar("friendly_name", { length: 255 }),
  countryCode: varchar("country_code", { length: 5 }),
  isActive: boolean("is_active").default(true),
  assignedAgentId: uuid("assigned_agent_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
