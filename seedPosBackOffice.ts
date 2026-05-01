/**
 * Seed back-office demo data for the Loyverse-style POS:
 *  - 4 colour-coded categories (Beverages, Food, Retail, Misc)
 *  - 3 cashiers with PIN logins (Admin/Manager/Cashier with 1234/5678/9999)
 *  - Best-effort assignment of existing items to categories with tile colours
 *
 * Re-runs are safe: existing rows (matched by name) are updated, not duplicated.
 */
import {
  db,
  posCategoriesTable,
  posCashiersTable,
  itemsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";

function hashPin(pin: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pin, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

async function main() {
  // 1. Categories — Loyverse-default palette
  const cats = [
    { name: "Beverages", color: "#13B5EA", sortOrder: 1, keywords: ["drink", "water", "coffee", "tea", "juice", "soda", "coke", "beer", "wine"] },
    { name: "Food",      color: "#F59E0B", sortOrder: 2, keywords: ["food", "bread", "snack", "meal", "lunch", "dinner", "burger", "pizza", "sandwich"] },
    { name: "Retail",    color: "#7C3AED", sortOrder: 3, keywords: ["shirt", "bag", "shoe", "phone", "case", "charger", "cable", "battery"] },
    { name: "Misc",      color: "#94A3B8", sortOrder: 4, keywords: [] },
  ];
  const categoryIds: Record<string, number> = {};
  for (const c of cats) {
    const [existing] = await db.select().from(posCategoriesTable).where(eq(posCategoriesTable.name, c.name));
    if (existing) {
      await db.update(posCategoriesTable)
        .set({ color: c.color, sortOrder: c.sortOrder, active: true })
        .where(eq(posCategoriesTable.id, existing.id));
      categoryIds[c.name] = existing.id;
      console.log(`  · Updated category: ${c.name}`);
    } else {
      const [row] = await db.insert(posCategoriesTable)
        .values({ name: c.name, color: c.color, sortOrder: c.sortOrder, active: true })
        .returning();
      categoryIds[c.name] = row.id;
      console.log(`  + Created category: ${c.name} (${c.color})`);
    }
  }

  // 2. Cashiers — PINs are demo-only; rotate before going live!
  const cashiers = [
    { name: "Admin Demo",   email: "admin@acme.demo",   role: "admin"   as const, pin: "1234",
      permissions: { sell: true, discounts: true, refunds: true, reports: true, manageItems: true, manageCashiers: true, openShift: true } },
    { name: "Mary Manager", email: "mary@acme.demo",    role: "manager" as const, pin: "5678",
      permissions: { sell: true, discounts: true, refunds: true, reports: true, manageItems: false, manageCashiers: false, openShift: true } },
    { name: "Cathy Cashier",email: "cathy@acme.demo",   role: "cashier" as const, pin: "9999",
      permissions: { sell: true, discounts: false, refunds: false, reports: false, manageItems: false, manageCashiers: false, openShift: true } },
  ];
  for (const c of cashiers) {
    const [existing] = await db.select().from(posCashiersTable).where(eq(posCashiersTable.name, c.name));
    if (existing) {
      await db.update(posCashiersTable).set({
        email: c.email, role: c.role,
        pinHash: hashPin(c.pin),
        permissions: c.permissions,
        active: true,
      }).where(eq(posCashiersTable.id, existing.id));
      console.log(`  · Updated cashier: ${c.name} (${c.role})`);
    } else {
      await db.insert(posCashiersTable).values({
        name: c.name,
        email: c.email,
        role: c.role,
        pinHash: hashPin(c.pin),
        locationIds: [],
        permissions: c.permissions,
        active: true,
      });
      console.log(`  + Created cashier: ${c.name} (${c.role}) PIN ${c.pin}`);
    }
  }

  // 3. Best-effort: classify existing items by name keywords.
  const items = await db.select().from(itemsTable);
  let assigned = 0;
  for (const it of items) {
    if (it.categoryId) continue; // don't override manual assignments
    const lower = it.name.toLowerCase();
    let matchedCat: string | null = null;
    for (const c of cats) {
      if (c.keywords.some(k => lower.includes(k))) { matchedCat = c.name; break; }
    }
    if (!matchedCat && it.type === "product") matchedCat = "Misc";
    if (matchedCat) {
      const cat = cats.find(c => c.name === matchedCat)!;
      await db.update(itemsTable)
        .set({ categoryId: categoryIds[matchedCat], tileColor: cat.color })
        .where(eq(itemsTable.id, it.id));
      assigned++;
    }
  }
  console.log(`  · Auto-assigned ${assigned}/${items.length} item(s) to categories`);

  console.log("\n✓ POS back-office seed complete.");
  console.log("  Demo PINs: Admin=1234  Manager=5678  Cashier=9999");
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
