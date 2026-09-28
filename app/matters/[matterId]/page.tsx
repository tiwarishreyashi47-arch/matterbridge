import Link from "next/link";
import MatterActivityPanels from "@/components/matter/MatterActivityPanels";
import { getMatter } from "@/lib/data/matter-service";

type MatterPageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

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

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function statusClassName(value?: string) {
  if (value === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (value === "MEDIUM" || value === "IN_PROGRESS" || value === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export default async function MatterPage({ params }: MatterPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>Matter not found.</p>
      </main>
    );
  }

  const { matter, parties } = matterData;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to matters
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">
                {matter.matter_id} / {label(matterData.matter_type?.matter_type_name)}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                {matter.matter_title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {matter.matter_description}
              </p>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Client</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {parties?.client?.party_name ?? "Not recorded"}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">Counterparty</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {parties?.counterparty?.party_name ?? "Not recorded"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid min-w-64 grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs text-slate-500">Risk</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{matter.risk_rating}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{label(matter.matter_status)}</p>
              </div>
              <div className="col-span-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs text-slate-500">Exposure</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatCurrency(matter.outstanding_exposure_inr)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-blue-700">Matter workspace</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Workstreams</h2>
              <p className="mt-1 text-sm text-slate-600">
                Open a focused work area for the legal work that needs attention.
              </p>
            </div>
            <Link
              href={"/evidence?matterId=" + matter.matter_id}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Browse Documentary Evidence →
            </Link>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {matterData.workstreams.map((workstream) => (
              <Link
                key={workstream.workstream_id}
                href={
                  "/matters/" +
                  matter.matter_id +
                  "/workstreams/" +
                  workstream.workstream_id
                }
                className="group rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgb(15_23_42_/_0.04)] transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-medium text-slate-500">{workstream.workstream_id}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                      {workstream.workstream_name}
                    </h3>
                  </div>
                  <span
                    className={
                      "rounded-full border px-3 py-1 text-xs font-semibold " +
                      statusClassName(workstream.workstream_status)
                    }
                  >
                    {label(workstream.workstream_status)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {workstream.workstream_description}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
                  <span>{workstream.documents?.length ?? 0} documents</span>
                  <span>{workstream.findings?.length ?? 0} findings</span>
                  <span>{workstream.issues?.length ?? 0} issues</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <MatterActivityPanels
          matterId={matter.matter_id}
          timeline={matterData.timeline ?? []}
          engagements={matterData.counsel_engagements ?? []}
          decisions={matterData.decisions ?? []}
          workstreams={matterData.workstreams}
        />
      </div>
    </main>
  );
}
