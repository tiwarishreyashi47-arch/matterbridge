"use client";

import { Fragment, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Assertion, MatterBundle } from "@/lib/types/matter";

function isDocumentBacked(assertion: Assertion) {
  return Boolean(assertion.source_document_ids?.length || assertion.citations?.some((citation) => citation.document_id));
}

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function reviewStatus(assertion: Assertion) {
  if (assertion.status === "accepted") return "Accepted";
  if (assertion.status === "rejected") return "Rejected";
  return "Proposed review";
}

function humanValue(value: unknown): string {
  if (value === null || value === undefined) return "Not recorded";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map(humanValue).join(", ");
  return Object.entries(value as Record<string, unknown>).map(([key, item]) => `${label(key)}: ${humanValue(item)}`).join(" · ");
}

function isFreeText(assertion: Assertion) {
  return typeof assertion.value === "string" && (assertion.value.length > 120 || /\n/.test(assertion.value));
}

export default function ReviewWorkspace({ matterData }: { matterData: MatterBundle }) {
  const [assertions, setAssertions] = useState(matterData.assertions ?? []);
  const [message, setMessage] = useState("");
  const [pendingAssertionId, setPendingAssertionId] = useState<string | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);
  const router = useRouter();
  const queue = useMemo(() => [...assertions].sort((a, b) => Number(isFreeText(a)) - Number(isFreeText(b)) || a.attribute.localeCompare(b.attribute)), [assertions]);
  const documentAssertions = queue.filter(isDocumentBacked);
  const proposedAssertions = documentAssertions.filter((assertion) => assertion.status === "proposed");

  async function review(assertion: Assertion, status: "accepted" | "rejected") {
    setPendingAssertionId(assertion.assertion_id);
    setMessage("");
    try {
      const response = await fetch(`/api/assertions/${assertion.assertion_id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(payload.error ?? "Review action failed."); return; }
      setAssertions((current) => current.map((item) => item.assertion_id === assertion.assertion_id ? { ...item, status } : item));
      setMessage(`${label(assertion.attribute)} marked ${status}.`);
    } finally {
      setPendingAssertionId(null);
    }
  }

  async function approveAll() {
    setBulkSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/assertions/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assertionIds: proposedAssertions.map((assertion) => assertion.assertion_id), status: "accepted" }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) { setMessage(payload.error ?? "Bulk approval failed."); return; }
      const approved = new Set(payload.assertionIds ?? []);
      setAssertions((current) => current.map((assertion) => approved.has(assertion.assertion_id) ? { ...assertion, status: "accepted" } : assertion));
      setMessage(`${payload.updated ?? 0} extracted fact(s) approved.`);
      router.refresh();
    } finally {
      setBulkSaving(false);
    }
  }

  return (
    <section className="surface-card rounded-xl p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="eyebrow text-blue-700">Matter facts</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Extracted facts</h2><p className="mt-1 text-sm text-slate-600">{documentAssertions.length} document facts available for review. Values are shown directly against each fact.</p></div>
        {documentAssertions.length ? <div className="flex items-center gap-2"><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{proposedAssertions.length} proposed</span>{proposedAssertions.length ? <button type="button" onClick={approveAll} disabled={bulkSaving} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">{bulkSaving ? "Approving…" : "Approve all proposed"}</button> : null}</div> : null}
      </div>
      {!documentAssertions.length ? <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-600">No extracted document facts are available yet. Upload and process a PDF above.</div> : null}
      <div className="mt-4 divide-y divide-slate-200 rounded-lg border border-slate-200">
        {queue.map((assertion, index) => {
          const documentBacked = isDocumentBacked(assertion);
          const needsReview = documentBacked && assertion.status === "proposed";
          const isPending = pendingAssertionId === assertion.assertion_id;
          const isAccepted = assertion.status === "accepted";
          const isRejected = assertion.status === "rejected";
          const content = <>
            <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-slate-950">{label(assertion.attribute)}</p><p className="mt-1 text-xs text-slate-500">{documentBacked ? "Uploaded document" : "Matter context"}</p></div><div className="flex items-center gap-2"><span className="text-sm font-medium text-slate-700">{humanValue(assertion.value)}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${isAccepted ? "bg-emerald-50 text-emerald-700" : isRejected ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{reviewStatus(assertion)}</span></div></div>
            {needsReview ? <div className="mt-4 border-t border-slate-100 pt-4"><div className="rounded-lg border border-blue-100 bg-blue-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-blue-800">Evidence</p>{assertion.citations?.length ? assertion.citations.map((citation) => <p key={`${assertion.assertion_id}-${citation.page_number}-${citation.quote}`} className="mt-2 text-sm text-blue-950">“{citation.quote}” <span className="text-xs text-blue-700">(Page {citation.page_number ?? "unknown"})</span></p>) : <p className="mt-2 text-sm text-amber-700">Citation verification needed for this fact.</p>}</div><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={isPending} onClick={() => review(assertion, "accepted")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{isPending && isAccepted ? "Saving…" : "Accept"}</button><button type="button" disabled={isPending} onClick={() => review(assertion, "rejected")} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 disabled:cursor-wait disabled:opacity-60">{isPending && isRejected ? "Saving…" : "Reject"}</button></div></div> : null}
          </>;
          const startsGroup = index === 0 || isFreeText(assertion) !== isFreeText(queue[index - 1]);
          const heading = startsGroup ? <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{isFreeText(assertion) ? "Narrative and free-text facts" : "Structured and tabular facts"}</div> : null;
          return <Fragment key={assertion.assertion_id}>{heading}{needsReview ? <details className="group p-4"><summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="text-slate-400 transition group-open:rotate-90">▸</span><span className="text-sm font-semibold text-slate-950">{label(assertion.attribute)}</span></div><span className="text-sm font-medium text-slate-700">{humanValue(assertion.value)}</span></div></summary><div className="pl-6">{content}</div></details> : <div className="p-4">{content}</div>}</Fragment>;
        })}
      </div>
      {message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}
    </section>
  );
}
