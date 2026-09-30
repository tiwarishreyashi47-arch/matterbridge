"use client";

import { useState } from "react";
import DocumentUploadWorkflow from "@/components/matter/DocumentUploadWorkflow";

export default function DocumentIntakePanel({ matterId }: { matterId?: string }) {
  const [selectedMatter, setSelectedMatter] = useState(matterId ?? "MAT-001");

  return (
    <section className="surface-card mt-6 rounded-xl p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="eyebrow text-blue-700">Matter-level document intake</p><h2 className="mt-1 text-lg font-semibold text-slate-950">Upload a core matter document</h2><p className="mt-1 text-sm text-slate-600">Use this for documents such as the Facility Agreement. The file is stored, classified, extracted, and sent to lawyer review.</p></div>
        <div className="flex flex-wrap gap-2">
          <select value={selectedMatter} onChange={(event) => setSelectedMatter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><option value="MAT-001">MAT-001</option><option value="MAT-002">MAT-002</option></select>
          <DocumentUploadWorkflow matterId={selectedMatter} />
        </div>
      </div>
    </section>
  );
}
