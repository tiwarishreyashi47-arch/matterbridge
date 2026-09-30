import type { SupabaseClient } from "@supabase/supabase-js";
import { GeminiProvider } from "@/lib/ai/provider";
import { getTemplate } from "@/lib/templates/catalog";
import { canonicalFieldKey } from "@/lib/knowledge/field-registry";

export async function extractDocument(client: SupabaseClient, documentId: string) {
  const { data: document, error: documentError } = await client.from("document").select("*").eq("document_id", documentId).maybeSingle();
  if (documentError) throw new Error(documentError.message);
  if (!document) throw new Error("Document not found.");
  const { data: pages, error: pageError } = await client.from("page").select("*").eq("document_id", documentId).order("page_number");
  if (pageError) throw new Error(pageError.message);
  const { data: matter, error: matterError } = await client.from("matter").select("*").eq("matter_id", document.matter_id).maybeSingle();
  if (matterError) throw new Error(matterError.message);
  const templateId = matter?.template_id ?? (matter?.matter_type_id === "MT-002" ? "employment" : matter?.matter_type_id === "MT-001" ? "recovery" : "generic");
  const template = getTemplate(templateId) ?? getTemplate("generic");
  if (!template) throw new Error("No extraction template is available.");
  const text = (pages ?? []).map((page) => `Page ${page.page_number}: ${page.text_content}`).join("\n\n");
  const fields = await new GeminiProvider().extract({ documentText: text, documentType: document.document_type, template });
  const { data: existing, error: existingError } = await client.from("assertion").select("assertion_id,attribute,status,source").eq("matter_id", document.matter_id);
  if (existingError) throw new Error(existingError.message);
  const protectedAttributes = new Set((existing ?? []).filter((row) => row.status === "accepted").map((row) => canonicalFieldKey(String(row.attribute))));
  const runId = `RUN-${documentId}-${Date.now()}`;
  const assertions = fields.filter((field) => !protectedAttributes.has(canonicalFieldKey(field.attribute))).map((field, index) => ({
    assertion_id: `${runId}-${index + 1}`,
    matter_id: document.matter_id,
    attribute: canonicalFieldKey(field.attribute),
    value: field.value,
    trust_state: "INFERRED",
    status: "proposed",
    source: "extraction",
    run_id: runId,
  }));
  const supersedeAssertionIds = (existing ?? [])
    .filter((row) => row.status === "proposed" && row.source === "extraction")
    .filter((row) => assertions.some((assertion) => assertion.attribute === canonicalFieldKey(String(row.attribute))))
    .map((row) => String(row.assertion_id));
  return { document, pages: pages ?? [], runId, assertions, fields, supersedeAssertionIds, templateId: template.template_id, templateVersion: template.version };
}
