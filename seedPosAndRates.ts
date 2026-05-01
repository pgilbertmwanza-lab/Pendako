import {
  db,
  exchangeRatesTable,
  locationsTable,
  posTerminalsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const TODAY = new Date().toISOString().slice(0, 10);

// Indicative rates against USD (will compute base->display via crosses)
const USD_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 156.5,
  AUD: 1.52,
  CAD: 1.37,
  CHF: 0.91,
  CNY: 7.24,
  HKD: 7.82,
  NZD: 1.66,
  SEK: 10.62,
  KRW: 1370,
  SGD: 1.35,
  INR: 83.2,
  BRL: 5.13,
  ZAR: 18.6,
  MXN: 17.1,
  AED: 3.67,
  SAR: 3.75,
  TRY: 32.4,
  RUB: 92.5,
  EGP: 47.8,
  NGN: 1480,
  KES: 130,
  GHS: 14.5,
  TZS: 2620,
  UGX: 3760,
  ZMW: 26.8,
  MWK: 1735,
  BWP: 13.6,
  RWF: 1290,
  MZN: 63.7,
  PKR: 278,
  BDT: 110,
  IDR: 16100,
  MYR: 4.72,
  THB: 36.4,
  PHP: 57.5,
  VND: 25450,
  TWD: 32.4,
  DKK: 6.87,
  PLN: 3.97,
  CZK: 23.4,
  HUF: 358,
  NOK: 10.85,
};

async function seedRates() {
  const codes = Object.keys(USD_RATES);
  let inserted = 0;
  for (const from of codes) {
    for (const to of codes) {
      if (from === to) continue;
      const rate = USD_RATES[to] / USD_RATES[from];
      await db.insert(exchangeRatesTable).values({
        fromCurrency: from, toCurrency: to,
        rate: rate.toFixed(8), effectiveDate: TODAY, source: "seed",
      }).onConflictDoUpdate({
        target: [exchangeRatesTable.fromCurrency, exchangeRatesTable.toCurrency, exchangeRatesTable.effectiveDate],
        set: { rate: rate.toFixed(8) },
      });
      inserted++;
    }
  }
  console.log(`Seeded ${inserted} exchange rates for ${TODAY}`);
}

async function seedDemoLocations() {
  const branches = [
    { code: "LSK01", name: "Lusaka Main", type: "branch", city: "Lusaka", country: "Zambia", currency: "ZMW", isHeadOffice: true, managerName: "Jane Banda", phone: "+260 211 123456" },
    { code: "NDOLA", name: "Ndola Branch", type: "branch", city: "Ndola", country: "Zambia", currency: "ZMW", isHeadOffice: false, managerName: "Peter Mwila", phone: "+260 212 234567" },
    { code: "WHS01", name: "Lusaka Warehouse", type: "warehouse", city: "Lusaka", country: "Zambia", currency: "ZMW", isHeadOffice: false },
  ];
  for (const b of branches) {
    const [existing] = await db.select().from(locationsTable).where(eq(locationsTable.code, b.code));
    if (existing) continue;
    const [loc] = await db.insert(locationsTable).values(b).returning();
    if (b.type === "branch") {
      // Auto-create one terminal per branch with a static pairing code (so user can immediately try pairing)
      const code = b.code === "LSK01" ? "PAIR42" : "PAIR43";
      await db.insert(posTerminalsTable).values({
        locationId: loc.id,
        name: `${b.name} – Front counter`,
        deviceCode: `DEV-${b.code}`,
        pairingCode: code,
        pairingExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        status: "unpaired",
      });
    }
    console.log(`Created branch ${b.name}`);
  }
}

(async () => {
  await seedRates();
  await seedDemoLocations();
  console.log("Done.");
  process.exit(0);
})();
