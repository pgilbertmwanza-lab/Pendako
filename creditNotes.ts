import { pgTable, text, serial, timestamp, numeric, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contactsTable } from "./contacts";
import { organizationTable } from "./organization";

export const creditNotesTable = pgTable("credit_notes", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  creditNoteNumber: text("credit_note_number").notNull(),
  contactId: integer("contact_id").notNull().references(() => contactsTable.id),
  type: text("type").notNull().default("sales"),
  status: text("status").notNull().default("draft"),
  issueDate: date("issue_date").notNull(),
  currency: text("currency").notNull().default("ZMW"),
  exchangeRate: numeric("exchange_rate", { precision: 18, scale: 8 }).notNull().default("1"),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 15, scale: 2 }).notNull().default("0"),
  remainingCredit: numeric("remaining_credit", { precision: 15, scale: 2 }).notNull().default("0"),
  reference: text("reference"),
  reason: text("reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const creditNoteLineItemsTable = pgTable("credit_note_line_items", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  creditNoteId: integer("credit_note_id").notNull().references(() => creditNotesTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull().default("0"),
  accountId: integer("account_id"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  lineTotal: numeric("line_total", { precision: 15, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCreditNoteSchema = createInsertSchema(creditNotesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCreditNote = z.infer<typeof insertCreditNoteSchema>;
export type CreditNote = typeof creditNotesTable.$inferSelect;
export type CreditNoteLineItem = typeof creditNoteLineItemsTable.$inferSelect;
