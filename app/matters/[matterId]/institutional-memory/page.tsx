import Link from "next/link";
import { getMatter } from "@/lib/data/matter-service";
import type { HistoricalMatter, InstitutionalKnowledgeItem } from "@/lib/types/matter";

type InstitutionalMemoryPageProps = {
  params: Promise<{ matterId: string }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function HistoricalCard({ precedent }: { precedent: HistoricalMatter }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{precedent.historical_matter_id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{precedent.matter_reference}</h3>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{label(precedent.outcome)}</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div><p className="text-xs text-slate-400">Matter type</p><p className="mt-1 font-medium text-slate-800">{label(precedent.matter_type)}</p></div>
        <div><p className="text-xs text-slate-400">Timeline</p><p className="mt-1 font-medium text-slate-800">{precedent.timeline_months ?? "Not recorded"} months</p></div>
        <div><p className="text-xs text-slate-400">Result</p><p className="mt-1 font-medium text-slate-800">{precedent.recovery_percentage != null ? `${precedent.recovery_percentage}% recovery` : "Not recorded"}</p></div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{precedent.lessons_learned}</p>
    </article>
  );
}

function KnowledgeCard({ item }: { item: InstitutionalKnowledgeItem }) {
  return (
    <article className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-blue-700">{item.knowledge_item_id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{item.knowledge_item_title}</h3>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">Reusable knowledge</span>
      </div>
      {item.context ? <p className="mt-4 text-sm leading-6 text-slate-700">{item.context}</p> : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Lesson</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.lesson}</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Use when</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.use_when}</p></div>
      </div>
      <p className="mt-4 border-t border-blue-100 pt-4 text-sm leading-6 text-slate-700"><span className="font-semibold">MAT-001 application:</span> {item.matter_application}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(item.relevant_historical_matter_ids ?? []).map((id) => <span key={id} className="rounded-full bg-white px-3 py-1 font-mono text-xs text-slate-600">{id}</span>)}
        {(item.source_ids ?? []).map((id) => <span key={id} className="rounded-full bg-blue-100 px-3 py-1 font-mono text-xs text-blue-800">{id}</span>)}
      </div>
    </article>
  );
}

export default async function InstitutionalMemoryPage({ params }: InstitutionalMemoryPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return <main className="min-h-screen bg-slate-50 p-10 text-slate-950">Matter not found.</main>;
  }

  const memory = matterData.institutional_memory;
  const precedents = matterData.historical_precedents ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-blue-700">Back to matter</Link>
        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">{matterData.matter.matter_id} / Institutional Memory</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Precedent and reusable knowledge</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Use prior matters and the current counsel-to-decision trail to answer: have we dealt with something like this before?</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Current outcome: {label(memory?.outcome_status)}</span>
          </div>
        </header>

        <section className="mt-8">
          <p className="eyebrow text-blue-700">MAT-001 knowledge</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Reusable lessons from this matter</h2>
          <div className="mt-4 grid gap-4">{(memory?.knowledge_items ?? []).map((item) => <KnowledgeCard key={item.knowledge_item_id} item={item} />)}</div>
        </section>

        <section className="mt-10">
          <p className="eyebrow text-blue-700">Existing company precedents</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Relevant historical matters</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">These records are reused from the existing historical-matters dataset. Their facts and outcomes have not been altered to create a match.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">{precedents.map((precedent) => <HistoricalCard key={precedent.historical_matter_id} precedent={precedent} />)}</div>
        </section>

        <section className="surface-card mt-10 rounded-xl p-6">
          <p className="eyebrow">Future outcome record</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Outcome remains open</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Final recovery route, enforcement result, settlement, cost, duration, and strategy effectiveness remain unknown and are intentionally not synthesized.</p>
          <div className="mt-4 flex flex-wrap gap-2">{Object.entries(memory?.future_outcome_fields ?? {}).map(([key, value]) => <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{label(key)}: {value ?? "Open"}</span>)}</div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/matters/${matterId}/opinion-review`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">Back to Opinion Review</Link>
          <Link href={`/matters/${matterId}/legal-decision`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">Open Legal Decision</Link>
        </div>
      </div>
    </main>
  );
}
