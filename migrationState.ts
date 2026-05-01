import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Tracks one-shot data migrations that run at API server boot.
 * Each row marks a named migration as complete so it never re-runs.
 *
 * NOT to be confused with Drizzle's schema push (which is declarative).
 * This is for *data* migrations such as backfills.
 */
export const migrationStateTable = pgTable("migration_state", {
  name: text("name").primaryKey(),
  appliedAt: timestamp("applied_at", { withTimezone: true }).notNull().defaultNow(),
  notes: text("notes"),
});

export type MigrationStateRow = typeof migrationStateTable.$inferSelect;
