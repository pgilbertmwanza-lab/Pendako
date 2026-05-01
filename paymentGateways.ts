import { pgTable, text, serial, integer, timestamp, boolean, decimal, jsonb, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { organizationTable } from "./organization";

// Configured payment gateways. `provider` selects the implementation in
// lib/paymentProviders/<provider>.ts. `config` holds provider-specific
// secrets (publishable/secret keys, account ids, etc.) — never returned
// from the API in full; only `hasSecret: boolean` is exposed.
export const paymentGatewaysTable = pgTable("payment_gateways", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  provider: text("provider").notNull(), // "mock" | "stripe" | "lenco" | "flutterwave"
  // Free-form config object. Common keys: publishableKey, secretKey,
  // webhookSecret, accountId, currency, supports (array of "card"/"mobile_money"/"bank").
  config: jsonb("config").notNull().default(sql`'{}'::jsonb`),
  isActive: boolean("is_active").notNull().default(true),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type PaymentGateway = typeof paymentGatewaysTable.$inferSelect;

// Each "Pay this invoice" link generates a payment intent. The provider
// returns a hosted checkout URL; on completion the webhook handler flips
// status to "succeeded" and fires the post-payment hooks (mark invoice
// paid, create payment + receipt).
export const paymentIntentsTable = pgTable("payment_intents", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull().references(() => organizationTable.id, { onDelete: "cascade" }),
  // Public unguessable token used in the /pay/:token URL — long random.
  token: text("token").notNull(),
  invoiceId: integer("invoice_id").notNull(),
  gatewayId: integer("gateway_id").notNull(),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  // Provider-side reference (Stripe payment_intent id, Lenco transaction id, …).
  providerRef: text("provider_ref"),
  checkoutUrl: text("checkout_url"),
  // pending | succeeded | failed | cancelled
  status: text("status").notNull().default("pending"),
  // Snapshot of the last webhook payload we received — useful for support.
  lastWebhookPayload: jsonb("last_webhook_payload"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (t) => ({
  uniqToken: uniqueIndex("uniq_payment_intent_token").on(t.token),
}));

export type PaymentIntent = typeof paymentIntentsTable.$inferSelect;
