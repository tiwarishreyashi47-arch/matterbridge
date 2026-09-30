"use client";

import { useMemo, useState } from "react";
import { templateCatalog } from "@/lib/templates/catalog";
import { templateExtractionSchema } from "@/lib/templates/output-schema";
import { validateTemplate } from "@/lib/templates/schema";
import type { MatterTypeTemplate } from "@/lib/templates/types";

export default function TemplateConfigurationPanel() {
  const [selectedId, setSelectedId] = useState("recovery");
  const [draft, setDraft] = useState<MatterTypeTemplate>(() => structuredClone(templateCatalog[0]));
  const template = templateCatalog.find((item) => item.template_id === selectedId) ?? templateCatalog[0];
  const validation = useMemo(() => validateTemplate(draft), [draft]);
  const preview = templateExtractionSchema(template, template.document_types[0]?.key ?? "");

  function selectTemplate(id: string) {
    const next = templateCatalog.find((item) => item.template_id === id);
    if (next) { setSelectedId(id); setDraft(structuredClone(next)); }
  }

  return <section className="surface-card mt-6 rounded-lg p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow text-[#263c68]">Matter-type templates</p><h2 className="mt-1 text-2xl font-semibold text-slate-950">Template configuration</h2><p className="mt-1 max-w-2xl text-sm text-slate-600">Shape the stages, fields, and review rules used when a new matter is created.</p></div><select value={selectedId} onChange={(event) => selectTemplate(event.target.value)} className="rounded-md border border-[#d7d7d1] bg-[#fffefa] px-3 py-2 text-sm">{templateCatalog.map((item) => <option key={item.template_id} value={item.template_id}>{item.name} · {item.version}</option>)}</select></div><div className="mt-6 grid gap-5 lg:grid-cols-2"><div className="space-y-4"><label className="block text-sm font-semibold text-slate-800">Template name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value, status: "draft" })} className="mt-1 w-full rounded-md border border-[#d7d7d1] bg-[#fffefa] px-3 py-2 font-normal" /></label><div><p className="text-sm font-semibold text-slate-800">Stages</p><div className="mt-2 space-y-2">{draft.workstreams.map((workstream) => <div key={workstream.key} className="rounded-md bg-[#f7f6f2] p-3 text-sm"><span className="font-semibold">{workstream.name}</span><span className="ml-2 text-slate-500">{workstream.description}</span></div>)}</div></div><div><p className="text-sm font-semibold text-slate-800">Rules</p><div className="mt-2 flex flex-wrap gap-2">{draft.rules.map((rule) => <span key={rule.rule_code} className="rounded-full bg-[#e8ebf1] px-3 py-1 text-xs font-semibold text-[#263c68]">{rule.rule_code.replaceAll("_", " ")}</span>)}</div></div></div><div className="rounded-md border border-[#dfdfda] bg-[#f7f6f2] p-4"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-900">Validation</p><span className={validation.success ? "status-pill bg-emerald-50 text-emerald-700" : "status-pill bg-rose-50 text-rose-700"}>{validation.success ? "Valid draft" : "Needs attention"}</span></div>{validation.success ? <p className="mt-2 text-sm text-slate-600">This template is ready for a future publish action.</p> : <ul className="mt-2 space-y-1 text-xs text-rose-700">{validation.errors.map((error) => <li key={error}>{error}</li>)}</ul>}<p className="mt-5 text-sm font-semibold text-slate-900">Extraction fields</p><div className="mt-2 flex flex-wrap gap-2">{Object.keys(preview).map((field) => <span key={field} className="rounded-full border border-[#d7d7d1] bg-[#fffefa] px-2.5 py-1 text-xs text-slate-700">{field.replaceAll("_", " ")}</span>)}</div><button type="button" disabled={!validation.success} className="mt-5 rounded-md bg-[#263c68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e3156] disabled:opacity-50">Save draft (prototype)</button></div></div></section>;
}
