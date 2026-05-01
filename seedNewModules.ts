import {
  db,
  subscriptionPlansTable,
  organizationTable,
  taxRatesTable,
  employeesTable,
  projectsTable,
  contactsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

const PLANS = [
  {
    code: "starter",
    name: "Starter",
    tagline: "Send 20 invoices, enter 5 bills and reconcile bank statements",
    category: "Starter",
    monthlyPrice: "350.00",
    annualPrice: "3500.00",
    currency: "ZMW",
    features: [
      "Send 20 quotes & invoices per month",
      "Enter 5 bills per month",
      "Reconcile bank transactions",
      "Submit VAT returns",
      "Capture bills & receipts with Hubdoc",
      "Short-term cashflow",
    ],
    limits: { invoicesPerMonth: 20, bills: 5, users: 1, bankAccounts: 1, payrollEmployees: 0, projects: 0 },
    popular: false,
    sortOrder: 1,
  },
  {
    code: "standard",
    name: "Standard",
    tagline: "Send invoices, enter bills and reconcile bank statements",
    category: "Standard",
    monthlyPrice: "750.00",
    annualPrice: "7500.00",
    currency: "ZMW",
    features: [
      "Send unlimited quotes & invoices",
      "Enter unlimited bills",
      "Reconcile bank transactions",
      "Submit VAT returns",
      "Capture bills & receipts with Hubdoc",
      "Short-term cashflow & business snapshot",
      "Bulk reconcile transactions",
    ],
    limits: { invoicesPerMonth: null, bills: null, users: 5, bankAccounts: null, payrollEmployees: 5, projects: 5 },
    popular: true,
    sortOrder: 2,
  },
  {
    code: "premium",
    name: "Premium",
    tagline: "All Standard features plus multi-currency",
    category: "Premium",
    monthlyPrice: "1100.00",
    annualPrice: "11000.00",
    currency: "ZMW",
    features: [
      "All Standard features",
      "Multi-currency (160+ currencies)",
      "Use multiple currencies in invoices, bills",
      "Auto exchange-rate updates",
      "Project tracking",
      "Expense claims & receipt capture",
      "Analytics Plus advanced reports",
    ],
    limits: { invoicesPerMonth: null, bills: null, users: null, bankAccounts: null, payrollEmployees: 20, projects: null },
    popular: false,
    sortOrder: 3,
  },
  {
    code: "ultimate",
    name: "Ultimate",
    tagline: "Everything in Premium plus payroll, projects & expenses",
    category: "Ultimate",
    monthlyPrice: "1800.00",
    annualPrice: "18000.00",
    currency: "ZMW",
    features: [
      "All Premium features",
      "Payroll for unlimited employees",
      "Zambian PAYE & NAPSA automation",
      "Unlimited projects with profitability",
      "Expense claims for unlimited users",
      "Advanced analytics & forecasting",
      "Priority customer support",
      "Multi-entity consolidation",
    ],
    limits: { invoicesPerMonth: null, bills: null, users: null, bankAccounts: null, payrollEmployees: null, projects: null },
    popular: false,
    sortOrder: 4,
  },
];

const TAX_RATES = [
  { name: "VAT 16%", rate: "16.00", type: "both", description: "Standard Zambian VAT rate" },
  { name: "VAT 0% (Zero rated)", rate: "0.00", type: "both", description: "Zero-rated supplies (exports, basic foodstuffs)" },
  { name: "Exempt", rate: "0.00", type: "both", description: "VAT-exempt supplies" },
  { name: "Withholding 15%", rate: "15.00", type: "purchase", description: "Withholding tax on professional services" },
];

const EMPLOYEES = [
  { employeeCode: "EMP-001", firstName: "Chanda", lastName: "Mulenga", email: "chanda@acmecorp.co.zm", jobTitle: "Operations Manager", department: "Operations", startDate: "2023-01-15", employmentType: "full_time", payType: "salary", salary: "180000", hourlyRate: "0", currency: "ZMW", taxNumber: "1001020301", napsa: "ZM-NAPSA-001", status: "active" },
  { employeeCode: "EMP-002", firstName: "Mwansa", lastName: "Banda", email: "mwansa@acmecorp.co.zm", jobTitle: "Senior Accountant", department: "Finance", startDate: "2022-06-01", employmentType: "full_time", payType: "salary", salary: "240000", hourlyRate: "0", currency: "ZMW", taxNumber: "1001020302", napsa: "ZM-NAPSA-002", status: "active" },
  { employeeCode: "EMP-003", firstName: "Tendai", lastName: "Phiri", email: "tendai@acmecorp.co.zm", jobTitle: "Sales Lead", department: "Sales", startDate: "2024-03-10", employmentType: "full_time", payType: "salary", salary: "144000", hourlyRate: "0", currency: "ZMW", taxNumber: "1001020303", napsa: "ZM-NAPSA-003", status: "active" },
  { employeeCode: "EMP-004", firstName: "Natasha", lastName: "Zulu", email: "natasha@acmecorp.co.zm", jobTitle: "UI Designer", department: "Product", startDate: "2024-08-20", employmentType: "part_time", payType: "hourly", salary: "0", hourlyRate: "180", currency: "ZMW", taxNumber: "1001020304", napsa: "ZM-NAPSA-004", status: "active" },
];

async function main() {
  console.log("→ Seeding subscription plans...");
  for (const plan of PLANS) {
    const [existing] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.code, plan.code));
    if (existing) {
      await db.update(subscriptionPlansTable).set(plan).where(eq(subscriptionPlansTable.id, existing.id));
      console.log(`  ✓ Updated plan: ${plan.name}`);
    } else {
      await db.insert(subscriptionPlansTable).values(plan);
      console.log(`  ✓ Inserted plan: ${plan.name}`);
    }
  }

  console.log("→ Seeding default organisation...");
  const [org] = await db.select().from(organizationTable).limit(1);
  if (!org) {
    await db.insert(organizationTable).values({
      name: "Acme Corp",
      legalName: "Acme Corporation Limited",
      tradingName: "Acme Corp",
      registrationNumber: "PACRA-12345",
      taxNumber: "ZRA-TPIN-1001020301",
      email: "billing@acmecorp.co.zm",
      phone: "+260 211 222 333",
      website: "https://acmecorp.co.zm",
      addressLine1: "Plot 12345 Great East Road",
      city: "Lusaka",
      country: "Zambia",
      baseCurrency: "ZMW",
      fiscalYearStart: "01-01",
      timezone: "Africa/Lusaka",
      industry: "Professional Services",
      brandColor: "#13B5EA",
      invoicePrefix: "INV-",
      invoiceFooter: "Thank you for your business. Payment terms: net 30 days.",
      emailFromName: "Acme Corp",
      emailReplyTo: "billing@acmecorp.co.zm",
    });
    console.log("  ✓ Created organisation");
  } else {
    console.log("  ✓ Organisation already exists");
  }

  console.log("→ Seeding tax rates...");
  for (const tr of TAX_RATES) {
    const existing = await db.select().from(taxRatesTable).where(eq(taxRatesTable.name, tr.name));
    if (existing.length === 0) {
      await db.insert(taxRatesTable).values(tr);
      console.log(`  ✓ Inserted tax rate: ${tr.name}`);
    }
  }

  console.log("→ Seeding employees...");
  for (const emp of EMPLOYEES) {
    const existing = await db.select().from(employeesTable).where(eq(employeesTable.employeeCode, emp.employeeCode));
    if (existing.length === 0) {
      await db.insert(employeesTable).values(emp);
      console.log(`  ✓ Inserted employee: ${emp.firstName} ${emp.lastName}`);
    }
  }

  console.log("→ Seeding sample projects...");
  const contacts = await db.select().from(contactsTable).limit(3);
  if (contacts.length > 0) {
    const projects = [
      { projectNumber: "PRJ-0001", name: "Website Redesign", description: "New corporate website with CMS", contactId: contacts[0].id, status: "in_progress", startDate: "2026-03-01", budget: "85000", hourlyRate: "750", currency: "ZMW", estimatedHours: "120", isBillable: true },
      { projectNumber: "PRJ-0002", name: "Quarterly Audit", description: "Q1 financial audit & advisory", contactId: contacts[Math.min(1, contacts.length - 1)].id, status: "in_progress", startDate: "2026-04-01", budget: "45000", hourlyRate: "1200", currency: "ZMW", estimatedHours: "40", isBillable: true },
    ];
    for (const p of projects) {
      const existing = await db.select().from(projectsTable).where(eq(projectsTable.projectNumber, p.projectNumber));
      if (existing.length === 0) {
        await db.insert(projectsTable).values(p);
        console.log(`  ✓ Inserted project: ${p.name}`);
      }
    }
  } else {
    console.log("  ⚠ No contacts found — skipping project seeding");
  }

  console.log("\n✅ Seed complete");
  process.exit(0);
}

main().catch(err => { console.error("Seed failed:", err); process.exit(1); });
