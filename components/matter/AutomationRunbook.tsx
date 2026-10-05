import Link from "next/link";
import type { MatterBundle } from "@/lib/types/matter";

type Step = { label: string; state: "complete" | "active" | "waiting" };

function stepsForMatter(matter: MatterBundle): Step[] {
  const documents = [...(matter.documents ?? []), ...matter.workstreams.flatMap((workstream) => workstream.documents ?? [])];
  const hasCounselQuestion = matter.counsel_engagements?.some((engagement) => engagement.briefs?.some((brief) => brief.questions?.length)) ?? false;
  const hasAdvice = matter.counsel_engagements?.some((engagement) => engagement.outputs?.some((output) => output.output_status === "RECEIVED")) ?? false;
  return [
    { label: "Capture documents", state: documents.length ? "complete" : "waiting" },
    { label: "Extract and cite", state: documents.length ? "complete" : "waiting" },
    { label: "Queue open items", state: matter.issues?.length ? "complete" : "waiting" },
    { label: "Refer to counsel", state: hasCounselQuestion ? "complete" : matter.issues?.length ? "active" : "waiting" },
    { label: "Feed internal strategy", state: hasAdvice || (matter.decisions?.length ?? 0) > 0 ? "complete" : "active" },
  ];
}

function tone(state: Step["state"]) {
  if (state === "complete") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (state === "active") return "border-blue-200 bg-blue-50 text-blue-800";
  return "border-slate-200 bg-slate-50 text-slate-500";
}

export default function AutomationRunbook({ matters }: { matters: MatterBundle[] }) {
  return <section className="surface-card mt-8 rounded-2xl border border-[#d9dee8] bg-white p-6 sm:p-8">
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="eyebrow text-[#263c68]">Workflow automation</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Company Brain operating loop</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Every matter follows the same visible path: documents become cited knowledge, knowledge becomes an open-item queue, and counsel communication feeds the internal strategy record.</p></div>
      <Link href="/legal-counsel" className="text-sm font-semibold text-[#263c68]">Query the Company Brain →</Link>
    </div>
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      {matters.map((matter) => <article key={matter.matter.matter_id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-xs text-slate-500">{matter.matter.matter_id}</p><h3 className="mt-1 font-semibold text-slate-950">{matter.matter.matter_title}</h3></div><Link href={`/matters/${matter.matter.matter_id}`} className="text-xs font-semibold text-[#263c68]">Open →</Link></div>
        <ol className="mt-4 grid gap-2 sm:grid-cols-5">
          {stepsForMatter(matter).map((step, index) => <li key={step.label} className={`rounded-lg border px-3 py-3 ${tone(step.state)}`}><p className="text-[10px] font-bold uppercase tracking-wide">0{index + 1}</p><p className="mt-1 text-xs font-semibold leading-4">{step.label}</p><p className="mt-1 text-[10px] uppercase tracking-wide opacity-70">{step.state}</p></li>)}
        </ol>
      </article>)}
    </div>
  </section>;
}
