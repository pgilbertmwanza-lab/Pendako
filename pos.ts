import { pgTable, text, serial, timestamp, integer, numeric, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { locationsTable } from "./locations";
import { contactsTable } from "./contacts";
import { itemsTable } from "./items";
import { bankAccountsTable } from "./bankAccounts";
import { organizationTable } from "./organization";

// === Loyverse-style POS back-office: categories ===
export const posCategoriesTable = pgTable("pos_categories", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#13B5EA"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// === Loyverse-style POS back-office: cashiers / employees ===
// Roles: admin (full back-office + POS), manager (back-office + POS + refunds),
// cashier (POS only). Permissions JSON refines per-cashier capabilities.
export const posCashiersTable = pgTable("pos_cashiers", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  role: text("role").notNull().default("cashier"), // admin|manager|cashier
  pinHash: text("pin_hash").notNull(),
  // Allowed locations — empty array means all
  locationIds: jsonb("location_ids").notNull().$type<number[]>().default([]),
  permissions: jsonb("permissions").notNull().$type<{
    sell?: boolean; discounts?: boolean; refunds?: boolean; reports?: boolean;
    manageItems?: boolean; manageCashiers?: boolean; openShift?: boolean;
  }>().default({ sell: true, openShift: true }),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

// POS terminals (devices) registered to a location
export const posTerminalsTable = pgTable("pos_terminals", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  locationId: integer("location_id").notNull().references(() => locationsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  deviceCode: text("device_code").notNull(),
  pairingCode: text("pairing_code"),
  pairingExpiresAt: timestamp("pairing_expires_at", { withTimezone: true }),
  apiKey: text("api_key"),
  status: text("status").notNull().default("unpaired"),
  lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqDeviceCode: uniqueIndex("uniq_terminal_device_code").on(t.organizationId, t.deviceCode),
}));

// Cashier sessions / shifts opened on a terminal
export const posSessionsTable = pgTable("pos_sessions", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  terminalId: integer("terminal_id").notNull().references(() => posTerminalsTable.id, { onDelete: "cascade" }),
  locationId: integer("location_id").notNull().references(() => locationsTable.id),
  cashierId: integer("cashier_id").references(() => posCashiersTable.id),
  cashierName: text("cashier_name").notNull(),
  openedAt: timestamp("opened_at", { withTimezone: true }).notNull().defaultNow(),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  openingFloat: numeric("opening_float", { precision: 15, scale: 2 }).notNull().default("0"),
  expectedCash: numeric("expected_cash", { precision: 15, scale: 2 }).default("0"),
  declaredCash: numeric("declared_cash", { precision: 15, scale: 2 }),
  variance: numeric("variance", { precision: 15, scale: 2 }),
  totalSales: numeric("total_sales", { precision: 15, scale: 2 }).notNull().default("0"),
  saleCount: integer("sale_count").notNull().default(0),
  status: text("status").notNull().default("open"),
});

// Each completed POS sale (ZRA Smart Invoicing aligned)
export const posSalesTable = pgTable("pos_sales", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  saleNumber: text("sale_number").notNull(),
  sessionId: integer("session_id").references(() => posSessionsTable.id),
  terminalId: integer("terminal_id").notNull().references(() => posTerminalsTable.id),
  locationId: integer("location_id").notNull().references(() => locationsTable.id),
  contactId: integer("contact_id").references(() => contactsTable.id),
  customerName: text("customer_name"),
  cashierId: integer("cashier_id").references(() => posCashiersTable.id),
  cashierName: text("cashier_name"),
  soldAt: timestamp("sold_at", { withTimezone: true }).notNull().defaultNow(),
  currency: text("currency").notNull().default("ZMW"),
  subtotal: numeric("subtotal", { precision: 15, scale: 2 }).notNull().default("0"),
  discountAmount: numeric("discount_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 15, scale: 2 }).notNull().default("0"),
  paymentMethod: text("payment_method").notNull().default("cash"),
  tendered: numeric("tendered", { precision: 15, scale: 2 }).notNull().default("0"),
  change: numeric("change", { precision: 15, scale: 2 }).notNull().default("0"),
  bankAccountId: integer("bank_account_id").references(() => bankAccountsTable.id),
  status: text("status").notNull().default("completed"),
  receiptNotes: text("receipt_notes"),
  metadata: jsonb("metadata"),
  // === ZRA Smart Invoicing fields (VSDC payload alignment) ===
  invcNo: integer("invc_no"),                  // sequential invoice no per branch
  orgInvcNo: integer("org_invc_no"),           // original invoice no (refunds reference)
  custTpin: text("cust_tpin"),
  salesTyCd: text("sales_ty_cd").default("N"), // N=normal, R=refund
  rcptTyCd: text("rcpt_ty_cd").default("S"),   // S=sale, R=refund
  pmtTyCd: text("pmt_ty_cd").default("01"),    // 01=cash, 02=card, 03=mobile, 04=credit, 05=bank
  // Per-tax-class breakdown (A=exempt, B=16% std, C=zero, D=5%, E=other)
  taxblAmtA: numeric("taxbl_amt_a", { precision: 15, scale: 2 }).notNull().default("0"),
  taxblAmtB: numeric("taxbl_amt_b", { precision: 15, scale: 2 }).notNull().default("0"),
  taxblAmtC: numeric("taxbl_amt_c", { precision: 15, scale: 2 }).notNull().default("0"),
  taxblAmtD: numeric("taxbl_amt_d", { precision: 15, scale: 2 }).notNull().default("0"),
  taxblAmtE: numeric("taxbl_amt_e", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmtA: numeric("tax_amt_a", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmtB: numeric("tax_amt_b", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmtC: numeric("tax_amt_c", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmtD: numeric("tax_amt_d", { precision: 15, scale: 2 }).notNull().default("0"),
  taxAmtE: numeric("tax_amt_e", { precision: 15, scale: 2 }).notNull().default("0"),
  // ZRA submission tracking
  zraStatus: text("zra_status").default("pending"), // pending|submitted|accepted|rejected|offline
  zraSubmittedAt: timestamp("zra_submitted_at", { withTimezone: true }),
  zraRcptNo: text("zra_rcpt_no"),               // VSDC-issued receipt no
  zraRcptSign: text("zra_rcpt_sign"),
  zraIntrlData: text("zra_intrl_data"),
  zraVsdcRcptPbctDate: text("zra_vsdc_rcpt_pbct_date"),
  zraQrUrl: text("zra_qr_url"),
  zraError: text("zra_error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uniqSaleNumber: uniqueIndex("uniq_pos_sale_number").on(t.organizationId, t.saleNumber),
}));

export const posSaleItemsTable = pgTable("pos_sale_items", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  saleId: integer("sale_id").notNull().references(() => posSalesTable.id, { onDelete: "cascade" }),
  itemId: integer("item_id").references(() => itemsTable.id),
  sku: text("sku"),
  name: text("name").notNull(),
  quantity: numeric("quantity", { precision: 12, scale: 4 }).notNull().default("1"),
  unitPrice: numeric("unit_price", { precision: 15, scale: 2 }).notNull().default("0"),
  lineDiscount: numeric("line_discount", { precision: 15, scale: 2 }).notNull().default("0"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  lineTotal: numeric("line_total", { precision: 15, scale: 2 }).notNull().default("0"),
  // ZRA per-line VSDC fields
  itemSeq: integer("item_seq"),
  zraItemCd: text("zra_item_cd"),
  zraItemClsCd: text("zra_item_cls_cd"),
  zraTaxTyCd: text("zra_tax_ty_cd").default("B"),
  splyAmt: numeric("sply_amt", { precision: 15, scale: 2 }),       // unit supply amount before tax
  taxblAmt: numeric("taxbl_amt", { precision: 15, scale: 2 }),     // line taxable amount
  taxAmt: numeric("tax_amt", { precision: 15, scale: 2 }),         // line tax amount
});

// Per-location stock levels (separate from items.quantityOnHand which becomes total)
export const itemStockLevelsTable = pgTable("item_stock_levels", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  itemId: integer("item_id").notNull().references(() => itemsTable.id, { onDelete: "cascade" }),
  locationId: integer("location_id").notNull().references(() => locationsTable.id, { onDelete: "cascade" }),
  quantityOnHand: numeric("quantity_on_hand", { precision: 12, scale: 4 }).notNull().default("0"),
  reorderLevel: numeric("reorder_level", { precision: 12, scale: 4 }).notNull().default("0"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  itemLocationUq: uniqueIndex("item_stock_levels_item_location_uq").on(t.organizationId, t.itemId, t.locationId),
}));

export const insertPosTerminalSchema = createInsertSchema(posTerminalsTable).extend({
  name: z.string().min(1),
  locationId: z.coerce.number().int(),
});
export const insertPosSessionSchema = z.object({
  terminalId: z.coerce.number().int(),
  // One of cashierId (preferred — verified via PIN) or cashierName (legacy free-text) is required
  cashierId: z.coerce.number().int().optional(),
  cashierName: z.string().optional(),
  openingFloat: z.coerce.number().min(0).default(0),
}).refine((v) => !!v.cashierId || (v.cashierName && v.cashierName.trim().length > 0), {
  message: "Either cashierId or cashierName must be provided",
});

export const insertPosCategorySchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#13B5EA"),
  sortOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export const insertPosCashierSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  role: z.enum(["admin", "manager", "cashier"]).default("cashier"),
  pin: z.string().regex(/^[0-9]{4,8}$/, "PIN must be 4-8 digits"),
  locationIds: z.array(z.coerce.number().int()).default([]),
  permissions: z.object({
    sell: z.boolean().optional(),
    discounts: z.boolean().optional(),
    refunds: z.boolean().optional(),
    reports: z.boolean().optional(),
    manageItems: z.boolean().optional(),
    manageCashiers: z.boolean().optional(),
    openShift: z.boolean().optional(),
  }).default({ sell: true, openShift: true }),
  active: z.boolean().default(true),
});
export const updatePosCashierSchema = insertPosCashierSchema.partial().extend({
  pin: z.string().regex(/^[0-9]{4,8}$/).optional(),
});
export const posSaleItemInputSchema = z.object({
  itemId: z.coerce.number().int().nullable().optional(),
  sku: z.string().optional(),
  name: z.string().min(1),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().min(0),
  lineDiscount: z.coerce.number().min(0).default(0),
  taxRate: z.coerce.number().min(0).max(100).default(0),
});
export const createPosSaleSchema = z.object({
  terminalId: z.coerce.number().int(),
  sessionId: z.coerce.number().int().optional(),
  customerName: z.string().optional(),
  custTpin: z.string().optional(),
  contactId: z.coerce.number().int().optional(),
  cashierName: z.string().optional(),
  cashierId: z.coerce.number().int().optional(),
  currency: z.string().length(3).optional(),
  paymentMethod: z.enum(["cash", "card", "mobile", "credit", "bank_transfer"]).default("cash"),
  tendered: z.coerce.number().min(0).default(0),
  bankAccountId: z.coerce.number().int().optional(),
  discountAmount: z.coerce.number().min(0).default(0),
  receiptNotes: z.string().optional(),
  items: z.array(posSaleItemInputSchema).min(1),
  offlineId: z.string().optional(), // idempotency key for offline-queued sales
  soldAt: z.string().datetime().optional(),
});

export type PosTerminal = typeof posTerminalsTable.$inferSelect;
export type PosSession = typeof posSessionsTable.$inferSelect;
export type PosSale = typeof posSalesTable.$inferSelect;
export type PosSaleItem = typeof posSaleItemsTable.$inferSelect;
export type ItemStockLevel = typeof itemStockLevelsTable.$inferSelect;
export type PosCategory = typeof posCategoriesTable.$inferSelect;
export type PosCashier = typeof posCashiersTable.$inferSelect;
