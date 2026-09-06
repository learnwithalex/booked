import { redirect } from "next/navigation";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { db } from "@/db";
import { InboxClient } from "./inbox-client";

// Review inbox: every PENDING + CATEGORISED txn, newest first.
// Approve (post with hint), edit (post with override + learn), or skip.
export default async function TransactionsPage() {
  const userId = await userIdFromSession();
  if (!userId) redirect("/login");
  const org = await primaryOrgForUser(userId);
  if (!org) redirect("/login?error=noorg");

  const rows = await db.query.sourceTransactions.findMany({
    where: (t, { and, eq, inArray }) =>
      and(eq(t.orgId, org.id), inArray(t.status, ["PENDING", "CATEGORISED"])),
    orderBy: (t, { desc }) => [desc(t.occurredAt)],
    limit: 200,
  });

  const accounts = await db.query.accounts.findMany({
    where: (a, { eq }) => eq(a.orgId, org.id),
    orderBy: (a, { asc }) => [a.code],
    columns: { code: true, name: true },
  });

  const serialised = rows.map((r) => ({
    id: r.id,
    occurredAt: r.occurredAt.toISOString().slice(0, 10),
    merchant: r.merchant,
    description: r.description,
    amountCents: Number(r.amountCents),
    currency: r.currency,
    status: r.status,
    confidence: r.confidence,
    categoryHint: r.categoryHint,
  }));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">{org.name}</div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        Review inbox{" "}
        <span className="text-base font-normal text-neutral-500">({rows.length})</span>
      </h1>
      <InboxClient initial={serialised} accounts={accounts} />
    </main>
  );
}
