"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CanonicalOpenItem } from "@/lib/knowledge/matter-knowledge";

export default function StrategyWorkflow({ matterId, openItems }: { matterId: string; openItems: CanonicalOpenItem[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ title: "", summary: "", rationale: "", openItemId: openItems[0]?.id ?? "", action: "", owner: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/decisions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matterId, title: form.title, summary: form.summary, rationale: form.rationale, openItemId: form.openItemId || undefined, actions: form.action ? [{ action: form.action, owner: form.owner }] : [] }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) setMessage(payload.error ?? "Could not record internal strategy.");
    else { setMessage("Internal strategy and follow-up action recorded."); setForm({ title: "", summary: "", rationale: "", openItemId: openItems[0]?.id ?? "", action: "", owner: "" }); router.refresh(); }
    setSaving(false);
  }
  return <section className="surface-card mt-7 rounded-xl p-5"><p className="eyebrow text-[#263c68]">Record internal strategy</p><h2 className="mt-1 text-xl font-semibold">Create a decision and follow-up action</h2><p className="mt-1 text-sm text-slate-600">This is an explicit organisational decision; it is not inferred from extraction.</p><form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2"><input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Strategy title" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><select value={form.openItemId} onChange={(event) => setForm({ ...form, openItemId: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option value="">No linked open item</option>{openItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><textarea required value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} placeholder="What did the organisation decide?" rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" /><textarea value={form.rationale} onChange={(event) => setForm({ ...form, rationale: event.target.value })} placeholder="Rationale" rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" /><input value={form.action} onChange={(event) => setForm({ ...form, action: event.target.value })} placeholder="Follow-up action (optional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><input value={form.owner} onChange={(event) => setForm({ ...form, owner: event.target.value })} placeholder="Action owner" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><button type="submit" disabled={saving} className="rounded-lg bg-[#263c68] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Record strategy"}</button></form>{message ? <p className="mt-3 text-sm text-slate-600">{message}</p> : null}</section>;
}
