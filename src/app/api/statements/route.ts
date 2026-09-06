import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { balanceSheet, profitAndLoss } from "@/lib/statements";

// GET /api/statements?year=2026&month=8 → P&L + balance sheet.
export async function GET(req: Request) {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });

  const params = new URL(req.url).searchParams;
  const now = new Date();
  const year = Number(params.get("year") ?? now.getUTCFullYear());
  const month = Number(params.get("month") ?? now.getUTCMonth() + 1);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "invalid year/month" }, { status: 400 });
  }

  const asOf = new Date(Date.UTC(year, month, 0, 23, 59, 59));
  const [pl, bs] = await Promise.all([
    profitAndLoss(org.id, year, month),
    balanceSheet(org.id, asOf),
  ]);
  return NextResponse.json({ ok: true, pl, bs });
}
