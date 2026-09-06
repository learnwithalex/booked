// Booked — double-entry ledger schema (Drizzle).
//
// Flow: raw bank/Stripe activity lands in `sourceTransactions`, gets
// categorised (rules first, LLM agent for the rest), then posts to the
// ledger as `entries` + `entryLines`. Every entry balances
// (sum(debit) == sum(credit)), enforced in code at the insert site.

import {
  AnyPgColumn,
  bigint,
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -------- Enums --------

export const orgRoleEnum = pgEnum("org_role", ["owner", "member"]);
export const accountTypeEnum = pgEnum("account_type", [
  "ASSET",
  "LIABILITY",
  "EQUITY",
  "REVENUE",
  "EXPENSE",
]);
export const sourceKindEnum = pgEnum("source_kind", ["PLAID", "STRIPE"]);
export const sourceStatusEnum = pgEnum("source_status", [
  "ACTIVE",
  "DISCONNECTED",
  "ERROR",
]);
export const sourceTxnStatusEnum = pgEnum("source_txn_status", [
  "PENDING",
  "CATEGORISED",
  "POSTED",
  "IGNORED",
]);
export const ruleFieldEnum = pgEnum("rule_field", ["MERCHANT", "DESCRIPTION"]);
export const ruleOpEnum = pgEnum("rule_op", [
  "EQUALS",
  "CONTAINS",
  "STARTS_WITH",
  "REGEX",
]);
export const periodStatusEnum = pgEnum("period_status", ["OPEN", "CLOSED"]);
export const anomalyKindEnum = pgEnum("anomaly_kind", [
  "UNUSUAL_AMOUNT",
  "DUPLICATE",
  "CATEGORY_DRIFT",
  "MISSING_RECONCILIATION",
  "BURN_SPIKE",
]);

// -------- Identity --------

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orgs = pgTable("orgs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orgUsers = pgTable(
  "org_users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: orgRoleEnum("role").notNull().default("owner"),
  },
  (t) => [uniqueIndex("org_users_org_user_uidx").on(t.orgId, t.userId)],
);

export const loginTokens = pgTable("login_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// -------- Chart of accounts --------

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    name: text("name").notNull(),
    type: accountTypeEnum("type").notNull(),
    parentId: uuid("parent_id").references((): AnyPgColumn => accounts.id),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("accounts_org_code_uidx").on(t.orgId, t.code),
    index("accounts_org_type_idx").on(t.orgId, t.type),
  ],
);

// -------- Sources (raw feed) --------

export const sourceConnections = pgTable(
  "source_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    kind: sourceKindEnum("kind").notNull(),
    externalId: text("external_id").notNull(),
    // Encrypted at rest — handled in the ingestion layer.
    accessToken: text("access_token").notNull(),
    status: sourceStatusEnum("status").notNull().default("ACTIVE"),
    cursor: text("cursor"),
    connectedAt: timestamp("connected_at", { withTimezone: true }).defaultNow().notNull(),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
  },
  (t) => [uniqueIndex("source_connections_org_kind_ext_uidx").on(t.orgId, t.kind, t.externalId)],
);

export const sourceTransactions = pgTable(
  "source_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => sourceConnections.id, { onDelete: "cascade" }),
    externalId: text("external_id").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    // Signed; positive = money in. Stored in minor units (cents).
    amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
    currency: text("currency").notNull().default("USD"),
    merchant: text("merchant"),
    description: text("description"),
    raw: jsonb("raw").notNull(),
    status: sourceTxnStatusEnum("status").notNull().default("PENDING"),
    confidence: integer("confidence"),
    categoryHint: text("category_hint"),
    // Entry this txn posted as (null until posted). Non-unique: a
    // reconciled Stripe payout and its bank deposit leg share one entry.
    entryId: uuid("entry_id"),
    ignoredReason: text("ignored_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    uniqueIndex("source_txns_conn_ext_uidx").on(t.connectionId, t.externalId),
    index("source_txns_org_status_idx").on(t.orgId, t.status),
    index("source_txns_org_occurred_idx").on(t.orgId, t.occurredAt),
  ],
);

// -------- Ledger (double-entry postings) --------

