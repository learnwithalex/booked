"use client";

import { useState } from "react";
import { fmtMoney } from "./fmt";

interface Txn {
  id: string;
  occurredAt: string;
  merchant: string | null;
  description: string | null;
  amountCents: number;
  currency: string;
  status: string;
  confidence: number | null;
  categoryHint: string | null;
}

interface Acct {
  code: string;
  name: string;
}

export function InboxClient({
  initial,
  accounts,
}: {
  initial: Txn[];
  accounts: Acct[];
}) {
  const [txns, setTxns] = useState<Txn[]>(initial);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const code2name = new Map(accounts.map((a) => [a.code, a.name]));

  function hintLabel(t: Txn) {
    if (!t.categoryHint) return "needs categorisation";
    return `${t.categoryHint} ${code2name.get(t.categoryHint) ?? ""}`;
  }

  async function runCategorise() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/categorize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ limit: 25 }),
      });
      const data = await res.json();
      setMessage(
        res.ok
          ? `Categorised ${data.processed} transaction${data.processed === 1 ? "" : "s"}. Reload to review.`
          : `Categorise failed: ${data.error ?? "unknown"}`,
      );
      if (res.ok) window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  async function postAll() {
    setBusy(true);
    setMessage(null);
    try {
      const overrides: Record<string, string> = {};
      for (const [id, code] of Object.entries(selected)) {
        if (code) overrides[id] = code;
      }
      const res = await fetch("/api/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ overrides }),
      });
      const data = await res.json();
      if (res.ok) {
        const done = new Set<string>();
        for (const t of txns) {
          if (t.status === "CATEGORISED") done.add(t.id);
        }
        setTxns((prev) => prev.filter((t) => !done.has(t.id)));
        setMessage(
          `Posted ${data.posted} to the ledger${data.failed?.length ? `, ${data.failed.length} failed` : ""}.`,
        );
      } else {
        setMessage(`Post failed: ${data.error ?? "unknown"}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={runCategorise}
          disabled={busy}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "Working…" : "Categorise pending"}
        </button>
        <button
          onClick={postAll}
          disabled={busy}
          className="rounded border border-neutral-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {busy ? "Working…" : "Post all reviewed"}
        </button>
      </div>

      {message && (
        <p className="mb-6 rounded border border-neutral-200 bg-white p-3 text-sm">{message}</p>
      )}

      {txns.length === 0 ? (
        <p className="text-sm text-neutral-600">Inbox clear. Nothing needs your eyes.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {txns.map((t) => (
            <li
              key={t.id}
              className="rounded border border-neutral-200 bg-white p-4 text-sm"
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="font-medium">{t.merchant ?? t.description ?? "Unknown"}</div>
                <div
                  className={`font-mono tabular-nums ${t.amountCents >= 0 ? "text-green-700" : ""}`}
                >
                  {fmtMoney(t.amountCents)}
                </div>
              </div>
              <div className="mt-1 text-xs text-neutral-500">
                {t.occurredAt} · {t.description && t.merchant ? t.description : t.currency} ·{" "}
                {t.status.toLowerCase()}
                {t.confidence != null ? ` · confidence ${t.confidence}` : ""}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500">→ {hintLabel(t)}</span>
                <select
                  value={selected[t.id] ?? ""}
                  onChange={(e) => setSelected((s) => ({ ...s, [t.id]: e.target.value }))}
                  className="ml-auto rounded border border-neutral-300 bg-white px-2 py-1 text-xs"
                >
                  <option value="">Keep suggestion</option>
                  {accounts.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.code} {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
