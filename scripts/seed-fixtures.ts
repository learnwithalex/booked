// Demo org seed. August = pre-posted (P&L visible immediately on login).
// September = PENDING so judges can run the categorise → post flow live.
//
// Run: tsx scripts/seed-fixtures.ts
// Destroys and recreates the demo org ("demo@booked.app" / "Demo Co").

import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname } from "path";
import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq, inArray } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { CHART_OF_ACCOUNTS } from "../src/db/chart";

const _dir = dirname(fileURLToPath(import.meta.url));

const DEMO_EMAIL = "demo@booked.app";
const DEMO_ORG = "Demo Co";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });
  const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

  // Teardown: respects FK order (no cascades on most tables)
  const existing = await db.query.orgs.findFirst({
    where: (o, { eq }) => eq(o.name, DEMO_ORG),
  });
  if (existing) {
    const entryIds = (
      await db.query.entries.findMany({
        where: (e, { eq }) => eq(e.orgId, existing.id),
        columns: { id: true },
      })
    ).map((e) => e.id);
    if (entryIds.length) {
      await db.delete(schema.entryLines).where(inArray(schema.entryLines.entryId, entryIds));
    }
    await db.delete(schema.entries).where(eq(schema.entries.orgId, existing.id));
    await db.delete(schema.sourceTransactions).where(eq(schema.sourceTransactions.orgId, existing.id));
    await db.delete(schema.rules).where(eq(schema.rules.orgId, existing.id));
    await db.delete(schema.accounts).where(eq(schema.accounts.orgId, existing.id));
    await db.delete(schema.sourceConnections).where(eq(schema.sourceConnections.orgId, existing.id));
    await db.delete(schema.orgUsers).where(eq(schema.orgUsers.orgId, existing.id));
    await db.delete(schema.orgs).where(eq(schema.orgs.id, existing.id));
    console.log("cleared existing demo org");
  }

  // User + org
  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, DEMO_EMAIL),
  });
  const user =
    existingUser ??
    (await db.insert(schema.users).values({ email: DEMO_EMAIL }).returning()).at(0)!;
  const [org] = await db.insert(schema.orgs).values({ name: DEMO_ORG }).returning();
  await db.insert(schema.orgUsers).values({ orgId: org.id, userId: user.id, role: "owner" });

  // Rules (same ones first login creates)
  await db.insert(schema.rules).values([
    { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "STRIPE", accountCode: "4000", priority: 100, createdBy: "system" },
    { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "AMAZON WEB SERVICES", accountCode: "5110", priority: 100, createdBy: "system" },
    { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "AWS", accountCode: "5110", priority: 90, createdBy: "system" },
    { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "OPENAI", accountCode: "5120", priority: 100, createdBy: "system" },
    { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "ANTHROPIC", accountCode: "5120", priority: 100, createdBy: "system" },
  ]).onConflictDoNothing();

  // Chart of accounts
  await db.insert(schema.accounts).values(
    CHART_OF_ACCOUNTS.map((a) => ({
      orgId: org.id,
      code: a.code,
      name: a.name,
      type: a.type as "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE",
    })),
  );

  // Build code→id map for double-entry posting below
  const accountRows = await db.query.accounts.findMany({
    where: (a, { eq }) => eq(a.orgId, org.id),
    columns: { id: true, code: true },
  });
  const acct = new Map(accountRows.map((a) => [a.code, a.id]));

  // Connections
  const [plaidConn] = await db
    .insert(schema.sourceConnections)
    .values({ orgId: org.id, kind: "PLAID", externalId: "item_demo_1", accessToken: "v1:demo" })
    .returning();
  const [stripeConn] = await db
    .insert(schema.sourceConnections)
    .values({ orgId: org.id, kind: "STRIPE", externalId: "acct_demo_1", accessToken: "v1:demo" })
    .returning();

  const D = (s: string) => new Date(s + "T12:00:00Z");
  type Row = typeof schema.sourceTransactions.$inferInsert;

  // ─── August (posted — P&L visible on first load) ─────────────────────────

  const bankAug: Row[] = [
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p1",  occurredAt: D("2026-08-03"), amountCents: 24800,  merchant: "STRIPE TRANSFER",       description: "STRIPE TRANSFER ST-2K8Q PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p2",  occurredAt: D("2026-08-04"), amountCents: -7900,  merchant: "Amazon Web Services",    description: "AWS EMEA AWS EMEA", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p3",  occurredAt: D("2026-08-05"), amountCents: -2000,  merchant: "OpenAI",                 description: "OPENAI API USAGE", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p4",  occurredAt: D("2026-08-06"), amountCents: -4900,  merchant: "Vercel",                 description: "VERCEL PRO", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p5",  occurredAt: D("2026-08-07"), amountCents: -15000, merchant: "Jane Contractor",        description: "WISE TRANSFER JANE C", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p6",  occurredAt: D("2026-08-10"), amountCents: 31200,  merchant: "STRIPE TRANSFER",       description: "STRIPE TRANSFER ST-9P2M PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p7",  occurredAt: D("2026-08-11"), amountCents: -7900,  merchant: "Amazon Web Services",    description: "AWS EMEA AWS EMEA", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p8",  occurredAt: D("2026-08-12"), amountCents: -1200,  merchant: "Resend",                 description: "RESEND EMAIL API", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p9",  occurredAt: D("2026-08-14"), amountCents: -8900,  merchant: "Regus",                  description: "REGUS COWORKING LAGOS", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p10", occurredAt: D("2026-08-15"), amountCents: -2500,  merchant: "Notion",                 description: "NOTION PLUS", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p11", occurredAt: D("2026-08-18"), amountCents: -9900,  merchant: "Figma",                  description: "FIGMA PROFESSIONAL", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p12", occurredAt: D("2026-08-20"), amountCents: -3500,  merchant: "Anthropic",              description: "ANTHROPIC API", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p13", occurredAt: D("2026-08-22"), amountCents: 55000,  merchant: "STRIPE TRANSFER",       description: "STRIPE TRANSFER ST-7H3N PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p14", occurredAt: D("2026-08-25"), amountCents: -5000,  merchant: "Google Workspace",       description: "GOOGLE*WORKSPACE", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p15", occurredAt: D("2026-08-28"), amountCents: -1800,  merchant: "GitHub",                 description: "GITHUB TEAM", raw: {} },
  ];

  const stripeAug: Row[] = [
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_1", occurredAt: D("2026-08-01"), amountCents: 25400, merchant: "Stripe", description: "charge ch_1", raw: { stripeType: "charge", fee: 1032, gross: 26432 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_1", occurredAt: D("2026-08-03"), amountCents: 24800, merchant: "Stripe Payout", description: "Stripe payout po_1", raw: { stripeType: "payout" } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_2", occurredAt: D("2026-08-08"), amountCents: 32100, merchant: "Stripe", description: "charge ch_2", raw: { stripeType: "charge", fee: 1162, gross: 33262 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_2", occurredAt: D("2026-08-10"), amountCents: 31200, merchant: "Stripe Payout", description: "Stripe payout po_2", raw: { stripeType: "payout" } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_3", occurredAt: D("2026-08-20"), amountCents: 56500, merchant: "Stripe", description: "charge ch_3", raw: { stripeType: "charge", fee: 1990, gross: 58490 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_3", occurredAt: D("2026-08-22"), amountCents: 55000, merchant: "Stripe Payout", description: "Stripe payout po_3", raw: { stripeType: "payout" } },
  ];

  const augTxns = await db
    .insert(schema.sourceTransactions)
    .values([...bankAug, ...stripeAug])
    .returning();

  const byExId = new Map(augTxns.map((t) => [t.externalId, t]));

  // Helper: insert a balanced double-entry and mark source txns as POSTED
  async function post(
    occurredAt: Date,
    memo: string,
    lines: { code: string; dr?: number; cr?: number }[],
    txnExIds: string[],
  ) {
    const sumDr = lines.reduce((s, l) => s + (l.dr ?? 0), 0);
    const sumCr = lines.reduce((s, l) => s + (l.cr ?? 0), 0);
    if (sumDr !== sumCr) throw new Error(`Unbalanced ${memo}: dr${sumDr} cr${sumCr}`);

    const [entry] = await db
      .insert(schema.entries)
      .values({ orgId: org.id, occurredAt, memo, createdBy: "seed" })
      .returning();

    await db.insert(schema.entryLines).values(
      lines.map((l) => ({
        entryId: entry.id,
        accountId: acct.get(l.code)!,
        debitCents: l.dr ?? 0,
        creditCents: l.cr ?? 0,
      })),
    );

    const ids = txnExIds.map((ex) => byExId.get(ex)!.id).filter(Boolean);
    if (ids.length) {
      await db
        .update(schema.sourceTransactions)
        .set({ status: "POSTED", entryId: entry.id, updatedAt: new Date() })
        .where(inArray(schema.sourceTransactions.id, ids));
    }
  }

  // Stripe charges: DR Stripe Clearing, CR Revenue; DR Fees, CR Clearing
  await post(D("2026-08-01"), "charge ch_1", [
    { code: "1100", dr: 26432 }, { code: "4000", cr: 26432 },
    { code: "5710", dr: 1032  }, { code: "1100", cr: 1032  },
  ], ["bt_ch_1"]);

  await post(D("2026-08-08"), "charge ch_2", [
    { code: "1100", dr: 33262 }, { code: "4000", cr: 33262 },
    { code: "5710", dr: 1162  }, { code: "1100", cr: 1162  },
  ], ["bt_ch_2"]);

  await post(D("2026-08-20"), "charge ch_3", [
    { code: "1100", dr: 58490 }, { code: "4000", cr: 58490 },
    { code: "5710", dr: 1990  }, { code: "1100", cr: 1990  },
  ], ["bt_ch_3"]);

  // Stripe payouts: DR Bank, CR Stripe Clearing. Both legs share the entry.
  await post(D("2026-08-03"), "Stripe payout po_1", [
    { code: "1000", dr: 24800 }, { code: "1100", cr: 24800 },
  ], ["po_po_1", "p1"]);

  await post(D("2026-08-10"), "Stripe payout po_2", [
    { code: "1000", dr: 31200 }, { code: "1100", cr: 31200 },
  ], ["po_po_2", "p6"]);

  await post(D("2026-08-22"), "Stripe payout po_3", [
    { code: "1000", dr: 55000 }, { code: "1100", cr: 55000 },
  ], ["po_po_3", "p13"]);

  // Bank expenses
  const expenses: Array<[string, number, string, string]> = [
    ["p2",  7900,  "5110", "AWS EMEA AWS EMEA"],
    ["p3",  2000,  "5120", "OPENAI API USAGE"],
    ["p4",  4900,  "5110", "VERCEL PRO"],
    ["p5",  15000, "5000", "WISE TRANSFER JANE C"],
    ["p7",  7900,  "5110", "AWS EMEA AWS EMEA"],
    ["p8",  1200,  "5100", "RESEND EMAIL API"],
    ["p9",  8900,  "5300", "REGUS COWORKING LAGOS"],
    ["p10", 2500,  "5100", "NOTION PLUS"],
    ["p11", 9900,  "5100", "FIGMA PROFESSIONAL"],
    ["p12", 3500,  "5120", "ANTHROPIC API"],
    ["p14", 5000,  "5100", "GOOGLE WORKSPACE"],
    ["p15", 1800,  "5100", "GITHUB TEAM"],
  ];

  for (const [exId, cents, code, memo] of expenses) {
    await post(byExId.get(exId)!.occurredAt, memo, [
      { code, dr: cents }, { code: "1000", cr: cents },
    ], [exId]);
  }

  console.log(`August: ${bankAug.length} bank + ${stripeAug.length} stripe txns posted`);

  // ─── September (PENDING — judge runs categorise → post live) ─────────────

  const bankSep: Row[] = [
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s1",  occurredAt: D("2026-09-01"), amountCents: 31200,  merchant: "STRIPE TRANSFER",    description: "STRIPE TRANSFER ST-4R7T PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s2",  occurredAt: D("2026-09-02"), amountCents: -7900,  merchant: "Amazon Web Services", description: "AWS EMEA AWS EMEA", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s3",  occurredAt: D("2026-09-03"), amountCents: -4200,  merchant: "Anthropic",           description: "ANTHROPIC API", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s4",  occurredAt: D("2026-09-04"), amountCents: -4900,  merchant: "Vercel",              description: "VERCEL PRO", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s5",  occurredAt: D("2026-09-05"), amountCents: -18000, merchant: "Jane Contractor",     description: "WISE TRANSFER JANE C", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s6",  occurredAt: D("2026-09-07"), amountCents: 28700,  merchant: "STRIPE TRANSFER",    description: "STRIPE TRANSFER ST-2N5K PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s7",  occurredAt: D("2026-09-08"), amountCents: -7900,  merchant: "Amazon Web Services", description: "AWS EMEA AWS EMEA", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s8",  occurredAt: D("2026-09-08"), amountCents: -2500,  merchant: "Notion",              description: "NOTION PLUS", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "s9",  occurredAt: D("2026-09-09"), amountCents: -8900,  merchant: "Regus",               description: "REGUS COWORKING LAGOS", raw: {} },
  ];

  const stripeSep: Row[] = [
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_4", occurredAt: D("2026-09-01"), amountCents: 32100, merchant: "Stripe", description: "charge ch_4", raw: { stripeType: "charge", fee: 1162, gross: 33262 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_4", occurredAt: D("2026-09-01"), amountCents: 31200, merchant: "Stripe Payout", description: "Stripe payout po_4", raw: { stripeType: "payout" } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_5", occurredAt: D("2026-09-06"), amountCents: 29500, merchant: "Stripe", description: "charge ch_5", raw: { stripeType: "charge", fee: 1076, gross: 30576 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_5", occurredAt: D("2026-09-07"), amountCents: 28700, merchant: "Stripe Payout", description: "Stripe payout po_5", raw: { stripeType: "payout" } },
  ];

  await db.insert(schema.sourceTransactions).values([...bankSep, ...stripeSep]);
  console.log(`September: ${bankSep.length} bank + ${stripeSep.length} stripe txns pending`);
  console.log(`Login: /api/auth/demo → /app`);
  console.log(`Run the bookkeeper on /app/transactions to categorise + post September.`);

  await client.end();
}

main();
