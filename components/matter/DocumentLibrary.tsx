"use client";

import { useMemo, useState } from "react";
import type { Document } from "@/lib/types/matter";

export type DocumentLibraryItem = {
  matterId: string;
  matterTitle: string;
  workstreamId: string;
  workstreamName: string;
  document: Document;
};

type DocumentLibraryProps = {
  items: DocumentLibraryItem[];
  initialMatterId?: string;
  initialWorkstreamId?: string;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

export default function DocumentLibrary({
  items,
  initialMatterId = "all",
  initialWorkstreamId = "all",
}: DocumentLibraryProps) {
  const [matterId, setMatterId] = useState(initialMatterId);
  const [workstreamId, setWorkstreamId] = useState(initialWorkstreamId);
  const [query, setQuery] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const matterOptions = useMemo(
    () =>
      Array.from(
        new Map(items.map((item) => [item.matterId, item.matterTitle])).entries()
      ),
    [items]
  );

  const workstreamOptions = useMemo(
    () =>
      Array.from(
        new Map(
          items
            .filter((item) => matterId === "all" || item.matterId === matterId)
            .map((item) => [
              `${item.matterId}:${item.workstreamId}`,
              `${item.matterTitle} · ${item.workstreamName}`,
            ])
        ).entries()
      ),
    [items, matterId]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesMatter = matterId === "all" || item.matterId === matterId;
      const matchesWorkstream =
        workstreamId === "all" ||
        `${item.matterId}:${item.workstreamId}` === workstreamId;
      const searchable = [
        item.document.document_title,
        item.document.document_type,
        item.document.document_source,
        item.workstreamName,
        item.matterTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesMatter && matchesWorkstream && searchable.includes(normalizedQuery)
      );
    });
  }, [items, matterId, query, workstreamId]);

  function handleMatterChange(nextMatterId: string) {
    setMatterId(nextMatterId);
    setWorkstreamId("all");
  }

  return (
    <section className="mt-8">
      <div className="surface-card flex flex-col gap-4 rounded-xl p-5 lg:flex-row lg:items-end">
        <label className="flex-1 text-sm font-medium text-slate-700">
          Matter
          <select
            value={matterId}
            onChange={(event) => handleMatterChange(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All matters</option>
            {matterOptions.map(([id, title]) => (
              <option key={id} value={id}>
                {id} · {title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm font-medium text-slate-700">
          Workstream
          <select
            value={workstreamId}
            onChange={(event) => setWorkstreamId(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All workstreams</option>
            {workstreamOptions.map(([id, labelText]) => (
              <option key={id} value={id}>
                {labelText}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm font-medium text-slate-700">
          Search documents
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, type, source..."
            className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={() =>
            setUploadMessage("Upload is simulated in this prototype; no file was stored.")
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Upload Document
        </button>
      </div>

      {uploadMessage ? (
        <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {uploadMessage}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{filteredItems.length} documents shown</span>
        <span>Source data is read-only in this prototype</span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <details
            key={`${item.matterId}:${item.document.document_id}`}
            className="surface-card rounded-xl p-5 transition hover:border-blue-300"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-medium text-slate-500">
                    {item.document.document_id}
                  </p>
                  <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                    {item.document.document_title}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {label(item.document.document_status)}
                </span>
              </div>
            </summary>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span>{item.matterId} · {item.matterTitle}</span>
                <span>{item.workstreamName}</span>
                <span>{label(item.document.document_type)}</span>
                <span>{item.document.document_date ?? "Undated"}</span>
                <span>{label(item.document.document_source)}</span>
              </div>

              {(item.document.sections?.length ?? 0) > 0 ? (
                <div className="mt-4 space-y-3">
                  {item.document.sections?.map((section) => (
                    <div key={section.section_id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {section.section_title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {section.section_content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  No document sections are recorded.
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
