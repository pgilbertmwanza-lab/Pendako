import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { organizationTable } from "./organization";

export const contactsTable = pgTable("contacts", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  type: text("type").notNull().default("customer"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  taxNumber: text("tax_number"),
  accountNumber: text("account_number"),
  defaultCurrency: text("default_currency").notNull().default("ZMW"),
  // Default payment terms in days, used to derive invoice/quote due dates.
  paymentTermsDays: integer("payment_terms_days").notNull().default(14),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertContactSchema = createInsertSchema(contactsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contactsTable.$inferSelect;
