"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CanonicalOpenItem } from "@/lib/knowledge/matter-knowledge";

export default function CounselWorkflow({ matterId, openItems }: { matterId: string; openItems: CanonicalOpenItem[] }) {
  const router = useRouter();
  const [form, setForm] = useState({ counselName: "", firmName: "", issueId: openItems[0]?.id ?? "", questionText: "", priority: "MEDIUM" });
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    const selectedItem = openItems.find((item) => item.id === form.issueId);
    const response = await fetch("/api/counsel", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ matterId, issueTitle: selectedItem?.title, ...form }) });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) { setState("error"); setMessage(payload.error ?? "Could not record counsel referral."); return; }
    setForm({ counselName: "", firmName: "", issueId: openItems[0]?.id ?? "", questionText: "", priority: "MEDIUM" });
    setState("idle");
    setMessage("Counsel engagement and open-item referral recorded.");
    router.refresh();
  }

  if (!openItems.length) return <p className="surface-card mt-7 rounded-xl p-5 text-sm text-slate-600">There are no open items available to refer to external counsel.</p>;

  return <section className="surface-card mt-7 rounded-xl p-5"><p className="eyebrow text-[#263c68]">New counsel referral</p><h2 className="mt-1 text-xl font-semibold">Link an open item to external counsel</h2><p className="mt-1 text-sm text-slate-600">Create the explicit counsel relationship here. The source document remains in Documents.</p><form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2"><input required value={form.counselName} onChange={(event) => setForm({ ...form, counselName: event.target.value })} placeholder="Counsel name" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><input value={form.firmName} onChange={(event) => setForm({ ...form, firmName: event.target.value })} placeholder="Firm or agency" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /><select required value={form.issueId} onChange={(event) => setForm({ ...form, issueId: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2">{openItems.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><textarea required value={form.questionText} onChange={(event) => setForm({ ...form, questionText: event.target.value })} placeholder="Question or item referred to counsel" rows={3} className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2" /><select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2 text-sm"><option>HIGH</option><option>MEDIUM</option><option>LOW</option></select><button type="submit" disabled={state === "saving"} className="rounded-lg bg-[#263c68] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{state === "saving" ? "Recording…" : "Record counsel referral"}</button></form>{message ? <p className={`mt-3 text-sm ${state === "error" ? "text-rose-700" : "text-emerald-700"}`}>{message}</p> : null}</section>;
}
