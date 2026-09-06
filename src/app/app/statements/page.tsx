import { redirect } from "next/navigation";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { balanceSheet, fmtCents, profitAndLoss } from "@/lib/statements";

export default async function StatementsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const userId = await userIdFromSession();
  if (!userId) redirect("/login");
  const org = await primaryOrgForUser(userId);
  if (!org) redirect("/login?error=noorg");

  const params = await searchParams;
  const now = new Date();
  const year = Number(params.year ?? now.getUTCFullYear());
  const month = Number(params.month ?? now.getUTCMonth() + 1);

  const asOf = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  const [pl, bs] = await Promise.all([
    profitAndLoss(org.id, year, month),
    balanceSheet(org.id, asOf),
  ]);

  const monthName = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-US", {
    month: "long",
    timeZone: "UTC",
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">{org.name}</div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">
        {monthName} {year}
      </h1>

      <section className="mb-10 rounded border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Profit &amp; loss
        </h2>
        <Line label="Revenue" value={pl.totalRevenueCents} bold />
        <div className="ml-4 mb-2">
          {pl.revenue.map((l) => (
            <Line key={l.code} label={`${l.code} ${l.name}`} value={l.totalCents} small />
          ))}
        </div>
        <Line label="Expenses" value={-pl.totalExpenseCents} />
        <div className="ml-4 mb-2">
          {pl.expenses.map((l) => (
            <Line key={l.code} label={`${l.code} ${l.name}`} value={-l.totalCents} small />
          ))}
        </div>
        <div className="mt-2 border-t border-neutral-200 pt-2">
          <Line label="Net income" value={pl.netIncomeCents} bold />
        </div>
      </section>

      <section className="rounded border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Balance sheet
        </h2>
        <Line label="Assets" value={bs.totalAssetsCents} bold />
        <div className="ml-4 mb-2">
          {bs.assets.map((l) => (
            <Line key={l.code} label={`${l.code} ${l.name}`} value={l.balanceCents} small />
          ))}
        </div>
        <Line label="Liabilities" value={bs.totalLiabilitiesCents} bold />
        <div className="ml-4 mb-2">
          {bs.liabilities.map((l) => (
            <Line key={l.code} label={`${l.code} ${l.name}`} value={l.balanceCents} small />
          ))}
        </div>
        <Line label="Equity" value={bs.totalEquityCents} bold />
        <div className="ml-4 mb-2">
          {bs.equity.map((l) => (
            <Line key={l.code} label={`${l.code} ${l.name}`} value={l.balanceCents} small />
          ))}
        </div>
        <div className="mt-2 border-t border-neutral-200 pt-2 text-xs text-neutral-500">
          {bs.balances ? "Balanced: assets = liabilities + equity." : "Out of balance — investigate."}
        </div>
      </section>
    </main>
  );
}

function Line({
  label,
  value,
  bold,
  small,
}: {
  label: string;
  value: number;
  bold?: boolean;
  small?: boolean;
}) {
  return (
    <div className={`flex items-baseline justify-between py-0.5 ${small ? "text-xs text-neutral-600" : "text-sm"}`}>
      <span className={bold ? "font-semibold" : ""}>{label}</span>
      <span className={`font-mono tabular-nums ${bold ? "font-semibold" : ""}`}>
        {fmtCents(value)}
      </span>
    </div>
  );
}
