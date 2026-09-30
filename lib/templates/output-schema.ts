import type { MatterTypeTemplate, TemplateDocumentType } from "@/lib/templates/types";
import { canonicalFieldKey } from "@/lib/knowledge/field-registry";

export function structuredOutputSchema(documentType: TemplateDocumentType) {
  return {
    type: "object",
    properties: Object.fromEntries(
      documentType.fields.map((field) => [field.canonical_key ?? canonicalFieldKey(field.key), {
        type: field.type === "currency" || field.type === "number" ? "number" : field.type,
        description: field.description ?? field.label,
      }])
    ),
    required: documentType.fields.filter((field) => field.required).map((field) => field.canonical_key ?? canonicalFieldKey(field.key)),
  };
}

export function templateExtractionSchema(template: MatterTypeTemplate, documentTypeKey: string) {
  const documentType = template.document_types.find((item) => item.key === documentTypeKey)
    ?? template.document_types.find((item) => item.key === "other");

  return documentType ? structuredOutputSchema(documentType) : {
    type: "object",
    properties: {},
  };
}
