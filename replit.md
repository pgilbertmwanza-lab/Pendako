# Overview

Pendako is a comprehensive accounting application designed as a pnpm workspace monorepo using TypeScript. It provides modules for Sales (Quotes, Invoices, Contacts, Inventory), Purchases (Purchase Orders, Bills), Accounting (Bank Accounts, Chart of Accounts, Journals, Credit Notes, Payments), and advanced features like Point of Sale (POS) with multi-location support, ZRA Smart Invoicing compliance, and Bluetooth thermal printer integration. The system also supports multi-currency operations, detailed reporting (P&L, Balance Sheet, GL), Payroll (with Zambian tax rules), and Project management with time tracking. The project aims to deliver a robust, feature-rich accounting solution with dynamic display currency and a professional design system, serving as a multi-tenant SaaS platform.

# User Preferences

I prefer detailed explanations.
I want iterative development.
Ask before making major changes.
Do not make changes to the folder `scripts`.
Do not make changes to the file `lib/pdf.ts`.
Do not make changes to the file `lib/email.ts`.
Do not make changes to the file `lib/escpos.ts`.
Do not make changes to the file `hooks/use-bluetooth-printer.ts`.
Do not make changes to the file `lib/format.ts`.

# System Architecture

## Core Technologies
The project utilizes Node.js 24, pnpm workspaces, and TypeScript 5.9. The API is built with Express 5, using PostgreSQL and Drizzle ORM for data persistence. Zod is used for validation, and Orval generates API hooks and Zod schemas from OpenAPI. Bundling is handled by esbuild. Clerk is integrated for authentication and user management in the multi-tenant SaaS environment.

## UI/UX Design
The application follows the Pendako design system with a dark top header (`#1A1A2E`), a white sidebar, and a teal (`#13B5EA`) accent color. The brand mark is "Pendako" on a teal "P" tile. Status indicators use `getStatusColor`, and monetary values are formatted with `formatMoney(amount, currencyCode)` with dynamic currency symbols.

## Key Features & Implementations

### Multi-tenant SaaS Foundation
The application is designed as a multi-tenant SaaS platform. Clerk handles authentication, with public routes for sign-in, sign-up, and onboarding. A tenancy header (`x-organization-id`) is sent with every API call, validated by server middleware to ensure authenticated users have membership for the specified organization. All transactional tables include an `organization_id` column, and previously global unique indexes are now composite `(organization_id, …)`. New organizations can be created and optionally seeded with demo data. A practice/partner layer allows managing multiple client organizations. Roles are platform-managed and not tenant-mutable.

### Sales & Invoicing
Features atomic document numbering, a full quote lifecycle with distinct API endpoints, and an invoice approval workflow that auto-posts journal entries upon approval. Payment processing updates invoice status and amounts. Supports tax-inclusive pricing, PDF generation for documents, and an internal email service for sending documents with PDF attachments. Includes configurable invoice reminder rules with an in-process scheduler.

### Banking & Accounting
Bank accounts display filterable transactions with reconciliation features. Supports bulk reconciliation and CSV import of bank statements with auto-detection and balance updates. Provides an API for account reconciliation summaries. The Chart of Accounts supports DR/CR columns and allows Excel bulk upload. An opening balances wizard facilitates setting initial balances for accounts.

