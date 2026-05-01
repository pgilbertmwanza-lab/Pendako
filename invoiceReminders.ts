import { pgTable, text, serial, integer, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { organizationTable } from "./organization";

// Configurable reminder rules. Each rule fires for invoices in approved/sent/
// partially_paid status that match the rule's offset relative to the invoice's
// due date. The scheduler dedupes via `invoiceRemindersSentTable` so the same
// (invoice, rule) pair can never be sent twice.
//
// trigger:
//   - "before_due"  → fires when (today + daysOffset) === dueDate
//   - "on_due"      → fires when today === dueDate
//   - "after_due"   → fires when (today - daysOffset) === dueDate
export const invoiceReminderRulesTable = pgTable("invoice_reminder_rules", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  trigger: text("trigger").notNull(), // before_due | on_due | after_due
  daysOffset: integer("days_offset").notNull().default(0),
  templateId: integer("template_id"), // nullable -> use default reminder template
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type InvoiceReminderRule = typeof invoiceReminderRulesTable.$inferSelect;

// Audit row for every reminder dispatched. Used both as a dedupe guard and as
// the per-invoice "Reminder history" panel in the UI.
export const invoiceRemindersSentTable = pgTable("invoice_reminders_sent", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  invoiceId: integer("invoice_id").notNull(),
  ruleId: integer("rule_id"),
  emailLogId: integer("email_log_id"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  // "auto" (scheduler) | "manual" (user clicked Send Reminder)
  source: text("source").notNull().default("auto"),
}, (t) => ({
  // Partial unique index: at most one auto-sent reminder per (invoice, rule).
  // Manual sends are NOT deduped — users may resend on demand.
  uniqAutoPerInvoiceRule: uniqueIndex("uniq_auto_reminder_per_invoice_rule")
    .on(t.invoiceId, t.ruleId)
    .where(sql`source = 'auto' AND rule_id IS NOT NULL`),
}));

export type InvoiceReminderSent = typeof invoiceRemindersSentTable.$inferSelect;
