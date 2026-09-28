"use client";

import { useState } from "react";
import type { Decision } from "@/lib/types/matter";

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

export default function DecisionWorkspace({ decision }: { decision: Decision }) {
  const [rationale, setRationale] = useState(decision.decision_rationale ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <section className="surface-card rounded-xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{decision.decision_id}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Decision rationale</h2>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          Local prototype state
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Review and amend the rationale before recording the internal legal position. This prototype does not persist changes.
      </p>
      <textarea
        value={rationale}
        onChange={(event) => {
          setRationale(event.target.value);
          setSaved(false);
        }}
        rows={8}
        className="mt-4 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        aria-label="Decision rationale"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">Local prototype note · not saved</span>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {saved ? "Rationale captured locally" : "Capture rationale"}
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-500">Current state: {label(decision.decision_finality)}</p>
    </section>
  );
}
