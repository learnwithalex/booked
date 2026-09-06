# Booked

Autonomous bookkeeping for solo founders. Connect your bank and Stripe; Booked
categorises every transaction, reconciles Stripe payouts, and produces monthly
financial statements you'd otherwise pay a bookkeeper $300–1,000/mo to prepare.

Built during **The Build Games** (Sep 6 – Sep 30, 2026) as a working
replacement for Bench (recently sunset) and the entry tier of Pilot.

## Scope, v1 (locked)

- Persona: US solo founder or small SaaS
- Inputs: one USD bank account (Plaid) + Stripe
- Outputs: categorised ledger, monthly P&L + balance sheet + cash flow, close
  packet PDF, weekly anomaly digest

Explicitly out of scope for v1: payroll, multi-entity, multi-currency,
receipts OCR, invoicing, 1099s, tax filing.

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind
- Postgres (Orizon managed) · Prisma
- Anthropic Claude (structured outputs) for the categorisation agent
- Plaid for bank feeds · Stripe SDK for revenue
- Resend for magic-link auth

## Local dev

```sh
cp .env.example .env       # fill in values
npm install
npm run db:push
npm run dev
```

## Deploy

Deployed on Orizon (dogfood). See `orizon.md` for the deploy notes as this
gets stood up.

## License

MIT
