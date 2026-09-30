import Link from "next/link";
import RecoveryIssueWorkspace from "@/components/matter/RecoveryIssueWorkspace";
import { getMatter, getWorkstream } from "@/lib/data/matter-service";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { mapIssuesToSupport } from "@/lib/data/issue-mapping";
import type { MatterAssetBundle } from "@/lib/types/matter";
import MatterWorkspaceNav from "@/components/matter/MatterWorkspaceNav";

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

function SecurityCard({ assetBundle }: { assetBundle: MatterAssetBundle }) {
  const { asset, security_interest: securityInterest } = assetBundle;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow text-[#263c68]">Stage asset</p>
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
  const matterData = await getMatter(matterId);
  const workstream = await getWorkstream(matterId, workstreamId);

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
  const securityAssets = isSecurityVerification ? matterData.assets ?? [] : [];
  const resolvedStatuses = new Set(["RESOLVED", "CLOSED", "COMPLETED"]);
  const openItemCount = (workstream.issues ?? []).filter((issue) => !resolvedStatuses.has(issue.issue_status ?? "")).length;
  const resolvedItemCount = (workstream.issues ?? []).length - openItemCount;
  const issueSupport = mapIssuesToSupport(
        workstream.issues ?? [],
        workstream.findings ?? [],
        workstream.documents ?? [],
        buildEvidencePacket(matterData, {
          workstream,
          maxSources: 40,
        }).sources
      );

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
                {matterData.matter.matter_title} / Stage
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
                <p className="eyebrow">Open items</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {openItemCount}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Resolved</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {resolvedItemCount}
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

        <MatterWorkspaceNav matterId={matterId} active="stages" />

        <RecoveryIssueWorkspace
          issueSupport={issueSupport}
          workstreamName={workstream.workstream_name}
          matterId={matterId}
        />

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
                Documents in this stage
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                View the complete matter document library or upload workstream-specific evidence.
              </p>
            </div>
            <Link
              href={
                "/matters/" + matterId + "/documents"
              }
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Matter Documents ({workstream.documents?.length ?? 0}) →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
