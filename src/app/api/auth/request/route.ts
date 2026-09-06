import { NextResponse } from "next/server";
import { requestLink } from "@/lib/auth";

export async function POST(req: Request) {
  let email = "";
  try {
    const body = await req.json();
    email = String(body.email ?? "");
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  try {
    const { devUrl } = await requestLink(email);
    return NextResponse.json({ ok: true, devUrl });
  } catch {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
}
