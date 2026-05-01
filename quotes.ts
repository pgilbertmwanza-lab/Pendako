import { pgTable, text, serial, timestamp, numeric, integer, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { contactsTable } from "./contacts";
import { organizationTable } from "./organization";

export const quotesTable = pgTable("quotes", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  quoteNumber: text("quote_number").notNull(),
  contactId: integer("contact_id").notNull().references(() => contactsTable.id),
  status: text("status").notNull().default("draft"),
  issueDate: date("issue_date").notNull(),
  expiryDate: date("expiry_date").notNull(),
  currency: text("currency").notNull().default("ZMW"),
  exchangeRate: numeric("exchange_rate", { precision: 18, scale: 8 }).notNull().default("1"),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 15, scale: 2 }).notNull().default("0"),
  reference: text("reference"),
  title: text("title"),
  summary: text("summary"),
  terms: text("terms"),
  // Tax-inclusive pricing flag: when true, line unit prices already include tax.
  taxInclusive: boolean("tax_inclusive").notNull().default(false),
  convertedInvoiceId: integer("converted_invoice_id"),
  // Lifecycle timestamps for the status workflow
  sentAt: timestamp("sent_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  declinedAt: timestamp("declined_at", { withTimezone: true }),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const quoteLineItemsTable = pgTable("quote_line_items", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  quoteId: integer("quote_id").notNull().references(() => quotesTable.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull().default("1"),
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull().default("0"),
  // Per-line discount as a percentage of (quantity * unitPrice)
  discountPct: numeric("discount_pct", { precision: 5, scale: 2 }).notNull().default("0"),
  accountId: integer("account_id"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  lineTotal: numeric("line_total", { precision: 15, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertQuoteSchema = createInsertSchema(quotesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotesTable.$inferSelect;
export type QuoteLineItem = typeof quoteLineItemsTable.$inferSelect;
