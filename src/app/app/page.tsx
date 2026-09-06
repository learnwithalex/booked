import { redirect } from "next/navigation";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { db } from "@/db";

// Shell for the authenticated app. Data views (transactions inbox,
// statements, close packet) land here next.

export default async function AppPage() {
  const userId = await userIdFromSession();
  if (!userId) redirect("/login");

  const org = await primaryOrgForUser(userId);
  if (!org) redirect("/login?error=noorg");

  const [txnCount, accountCount] = await Promise.all([
    db.query.sourceTransactions.findMany({
      where: (t, { eq }) => eq(t.orgId, org.id),
      columns: { id: true },
    }),
    db.query.accounts.findMany({
      where: (a, { eq }) => eq(a.orgId, org.id),
      columns: { id: true },
    }),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">{org.name}</div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Overview</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded border border-neutral-200 bg-white p-6">
          <div className="mb-1 text-xs uppercase tracking-wider text-neutral-500">Transactions</div>
          <div className="text-3xl font-semibold tabular-nums">{txnCount.length}</div>
        </div>
        <div className="rounded border border-neutral-200 bg-white p-6">
          <div className="mb-1 text-xs uppercase tracking-wider text-neutral-500">Accounts</div>
          <div className="text-3xl font-semibold tabular-nums">{accountCount.length}</div>
        </div>
      </div>
      <p className="mt-8 text-sm text-neutral-600">
        No sources connected yet. Plaid (bank) and Stripe (revenue) connections land here next.
      </p>
    </main>
  );
}
