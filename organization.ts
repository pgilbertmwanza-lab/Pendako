import { pgTable, text, serial, timestamp, jsonb, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";

// =============================================================================
// SaaS multi-tenant identity tables.
//
// `organizations`         — the tenant. Every transactional row across the
//                           database has `organization_id` FK back to this.
// `users`                 — global user identity, mapped to a Clerk user.
//                           A user belongs to many organizations via
//                           `memberships`. The user has no global "role" —
//                           roles are per-organization.
// `practices`             — partner / practice firm grouping for accountants
//                           who manage many client organizations from one
//                           login. See `practiceMemberships`.
// `memberships`           — (user × organization × role). The source of truth
//                           for "can this Clerk user act inside this org and
//                           with what permissions?".
// `practiceMemberships`   — (user × practice). A practice member implicitly
//                           gets access to every org under that practice.
//
// Tax rates remain global (shared across all orgs at the moment) but are
// scoped via `organization_id` like every other transactional table.
// =============================================================================

export const organizationTable = pgTable("organization", {
  id: serial("id").primaryKey(),
  // Slug used in URLs and as a stable identifier. Must be unique.
  slug: text("slug"),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  tradingName: text("trading_name"),
  registrationNumber: text("registration_number"),
  taxNumber: text("tax_number"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  addressLine1: text("address_line_1"),
  addressLine2: text("address_line_2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country").default("Zambia"),
  baseCurrency: text("base_currency").notNull().default("ZMW"),
  // Optional separate "reporting currency" for IAS 21 presentation. When null
  // we present in the functional (base) currency. When set we translate at
  // closing rate for balance-sheet items and average rate for P&L items in
  // the presentation layer (does not change the books).
  reportingCurrency: text("reporting_currency"),
  fiscalYearStart: text("fiscal_year_start").default("01-01"),
  timezone: text("timezone").default("Africa/Lusaka"),
  industry: text("industry"),
  logoUrl: text("logo_url"),
  brandColor: text("brand_color").default("#13B5EA"),
  invoicePrefix: text("invoice_prefix").default("INV-"),
  invoiceFooter: text("invoice_footer"),
  emailFromName: text("email_from_name"),
  emailReplyTo: text("email_reply_to"),
  smtpHost: text("smtp_host"),
  smtpPort: integer("smtp_port").default(587),
  smtpSecure: boolean("smtp_secure").notNull().default(false),
  smtpUser: text("smtp_user"),
  smtpPass: text("smtp_pass"),
  smtpFromEmail: text("smtp_from_email"),
  smtpFromName: text("smtp_from_name"),
  settings: jsonb("settings").$type<Record<string, unknown>>().default({}),

  // ----- SaaS / tenancy fields -----
  // Optional partner firm this org belongs to (Xero "practice" model).
  practiceId: integer("practice_id"),
  // The user that signed up and created this org. Nullable for the
  // pre-existing demo org which has no human owner.
  createdByUserId: integer("created_by_user_id"),
  // True for the system-managed Demo Org. Read-only — all writes are blocked
  // by the tenancy middleware so demo data stays pristine.
  isDemoTemplate: boolean("is_demo_template").notNull().default(false),
  // If this org was cloned from the Demo Org, this points back to it. Useful
  // for analytics and future "reset to demo" features.
  clonedFromOrgId: integer("cloned_from_org_id"),

  // ----- Subscription / trial fields (used in Phase 2 Stripe wiring) -----
  trialStartedAt: timestamp("trial_started_at", { withTimezone: true }),
  trialEndsAt: timestamp("trial_ends_at", { withTimezone: true }),
  // 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' — Stripe
  // sync sets this in Phase 2. Defaults to 'trialing' on org creation.
  subscriptionStatus: text("subscription_status").notNull().default("trialing"),
  planType: text("plan_type"),
  stripeCustomerId: text("stripe_customer_id"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqSlug: uniqueIndex("uniq_org_slug").on(t.slug),
}));

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  // Clerk-provided stable user id (`user_xxx`). Nullable for legacy/system
  // rows seeded before Clerk was wired up.
  clerkUserId: text("clerk_user_id"),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  avatarUrl: text("avatar_url"),
  status: text("status").notNull().default("active"),
  invitedAt: timestamp("invited_at", { withTimezone: true }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  uniqClerkId: uniqueIndex("uniq_user_clerk_id").on(t.clerkUserId),
  uniqEmail: uniqueIndex("uniq_user_email").on(t.email),
}));

export const taxRatesTable = pgTable("tax_rates", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  rate: text("rate").notNull(),
  type: text("type").notNull().default("sales"),
  description: text("description"),
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Organization = typeof organizationTable.$inferSelect;
export type User = typeof usersTable.$inferSelect;
export type TaxRate = typeof taxRatesTable.$inferSelect;
