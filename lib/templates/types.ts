export type TemplateStatus = "draft" | "published";

export type TemplateField = {
  key: string;
  canonical_key?: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "currency";
  description?: string;
  required?: boolean;
  entity_role?: string;
  cardinality?: "one" | "many";
};

export type TemplateDocumentType = {
  key: string;
  label: string;
  description?: string;
  fields: TemplateField[];
};

export type MatterTypeTemplate = {
  template_id: string;
  practice_area: string;
  name: string;
  version: string;
  status: TemplateStatus;
  stages: string[];
  workstreams: { key: string; name: string; description: string }[];
  entity_roles: string[];
  document_types: TemplateDocumentType[];
  expected_documents: string[];
  rules: { rule_code: string; parameters: Record<string, unknown> }[];
};
