import { redirect } from "next/navigation";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { db } from "@/db";
import { InboxClient } from "./inbox-client";

export default async function TransactionsPage() {
  const userId = await userIdFromSession();
  if (!userId) redirect("/login");
  const org = await primaryOrgForUser(userId);
  if (!org) redirect("/login?error=noorg");

  const rows = await db.query.sourceTransactions.findMany({
    where: (t, { eq }) => eq(t.orgId, org.id),
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

  const pendingCount = rows.filter((r) => r.status === "PENDING" || r.status === "CATEGORISED").length;

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-wider text-zinc-600">Transactions</div>
        <h1 className="mt-0.5 text-[18px] font-semibold text-zinc-100">
          Inbox
          {pendingCount > 0 && (
            <span className="ml-2 text-[13px] font-normal text-zinc-500">{pendingCount} need attention</span>
          )}
        </h1>
      </div>
      <InboxClient initial={serialised} accounts={accounts} />
    </div>
  );
}
