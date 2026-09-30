"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CounselAdviceForm({ engagementId, briefId }: { engagementId: string; briefId?: string }) {
  const router = useRouter();
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/counsel/advice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ engagementId, briefId, summary }) });
    if (response.ok) { setSummary(""); router.refresh(); }
    setSaving(false);
  }
  return <form onSubmit={submit} className="mt-4 border-t border-slate-100 pt-4"><label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Record counsel response</label><textarea required value={summary} onChange={(event) => setSummary(event.target.value)} rows={3} placeholder="Paste or summarize the latest counsel feedback…" className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" /><button type="submit" disabled={saving} className="mt-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Record response"}</button></form>;
}
