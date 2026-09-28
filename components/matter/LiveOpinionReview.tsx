"use client";

import { useState } from "react";

type LiveReview = {
  overall_assessment: string;
  review_points: Array<{
    review_type: string;
    title: string;
    severity: string;
    counsel_position: string;
    company_review: string;
    recommended_action: string;
    source_ids: string[];
  }>;
};

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function LiveOpinionReview({ matterId }: { matterId: string }) {
  const [review, setReview] = useState<LiveReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runReview() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/opinion-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matterId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Live review is unavailable.");
      }

      setReview(payload.review);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Live review is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="surface-card mt-8 rounded-xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-blue-700">Live intelligence</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Run an evidence-grounded review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This sends the bounded MAT-001 counsel context and retrieved evidence to the configured server-side Gemini model. Source IDs are validated before the result is shown.
          </p>
        </div>
        <button
          type="button"
          onClick={runReview}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Reviewing…" : "Run live review"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-semibold">Live review unavailable</p>
          <p className="mt-1">{error} The stored MatterBridge review remains available above.</p>
        </div>
      ) : null}

      {review ? (
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          <div className="rounded-lg bg-blue-50/70 p-4 text-sm leading-6 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Model assessment</p>
            <p className="mt-2">{review.overall_assessment}</p>
          </div>
          {review.review_points.map((point, index) => (
            <article key={`${point.title}-${index}`} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-950">{point.title}</h3>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{label(point.severity)}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{label(point.review_type)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700"><span className="font-semibold">Counsel position:</span> {point.counsel_position}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">Company review:</span> {point.company_review}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">Recommended action:</span> {label(point.recommended_action)}</p>
              <div className="mt-3 flex flex-wrap gap-2">{point.source_ids.map((sourceId) => <span key={sourceId} className="rounded-full bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">{sourceId}</span>)}</div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
