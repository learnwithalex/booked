import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { decryptToken, encryptToken, plaidClient } from "@/lib/plaid";
import { primaryOrgForUser } from "@/db/seed-org";
import { db, sourceConnections } from "@/db";
import { syncPlaidConnection } from "@/lib/ingest-plaid";

export async function POST(req: Request) {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });

  let publicToken = "";
  try {
    publicToken = String((await req.json()).publicToken ?? "");
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  if (!publicToken) return NextResponse.json({ error: "missing publicToken" }, { status: 400 });

  const plaid = plaidClient();
  const { data } = await plaid.itemPublicTokenExchange({ public_token: publicToken });

  const [connection] = await db
    .insert(sourceConnections)
    .values({
      orgId: org.id,
      kind: "PLAID",
      externalId: data.item_id,
      accessToken: encryptToken(data.access_token),
    })
    .onConflictDoNothing()
    .returning();

  const connectionId = connection?.id ?? data.item_id;
  void decryptToken; // used at sync time; referenced to keep the import honest

  const synced = await syncPlaidConnection(org.id, connection?.id ?? null, data.item_id);
  return NextResponse.json({ ok: true, connectionId, synced });
}
