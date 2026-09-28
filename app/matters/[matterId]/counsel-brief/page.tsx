import Link from "next/link";
import { getMatter } from "@/lib/data/matter-service";
import type {
  AIFinding,
  Document,
  LegalIssue,
  MatterBundle,
} from "@/lib/types/matter";

type CounselBriefPageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Not applicable";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function findingState(finding: AIFinding) {
  if (
    finding.finding_type === "INFORMATION_GAP" ||
    finding.requires_verification === "YES"
  ) {
    return {
      label: "Information Missing",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (
    finding.finding_type === "LEGAL_ISSUE" ||
    finding.requires_legal_judgment === "YES"
  ) {
    return {
      label: "Legal Judgment Required",
      className: "border-sky-200 bg-sky-50 text-sky-800",
    };
  }

  return {
    label: "Supported",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
}

function priorityClassName(priority?: string) {
  if (priority === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (priority === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function getCounselData(matterData: MatterBundle) {
  const engagement = matterData.counsel_engagements?.[0];
  const brief = engagement?.briefs?.[0];
  const questions =
    matterData.counsel_engagements?.flatMap((item) =>
      item.briefs?.flatMap((itemBrief) => itemBrief.questions ?? []) ?? []
    ) ?? [];
  const documents = matterData.workstreams.flatMap(
    (workstream) => workstream.documents ?? []
  );
  const findings = matterData.workstreams.flatMap(
    (workstream) => workstream.findings ?? []
  );
  const issues = matterData.workstreams.flatMap(
    (workstream) => workstream.issues ?? []
  );

  return { engagement, brief, questions, documents, findings, issues };
}

function ContextCard({ matterData }: { matterData: MatterBundle }) {
  const { matter, parties } = matterData;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-slate-500">
            Matter context
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {matter.matter_title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {matter.matter_description}
          </p>
        </div>

        <div className="grid min-w-64 grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Client</p>
            <p className="mt-1 font-medium text-slate-900">
              {parties?.client?.party_name ?? "Not recorded"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Counterparty</p>
            <p className="mt-1 font-medium text-slate-900">
              {parties?.counterparty?.party_name ?? "Not recorded"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Risk</p>
            <p className="mt-1 font-semibold text-rose-700">
              {matter.risk_rating}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Exposure</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatCurrency(matter.outstanding_exposure_inr)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionCard({
  question,
}: {
  question: NonNullable<
    NonNullable<MatterBundle["counsel_engagements"]>[number]["briefs"]
  >[number]["questions"] extends infer Questions
    ? Questions extends Array<infer Question>
      ? Question
      : never
    : never;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {question.question_id}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-800">
            {question.question_text}
          </p>
        </div>
        <span
          className={
            "w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold " +
            priorityClassName(question.question_priority)
          }
        >
          {label(question.question_priority)}
        </span>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label(question.question_category)}
      </p>
    </article>
  );
}

function IssueCard({ issue }: { issue: LegalIssue }) {
  return (
    <article className="rounded-lg border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-medium text-sky-700">
            {issue.issue_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-sky-950">
            {issue.issue_title}
          </h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-800">
          Legal judgment
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-sky-900/80">
        {issue.issue_description}
      </p>
    </article>
  );
}

function DocumentCard({ document }: { document: Document }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-mono text-xs font-medium text-slate-500">
        {document.document_id}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-slate-950">
        {document.document_title}
      </h3>
      <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
        <span>{label(document.document_type)}</span>
        <span>{document.document_date ?? "Undated"}</span>
        <span>{label(document.document_status)}</span>
      </div>
    </article>
  );
}

export default async function CounselBriefPage({
  params,
}: CounselBriefPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>Matter not found.</p>
      </main>
    );
  }

  const {
    engagement,
    brief,
    questions,
    documents,
    findings,
    issues,
  } = getCounselData(matterData);
  const informationMissing = findings.filter(
    (finding) => findingState(finding).label === "Information Missing"
  );
  const judgmentIssues = issues.filter(
    (issue) => issue.requires_legal_judgment === "YES"
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/matters/${matterId}`}
            className="text-sm font-semibold text-slate-500 hover:text-blue-700"
          >
            Back to matter
          </Link>
          {matterId === "MAT-001" ? (
            <Link
              href="/matters/MAT-001/workstreams/WS-002"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View Security Verification →
            </Link>
          ) : null}
        </div>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow text-blue-700">
                {matterData.matter.matter_id} / Counsel workspace
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Counsel Brief
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Evidence-linked instructions for external counsel. The brief
                preserves what is supported, what is missing, and what requires
                legal judgment before advice is requested.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Output status</p>
              <p className="mt-1">{label(engagement?.outputs?.[0]?.output_status)}</p>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
            <ContextCard matterData={matterData} />

            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Counsel engagement
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The current brief and its intended external recipient.
                  </p>
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {label(engagement?.engagement_status)}
                </span>
              </div>

              <article className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs font-medium text-slate-500">
                      {engagement?.engagement_id ?? "No engagement"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {engagement?.counsel?.firm_name ?? "External counsel not recorded"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {engagement?.counsel?.counsel_name ?? "No counsel contact recorded"}
                      {engagement?.counsel?.specialization
                        ? ` · ${engagement.counsel.specialization}`
                        : ""}
                    </p>
                  </div>
                  <div className="text-sm text-slate-700 sm:text-right">
                    <p>{label(engagement?.engagement_type)}</p>
                    <p className="mt-1">
                      Budget: {formatCurrency(engagement?.budget_inr)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
                  {engagement?.engagement_description ??
                    "No counsel engagement description recorded."}
                </p>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Brief record
                  </p>
                  <p className="mt-2 font-medium text-slate-900">
                    {brief?.brief_title ?? "No brief recorded"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {brief?.brief_id ?? "—"} · {label(brief?.brief_status)} ·{" "}
                    {brief?.brief_date ?? "Undated"}
                  </p>
                </div>
              </article>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-950">
                Questions for counsel
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Questions are preserved from the issued brief; no legal answer
                is inferred in this prototype.
              </p>
              <div className="mt-4 grid gap-3">
                {questions.map((question) => (
                  <QuestionCard key={question.question_id} question={question} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-950">
                Brief boundaries
              </h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-semibold text-amber-900">
                    Information missing · {informationMissing.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-900/80">
                    These items should trigger targeted verification or evidence
                    requests, not a definitive conclusion.
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-amber-950">
                    {informationMissing.map((finding) => (
                      <li key={finding.finding_id}>
                        <span className="font-medium">{finding.finding_id}</span>{" "}
                        {finding.finding_title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
                  <p className="text-sm font-semibold text-sky-900">
                    Legal judgment required · {judgmentIssues.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-sky-900/80">
                    These are questions for counsel or Internal Legal. The
                    system does not select an enforcement route or issue a title
                    opinion.
                  </p>
                  <div className="mt-3 space-y-2">
                    {judgmentIssues.map((issue) => (
                      <IssueCard key={issue.issue_id} issue={issue} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Supporting documents
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {documents.length} documents from the matter workstreams.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {documents.map((document) => (
                  <DocumentCard key={document.document_id} document={document} />
                ))}
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  );
}
