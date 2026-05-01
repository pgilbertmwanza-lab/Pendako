import { pgTable, text, serial, timestamp, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable, organizationTable } from "./organization";
import { rolesTable } from "./rbac";

// =============================================================================
// Per-organization membership.
//
// One row per (user, organization). The role column points to the role
// definition in the existing `roles` table — Admin / Accountant / HR /
// Sales / Cashier / Standard. The same human (Clerk user) can have a
// different role in each org they belong to (e.g. Admin in their own
// company, Accountant in a client org via a practice).
//
// `isOwner` marks the user that signed up and created the org. The owner
// can never be demoted or removed by another member.
// =============================================================================

export const membershipsTable = pgTable("memberships", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  // FK to roles.id. We also keep a denormalized `roleName` for quick lookup
  // in middleware without a join — kept in sync at write time.
  roleId: integer("role_id").notNull().references(() => rolesTable.id, { onDelete: "restrict" }),
  roleName: text("role_name").notNull(),
  isOwner: boolean("is_owner").notNull().default(false),
  // 'active' | 'invited' | 'suspended'.
  status: text("status").notNull().default("active"),
  invitedByUserId: integer("invited_by_user_id").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqMember: uniqueIndex("uniq_user_org").on(t.userId, t.organizationId),
}));

export type Membership = typeof membershipsTable.$inferSelect;
