import { pgTable, uuid, integer, varchar, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";

export const creditPurchases = pgTable("credit_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  minutesPurchased: integer("minutes_purchased").notNull(),
  amountCents: integer("amount_cents").notNull(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
