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

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CATEGORISED: "bg-blue-50 text-blue-700 border-blue-200",
  POSTED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  IGNORED: "bg-neutral-100 text-neutral-500 border-neutral-200",
};

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
    if (!t.categoryHint) return "—";
    return `${t.categoryHint} · ${code2name.get(t.categoryHint) ?? "unknown"}`;
  }

  const actionable = txns.filter((t) => t.status === "PENDING" || t.status === "CATEGORISED");

  async function runCategorise() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/categorize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ limit: 50 }),
      });
      const data = await res.json();
      setMessage(
        res.ok
          ? `Categorised ${data.processed} transaction${data.processed === 1 ? "" : "s"}.`
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
        const posted = new Set<string>();
        for (const t of txns) {
          if (t.status === "CATEGORISED") posted.add(t.id);
        }
        setTxns((prev) =>
          prev.map((t) => (posted.has(t.id) ? { ...t, status: "POSTED" } : t)),
        );
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
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={runCategorise}
          disabled={busy}
          className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 transition-colors hover:bg-neutral-700"
        >
          {busy ? "Working…" : "Categorise pending"}
        </button>
        <button
          onClick={postAll}
          disabled={busy || actionable.filter((t) => t.status === "CATEGORISED").length === 0}
          className="rounded border border-neutral-900 px-4 py-2 text-sm font-medium disabled:opacity-30 transition-colors hover:bg-neutral-50"
        >
          {busy ? "Working…" : "Post all reviewed"}
        </button>
        <span className="text-xs text-neutral-500">
          {actionable.length} need attention · {txns.filter((t) => t.status === "POSTED").length} posted
        </span>
      </div>

      {message && (
        <p className="mb-6 rounded border border-neutral-200 bg-white p-3 text-sm">{message}</p>
      )}

      {txns.length === 0 ? (
        <p className="text-sm text-neutral-600">No transactions yet. Connect a source to import.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {txns.map((t) => {
            const isActionable = t.status === "PENDING" || t.status === "CATEGORISED";
            const badge = STATUS_BADGE[t.status] ?? STATUS_BADGE.PENDING;
            return (
              <li
                key={t.id}
                className={`rounded border bg-white p-4 text-sm ${isActionable ? "border-neutral-200" : "border-neutral-100 opacity-60"}`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-medium">{t.merchant ?? t.description ?? "Unknown"}</div>
                  <div
                    className={`font-mono tabular-nums ${t.amountCents >= 0 ? "text-emerald-700" : "text-neutral-700"}`}
                  >
                    {fmtMoney(t.amountCents)}
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                  <span>{t.occurredAt}</span>
                  <span
                    className={`inline-block rounded border px-1.5 py-0.5 text-[10px] font-medium ${badge}`}
                  >
                    {t.status}
                  </span>
                  {t.categoryHint && (
                    <span className="text-neutral-400">→ {hintLabel(t)}</span>
                  )}
                  {t.confidence != null && (
                    <span className="text-neutral-400">{t.confidence}% confidence</span>
                  )}
                </div>
                {isActionable && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-neutral-400">Override:</span>
                    <select
                      value={selected[t.id] ?? ""}
                      onChange={(e) => setSelected((s) => ({ ...s, [t.id]: e.target.value }))}
                      className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs"
                    >
                      <option value="">Keep suggestion</option>
                      {accounts.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.code} · {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
