import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const offers = pgTable("offers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).unique(),
  description: text("description"),
  minutesIncluded: integer("minutes_included").notNull(),
  priceMonthly: integer("price_monthly_cents").notNull(),
  pricePerMinuteCents: integer("price_per_minute_cents").default(5),
  overageRateCents: integer("overage_rate_cents").default(5),
  maxAgents: integer("max_agents"),
  maxWorkspaces: integer("max_workspaces"),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const alerts = pgTable("platform_alerts", {
  id: uuid("id").primaryKey().defaultRandom(),
  type: varchar("type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: varchar("message", { length: 1000 }),
  isAcknowledged: boolean("is_acknowledged").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
