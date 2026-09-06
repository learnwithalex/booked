import Link from "next/link";

export const metadata = {
  title: "Booked — the bookkeeper that runs itself",
  description:
    "Bench shut down. Pilot starts at $499/mo. Booked connects your bank and Stripe, categorises every transaction, reconciles payouts, and closes your month from a real double-entry ledger.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <SiteNav />
      <Hero />
      <TrustBar />
      <ProductPreview />
      <TheGap />
      <HowItWorks />
      <Features />
      <Pricing />
      <Faq />
      <ClosingCta />
      <SiteFooter />
    </main>
  );
}

/* ---------------------------------------------------------------- nav */

function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2">
          <Mark />
          <span className="text-[15px] font-semibold tracking-tight text-neutral-900">Booked</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <TopLink href="#how">How it works</TopLink>
          <TopLink href="#features">Features</TopLink>
          <TopLink href="#pricing">Pricing</TopLink>
          <TopLink href="#faq">FAQ</TopLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="rounded px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:text-neutral-900"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
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
      className="rounded px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
    >
      {children}
    </a>
  );
}

function Mark() {
  return (
    <span
      aria-hidden
      className="flex h-6 w-6 items-center justify-center rounded bg-neutral-900 text-[11px] font-bold text-white"
    >
      B
    </span>
  );
}

/* --------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Built in public for The Build Games · Best Replacement
          </div>

          <h1 className="mb-6 text-4xl font-semibold leading-[1.08] tracking-tight text-neutral-900 sm:text-6xl">
            Confidence in your numbers,
            <br />
            without the $299 a month.
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-neutral-600">
            Connect your bank and Stripe. Booked categorises every transaction, matches
            each Stripe payout to the deposit it landed in, and closes your month from a
            real double-entry ledger — not a spreadsheet that looks like one.
          </p>

          <div className="mb-10 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              Get started free
            </Link>
            <a
              href="#how"
              className="rounded border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              See how it works
            </a>
          </div>

          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            <Stat value="Double-entry" label="Real ledger, debits = credits" />
            <Stat value="Zero" label="Double-counted Stripe payouts" />
            <Stat value="Open source" label="Every commit is the receipt" />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-base font-semibold tracking-tight text-neutral-900">{value}</dt>
      <dd className="text-xs text-neutral-500">{label}</dd>
    </div>
  );
}

/* ---------------------------------------------------------- trust bar */

