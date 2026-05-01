import { pgTable, text, serial, timestamp, numeric, integer, date, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accountsTable } from "./accounts";
import { organizationTable } from "./organization";

export const journalEntriesTable = pgTable(
  "journal_entries",
  {
    id: serial("id").primaryKey(),
    organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
    entryNumber: text("entry_number").notNull(),
    entryDate: date("entry_date").notNull(),
    status: text("status").notNull().default("posted"),
    narration: text("narration").notNull(),
    reference: text("reference"),
    sourceType: text("source_type"),
    sourceId: integer("source_id"),
    currency: text("currency").notNull().default("ZMW"),
    exchangeRate: numeric("exchange_rate", { precision: 18, scale: 8 }).notNull().default("1"),
    totalDebit: numeric("total_debit", { precision: 15, scale: 2 }).notNull().default("0"),
    totalCredit: numeric("total_credit", { precision: 15, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [
    index("journal_entries_org_date_idx").on(t.organizationId, t.entryDate),
    index("journal_entries_source_idx").on(t.organizationId, t.sourceType, t.sourceId),
  ],
);

export const journalLinesTable = pgTable(
  "journal_lines",
  {
    id: serial("id").primaryKey(),
    organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
    entryId: integer("entry_id").notNull().references(() => journalEntriesTable.id, { onDelete: "cascade" }),
    accountId: integer("account_id").notNull().references(() => accountsTable.id),
    description: text("description"),
    debit: numeric("debit", { precision: 15, scale: 2 }).notNull().default("0"),
    credit: numeric("credit", { precision: 15, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("journal_lines_org_account_entry_idx").on(t.organizationId, t.accountId, t.entryId),
    index("journal_lines_org_entry_idx").on(t.organizationId, t.entryId),
  ],
);

export const insertJournalEntrySchema = createInsertSchema(journalEntriesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntriesTable.$inferSelect;
export type JournalLine = typeof journalLinesTable.$inferSelect;
