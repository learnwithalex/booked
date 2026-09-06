// Stripe reconciliation.
//
// The #1 bookkeeper task for a Stripe business: prove that the money Stripe
// says it sent you equals the money that actually arrived in your bank.
// Without this, revenue is double-counted (once at charge time, again at
// deposit time) — the classic failure mode of naive Stripe integrations.
//
// Match rule: a Plaid deposit whose merchant/description mentions "STRIPE"
// and whose amount equals an unreconciled po_* payout within ±2 days.
// Unmatched-after-7-days payouts raise a MISSING_RECONCILIATION anomaly.

import { and, eq, gte, lte } from "drizzle-orm";
import { db, anomalies, sourceTransactions } from "@/db";
import { postCategorisedTxn } from "./posting";

export interface ReconResult {
  matched: number;
  anomaliesRaised: number;
}

export async function reconcileStripePayouts(orgId: string): Promise<ReconResult> {
  const payouts = await db.query.sourceTransactions.findMany({
    where: (t, { and, eq }) =>
      and(eq(t.orgId, orgId), eq(t.status, "CATEGORISED")),
    orderBy: (t, { asc }) => [asc(t.occurredAt)],
  });

  const unreconciled = payouts.filter(
    (p) => p.externalId.startsWith("po_") && !p.entryId,
  );

  let matched = 0;
  let anomaliesRaised = 0;

  for (const payout of unreconciled) {
    const cents = Number(payout.amountCents);
    const lo = new Date(payout.occurredAt.getTime() - 2 * 86400_000);
    const hi = new Date(payout.occurredAt.getTime() + 2 * 86400_000);

    const candidates = await db.query.sourceTransactions.findMany({
      where: (t, { and, eq, gte, lte }) =>
        and(
          eq(t.orgId, orgId),
          gte(t.occurredAt, lo),
          lte(t.occurredAt, hi),
          eq(t.amountCents, cents),
        ),
      limit: 10,
    });

    const bankLeg = candidates.find(
      (c) =>
        !c.externalId.startsWith("po_") &&
        !c.externalId.startsWith("bt_") &&
        /stripe/i.test(`${c.merchant ?? ""} ${c.description ?? ""}`) &&
        c.status !== "IGNORED",
    );

    if (bankLeg) {
      // Post the payout as a transfer 1000→1100, then link the bank leg to
      // the same entry instead of posting it separately (prevents the
      // double-count: the bank deposit IS the payout arriving).
      const entryId = await postCategorisedTxn(orgId, payout.id, "1100", "agent");
      await db
        .update(sourceTransactions)
        .set({ status: "POSTED", entryId, updatedAt: new Date() })
        .where(eq(sourceTransactions.id, bankLeg.id));
      matched++;
    } else if (Date.now() - payout.occurredAt.getTime() > 7 * 86400_000) {
      const already = await db.query.anomalies.findFirst({
        where: (a, { and, eq }) =>
          and(eq(a.orgId, orgId), eq(a.kind, "MISSING_RECONCILIATION"), eq(a.txnId, payout.id)),
      });
      if (!already) {
        await db.insert(anomalies).values({
          orgId,
          kind: "MISSING_RECONCILIATION",
          detailsJson: {
            payoutId: payout.externalId,
            amountCents: cents,
            occurredAt: payout.occurredAt.toISOString(),
            message: `Stripe payout of $${(cents / 100).toFixed(2)} has no matching bank deposit after 7 days.`,
          },
          txnId: payout.id,
        });
        anomaliesRaised++;
      }
    }
  }

  return { matched, anomaliesRaised };
}