### Financial Reporting Engine (Phase 1)
All reports (P&L, Balance Sheet, Trial Balance, General Ledger, Cash Flow Statement) are computed exclusively from `journal_lines` joined to posted `journal_entries` — never from `accounts.balance`. The engine lives in `artifacts/api-server/src/services/reports/` (`engine.ts` + per-report modules) and is exposed via thin route wrappers in `routes/reports.ts`. Key properties:
- **Single primitive**: `getAccountActivity({orgId, from, to, accountIds?})` returns per-account `openingDebit/Credit`, `periodDebit/Credit`, `closingDebit/Credit` from one indexed grouped query (no N+1 in the hot path).
- **Comparatives**: every report supports `compare = none | previousPeriod | previousYear`. Variance and variance% are computed at the report layer.
- **P&L monthly breakdown**: optional `breakdown=monthly` returns one column per month plus a total.
- **Balance Sheet**: synthesizes a current-year Net Income equity row so Assets = Liabilities + Equity by construction.
- **Cash Flow (indirect method)**: Net Profit + Depreciation + ΔAR + ΔInventory + ΔAP for operating, Δ fixed assets for investing, Δ loans + equity − dividends for financing. A reconciling **"Other working capital / non-cash movements"** plug line is added to operating so `opening cash + net change = closing cash` by construction; the plug is surfaced so unclassified movements remain visible. Account categorization uses `accounts.system_code` first then name-regex fallback.
- **General Ledger**: rebuilt to use only 2–3 grouped queries regardless of account count (no per-account N+1). Single-account view paginates with carry-in for running balance; multi-account view loads up to a hard cap of 25,000 lines and explicitly sets `truncated=true` instead of silently dropping rows.
- **Drill-down**: `/api/reports/drill/account` returns paginated journal lines plus opening balance and per-line natural-side running balance. `/api/reports/drill/source` resolves the source document (invoice/bill/payment/POS sale/opening balance/payroll/fixed asset) from the `(source_type, source_id)` columns now stamped on every posting.
- **Schema additions**: `journal_entries` carries `source_type` + `source_id` (backfilled from legacy entry-number prefixes via a startup migration). New indexes on `journal_entries (organization_id, entry_date)` and `(organization_id, source_type, source_id)`, on `journal_lines (organization_id, account_id, entry_id)`, and on `accounts (organization_id, type)` and `(organization_id, system_code)`.
- **Frontend**: `pages/reports.tsx` renders P&L / BS / TB / Cash Flow / GL tabs with a shared `<ReportControls>` (date presets, comparison mode, monthly toggle), a `<DrillButton>` on every figure that opens `<DrillDownDialog>`, and an `<ErrorBanner>` fallback for any failed report query so the page never blanks. Type guards (`isPLValid`/`isBSValid`/etc.) prevent crashes on partial responses.
- **Exports**: `routes/exports.ts` consumes the engine output for `profit-loss`, `balance-sheet`, `trial-balance`, `general-ledger`, and the new `cash-flow-statement`, carrying comparative columns through to PDF/XLSX/CSV.

### Point of Sale (POS)
Offers multi-location support, cashier management with PIN-login and granular permissions, and a Loyverse-style back office interface. Automatically posts balanced journal entries for sales and refunds. Complies with ZRA Smart Invoicing (VSDC) including tax classes and integration with a mock VSDC service. Supports barcode scanning, Wifi/ZRA status, and an offline mode. Integrates with Bluetooth, Ethernet, and USB thermal printers using ESC/POS for VSDC-compliant receipts.

### Payroll & HR
Includes payroll calculation with Zambian tax rules (PAYE, NAPSA, NHIMA) which are configurable via a UI. Features a pay run preview and gratuity calculation based on months of service and basic salary. HR functionalities include leave request decision routes that are permission-guarded, atomic, and idempotent, and synthesized leave balances that pro-rate entitlement. A monthly gratuity and leave report is available.

### Multi-currency
Supports 75+ ISO 4217 currencies with dynamic display currency conversion using an `exchangeRatesTable`. Quotes, invoices, bills, POs, credit notes, and journals support per-document currency.

