import { NextResponse } from "next/server";
import { Products, CountryCode } from "plaid";
import { userIdFromSession } from "@/lib/session";
import { plaidClient } from "@/lib/plaid";
import { primaryOrgForUser } from "@/db/seed-org";

export async function POST() {
  const userId = await userIdFromSession();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const org = await primaryOrgForUser(userId);
  if (!org) return NextResponse.json({ error: "no org" }, { status: 400 });

  const plaid = plaidClient();
  const res = await plaid.linkTokenCreate({
    user: { client_user_id: `${org.id}:${userId}` },
    client_name: "Booked",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: "en",
  });
  return NextResponse.json({ linkToken: res.data.link_token });
}
