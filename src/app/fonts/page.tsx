import {
  Inter,
  Instrument_Sans,
  Plus_Jakarta_Sans,
  DM_Sans,
  Manrope,
  Space_Grotesk,
  Sora,
  Outfit,
} from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
const instrument = Instrument_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "700"] });
const grotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });
const sora = Sora({ subsets: ["latin"], weight: ["400", "700"] });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = { title: "Font candidates", robots: { index: false } };

const CANDIDATES = [
  { name: "Inter (current)", cls: inter.className },
  { name: "Instrument Sans", cls: instrument.className },
  { name: "Plus Jakarta Sans", cls: jakarta.className },
  { name: "DM Sans", cls: dmSans.className },
  { name: "Manrope", cls: manrope.className },
  { name: "Space Grotesk", cls: grotesk.className },
  { name: "Sora", cls: sora.className },
  { name: "Outfit", cls: outfit.className },
];

export default function FontSpecimen() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] px-10 py-16 text-white antialiased">
      <div className="mx-auto max-w-4xl space-y-16">
        {CANDIDATES.map((f) => (
          <div key={f.name} className={f.cls}>
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#4ade80]">
              {f.name}
            </p>
            <h1 className="mb-4 text-[56px] font-bold leading-[1.03] tracking-[-0.04em]">
              Bookkeeping that <span className="text-[#4ade80]">runs itself.</span>
            </h1>
            <p className="mb-4 max-w-lg text-[17px] leading-relaxed text-zinc-400">
              Connect your bank and Stripe. Booked categorises every transaction, reconciles every
              payout, and closes your month from a real double-entry ledger. $29/month.
            </p>
            <p className="font-mono text-sm tabular-nums text-zinc-500">
              $12,480.00 · $7,547.82 · 4,058.78 · 121.22 · 4,180.00
            </p>
            <div className="mt-14 border-b border-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
