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
        className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
      >
        {state === "running" ? (
          <>
            <span className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white" />
            Running…
          </>
        ) : (
          <>
            <PlayIcon />
            Run bookkeeper
          </>
        )}
      </button>
      {state === "done" && result && (
        <p className="text-[11px] text-zinc-500">
          {result.categorized} categorised · {result.reconciled} reconciled · {result.posted} posted
        </p>
      )}
      {state === "error" && (
        <p className="text-[11px] text-red-400">{result?.errors?.[0] ?? "Failed"}</p>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
      <polygon points="2,1 9,5 2,9" />
    </svg>
  );
}
