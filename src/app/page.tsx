import Link from "next/link";

export const metadata = {
  title: "Booked — the bookkeeper that runs itself",
  description:
    "Bench shut down. Pilot starts at $499/mo. Booked connects your bank and Stripe, categorises every transaction, reconciles payouts, and closes your month from a real double-entry ledger.",
};

const GITHUB = "https://github.com/learnwithalex/booked";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50">
      <SiteNav />
      <Hero />
      <ProductPreview />
      <HowItWorks />
      <LedgerBand />
      <Features />
      <Pricing />
      <Faq />
      <ClosingCta />
      <SiteFooter />
    </main>
  );
}

/* ============================================================== icons */

type IconProps = { className?: string };

function Icon({ children, className = "h-5 w-5" }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

const IconPlug = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 3v5M15 3v5" />
    <path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8Z" />
    <path d="M12 17v4" />
  </Icon>
);

const IconSparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
    <path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
  </Icon>
);

const IconSwap = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8h13l-3.2-3.2M20 16H7l3.2 3.2" />
  </Icon>
);

const IconStatement = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
    <path d="M9 17v-3M12 17v-6M15 17v-4" />
  </Icon>
);

const IconScale = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M3 9h7l-3.5 6a3.5 3.5 0 0 1-3.5-6ZM14 9h7l-3.5 6a3.5 3.5 0 0 1-3.5-6Z" />
    <path d="M12 6l-9 3M12 6l9 3" />
  </Icon>
);

const IconGauge = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3.5 17a9 9 0 1 1 17 0" />
    <path d="M12 17l4-5" />
    <circle cx="12" cy="17" r="1.2" />
  </Icon>
);

const IconLoop = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
    <path d="M4 20v-4h4" />
  </Icon>
);

const IconCode = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6l-5 6 5 6M15 6l5 6-5 6" />
  </Icon>
);

const IconLock = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="10" width="16" height="11" rx="1.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <path d="M12 15v2" />
  </Icon>
);

const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12.5l5 5 10-11" />
  </Icon>
);

const IconChevron = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);

const IconArrow = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

/* ================================================================ nav */

function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-[15px] font-semibold tracking-tight text-ink">Booked</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <TopLink href="#how">How it works</TopLink>
          <TopLink href="#features">Features</TopLink>
          <TopLink href="#pricing">Pricing</TopLink>
          <TopLink href="#faq">FAQ</TopLink>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <Link
            href="/login"
            className="rounded px-3 py-1.5 text-sm text-stone-600 transition-colors hover:text-ink"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded bg-forest-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-forest-800"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

function TopLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="rounded px-3 py-1.5 text-sm text-stone-600 transition-colors hover:bg-stone-200/60 hover:text-ink"
    >
      {children}
    </a>
  );
}

function Mark({ size = "h-6 w-6" }: { size?: string }) {
  return (
    <span
      aria-hidden
      className={`flex ${size} items-center justify-center rounded bg-forest-700 text-[11px] font-bold text-white`}
    >
      B
    </span>
  );
}

/* =============================================================== hero */

