import Link from "next/link";
import MatterWorkspaceNav from "@/components/matter/MatterWorkspaceNav";
import { getMatter } from "@/lib/data/matter-service";

function label(value?: string | null) { return value?.replaceAll("_", " ") ?? "Not recorded"; }

export default async function MatterWorkstreamsPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const matterData = await getMatter(matterId);
  if (!matterData) return <main className="page-frame">Matter not found.</main>;
  const resolvedStatuses = new Set(["RESOLVED", "CLOSED", "COMPLETED"]);
  return <main className="min-h-screen text-slate-950"><div className="page-frame"><Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-[#263c68]">Back to matter</Link><header className="surface-card mt-5 rounded-xl p-7"><p className="eyebrow text-[#263c68]">{matterData.matter.matter_title}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Stages</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Template-proposed phases of work. Lawyers can focus on the open items that need resolution within each stage.</p></header><MatterWorkspaceNav matterId={matterId} active="stages" /><section className="mt-7 grid gap-4 lg:grid-cols-2">{matterData.workstreams.map((workstream) => { const open = (workstream.issues ?? []).filter((issue) => !resolvedStatuses.has(issue.issue_status ?? "")).length; const resolved = (workstream.issues ?? []).length - open; return <Link key={workstream.workstream_id} href={`/matters/${matterId}/workstreams/${workstream.workstream_id}`} className="surface-card group rounded-xl p-5 hover:border-blue-300"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow text-[#263c68]">Matter stage</p><h2 className="mt-2 text-xl font-semibold group-hover:text-[#263c68]">{workstream.workstream_name}</h2></div><span className="status-pill">{label(workstream.workstream_status)}</span></div><p className="mt-3 text-sm leading-6 text-slate-600">{workstream.workstream_description}</p><div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center text-xs"><span><strong className="block text-lg text-slate-900">{open}</strong>Open items</span><span><strong className="block text-lg text-slate-900">{resolved}</strong>Resolved</span><span><strong className="block text-lg text-slate-900">{workstream.documents?.length ?? 0}</strong>Documents</span></div></Link>; })}</section></div></main>;
}
