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

  // Month navigation: previous / next
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return (
    <div className="px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-zinc-600">Statements</div>
          <h1 className="mt-0.5 text-[18px] font-semibold text-zinc-100">
            {monthName} {year}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/app/statements?year=${prevYear}&month=${prevMonth}`}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-[12px] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
          >
            ← Prev
          </a>
          <a
            href={`/app/statements?year=${nextYear}&month=${nextMonth}`}
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-[12px] text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
          >
            Next →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* P&L */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-5 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Profit &amp; Loss
            </span>
          </div>
          <div className="px-5 py-4">
            {pl.revenue.length === 0 && pl.expenses.length === 0 ? (
              <p className="text-[12px] text-zinc-600">No data for this period.</p>
            ) : (
              <>
                <SectionLabel>Revenue</SectionLabel>
                <Line label="Total revenue" value={pl.totalRevenueCents} bold />
                <div className="mb-3 ml-3">
                  {pl.revenue.map((l) => (
                    <Line key={l.code} label={`${l.code} · ${l.name}`} value={l.totalCents} small />
                  ))}
                </div>
                <SectionLabel>Expenses</SectionLabel>
                <Line label="Total expenses" value={-pl.totalExpenseCents} bold />
                <div className="mb-3 ml-3">
                  {pl.expenses.map((l) => (
                    <Line key={l.code} label={`${l.code} · ${l.name}`} value={-l.totalCents} small />
                  ))}
                </div>
                <div className="border-t border-zinc-700 pt-3">
                  <Line label="Net income" value={pl.netIncomeCents} bold />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Balance sheet */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="border-b border-zinc-800 px-5 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Balance Sheet
            </span>
          </div>
          <div className="px-5 py-4">
            {bs.assets.length === 0 && bs.liabilities.length === 0 ? (
              <p className="text-[12px] text-zinc-600">No data for this period.</p>
            ) : (
              <>
                <SectionLabel>Assets</SectionLabel>
                <Line label="Total assets" value={bs.totalAssetsCents} bold />
                <div className="mb-3 ml-3">
                  {bs.assets.map((l) => (
                    <Line key={l.code} label={`${l.code} · ${l.name}`} value={l.balanceCents} small />
                  ))}
                </div>
                <SectionLabel>Liabilities</SectionLabel>
                <Line label="Total liabilities" value={bs.totalLiabilitiesCents} bold />
                <div className="mb-3 ml-3">
                  {bs.liabilities.map((l) => (
                    <Line key={l.code} label={`${l.code} · ${l.name}`} value={l.balanceCents} small />
                  ))}
                </div>
                <SectionLabel>Equity</SectionLabel>
                <Line label="Total equity" value={bs.totalEquityCents} bold />
                <div className="mb-3 ml-3">
                  {bs.equity.map((l) => (
                    <Line key={l.code} label={`${l.code} · ${l.name}`} value={l.balanceCents} small />
                  ))}
                </div>
                <div className="border-t border-zinc-700 pt-2 text-[10px] text-zinc-600">
                  {bs.balances ? "Balanced ✓" : "Out of balance — investigate"}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-1 mt-2 text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
      {children}
    </div>
  );
}

function Line({ label, value, bold, small }: { label: string; value: number; bold?: boolean; small?: boolean }) {
  const textCls = small ? "text-[11px] text-zinc-500" : "text-[12px] text-zinc-300";
  const valueCls = value < 0 ? "text-red-400" : value > 0 ? "text-emerald-400" : "text-zinc-400";
  return (
    <div className={`flex items-baseline justify-between py-[3px] ${textCls}`}>
      <span className={bold ? "font-semibold text-zinc-200" : ""}>{label}</span>
      <span className={`font-mono tabular-nums ${bold ? `font-semibold ${valueCls}` : "text-zinc-400"}`}>
        {fmtCents(value)}
      </span>
    </div>
  );
}
