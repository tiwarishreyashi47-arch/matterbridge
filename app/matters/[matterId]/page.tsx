import Link from "next/link";
import MatterOverview from "@/components/matter/MatterOverview";
import MatterWorkspaceNav from "@/components/matter/MatterWorkspaceNav";
import { getMatterKnowledge } from "@/lib/data/knowledge-service";

type MatterPageProps = { params: Promise<{ matterId: string }> };

export default async function MatterPage({ params }: MatterPageProps) {
  const { matterId } = await params;
  const knowledge = await getMatterKnowledge(matterId);
  if (!knowledge) return <main className="page-frame text-slate-950"><p>Matter not found.</p></main>;
  return <main className="min-h-screen text-slate-950"><div className="page-frame">
    <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-blue-700">Back to matters</Link>
    <header className="surface-card mt-5 rounded-xl p-7"><div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between"><div><p className="eyebrow text-[#263c68]">{knowledge.matterId} / {knowledge.context.matterType ?? "Matter"}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{knowledge.context.title}</h1></div><div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm"><p className="text-xs text-slate-500">Matter status</p><p className="mt-1 font-semibold text-slate-900">{knowledge.metadata.status.replaceAll("_", " ")}</p></div></div></header>
    <MatterWorkspaceNav matterId={matterId} active="overview" />
    <MatterOverview knowledge={knowledge} />
  </div></main>;
}
