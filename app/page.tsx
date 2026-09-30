import MatterStatusTabs from "@/components/matter/MatterStatusTabs";
import MatterGraph from "@/components/matter/MatterGraph";
import { getAllMatters } from "@/lib/data/matter-service";
import { buildMatterGraph } from "@/lib/data/graph-service";
import NewMatterPanel from "@/components/matter/NewMatterPanel";

export const dynamic = "force-dynamic";

export default async function Home() {
  const matters = await getAllMatters();
  const closedStatuses = new Set(["CLOSED", "COMPLETED", "ARCHIVED"]);
  const openMatters = matters.filter(
    (matterData) => !closedStatuses.has(matterData.matter.matter_status)
  );
  const closedMatters = matters.filter((matterData) =>
    closedStatuses.has(matterData.matter.matter_status)
  );

  return (
    <main className="min-h-screen text-[#20252d]">
      <div className="page-frame">
        <header className="border-b border-[#dcdcd6] pb-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-[#263c68]">Workspace / Matters</p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Matters
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                Your active legal matters, evidence, decisions, and counsel intelligence in one working view.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-md border border-[#dfdfda] bg-[#fffefa] px-5 py-3">
                <p className="text-xs font-medium text-slate-500">Open matters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{openMatters.length}</p>
              </div>
              <div className="rounded-md border border-[#dfdfda] bg-[#fffefa] px-5 py-3">
                <p className="text-xs font-medium text-slate-500">Closed matters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{closedMatters.length}</p>
              </div>
            </div>
          </div>
        </header>

        <MatterGraph graph={buildMatterGraph(matters)} />
        <NewMatterPanel />
        <MatterStatusTabs openMatters={openMatters} closedMatters={closedMatters} />
      </div>
    </main>
  );
}
