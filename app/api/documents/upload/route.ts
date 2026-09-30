import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { classifyDocument } from "@/lib/documents/classification";
import { extractPdfPages } from "@/lib/documents/pdf-text";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const matterId = String(form.get("matterId") ?? "");
  const workstreamId = String(form.get("workstreamId") ?? "") || null;

  if (!(file instanceof File) || !matterId) {
    return NextResponse.json({ error: "A file and matterId are required." }, { status: 400 });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const hash = createHash("sha256").update(bytes).digest("hex");
  const documentId = `DOC-UP-${hash.slice(0, 12)}`;
  const storagePath = `${matterId}/${hash}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  const client = createSupabaseServerClient();

  const { data: matter, error: matterError } = await client.from("matter").select("matter_type_id,template_id").eq("matter_id", matterId).maybeSingle();
  if (matterError) return NextResponse.json({ error: matterError.message }, { status: 502 });
  if (!matter) return NextResponse.json({ error: "Matter not found." }, { status: 404 });
  const classification = classifyDocument(file.name, matter.matter_type_id, matter.template_id as string | undefined);
  const pages = extractPdfPages(bytes, file.name);
  const { data: existing } = await client.from("document").select("document_id,document_status").eq("matter_id", matterId).eq("file_hash", hash).maybeSingle();
  if (existing) {
    const { error: storageError } = await client.storage.from("matter-documents").upload(storagePath, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
    if (storageError) return NextResponse.json({ error: storageError.message }, { status: 502 });
    const { error: documentUpdateError } = await client.from("document").update({
      document_title: file.name,
      document_type: classification.documentType,
      document_source: "LAWYER_UPLOAD",
      document_status: classification.status,
      workstream_id: workstreamId,
      file_path: storagePath,
    }).eq("document_id", existing.document_id);
    if (documentUpdateError) return NextResponse.json({ error: documentUpdateError.message }, { status: 502 });
    const { error: pageError } = await client.from("page").upsert(pages.map((page) => ({
      page_id: `${existing.document_id}-PAGE-${page.pageNumber}`,
      document_id: existing.document_id,
      page_number: page.pageNumber,
      text_content: page.text,
      section_id: `${existing.document_id}-SECTION-${page.pageNumber}`,
      section_title: `Page ${page.pageNumber}`,
      section_order: page.pageNumber,
    })), { onConflict: "page_id" });
    if (pageError) return NextResponse.json({ error: pageError.message }, { status: 502 });
    const { error: jobError } = await client.from("job").upsert({
      job_id: `JOB-${hash.slice(0, 16)}`,
      matter_id: matterId,
      document_id: existing.document_id,
      job_type: "DOCUMENT_PROCESSING",
      status: "queued",
      attempt_count: 0,
      last_error: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "job_id" });
    if (jobError) return NextResponse.json({ error: jobError.message }, { status: 502 });
    return NextResponse.json({ documentId: existing.document_id, status: existing.document_status, duplicate: true, pageCount: pages.length });
  }

  const { error: uploadError } = await client.storage.from("matter-documents").upload(storagePath, bytes, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 502 });

  const { error: documentError } = await client.from("document").upsert({
    document_id: documentId,
    matter_id: matterId,
    workstream_id: workstreamId,
    document_title: file.name,
    document_type: classification.documentType,
    document_source: "LAWYER_UPLOAD",
    document_status: classification.status,
    file_path: storagePath,
    file_hash: hash,
  }, { onConflict: "document_id" });
  if (documentError) return NextResponse.json({ error: documentError.message }, { status: 502 });

  const { error: pageError } = await client.from("page").upsert(pages.map((page) => ({
    page_id: `${documentId}-PAGE-${page.pageNumber}`,
    document_id: documentId,
    page_number: page.pageNumber,
    text_content: page.text,
    section_id: `${documentId}-SECTION-${page.pageNumber}`,
    section_title: `Page ${page.pageNumber}`,
    section_order: page.pageNumber,
  })), { onConflict: "page_id" });
  if (pageError) return NextResponse.json({ error: pageError.message }, { status: 502 });

  const { error: jobError } = await client.from("job").upsert({
    job_id: `JOB-${hash.slice(0, 16)}`,
    matter_id: matterId,
    document_id: documentId,
    job_type: "DOCUMENT_PROCESSING",
    status: "queued",
    attempt_count: 0,
  }, { onConflict: "job_id" });
  if (jobError) return NextResponse.json({ error: jobError.message }, { status: 502 });

  return NextResponse.json({ documentId, status: classification.status, documentType: classification.documentType, pageCount: pages.length });
}
