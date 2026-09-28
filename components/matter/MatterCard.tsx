import Link from "next/link";
import type { MatterBundle } from "@/lib/types/matter";

type MatterCardProps = {
  matterData: MatterBundle;
};

function formatCurrency(value?: number) {
  if (!value) {
    return "No financial exposure";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function riskClassName(risk?: string) {
  if (risk === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (risk === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function MatterCard({ matterData }: MatterCardProps) {
  const { matter, parties } = matterData;
  return (
    <Link
      href={"/matters/" + matter.matter_id}
      className="group block rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgb(15_23_42_/_0.04)] transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-slate-500">
            {matter.matter_id} · {matter.created_date ?? "Date not recorded"}
          </p>

          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 group-hover:text-blue-700">
            {matter.matter_title}
          </h3>
        </div>

        <span
          className={
            "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide " +
            riskClassName(matter.risk_rating)
          }
        >
          {matter.risk_rating}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {matter.matter_description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
        <div>
          <p className="eyebrow">
            Client
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {parties?.client?.party_name ?? "Not recorded"}
          </p>
        </div>

        <div>
          <p className="eyebrow">
            Counterparty
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {parties?.counterparty?.party_name ?? "Not recorded"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-xs font-medium text-slate-500">Exposure</p>
          <p className="mt-1 truncate text-lg font-semibold text-slate-950">
            {formatCurrency(matter.outstanding_exposure_inr)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-xs font-medium text-slate-500">Workstreams</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">
            {matterData.workstreams.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {matter.matter_status.replaceAll("_", " ")}
        </span>

        <span className="font-semibold text-blue-700">Open matter →</span>
      </div>
    </Link>
  );
}
