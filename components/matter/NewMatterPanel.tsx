"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { templateCatalog } from "@/lib/templates/catalog";

export default function NewMatterPanel() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState(templateCatalog[0].template_id);
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function createMatter() {
    setState("saving");
    setMessage("");
    const response = await fetch("/api/matters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, templateId }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Matter creation failed.");
      return;
    }
    router.push(`/matters/${payload.matterId}`);
  }

  return <section className="surface-card mt-8 rounded-xl p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow text-blue-700">Greenfield matter</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Create a new matter</h2><p className="mt-1 max-w-2xl text-sm text-slate-600">Start a clean matter record with its own template, workstreams, documents, assertions, and review queue.</p></div><form onSubmit={(event) => { event.preventDefault(); void createMatter(); }} className="grid gap-2 sm:grid-cols-2 lg:min-w-[42rem]"><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Matter title" className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" /><select aria-label="Matter type template" value={templateId} onChange={(event) => setTemplateId(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">{templateCatalog.map((template) => <option key={template.template_id} value={template.template_id}>{template.name} · {template.version}</option>)}</select><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Optional matter description" rows={2} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm sm:col-span-2" /><button type="submit" disabled={!title.trim() || state === "saving"} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2">{state === "saving" ? "Creating…" : "Create matter"}</button></form></div>{state === "error" ? <p className="mt-3 text-sm text-rose-700">{message}</p> : null}</section>;
}
