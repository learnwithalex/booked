import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { syncPlaidConnection } from "@/lib/ingest-plaid";

export async function POST(req: Request) {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });

  let connectionId: string | null = null;
  try {
    connectionId = (await req.json()).connectionId ?? null;
  } catch {
    // no body — sync the first active Plaid connection
  }

  const { db } = await import("@/db");
  let target = connectionId;
  if (!target) {
    const first = await db.query.sourceConnections.findFirst({
      where: (c, { and, eq }) =>
        and(eq(c.orgId, org.id), eq(c.kind, "PLAID"), eq(c.status, "ACTIVE")),
    });
    if (!first) return NextResponse.json({ error: "no plaid connection" }, { status: 400 });
    target = first.id;
  }

  const result = await syncPlaidConnection(org.id, target, "");
  return NextResponse.json({ ok: true, ...result });
}
