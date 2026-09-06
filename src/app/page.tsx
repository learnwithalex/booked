import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="mx-auto max-w-2xl px-6 pb-16 pt-24">
        <div className="mb-10 text-xs uppercase tracking-wider text-neutral-400">
          Booked
        </div>

        <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-neutral-900">
          Bookkeeping that runs itself.
        </h1>

        <p className="mb-6 text-lg leading-relaxed text-neutral-600">
          Connect your bank and Stripe. An agent categorises every transaction,
          reconciles Stripe payouts against your deposits, and produces P&amp;L,
          balance sheet, and cash-flow statements — every month, automatically.
        </p>

        <div className="mb-10 flex gap-3">
          <Link
            href="/login"
            className="rounded bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
          >
            Get started free
          </Link>
          <a
            href="https://github.com/learnwithalex/booked"
            className="rounded border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            View source
          </a>
        </div>
      </div>

      {/* Bench sunset callout */}
      <div className="border-y border-neutral-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-10">
          <div className="mb-3 text-xs uppercase tracking-wider text-neutral-400">Why this exists</div>
          <p className="mb-4 text-base leading-relaxed text-neutral-700">
            Bench shut down in December 2024 with no warning, leaving thousands of small businesses
            scrambling for their own books. Pilot and Mercury offer bookkeeping starting at $499/mo —
            more than most bootstrapped businesses spend on hosting.
          </p>
          <p className="text-base leading-relaxed text-neutral-700">
            LLMs are now good enough to categorise transactions accurately. Reconciliation is
            deterministic. The work that cost $300–1,000/mo can be done by an agent for the
            price of API calls.
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-6 text-xs uppercase tracking-wider text-neutral-400">How it works</div>
        <div className="space-y-4">
          <Step n="1" title="Connect your sources">
            Link your bank account via Plaid and your Stripe account. Booked pulls
            transactions automatically.
          </Step>
          <Step n="2" title="Agent categorises everything">
            Rules handle the obvious ones (AWS → Hosting, Stripe charges → Revenue).
            The LLM handles the rest. Each decision shows its confidence score.
          </Step>
          <Step n="3" title="Stripe payouts reconciled automatically">
            The agent matches each Stripe payout to its corresponding bank deposit —
            a two-sided journal entry, not double-counted revenue.
          </Step>
          <Step n="4" title="Statements ready">
            Monthly P&amp;L, balance sheet, and cash flow generated from a proper
            double-entry ledger. Export-ready for your accountant or tax preparer.
          </Step>
        </div>
      </div>

      {/* Pricing */}
      <div className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <div className="mb-6 text-xs uppercase tracking-wider text-neutral-400">Pricing</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <PriceCard title="Free" price="$0" note="During beta">
              Up to 100 transactions/mo · P&amp;L + balance sheet
            </PriceCard>
            <PriceCard title="Starter" price="$29" note="/month" highlight>
              Unlimited transactions · All statements · Stripe reconcile
            </PriceCard>
            <PriceCard title="vs Bench" price="$299" note="/month (was)">
              The service that shut down. We&apos;re the replacement.
            </PriceCard>
          </div>
        </div>
      </div>

      {/* Build Games badge */}
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded border border-neutral-200 bg-white p-5">
          <div className="mb-2 text-xs uppercase tracking-wider text-neutral-400">Build Games 2026</div>
          <p className="text-sm text-neutral-600">
            Built in public, Sep 6–30 2026.{" "}
            <a
              href="https://canivibecodeit.com/thebuildgames"
              className="underline underline-offset-2"
            >
              The Build Games
            </a>{" "}
            · Best Replacement track. Commit history is the receipt.
          </p>
        </div>
      </div>

      <footer className="border-t border-neutral-200 px-6 py-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between text-xs text-neutral-400">
          <span>Booked</span>
          <a href="https://github.com/learnwithalex/booked" className="underline underline-offset-2">
            github.com/learnwithalex/booked
          </a>
        </div>
      </footer>
    </main>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
        {n}
      </div>
      <div>
        <div className="mb-0.5 text-sm font-semibold text-neutral-900">{title}</div>
        <div className="text-sm text-neutral-600">{children}</div>
      </div>
    </div>
  );
}

function PriceCard({
  title,
  price,
  note,
  children,
  highlight,
}: {
  title: string;
  price: string;
  note: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded border p-5 ${
        highlight ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-200 bg-neutral-50 text-neutral-700"
      }`}
    >
      <div className={`mb-1 text-xs uppercase tracking-wider ${highlight ? "text-neutral-400" : "text-neutral-500"}`}>
        {title}
      </div>
      <div className="mb-3">
        <span className="text-2xl font-semibold">{price}</span>
        <span className={`text-xs ${highlight ? "text-neutral-400" : "text-neutral-500"}`}> {note}</span>
      </div>
      <div className={`text-xs leading-relaxed ${highlight ? "text-neutral-300" : "text-neutral-500"}`}>
        {children}
      </div>
    </div>
  );
}
