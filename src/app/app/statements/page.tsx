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

  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  return (
    <div className="px-6 py-5">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-widest text-lx-faint">Statements</div>
          <h1 className="mt-1 text-[20px] font-semibold tracking-tight text-lx-text">
            {monthName} {year}
          </h1>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <a
            href={`/app/statements?year=${prevYear}&month=${prevMonth}`}
            className="rounded px-2.5 py-1.5 text-[12px] text-lx-faint transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-lx-muted"
            style={{ border: "1px solid #2a2a32" }}
          >
            ← Prev
          </a>
          <a
            href={`/app/statements?year=${nextYear}&month=${nextMonth}`}
            className="rounded px-2.5 py-1.5 text-[12px] text-lx-faint transition-colors hover:bg-[rgba(255,255,255,0.04)] hover:text-lx-muted"
            style={{ border: "1px solid #2a2a32" }}
          >
            Next →
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* P&L */}
        <div className="rounded-md border border-lx-border" style={{ background: "#1c1c22" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #2a2a32" }}>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-lx-faint">
              Profit &amp; Loss
            </span>
          </div>
          <div className="px-4 py-3">
            {pl.revenue.length === 0 && pl.expenses.length === 0 ? (
              <p className="text-[12px] text-lx-faint">No data for this period.</p>
            ) : (
              <>
                <StatSection label="Revenue">
                  <StatLine label="Total revenue" value={pl.totalRevenueCents} bold />
                  <div className="ml-3">
                    {pl.revenue.map((l) => (
                      <StatLine key={l.code} label={`${l.code} · ${l.name}`} value={l.totalCents} small />
                    ))}
                  </div>
                </StatSection>

                <div className="my-3" style={{ borderTop: "1px solid #2a2a32" }} />

                <StatSection label="Expenses">
                  <StatLine label="Total expenses" value={-pl.totalExpenseCents} bold />
                  <div className="ml-3">
                    {pl.expenses.map((l) => (
                      <StatLine key={l.code} label={`${l.code} · ${l.name}`} value={-l.totalCents} small />
                    ))}
                  </div>
                </StatSection>

                <div className="mt-3 pt-3" style={{ borderTop: "1px solid #2a2a32" }}>
                  <StatLine label="Net income" value={pl.netIncomeCents} bold />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Balance sheet */}
        <div className="rounded-md border border-lx-border" style={{ background: "#1c1c22" }}>
          <div className="px-4 py-3" style={{ borderBottom: "1px solid #2a2a32" }}>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-lx-faint">
              Balance Sheet
            </span>
          </div>
          <div className="px-4 py-3">
            {bs.assets.length === 0 && bs.liabilities.length === 0 ? (
              <p className="text-[12px] text-lx-faint">No data for this period.</p>
            ) : (
              <>
                <StatSection label="Assets">
                  <StatLine label="Total assets" value={bs.totalAssetsCents} bold />
                  <div className="ml-3">
                    {bs.assets.map((l) => (
                      <StatLine key={l.code} label={`${l.code} · ${l.name}`} value={l.balanceCents} small />
                    ))}
                  </div>
                </StatSection>

                <div className="my-3" style={{ borderTop: "1px solid #2a2a32" }} />

                <StatSection label="Liabilities">
                  <StatLine label="Total liabilities" value={bs.totalLiabilitiesCents} bold />
                  <div className="ml-3">
                    {bs.liabilities.map((l) => (
                      <StatLine key={l.code} label={`${l.code} · ${l.name}`} value={l.balanceCents} small />
                    ))}
                  </div>
                </StatSection>

                <div className="my-3" style={{ borderTop: "1px solid #2a2a32" }} />

                <StatSection label="Equity">
                  <StatLine label="Total equity" value={bs.totalEquityCents} bold />
                  <div className="ml-3">
                    {bs.equity.map((l) => (
                      <StatLine key={l.code} label={`${l.code} · ${l.name}`} value={l.balanceCents} small />
                    ))}
                  </div>
                </StatSection>

                <div className="mt-3 pt-2 text-[10px] text-lx-faint" style={{ borderTop: "1px solid #2a2a32" }}>
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

function StatSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="mb-1 mt-1 text-[10px] font-semibold uppercase tracking-widest text-lx-faint">{label}</div>
      {children}
    </div>
  );
}

function StatLine({ label, value, bold, small }: { label: string; value: number; bold?: boolean; small?: boolean }) {
  const textCls = small ? "text-[11px] text-lx-faint" : "text-[12px] text-lx-muted";
  const positive = value > 0;
  const negative = value < 0;
  return (
    <div className={`flex items-baseline justify-between py-[3px] ${textCls}`}>
      <span className={bold ? "font-semibold text-lx-text" : ""}>{label}</span>
      <span
        className={`font-mono tabular-nums ${
          bold
            ? `font-semibold ${positive ? "text-lx-green" : negative ? "text-lx-red" : "text-lx-muted"}`
            : "text-lx-faint"
        }`}
      >
        {fmtCents(value)}
      </span>
    </div>
  );
}
