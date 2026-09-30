import Link from "next/link";
import DecisionWorkspace from "@/components/matter/DecisionWorkspace";
import { getMatter } from "@/lib/data/matter-service";
import type { Decision } from "@/lib/types/matter";

type LegalDecisionPageProps = {
  params: Promise<{ matterId: string }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function DecisionList({ decision }: { decision: Decision }) {
  return (
    <div className="space-y-3">
      {(decision.selected_actions ?? []).map((action) => (
        <div key={action} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {action}
        </div>
      ))}
    </div>
  );
}

export default async function LegalDecisionPage({ params }: LegalDecisionPageProps) {
  const { matterId } = await params;
  const matterData = await getMatter(matterId);

  if (!matterData) {
    return <main className="min-h-screen bg-slate-50 p-10 text-slate-950">Matter not found.</main>;
  }

  const decision = matterData.decisions?.[0];

  if (!decision) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-blue-700">Back to matter</Link>
        <p className="mt-6">No legal decision is recorded for this matter.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to matter
        </Link>
        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">{matterData.matter.matter_id} / Legal Decision</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{decision.decision_title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{decision.decision_summary}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">{label(decision.decision_status)}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{decision.decision_date}</span>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Selected action</p>
              <div className="mt-4"><DecisionList decision={decision} /></div>
            </section>

            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Alternatives considered</p>
              <div className="mt-4 space-y-3">
                {(decision.alternatives_considered ?? []).map((alternative) => (
                  <article key={alternative.alternative} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">{alternative.alternative}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{label(alternative.decision)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{alternative.reason}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Follow-up actions</p>
              <div className="mt-4 space-y-3">
                {(decision.follow_up_actions ?? []).map((action) => (
                  <article key={action.action_id} className="rounded-lg bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">{action.action}</h3>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{label(action.status)}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Owner: {action.owner}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Decision factors</p>
              <dl className="mt-4 space-y-4 text-sm">
                {Object.entries(decision.decision_factors ?? {}).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label(key)}</dt>
                    <dd className="mt-1 leading-6 text-slate-700">{value ?? "Not quantified"}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <DecisionWorkspace decision={decision} />
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/matters/${matterId}/opinion-review`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">Back to Opinion Review</Link>
          <Link href={`/matters/${matterId}/institutional-memory`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">View Institutional Memory</Link>
        </div>
      </div>
    </main>
  );
}
