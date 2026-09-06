// Seed a demo org with realistic fixtures so the full pipeline
// (categorise → post → reconcile → statements) can be exercised without
// Plaid/Stripe credentials. Run: tsx scripts/seed-fixtures.ts
//
// Destroys and recreates the demo org ("demo@booked.app" / "Demo Co").

import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import postgres from "postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";
import { CHART_OF_ACCOUNTS } from "../src/db/chart";

const DEMO_EMAIL = "demo@booked.app";
const DEMO_ORG = "Demo Co";

async function main() {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });
  const db: PostgresJsDatabase<typeof schema> = drizzle(client, { schema });

  const existing = await db.query.orgs.findFirst({
    where: (o, { eq }) => eq(o.name, DEMO_ORG),
  });
  if (existing) {
    // Teardown order respects FKs with no cascade: entry_lines → entries →
    // source txns → rules/accounts/connections → org_users → org.
    // (Source txns carry entry_id but no FK; org_users has no cascade to
    // orgs, so delete it explicitly or the org delete hangs on the FK.)
    const entryIds = (
      await db.query.entries.findMany({
        where: (e, { eq }) => eq(e.orgId, existing.id),
        columns: { id: true },
      })
    ).map((e) => e.id);
    for (const id of entryIds) {
      await db.delete(schema.entryLines).where(eq(schema.entryLines.entryId, id));
    }
    await db.delete(schema.entries).where(eq(schema.entries.orgId, existing.id));
    await db
      .delete(schema.sourceTransactions)
      .where(eq(schema.sourceTransactions.orgId, existing.id));
    await db.delete(schema.rules).where(eq(schema.rules.orgId, existing.id));
    await db.delete(schema.accounts).where(eq(schema.accounts.orgId, existing.id));
    await db
      .delete(schema.sourceConnections)
      .where(eq(schema.sourceConnections.orgId, existing.id));
    await db.delete(schema.orgUsers).where(eq(schema.orgUsers.orgId, existing.id));
    await db.delete(schema.orgs).where(eq(schema.orgs.id, existing.id));
    console.log("cleared existing demo org");
  }

  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, DEMO_EMAIL),
  });
  const user =
    existingUser ??
    (await db.insert(schema.users).values({ email: DEMO_EMAIL }).returning()).at(0)!;
  const [org] = await db.insert(schema.orgs).values({ name: DEMO_ORG }).returning();
  await db.insert(schema.orgUsers).values({ orgId: org.id, userId: user.id, role: "owner" });
  // Same base rules a real org gets on first login — rules path, not LLM.
  await db
    .insert(schema.rules)
    .values([
      { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "STRIPE", accountCode: "4000", priority: 100, createdBy: "system" },
      { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "AMAZON WEB SERVICES", accountCode: "5110", priority: 100, createdBy: "system" },
      { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "AWS", accountCode: "5110", priority: 90, createdBy: "system" },
      { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "OPENAI", accountCode: "5120", priority: 100, createdBy: "system" },
      { orgId: org.id, field: "MERCHANT", op: "CONTAINS", pattern: "ANTHROPIC", accountCode: "5120", priority: 100, createdBy: "system" },
    ])
    .onConflictDoNothing();
  await db.insert(schema.accounts).values(
    CHART_OF_ACCOUNTS.map((a) => ({
      orgId: org.id,
      code: a.code,
      name: a.name,
      type: a.type as "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE",
    })),
  );

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
  const bank: Row[] = [
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p1", occurredAt: D("2026-08-03"), amountCents: 24800, merchant: "STRIPE TRANSFER", description: "STRIPE TRANSFER ST-2K8Q PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p2", occurredAt: D("2026-08-04"), amountCents: -7900, merchant: "Amazon Web Services", description: "AWS EMEA AWS EMEA", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p3", occurredAt: D("2026-08-05"), amountCents: -2000, merchant: "OpenAI", description: "OPENAI API USAGE", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p4", occurredAt: D("2026-08-06"), amountCents: -4900, merchant: "Vercel", description: "VERCEL PRO", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p5", occurredAt: D("2026-08-07"), amountCents: -15000, merchant: "Jane Contractor", description: "WISE TRANSFER JANE C", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p6", occurredAt: D("2026-08-10"), amountCents: 31200, merchant: "STRIPE TRANSFER", description: "STRIPE TRANSFER ST-9P2M PAYOUT", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p7", occurredAt: D("2026-08-11"), amountCents: -7900, merchant: "Amazon Web Services", description: "AWS EMEA AWS EMEA", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p8", occurredAt: D("2026-08-12"), amountCents: -1200, merchant: "Resend", description: "RESEND EMAIL API", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p9", occurredAt: D("2026-08-14"), amountCents: -8900, merchant: "Regus", description: "REGUS COWORKING LAGOS", raw: {} },
    { orgId: org.id, connectionId: plaidConn.id, externalId: "p10", occurredAt: D("2026-08-15"), amountCents: -2500, merchant: "Notion", description: "NOTION PLUS", raw: {} },
  ];
  const stripe: Row[] = [
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_1", occurredAt: D("2026-08-01"), amountCents: 25400, merchant: "Stripe", description: "charge ch_1", raw: { stripeType: "charge", fee: 1032, gross: 26432 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_1", occurredAt: D("2026-08-03"), amountCents: 24800, merchant: "Stripe Payout", description: "Stripe payout po_1", raw: { stripeType: "payout" } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "bt_ch_2", occurredAt: D("2026-08-08"), amountCents: 32100, merchant: "Stripe", description: "charge ch_2", raw: { stripeType: "charge", fee: 1162, gross: 33262 } },
    { orgId: org.id, connectionId: stripeConn.id, externalId: "po_po_2", occurredAt: D("2026-08-10"), amountCents: 31200, merchant: "Stripe Payout", description: "Stripe payout po_2", raw: { stripeType: "payout" } },
  ];

  await db.insert(schema.sourceTransactions).values([...bank, ...stripe]);
  console.log(`seeded demo org ${org.id} (${bank.length} bank + ${stripe.length} stripe txns)`);
  console.log(`login as ${DEMO_EMAIL} via /login (dev mode link)`);
  await client.end();
}

main();
