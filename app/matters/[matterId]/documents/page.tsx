import Link from "next/link";
import DocumentLibrary, { type DocumentLibraryItem } from "@/components/matter/DocumentLibrary";
import DocumentUploadWorkflow from "@/components/matter/DocumentUploadWorkflow";
import ReviewWorkspace from "@/components/matter/ReviewWorkspace";
import MatterWorkspaceNav from "@/components/matter/MatterWorkspaceNav";
import { getMatter } from "@/lib/data/matter-service";

export const dynamic = "force-dynamic";

export default async function MatterDocumentsPage({ params }: { params: Promise<{ matterId: string }> }) {
  const { matterId } = await params;
  const matterData = await getMatter(matterId);
  if (!matterData) return <main className="page-frame">Matter not found.</main>;
  const items: DocumentLibraryItem[] = [
    ...(matterData.documents ?? []).filter((document) => !document.workstream_id).map((document) => ({
      matterId, matterTitle: matterData.matter.matter_title, workstreamId: "matter-level", workstreamName: "Matter-level document", document,
    })),
    ...matterData.workstreams.flatMap((workstream) => (workstream.documents ?? []).map((document) => ({
      matterId, matterTitle: matterData.matter.matter_title, workstreamId: workstream.workstream_id, workstreamName: workstream.workstream_name, document,
    }))),
  ];
  return (
    <main className="min-h-screen text-slate-950"><div className="page-frame">
      <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-[#263c68]">Back to matter</Link>
      <header className="surface-card mt-5 rounded-xl p-7"><p className="eyebrow text-[#263c68]">{matterData.matter.matter_title}</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Documents</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">The complete document record for this matter. Core documents and workstream-specific evidence remain together in one library.</p></header>
      <MatterWorkspaceNav matterId={matterId} active="documents" />
      <section className="surface-card mt-6 rounded-xl p-5"><p className="eyebrow text-[#263c68]">Matter-level intake</p><h2 className="mt-1 text-lg font-semibold">Upload a core document</h2><p className="mt-1 mb-4 text-sm text-slate-600">Use this for agreements and other documents belonging to the matter as a whole.</p><DocumentUploadWorkflow matterId={matterId} /></section>
      <section id="review" className="mt-8 scroll-mt-6"><div className="mb-4"><p className="eyebrow text-[#263c68]">Review</p><h2 className="mt-1 text-2xl font-semibold">Extracted facts and documentary support</h2><p className="mt-1 text-sm text-slate-600">Review proposed facts in the same place as the documents that support them.</p></div><ReviewWorkspace matterData={matterData} /></section>
      <section className="mt-8"><div className="mb-4"><p className="eyebrow text-[#263c68]">Documentary evidence</p><h2 className="mt-1 text-2xl font-semibold">Documents in this matter</h2><p className="mt-1 text-sm text-slate-600">Chronological document record with filters for matter area, type, source, and status.</p></div><DocumentLibrary items={items} initialMatterId={matterId} allowUpload={false} /></section>
    </div></main>
  );
}