export const periods = pgTable(
  "periods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    status: periodStatusEnum("status").notNull().default("OPEN"),
    closedAt: timestamp("closed_at", { withTimezone: true }),
    closedBy: text("closed_by"),
  },
  (t) => [uniqueIndex("periods_org_ym_uidx").on(t.orgId, t.year, t.month)],
);

export const entries = pgTable(
  "entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull(),
    memo: text("memo"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // "agent" or a user id.
    createdBy: text("created_by").notNull(),
    periodId: uuid("period_id").references(() => periods.id),
  },
  (t) => [
    index("entries_org_occurred_idx").on(t.orgId, t.occurredAt),
    index("entries_org_period_idx").on(t.orgId, t.periodId),
  ],
);

// ≥2 lines per entry; debits == credits, enforced in code at insert.
export const entryLines = pgTable(
  "entry_lines",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    entryId: uuid("entry_id")
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    accountId: uuid("account_id")
      .notNull()
      .references(() => accounts.id),
    debitCents: bigint("debit_cents", { mode: "number" }).notNull().default(0),
    creditCents: bigint("credit_cents", { mode: "number" }).notNull().default(0),
  },
  (t) => [index("entry_lines_entry_idx").on(t.entryId), index("entry_lines_account_idx").on(t.accountId)],
);

// -------- Rules (deterministic categorisation, before LLM) --------

export const rules = pgTable(
  "rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    field: ruleFieldEnum("field").notNull(),
    op: ruleOpEnum("op").notNull(),
    pattern: text("pattern").notNull(),
    // Target account code for the categorisation.
    accountCode: text("account_code").notNull(),
    priority: integer("priority").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    // "agent-learned" or a user id.
    createdBy: text("created_by").notNull(),
  },
  (t) => [index("rules_org_priority_idx").on(t.orgId, t.priority)],
);

// -------- Close packets --------

export const closePackets = pgTable("close_packets", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id")
    .notNull()
    .references(() => orgs.id, { onDelete: "cascade" }),
  periodId: uuid("period_id")
    .notNull()
    .references(() => periods.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  pdfUrl: text("pdf_url"),
  summary: text("summary"),
  metricsJson: jsonb("metrics_json").notNull(),
});

// -------- Anomalies --------

export const anomalies = pgTable(
  "anomalies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orgId: uuid("org_id")
      .notNull()
      .references(() => orgs.id, { onDelete: "cascade" }),
    kind: anomalyKindEnum("kind").notNull(),
    detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow().notNull(),
    detailsJson: jsonb("details_json").notNull(),
    txnId: uuid("txn_id"),
    resolved: boolean("resolved").notNull().default(false),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  },
  (t) => [index("anomalies_org_resolved_idx").on(t.orgId, t.resolved)],
);

// -------- Relations (query-side only) --------

export const orgRelations = relations(orgs, ({ many }) => ({
  orgUsers: many(orgUsers),
  accounts: many(accounts),
  sourceConnections: many(sourceConnections),
  sourceTransactions: many(sourceTransactions),
  entries: many(entries),
  rules: many(rules),
  periods: many(periods),
  closePackets: many(closePackets),
  anomalies: many(anomalies),
}));

export const entryRelations = relations(entries, ({ one, many }) => ({
  org: one(orgs, { fields: [entries.orgId], references: [orgs.id] }),
  period: one(periods, { fields: [entries.periodId], references: [periods.id] }),
  lines: many(entryLines),
}));

export const entryLineRelations = relations(entryLines, ({ one }) => ({
  entry: one(entries, { fields: [entryLines.entryId], references: [entries.id] }),
  account: one(accounts, { fields: [entryLines.accountId], references: [accounts.id] }),
}));

// -------- Types --------

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Entry = typeof entries.$inferSelect;
export type NewEntry = typeof entries.$inferInsert;
export type EntryLine = typeof entryLines.$inferSelect;
export type NewEntryLine = typeof entryLines.$inferInsert;
export type SourceTransaction = typeof sourceTransactions.$inferSelect;
export type NewSourceTransaction = typeof sourceTransactions.$inferInsert;
export type Org = typeof orgs.$inferSelect;
export type User = typeof users.$inferSelect;
export type Rule = typeof rules.$inferSelect;
export type Period = typeof periods.$inferSelect;
