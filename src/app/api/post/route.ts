import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { db } from "@/db";
import { postCategorisedTxn } from "@/lib/posting";
import { learnFromCorrection } from "@/lib/categorize";
import { CHART_CODES } from "@/db/chart";

// POST /api/post — post CATEGORISED txns to the ledger.
// Body: { ids?: string[] } — posts all categorised when omitted.
// Optional { overrides: { [txnId]: accountCode } } to correct + learn.
export async function POST(req: Request) {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });

  let ids: string[] | null = null;
  let overrides: Record<string, string> = {};
  try {
    const body = await req.json();
    ids = body.ids ?? null;
    overrides = body.overrides ?? {};
  } catch {
    // post all
  }

  const rows = ids
    ? await db.query.sourceTransactions.findMany({
        where: (t, { and, eq, inArray }) =>
          and(eq(t.orgId, org.id), inArray(t.id, ids!)),
      })
    : await db.query.sourceTransactions.findMany({
        where: (t, { and, eq }) => and(eq(t.orgId, org.id), eq(t.status, "CATEGORISED")),
        limit: 200,
      });

  const posted: string[] = [];
  const failed: Array<{ id: string; error: string }> = [];

  for (const txn of rows) {
    if (txn.status !== "CATEGORISED" || !txn.categoryHint) continue;
    const override = overrides[txn.id];
    const code = override && CHART_CODES.has(override) ? override : txn.categoryHint;
    try {
      await postCategorisedTxn(org.id, txn.id, code, userId);
      posted.push(txn.id);
      if (override && override !== txn.categoryHint && txn.merchant) {
        await learnFromCorrection(org.id, txn.merchant, override, userId);
      }
    } catch (e) {
      failed.push({ id: txn.id, error: e instanceof Error ? e.message : "post failed" });
    }
  }

  return NextResponse.json({ ok: true, posted: posted.length, failed });
}
