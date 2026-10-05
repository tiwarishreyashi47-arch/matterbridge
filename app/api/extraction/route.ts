import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { extractDocument } from "@/lib/extraction/extractor";
import { verifyAssertionCitation } from "@/lib/extraction/citation-verifier";
import { DEFAULT_GEMINI_MODEL } from "@/lib/ai/provider";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { documentId?: string } | null;
  if (!body?.documentId) return NextResponse.json({ error: "documentId is required." }, { status: 400 });
  try {
    const client = createSupabaseServerClient();
    const result = await extractDocument(client, body.documentId);
    const { error: runError } = await client.from("extraction_run").insert({ run_id: result.runId, matter_id: result.document.matter_id, model: process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL, prompt_version: "extraction-v1", template_id: result.templateId, template_version: result.templateVersion, document_ids: [result.document.document_id], status: "completed", started_at: new Date().toISOString(), completed_at: new Date().toISOString() });
    if (runError) throw new Error(runError.message);
    if (result.assertions.length) {
      const { error } = await client.from("assertion").insert(result.assertions);
      if (error) throw new Error(error.message);
    }
    if (result.supersedeAssertionIds.length) {
      const { error } = await client.from("assertion").update({ status: "superseded", updated_at: new Date().toISOString() }).in("assertion_id", result.supersedeAssertionIds);
      if (error) throw new Error(error.message);
    }
    let citationCount = 0;
    for (const field of result.fields) {
      const assertion = result.assertions.find((item) => item.attribute === field.attribute);
      if (!assertion || !field.quote) continue;
      const page = result.pages.find((item) => Number(item.page_number) === Number(field.page_number)) ?? result.pages[0];
      if (!page) continue;
      const verification = await verifyAssertionCitation(client, assertion.assertion_id, page.page_id, field.quote);
      if (verification.supported) citationCount += 1;
    }
    const { error: documentUpdateError } = await client.from("document").update({ document_status: "ready_for_review" }).eq("document_id", result.document.document_id);
    if (documentUpdateError) throw new Error(documentUpdateError.message);
    const { error: jobUpdateError } = await client.from("job").update({ status: "completed", updated_at: new Date().toISOString() }).eq("document_id", result.document.document_id).eq("job_type", "DOCUMENT_PROCESSING");
    if (jobUpdateError) throw new Error(jobUpdateError.message);
    await client.from("audit_event").insert({ audit_event_id: `AUDIT-EXTRACTION-${result.runId}`, matter_id: result.document.matter_id, event_type: "EXTRACTION_COMPLETED", entity_type: "extraction_run", entity_id: result.runId, payload: { documentId: result.document.document_id, assertionCount: result.assertions.length, citationCount } });
    return NextResponse.json({ runId: result.runId, assertionCount: result.assertions.length, citationCount });
  } catch (error) {
    if (body.documentId) {
      const client = createSupabaseServerClient();
      await client.from("document").update({ document_status: "failed" }).eq("document_id", body.documentId);
      await client.from("job").update({ status: "failed", last_error: error instanceof Error ? error.message : "Extraction failed.", updated_at: new Date().toISOString() }).eq("document_id", body.documentId).eq("job_type", "DOCUMENT_PROCESSING");
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Extraction failed." }, { status: 502 });
  }
}
