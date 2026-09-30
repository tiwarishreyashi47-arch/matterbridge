import Link from "next/link";
import { getExternalCounselAccess } from "@/lib/data/access-service";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { getMatter } from "@/lib/data/matter-service";
import type { Document } from "@/lib/types/matter";

type CounselWorkspacePageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function DocumentRow({ document }: { document: Document }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-[#263c68]">Shared document</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-950">
            {document.document_title}
          </h3>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {label(document.document_status)}
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">
        {label(document.document_type)} · {document.document_date ?? "Undated"}
      </p>
    </article>
  );
}

export default async function CounselWorkspacePage({
  params,
}: CounselWorkspacePageProps) {
  const { matterId } = await params;
  const matterData = await getMatter(matterId);

  if (!matterData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>Matter not found.</p>
      </main>
    );
  }

  const access = getExternalCounselAccess(matterData);
  const engagement = matterData.counsel_engagements?.[0];
  const brief = engagement?.briefs?.[0];
  const questions = brief?.questions ?? [];
  const workstream = matterData.workstreams[0];
  const evidence = workstream
    ? buildEvidencePacket(matterData, {
        workstream,
        maxSources: 8,
      }).sources
    : [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/counsel-review"
          className="text-sm font-semibold text-slate-500 hover:text-blue-700"
        >
          Back to counsel review
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow text-blue-700">Scoped external counsel workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {matterData.matter.matter_title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                This is a simulated limited-access view. It contains the matter
                context, scoped questions, and documents prepared for external
                counsel; internal decisions and portfolio information are not shown.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Simulated access</p>
              <p className="mt-1">
                {access
                  ? label(access.access_level) + " · " + (access.user?.user_name ?? "External counsel")
                  : "No external-counsel access record"}
              </p>
            </div>
          </div>
        </header>

        {!access ? (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Workspace not provisioned
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The repository has no external-counsel access record for this
              matter. The prototype will not infer or create one.
            </p>
          </section>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <section className="surface-card rounded-xl p-6">
                <p className="eyebrow">Engagement</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  {engagement?.counsel?.firm_name ?? "External counsel"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {engagement?.counsel?.counsel_name ?? "Counsel contact not recorded"}
                  {engagement?.counsel?.email ? " · " + engagement.counsel.email : ""}
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {engagement?.engagement_description ?? "No engagement scope recorded."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {label(engagement?.engagement_status)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {workstream?.workstream_name ?? "Workstream not recorded"}
                  </span>
                </div>
              </section>

              <section className="surface-card rounded-xl p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">Queries</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">
                      Questions for counsel
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">{questions.length} questions</span>
                </div>
                <div className="mt-4 space-y-3">
                  {questions.map((question) => (
                    <article key={question.question_id} className="rounded-lg bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          {label(question.question_priority)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {question.question_text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="surface-card rounded-xl p-6">
                <p className="eyebrow">Scoped documents</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  Documents shared for this matter
                </h2>
                <div className="mt-4 space-y-3">
                  {(workstream?.documents ?? []).map((document) => (
                    <DocumentRow key={document.document_id} document={document} />
                  ))}
                </div>
              </section>

              <section className="surface-card rounded-xl p-6">
                <p className="eyebrow">Supporting evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Evidence is shown as a scoped reference list for the current
                  workstream, not as an unrestricted internal data view.
                </p>
                <div className="mt-4 space-y-2">
                  {evidence.map((source) => (
                    <div key={source.chunk_id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#263c68]">Source passage</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {source.section_title ?? source.document_title}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
