import Link from "next/link";
import type { MatterGraph as MatterGraphData } from "@/lib/data/graph-service";

function label(value?: string) {
  return value?.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()) ?? "Not configured";
}

function statusTone(status?: string) {
  if (["CLOSED", "COMPLETED", "ARCHIVED"].includes(status?.toUpperCase() ?? "")) return "bg-slate-100 text-slate-600";
  if (status?.toUpperCase() === "OPEN") return "bg-emerald-50 text-emerald-700";
  return "bg-amber-50 text-amber-700";
}

const branches = [
  ["Open issues", "openItemCount"],
  ["External counsel", "counselQuestionCount"],
  ["Internal strategy", "decisionCount"],
  ["Actions", "actionCount"],
  ["Documents", "documentCount"],
] as const;

export default function MatterGraph({ graph }: { graph: MatterGraphData }) {
  const matters = graph.nodes.filter((node) => node.kind === "matter");

  return (
    <section className="surface-card mt-8 overflow-hidden rounded-2xl border border-[#d9dee8] bg-[#f8fafc]">
      <div className="border-b border-[#d9dee8] bg-white px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow text-[#263c68]">Legal department bird&apos;s-eye view</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Matter Context Graph</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">A visual map of what each matter needs next. Open a matter for evidence, counsel detail, review, and internal strategy.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">{matters.length} matter{matters.length === 1 ? "" : "s"} in view</div>
        </div>
      </div>

      <div className="grid gap-3 border-b border-[#d9dee8] bg-[#fbfcfe] px-5 py-5 sm:grid-cols-3 sm:px-8">
        <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Practice areas</p><p className="mt-1 text-lg font-semibold text-slate-950">{graph.nodes.filter((node) => node.kind === "practice_area").length}</p></div>
        <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Context entities</p><p className="mt-1 text-lg font-semibold text-slate-950">{graph.nodes.filter((node) => node.kind === "entity").length}</p></div>
        <div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Matter relationships</p><p className="mt-1 text-lg font-semibold text-slate-950">{graph.edges.filter((edge) => edge.id.startsWith("matter-link:")).length}</p></div>
      </div>

      {matters.length ? <div className="space-y-5 p-5 sm:p-8">
        <div className="hidden items-center gap-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:flex"><span className="w-[27%]">Matter</span><span className="flex-1">Context branches</span></div>
        {matters.map((matter) => <div key={matter.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Link href={matter.href ?? "#"} className="group min-w-0 md:w-[27%]">
              <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs text-slate-500">{matter.id}</span><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${statusTone(matter.matterStatus)}`}>{label(matter.matterStatus)}</span></div>
              <p className="mt-2 text-base font-semibold leading-6 text-slate-950 group-hover:text-[#263c68]">{matter.label}</p>
              <p className="mt-1 text-xs text-slate-500">{matter.risk ? `${label(matter.risk)} risk` : "Risk not assessed"} · Open matter workspace →</p>
            </Link>
            <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-5">
              {branches.map(([branch, key]) => { const count = matter[key]; return <div key={branch} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{branch}</p><p className="mt-1 text-xl font-semibold text-slate-950">{count ?? 0}</p></div>; })}
            </div>
          </div>
        </div>)}
      </div> : <div className="p-8 sm:p-12"><div className="mx-auto max-w-xl rounded-2xl border border-dashed border-[#b9c4d5] bg-white px-6 py-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e8eef8] text-xl text-[#263c68]">✦</div><h3 className="mt-4 text-lg font-semibold text-slate-950">Your matter brain is ready for its first matter</h3><p className="mt-2 text-sm leading-6 text-slate-600">Create a clean matter below. It will appear here as the first branch in the department context graph once it is created.</p></div></div>}
    </section>
  );
}
