"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = { matterId: string; workstreamId?: string | null; compact?: boolean };

export default function DocumentUploadWorkflow({ matterId, workstreamId, compact = false }: Props) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<{ processedCount?: number; assertionCount?: number; citationCount?: number }>({});

  function chooseFiles(selected: FileList | null) {
    const nextFiles = Array.from(selected ?? []);
    if (nextFiles.length > 3) {
      setFiles([]);
      setState("error");
      setMessage("Select no more than three PDFs at a time.");
      return;
    }
    setFiles(nextFiles);
    setState("idle");
    setMessage("");
    setResult({});
  }

  async function submit() {
    if (!files.length) return;
    setState("uploading");
    setMessage("");
    let assertionCount = 0;
    let citationCount = 0;
    const failures: string[] = [];
    try {
      for (const [index, file] of files.entries()) {
        setMessage(`Processing document ${index + 1} of ${files.length}: ${file.name}`);
        try {
          const form = new FormData();
          form.set("file", file);
          form.set("matterId", matterId);
          if (workstreamId) form.set("workstreamId", workstreamId);
          const uploadResponse = await fetch("/api/documents/upload", { method: "POST", body: form });
          const upload = await uploadResponse.json().catch(() => ({}));
          if (!uploadResponse.ok) throw new Error(upload.error ?? "Upload failed.");

          setState("processing");
          const extractionResponse = await fetch("/api/extraction", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: upload.documentId }),
          });
          const extraction = await extractionResponse.json().catch(() => ({}));
          if (!extractionResponse.ok) throw new Error(extraction.error ?? "Document processing failed.");
          assertionCount += extraction.assertionCount ?? 0;
          citationCount += extraction.citationCount ?? 0;
        } catch (error) {
          failures.push(`${file.name}: ${error instanceof Error ? error.message : "Processing failed"}`);
        }
        setState("uploading");
      }

      setResult({ processedCount: files.length - failures.length, assertionCount, citationCount });
      if (failures.length) {
        setState("error");
        setMessage(`${files.length - failures.length} of ${files.length} documents processed. ${failures.join(" ")}`);
      } else {
        setState("success");
        setMessage(`${files.length} document${files.length === 1 ? "" : "s"} processed and ready for lawyer review.`);
        // The upload response is client-side state, while the review queue and
        // document library come from the server-rendered matter bundle. A full
        // navigation guarantees that all three surfaces read the same snapshot
        // after extraction has committed.
        router.replace(`${window.location.pathname}?refresh=${Date.now()}#review`);
      }
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Document processing failed.");
    }
  }

  return <div className={compact ? "flex flex-wrap items-center gap-2" : "flex flex-wrap items-end gap-2"}>
    <label className="flex min-w-64 cursor-pointer items-center gap-3 rounded-md border border-dashed border-[#bfc3c2] bg-[#f7f6f2] px-3 py-2 text-sm text-slate-600 hover:border-[#73819b] hover:bg-[#f1f2f1]">
      <span className="font-semibold text-[#263c68]">Choose up to 3 PDFs</span>
      <span className="min-w-0 truncate text-xs text-slate-500">{files.length ? `${files.length} selected` : "No files selected"}</span>
      <input type="file" accept="application/pdf,.pdf" multiple onChange={(event) => chooseFiles(event.target.files)} className="sr-only" />
    </label>
    <button type="button" disabled={!files.length || state === "uploading" || state === "processing"} onClick={submit} className="rounded-md bg-[#263c68] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1e3156] disabled:cursor-not-allowed disabled:opacity-50">
      {state === "uploading" ? "Uploading…" : state === "processing" ? "Processing…" : `Upload and process${files.length ? ` (${files.length})` : ""}`}
    </button>
    {state === "success" ? <p className="basis-full text-sm text-emerald-700">{message} {result.assertionCount ?? 0} facts · {result.citationCount ?? 0} verified citations. The extracted facts review queue is shown below.</p> : null}
    {state === "error" ? <p className="basis-full text-sm text-rose-700">{message}</p> : null}
  </div>;
}
