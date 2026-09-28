import Link from "next/link";
import { getCounselPortfolio } from "@/lib/data/counsel-service";

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function statusClassName(value?: string) {
  if (value === "PENDING" || value === "IN_PROGRESS") {
    return "bg-amber-50 text-amber-800";
  }

  if (value === "ENGAGED" || value === "APPROVED") {
    return "bg-emerald-50 text-emerald-800";
  }

  return "bg-slate-100 text-slate-700";
}

export default function CounselReviewPage() {
  const portfolio = getCounselPortfolio();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="surface-card rounded-xl p-7">
          <p className="eyebrow text-blue-700">
            Overall Counsel Engagement Review
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            External counsel portfolio
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            A portfolio view of the law firms and counsel currently associated
            with MatterBridge matters. Topics are derived only from the current
            engagement and workstream descriptions.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Counsel and firms
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {portfolio.length} counsel groups in the current dataset.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {portfolio.map((group) => (
              <article
                key={group.counsel.counsel_id}
                className="surface-card rounded-xl p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      {group.counsel.counsel_id}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                      {group.counsel.firm_name ?? group.counsel.counsel_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {group.counsel.counsel_name}
                      {group.counsel.specialization
                        ? " · " + group.counsel.specialization
                        : ""}
                    </p>
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {group.matters.length} {group.matters.length === 1 ? "matter" : "matters"}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Common work
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {group.matters.map((matter) => (
                    <div key={matter.matterId} className="rounded-lg bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={"/matters/" + matter.matterId}
                        className="font-semibold text-blue-700 hover:text-blue-900"
                        >
                          {matter.matterId} · {matter.matterTitle}
                        </Link>
                        <span
                          className={
                            "rounded-full px-3 py-1 text-xs font-semibold " +
                            statusClassName(matter.engagement.engagement_status)
                          }
                        >
                          {label(matter.engagement.engagement_status)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {matter.matterType} ·{" "}
                        {matter.workstreams.join(" · ")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {matter.engagement.engagement_description}
                      </p>
                      {matter.hasExternalCounselAccess ? (
                        <Link
                          href={"/counsel-workspace/" + matter.matterId}
                          className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Open scoped counsel workspace →
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
