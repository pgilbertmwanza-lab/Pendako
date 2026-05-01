import { pgTable, text, serial, timestamp, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accountsTable } from "./accounts";
import { organizationTable } from "./organization";

export const itemsTable = pgTable("items", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull().default("service"),
  sellPrice: numeric("sell_price", { precision: 15, scale: 2 }).notNull().default("0"),
  costPrice: numeric("cost_price", { precision: 15, scale: 2 }).notNull().default("0"),
  taxRate: numeric("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  quantityOnHand: numeric("quantity_on_hand", { precision: 12, scale: 4 }).notNull().default("0"),
  reorderLevel: numeric("reorder_level", { precision: 12, scale: 4 }).default("0"),
  salesAccountId: integer("sales_account_id").references(() => accountsTable.id),
  purchaseAccountId: integer("purchase_account_id").references(() => accountsTable.id),
  unit: text("unit").default("each"),
  isSold: boolean("is_sold").notNull().default(true),
  isPurchased: boolean("is_purchased").notNull().default(false),
  isTracked: boolean("is_tracked").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  // Barcode (EAN/UPC etc.) used by the POS register for fast scanning
  barcode: text("barcode"),
  // Loyverse-style POS tile presentation
  categoryId: integer("category_id"), // FK to pos_categories — added there to avoid circular import
  tileColor: text("tile_color"),      // e.g. #13B5EA, used as the POS button background
  imageUrl: text("image_url"),        // optional product image
  // === ZRA Smart Invoicing (VSDC) item master fields ===
  // itemCd  – ZRA-compliant item code (often == code, but kept separate)
  zraItemCd: text("zra_item_cd"),
  // itemClsCd – classification code (e.g. service / commodity HS-style)
  zraItemClsCd: text("zra_item_cls_cd"),
  // itemTyCd – "1"=raw,"2"=finished,"3"=service (VSDC convention)
  zraItemTyCd: text("zra_item_ty_cd").default("2"),
  // pkgUnitCd – packaging unit (NT=none, BX=box, …)
  zraPkgUnitCd: text("zra_pkg_unit_cd").default("NT"),
  // qtyUnitCd – quantity unit (U=each, KG, LTR, …)
  zraQtyUnitCd: text("zra_qty_unit_cd").default("U"),
  // taxTyCd – A=exempt,B=16% standard,C=zero-rated,D=5%,E=other
  zraTaxTyCd: text("zra_tax_ty_cd").default("B"),
  zraSyncStatus: text("zra_sync_status").default("pending"), // pending|synced|failed
  zraLastSyncAt: timestamp("zra_last_sync_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertItemSchema = createInsertSchema(itemsTable).extend({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["service", "product"]),
  sellPrice: z.coerce.number().min(0),
  costPrice: z.coerce.number().min(0),
  taxRate: z.coerce.number().min(0).max(100),
  quantityOnHand: z.coerce.number().min(0).optional(),
  reorderLevel: z.coerce.number().min(0).optional(),
  salesAccountId: z.coerce.number().optional(),
  purchaseAccountId: z.coerce.number().optional(),
  barcode: z.string().optional().nullable(),
  zraItemCd: z.string().optional().nullable(),
  zraItemClsCd: z.string().optional().nullable(),
  zraItemTyCd: z.enum(["1", "2", "3"]).optional(),
  zraPkgUnitCd: z.string().optional(),
  zraQtyUnitCd: z.string().optional(),
  zraTaxTyCd: z.enum(["A", "B", "C", "D", "E"]).optional(),
  categoryId: z.coerce.number().int().nullable().optional(),
  tileColor: z.string().regex(/^#?[0-9a-fA-F]{6}$/).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export type Item = typeof itemsTable.$inferSelect;
