import { pgTable, text, serial, timestamp, numeric, integer, date, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { employeesTable, payRunsTable } from "./payroll";
import { accountsTable } from "./accounts";
import { journalEntriesTable } from "./journalEntries";
import { organizationTable } from "./organization";

export const leaveTypesTable = pgTable("leave_types", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  code: text("code").notNull(),
  paid: boolean("paid").notNull().default(true),
  accrualDaysPerYear: numeric("accrual_days_per_year", { precision: 5, scale: 2 }).notNull().default("0"),
  color: text("color").default("#13B5EA"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const leaveBalancesTable = pgTable("leave_balances", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id, { onDelete: "cascade" }),
  leaveTypeId: integer("leave_type_id").notNull().references(() => leaveTypesTable.id, { onDelete: "cascade" }),
  year: integer("year").notNull(),
  accrued: numeric("accrued", { precision: 6, scale: 2 }).notNull().default("0"),
  used: numeric("used", { precision: 6, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const leaveRequestsTable = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id, { onDelete: "cascade" }),
  leaveTypeId: integer("leave_type_id").notNull().references(() => leaveTypesTable.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  days: numeric("days", { precision: 5, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("pending"), // pending|approved|rejected|cancelled
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const attendanceRecordsTable = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  clockIn: timestamp("clock_in", { withTimezone: true }),
  clockOut: timestamp("clock_out", { withTimezone: true }),
  breakMinutes: integer("break_minutes").notNull().default(0),
  hoursWorked: numeric("hours_worked", { precision: 5, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("present"), // present|absent|leave|holiday|wfh
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const performanceReviewsTable = pgTable("performance_reviews", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id, { onDelete: "cascade" }),
  reviewerName: text("reviewer_name").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  rating: integer("rating"), // 1-5
  strengths: text("strengths"),
  improvements: text("improvements"),
  goals: text("goals"),
  status: text("status").notNull().default("draft"), // draft|submitted|acknowledged
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const employeeDocumentsTable = pgTable("employee_documents", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("other"), // contract|id|certificate|policy|other
  filename: text("filename").notNull(),
  mimeType: text("mime_type"),
  sizeBytes: integer("size_bytes"),
  url: text("url"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).notNull().defaultNow(),
});

// Maps payroll components → chart-of-accounts (BambooHR-style "custom journal builder")
export const payrollAccountMappingsTable = pgTable("payroll_account_mappings", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  component: text("component").notNull(), // salaries_expense | allowances_expense | bonus_expense | overtime_expense | paye_payable | napsa_payable | nhima_payable | net_wages_payable | loan_recoveries
  accountId: integer("account_id").references(() => accountsTable.id),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqComponent: uniqueIndex("uniq_payroll_component").on(t.organizationId, t.component),
}));

export const payrollJournalEntriesTable = pgTable("payroll_journal_entries", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  payRunId: integer("pay_run_id").notNull().references(() => payRunsTable.id, { onDelete: "cascade" }),
  journalId: integer("journal_id").notNull().references(() => journalEntriesTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLeaveTypeSchema = createInsertSchema(leaveTypesTable).omit({ id: true, createdAt: true }).extend({
  name: z.string().min(1),
  code: z.string().min(1),
  accrualDaysPerYear: z.coerce.number().min(0).max(365),
});
export const insertLeaveRequestSchema = z.object({
  employeeId: z.coerce.number().int(),
  leaveTypeId: z.coerce.number().int(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional(),
});
export const insertAttendanceSchema = z.object({
  employeeId: z.coerce.number().int(),
  date: z.string(),
  clockIn: z.string().optional(),
  clockOut: z.string().optional(),
  breakMinutes: z.coerce.number().int().min(0).default(0),
  status: z.enum(["present", "absent", "leave", "holiday", "wfh"]).default("present"),
  notes: z.string().optional(),
});
export const insertReviewSchema = z.object({
  employeeId: z.coerce.number().int(),
  reviewerName: z.string().min(1),
  periodStart: z.string(),
  periodEnd: z.string(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  strengths: z.string().optional(),
  improvements: z.string().optional(),
  goals: z.string().optional(),
  status: z.enum(["draft", "submitted", "acknowledged"]).default("draft"),
});

export type LeaveType = typeof leaveTypesTable.$inferSelect;
export type LeaveBalance = typeof leaveBalancesTable.$inferSelect;
export type LeaveRequest = typeof leaveRequestsTable.$inferSelect;
export type AttendanceRecord = typeof attendanceRecordsTable.$inferSelect;
export type PerformanceReview = typeof performanceReviewsTable.$inferSelect;
export type EmployeeDocument = typeof employeeDocumentsTable.$inferSelect;
export type PayrollAccountMapping = typeof payrollAccountMappingsTable.$inferSelect;
export type PayrollJournalEntry = typeof payrollJournalEntriesTable.$inferSelect;
export type InsertLeaveType = z.infer<typeof insertLeaveTypeSchema>;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;

// Just to keep the (jsonb) export type usable elsewhere if needed
export const _jsonb = jsonb;