function Hero() {
  return (
    <section className="border-b border-stone-200">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 pb-20 pt-16 sm:pt-24 lg:grid-cols-12 lg:gap-12 lg:pb-28">
        <div className="lg:col-span-7">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-forest-500" />
            </span>
            Built in public for The Build Games
          </div>

          <h1 className="mb-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl lg:text-[4.1rem]">
            Confidence in your numbers,{" "}
            <span className="text-forest-600">without the $299 a month.</span>
          </h1>

          <p className="mb-9 max-w-xl text-[17px] leading-relaxed text-stone-600">
            Connect your bank and Stripe. Booked categorises every transaction, matches each
            Stripe payout to the deposit it landed in, and closes your month from a real
            double-entry ledger — not a spreadsheet that looks like one.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded bg-forest-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-800"
            >
              Get started free
              <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#how"
              className="rounded border border-stone-300 bg-white px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:border-stone-400 hover:bg-stone-50"
            >
              See how it works
            </a>
          </div>

          <p className="mt-5 text-xs text-stone-500">
            Free during beta · No card required · MIT licensed and self-hostable
          </p>
        </div>

        <div className="lg:col-span-5">
          <PriceBars />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------- price comparison */

const PRICES = [
  { name: "Local bookkeeper", amount: "$300–1,000", pct: 100, note: "per month, typical range" },
  { name: "Pilot", amount: "$499", pct: 50, note: "entry tier" },
  { name: "Bench", amount: "$299", pct: 30, note: "shut down Dec 2024", dead: true },
  { name: "Booked", amount: "$29", pct: 3, note: "unlimited transactions", us: true },
];

function PriceBars() {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6 sm:p-7">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-stone-400">
        What a month of books costs
      </div>
      <div className="mb-6 text-sm text-stone-500">Same statements. Same chart of accounts.</div>

      <div className="space-y-5">
        {PRICES.map((p) => (
          <div key={p.name}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span
                className={`text-sm ${
                  p.us ? "font-semibold text-ink" : "font-medium text-stone-600"
                } ${p.dead ? "line-through decoration-stone-400" : ""}`}
              >
                {p.name}
              </span>
              <span
                className={`font-mono text-sm tabular-nums ${
                  p.us ? "font-semibold text-forest-700" : "text-stone-500"
                }`}
              >
                {p.amount}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className={`h-full rounded-full ${p.us ? "bg-forest-600" : "bg-stone-300"}`}
                style={{ width: `${Math.max(p.pct, 4)}%` }}
              />
            </div>
            <div className="mt-1.5 text-xs text-stone-400">{p.note}</div>
          </div>
        ))}
      </div>

      <p className="mt-6 border-t border-stone-200 pt-5 text-xs leading-relaxed text-stone-500">
        The difference is not that we cut corners on the accounting. It is that the part which
        used to need a person every month no longer does.
      </p>
    </div>
  );
}

/* ==================================================== product preview */

function ProductPreview() {
  return (
    <section className="border-b border-stone-200 bg-sand-100">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-12 max-w-2xl">
          <SectionEyebrow>The product</SectionEyebrow>
          <SectionTitle>Your month, already closed.</SectionTitle>
          <SectionLede>
            Not a to-do list of receipts to sort. You open Booked and the numbers are there,
            with every figure traceable to the journal entry that produced it.
          </SectionLede>
        </div>

        <div className="overflow-hidden rounded-lg border border-stone-300/70 bg-white shadow-[0_1px_2px_rgba(20,23,26,0.04),0_18px_44px_-16px_rgba(20,23,26,0.22)]">
          {/* app chrome — the product's own nav, not a fake browser */}
          <div className="flex items-center gap-6 border-b border-stone-200 bg-stone-50 px-5 py-3">
            <div className="flex items-center gap-2">
              <Mark size="h-5 w-5" />
              <span className="text-[13px] font-semibold tracking-tight text-ink">Booked</span>
            </div>
            <div className="hidden items-center gap-5 text-[13px] sm:flex">
              <span className="border-b-2 border-forest-600 pb-3 -mb-3 font-medium text-ink">
                Overview
              </span>
              <span className="text-stone-500">Transactions</span>
              <span className="text-stone-500">Statements</span>
            </div>
            <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 text-[10px] font-medium text-stone-600">
              NS
            </span>
          </div>

          <div className="p-6 sm:p-9">
            <div className="mb-1.5 text-xs uppercase tracking-wider text-stone-500">
              Northwind Studio
            </div>
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div className="text-2xl font-semibold tracking-tight text-ink">August 2026</div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700">
                <IconCheck className="h-3.5 w-3.5" />
                Books closed
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MockKpi label="Revenue" value="$12,480.00" />
              <MockKpi label="Expenses" value="$4,932.18" />
              <MockKpi label="Net income" value="$7,547.82" tone="green" />
              <MockKpi label="Cash balance" value="$18,204.55" />
            </div>

            <div className="rounded border border-stone-200">
              <div className="border-b border-stone-200 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                Profit &amp; loss — August
              </div>
              <div className="px-5 py-4">
                <MockRow label="4000 · Product revenue" value="$11,940.00" />
                <MockRow label="4100 · Consulting" value="$540.00" />
                <MockRow label="6000 · Hosting" value="($1,284.30)" dim />
                <MockRow label="6100 · Software" value="($2,447.88)" dim />
                <MockRow label="6300 · Payment fees" value="($1,200.00)" dim />
                <div className="mt-3 flex items-baseline justify-between border-t border-stone-200 pt-3">
                  <span className="text-sm font-semibold text-ink">Net income</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-forest-700">
                    $7,547.82
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded border border-forest-100 bg-forest-50/60 px-5 py-4">
              <IconSwap className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" />
              <p className="text-xs leading-relaxed text-stone-600">
                <span className="font-semibold text-ink">3 Stripe payouts reconciled.</span> Each
                payout matched to its bank deposit and booked as one entry — revenue counted
                once, fees split out, clearing account back to zero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockKpi({ label, value, tone }: { label: string; value: string; tone?: "green" }) {
  return (
    <div className="rounded border border-stone-200 bg-stone-50/70 p-4">
      <div className="mb-1 text-[11px] uppercase tracking-wider text-stone-500">{label}</div>
      <div
        className={`text-lg font-semibold tabular-nums tracking-tight ${
          tone === "green" ? "text-forest-700" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function MockRow({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <div
      className={`flex items-baseline justify-between py-1 text-sm ${
        dim ? "text-stone-500" : "text-stone-800"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}

/* ======================================================= how it works */

const STEPS = [
  {
    icon: IconPlug,
    title: "Connect your sources",
    body: "Link your bank through Plaid and connect Stripe. Booked pulls transactions on a schedule and keeps pulling — no monthly CSV ritual.",
  },
  {
    icon: IconSparkle,
    title: "The agent categorises",
    body: "Deterministic rules take the obvious ones. The model handles the rest and shows its confidence, so you review the genuinely ambiguous transactions instead of all of them.",
  },
  {
    icon: IconSwap,
    title: "Payouts get reconciled",
    body: "Each Stripe payout is matched to the bank deposit it became. One entry, two sides: gross revenue in, fees out, deposit landed. Revenue is never counted twice.",
  },
  {
    icon: IconStatement,
    title: "Your statements are ready",
    body: "P&L and balance sheet generated straight from the ledger, every figure traceable to its journal entry. Export whenever your accountant asks.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <SectionEyebrow>How it works</SectionEyebrow>
          <SectionTitle>Four steps, and only the first one needs you.</SectionTitle>
        </div>

        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-stone-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="max-w-md text-[15px] leading-relaxed text-stone-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ======================================================== ledger band */

const ENTRY = [
  { code: "1000", name: "Bank — checking", debit: "4,058.78", credit: "" },
  { code: "6300", name: "Payment processing fees", debit: "121.22", credit: "" },
  { code: "4000", name: "Product revenue", debit: "", credit: "4,180.00" },
];

function LedgerBand() {
  return (
    <section className="bg-forest-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-forest-300">
            Why this exists
          </div>
          <h2 className="mb-6 text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            Bench shut down overnight. Nothing affordable replaced it.
          </h2>
          <p className="mb-5 text-[15px] leading-relaxed text-forest-100/80">
            In December 2024, Bench closed with almost no warning and thousands of small
            businesses woke up locked out of their own books. The replacements that exist start
            at several hundred dollars a month — more than most bootstrapped businesses spend on
            their entire infrastructure.
          </p>
          <p className="text-[15px] leading-relaxed text-forest-100/80">
            But the work itself changed. Categorising a transaction is a language problem, and
            language models are now good at it. Reconciliation was always deterministic — it just
            needed someone to write the matching logic. What cost $300–1,000 a month is now
            mostly the price of the API calls.
          </p>
        </div>

        <div>
          <div className="rounded-lg border border-forest-700/70 bg-forest-800/60 p-6 sm:p-7">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-forest-300">
              One Stripe payout, one entry
            </div>
            <div className="mb-6 font-mono text-xs text-forest-200/70">
              po_1QxA7f · settled 28 Aug 2026
            </div>

            <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-forest-700/70 pb-2 text-[10px] uppercase tracking-wider text-forest-300">
              <span>Account</span>
              <span className="text-right">Debit</span>
              <span className="text-right">Credit</span>
            </div>

            {ENTRY.map((r) => (
              <div
                key={r.code}
                className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-2 text-sm text-forest-50"
              >
                <span className="truncate">
                  <span className="font-mono text-forest-300">{r.code}</span>{" "}
                  <span className="text-forest-100/90">{r.name}</span>
                </span>
                <span className="text-right font-mono tabular-nums">{r.debit || "—"}</span>
                <span className="text-right font-mono tabular-nums">{r.credit || "—"}</span>
              </div>
            ))}

            <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-x-4 border-t border-forest-700/70 pt-3 text-sm font-semibold">
              <span className="text-forest-200">Balanced</span>
              <span className="text-right font-mono tabular-nums">4,180.00</span>
              <span className="text-right font-mono tabular-nums">4,180.00</span>
            </div>

            <p className="mt-6 flex items-start gap-2.5 text-xs leading-relaxed text-forest-100/70">
              <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest-300" />
              Debits equal credits or the entry does not post. That is the whole reason the
              statements cannot silently drift.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================== features */

const FEATURES = [
  {
    icon: IconScale,
    title: "A real double-entry ledger",
    body: "Every transaction becomes a balanced journal entry. Debits equal credits or the entry does not post — which means your statements cannot silently drift.",
  },
  {
    icon: IconSwap,
    title: "Stripe reconciliation that holds up",
    body: "The single hardest thing to get right in SaaS books. Payout and deposit share one entry, fees are broken out, and the clearing account returns to zero.",
  },
  {
    icon: IconGauge,
    title: "Confidence scores, not black boxes",
    body: "Each categorisation shows how sure the agent is and why. High-confidence entries post themselves; the rest wait in an inbox that stays short.",
  },
  {
    icon: IconLoop,
    title: "It learns your corrections",
    body: "Recategorise a merchant once and Booked writes the rule. The same vendor is not asked about again next month.",
  },
  {
    icon: IconStatement,
    title: "Statements on demand",
    body: "Monthly P&L and balance sheet, generated live from the ledger for any period. Cash flow statement is next on the roadmap.",
  },
  {
    icon: IconLock,
    title: "Your data stays yours",
    body: "Open source, self-hostable, no lock-in. If Booked ever goes the way of Bench, you keep the ledger and the code that produced it.",
  },
];

function Features() {
  return (
    <section id="features" className="scroll-mt-16 border-b border-stone-200">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <SectionEyebrow>What you get</SectionEyebrow>
          <SectionTitle>Built like accounting software, not a categorisation toy.</SectionTitle>
        </div>

        <div className="grid gap-px overflow-hidden rounded-lg border border-stone-200 bg-stone-200 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-7">
              <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-forest-50 text-forest-700">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mb-2 text-[15px] font-semibold tracking-tight text-ink">{f.title}</h3>
              <p className="text-sm leading-relaxed text-stone-600">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================ pricing */

function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-b border-stone-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mb-14 max-w-2xl">
          <SectionEyebrow>Pricing</SectionEyebrow>
          <SectionTitle>One tenth of what the books used to cost.</SectionTitle>
          <SectionLede>
            Free while we are in beta. No card, no sales call, no annual contract.
          </SectionLede>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-3">
          <PriceCard
            title="Free"
            price="$0"
            note="during beta"
            cta="Get started"
            features={[
              "Up to 100 transactions/mo",
              "Bank + Stripe connections",
              "Agent categorisation",
              "P&L and balance sheet",
            ]}
          />
          <PriceCard
            title="Starter"
            price="$29"
            note="/month"
            cta="Get started"
            highlight
            features={[
              "Unlimited transactions",
              "Stripe payout reconciliation",
              "Learned rules from corrections",
              "Statement export",
              "Monthly close packet",
            ]}
          />
          <PriceCard
            title="Self-hosted"
            price="Free"
            note="forever"
            cta="View source"
            href={GITHUB}
            features={[
              "Run it on your own infra",
              "Bring your own model key",
              "Full ledger, full source",
              "MIT licensed",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function PriceCard({
  title,
  price,
  note,
  features,
  cta,
  href = "/login",
  highlight,
}: {
  title: string;
  price: string;
  note: string;
  features: string[];
  cta: string;
  href?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border p-7 ${
        highlight
          ? "border-forest-700 bg-forest-900 text-white lg:-mt-3 lg:pb-9 lg:pt-9"
          : "border-stone-200 bg-stone-50/60 text-ink"
      }`}
    >
      {highlight && (
        <span className="absolute -top-2.5 left-7 rounded-full bg-forest-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
          Most popular
        </span>
      )}

      <div
        className={`mb-1.5 text-xs font-semibold uppercase tracking-wider ${
          highlight ? "text-forest-300" : "text-stone-500"
        }`}
      >
        {title}
      </div>
      <div className="mb-6 flex items-baseline gap-1.5">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        <span className={`text-xs ${highlight ? "text-forest-200/70" : "text-stone-500"}`}>
          {note}
        </span>
      </div>

      <ul className="mb-8 flex-1 space-y-2.5">
        {features.map((f) => (
          <li
            key={f}
            className={`flex gap-2.5 text-sm ${highlight ? "text-forest-100/90" : "text-stone-600"}`}
          >
            <IconCheck
              className={`mt-0.5 h-4 w-4 shrink-0 ${
                highlight ? "text-forest-300" : "text-forest-600"
              }`}
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`rounded px-4 py-2.5 text-center text-sm font-medium transition-colors ${
          highlight
            ? "bg-white text-forest-900 hover:bg-forest-50"
            : "border border-stone-300 text-stone-700 hover:border-stone-400 hover:bg-white"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

/* ================================================================ faq */

const FAQS = [
  {
    q: "Is an LLM really safe to trust with my books?",
    a: "It is not trusted blindly. Deterministic rules handle anything predictable, and the model only proposes a category with a confidence score. Low confidence goes to your review inbox rather than into the ledger, and the double-entry engine refuses any entry that does not balance. The model suggests; the accounting rules decide.",
  },
  {
    q: "What happens to my Stripe fees?",
    a: "They are split out properly. A payout is booked as gross revenue, a separate processing-fee expense, and the net amount that hit your bank — one entry covering both sides. This is the step most spreadsheet workflows get wrong, and it is why their revenue number is usually inflated.",
  },
  {
    q: "Can my accountant work with this?",
    a: "Yes. It is a standard chart of accounts and standard double-entry journal entries, so a P&L and balance sheet come out in the format they already expect. Nothing about the output is unusual — that is deliberate.",
  },
  {
    q: "What if Booked shuts down like Bench did?",
    a: "The source is public and MIT licensed, and it is designed to be self-hosted. The failure mode that stranded Bench customers — losing access to your own historical books — is the specific thing this project is built to make impossible.",
  },
  {
    q: "Do you support cash flow statements?",
    a: "Not yet. P&L and balance sheet are live and generated from the ledger. Cash flow is the next statement on the roadmap, and the ledger already holds everything needed to produce it.",
  },
];

function Faq() {
  return (
    <section id="faq" className="scroll-mt-16 border-b border-stone-200 bg-sand-100">
      <div className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
        <div className="mb-12">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <SectionTitle>The questions worth asking.</SectionTitle>
        </div>

        <div className="divide-y divide-stone-200 border-y border-stone-200">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <span className="text-[15px] font-medium tracking-tight text-ink">{f.q}</span>
                <IconChevron className="h-4 w-4 shrink-0 text-stone-400 transition-transform duration-200 group-open:-rotate-180" />
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================== closing cta */

function ClosingCta() {
  return (
    <section className="bg-forest-800">
      <div className="mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
        <h2 className="mx-auto mb-5 max-w-2xl text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
          Stop doing the books at midnight.
        </h2>
        <p className="mx-auto mb-9 max-w-xl text-[17px] leading-relaxed text-forest-100/75">
          Connect a bank and a Stripe account, and see a closed month in a few minutes. Free
          during beta.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded bg-white px-5 py-2.5 text-sm font-medium text-forest-900 transition-colors hover:bg-forest-50"
          >
            Get started free
            <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href={GITHUB}
            className="inline-flex items-center gap-2 rounded border border-forest-600 px-5 py-2.5 text-sm font-medium text-forest-100 transition-colors hover:bg-forest-700"
          >
            <IconCode className="h-4 w-4" />
            Read the source
          </a>
        </div>
      </div>
    </section>
  );
}

/* ============================================================= footer */

function SiteFooter() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <Mark />
              <span className="text-sm font-semibold tracking-tight text-white">Booked</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-stone-400">
              Autonomous bookkeeping for small businesses and solo founders. Built to replace the
              service that left.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "How it works", href: "#how" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ]}
          />
          <FooterCol
            title="Get started"
            links={[
              { label: "Create account", href: "/login" },
              { label: "Log in", href: "/login" },
            ]}
          />
          <FooterCol
            title="Project"
            links={[
              { label: "Source on GitHub", href: GITHUB },
              { label: "The Build Games", href: "https://canivibecodeit.com/thebuildgames" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-700/60 pt-7 text-xs text-stone-500">
          <span>© 2026 Booked. MIT licensed.</span>
          <span>Built in public, Sep 6–30 2026 · Best Replacement track.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
        {title}
      </div>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-xs text-stone-400 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ====================================================== section atoms */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-forest-600">
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-4xl">
      {children}
    </h2>
  );
}

function SectionLede({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-[17px] leading-relaxed text-stone-600">{children}</p>;
}
