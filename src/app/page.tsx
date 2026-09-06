export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <div className="mb-16 text-xs uppercase tracking-wider text-neutral-500">
        Booked · in progress
      </div>

      <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight">
        Bookkeeping that runs itself.
      </h1>

      <p className="mb-8 text-lg leading-relaxed text-neutral-700">
        Connect your bank and Stripe. Booked categorises every transaction,
        reconciles Stripe payouts against your deposits, and produces monthly
        P&amp;L, balance sheet, and cash-flow statements ready for your
        accountant.
      </p>

      <p className="mb-12 text-lg leading-relaxed text-neutral-700">
        Built to replace Bench (recently sunset) and the entry tier of Pilot,
        for solo founders paying $300&ndash;1,000/mo for what an agent can now
        do end-to-end.
      </p>

      <div className="mb-16 rounded border border-neutral-200 bg-white p-6">
        <div className="mb-2 text-xs uppercase tracking-wider text-neutral-500">
          Status
        </div>
        <div className="text-sm text-neutral-700">
          Being built in public between Sep 6 and Sep 30, 2026 as an entry to{" "}
          <a
            href="https://canivibecodeit.com/thebuildgames"
            className="underline underline-offset-2"
          >
            The Build Games
          </a>
          . Commit history is the receipt.
        </div>
      </div>

      <footer className="border-t border-neutral-200 pt-6 text-xs text-neutral-500">
        <a
          href="https://github.com/learnwithalex/booked"
          className="underline underline-offset-2"
        >
          github.com/learnwithalex/booked
        </a>
      </footer>
    </main>
  );
}
