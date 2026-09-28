import MatterStatusTabs from "@/components/matter/MatterStatusTabs";
import { getAllMatters } from "@/lib/data/matter-service";

export default function Home() {
  const matters = getAllMatters();
  const closedStatuses = new Set(["CLOSED", "COMPLETED", "ARCHIVED"]);
  const openMatters = matters.filter(
    (matterData) => !closedStatuses.has(matterData.matter.matter_status)
  );
  const closedMatters = matters.filter((matterData) =>
    closedStatuses.has(matterData.matter.matter_status)
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-200 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-blue-700">Legal operations workspace</p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Legal Matter Intelligence
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                A legal operating layer for preserving matter context, evidence,
                counsel advice, internal decisions, and institutional memory.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Open matters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{openMatters.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Closed matters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{closedMatters.length}</p>
              </div>
            </div>
          </div>
        </header>

        <MatterStatusTabs openMatters={openMatters} closedMatters={closedMatters} />
      </div>
    </main>
  );
}
