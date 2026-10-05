import Link from "next/link";
import MatterGraph from "@/components/matter/MatterGraph";
import AutomationRunbook from "@/components/matter/AutomationRunbook";
import { buildMatterGraph } from "@/lib/data/graph-service";
import { getAllMatters } from "@/lib/data/matter-service";

export const dynamic = "force-dynamic";

export default async function MatterNetworkPage() {
  const matters = await getAllMatters();
  return <main className="min-h-screen text-[#20252d]"><div className="page-frame"><Link href="/" className="text-sm font-semibold text-slate-500 hover:text-[#263c68]">Back to matters</Link><header className="surface-card mt-5 rounded-xl p-7"><p className="eyebrow text-[#263c68]">Department context</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Matter Network</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">A bird&apos;s-eye view of how matters, issues, counsel, actions, and documents relate. Select a matter when you need the detailed workspace.</p></header><AutomationRunbook matters={matters} /><MatterGraph graph={buildMatterGraph(matters)} /></div></main>;
}
