"use client";

import { useState } from "react";
import { fmtMoney } from "./fmt";

interface Txn {
  id: string;
  seq: number;
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
  const pending   = txns.filter((t) => t.status === "PENDING");
  const categorised = txns.filter((t) => t.status === "CATEGORISED");
  const posted    = txns.filter((t) => t.status === "POSTED");

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
          : `Failed: ${data.error ?? "unknown"}`
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
        const postedIds = new Set(txns.filter((t) => t.status === "CATEGORISED").map((t) => t.id));
        setTxns((prev) => prev.map((t) => (postedIds.has(t.id) ? { ...t, status: "POSTED" } : t)));
        setMessage(`Posted ${data.posted} to the ledger${data.failed?.length ? `, ${data.failed.length} failed` : ""}.`);
      } else {
        setMessage(`Post failed: ${data.error ?? "unknown"}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex items-center gap-2">
        <button
          onClick={runCategorise}
          disabled={busy}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-medium text-white transition-opacity disabled:opacity-40"
          style={{ background: "#5e6ad2" }}
        >
          Categorise pending
        </button>
        <button
          onClick={postAll}
          disabled={busy || categorised.length === 0}
          className="rounded px-3 py-1.5 text-[12px] font-medium text-lx-muted transition-colors disabled:opacity-30"
          style={{ border: "1px solid #2a2a32", background: "#1c1c22" }}
        >
          Post all reviewed
        </button>
        <span className="ml-1 text-[11px] text-lx-faint">
          {pending.length + categorised.length} pending · {posted.length} posted
        </span>
      </div>

      {message && (
        <div className="mb-4 rounded px-4 py-2.5 text-[12px] text-lx-muted" style={{ border: "1px solid #2a2a32", background: "#1c1c22" }}>
          {message}
        </div>
      )}

      {txns.length === 0 ? (
        <p className="text-[13px] text-lx-faint">No transactions. Connect a source to import.</p>
      ) : (
        <div className="rounded-md" style={{ border: "1px solid #2a2a32", background: "#1c1c22" }}>
          {/* Column headers */}
          <div
            className="grid grid-cols-[14px_60px_1fr_152px_80px_96px] items-center gap-3 px-4 py-2 text-[10px] font-medium uppercase tracking-widest text-lx-faint"
            style={{ borderBottom: "1px solid #2a2a32" }}
          >
            <span />
            <span>ID</span>
            <span>Merchant</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>

          {/* Pending group */}
          {pending.length > 0 && (
            <>
              <GroupHeader status="PENDING" count={pending.length} />
              {pending.map((t) => (
                <TxnRow key={t.id} t={t} accounts={accounts} code2name={code2name} selected={selected} setSelected={setSelected} />
              ))}
            </>
          )}

          {/* Categorised group */}
          {categorised.length > 0 && (
            <>
              <GroupHeader status="CATEGORISED" count={categorised.length} />
              {categorised.map((t) => (
                <TxnRow key={t.id} t={t} accounts={accounts} code2name={code2name} selected={selected} setSelected={setSelected} />
              ))}
            </>
          )}

          {/* Posted group */}
          {posted.length > 0 && (
            <>
              <GroupHeader status="POSTED" count={posted.length} />
              {posted.map((t) => (
                <TxnRow key={t.id} t={t} accounts={accounts} code2name={code2name} selected={selected} setSelected={setSelected} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GroupHeader({ status, count }: { status: string; count: number }) {
  return (
    <div
      className="flex h-8 items-center gap-2 px-4 text-[11px] font-medium text-lx-faint"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}
    >
      <StatusCircle status={status} size={12} />
      <span>{status === "PENDING" ? "Pending" : status === "CATEGORISED" ? "Reviewed" : "Posted"}</span>
      <span
        className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
        style={{ background: "rgba(255,255,255,0.06)", color: "#8a8a99" }}
      >
        {count}
      </span>
    </div>
  );
}

function TxnRow({
  t,
  accounts,
  code2name,
  selected,
  setSelected,
}: {
  t: Txn;
  accounts: Acct[];
  code2name: Map<string, string>;
  selected: Record<string, string>;
  setSelected: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const isActionable = t.status === "PENDING" || t.status === "CATEGORISED";
  const seqLabel = `TXN-${String(t.seq).padStart(3, "0")}`;
  const effectiveCode = selected[t.id] || t.categoryHint;

  return (
    <div
      className={`grid grid-cols-[14px_60px_1fr_152px_80px_96px] items-center gap-3 px-4 transition-colors ${
        isActionable ? "hover:bg-[rgba(255,255,255,0.02)]" : "opacity-40"
      }`}
      style={{ height: 32, borderBottom: "1px solid rgba(255,255,255,0.04)" }}
    >
      {/* Status */}
      <StatusCircle status={t.status} size={14} />

      {/* Identifier */}
      <span className="font-mono text-[11px] text-lx-faint">{seqLabel}</span>

      {/* Merchant */}
      <span className="truncate text-[13px] text-lx-text">
        {t.merchant ?? t.description ?? "Unknown"}
      </span>

      {/* Category */}
      <div className="min-w-0">
        {isActionable ? (
          <select
            value={selected[t.id] ?? ""}
            onChange={(e) => setSelected((s) => ({ ...s, [t.id]: e.target.value }))}
            className="h-[22px] w-full truncate rounded px-1.5 text-[11px] text-lx-muted focus:outline-none"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: effectiveCode ? "#8a8a99" : "#4a4a5a",
            }}
          >
            <option value="">{effectiveCode ? `${effectiveCode} · ${code2name.get(effectiveCode) ?? "?"}` : "No suggestion"}</option>
            {accounts.map((a) => (
              <option key={a.code} value={a.code}>{a.code} · {a.name}</option>
            ))}
          </select>
        ) : (
          <span className="truncate text-[11px] text-lx-faint">
            {t.categoryHint ? `${t.categoryHint} · ${code2name.get(t.categoryHint) ?? "?"}` : "—"}
          </span>
        )}
      </div>

      {/* Date */}
      <span className="text-[11px] tabular-nums text-lx-faint">{t.occurredAt}</span>

      {/* Amount */}
      <span
        className={`text-right font-mono text-[12px] tabular-nums ${
          t.amountCents >= 0 ? "text-lx-green" : "text-lx-muted"
        }`}
      >
        {fmtMoney(t.amountCents)}
      </span>
    </div>
  );
}

function StatusCircle({ status, size = 14 }: { status: string; size?: number }) {
  if (status === "PENDING") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="shrink-0">
        <circle cx="7" cy="7" r="5.5" stroke="#4a4a5a" strokeWidth="1.5" strokeDasharray="3.5 2.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === "CATEGORISED") {
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="shrink-0">
        <circle cx="7" cy="7" r="5.5" stroke="#f2b030" strokeWidth="1.5" />
        <path d="M7 1.5 A5.5 5.5 0 0 1 7 12.5 Z" fill="#f2b030" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="7" fill="#5e6ad2" />
      <path d="M4 7.5L6 9.5 10 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
