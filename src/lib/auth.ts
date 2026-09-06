// Magic-link auth. Request a link → Resend delivers it → clicking it
// consumes the token and creates a session. No passwords in v1.
//
// Dev mode: without RESEND_API_KEY set, requestLink() returns the URL
// directly so login works end-to-end locally.

import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import { db, loginTokens, users } from "@/db";

const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function requestLink(email: string): Promise<{ devUrl: string | null }> {
  const clean = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) throw new Error("invalid email");

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, clean),
  });
  const user =
    existing ?? (await db.insert(users).values({ email: clean }).returning()).at(0)!;

  const token = `ml_${randomBytes(32).toString("base64url")}`;
  await db.insert(loginTokens).values({
    userId: user.id,
    token,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });

  const url = `${appUrl()}/api/auth/verify?token=${encodeURIComponent(token)}`;

  if (!process.env.RESEND_API_KEY) return { devUrl: url };

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "Booked <hello@booked.app>",
    to: clean,
    subject: "Your Booked login link",
    html: `<p>Click to sign in to Booked. This link expires in 15 minutes.</p><p><a href="${url}">Sign in to Booked</a></p>`,
  });
  return { devUrl: null };
}

export async function verifyToken(token: string) {
  const row = await db.query.loginTokens.findFirst({
    where: (t, { eq }) => eq(t.token, token),
  });
  if (!row || row.usedAt || row.expiresAt < new Date()) return null;
  if (row.token.startsWith("sess_")) return null; // sessions aren't login links
  await db.update(loginTokens).set({ usedAt: new Date() }).where(eq(loginTokens.id, row.id));
  return row;
}
