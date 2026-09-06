"use client";

import { useState } from "react";

// Connect page: Plaid bank feed + Stripe revenue feed, one button each.
// Plaid uses Link (CDN script); Stripe syncs server-side with the platform key.
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
        onExit: () => {
          setStatus("Bank connection cancelled.");
          setBusy(false);
        },
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
      setStatus(
        res.ok
          ? `Stripe synced: ${data.balanceTxns} charges, ${data.payouts} payouts.`
          : `Failed: ${data.error}`,
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Connect your money</h1>
      <div className="flex flex-col gap-4">
        <div className="rounded border border-neutral-200 bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold">Bank account</h2>
          <p className="mb-4 text-sm text-neutral-600">
            Connect via Plaid. Transactions sync automatically.
          </p>
          <button
            onClick={connectPlaid}
            disabled={busy}
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Working…" : "Connect bank"}
          </button>
        </div>
        <div className="rounded border border-neutral-200 bg-white p-6">
          <h2 className="mb-1 text-sm font-semibold">Stripe</h2>
          <p className="mb-4 text-sm text-neutral-600">
            Pull the last 90 days of charges, fees, and payouts.
          </p>
          <button
            onClick={syncStripe}
            disabled={busy}
            className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {busy ? "Working…" : "Sync Stripe"}
          </button>
        </div>
        {status && (
          <p className="rounded border border-neutral-200 bg-white p-3 text-sm">{status}</p>
        )}
      </div>
    </main>
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
