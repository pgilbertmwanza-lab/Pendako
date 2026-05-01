import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

// Records the most recent opening balances setup. There is only ever one row
// (singleton); re-running the wizard reverses the prior journal/invoices/bills
// and writes a fresh entry. The actual ledger impact lives in:
//   - journal_entries (one balanced "Opening Balances" entry)
//   - invoices.is_opening_balance = true rows for AR balances
//   - bills.is_opening_balance = true rows for AP balances
export const openingBalanceRunsTable = pgTable("opening_balance_runs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  asOfDate: text("as_of_date").notNull(),
  journalEntryId: integer("journal_entry_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  // We keep historical runs around so users can see what was previously set,
  // but only one is "active". Setting a new run flips this flag.
  isActive: boolean("is_active").notNull().default(true),
});

export type OpeningBalanceRun = typeof openingBalanceRunsTable.$inferSelect;

// Per-account opening balance line. Stored for audit + re-edit; the actual GL
// impact is via the linked journal entry above.
export const openingBalanceLinesTable = pgTable("opening_balance_lines", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  runId: integer("run_id").notNull(),
  accountId: integer("account_id").notNull(),
  // "DR" or "CR"
  side: text("side").notNull(),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
});

export type OpeningBalanceLine = typeof openingBalanceLinesTable.$inferSelect;
