import { z } from "zod";

export const TemplateFieldSchema = z.object({
  key: z.string().min(1),
  canonical_key: z.string().min(1).optional(),
  label: z.string().min(1),
  type: z.enum(["text", "number", "date", "boolean", "currency"]),
  description: z.string().optional(),
  required: z.boolean().optional(),
  entity_role: z.string().optional(),
  cardinality: z.enum(["one", "many"]).optional(),
});

export const TemplateDocumentTypeSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  fields: z.array(TemplateFieldSchema),
});

export const TemplateSchema = z.object({
  template_id: z.string().min(1),
  practice_area: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  status: z.enum(["draft", "published"]),
  stages: z.array(z.string().min(1)),
  workstreams: z.array(z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
  })),
  entity_roles: z.array(z.string().min(1)),
  document_types: z.array(TemplateDocumentTypeSchema),
  expected_documents: z.array(z.string().min(1)),
  rules: z.array(z.object({
    rule_code: z.string().min(1),
    parameters: z.record(z.string(), z.unknown()),
  })),
});

export type TemplateValidationResult =
  | { success: true; data: z.infer<typeof TemplateSchema> }
  | { success: false; errors: string[] };

export function validateTemplate(input: unknown): TemplateValidationResult {
  const result = TemplateSchema.safeParse(input);

  if (result.success) {
    return result;
  }

  return {
    success: false,
    errors: result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };
}
