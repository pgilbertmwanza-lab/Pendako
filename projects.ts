import { pgTable, text, serial, timestamp, numeric, integer, date, boolean } from "drizzle-orm/pg-core";
import { contactsTable } from "./contacts";
import { organizationTable } from "./organization";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  projectNumber: text("project_number").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  contactId: integer("contact_id").references(() => contactsTable.id),
  status: text("status").notNull().default("in_progress"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  budget: numeric("budget", { precision: 14, scale: 2 }).default("0"),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).default("0"),
  currency: text("currency").notNull().default("ZMW"),
  estimatedHours: numeric("estimated_hours", { precision: 8, scale: 2 }),
  actualHours: numeric("actual_hours", { precision: 8, scale: 2 }).default("0"),
  amountInvoiced: numeric("amount_invoiced", { precision: 14, scale: 2 }).default("0"),
  amountToBeInvoiced: numeric("amount_to_be_invoiced", { precision: 14, scale: 2 }).default("0"),
  isBillable: boolean("is_billable").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectTasksTable = pgTable("project_tasks", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  rate: numeric("rate", { precision: 10, scale: 2 }).default("0"),
  estimatedHours: numeric("estimated_hours", { precision: 8, scale: 2 }),
  isBillable: boolean("is_billable").notNull().default(true),
  status: text("status").notNull().default("todo"),
});

export const timeEntriesTable = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  projectId: integer("project_id").notNull().references(() => projectsTable.id, { onDelete: "cascade" }),
  taskId: integer("task_id").references(() => projectTasksTable.id),
  staffName: text("staff_name").notNull(),
  date: date("date").notNull(),
  hours: numeric("hours", { precision: 6, scale: 2 }).notNull(),
  description: text("description"),
  isBillable: boolean("is_billable").notNull().default(true),
  isInvoiced: boolean("is_invoiced").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Project = typeof projectsTable.$inferSelect;
export type ProjectTask = typeof projectTasksTable.$inferSelect;
export type TimeEntry = typeof timeEntriesTable.$inferSelect;
