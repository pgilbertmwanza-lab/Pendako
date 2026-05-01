import { pgTable, text, serial, timestamp, boolean, numeric, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { organizationTable } from "./organization";

export const accountsTable = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull(),
    parentId: integer("parent_id"),
    systemCode: text("system_code"),
    description: text("description"),
    balance: numeric("balance", { precision: 15, scale: 2 }).notNull().default("0"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [
    index("accounts_org_type_idx").on(t.organizationId, t.type),
    index("accounts_org_system_idx").on(t.organizationId, t.systemCode),
    index("accounts_org_parent_idx").on(t.organizationId, t.parentId),
  ],
);

export const insertAccountSchema = createInsertSchema(accountsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accountsTable.$inferSelect;
