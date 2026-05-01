import { pgTable, text, serial, timestamp, numeric, integer, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { accountsTable } from "./accounts";
import { locationsTable } from "./locations";
import { contactsTable } from "./contacts";
import { journalEntriesTable } from "./journalEntries";
import { organizationTable } from "./organization";

export const assetCategoriesTable = pgTable("asset_categories", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  depreciationMethod: text("depreciation_method").notNull().default("straight_line"),
  usefulLifeYears: integer("useful_life_years").notNull().default(5),
  residualPct: numeric("residual_pct", { precision: 5, scale: 2 }).notNull().default("0"),
  assetAccountId: integer("asset_account_id").references(() => accountsTable.id),
  depExpenseAccountId: integer("dep_expense_account_id").references(() => accountsTable.id),
  accumDepAccountId: integer("accum_dep_account_id").references(() => accountsTable.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const fixedAssetsTable = pgTable("fixed_assets", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  assetNumber: text("asset_number").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: integer("category_id").references(() => assetCategoriesTable.id),
  locationId: integer("location_id").references(() => locationsTable.id),
  supplierId: integer("supplier_id").references(() => contactsTable.id),
  serialNumber: text("serial_number"),
  warrantyExpiry: date("warranty_expiry"),
  purchaseDate: date("purchase_date").notNull(),
  purchaseCost: numeric("purchase_cost", { precision: 14, scale: 2 }).notNull().default("0"),
  residualValue: numeric("residual_value", { precision: 14, scale: 2 }).notNull().default("0"),
  depreciationStart: date("depreciation_start").notNull(),
  depreciationMethod: text("depreciation_method").notNull().default("straight_line"),
  usefulLifeYears: integer("useful_life_years").notNull().default(5),
  // Running totals
  accumulatedDepreciation: numeric("accumulated_depreciation", { precision: 14, scale: 2 }).notNull().default("0"),
  currentValue: numeric("current_value", { precision: 14, scale: 2 }).notNull().default("0"),
  lastDepreciatedTo: date("last_depreciated_to"),
  // Lifecycle
  status: text("status").notNull().default("registered"), // draft|registered|disposed|written_off
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const assetDepreciationRunsTable = pgTable("asset_depreciation_runs", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  asOfDate: date("as_of_date").notNull(),
  status: text("status").notNull().default("posted"),
  totalDepreciation: numeric("total_depreciation", { precision: 14, scale: 2 }).notNull().default("0"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assetDepreciationLinesTable = pgTable("asset_depreciation_lines", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  runId: integer("run_id").notNull().references(() => assetDepreciationRunsTable.id, { onDelete: "cascade" }),
  assetId: integer("asset_id").notNull().references(() => fixedAssetsTable.id),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  depAmount: numeric("dep_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  journalId: integer("journal_id").references(() => journalEntriesTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assetDisposalsTable = pgTable("asset_disposals", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  assetId: integer("asset_id").notNull().references(() => fixedAssetsTable.id),
  disposalDate: date("disposal_date").notNull(),
  proceeds: numeric("proceeds", { precision: 14, scale: 2 }).notNull().default("0"),
  method: text("method").notNull().default("sold"), // sold|scrapped|donated|stolen
  bookValueAtDisposal: numeric("book_value_at_disposal", { precision: 14, scale: 2 }).notNull().default("0"),
  gainLoss: numeric("gain_loss", { precision: 14, scale: 2 }).notNull().default("0"),
  journalId: integer("journal_id").references(() => journalEntriesTable.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const assetRevaluationsTable = pgTable("asset_revaluations", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  assetId: integer("asset_id").notNull().references(() => fixedAssetsTable.id),
  valuationDate: date("valuation_date").notNull(),
  oldValue: numeric("old_value", { precision: 14, scale: 2 }).notNull().default("0"),
  newValue: numeric("new_value", { precision: 14, scale: 2 }).notNull().default("0"),
  delta: numeric("delta", { precision: 14, scale: 2 }).notNull().default("0"),
  journalId: integer("journal_id").references(() => journalEntriesTable.id),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAssetCategorySchema = createInsertSchema(assetCategoriesTable).omit({ id: true, createdAt: true, updatedAt: true }).extend({
  name: z.string().min(1),
  depreciationMethod: z.enum(["straight_line", "reducing_balance"]).default("straight_line"),
  usefulLifeYears: z.coerce.number().int().min(1).max(100),
  residualPct: z.coerce.number().min(0).max(99).optional(),
});

export const insertFixedAssetSchema = createInsertSchema(fixedAssetsTable).omit({
  id: true, createdAt: true, updatedAt: true, accumulatedDepreciation: true, currentValue: true, lastDepreciatedTo: true,
}).extend({
  name: z.string().min(1),
  assetNumber: z.string().min(1),
  purchaseDate: z.string(),
  depreciationStart: z.string(),
  purchaseCost: z.coerce.number().min(0),
  residualValue: z.coerce.number().min(0).optional(),
  usefulLifeYears: z.coerce.number().int().min(1).max(100),
  depreciationMethod: z.enum(["straight_line", "reducing_balance"]).default("straight_line"),
});

export type AssetCategory = typeof assetCategoriesTable.$inferSelect;
export type FixedAsset = typeof fixedAssetsTable.$inferSelect;
export type AssetDepreciationRun = typeof assetDepreciationRunsTable.$inferSelect;
export type AssetDepreciationLine = typeof assetDepreciationLinesTable.$inferSelect;
export type AssetDisposal = typeof assetDisposalsTable.$inferSelect;
export type AssetRevaluation = typeof assetRevaluationsTable.$inferSelect;
export type InsertAssetCategory = z.infer<typeof insertAssetCategorySchema>;
export type InsertFixedAsset = z.infer<typeof insertFixedAssetSchema>;
