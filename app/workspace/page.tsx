import Link from "next/link";
import WorkspaceControls from "@/components/workspace/WorkspaceControls";
import { getWorkspaceSnapshot } from "@/lib/data/workspace-service";

export const dynamic = "force-dynamic";

export default async function WorkspacePage() {
  const snapshot = await getWorkspaceSnapshot();
  const { currentUser, visibleMatters, users, matters } = snapshot;
  return <main className="min-h-screen text-slate-950"><div className="page-frame max-w-6xl">
    <header className="surface-card rounded-xl p-7"><p className="eyebrow text-[#263c68]">Personalized legal workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Your legal workspace</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">A working view of matters assigned to the current team member. Managers can assign matters without leaving this view.</p><div className="mt-6"><WorkspaceControls users={users} currentUser={currentUser} matterIds={matters.map((item) => item.matter.matter_id)} canAssign={currentUser?.user_role === "MANAGER"} /></div></header>
    <section className="mt-8 flex items-center justify-between"><div><p className="eyebrow">{currentUser?.user_role === "MANAGER" ? "Team portfolio" : "My portfolio"}</p><h2 className="mt-1 text-2xl font-semibold">{visibleMatters.length} matter{visibleMatters.length === 1 ? "" : "s"} in view</h2></div><Link href="/legal-counsel" className="text-sm font-semibold text-[#263c68]">Ask Legal Counsel →</Link></section>
    <section className="mt-5 grid gap-4 md:grid-cols-2">{visibleMatters.length ? visibleMatters.map((matterData) => <Link key={matterData.matter.matter_id} href={`/matters/${matterData.matter.matter_id}`} className="surface-card rounded-xl p-5 transition hover:border-[#263c68]"><p className="eyebrow">{matterData.matter.matter_id} · {matterData.matter.matter_status.replaceAll("_", " ")}</p><h3 className="mt-2 text-lg font-semibold">{matterData.matter.matter_title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{matterData.matter.matter_description}</p><span className="mt-4 inline-flex text-sm font-semibold text-[#263c68]">Open matter →</span></Link>) : <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-600">No matters are assigned to this team member yet. A manager can assign one above.</div>}</section>
  </div></main>;
}
