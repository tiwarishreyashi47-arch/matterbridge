import Link from "next/link";
import LiveOpinionReview from "@/components/matter/LiveOpinionReview";
import { getMatter } from "@/lib/data/matter-service";
import type { CounselOpinionReviewPoint, CounselOpinionSection } from "@/lib/types/matter";

type OpinionReviewPageProps = {
  params: Promise<{ matterId: string }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function severityClassName(value: string) {
  if (value === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (value === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function SourceList({
  label: sourceLabel,
  ids,
}: {
  label: string;
  ids?: string[];
}) {
  if (!ids?.length) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {sourceLabel}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ids.map((_, index) => (
          <span
            key={`${sourceLabel}-${index}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
          >
            Referenced source {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
}

function OpinionSection({ section }: { section: CounselOpinionSection }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-[#263c68]">Counsel advice</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">
            {section.section_title}
          </h3>
        </div>
        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {label(section.section_type)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{section.section_summary}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <SourceList label="Counsel source" ids={section.source_document_ids} />
        <SourceList label="Source sections" ids={section.source_section_ids} />
      </div>
    </article>
  );
}

function ReviewPoint({ point }: { point: CounselOpinionReviewPoint }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-[#263c68]">Review point</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">
            {point.review_title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className={"rounded-full border px-3 py-1 " + severityClassName(point.severity)}>
            {label(point.severity)} severity
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
            {label(point.review_type)}
          </span>
        </div>
      </div>

      {point.counsel_position || point.counsel_assertion ? (
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Counsel position
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {point.counsel_position ?? point.counsel_assertion}
          </p>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          MatterBridge review
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{point.matterbridge_review}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recommended action
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {label(point.recommended_action)}
          </p>
        </div>
        {point.suggested_question ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Suggested question
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{point.suggested_question}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <SourceList label="Counsel references" ids={point.counsel_source_ids} />
        <SourceList label="Company evidence / precedent" ids={point.company_source_ids} />
      </div>
      <SourceList label="Company source sections" ids={point.company_source_section_ids} />
    </article>
  );
}

export default async function OpinionReviewPage({ params }: OpinionReviewPageProps) {
  const { matterId } = await params;
  const matterData = await getMatter(matterId);

  if (!matterData) {
    return <main className="min-h-screen bg-slate-50 p-10 text-slate-950">Matter not found.</main>;
  }

  const engagement = matterData.counsel_engagements?.[0];
  const output = engagement?.outputs?.[0];
  const sections = output?.opinion_sections ?? [];
  const reviewPoints = output?.review_points ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to matter
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">{matterData.matter.matter_id} / Counsel Opinion Review</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Review external counsel advice
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Compare counsel&apos;s position with company evidence and historical precedent. MatterBridge surfaces differences for Internal Legal review; it does not replace legal judgment.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">{label(output?.output_status)}</p>
              <p className="mt-1">Opinion date: {output?.output_date ?? "Not recorded"}</p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-6">
            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Counsel engagement</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                {engagement?.counsel?.firm_name ?? "External counsel"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {engagement?.counsel?.counsel_name ?? "Counsel not recorded"}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{engagement?.engagement_description}</p>
            </section>

            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Counsel summary</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {output?.opinion_summary ?? "No substantive counsel opinion is recorded."}
              </p>
            </section>
          </aside>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-blue-700">Review findings</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Differences requiring legal attention
                </h2>
              </div>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {reviewPoints.length} review points
              </span>
            </div>
            <div className="mt-4 grid gap-4">
              {reviewPoints.map((point) => (
                <ReviewPoint key={point.review_point_id} point={point} />
              ))}
            </div>
          </section>
        </section>

        <section className="mt-10">
          <p className="eyebrow text-blue-700">Counsel advice</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Opinion sections
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <OpinionSection key={section.opinion_section_id} section={section} />
            ))}
          </div>
        </section>

        <LiveOpinionReview matterId={matterId} />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/matters/${matterId}/legal-decision`} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Continue to Legal Decision →
          </Link>
          <Link href={`/matters/${matterId}/institutional-memory`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">
            View Institutional Memory
          </Link>
        </div>
      </div>
    </main>
  );
}
