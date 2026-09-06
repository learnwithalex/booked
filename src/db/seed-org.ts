// Create an org for a user and seed the fixed chart of accounts.
// Idempotent per (userId, orgName): returns the existing org if a user with
// the same email already owns an org with the same name.

import { and, eq } from "drizzle-orm";
import { db } from "./index";
import { accounts, orgUsers, orgs, users } from "./schema";
import { CHART_OF_ACCOUNTS } from "./chart";

export async function seedOrgForUser(email: string, orgName: string) {
  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  const user =
    existingUser ??
    (await db.insert(users).values({ email }).returning()).at(0)!;

  const existingMembership = await db.query.orgUsers.findFirst({
    where: (m, { eq, and, exists }) => eq(m.userId, user.id),
    with: { org: true },
  });

  if (existingMembership) {
    const org = await db.query.orgs.findFirst({
      where: (o, { eq }) => eq(o.id, existingMembership.orgId),
    });
    if (org && org.name === orgName) return { user, org };
  }

  const [org] = await db.insert(orgs).values({ name: orgName }).returning();
  await db.insert(orgUsers).values({ orgId: org.id, userId: user.id, role: "owner" });

  await db.insert(accounts).values(
    CHART_OF_ACCOUNTS.map((a) => ({
      orgId: org.id,
      code: a.code,
      name: a.name,
      type: a.type as "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE",
    })),
  );

  return { user, org };
}

// Top-level org lookup for request-scoped code: first org the user owns.
export async function primaryOrgForUser(userId: string) {
  const membership = await db.query.orgUsers.findFirst({
    where: (m, { eq }) => eq(m.userId, userId),
  });
  if (!membership) return null;
  return db.query.orgs.findFirst({
    where: (o, { eq }) => eq(o.id, membership.orgId),
  });
}

// Add the base rules every org starts with. Called once at org creation.
export async function seedBaseRules(orgId: string) {
  const { rules } = await import("./schema");
  await db
    .insert(rules)
    .values([
      { orgId, field: "MERCHANT", op: "CONTAINS", pattern: "STRIPE", accountCode: "4000", priority: 100, createdBy: "system" },
      { orgId, field: "MERCHANT", op: "CONTAINS", pattern: "AMAZON WEB SERVICES", accountCode: "5110", priority: 100, createdBy: "system" },
      { orgId, field: "MERCHANT", op: "CONTAINS", pattern: "AWS", accountCode: "5110", priority: 90, createdBy: "system" },
      { orgId, field: "MERCHANT", op: "CONTAINS", pattern: "OPENAI", accountCode: "5120", priority: 100, createdBy: "system" },
      { orgId, field: "MERCHANT", op: "CONTAINS", pattern: "ANTHROPIC", accountCode: "5120", priority: 100, createdBy: "system" },
    ])
    .onConflictDoNothing();
}
