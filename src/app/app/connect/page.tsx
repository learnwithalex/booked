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
    <div className="px-6 py-5">
      <div className="mb-6">
        <div className="text-[11px] font-medium uppercase tracking-widest text-lx-faint">Connect</div>
        <h1 className="mt-1 text-[20px] font-semibold tracking-tight text-lx-text">Your money, in</h1>
      </div>

      <div className="flex max-w-lg flex-col gap-3">
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
          <div
            className="rounded px-4 py-3 text-[12px] text-lx-muted"
            style={{ border: "1px solid #2a2a32", background: "#1c1c22" }}
          >
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
    <div
      className="flex items-center justify-between rounded-md px-5 py-4"
      style={{ border: "1px solid #2a2a32", background: "#1c1c22" }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded text-lx-faint"
          style={{ border: "1px solid #2a2a32", background: "rgba(255,255,255,0.04)" }}
        >
          {icon}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-lx-text">{title}</div>
          <div className="text-[11px] text-lx-faint">{description}</div>
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded px-3 py-1.5 text-[12px] font-medium text-lx-muted transition-colors hover:text-lx-text disabled:opacity-40"
        style={{ border: "1px solid #2a2a32", background: "rgba(255,255,255,0.04)" }}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function BankIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 6.5h12M7.5 2l6 4.5h-12l6-4.5zM3.5 6.5v6M7.5 6.5v6M11.5 6.5v6M1.5 12.5h12" />
    </svg>
  );
}

function StripeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round">
      <rect x="2" y="2" width="11" height="11" rx="2" />
      <path d="M5 8.5c.3.8 1 1 1.5 1 .8 0 1.5-.4 1.5-1.2 0-1.5-3-1-3-2.3 0-.8.7-1 1.5-1 .5 0 1.1.2 1.5.7" />
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
