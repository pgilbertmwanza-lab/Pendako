/**
 * Seed Zambia Revenue Authority demo data:
 *  - Set Acme org to a Zambian VAT taxpayer (TPIN 1001234567 + supervisor PIN)
 *  - Stamp branches with bhfId (000 head office, 001/099 branches)
 *  - Backfill ZRA item fields and barcodes on existing items
 *  - Insert one mock VSDC device config tied to head office
 */
import {
  db,
  organizationTable,
  locationsTable,
  itemsTable,
  zraConfigTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

async function main() {
  // 1. Organization → Zambian taxpayer
  const orgs = await db.select().from(organizationTable);
  for (const org of orgs) {
    const settings = (org.settings ?? {}) as Record<string, unknown>;
    await db.update(organizationTable).set({
      country: org.country ?? "Zambia",
      baseCurrency: org.baseCurrency ?? "ZMW",
      timezone: org.timezone ?? "Africa/Lusaka",
      taxNumber: org.taxNumber ?? "1001234567",
      settings: { ...settings, posSupervisorPin: settings.posSupervisorPin ?? "1234" },
    }).where(eq(organizationTable.id, org.id));
    console.log(`✓ Org ${org.name}: TPIN ${org.taxNumber ?? "1001234567"}, supervisor PIN set`);
  }

  // 2. Branches → bhfId
  const branchMap: Record<string, string> = {
    LSK01: "000", // head office
    NDOLA: "001",
    WHS01: "099", // warehouse
  };
  for (const [code, bhfId] of Object.entries(branchMap)) {
    const updated = await db.update(locationsTable)
      .set({ zraBhfId: bhfId })
      .where(eq(locationsTable.code, code))
      .returning({ id: locationsTable.id, name: locationsTable.name });
    if (updated.length > 0) console.log(`✓ Branch ${updated[0].name} → bhfId ${bhfId}`);
  }

  // 3. Items → ZRA fields
  const items = await db.select().from(itemsTable);
  for (const it of items) {
    if (it.zraTaxTyCd && it.zraItemTyCd) continue; // already seeded
    // Heuristic: services → exempt (A); foods (containing "milk", "bread", "rice", "maize") → zero (C); else standard (B)
    const lname = it.name.toLowerCase();
    let taxTy: "A" | "B" | "C" | "D" | "E" = it.type === "service" ? "A" : "B";
    if (it.type === "product" && /(milk|bread|rice|maize|mealie|cooking oil)/.test(lname)) taxTy = "C";

    await db.update(itemsTable).set({
      barcode: it.barcode ?? `60012${String(it.id).padStart(8, "0")}`,
      zraItemCd: it.zraItemCd ?? `ZM${String(it.id).padStart(8, "0")}`,
      zraItemClsCd: it.zraItemClsCd ?? (it.type === "service" ? "85100000" : "10101500"),
      zraItemTyCd: it.zraItemTyCd ?? (it.type === "service" ? "3" : "2"),
      zraTaxTyCd: it.zraTaxTyCd ?? taxTy,
      zraPkgUnitCd: it.zraPkgUnitCd ?? "EA",
      zraQtyUnitCd: it.zraQtyUnitCd ?? "EA",
      zraSyncStatus: it.zraSyncStatus ?? "pending",
    }).where(eq(itemsTable.id, it.id));
  }
  console.log(`✓ ${items.length} items stamped with ZRA fields`);

  // 4. VSDC device config — one device per branch with a bhfId
  const tpin = orgs[0]?.taxNumber ?? "1001234567";
  const branches = await db.select().from(locationsTable);
  for (const br of branches) {
    if (!br.zraBhfId) continue;
    const existing = await db.select().from(zraConfigTable).where(eq(zraConfigTable.locationId, br.id));
    if (existing.length > 0) {
      console.log(`✓ Branch ${br.name} already has ${existing.length} VSDC device(s)`);
      continue;
    }
    await db.insert(zraConfigTable).values({
      tpin,
      bhfId: br.zraBhfId,
      locationId: br.id,
      deviceSerialNo: `VSDC${String(br.id).padStart(7, "0")}`,
      environment: "sandbox",
      baseUrl: "https://vsdc-mock.local",
      status: "not_initialized",
    });
    console.log(`✓ VSDC device created for ${br.name} (bhfId ${br.zraBhfId})`);
  }

  console.log("\nZRA seed complete. Next step: open /pos/zra-config and click Initialize.");
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
