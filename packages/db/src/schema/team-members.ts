import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { teams } from "./teams";
import { users } from "./users";

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: varchar("role", { length: 50 }).default("member"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
