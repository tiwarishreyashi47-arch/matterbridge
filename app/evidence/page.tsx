import DocumentLibrary, {
  type DocumentLibraryItem,
} from "@/components/matter/DocumentLibrary";
import { getAllMatters } from "@/lib/data/matter-service";

type EvidencePageProps = {
  searchParams: Promise<{
    matterId?: string;
    workstreamId?: string;
  }>;
};

export default async function EvidencePage({ searchParams }: EvidencePageProps) {
  const { matterId, workstreamId } = await searchParams;
  const items: DocumentLibraryItem[] = getAllMatters().flatMap((matterData) =>
    matterData.workstreams.flatMap((workstream) =>
      (workstream.documents ?? []).map((document) => ({
        matterId: matterData.matter.matter_id,
        matterTitle: matterData.matter.matter_title,
        workstreamId: workstream.workstream_id,
        workstreamName: workstream.workstream_name,
        document,
      }))
    )
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="surface-card rounded-xl p-7">
          <p className="eyebrow text-blue-700">
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
