import type { MatterTypeTemplate } from "@/lib/templates/types";
import { templateExtractionSchema } from "@/lib/templates/output-schema";
import { canonicalFieldKey } from "@/lib/knowledge/field-registry";

export const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelay(attempt: number) {
  return 400 * (2 ** (attempt - 1)) + Math.floor(Math.random() * 200);
}

function attributeKey(value: string) {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function fallbackLabeledFields(documentText: string): ExtractedField[] {
  const labels: Array<[string, string, "text" | "number"]> = [
    ["Facility amount", "facility_amount", "number"],
    ["Outstanding exposure", "outstanding_exposure", "number"],
    ["Amount claimed", "amount_claimed", "number"],
    ["Security value", "security_value", "number"],
    ["Estimated recovery amount", "recovery_amount", "number"],
    ["Maturity date", "maturity_date", "text"],
    ["Notice date", "notice_date", "text"],
    ["Security type", "security_type", "text"],
    ["Registration number", "registration_number", "text"],
  ];
  const labeledFields = labels.flatMap(([label, attribute, type]) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = documentText.match(new RegExp(`${escaped}\\s*:\\s*([^\\n.]+)`, "i"));
    if (!match) return [];
    const rawValue = match[1].trim();
    const value = type === "number" ? Number(rawValue.replace(/[^0-9.-]/g, "")) : rawValue;
    return [{ attribute, value: Number.isNaN(value as number) ? rawValue : value, page_number: 1, quote: `${label}: ${rawValue}` }];
  });
  const openItemMatch = documentText.match(/Open item for review\s+([\s\S]+?)(?:\.\s+The document|$)/i);
  return openItemMatch ? [...labeledFields, { attribute: "open_item", value: openItemMatch[1].trim(), page_number: 1, quote: `Open item for review ${openItemMatch[1].trim()}` }] : labeledFields;
}

export type ExtractedField = {
  attribute: string;
  value: unknown;
  page_number?: number;
  quote?: string;
  entity_role?: string;
};

export interface AIProvider {
  extract(input: { documentText: string; documentType: string; template: MatterTypeTemplate }): Promise<ExtractedField[]>;
}

export class GeminiProvider implements AIProvider {
  async extract({ documentText, documentType, template }: Parameters<AIProvider["extract"]>[0]) {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");
    const documentDefinition = template.document_types.find((item) => item.key === documentType) ?? template.document_types.find((item) => item.key === "other");
    const fieldInstructions = template.template_id === "generic"
      ? ""
      : documentDefinition?.fields.map((field) => `${field.key} (${field.label})`).join(", ") ?? "";
    const genericInstruction = template.template_id === "generic" || !documentDefinition
      ? "This is a generic matter template: capture every material fact explicitly stated in the document using concise snake_case attribute names. Do not limit extraction to a predefined field list."
      : "Only return fields defined by the selected document type, using the exact configured field keys where applicable.";
    const requestBody = JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `Extract only document facts. Return page number and a short exact supporting quote for every field. Document type: ${documentType}. ${genericInstruction} Configured fields: ${fieldInstructions || "none"}.\n\n${documentText}` }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: { fields: { type: "array", items: { type: "object", properties: { attribute: { type: "string" }, value: {}, page_number: { type: "number" }, quote: { type: "string" }, entity_role: { type: "string" } }, required: ["attribute", "value"] } } },
          required: ["fields"],
        },
      },
    });
    let response: Response | undefined;
    let lastStatus: number | undefined;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
          body: requestBody,
        });
        lastStatus = response.status;
      } catch (error) {
        if (attempt === MAX_ATTEMPTS) {
          throw new Error("Gemini extraction is temporarily unavailable after 3 attempts. Please retry processing the document.", { cause: error });
        }
        await wait(retryDelay(attempt));
        continue;
      }
      if (response.ok) break;
      if (!RETRYABLE_STATUS.has(response.status)) {
        throw new Error(`Gemini extraction failed with HTTP ${response.status}. Check the configured model and API access.`);
      }
      if (attempt < MAX_ATTEMPTS) await wait(retryDelay(attempt));
    }
    if (!response?.ok) {
      throw new Error(`Gemini extraction is temporarily unavailable after ${MAX_ATTEMPTS} attempts (HTTP ${lastStatus ?? "unknown"}). Please retry processing the document.`);
    }
    const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini returned no extraction output.");
    const parsed = JSON.parse(text) as { fields?: ExtractedField[] };
    const definitions = documentDefinition?.fields ?? [];
    const aliases = new Map(definitions.flatMap((field) => [[attributeKey(field.key), field.key], [attributeKey(field.label), field.key]]));
    const normalizedFields = (parsed.fields ?? [])
      .map((field) => ({ ...field, attribute: aliases.get(attributeKey(field.attribute)) ?? attributeKey(field.attribute) }))
      .filter((field) => Boolean(field.attribute) && (template.template_id === "generic" || definitions.length === 0 || aliases.has(attributeKey(field.attribute))));
    const fallbackFields = fallbackLabeledFields(documentText);
    const seenAttributes = new Set(normalizedFields.map((field) => canonicalFieldKey(field.attribute)));
    return [...normalizedFields, ...fallbackFields.filter((field) => !seenAttributes.has(canonicalFieldKey(field.attribute)))];
  }
}

export function extractionOutputSchema(template: MatterTypeTemplate, documentType: string) {
  return templateExtractionSchema(template, documentType);
}
