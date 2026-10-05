import Link from "next/link";
import MatterStatusTabs from "@/components/matter/MatterStatusTabs";
import { getAllMatters } from "@/lib/data/matter-service";
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

        <section className="mt-8 grid gap-4 sm:grid-cols-2"><Link href="/matter-network" className="surface-card rounded-xl border border-[#d9dee8] bg-[#f8fafc] p-6 transition hover:border-[#263c68]"><p className="eyebrow text-[#263c68]">Department view</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Matter Network</h2><p className="mt-2 text-sm leading-6 text-slate-600">Open the context graph for a bird&apos;s-eye view of matters, issues, counsel, actions, and documents.</p><span className="mt-4 inline-flex text-sm font-semibold text-[#263c68]">Open context graph →</span></Link><Link href="/legal-counsel" className="surface-card rounded-xl border border-[#d9dee8] bg-[#f8fafc] p-6 transition hover:border-[#263c68]"><p className="eyebrow text-[#263c68]">Conversational workspace</p><h2 className="mt-2 text-xl font-semibold text-slate-950">Legal Counsel</h2><p className="mt-2 text-sm leading-6 text-slate-600">Ask questions across matters and follow links back to the underlying records.</p><span className="mt-4 inline-flex text-sm font-semibold text-[#263c68]">Open Legal Counsel →</span></Link></section>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d9dee8] bg-white p-5">
          <div><p className="eyebrow text-[#263c68]">Team layer</p><h2 className="mt-1 text-lg font-semibold">Your legal workspace</h2><p className="mt-1 text-sm text-slate-600">View assigned matters and manage team access.</p></div>
          <Link href="/workspace" className="rounded-md bg-[#263c68] px-4 py-2.5 text-sm font-semibold text-white">Open workspace →</Link>
        </div>
        <NewMatterPanel />
        <MatterStatusTabs openMatters={openMatters} closedMatters={closedMatters} />
      </div>
    </main>
  );
}
