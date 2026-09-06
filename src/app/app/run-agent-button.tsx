"use client";

import { useState } from "react";

interface AgentResult {
  categorized?: number;
  reconciled?: number;
  posted?: number;
  errors?: string[];
}

export function RunAgentButton() {
  const [state, setState] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<AgentResult | null>(null);

  async function run() {
    setState("running");
    setResult(null);
    try {
      const catRes = await fetch("/api/categorize", { method: "POST" });
      const catData = await catRes.json();

      const postRes = await fetch("/api/post", { method: "POST" });
      const postData = await postRes.json();

      setResult({
        categorized: catData.processed ?? 0,
        reconciled: postData.reconciled ?? 0,
        posted: postData.posted ?? 0,
        errors: [
          ...(catData.errors ?? []).map((e: string) => `Categorize: ${e}`),
          ...(postData.failed ?? []).map((f: { id: string; error: string }) => `Post ${f.id.slice(0, 8)}: ${f.error}`),
        ],
      });
      setState("done");
      // Reload to refresh P&L numbers
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setState("error");
      setResult({ errors: [String(e)] });
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={run}
        disabled={state === "running"}
        className="rounded bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 transition-colors"
      >
        {state === "running" ? "Running…" : "Run bookkeeper"}
      </button>
      {state === "done" && result && (
        <p className="text-xs text-neutral-500">
          {result.categorized} categorised · {result.reconciled} reconciled · {result.posted} posted
        </p>
      )}
      {state === "error" && (
        <p className="text-xs text-red-500">{result?.errors?.[0] ?? "Failed"}</p>
      )}
    </div>
  );
}
