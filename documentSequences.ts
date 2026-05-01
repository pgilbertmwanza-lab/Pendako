import { pgTable, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { organizationTable } from "./organization";

// Atomic per-organization sequential numbering for documents
// (quotes, invoices, etc.). Each org has its own counter, so two tenants
// can both issue "INV-0001" without colliding.
//
// Composite primary key on (organization_id, key) where:
//   - `organization_id` scopes the counter to a tenant
//   - `key` identifies the document type (e.g. "Q", "INV", "CN")
// `prefix` is prepended (e.g. "Q-" or "INV-"), `padLength` zero-pads the
// integer (e.g. 4 → "0001"), and `nextNumber` is the next integer to issue.
// Numbers are issued atomically via
// `UPDATE ... SET next_number = next_number + 1 RETURNING next_number`.
export const documentSequencesTable = pgTable("document_sequences", {
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  key: text("key").notNull(),
  prefix: text("prefix").notNull().default(""),
  padLength: integer("pad_length").notNull().default(4),
  nextNumber: integer("next_number").notNull().default(1),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  pk: primaryKey({ columns: [t.organizationId, t.key] }),
}));

export type DocumentSequence = typeof documentSequencesTable.$inferSelect;
