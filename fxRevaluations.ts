import { pgTable, serial, integer, text, numeric, date, timestamp } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

// IAS 21 month/period-end revaluation of open foreign-currency monetary
// balances (AR, AP, foreign cash). Each `run` is a snapshot at a given
// `asOfDate`; lines store the per-account-per-currency adjustment that was
// posted to unrealised FX gain/loss. The journal is posted today and
// reversed the next day (standard pattern), so the next run starts clean.

export const fxRevaluationRunsTable = pgTable("fx_revaluation_runs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  asOfDate: date("as_of_date").notNull(),
  status: text("status").notNull().default("draft"), // draft | posted | reversed
  // Functional currency the run is expressed in (org's baseCurrency at run time).
  functionalCurrency: text("functional_currency").notNull(),
  totalGain: numeric("total_gain", { precision: 18, scale: 2 }).notNull().default("0"),
  totalLoss: numeric("total_loss", { precision: 18, scale: 2 }).notNull().default("0"),
  netAdjustment: numeric("net_adjustment", { precision: 18, scale: 2 }).notNull().default("0"),
  // Journal entries posted as part of this run.
  journalEntryId: integer("journal_entry_id"),
  reversalJournalEntryId: integer("reversal_journal_entry_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  postedAt: timestamp("posted_at", { withTimezone: true }),
});

export const fxRevaluationLinesTable = pgTable("fx_revaluation_lines", {
  id: serial("id").primaryKey(),
  runId: integer("run_id").notNull().references(() => fxRevaluationRunsTable.id, { onDelete: "cascade" }),
  accountId: integer("account_id").notNull(),
  currency: text("currency").notNull(),
  // Outstanding balance in the foreign currency.
  foreignBalance: numeric("foreign_balance", { precision: 18, scale: 2 }).notNull(),
  oldRate: numeric("old_rate", { precision: 18, scale: 8 }).notNull(),
  newRate: numeric("new_rate", { precision: 18, scale: 8 }).notNull(),
  oldFunctionalBalance: numeric("old_functional_balance", { precision: 18, scale: 2 }).notNull(),
  newFunctionalBalance: numeric("new_functional_balance", { precision: 18, scale: 2 }).notNull(),
  // Positive = unrealised gain (asset/AR went up, or liability/AP went down).
  // Negative = unrealised loss.
  adjustment: numeric("adjustment", { precision: 18, scale: 2 }).notNull(),
});

export type FxRevaluationRun = typeof fxRevaluationRunsTable.$inferSelect;
export type FxRevaluationLine = typeof fxRevaluationLinesTable.$inferSelect;
