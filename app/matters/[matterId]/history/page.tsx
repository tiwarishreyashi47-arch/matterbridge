import Link from "next/link";
import MatterWorkspaceNav from "@/components/matter/MatterWorkspaceNav";
import { getMatterKnowledge } from "@/lib/data/knowledge-service";

function label(value: string) { return value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()); }

export default async function MatterHistoryPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const knowledge = await getMatterKnowledge(matterId);
  if (!knowledge) return <main className="page-frame">Matter not found.</main>;
  return <main className="min-h-screen text-slate-950"><div className="page-frame"><Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-[#263c68]">Back to matter</Link><header className="surface-card mt-5 rounded-xl p-7"><p className="eyebrow text-[#263c68]">{knowledge.context.title}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Historical updates on the matter</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">A chronological record of matter events, reviews, advice, and internal strategy updates.</p></header><MatterWorkspaceNav matterId={matterId} active="history" /><section className="surface-card mt-7 rounded-xl p-6"><div className="space-y-5">{knowledge.history.map((event) => <article key={event.id} className="relative border-l-2 border-slate-200 pl-5"><div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-[#263c68]" /><p className="text-xs text-slate-500">{event.occurredAt ?? "Date not recorded"}</p><h2 className="mt-1 text-sm font-semibold text-slate-900">{event.summary ?? label(event.eventType)}</h2><p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{label(event.eventType)}</p></article>)}{!knowledge.history.length ? <p className="text-sm text-slate-600">No historical updates have been recorded for this matter.</p> : null}</div></section></div></main>;
}
