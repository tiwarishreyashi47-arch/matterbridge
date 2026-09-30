import type { Assertion } from "@/lib/types/matter";
import { currentFacts } from "@/lib/data/current-facts";

function humanize(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

export default function CurrentFactsPanel({ assertions }: { assertions: Assertion[] }) {
  const facts = currentFacts(assertions);
  return <section className="rounded-lg border border-blue-100 bg-blue-50/60 p-5"><div className="flex items-end justify-between gap-3"><div><p className="eyebrow text-blue-700">Current facts</p><h2 className="mt-1 text-xl font-semibold text-slate-950">Matter facts</h2></div><span className="text-xs font-semibold text-blue-700">{facts.length} current</span></div>{facts.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{facts.map((fact) => <div key={fact.assertion_id} className="rounded-lg border border-blue-100 bg-white p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-900">{humanize(fact.attribute)}</p><span className="text-[10px] font-semibold uppercase text-slate-500">{humanize(fact.trust_state)}</span></div><p className="mt-1 text-sm text-slate-600">{typeof fact.value === "object" ? Object.entries(fact.value as Record<string, unknown>).map(([key, value]) => `${humanize(key)}: ${String(value)}`).join(" · ") : String(fact.value)}</p></div>)}</div> : <p className="mt-3 text-sm text-slate-600">No matter facts have been extracted yet.</p>}</section>;
}
