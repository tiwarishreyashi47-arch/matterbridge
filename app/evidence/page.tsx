import DocumentLibrary, {
  type DocumentLibraryItem,
} from "@/components/matter/DocumentLibrary";
import DocumentIntakePanel from "@/components/matter/DocumentIntakePanel";
import { getAllMatters } from "@/lib/data/matter-service";
import { redirect } from "next/navigation";

type EvidencePageProps = {
  searchParams: Promise<{
    matterId?: string;
    workstreamId?: string;
  }>;
};

export default async function EvidencePage({ searchParams }: EvidencePageProps) {
  const { matterId, workstreamId } = await searchParams;
  const matterForRedirect = matterId ?? (await getAllMatters())[0]?.matter.matter_id;
  if (matterForRedirect) {
    redirect(`/matters/${matterForRedirect}/documents`);
  }
  const items: DocumentLibraryItem[] = (await getAllMatters()).flatMap((matterData) => [
    ...(matterData.documents ?? []).filter((document) => !document.workstream_id).map((document) => ({
      matterId: matterData.matter.matter_id,
      matterTitle: matterData.matter.matter_title,
      workstreamId: "matter-level",
      workstreamName: "Matter-level core document",
      document,
    })),
    ...matterData.workstreams.flatMap((workstream) =>
      (workstream.documents ?? []).map((document) => ({
        matterId: matterData.matter.matter_id,
        matterTitle: matterData.matter.matter_title,
        workstreamId: workstream.workstream_id,
        workstreamName: workstream.workstream_name,
        document,
      }))
    ),
  ]);

  return (
    <main className="min-h-screen text-slate-950">
      <div className="page-frame">
        <header className="surface-card rounded-lg p-7">
          <p className="eyebrow text-[#263c68]">
            Documentary Evidence
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Matter document library
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Browse the complete document set associated with each matter. Issue
            evidence remains scoped to the relevant issue inside its workstream.
          </p>
        </header>

        <DocumentIntakePanel matterId={matterId} />

        <DocumentLibrary
          items={items}
          initialMatterId={matterId ?? "all"}
          initialWorkstreamId={
            matterId && workstreamId ? matterId + ":" + workstreamId : "all"
          }
        />
      </div>
    </main>
  );
}