function TrustBar() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
        <span className="text-xs uppercase tracking-wider text-neutral-400">Works with</span>
        {["Plaid", "Stripe", "Any US bank", "CSV export", "Your accountant"].map((s) => (
          <span key={s} className="text-sm font-medium text-neutral-500">
            {s}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------------------------------- product preview */

function ProductPreview() {
  return (
    <section className="border-b border-neutral-200 bg-neutral-100/60">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 max-w-2xl">
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Your month, already closed.
          </h2>
          <p className="text-base leading-relaxed text-neutral-600">
            Not a to-do list of receipts to sort. You open Booked and the numbers are
            there, with every figure traceable to the journal entry that produced it.
          </p>
        </div>

        <div className="overflow-hidden rounded-md border border-neutral-300 bg-white">
          {/* chrome */}
          <div className="flex items-center gap-2 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="ml-3 text-xs text-neutral-400">booked.app/app</span>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-1 text-xs uppercase tracking-wider text-neutral-500">
              Northwind Studio
            </div>
            <div className="mb-6 flex items-end justify-between">
              <div className="text-xl font-semibold tracking-tight text-neutral-900">
                August 2026
              </div>
              <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                Books closed
              </span>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MockKpi label="Revenue" value="$12,480.00" />
              <MockKpi label="Expenses" value="$4,932.18" />
              <MockKpi label="Net income" value="$7,547.82" tone="green" />
              <MockKpi label="Cash balance" value="$18,204.55" />
            </div>

            <div className="rounded border border-neutral-200">
              <div className="border-b border-neutral-200 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Profit &amp; loss — August
              </div>
              <div className="px-4 py-3">
                <MockRow label="4000 · Product revenue" value="$11,940.00" />
                <MockRow label="4100 · Consulting" value="$540.00" />
                <MockRow label="6000 · Hosting" value="($1,284.30)" dim />
                <MockRow label="6100 · Software" value="($2,447.88)" dim />
                <MockRow label="6300 · Payment fees" value="($1,200.00)" dim />
                <div className="mt-3 flex items-baseline justify-between border-t border-neutral-100 pt-3">
                  <span className="text-sm font-semibold text-neutral-900">Net income</span>
                  <span className="font-mono text-sm font-semibold tabular-nums text-emerald-700">
                    $7,547.82
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded border border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="mt-0.5 text-emerald-600">✓</span>
              <p className="text-xs leading-relaxed text-neutral-600">
                <span className="font-medium text-neutral-900">
                  3 Stripe payouts reconciled.
                </span>{" "}
                Each payout matched to its bank deposit and booked as one entry — revenue
                counted once, fees split out, clearing account back to zero.
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
    <div className="rounded border border-neutral-200 bg-white p-4">
      <div className="mb-1 text-[11px] uppercase tracking-wider text-neutral-500">{label}</div>
      <div
        className={`text-lg font-semibold tabular-nums ${
          tone === "green" ? "text-emerald-700" : "text-neutral-900"
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
      className={`flex items-baseline justify-between py-0.5 text-sm ${
        dim ? "text-neutral-500" : "text-neutral-800"
      }`}
    >
      <span>{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------ the gap */

function TheGap() {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="mb-3 text-xs uppercase tracking-wider text-neutral-400">
            Why this exists
          </div>
          <h2 className="mb-5 text-2xl font-semibold leading-tight tracking-tight text-neutral-900 sm:text-3xl">
            Bench shut down overnight. Nothing affordable replaced it.
          </h2>
          <p className="mb-4 text-base leading-relaxed text-neutral-600">
            In December 2024, Bench closed with almost no warning and thousands of small
            businesses woke up locked out of their own books. The replacements that
            exist start at several hundred dollars a month — more than most bootstrapped
            businesses spend on their entire infrastructure.
          </p>
          <p className="text-base leading-relaxed text-neutral-600">
            But the work itself changed. Categorising a transaction is a language
            problem, and language models are now good at it. Reconciliation was always
            deterministic — it just needed someone to write the matching logic. What
            cost $300–1,000 a month is now mostly the price of the API calls.
          </p>
        </div>

        <div className="rounded-md border border-neutral-200 bg-neutral-50 p-6">
          <div className="mb-4 text-xs uppercase tracking-wider text-neutral-400">
            What a month of books costs
          </div>
          <CompareRow name="Bench" price="$299/mo" note="Shut down Dec 2024" struck />
          <CompareRow name="Pilot" price="$499/mo" note="Starting tier" />
          <CompareRow name="Local bookkeeper" price="$300–1,000/mo" note="Typical range" />
          <CompareRow name="Booked" price="$29/mo" note="Unlimited transactions" highlight />
          <p className="mt-5 border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500">
            The difference is not that we cut corners on the accounting. It is that the
            part which used to need a person every month no longer does.
          </p>
        </div>
      </div>
    </section>
  );
}

function CompareRow({
  name,
  price,
  note,
  struck,
  highlight,
}: {
  name: string;
  price: string;
  note: string;
  struck?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-neutral-200 py-3 last:border-0 ${
        highlight ? "text-neutral-900" : "text-neutral-600"
      }`}
    >
      <div>
        <div className={`text-sm ${highlight ? "font-semibold" : "font-medium"}`}>{name}</div>
        <div className="text-xs text-neutral-500">{note}</div>
      </div>
      <div
        className={`font-mono text-sm tabular-nums ${
          struck ? "text-neutral-400 line-through" : highlight ? "font-semibold" : ""
        }`}
      >
        {price}
      </div>
    </div>
  );
}

/* -------------------------------------------------------- how it works */

function HowItWorks() {
  return (
    <section id="how" className="border-b border-neutral-200 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 text-xs uppercase tracking-wider text-neutral-400">
            How it works
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Four steps, and only the first one needs you.
          </h2>
        </div>

        <div className="grid gap-px overflow-hidden rounded-md border border-neutral-200 bg-neutral-200 sm:grid-cols-2">
          <Step
            n="01"
            title="Connect your sources"
            body="Link your bank through Plaid and connect Stripe. Booked pulls transactions on a schedule and keeps pulling — no monthly CSV ritual."
          />
          <Step
            n="02"
            title="The agent categorises"
            body="Deterministic rules take the obvious ones. The model handles the rest and shows its confidence, so you review the genuinely ambiguous transactions instead of all of them."
          />
          <Step
            n="03"
            title="Stripe payouts get reconciled"
            body="Each payout is matched to the bank deposit it became. One entry, two sides: gross revenue in, fees out, deposit landed. Revenue is never counted twice."
          />
          <Step
            n="04"
            title="Your statements are ready"
            body="P&L and balance sheet generated straight from the ledger, every figure traceable to its journal entry. Export whenever your accountant asks."
          />
        </div>
      </div>
    </section>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="bg-white p-7">
      <div className="mb-3 font-mono text-xs text-neutral-400">{n}</div>
      <h3 className="mb-2 text-base font-semibold tracking-tight text-neutral-900">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600">{body}</p>
    </div>
  );
}

/* ----------------------------------------------------------- features */

function Features() {
  return (
    <section id="features" className="border-b border-neutral-200 bg-white scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 text-xs uppercase tracking-wider text-neutral-400">
            What you get
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Built like accounting software, not a categorisation toy.
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Feature title="A real double-entry ledger">
            Every transaction becomes a balanced journal entry. Debits equal credits or
            the entry does not post — which means your statements cannot silently drift.
          </Feature>
          <Feature title="Stripe reconciliation that holds up">
            The single hardest thing to get right in SaaS books. Payout and deposit share
            one entry, fees are broken out, and the clearing account returns to zero.
          </Feature>
          <Feature title="Confidence scores, not black boxes">
            Each categorisation shows how sure the agent is and why. High-confidence
            entries post themselves; the rest wait in an inbox that stays short.
          </Feature>
          <Feature title="It learns your corrections">
            Recategorise a merchant once and Booked writes the rule. The same vendor is
            not asked about again next month.
          </Feature>
          <Feature title="Statements on demand">
            Monthly P&amp;L and balance sheet, generated live from the ledger for any
            period. Cash flow statement is next on the roadmap.
          </Feature>
          <Feature title="Your data stays yours">
            Open source, self-hostable, no lock-in. If Booked ever goes the way of Bench,
            you keep the ledger and the code that produced it.
          </Feature>
        </div>
      </div>
    </section>
  );
}

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-base font-semibold tracking-tight text-neutral-900">{title}</h3>
      <p className="text-sm leading-relaxed text-neutral-600">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------ pricing */

function Pricing() {
  return (
    <section id="pricing" className="border-b border-neutral-200 scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 max-w-2xl">
          <div className="mb-3 text-xs uppercase tracking-wider text-neutral-400">Pricing</div>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            One tenth of what the books used to cost.
          </h2>
          <p className="text-base leading-relaxed text-neutral-600">
            Free while we are in beta. No card, no sales call, no annual contract.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
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
            href="https://github.com/learnwithalex/booked"
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
      className={`flex flex-col rounded-md border p-6 ${
        highlight
          ? "border-neutral-900 bg-neutral-900 text-white"
          : "border-neutral-200 bg-white text-neutral-900"
      }`}
    >
      <div
        className={`mb-1 text-xs uppercase tracking-wider ${
          highlight ? "text-neutral-400" : "text-neutral-500"
        }`}
      >
        {title}
      </div>
      <div className="mb-5 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight">{price}</span>
        <span className={`text-xs ${highlight ? "text-neutral-400" : "text-neutral-500"}`}>
          {note}
        </span>
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {features.map((f) => (
          <li
            key={f}
            className={`flex gap-2 text-sm ${highlight ? "text-neutral-300" : "text-neutral-600"}`}
          >
            <span className={highlight ? "text-emerald-400" : "text-emerald-600"}>✓</span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`rounded px-4 py-2 text-center text-sm font-medium transition-colors ${
          highlight
            ? "bg-white text-neutral-900 hover:bg-neutral-200"
            : "border border-neutral-300 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

/* ---------------------------------------------------------------- faq */

function Faq() {
  return (
    <section id="faq" className="border-b border-neutral-200 bg-white scroll-mt-16">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-8">
          <div className="mb-3 text-xs uppercase tracking-wider text-neutral-400">FAQ</div>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            The questions worth asking.
          </h2>
        </div>

        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          <FaqItem q="Is an LLM really safe to trust with my books?">
            It is not trusted blindly. Deterministic rules handle anything predictable,
            and the model only proposes a category with a confidence score. Low
            confidence goes to your review inbox rather than into the ledger, and the
            double-entry engine refuses any entry that does not balance. The model
            suggests; the accounting rules decide.
          </FaqItem>
          <FaqItem q="What happens to my Stripe fees?">
            They are split out properly. A payout is booked as gross revenue, a separate
            processing-fee expense, and the net amount that hit your bank — one entry
            covering both sides. This is the step most spreadsheet workflows get wrong,
            and it is why their revenue number is usually inflated.
          </FaqItem>
          <FaqItem q="Can my accountant work with this?">
            Yes. It is a standard chart of accounts and standard double-entry journal
            entries, so a P&amp;L and balance sheet come out in the format they already
            expect. Nothing about the output is unusual — that is deliberate.
          </FaqItem>
          <FaqItem q="What if Booked shuts down like Bench did?">
            The source is public and MIT licensed, and it is designed to be self-hosted.
            The failure mode that stranded Bench customers — losing access to your own
            historical books — is the specific thing this project is built to make
            impossible.
          </FaqItem>
          <FaqItem q="Do you support cash flow statements?">
            Not yet. P&amp;L and balance sheet are live and generated from the ledger.
            Cash flow is the next statement on the roadmap, and the ledger already holds
            everything needed to produce it.
          </FaqItem>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="text-base font-medium tracking-tight text-neutral-900">{q}</span>
        <span className="shrink-0 text-neutral-400 transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">{children}</p>
    </details>
  );
}

/* -------------------------------------------------------- closing cta */

function ClosingCta() {
  return (
    <section className="bg-neutral-900">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="mx-auto mb-4 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          Stop doing the books at midnight.
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-neutral-400">
          Connect a bank and a Stripe account, and see a closed month in a few minutes.
          Free during beta.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="rounded bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            Get started free
          </Link>
          <a
            href="https://github.com/learnwithalex/booked"
            className="rounded border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
          >
            Read the source
          </a>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- footer */

function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Mark />
              <span className="text-sm font-semibold tracking-tight text-neutral-900">Booked</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-neutral-500">
              Autonomous bookkeeping for small businesses and solo founders. Built to
              replace the service that left.
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
              { label: "Source on GitHub", href: "https://github.com/learnwithalex/booked" },
              { label: "The Build Games", href: "https://canivibecodeit.com/thebuildgames" },
            ]}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-400">
          <span>© 2026 Booked. MIT licensed.</span>
          <span>Built in public, Sep 6–30 2026 · Best Replacement track.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {title}
      </div>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-xs text-neutral-600 transition-colors hover:text-neutral-900"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
