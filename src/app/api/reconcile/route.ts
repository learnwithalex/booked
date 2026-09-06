import { NextResponse } from "next/server";
import { userIdFromSession } from "@/lib/session";
import { primaryOrgForUser } from "@/db/seed-org";
import { reconcileStripePayouts } from "@/lib/reconcile";

export async function POST() {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });
  const result = await reconcileStripePayouts(org.id);
  return NextResponse.json({ ok: true, ...result });
}
