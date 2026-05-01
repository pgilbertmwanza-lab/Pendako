import { pgTable, text, serial, timestamp, numeric, integer, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  tagline: text("tagline"),
  category: text("category").notNull(),
  monthlyPrice: numeric("monthly_price", { precision: 12, scale: 2 }).notNull(),
  annualPrice: numeric("annual_price", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("ZMW"),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  limits: jsonb("limits").$type<{
    invoicesPerMonth?: number | null;
    bills?: number | null;
    users?: number | null;
    bankAccounts?: number | null;
    payrollEmployees?: number | null;
    projects?: number | null;
  }>().notNull().default({}),
  popular: boolean("popular").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uniqCode: uniqueIndex("uniq_plan_code").on(t.code),
}));

export const organizationSubscriptionTable = pgTable("organization_subscription", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  planId: integer("plan_id").notNull().references(() => subscriptionPlansTable.id),
  status: text("status").notNull().default("active"),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }).notNull().defaultNow(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  trialEnd: timestamp("trial_end", { withTimezone: true }),
  paymentMethod: text("payment_method").default("invoice"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const subscriptionInvoicesTable = pgTable("subscription_invoices", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull().references(() => organizationSubscriptionTable.id),
  invoiceNumber: text("invoice_number").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("ZMW"),
  status: text("status").notNull().default("paid"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
  periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
});

export type SubscriptionPlan = typeof subscriptionPlansTable.$inferSelect;
export type OrganizationSubscription = typeof organizationSubscriptionTable.$inferSelect;
export type SubscriptionInvoice = typeof subscriptionInvoicesTable.$inferSelect;
