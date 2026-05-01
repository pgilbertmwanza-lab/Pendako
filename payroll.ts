import { pgTable, text, serial, timestamp, numeric, integer, date, jsonb } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

export const employeesTable = pgTable("employees", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeCode: text("employee_code").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  jobTitle: text("job_title"),
  department: text("department"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  employmentType: text("employment_type").notNull().default("full_time"),
  payType: text("pay_type").notNull().default("salary"),
  salary: numeric("salary", { precision: 12, scale: 2 }).notNull().default("0"),
  hourlyRate: numeric("hourly_rate", { precision: 12, scale: 2 }).default("0"),
  // Standing allowances added to every pay run for this employee
  allowances: jsonb("allowances").$type<Array<{ name: string; amount: number; taxable?: boolean }>>().default([]),
  currency: text("currency").notNull().default("ZMW"),
  taxNumber: text("tax_number"),
  napsa: text("napsa"),
  nhima: text("nhima"),
  bankAccount: text("bank_account"),
  status: text("status").notNull().default("active"),
  // BambooHR-style profile fields
  nrc: text("nrc"),
  gender: text("gender"),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  nextOfKin: text("next_of_kin"),
  managerId: integer("manager_id"),
  profileImageUrl: text("profile_image_url"),
  terminationReason: text("termination_reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const payRunsTable = pgTable("pay_runs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  payRunNumber: text("pay_run_number").notNull(),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  paymentDate: date("payment_date").notNull(),
  status: text("status").notNull().default("draft"), // draft|review|approved|posted|locked
  totalGross: numeric("total_gross", { precision: 14, scale: 2 }).notNull().default("0"),
  totalAllowances: numeric("total_allowances", { precision: 14, scale: 2 }).notNull().default("0"),
  totalOvertime: numeric("total_overtime", { precision: 14, scale: 2 }).notNull().default("0"),
  totalBonus: numeric("total_bonus", { precision: 14, scale: 2 }).notNull().default("0"),
  totalTax: numeric("total_tax", { precision: 14, scale: 2 }).notNull().default("0"),
  totalNapsa: numeric("total_napsa", { precision: 14, scale: 2 }).notNull().default("0"),
  totalNhima: numeric("total_nhima", { precision: 14, scale: 2 }).notNull().default("0"),
  totalDeductions: numeric("total_deductions", { precision: 14, scale: 2 }).notNull().default("0"),
  totalNet: numeric("total_net", { precision: 14, scale: 2 }).notNull().default("0"),
  currency: text("currency").notNull().default("ZMW"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payslipsTable = pgTable("payslips", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  payRunId: integer("pay_run_id").notNull().references(() => payRunsTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id),
  basicPay: numeric("basic_pay", { precision: 12, scale: 2 }).notNull().default("0"),
  allowances: numeric("allowances", { precision: 12, scale: 2 }).notNull().default("0"),
  allowancesBreakdown: jsonb("allowances_breakdown").$type<Array<{ name: string; amount: number }>>().default([]),
  overtime: numeric("overtime", { precision: 12, scale: 2 }).notNull().default("0"),
  bonus: numeric("bonus", { precision: 12, scale: 2 }).notNull().default("0"),
  grossPay: numeric("gross_pay", { precision: 12, scale: 2 }).notNull().default("0"),
  payeTax: numeric("paye_tax", { precision: 12, scale: 2 }).notNull().default("0"),
  napsaContrib: numeric("napsa_contrib", { precision: 12, scale: 2 }).notNull().default("0"),
  nhimaContrib: numeric("nhima_contrib", { precision: 12, scale: 2 }).notNull().default("0"),
  loanRepayments: numeric("loan_repayments", { precision: 12, scale: 2 }).notNull().default("0"),
  otherDeductions: numeric("other_deductions", { precision: 12, scale: 2 }).notNull().default("0"),
  netPay: numeric("net_pay", { precision: 12, scale: 2 }).notNull().default("0"),
  hoursWorked: numeric("hours_worked", { precision: 8, scale: 2 }),
  notes: text("notes"),
});

export const timesheetsTable = pgTable("timesheets", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employeesTable.id),
  weekStart: date("week_start").notNull(),
  totalHours: numeric("total_hours", { precision: 6, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("draft"),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Employee = typeof employeesTable.$inferSelect;
export type PayRun = typeof payRunsTable.$inferSelect;
export type Payslip = typeof payslipsTable.$inferSelect;
export type Timesheet = typeof timesheetsTable.$inferSelect;
