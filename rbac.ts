import { pgTable, text, serial, timestamp, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Roles: Admin / Accountant / HR / Sales / Cashier / Standard (seeded).
// `permissions` is an array of permission strings like "invoices.create",
// "invoices.approve", "payroll.approve", "*" (Admin). Module-level wildcards
// supported via "invoices.*". Resolved in lib/rbac.ts → hasPermission().
//
// Roles are global (the catalog is shared across all tenants). The actual
// (user × org × role) assignment lives in `memberships` (see memberships.ts).
// The tenancy middleware looks up the caller's membership for the active
// org and resolves the role from its `roleId` / `roleName`.
export const rolesTable = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  permissions: jsonb("permissions").notNull().default(sql`'[]'::jsonb`),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqName: uniqueIndex("uniq_role_name").on(t.name),
}));

export type Role = typeof rolesTable.$inferSelect;
