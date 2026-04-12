import { pgTable, uuid, integer, date, varchar, timestamp } from "drizzle-orm/pg-core";
import { workspaces } from "./workspaces";
import { billingStatusEnum } from "./enums";

export const billingCycles = pgTable("billing_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }).notNull(),
  cycleStart: date("cycle_start").notNull(),
  cycleEnd: date("cycle_end").notNull(),
  minutesIncluded: integer("minutes_included").notNull(),
  minutesUsed: integer("minutes_used").default(0),
  minutesOverage: integer("minutes_overage").default(0),
  amountBaseCents: integer("amount_base_cents"),
  amountOverageCents: integer("amount_overage_cents"),
  amountTotalCents: integer("amount_total_cents"),
  stripeInvoiceId: varchar("stripe_invoice_id", { length: 100 }),
  status: billingStatusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
