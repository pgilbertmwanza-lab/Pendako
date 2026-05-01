import { pgTable, text, serial, timestamp, numeric, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { bankAccountsTable } from "./bankAccounts";
import { organizationTable } from "./organization";

export const bankTransactionsTable = pgTable("bank_transactions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  bankAccountId: integer("bank_account_id").notNull().references(() => bankAccountsTable.id),
  date: date("date").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }).notNull(),
  type: text("type").notNull(),
  reconciled: boolean("reconciled").notNull().default(false),
  paymentId: integer("payment_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertBankTransactionSchema = createInsertSchema(bankTransactionsTable).omit({ id: true, createdAt: true });
export type InsertBankTransaction = z.infer<typeof insertBankTransactionSchema>;
export type BankTransaction = typeof bankTransactionsTable.$inferSelect;
