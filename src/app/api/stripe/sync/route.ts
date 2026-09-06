import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { syncStripe } from "@/lib/stripe-ingest";

export async function POST() {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });
  try {
    const result = await syncStripe(org.id);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "stripe sync failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
