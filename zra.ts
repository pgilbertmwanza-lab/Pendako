import { pgTable, text, serial, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { locationsTable } from "./locations";
import { posSalesTable } from "./pos";
import { organizationTable } from "./organization";

// ZRA Smart Invoicing (VSDC) device + organization configuration.
// One row per (location, deviceSerialNo) — supports multi-branch deployments.
export const zraConfigTable = pgTable("zra_config", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  tpin: text("tpin").notNull(),
  bhfId: text("bhf_id").notNull().default("000"),         // branch identifier
  locationId: integer("location_id").references(() => locationsTable.id),
  deviceSerialNo: text("device_serial_no").notNull(),
  // VSDC keys (mock values in demo; real values delivered by ZRA on initialization)
  intrlKey: text("intrl_key"),
  signKey: text("sign_key"),
  cmcKey: text("cmc_key"),
  environment: text("environment").notNull().default("sandbox"), // sandbox|production
  status: text("status").notNull().default("not_initialized"),    // not_initialized|initialized|error
  baseUrl: text("base_url").default("https://vsdc-mock.local"),
  lastInitAt: timestamp("last_init_at", { withTimezone: true }),
  lastError: text("last_error"),
  // Last invoice number issued for this branch (auto-incremented per submitSale)
  lastInvcNo: integer("last_invc_no").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// Per-item, per-branch stock movement ledger
export const stockMovementsTable = pgTable("stock_movements", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  itemId: integer("item_id").notNull(),
  locationId: integer("location_id").notNull().references(() => locationsTable.id),
  type: text("type").notNull(), // sale|refund|adjust|transfer_in|transfer_out|receipt|opening
  quantity: text("quantity").notNull(), // signed (negative for outgoing)
  balanceAfter: text("balance_after"),
  refType: text("ref_type"),  // pos_sale | adjust | bill | …
  refId: integer("ref_id"),
  note: text("note"),
  cashierName: text("cashier_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Offline / async ZRA submission queue
export const zraSyncQueueTable = pgTable("zra_sync_queue", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  saleId: integer("sale_id").references(() => posSalesTable.id, { onDelete: "cascade" }),
  payload: jsonb("payload").notNull(),
  status: text("status").notNull().default("pending"), // pending|success|failed
  attempts: integer("attempts").notNull().default(0),
  lastError: text("last_error"),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
  nextRetryAt: timestamp("next_retry_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Generic audit trail (used heavily by POS for compliance)
export const auditLogTable = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  entityType: text("entity_type").notNull(),
  entityId: integer("entity_id"),
  action: text("action").notNull(),
  actorName: text("actor_name"),
  actorRole: text("actor_role"),
  details: jsonb("details"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const upsertZraConfigSchema = createInsertSchema(zraConfigTable).extend({
  tpin: z.string().min(8),
  bhfId: z.string().regex(/^\d{3}$/),
  deviceSerialNo: z.string().min(3),
  environment: z.enum(["sandbox", "production"]).optional(),
});

export type ZraConfig = typeof zraConfigTable.$inferSelect;
export type StockMovement = typeof stockMovementsTable.$inferSelect;
export type ZraSyncQueue = typeof zraSyncQueueTable.$inferSelect;
export type AuditLog = typeof auditLogTable.$inferSelect;
