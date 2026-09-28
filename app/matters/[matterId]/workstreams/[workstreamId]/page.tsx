import Link from "next/link";
import RecoveryIssueWorkspace from "@/components/matter/RecoveryIssueWorkspace";
import { getMatter, getWorkstream } from "@/lib/data/matter-service";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { mapIssuesToSupport } from "@/lib/data/issue-mapping";
import type { AIFinding, LegalIssue, MatterAssetBundle } from "@/lib/types/matter";

type WorkstreamPageProps = {
  params: Promise<{
    matterId: string;
    workstreamId: string;
  }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function classifyFinding(finding: AIFinding) {
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
    finding.finding_type === "RECOMMENDATION" ||
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

function issueClassName(issue: LegalIssue) {
  if (issue.requires_legal_judgment === "YES") {
    return "border-sky-200 bg-sky-50 text-sky-800";
  }

  if (issue.issue_priority === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function FindingCard({ finding }: { finding: AIFinding }) {
  const state = classifyFinding(finding);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {finding.finding_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-950">
            {finding.finding_title}
          </h3>
        </div>

        <span
          className={
            "w-fit rounded-full border px-3 py-1 text-xs font-semibold " +
            state.className
          }
        >
          {state.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {finding.finding_summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
          {label(finding.finding_type)}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
          Verification: {finding.requires_verification === "YES" ? "Yes" : "No"}
        </span>
      </div>

      {(finding.citations?.length ?? 0) > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Evidence
          </p>
          <div className="mt-3 grid gap-2">
            {finding.citations?.map((citation) => (
              <div
                key={citation.citation_id}
                className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
              >
                <p className="font-medium text-slate-900">
                  {citation.source_id}
                  {citation.source_section ? " / " + citation.source_section : ""}
                </p>
                <p className="mt-1 leading-6">{citation.citation_text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function IssueCard({ issue }: { issue: LegalIssue }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {issue.issue_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-950">
            {issue.issue_title}
          </h3>
        </div>

        <span
          className={
            "rounded-full border px-3 py-1 text-xs font-semibold " +
            issueClassName(issue)
          }
        >
          {issue.requires_legal_judgment === "YES"
            ? "Legal judgment"
            : issue.issue_priority}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {issue.issue_description}
      </p>
    </article>
  );
}

function SecurityCard({ assetBundle }: { assetBundle: MatterAssetBundle }) {
  const { asset, security_interest: securityInterest } = assetBundle;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {asset.asset_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-950">
            {asset.asset_name}
          </h3>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {label(asset.asset_status)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {asset.asset_description}
      </p>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Security
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {label(securityInterest?.security_type)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Value
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {formatCurrency(securityInterest?.security_value_inr)}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Registration
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {securityInterest?.registration_number ?? "Not applicable"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function WorkstreamPage({
  params,
}: WorkstreamPageProps) {
  const { matterId, workstreamId } = await params;
  const matterData = getMatter(matterId);
  const workstream = getWorkstream(matterId, workstreamId);

  if (!matterData || !workstream) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>{matterData ? "Workstream not found." : "Matter not found."}</p>
      </main>
    );
  }

  const isSecurityVerification =
    matterData.matter.matter_id === "MAT-001" &&
    workstream.workstream_name === "Security Verification";
  const isRecoveryAssessment =
    matterData.matter.matter_id === "MAT-001" &&
    workstream.workstream_name === "Recovery Assessment";
  const isEmployeeLeaveReview =
    matterData.matter.matter_id === "MAT-002" &&
    workstream.workstream_name === "Employee Leave & Misconduct Review";
  const securityAssets = isSecurityVerification ? matterData.assets ?? [] : [];
  const usesIssueRelationshipWorkspace =
    isRecoveryAssessment || isSecurityVerification || isEmployeeLeaveReview;
  const issueSupport = usesIssueRelationshipWorkspace
    ? mapIssuesToSupport(
        workstream.issues ?? [],
        workstream.findings ?? [],
        workstream.documents ?? [],
        buildEvidencePacket(matterData, {
          workstream,
          maxSources: 40,
        }).sources
      )
    : [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href={"/matters/" + matterId}
          className="text-sm font-semibold text-slate-500 hover:text-blue-700"
        >
          Back to matter
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">
                {matterData.matter.matter_id} / {workstream.workstream_id}
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                {workstream.workstream_name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {workstream.workstream_description}
              </p>
            </div>

            <div className="grid min-w-64 grid-cols-3 gap-2 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Findings</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {workstream.findings?.length ?? 0}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Active Issues</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {workstream.issues?.length ?? 0}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Documents</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {workstream.documents?.length ?? 0}
                </p>
              </div>
            </div>
          </div>
        </header>

        {usesIssueRelationshipWorkspace ? (
          <RecoveryIssueWorkspace
            issueSupport={issueSupport}
            workstreamName={workstream.workstream_name}
          />
        ) : (
          <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Findings
              </h2>

              <div className="mt-4 grid gap-4">
                {(workstream.findings ?? []).map((finding) => (
                  <FindingCard key={finding.finding_id} finding={finding} />
                ))}
              </div>
            </div>

            <aside>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Active Issues
              </h2>

              <div className="mt-4 grid gap-4">
                {(workstream.issues ?? []).map((issue) => (
                  <IssueCard key={issue.issue_id} issue={issue} />
                ))}
              </div>
            </aside>
          </section>
        )}

        {securityAssets.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-950">
              Security Package
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Security Verification should preserve unresolved title and
              perfection questions for counsel review.
            </p>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {securityAssets.map((assetBundle) => (
                <SecurityCard
                  key={assetBundle.asset.asset_id}
                  assetBundle={assetBundle}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="surface-card mt-8 rounded-xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Documents in this workstream
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                View the complete documentary record in the central evidence library.
              </p>
            </div>
            <Link
              href={
                "/evidence?matterId=" +
                matterId +
                "&workstreamId=" +
                workstreamId
              }
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Documentary Evidence ({workstream.documents?.length ?? 0}) →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
