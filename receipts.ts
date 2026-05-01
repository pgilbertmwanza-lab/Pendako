import { pgTable, text, serial, integer, timestamp, numeric, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

// Customer-facing receipts. Auto-generated whenever money is received:
//   - kind="invoice_payment" — created when a payment is recorded against an invoice
//   - kind="pos_sale"        — created when a POS sale completes
//   - kind="direct"          — created for a standalone receipt (cash sale, deposit, etc.)
//
// Receipts are immutable once issued. Edits are not allowed; the only mutation
// is `void` which marks the receipt cancelled and stores a reason. The row is
// retained so the receipt number stays unique and the audit trail is preserved.
export const receiptsTable = pgTable("receipts", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  receiptNumber: text("receipt_number").notNull(),
  // "invoice_payment" | "pos_sale" | "direct"
  kind: text("kind").notNull(),
  contactId: integer("contact_id"),
  paymentMethod: text("payment_method"),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("ZMW"),
  paymentDate: text("payment_date").notNull(),
  reference: text("reference"),
  paymentId: integer("payment_id"),
  saleId: integer("sale_id"),
  // Array of invoice ids the receipt covers; usually one but supports
  // multi-invoice payments later.
  invoiceIds: jsonb("invoice_ids").$type<number[]>().notNull().default([]),
  notes: text("notes"),
  isVoid: boolean("is_void").notNull().default(false),
  voidReason: text("void_reason"),
  voidedAt: timestamp("voided_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: text("created_by"),
}, (t) => ({
  uniqReceiptNumber: uniqueIndex("uniq_receipt_number").on(t.organizationId, t.receiptNumber),
}));

export type Receipt = typeof receiptsTable.$inferSelect;
export type NewReceipt = typeof receiptsTable.$inferInsert;
