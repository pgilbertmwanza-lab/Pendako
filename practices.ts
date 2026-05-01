import { pgTable, text, serial, timestamp, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { usersTable } from "./organization";

// =============================================================================
// Partner / practice firm grouping (Xero "practice" model).
//
// A practice is a container for multiple client organizations. Practice
// members can switch between any client org without an explicit per-org
// membership row. Useful for accountants and bookkeeping firms.
// =============================================================================

export const practicesTable = pgTable("practices", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  createdByUserId: integer("created_by_user_id").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqSlug: uniqueIndex("uniq_practice_slug").on(t.slug),
}));

export const practiceMembershipsTable = pgTable("practice_memberships", {
  id: serial("id").primaryKey(),
  practiceId: integer("practice_id").notNull().references(() => practicesTable.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  // 'owner' (created the practice) or 'member' (invited).
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uniqMember: uniqueIndex("uniq_practice_member").on(t.practiceId, t.userId),
}));

export type Practice = typeof practicesTable.$inferSelect;
export type PracticeMembership = typeof practiceMembershipsTable.$inferSelect;
