import { redirect } from "next/navigation";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { db } from "@/db";
import { profitAndLoss, balanceSheet, fmtCents } from "@/lib/statements";
import { RunAgentButton } from "./run-agent-button";

export default async function AppPage() {
  const userId = await userIdFromSession();
  if (!userId) redirect("/login");
  const org = await primaryOrgForUser(userId);
  if (!org) redirect("/login?error=noorg");

  const now = new Date();
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth() + 1;

  const [pendingRows, currentPl] = await Promise.all([
    db.query.sourceTransactions.findMany({
      where: (t, { and, eq, inArray }) =>
        and(eq(t.orgId, org.id), inArray(t.status, ["PENDING", "CATEGORISED"])),
      columns: { id: true, status: true },
    }),
    profitAndLoss(org.id, year, month),
  ]);

  // If the current month is empty, show the last month that has ledger data
  // so the dashboard isn't all zeros on first load.
  let pl = currentPl;
  let isCurrentMonth = true;
  if (pl.revenue.length === 0 && pl.expenses.length === 0) {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevPl = await profitAndLoss(org.id, prevYear, prevMonth);
    if (prevPl.revenue.length > 0 || prevPl.expenses.length > 0) {
      pl = prevPl;
      year = prevYear;
      month = prevMonth;
      isCurrentMonth = false;
    }
  }

  const asOf = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  const bs = await balanceSheet(org.id, asOf);

  const monthName = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });

  const pendingCount = pendingRows.filter((r) => r.status === "PENDING").length;
  const categorisedCount = pendingRows.filter((r) => r.status === "CATEGORISED").length;
  const totalActionable = pendingCount + categorisedCount;
  const cashCents = bs.assets.find((a) => a.code === "1000")?.balanceCents ?? 0;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">{org.name}</div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {monthName} {year}
          </h1>
          {!isCurrentMonth && (
            <p className="mt-1 text-xs text-neutral-500">
              Showing last closed month — run the bookkeeper to post{" "}
              {new Date().toLocaleString("en-US", { month: "long", timeZone: "UTC" })}
            </p>
          )}
        </div>
        <RunAgentButton />
      </div>

      {/* Prominent CTA when there are actionable transactions */}
      {totalActionable > 0 && (
        <div className="mb-8 flex items-center justify-between rounded border border-amber-200 bg-amber-50 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-amber-900">
              {totalActionable} transaction{totalActionable !== 1 ? "s" : ""} need attention
            </p>
            <p className="text-xs text-amber-700">
              {pendingCount > 0 && `${pendingCount} pending categorisation`}
              {pendingCount > 0 && categorisedCount > 0 && " · "}
              {categorisedCount > 0 && `${categorisedCount} ready to post`}
            </p>
          </div>
          <a
            href="/app/transactions"
            className="rounded bg-amber-900 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-800"
          >
            Review inbox →
          </a>
        </div>
      )}

      {/* KPI row */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KPI label="Revenue" value={fmtCents(pl.totalRevenueCents)} />
        <KPI label="Expenses" value={fmtCents(pl.totalExpenseCents)} />
        <KPI
          label="Net income"
          value={fmtCents(pl.netIncomeCents)}
          highlight={pl.netIncomeCents > 0 ? "green" : pl.netIncomeCents < 0 ? "red" : undefined}
        />
        <KPI label="Cash balance" value={fmtCents(cashCents)} />
      </div>

      {/* P&L breakdown */}
      <div className="mb-8 rounded border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Profit &amp; Loss — {monthName} {year}
          </span>
        </div>
        <div className="px-6 py-4">
          {pl.revenue.length === 0 && pl.expenses.length === 0 ? (
            <p className="text-sm text-neutral-500">
              No transactions posted yet.{" "}
              {totalActionable > 0
                ? `${totalActionable} transaction${totalActionable !== 1 ? "s" : ""} ready — click Run bookkeeper above.`
                : "Connect a source to import transactions."}
            </p>
          ) : (
            <>
              {pl.revenue.length > 0 && (
                <div className="mb-4">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                    Revenue
                  </div>
                  {pl.revenue.map((l) => (
                    <Row key={l.code} label={`${l.code} · ${l.name}`} value={fmtCents(l.totalCents)} />
                  ))}
                </div>
              )}
              {pl.expenses.length > 0 && (
                <div className="mb-4">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-600">
                    Expenses
                  </div>
                  {pl.expenses.map((l) => (
                    <Row
                      key={l.code}
                      label={`${l.code} · ${l.name}`}
                      value={`(${fmtCents(l.totalCents)})`}
                      dim
                    />
                  ))}
                </div>
              )}
              <div className="border-t border-neutral-100 pt-3 flex items-baseline justify-between">
                <span className="text-sm font-semibold">Net income</span>
                <span
                  className={`font-mono text-sm font-semibold ${
                    pl.netIncomeCents >= 0 ? "text-emerald-700" : "text-red-600"
                  }`}
                >
                  {fmtCents(pl.netIncomeCents)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border border-neutral-200 bg-white p-6">
          <div className="mb-1 text-xs uppercase tracking-wider text-neutral-500">Transactions</div>
          <div className="text-3xl font-semibold tabular-nums">{totalActionable}</div>
          <div className="text-xs text-neutral-400">
            {totalActionable > 0 ? "awaiting review" : "all clear"}
          </div>
          <a
            href="/app/transactions"
            className="mt-3 block text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
          >
            View all transactions →
          </a>
        </div>
        <div className="rounded border border-neutral-200 bg-white p-6">
          <div className="mb-1 text-xs uppercase tracking-wider text-neutral-500">Statements</div>
          <div className="text-sm font-medium text-neutral-700">P&amp;L · Balance sheet</div>
          <div className="text-xs text-neutral-400">
            Generated from the ledger, any period
          </div>
          <a
            href="/app/statements"
            className="mt-3 block text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-700"
          >
            View statements →
          </a>
        </div>
      </div>
    </main>
  );
}

function KPI({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "green" | "red";
}) {
  const valueClass =
    highlight === "green"
      ? "text-emerald-700"
      : highlight === "red"
      ? "text-red-600"
      : "text-neutral-900";

  return (
    <div className="rounded border border-neutral-200 bg-white p-5">
      <div className="mb-1 text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className={`text-xl font-semibold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}

function Row({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between py-0.5 text-sm ${
        dim ? "text-neutral-500" : "text-neutral-800"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}
