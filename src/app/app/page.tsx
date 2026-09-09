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

  const [actionableRows, currentPl] = await Promise.all([
    db.query.sourceTransactions.findMany({
      where: (t, { and, eq, inArray }) =>
        and(eq(t.orgId, org.id), inArray(t.status, ["PENDING", "CATEGORISED"])),
      orderBy: (t, { desc }) => [desc(t.occurredAt)],
      columns: { id: true, status: true, merchant: true, description: true, amountCents: true, occurredAt: true, currency: true },
      limit: 10,
    }),
    profitAndLoss(org.id, year, month),
  ]);

  // Fall back to last month with data if the current one is empty
  let pl = currentPl;
  let isCurrentMonth = true;
  if (pl.revenue.length === 0 && pl.expenses.length === 0) {
    const pm = month === 1 ? 12 : month - 1;
    const py = month === 1 ? year - 1 : year;
    const prevPl = await profitAndLoss(org.id, py, pm);
    if (prevPl.revenue.length > 0 || prevPl.expenses.length > 0) {
      pl = prevPl; year = py; month = pm; isCurrentMonth = false;
    }
  }

  const asOf = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  const bs = await balanceSheet(org.id, asOf);
  const monthName = new Date(Date.UTC(year, month - 1, 1))
    .toLocaleString("en-US", { month: "long", timeZone: "UTC" });
  const cashCents = bs.assets.find((a) => a.code === "1000")?.balanceCents ?? 0;

  const currentMonthName = now.toLocaleString("en-US", { month: "long", timeZone: "UTC" });

  return (
    <div className="px-8 py-6">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-600">Overview</div>
          <h1 className="mt-0.5 text-[18px] font-semibold text-zinc-100">
            {monthName} {year}
            {!isCurrentMonth && (
              <span className="ml-2 text-[12px] font-normal text-zinc-500">
                (last closed · {currentMonthName} has {actionableRows.length} pending)
              </span>
            )}
          </h1>
        </div>
        <RunAgentButton />
      </div>

      {/* KPI strip */}
      <div className="mb-6 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
        <KPI label="Revenue" value={fmtCents(pl.totalRevenueCents)} positive />
        <KPI label="Expenses" value={fmtCents(pl.totalExpenseCents)} negative />
        <KPI
          label="Net income"
          value={fmtCents(pl.netIncomeCents)}
          positive={pl.netIncomeCents > 0}
          negative={pl.netIncomeCents < 0}
        />
        <KPI label="Cash" value={fmtCents(cashCents)} />
      </div>

      <div className="grid grid-cols-[1fr_340px] gap-6">
        {/* P&L */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Profit &amp; Loss — {monthName} {year}
            </span>
          </div>

          {pl.revenue.length === 0 && pl.expenses.length === 0 ? (
            <div className="px-5 py-8 text-[13px] text-zinc-500">
              No transactions posted.{" "}
              {actionableRows.length > 0
                ? `${actionableRows.length} ready — click Run bookkeeper.`
                : "Connect a source to import transactions."}
            </div>
          ) : (
            <div className="px-5 py-3">
              {pl.revenue.map((l) => (
                <PLRow key={l.code} code={l.code} name={l.name} value={l.totalCents} type="revenue" />
              ))}
              {pl.expenses.length > 0 && pl.revenue.length > 0 && (
                <div className="my-2 border-t border-zinc-800" />
              )}
              {pl.expenses.map((l) => (
                <PLRow key={l.code} code={l.code} name={l.name} value={l.totalCents} type="expense" />
              ))}
              <div className="mt-3 border-t border-zinc-700 pt-3 flex items-baseline justify-between">
                <span className="text-[13px] font-semibold text-zinc-200">Net income</span>
                <span className={`font-mono text-[13px] font-semibold ${pl.netIncomeCents >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {fmtCents(pl.netIncomeCents)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pending transactions panel */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Pending
            </span>
            {actionableRows.length > 0 && (
              <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300">
                {actionableRows.length}
              </span>
            )}
          </div>

          {actionableRows.length === 0 ? (
            <div className="px-4 py-6 text-[12px] text-zinc-500">All clear.</div>
          ) : (
            <div>
              {actionableRows.map((t) => (
                <div key={t.id} className="flex items-center gap-2.5 border-b border-zinc-800/60 px-4 py-2.5 last:border-0">
                  <StatusDot status={t.status} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-medium text-zinc-200">
                      {t.merchant ?? t.description ?? "Unknown"}
                    </div>
                    <div className="text-[10px] text-zinc-600">
                      {t.occurredAt instanceof Date
                        ? t.occurredAt.toISOString().slice(5, 10)
                        : String(t.occurredAt).slice(5, 10)}
                    </div>
                  </div>
                  <span className={`shrink-0 font-mono text-[11px] ${Number(t.amountCents) >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {Number(t.amountCents) >= 0 ? "+" : ""}
                    {(Math.abs(Number(t.amountCents)) / 100).toFixed(0)}
                  </span>
                </div>
              ))}
              <div className="px-4 py-2.5">
                <a href="/app/transactions" className="text-[11px] text-indigo-400 hover:text-indigo-300">
                  View all in inbox →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  const valueClass = positive ? "text-emerald-400" : negative ? "text-red-400" : "text-zinc-100";
  return (
    <div className="bg-zinc-900 px-5 py-4">
      <div className="mb-1 text-[10px] uppercase tracking-wider text-zinc-600">{label}</div>
      <div className={`text-[18px] font-semibold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  );
}

function PLRow({ code, name, value, type }: { code: string; name: string; value: number; type: "revenue" | "expense" }) {
  const isExpense = type === "expense";
  return (
    <div className="flex items-baseline justify-between py-[5px]">
      <span className="text-[12px] text-zinc-400">
        <span className="font-mono text-zinc-600">{code}</span>
        <span className="ml-1.5">{name}</span>
      </span>
      <span className={`font-mono text-[12px] ${isExpense ? "text-red-400" : "text-emerald-400"}`}>
        {isExpense ? `(${fmtCents(value)})` : fmtCents(value)}
      </span>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const cls =
    status === "PENDING" ? "bg-amber-400" :
    status === "CATEGORISED" ? "bg-indigo-400" :
    status === "POSTED" ? "bg-emerald-400" :
    "bg-zinc-600";
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cls}`} />;
}
