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

export function InboxClient({ initial, accounts }: { initial: Txn[]; accounts: Acct[] }) {
  const [txns, setTxns] = useState<Txn[]>(initial);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const code2name = new Map(accounts.map((a) => [a.code, a.name]));
  const actionable = txns.filter((t) => t.status === "PENDING" || t.status === "CATEGORISED");
  const posted = txns.filter((t) => t.status === "POSTED");

  async function runCategorise() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/categorize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ limit: 50 }) });
      const data = await res.json();
      setMessage(res.ok ? `Categorised ${data.processed} transaction${data.processed === 1 ? "" : "s"}.` : `Failed: ${data.error ?? "unknown"}`);
      if (res.ok) window.location.reload();
    } finally { setBusy(false); }
  }

  async function postAll() {
    setBusy(true);
    setMessage(null);
    try {
      const overrides: Record<string, string> = {};
      for (const [id, code] of Object.entries(selected)) { if (code) overrides[id] = code; }
      const res = await fetch("/api/post", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ overrides }) });
      const data = await res.json();
      if (res.ok) {
        const postedIds = new Set(txns.filter((t) => t.status === "CATEGORISED").map((t) => t.id));
        setTxns((prev) => prev.map((t) => (postedIds.has(t.id) ? { ...t, status: "POSTED" } : t)));
        setMessage(`Posted ${data.posted} to the ledger${data.failed?.length ? `, ${data.failed.length} failed` : ""}.`);
      } else {
        setMessage(`Post failed: ${data.error ?? "unknown"}`);
      }
    } finally { setBusy(false); }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-5 flex items-center gap-2">
        <button
          onClick={runCategorise}
          disabled={busy}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-40"
        >
          Categorise pending
        </button>
        <button
          onClick={postAll}
          disabled={busy || actionable.filter((t) => t.status === "CATEGORISED").length === 0}
          className="rounded-md border border-zinc-700 px-3 py-1.5 text-[12px] font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-100 disabled:opacity-30"
        >
          Post all reviewed
        </button>
        <span className="ml-1 text-[11px] text-zinc-600">
          {actionable.length} pending · {posted.length} posted
        </span>
      </div>

      {message && (
        <div className="mb-4 rounded-md border border-zinc-700 bg-zinc-800/60 px-4 py-2.5 text-[12px] text-zinc-300">
          {message}
        </div>
      )}

      {/* Table header */}
      {txns.length > 0 && (
        <div className="mb-1 grid grid-cols-[16px_1fr_120px_80px_80px_140px] items-center gap-3 px-3 text-[10px] uppercase tracking-wider text-zinc-600">
          <span />
          <span>Merchant</span>
          <span>Date</span>
          <span>Status</span>
          <span className="text-right">Conf.</span>
          <span className="text-right">Amount</span>
        </div>
      )}

      {/* Rows */}
      {txns.length === 0 ? (
        <p className="text-[13px] text-zinc-500">No transactions. Connect a source to import.</p>
      ) : (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900">
          {txns.map((t, i) => {
            const isActionable = t.status === "PENDING" || t.status === "CATEGORISED";
            const dotCls =
              t.status === "PENDING" ? "bg-amber-400" :
              t.status === "CATEGORISED" ? "bg-indigo-400" :
              t.status === "POSTED" ? "bg-emerald-500" :
              "bg-zinc-600";

            return (
              <div
                key={t.id}
                className={`grid grid-cols-[16px_1fr_120px_80px_80px_140px] items-center gap-3 px-3 py-2.5 ${i < txns.length - 1 ? "border-b border-zinc-800/80" : ""} ${!isActionable ? "opacity-40" : ""}`}
              >
                {/* Status dot */}
                <span className={`h-2 w-2 rounded-full ${dotCls}`} />

                {/* Merchant + hint */}
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-medium text-zinc-200">
                    {t.merchant ?? t.description ?? "Unknown"}
                  </div>
                  {t.categoryHint && (
                    <div className="truncate text-[10px] text-zinc-600">
                      → {t.categoryHint} · {code2name.get(t.categoryHint) ?? "?"}
                    </div>
                  )}
                  {isActionable && (
                    <select
                      value={selected[t.id] ?? ""}
                      onChange={(e) => setSelected((s) => ({ ...s, [t.id]: e.target.value }))}
                      className="mt-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Keep suggestion</option>
                      {accounts.map((a) => (
                        <option key={a.code} value={a.code}>{a.code} · {a.name}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Date */}
                <span className="text-[12px] text-zinc-500">{t.occurredAt}</span>

                {/* Status badge */}
                <span className={`inline-block rounded px-1.5 py-0.5 text-center text-[9px] font-semibold uppercase tracking-wide ${
                  t.status === "PENDING"     ? "bg-amber-400/10 text-amber-400" :
                  t.status === "CATEGORISED" ? "bg-indigo-400/10 text-indigo-400" :
                  t.status === "POSTED"      ? "bg-emerald-400/10 text-emerald-400" :
                                               "bg-zinc-700 text-zinc-500"
                }`}>
                  {t.status.toLowerCase()}
                </span>

                {/* Confidence */}
                <span className="text-right text-[11px] tabular-nums text-zinc-600">
                  {t.confidence != null ? `${t.confidence}%` : "—"}
                </span>

                {/* Amount */}
                <span className={`text-right font-mono text-[12px] tabular-nums ${t.amountCents >= 0 ? "text-emerald-400" : "text-zinc-300"}`}>
                  {fmtMoney(t.amountCents)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
