import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

// Records every outbound email attempt for quotes, invoices, payment receipts,
// and reminders. Status is one of "sent", "failed", or "queued".
export const emailLogsTable = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  // entityType: "quote" | "invoice" | "payment_receipt" | "reminder"
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  recipient: text("recipient").notNull(),
  cc: text("cc"),
  bcc: text("bcc"),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  attachmentName: text("attachment_name"),
  status: text("status").notNull().default("queued"),
  error: text("error"),
  // The user (or "system") who triggered the email.
  sentBy: text("sent_by"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmailLog = typeof emailLogsTable.$inferSelect;
