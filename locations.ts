import { pgTable, text, serial, timestamp, boolean, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { organizationTable } from "./organization";

export const locationsTable = pgTable("locations", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull().default("branch"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  phone: text("phone"),
  email: text("email"),
  managerName: text("manager_name"),
  currency: text("currency").notNull().default("ZMW"),
  // ZRA branch identifier (bhfId) – 3-digit string, "000" = head office
  zraBhfId: text("zra_bhf_id").default("000"),
  isActive: boolean("is_active").notNull().default(true),
  isHeadOffice: boolean("is_head_office").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqCode: uniqueIndex("uniq_location_code").on(t.organizationId, t.code),
}));

export const insertLocationSchema = createInsertSchema(locationsTable).extend({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["branch", "warehouse", "kiosk", "online"]).default("branch"),
  zraBhfId: z.string().regex(/^\d{3}$/).optional(),
});
export type Location = typeof locationsTable.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
