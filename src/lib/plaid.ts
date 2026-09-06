// Plaid client (sandbox in dev, production when keys exist).
// Access tokens are stored encrypted — SESSION_SECRET doubles as the
// encryption key in v1 (documented tradeoff; a dedicated KMS key is the
// post-Games upgrade).

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

function key(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return scryptSync(secret, "booked-plaid-v1", 32);
}

export function encryptToken(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${body.toString("base64")}`;
}

export function decryptToken(stored: string): string {
  const [, ivB64, tagB64, bodyB64] = stored.split(":");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([
    decipher.update(Buffer.from(bodyB64, "base64")),
    decipher.final(),
  ]).toString("utf8");
}

export function plaidClient(): PlaidApi {
  const env = (process.env.PLAID_ENV ?? "sandbox").toLowerCase();
  const basePath =
    env === "production"
      ? PlaidEnvironments.production
      : env === "development"
        ? PlaidEnvironments.development
        : PlaidEnvironments.sandbox;
  return new PlaidApi(
    new Configuration({
      basePath,
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID ?? "",
          "PLAID-SECRET": process.env.PLAID_SECRET ?? "",
        },
      },
    }),
  );
}

// Plaid amounts: positive = money OUT of the account (expense), negative =
// money IN. Booked stores signed minor units where positive = money in.
export function plaidToCents(amount: number | null | undefined): number {
  return Math.round((amount ?? 0) * -100);
}
