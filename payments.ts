import { pgTable, text, serial, timestamp, numeric, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { organizationTable } from "./organization";

export const paymentsTable = pgTable("payments", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  invoiceId: integer("invoice_id"),
  billId: integer("bill_id"),
  bankAccountId: integer("bank_account_id"),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  date: date("date").notNull(),
  reference: text("reference"),
  // Realised FX gain (positive) / loss (negative) booked when this payment
  // was applied against a foreign-currency invoice or bill at a different
  // spot rate from the original document. In functional currency.
  fxGainLoss: numeric("fx_gain_loss", { precision: 15, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(paymentsTable).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof paymentsTable.$inferSelect;
