// Financial statements, computed from the ledger in SQL.
//
// P&L: sum EntryLines by account type for the period (REVENUE credits minus
// EXPENSE debits). Balance sheet: cumulative balances to period end.
// Cash flow: movement in 1000/1010/1100 cash accounts.

import { sql } from "drizzle-orm";
import { db } from "@/db";

export interface PLLine {
  code: string;
  name: string;
  totalCents: number;
}

export interface ProfitAndLoss {
  year: number;
  month: number;
  revenue: PLLine[];
  expenses: PLLine[];
  totalRevenueCents: number;
  totalExpenseCents: number;
  netIncomeCents: number;
}

export async function profitAndLoss(orgId: string, year: number, month: number): Promise<ProfitAndLoss> {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const rows = await db.execute(sql`
    SELECT a.code, a.name, a.type,
           COALESCE(SUM(el.credit_cents - el.debit_cents), 0)::bigint AS net
    FROM entry_lines el
    JOIN entries e ON e.id = el.entry_id
    JOIN accounts a ON a.id = el.account_id
    WHERE e.org_id = ${orgId}
      AND e.occurred_at >= ${start.toISOString()}
      AND e.occurred_at < ${end.toISOString()}
      AND a.type IN ('REVENUE', 'EXPENSE')
    GROUP BY a.code, a.name, a.type
    ORDER BY a.code
  `);

  const revenue: PLLine[] = [];
  const expenses: PLLine[] = [];
  let totalRevenueCents = 0;
  let totalExpenseCents = 0;

  for (const r of rows as unknown as Array<{ code: string; name: string; type: string; net: string }>) {
    const net = Number(r.net);
    if (r.type === "REVENUE") {
      // Revenue normal balance is credit; refunds account 4900 carries a
      // debit balance, which nets against revenue automatically.
      revenue.push({ code: r.code, name: r.name, totalCents: net });
      totalRevenueCents += net;
    } else {
      expenses.push({ code: r.code, name: r.name, totalCents: -net });
      totalExpenseCents += -net;
    }
  }

  return {
    year,
    month,
    revenue,
    expenses,
    totalRevenueCents,
    totalExpenseCents,
    netIncomeCents: totalRevenueCents - totalExpenseCents,
  };
}

export interface BalanceSheetLine {
  code: string;
  name: string;
  balanceCents: number;
}

export interface BalanceSheet {
  asOf: string;
  assets: BalanceSheetLine[];
  liabilities: BalanceSheetLine[];
  equity: BalanceSheetLine[];
  totalAssetsCents: number;
  totalLiabilitiesCents: number;
  totalEquityCents: number;
  balances: boolean;
}

export async function balanceSheet(orgId: string, asOf: Date): Promise<BalanceSheet> {
  const rows = await db.execute(sql`
    SELECT a.code, a.name, a.type,
           COALESCE(SUM(el.debit_cents - el.credit_cents), 0)::bigint AS net_debit
    FROM entry_lines el
    JOIN entries e ON e.id = el.entry_id
    JOIN accounts a ON a.id = el.account_id
    WHERE e.org_id = ${orgId}
      AND e.occurred_at <= ${asOf.toISOString()}
      AND a.type IN ('ASSET', 'LIABILITY', 'EQUITY')
    GROUP BY a.code, a.name, a.type
    ORDER BY a.code
  `);

  const assets: BalanceSheetLine[] = [];
  const liabilities: BalanceSheetLine[] = [];
  const equity: BalanceSheetLine[] = [];
  let totalAssetsCents = 0;
  let totalLiabilitiesCents = 0;
  let totalEquityCents = 0;

  for (const r of rows as unknown as Array<{ code: string; name: string; type: string; net_debit: string }>) {
    const debitNet = Number(r.net_debit);
    if (r.type === "ASSET") {
      assets.push({ code: r.code, name: r.name, balanceCents: debitNet });
      totalAssetsCents += debitNet;
    } else {
      // Liabilities + equity carry credit balances; negate the debit-net.
      const line = { code: r.code, name: r.name, balanceCents: -debitNet };
      if (r.type === "LIABILITY") {
        liabilities.push(line);
        totalLiabilitiesCents += line.balanceCents;
      } else {
        equity.push(line);
        totalEquityCents += line.balanceCents;
      }
    }
  }

  return {
    asOf: asOf.toISOString(),
    assets,
    liabilities,
    equity,
    totalAssetsCents,
    totalLiabilitiesCents,
    totalEquityCents,
    balances: totalAssetsCents === totalLiabilitiesCents + totalEquityCents,
  };
}

export function fmtCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${(abs / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