### IAS 21 FX Foundation (Phase 1)
End-to-end realised + unrealised foreign-exchange handling:
- **Schema**: `organizations.reportingCurrency`, `payments.fxGainLoss`, and new `fx_revaluation_runs` + `fx_revaluation_lines` tables track per-run snapshots with old/new rate, foreign and functional carrying amounts, and the per-account adjustment posted.
- **System accounts**: `ensureFxSystemAccounts(orgId)` idempotently provisions four system accounts tagged via `system_code` — Realised FX Gain/Loss (4900/5900) and Unrealised FX Gain/Loss (4910/5910). The engine looks them up by `system_code` so they survive renames or chart-of-accounts edits.
- **FX engine** (`services/fx/engine.ts`): `getRate(orgId, from, to, asOfDate)` with most-recent-prior-date and inverse-pair fallback; `convert()`; `getOpenForeignBalances(orgId, asOfDate)` returns per-(account, currency) functional + foreign carrying balances for AR/AP/Bank/Cash.
- **Daily fetcher** (`services/fx/dailyFetcher.ts`): pulls rates from public Frankfurter (ECB-sourced) API at startup and every 24h. Idempotent — never overwrites a manual rate for the same date.
- **Realised FX**: `postPaymentJournal` accepts an `fx` block and posts a third line to the appropriate gain/loss account when `paymentRate ≠ invoiceRate`. The route handler (`routes/payments.ts`) computes this only for foreign invoices, persists `fxGainLoss` on the payment, and tags the journal with the invoice currency + booked rate.
- **Period-end revaluation** (`services/fx/revaluation.ts`): `runRevaluation({orgId, asOf})` revalues every open foreign monetary balance to the closing rate, posts a single net adjustment to Unrealised FX Gain/Loss, and automatically books a reversing entry on the next day (no-net-effect pattern). No-op runs are recorded but skip the journal.
- **Routes**: `POST /api/fx/revaluations`, `GET /api/fx/revaluations`, `GET /api/fx/revaluations/:id`.
- **UI**: `/settings/currency` (page `pages/settings/currency.tsx` + `components/settings/CurrencySettings.tsx`) shows functional vs reporting currency (reporting is editable via `CurrencySelect`, PUTs `reportingCurrency` to `/api/settings/organization`), recent rates, manual rate override form, and a "Run revaluation" trigger with the past-runs table. Linked from the Currencies tab on the main Settings page.
- **Concurrency**:
  - `dailyFetcher` uses an atomic `INSERT … ON CONFLICT DO UPDATE WHERE source <> 'manual'` keyed on the existing `uniq_rate` index, so concurrent workers cannot create duplicates or clobber manual overrides.
  - `runRevaluation` takes a per-org `pg_advisory_xact_lock(910001, orgId)` at the top of the transaction and rejects a duplicate posted run for the same `(orgId, asOf)` from inside the same lock, serializing concurrent POSTs without blocking other tenants.
- **Authorization**: `POST /api/fx/revaluations` is gated by `accounting.post`; both GET endpoints by `reports.read`. As part of this work, `PUT /api/settings/organization` was also gated by `settings.write` — a pre-existing authz gap that the new `reportingCurrency` field surfaced.
- **Roles bootstrap**: `seedSystemRoles` now uses `ON CONFLICT DO UPDATE` (scoped to `is_system = true`) so the four built-in roles always reflect the current `SYSTEM_ROLES` catalog. This fixed an existing prod-data bug where the Admin role had been seeded with an empty permissions array and could not invoke any permission-gated endpoint.

### Reports — date filters + exports rollout
Every report panel (P&L, BS, TB, GL, Cash Flow, Cash Summary, Executive, Journal, plus all POS, Inventory, Payroll, and Fixed-Asset sub-reports) now uses a shared `<SimpleReportControls>` (range / asOf / none modes) plus `<ReportExportButtons>` for PDF/XLSX/CSV. The server-side `routes/exports.ts` was extended with 24 new entries (a single `tableReport` helper turns columns + rows into all three formats) so any report visible in the UI can be exported through `/api/exports/:reportId`.

### Security Hardening
Platform-managed roles, public payment-gateway endpoints outside the tenant guard (with organization resolution from intent data), atomic webhook side-effects, and org-scoped user management. Atomic operations for organization setup and demo data cloning are implemented.

# External Dependencies

- **PostgreSQL**: Primary database.
- **Drizzle ORM**: ORM for PostgreSQL.
- **Express**: API server framework.
- **Zod**: Schema validation.
- **Orval**: API client and hook generator.
- **esbuild**: Code bundler.
- **Clerk**: Authentication and user management.
- **pdfkit**: PDF document generation.
- **Nodemailer**: Email sending.
- **Web Bluetooth API**: For Bluetooth thermal printer connectivity.
- **xlsx**: Excel file processing for imports.
- **scrypt**: For hashing POS cashier PINs.