import Link from "next/link";
import type {
  CounselEngagement,
  Decision,
  TimelineEvent,
  Workstream,
} from "@/lib/types/matter";

type MatterActivityPanelsProps = {
  timeline: TimelineEvent[];
  engagements: CounselEngagement[];
  decisions: Decision[];
  workstreams: Workstream[];
  matterId: string;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function workstreamName(
  workstreams: Workstream[],
  workstreamId?: string | null
) {
  return (
    workstreams.find((workstream) => workstream.workstream_id === workstreamId)
      ?.workstream_name ?? "Matter-level"
  );
}

function statusClassName(value?: string) {
  if (value === "PENDING" || value === "IN_PROGRESS" || value === "DRAFT") {
    return "bg-amber-50 text-amber-800";
  }

  if (value === "APPROVED" || value === "ISSUED" || value === "ENGAGED") {
    return "bg-emerald-50 text-emerald-800";
  }

  return "bg-slate-100 text-slate-700";
}

export default function MatterActivityPanels({
  timeline,
  engagements,
  decisions,
  workstreams,
  matterId,
}: MatterActivityPanelsProps) {
  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-2">
      <details className="surface-card group rounded-xl overflow-hidden">
        <summary className="cursor-pointer list-none p-5 text-base font-semibold text-slate-950 transition hover:bg-slate-50">
          <span className="flex items-center justify-between gap-4">
            Matter Timeline
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              {timeline.length} events <span className="text-lg text-slate-400 group-open:rotate-180">⌄</span>
            </span>
          </span>
        </summary>

        <div className="border-t border-slate-100 p-5">
          <div className="space-y-3">
            {[...timeline]
              .sort((a, b) => a.event_date.localeCompare(b.event_date))
              .map((event) => (
                <article
                  key={event.timeline_id}
                  className="grid gap-2 rounded-lg bg-slate-50 p-4 sm:grid-cols-[7rem_1fr]"
                >
                  <p className="font-mono text-xs text-slate-500">
                    {event.event_date}
                  </p>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">
                        {event.event_title}
                      </h3>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
                        {workstreamName(workstreams, event.workstream_id)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {event.event_description}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </details>

      <details className="surface-card group rounded-xl overflow-hidden">
        <summary className="cursor-pointer list-none p-5 text-base font-semibold text-slate-950 transition hover:bg-slate-50">
          <span className="flex items-center justify-between gap-4">
            Counsel &amp; Decisions
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              {engagements.length} engagements <span className="text-lg text-slate-400 group-open:rotate-180">⌄</span>
            </span>
          </span>
        </summary>

        <div className="space-y-4 border-t border-slate-100 p-5">
          {engagements.map((engagement) => {
            const questions =
              engagement.briefs?.flatMap((brief) => brief.questions ?? []) ?? [];
            const outputs = engagement.outputs ?? [];
            const openItems = [
              ...(outputs.length === 0 && engagement.engagement_status === "PENDING"
                ? [
                    {
                      id: engagement.engagement_id,
                      title: "Engagement awaiting next step",
                      detail: engagement.engagement_description,
                      status: engagement.engagement_status,
                    },
                  ]
                : []),
              ...outputs
                .filter((output) => output.output_status !== "RECEIVED")
                .map((output) => ({
                  id: output.output_id,
                  title: label(output.output_type),
                  detail: "Counsel deliverable has not been received.",
                  status: output.output_status,
                })),
            ];

            return (
              <article
                key={engagement.engagement_id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="eyebrow text-[#263c68]">External counsel engagement</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-950">
                      {engagement.counsel?.firm_name ??
                        engagement.counsel?.counsel_name ??
                        "External counsel"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {engagement.counsel?.counsel_name ?? "Counsel not recorded"}
                      {engagement.counsel?.email
                        ? ` · ${engagement.counsel.email}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                      engagement.engagement_status
                    )}`}
                  >
                    {label(engagement.engagement_status)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {engagement.engagement_description}
                </p>

                <div className="mt-4 grid gap-3">
                  <details className="rounded-lg bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                      Queries ({questions.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {questions.map((question) => (
                        <div key={question.question_id} className="rounded-lg bg-white p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="eyebrow text-[#263c68]">Counsel question</span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              {label(question.question_priority)}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              Matter-level · status not recorded
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {question.question_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>

                  <details className="rounded-lg bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                      Deliverables ({outputs.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {outputs.length > 0 ? (
                        outputs.map((output) => (
                          <div key={output.output_id} className="rounded-lg bg-white p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="eyebrow text-[#263c68]">Counsel deliverable</span>
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassName(
                                  output.output_status
                                )}`}
                              >
                                {label(output.output_status)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-700">
                              {label(output.output_type)} · workstream not recorded
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">
                          No counsel deliverable is recorded yet.
                        </p>
                      )}
                    </div>
                  </details>

                  <details className="rounded-lg bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                      Open Items ({openItems.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {openItems.length > 0 ? (
                        openItems.map((item) => (
                          <div key={item.id} className="rounded-lg bg-white p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </p>
                              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                                {label(item.status)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {item.detail}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">No open items recorded.</p>
                      )}
                    </div>
                  </details>
                </div>
              </article>
            );
          })}

          <details className="rounded-lg bg-slate-50 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Decisions ({decisions.length})
            </summary>
            <div className="mt-3 space-y-2">
              {decisions.map((decision) => (
                <div key={decision.decision_id} className="rounded-lg bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      {decision.decision_id}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                      {label(decision.decision_status)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {workstreamName(workstreams, decision.workstream_id)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {decision.decision_title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {decision.decision_summary}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <Link
            href={`/matters/${matterId}/counsel-brief`}
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Open the full Counsel Brief →
          </Link>
          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <Link
              href={`/matters/${matterId}/opinion-review`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Review Counsel Opinion →
            </Link>
            <Link
              href={`/matters/${matterId}/legal-decision`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Legal Decision →
            </Link>
            <Link
              href={`/matters/${matterId}/institutional-memory`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View Institutional Memory →
            </Link>
          </div>
        </div>
      </details>
    </section>
  );
}
