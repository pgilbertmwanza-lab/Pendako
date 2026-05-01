import { db, accountsTable, documentSequencesTable, emailTemplatesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

// Seed the chart-of-accounts entries the Quotes/Invoices/Payments journal posting
// looks up by name (see artifacts/api-server/src/lib/accounting.ts AR/SALES/VAT/CASH
// regexes). Idempotent — only inserts when an account with the same code is missing.
const COA = [
  { code: "1100", name: "Accounts Receivable", type: "asset" as const, description: "Customer invoices outstanding" },
  { code: "1000", name: "Cash on Hand",        type: "asset" as const, description: "Cash and bank operating account" },
  { code: "4000", name: "Sales Revenue",       type: "revenue" as const, description: "Income from sales of goods and services" },
  { code: "2200", name: "VAT Payable",         type: "liability" as const, description: "VAT collected on sales, payable to ZRA" },
];

const SEQUENCES = [
  { key: "Q",   prefix: "Q-",   padLength: 4, nextNumber: 1 },
  { key: "INV", prefix: "INV-", padLength: 4, nextNumber: 1 },
];

const TEMPLATES = [
  {
    kind: "quote" as const,
    name: "Default quote",
    subject: "Quote {{docNumber}} from {{orgName}}",
    body: "Hi {{customerName}},\n\nPlease find attached quote {{docNumber}} for {{total}}.\n\n{{message}}\n\nThis quote is valid until {{dueDate}}.\n\nThank you,\n{{orgName}}",
    isDefault: true,
  },
  {
    kind: "invoice" as const,
    name: "Default invoice",
    subject: "Invoice {{docNumber}} from {{orgName}}",
    body: "Hi {{customerName}},\n\nPlease find attached invoice {{docNumber}} for {{total}}, due on {{dueDate}}.\n\n{{message}}\n\nKind regards,\n{{orgName}}",
    isDefault: true,
  },
  {
    kind: "payment_receipt" as const,
    name: "Default payment receipt",
    subject: "Receipt for payment on invoice {{docNumber}}",
    body: "Hi {{customerName}},\n\nThank you — we have received your payment of {{total}} for invoice {{docNumber}}.\n\n{{message}}\n\n{{orgName}}",
    isDefault: true,
  },
  {
    kind: "reminder" as const,
    name: "Default payment reminder",
    subject: "Reminder: invoice {{docNumber}} is due",
    body: "Hi {{customerName}},\n\nThis is a friendly reminder that invoice {{docNumber}} for {{total}} is due on {{dueDate}}.\n\n{{message}}\n\n{{orgName}}",
    isDefault: true,
  },
];

async function main() {
  console.log("[seedQuotesInvoices] Seeding chart of accounts…");
  for (const acct of COA) {
    const existing = await db.select().from(accountsTable).where(eq(accountsTable.code, acct.code));
    if (existing.length === 0) {
      await db.insert(accountsTable).values({ ...acct, isActive: true, balance: "0" });
      console.log(`  + ${acct.code} ${acct.name}`);
    } else {
      console.log(`  · ${acct.code} ${acct.name} (exists)`);
    }
  }

  console.log("[seedQuotesInvoices] Seeding document sequences…");
  for (const seq of SEQUENCES) {
    await db.insert(documentSequencesTable).values(seq).onConflictDoNothing();
    console.log(`  · ${seq.key}: ${seq.prefix}{n} (pad ${seq.padLength})`);
  }

  console.log("[seedQuotesInvoices] Seeding default email templates…");
  for (const t of TEMPLATES) {
    const existing = await db.select().from(emailTemplatesTable)
      .where(and(eq(emailTemplatesTable.kind, t.kind), eq(emailTemplatesTable.isDefault, true)));
    if (existing.length === 0) {
      await db.insert(emailTemplatesTable).values(t);
      console.log(`  + ${t.kind}: ${t.name}`);
    } else {
      console.log(`  · ${t.kind}: default already present`);
    }
  }

  console.log("[seedQuotesInvoices] Done.");
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
