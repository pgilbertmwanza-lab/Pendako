import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

// Customisable email templates with token substitution. `kind` selects the
// default template used when sending a particular document type. Tokens
// supported by the email service include: {{customerName}}, {{docNumber}},
// {{total}}, {{dueDate}}, {{orgName}}, {{message}}, {{paymentLink}}.
export const emailTemplatesTable = pgTable("email_templates", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  // kind: "quote" | "invoice" | "payment_receipt" | "reminder"
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  // Marks the template the system picks by default for the given kind. Only
  // one template per kind should be flagged as default at any time.
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type EmailTemplate = typeof emailTemplatesTable.$inferSelect;
