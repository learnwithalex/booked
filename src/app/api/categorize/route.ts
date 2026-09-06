import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { db } from "@/db";
import { categorizeOne } from "@/lib/categorize";

// POST /api/categorize — categorise up to `limit` PENDING txns (default 25).
// Rules apply instantly; each LLM fallback call takes ~1-2s, so the batch is
// small by design. The review UI polls this until the inbox is empty.
export async function POST(req: Request) {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });

  let limit = 25;
  try {
    limit = Math.min(100, Math.max(1, Number((await req.json()).limit ?? 25)));
  } catch {
    // default
  }

  const pending = await db.query.sourceTransactions.findMany({
    where: (t, { and, eq }) => and(eq(t.orgId, org.id), eq(t.status, "PENDING")),
    orderBy: (t, { asc }) => [asc(t.occurredAt)],
    limit,
    columns: { id: true },
  });

  const results: Array<{ id: string; accountCode: string; confidence: number; viaRule: boolean }> = [];
  const errors: Array<{ id: string; error: string }> = [];
  for (const p of pending) {
    try {
      const r = await categorizeOne(p.id);
      if (r) results.push({ id: p.id, accountCode: r.accountCode, confidence: r.confidence, viaRule: r.viaRule !== null });
    } catch (e) {
      // One bad txn must not kill the batch — but surface it.
      const msg = e instanceof Error ? e.message : "unknown";
      console.error(`[categorize] ${p.id} failed: ${msg}`);
      errors.push({ id: p.id, error: msg });
    }
  }

  return NextResponse.json({ ok: true, processed: results.length, results, errors });
}
