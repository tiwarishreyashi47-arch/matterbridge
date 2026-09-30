"use client";

import { useMemo, useState } from "react";
import type { Document } from "@/lib/types/matter";
import DocumentUploadWorkflow from "@/components/matter/DocumentUploadWorkflow";

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
  allowUpload?: boolean;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

export default function DocumentLibrary({
  items,
  initialMatterId = "all",
  initialWorkstreamId = "all",
  allowUpload = true,
}: DocumentLibraryProps) {
  const [visibleItems, setVisibleItems] = useState(items);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [matterId, setMatterId] = useState(initialMatterId);
  const [workstreamId, setWorkstreamId] = useState(initialWorkstreamId);
  const [query, setQuery] = useState("");

  const matterOptions = useMemo(
    () =>
      Array.from(
        new Map(visibleItems.map((item) => [item.matterId, item.matterTitle])).entries()
      ),
    [visibleItems]
  );

  const workstreamOptions = useMemo(
    () =>
      Array.from(
        new Map(
            visibleItems
            .filter((item) => matterId === "all" || item.matterId === matterId)
            .map((item) => [
              `${item.matterId}:${item.workstreamId}`,
              `${item.matterTitle} · ${item.workstreamName}`,
            ])
        ).entries()
      ),
    [visibleItems, matterId]
  );
  const showMatterFilter = initialMatterId === "all" && matterOptions.length > 1;

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return visibleItems.filter((item) => {
      if (item.document.document_status?.toLowerCase() === "removed") return false;
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
  }, [visibleItems, matterId, query, workstreamId]);

  async function deleteDocument(documentId: string, title: string) {
    if (!window.confirm(`Remove ${title} from this matter? This removes the stored document and its extracted page record.`)) return;
    setDeletingId(documentId);
    try {
      const response = await fetch(`/api/documents/${encodeURIComponent(documentId)}`, { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error ?? "Document removal failed.");
      setVisibleItems((current) => current.filter((item) => item.document.document_id !== documentId));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Document removal failed.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleMatterChange(nextMatterId: string) {
    setMatterId(nextMatterId);
    setWorkstreamId("all");
  }

  return (
    <section className="mt-8">
      <div className="surface-card flex flex-col gap-4 rounded-lg p-5 lg:flex-row lg:items-end">
        {showMatterFilter ? <label className="flex-1 text-sm font-medium text-slate-700">
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
        </label> : null}

        <label className="flex-1 text-sm font-medium text-slate-700">
          Matter area
          <select
            value={workstreamId}
            onChange={(event) => setWorkstreamId(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All matter areas</option>
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
            className="mt-2 block w-full rounded-md border border-[#d7d7d1] bg-[#fffefa] px-3 py-2 text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#73819b] focus:ring-2 focus:ring-[#dfe4ed]"
          />
        </label>

        {allowUpload && matterId !== "all" ? <DocumentUploadWorkflow
          matterId={matterId}
          workstreamId={workstreamId !== "all" && workstreamId.split(":")[1] !== "matter-level" ? workstreamId.split(":")[1] : null}
          compact
        /> : <span className="text-xs text-slate-500">Select a matter to upload a document.</span>}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{filteredItems.length} documents shown</span>
        <span>Uploaded documents are processed into the matter record.</span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <details
            key={`${item.matterId}:${item.document.document_id}`}
            className="surface-card rounded-lg p-5 transition hover:border-[#aeb8c9]"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-[#263c68]">Document</p>
                  <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                    {item.document.document_title}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {label(item.document.document_status)}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2" onClick={(event) => event.stopPropagation()}>
                <a href={`/api/documents/${encodeURIComponent(item.document.document_id)}/download`} target="_blank" rel="noreferrer" className="rounded-md border border-[#263c68] px-3 py-1.5 text-xs font-semibold text-[#263c68] hover:bg-blue-50">Open original</a>
                <button type="button" disabled={deletingId === item.document.document_id} onClick={() => deleteDocument(item.document.document_id, item.document.document_title)} className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-wait disabled:opacity-60">{deletingId === item.document.document_id ? "Removing…" : "Remove"}</button>
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

            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
