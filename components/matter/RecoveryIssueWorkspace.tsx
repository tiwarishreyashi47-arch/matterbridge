"use client";

import { useState } from "react";
import type { IssueSupport } from "@/lib/data/issue-mapping";

type RecoveryIssueWorkspaceProps = {
  issueSupport: IssueSupport[];
  workstreamName: string;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
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

function findingState(finding: IssueSupport["findings"][number]) {
  if (
    finding.finding_type === "INFORMATION_GAP" ||
    finding.requires_verification === "YES"
  ) {
    return "Information Missing";
  }

  if (
    finding.finding_type === "LEGAL_ISSUE" ||
    finding.requires_legal_judgment === "YES"
  ) {
    return "Legal Judgment Required";
  }

  return "Supported";
}

export default function RecoveryIssueWorkspace({
  issueSupport,
  workstreamName,
}: RecoveryIssueWorkspaceProps) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  function togglePanel(issueId: string, panel: "evidence" | "findings") {
    const nextPanel = `${issueId}:${panel}`;
    setOpenPanel((current) => (current === nextPanel ? null : nextPanel));
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-blue-700">
            {workstreamName}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Active Issues
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Work each issue from the source evidence and AI findings before
            deciding the next legal action.
          </p>
        </div>

        <span className="w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {issueSupport.length} active work items
        </span>
      </div>

      <div className="mt-4 grid gap-4">
        {issueSupport.map(({ issue, findings, documents, evidence }) => {
          const evidencePanel = openPanel === `${issue.issue_id}:evidence`;
          const findingsPanel = openPanel === `${issue.issue_id}:findings`;

          return (
            <article
              key={issue.issue_id}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgb(15_23_42_/_0.04)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="font-mono text-xs font-medium text-slate-500">
                    {issue.issue_id}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {issue.issue_title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {issue.issue_description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 text-xs font-semibold">
                  <span
                    className={
                      "rounded-full border px-3 py-1 " +
                      priorityClassName(issue.issue_priority)
                    }
                  >
                    {label(issue.issue_priority)} priority
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {label(issue.issue_status)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  aria-expanded={evidencePanel}
                  onClick={() => togglePanel(issue.issue_id, "evidence")}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
                >
                  Evidence {evidencePanel ? "↑" : "↓"}
                </button>
                <button
                  type="button"
                  aria-expanded={findingsPanel}
                  onClick={() => togglePanel(issue.issue_id, "findings")}
                  className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                >
                  AI Findings {findingsPanel ? "↑" : "↓"}
                </button>
                <span className="self-center text-xs text-slate-500">
                  {documents.length} documents · {findings.length} findings
                </span>
              </div>

              {evidencePanel ? (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Supporting evidence
                    </p>
                    <span className="text-xs font-medium text-slate-500">
                      {evidence.length} matched source chunks
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {documents.map((document) => (
                      <div
                        key={document.document_id}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <p className="font-mono text-xs text-slate-500">
                          {document.document_id}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {document.document_title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {label(document.document_type)} ·{" "}
                          {document.document_date ?? "Undated"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {evidence.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {evidence.map((source) => (
                        <div
                          key={source.chunk_id}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="font-mono text-xs font-medium text-blue-700">
                            {source.chunk_id} · {source.document_id}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {source.citation_label ?? source.section_title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {source.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No directly matched source chunk was found in the current
                      evidence packet.
                    </p>
                  )}
                </div>
              ) : null}

              {findingsPanel ? (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mapped AI findings
                  </p>
                  {findings.length > 0 ? (
                    <div className="mt-3 grid gap-3">
                      {findings.map((finding) => (
                        <div
                          key={finding.finding_id}
                          className="rounded-lg border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-mono text-xs font-medium text-slate-500">
                                {finding.finding_id}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {finding.finding_title}
                              </p>
                            </div>
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {findingState(finding)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {finding.finding_summary}
                          </p>
                          {(finding.citations?.length ?? 0) > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {finding.citations?.map((citation) => (
                                <span
                                  key={citation.citation_id}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                  {citation.source_id}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No directly related AI finding was identified from the
                      shared matter/workstream scope and topic match.
                    </p>
                  )}
                </div>
              ) : null}

              <div className="mt-5 border-t border-slate-100 pt-4">
                <label
                  htmlFor={`comment-${issue.issue_id}`}
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Lawyer comment
                </label>
                <textarea
                  id={`comment-${issue.issue_id}`}
                  value={comments[issue.issue_id] ?? ""}
                  onChange={(event) =>
                    setComments((current) => ({
                      ...current,
                      [issue.issue_id]: event.target.value,
                    }))
                  }
                  placeholder="Add a working note, question, or next step..."
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  Local prototype note · not saved
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
