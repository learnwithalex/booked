import Link from "next/link";
import { Figtree } from "next/font/google";

/**
 * Structural replica of bench.co's landing page, built as a design baseline.
 * Layout, palette (#062D60 / #3FA684 / #121316), 8px radii, 700-weight headings
 * and section rhythm are measured from their live page. Copy and imagery are
 * Booked's own — none of their text or assets are reproduced here.
 *
 * Circular Std is proprietary; Figtree is the closest free geometric substitute.
 */

const figtree = Figtree({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

export const metadata = {
  title: "Booked — replica baseline",
  robots: { index: false, follow: false },
};

const GITHUB = "https://github.com/learnwithalex/booked";

export default function Replica() {
  return (
    <div className={`${figtree.className} min-h-screen bg-white text-bench-ink`}>
      <Nav />
      <Hero />
      <SocialProof />
      <SectionIntro />
      <FeatureRows />
      <Partners />
      <Resources />
      <CtaBand />
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------- nav */

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-16 max-w-[1312px] items-center gap-10 px-8">
        <Link href="/replica" className="flex items-center gap-2.5">
          <Shield />
          <span className="text-[19px] font-extrabold tracking-tight">Booked</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {["Product", "Platform", "Pricing", "About"].map((l) => (
            <button
              key={l}
              className="flex items-center gap-1.5 text-[15px] font-medium text-bench-ink hover:text-bench-blue"
            >
              {l}
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="text-[15px] font-medium hover:text-bench-blue">
            Log in
          </Link>
          <Link
            href="/login"
            className="rounded-[7px] bg-bench-navy px-6 py-[13px] text-[14px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Start free
          </Link>
          <Link
            href="#demo"
            className="hidden rounded-[7px] border-2 border-bench-navy px-6 py-[11px] text-[14px] font-bold text-bench-navy transition-colors hover:bg-bench-navy hover:text-white sm:block"
          >
            See a demo
          </Link>
        </div>
      </div>
    </header>
  );
}

function Shield({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path
        d="M4 5h24v14c0 5.5-5 9.5-12 12C9 28.5 4 24.5 4 19V5Z"
        fill="none"
        stroke="#B4913B"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path d="M11 12h10M14.5 12v9" stroke="#B4913B" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="bg-bench-navy">
      <div className="mx-auto grid max-w-[1312px] items-center gap-16 px-8 py-24 lg:grid-cols-2">
        <div>
          <h1 className="mb-7 text-[44px] font-bold leading-[1.1] text-white sm:text-[58px]">
            Confidence in your numbers without doing the books.
          </h1>

          <p className="mb-8 max-w-xl text-[17px] leading-[1.6] text-white/85">
            Connect your bank and Stripe and get an agent that keeps everything categorised,
            reconciled and closed. You get clarity when you need it and stay focused on running
            your business. We keep your books ready for tax time, funding, or whatever&apos;s next.
          </p>

          <ul className="mb-10 space-y-2.5">
            {[
              ["Double-entry", "ledger — debits equal credits or nothing posts"],
              ["Zero", "double-counted Stripe payouts"],
            ].map(([strong, rest]) => (
              <li key={strong} className="flex items-start gap-2.5 text-[15px] text-white/85">
                <span className="mt-0.5 text-bench-yolk">✦</span>
                <span>
                  <strong className="font-bold text-white">{strong}</strong> {rest}
                </span>
              </li>
            ))}
          </ul>

          <div className="mb-9 max-w-md space-y-4">
            <Link
              href="/login"
              className="block rounded-lg bg-bench-green px-6 py-4 text-center text-[16px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Start free
            </Link>
            <Link
              href="#demo"
              className="block text-center text-[16px] font-bold text-white hover:underline"
            >
              See a demo
            </Link>
          </div>

          <p className="max-w-lg text-[15px] leading-[1.6] text-white/70">
            Open source and self-hostable — bookkeeping, reconciliation and financial statements
            in one place, and the ledger stays yours if you ever leave.
          </p>
        </div>

        <HeroComposite />
      </div>
    </section>
  );
}

/** Layered UI + chat composite, mirroring Bench's hero collage. */
function HeroComposite() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[560px]">
      {/* base product card */}
      <div className="absolute right-0 top-10 w-[400px] rounded-xl bg-white p-5 text-bench-ink shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] font-bold">Net income</span>
          <span className="text-[11px] text-black/40">Jan – Jun</span>
        </div>
        <div className="flex h-28 items-end gap-3">
          {[38, 52, 44, 68, 80, 100].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t ${i === 5 ? "bg-bench-green" : "bg-bench-green/35"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-black/40">
          {["JAN", "FEB", "MAR", "APR", "MAY", "JUN"].map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>

      {/* floating expenses card */}
      <div className="absolute right-6 bottom-0 w-[250px] rounded-xl bg-white p-4 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]">
        <div className="mb-3 text-[12px] font-bold">Top expenses</div>
        {[
          ["Hosting", "26%"],
          ["Software", "49%"],
          ["Payment fees", "24%"],
        ].map(([k, v]) => (
          <div key={k} className="mb-2 flex items-center justify-between text-[11px]">
            <span className="text-black/60">{k}</span>
            <span className="rounded bg-bench-navy px-1.5 py-0.5 font-bold text-white">{v}</span>
          </div>
        ))}
      </div>

      {/* chat bubble top */}
      <div className="absolute left-0 top-0 w-[290px] rounded-2xl rounded-bl-sm bg-[#E8F0FB] p-4 text-[13px] leading-snug shadow-lg">
        Your August books are closed — 3 Stripe payouts reconciled and the clearing account is
        back to zero.
      </div>

      {/* chat bubble bottom */}
      <div className="absolute bottom-24 left-2 w-[250px] rounded-2xl rounded-br-sm bg-white p-4 text-[13px] leading-snug shadow-lg">
        Nice. Can you export the P&amp;L for my accountant?
      </div>

      <Avatar initials="AG" className="absolute left-[268px] top-[-14px]" tone="bg-bench-yolk" />
      <Avatar initials="NS" className="absolute bottom-[86px] left-[228px]" tone="bg-bench-green" />
    </div>
  );
}

function Avatar({
  initials,
  className = "",
  tone,
}: {
  initials: string;
  className?: string;
  tone: string;
}) {
  return (
    <span
      className={`flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-white text-[15px] font-bold text-bench-navy shadow-md ${tone} ${className}`}
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------- social proof */

const QUOTES = [
  {
    q: "I stopped reconciling Stripe payouts by hand. That was four hours every month I was never getting back.",
    n: "Justin Metros",
    t: "Proprietor, Radiator",
    tone: "bg-bench-yolk",
  },
  {
    q: "The confidence scores are the thing. I review eight transactions instead of four hundred.",
    n: "Albert Lamont",
    t: "CEO, Sweatcast",
    tone: "bg-bench-green",
  },
  {
    q: "My accountant opened the P&L and had no notes. That has never happened before.",
    n: "Laura Simms",
    t: "Founder, Northwind Studio",
    tone: "bg-bench-blue/20",
  },
];

function SocialProof() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1312px] px-8">
        <h2 className="mb-16 text-center text-[34px] font-bold leading-tight sm:text-[40px]">
          Built for founders who never wanted to be bookkeepers
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {QUOTES.map((c) => (
            <figure key={c.n}>
              <blockquote className="mb-7 text-[21px] font-medium leading-[1.4]">
                &ldquo;{c.q}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-bench-navy ${c.tone}`}
                >
                  {c.n
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-[13px] font-bold uppercase tracking-wide">{c.n}</span>
                  <span className="block text-[13px] uppercase tracking-wide text-black/50">
                    {c.t}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mt-14 text-center text-[13px] text-black/40">
          Placeholder testimonials — replace with real quotes and headshots before this ships.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- section intro */

function SectionIntro() {
  return (
    <section className="border-t border-black/10 bg-white py-20">
      <div className="mx-auto max-w-2xl px-8 text-center">
        <Shield className="mx-auto mb-6 h-11 w-11" />
        <h2 className="mb-4 text-[34px] font-bold leading-tight sm:text-[40px]">
          Small business bookkeeping, year-round
        </h2>
        <p className="text-[17px] leading-[1.6] text-black/60">
          No humans re-typing your bank statement. An agent that runs every day, a real
          double-entry ledger underneath it, and statements whenever you ask. Here&apos;s what
          that looks like.
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- feature rows */

function FeatureRows() {
  return (
    <section className="bg-white pb-8">
      <div className="mx-auto max-w-[1312px] px-8">
        <Row
          title="Powerful financial reporting"
          body="Monthly profit & loss and balance sheet generated straight from the ledger, with every figure traceable to the journal entry that produced it. Export for any period the moment your accountant asks."
          visual={<ReportingVisual />}
        />
        <Row
          flip
          title="Stripe payouts, reconciled automatically"
          body="Each payout is matched to the bank deposit it became and booked as one balanced entry — gross revenue in, processing fees out, clearing account back to zero. Revenue is never counted twice."
          visual={<ReconcileVisual />}
        />
        <Row
          title="Review eight transactions, not four hundred"
          body="Deterministic rules take everything predictable. The model handles the rest and shows how confident it is, so only genuinely ambiguous transactions reach your inbox. Correct one merchant and the rule is written for next month."
          visual={<ReviewVisual />}
        />
      </div>
    </section>
  );
}

function Row({
  title,
  body,
  visual,
  flip,
}: {
  title: string;
  body: string;
  visual: React.ReactNode;
  flip?: boolean;
}) {
  return (
    <div className="grid items-center gap-16 py-20 lg:grid-cols-2 lg:py-24">
      <div className={flip ? "lg:order-2" : ""}>
        <h3 className="mb-5 max-w-md text-[34px] font-bold leading-[1.15] sm:text-[40px]">
          {title}
        </h3>
        <p className="mb-8 max-w-md text-[17px] leading-[1.6] text-black/65">{body}</p>
        <Link
          href="/login"
          className="inline-block rounded-lg bg-bench-navy px-6 py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90"
        >
          Learn more
        </Link>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{visual}</div>
    </div>
  );
}

function VisualFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-[340px] w-full max-w-[560px] rounded-2xl bg-bench-ghost p-6">
      {children}
    </div>
  );
}

function ReportingVisual() {
  return (
    <VisualFrame>
      <div className="absolute left-6 top-8 w-[300px] rounded-xl bg-white p-5 shadow-[0_14px_36px_-10px_rgba(0,0,0,0.22)]">
        <div className="mb-1 text-[11px] uppercase tracking-wide text-black/40">Total revenue</div>
        <div className="mb-4 text-[26px] font-bold">
          $12,480<span className="text-[15px] text-black/40">.00</span>
        </div>
        <div className="mb-1 text-[11px] uppercase tracking-wide text-black/40">Net income</div>
        <div className="text-[26px] font-bold text-bench-green">
          $7,547<span className="text-[15px] text-black/40">.82</span>
        </div>
      </div>
      <div className="absolute bottom-7 right-6 w-[280px] rounded-xl bg-white p-5 shadow-[0_14px_36px_-10px_rgba(0,0,0,0.22)]">
        <div className="mb-3 text-[12px] font-bold">Profit &amp; loss — August</div>
        {[
          ["4000 Product revenue", "11,940.00"],
          ["4100 Consulting", "540.00"],
          ["6300 Payment fees", "(1,200.00)"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-1 text-[11px]">
            <span className="text-black/55">{k}</span>
            <span className="font-medium tabular-nums">{v}</span>
          </div>
        ))}
      </div>
      <Avatar initials="NS" tone="bg-bench-yolk" className="absolute bottom-4 left-10" />
    </VisualFrame>
  );
}

function ReconcileVisual() {
  return (
    <VisualFrame>
      <div className="absolute left-1/2 top-1/2 w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-[0_14px_36px_-10px_rgba(0,0,0,0.22)]">
        <div className="mb-1 text-[12px] font-bold">One payout, one entry</div>
        <div className="mb-4 text-[11px] text-black/40">po_1QxA7f · settled 28 Aug</div>
        <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-black/10 pb-1.5 text-[9px] uppercase tracking-wide text-black/40">
          <span>Account</span>
          <span className="text-right">Debit</span>
          <span className="text-right">Credit</span>
        </div>
        {[
          ["1000 Bank", "4,058.78", ""],
          ["6300 Fees", "121.22", ""],
          ["4000 Revenue", "", "4,180.00"],
        ].map(([a, d, c]) => (
          <div key={a} className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-1 text-[11px]">
            <span className="text-black/65">{a}</span>
            <span className="text-right tabular-nums">{d || "—"}</span>
            <span className="text-right tabular-nums">{c || "—"}</span>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-[1fr_auto_auto] gap-x-4 border-t border-black/10 pt-2 text-[11px] font-bold">
          <span className="text-bench-green">Balanced</span>
          <span className="text-right tabular-nums">4,180.00</span>
          <span className="text-right tabular-nums">4,180.00</span>
        </div>
      </div>
    </VisualFrame>
  );
}

function ReviewVisual() {
  return (
    <VisualFrame>
      <div className="absolute left-6 top-7 w-[330px] rounded-xl bg-white p-5 shadow-[0_14px_36px_-10px_rgba(0,0,0,0.22)]">
        <div className="mb-3 text-[12px] font-bold">Needs review · 8</div>
        {[
          ["Framer", "Software", "62%"],
          ["Notion Labs", "Software", "71%"],
          ["Uber Trip", "Travel", "58%"],
        ].map(([m, c, p]) => (
          <div key={m} className="flex items-center justify-between border-b border-black/5 py-2 last:border-0">
            <div>
              <div className="text-[12px] font-medium">{m}</div>
              <div className="text-[10px] text-black/40">{c}</div>
            </div>
            <span className="rounded bg-bench-yolk/40 px-2 py-0.5 text-[10px] font-bold">{p}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-6 right-6 w-[240px] rounded-xl bg-bench-navy p-4 text-white shadow-[0_14px_36px_-10px_rgba(0,0,0,0.3)]">
        <div className="mb-1 text-[11px] uppercase tracking-wide text-white/50">Auto-posted</div>
        <div className="text-[26px] font-bold">392</div>
        <div className="text-[11px] text-white/60">high confidence, no review needed</div>
      </div>
    </VisualFrame>
  );
}

/* ----------------------------------------------------------- partners */

function Partners() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1312px] px-8">
        <h2 className="mb-12 text-center text-[34px] font-bold sm:text-[40px]">
          Works with what you already use
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 opacity-70">
          {["Stripe", "Plaid", "Chase", "Mercury", "Shopify", "Square"].map((b) => (
            <span key={b} className="text-[26px] font-bold tracking-tight text-black/70">
              {b}
            </span>
          ))}
        </div>
        <p className="mt-10 text-center text-[13px] text-black/40">
          Wordmarks stand in for real logo assets — swap in licensed SVGs before shipping.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- resources */

const CARDS = [
  {
    tint: "bg-[#DCE8FB]",
    title: "How Stripe payouts break your books",
    body: "Why the deposit in your bank is never the revenue you earned, and what double-counting actually costs you at tax time.",
  },
  {
    tint: "bg-[#DDEEE2]",
    title: "11 alternatives to Bench in 2026",
    body: "What each one costs, what it automates, and which ones leave you with your ledger if they shut down.",
  },
  {
    tint: "bg-[#D9F0EE]",
    title: "How to read (and check) a P&L",
    body: "The four lines worth looking at every month, and the two that tell you a categorisation went wrong.",
  },
];

function Resources() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1312px] px-8">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full border-2 border-bench-ink px-5 py-2 text-[12px] font-bold uppercase tracking-[0.12em]">
            From the blog
          </span>
        </div>
        <h2 className="mb-14 text-center text-[34px] font-bold leading-tight sm:text-[44px]">
          Learn the bookkeeping you&apos;re about to stop doing
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {CARDS.map((c) => (
            <article key={c.title} className="overflow-hidden rounded-2xl border border-black/10">
              <div className={`flex h-52 items-center justify-center ${c.tint}`}>
                <Shield className="h-16 w-16 opacity-60" />
              </div>
              <div className="p-7">
                <h3 className="mb-3 text-[20px] font-bold leading-snug">{c.title}</h3>
                <p className="text-[15px] leading-[1.6] text-black/60">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- cta band */

function CtaBand() {
  return (
    <section id="demo" className="bg-bench-navy py-24">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-8 lg:grid-cols-2">
        <div className="text-white">
          <h2 className="mb-6 text-[34px] font-bold leading-tight sm:text-[40px]">
            See a closed month in a few minutes
          </h2>
          <p className="mb-4 text-[17px] leading-[1.6] text-white/80">
            Connect a bank account and Stripe, run the agent once, and look at a real set of books
            generated from your own transactions.
          </p>
          <p className="text-[17px] leading-[1.6] text-white/80">
            Free during beta. No card, no sales call. Open source, so you keep the ledger either
            way.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8">
          <h3 className="mb-6 text-[20px] font-bold">Start free</h3>
          <div className="space-y-4">
            {["Work email", "Business name"].map((l) => (
              <div key={l}>
                <label className="mb-1.5 block text-[13px] font-medium text-black/70">{l}</label>
                <div className="h-11 rounded-lg border border-black/15 bg-bench-ghost" />
              </div>
            ))}
            <Link
              href="/login"
              className="mt-2 block rounded-lg bg-bench-green px-6 py-4 text-center text-[16px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Create my account
            </Link>
            <p className="text-[12px] leading-relaxed text-black/45">
              Non-functional mock of Bench&apos;s lead-capture card. Booked&apos;s real signup is a
              magic link at /login.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- footer */

const FOOTER = [
  { t: "Company", l: ["About", "Blog", "Privacy Policy", "Terms of Service", "Contact"] },
  { t: "Product", l: ["How it works", "Pricing", "Security", "What's new"] },
  { t: "Resources", l: ["Guides", "Tools", "FAQ", "Customer reviews"] },
  { t: "Project", l: ["Source on GitHub", "The Build Games", "Self-hosting"] },
];

function Footer() {
  return (
    <footer className="bg-bench-ghost">
      <div className="mx-auto max-w-[1312px] px-8 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Shield className="mb-4 h-10 w-10" />
            <p className="text-[15px] leading-[1.5] text-black/70">
              Bookkeeping that runs itself — powered by a real double-entry ledger.
            </p>
          </div>

          {FOOTER.map((c) => (
            <div key={c.t}>
              <div className="mb-5 text-[14px] font-bold uppercase tracking-wide">{c.t}</div>
              <ul className="space-y-3.5">
                {c.l.map((x) => (
                  <li key={x}>
                    <a
                      href={x === "Source on GitHub" ? GITHUB : "#"}
                      className="text-[15px] text-black/70 hover:text-bench-blue"
                    >
                      {x}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-black/10 pt-7 text-[13px] text-black/50">
          <span>© 2026 Booked. MIT licensed.</span>
          <a href="#" className="hover:text-bench-blue">Terms of Service</a>
          <a href="#" className="hover:text-bench-blue">Privacy Policy</a>
          <a href="#" className="hover:text-bench-blue">Security</a>
        </div>
      </div>
    </footer>
  );
}
