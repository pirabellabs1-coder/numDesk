import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { workspaces } from "./workspaces";

export const workspaceInvitations = pgTable("workspace_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).unique().notNull(),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  invitedBy: uuid("invited_by").references(() => users.id).notNull(),
  accepted: boolean("accepted").default(false).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
