"use client";

import { useState } from "react";

export default function ConnectPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function connectPlaid() {
    setBusy(true);
    setStatus(null);
    try {
      const tok = await fetch("/api/plaid/link-token", { method: "POST" });
      if (!tok.ok) throw new Error("could not create link token");
      const { linkToken } = await tok.json();

      await loadPlaidScript();
      const Plaid = (window as unknown as { Plaid: { create: (o: object) => { open: () => void } } }).Plaid;
      const handler = Plaid.create({
        token: linkToken,
        onSuccess: async (publicToken: string) => {
          const res = await fetch("/api/plaid/exchange", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ publicToken }),
          });
          const data = await res.json();
          setStatus(res.ok ? `Bank connected. Synced ${data.synced?.added ?? 0} transactions.` : `Failed: ${data.error}`);
          setBusy(false);
        },
        onExit: () => { setStatus("Bank connection cancelled."); setBusy(false); },
      });
      handler.open();
    } catch (e) {
      setStatus(`Failed: ${e instanceof Error ? e.message : "unknown"}`);
      setBusy(false);
    }
  }

  async function syncStripe() {
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch("/api/stripe/sync", { method: "POST" });
      const data = await res.json();
      setStatus(res.ok ? `Stripe synced: ${data.balanceTxns} charges, ${data.payouts} payouts.` : `Failed: ${data.error}`);
    } finally { setBusy(false); }
  }

  return (
    <div className="px-8 py-6">
      <div className="mb-6">
        <div className="text-[11px] uppercase tracking-wider text-zinc-600">Connect</div>
        <h1 className="mt-0.5 text-[18px] font-semibold text-zinc-100">Your money, in</h1>
      </div>

      <div className="flex max-w-xl flex-col gap-4">
        <ConnectCard
          title="Bank account"
          description="Connect via Plaid. Transactions sync every day."
          buttonLabel={busy ? "Working…" : "Connect bank"}
          onClick={connectPlaid}
          disabled={busy}
          icon={<BankIcon />}
        />
        <ConnectCard
          title="Stripe"
          description="Pull the last 90 days of charges, fees, and payouts."
          buttonLabel={busy ? "Working…" : "Sync Stripe"}
          onClick={syncStripe}
          disabled={busy}
          icon={<StripeIcon />}
        />
        {status && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-[12px] text-zinc-300">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectCard({
  title, description, buttonLabel, onClick, disabled, icon,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
  disabled: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-4">
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400">
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-zinc-200">{title}</div>
          <div className="text-[11px] text-zinc-500">{description}</div>
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-md border border-zinc-700 px-3 py-1.5 text-[12px] font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100 disabled:opacity-40"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function BankIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6h12M8 2l6 4H2l6-4zM4 6v6M8 6v6M12 6v6M2 12h12" />
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="2" y="2" width="12" height="12" rx="2" />
      <path d="M5.5 8.5c.3.8 1 1 1.5 1 .8 0 1.5-.4 1.5-1.2 0-1.5-3-1-3-2.3 0-.8.7-1 1.5-1 .5 0 1.1.2 1.5.7" />
    </svg>
  );
}

function loadPlaidScript(): Promise<void> {
  if (document.querySelector('script[src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]')) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("plaid script failed to load"));
    document.head.appendChild(s);
  });
}
