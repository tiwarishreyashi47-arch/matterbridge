import recovery from "@/data/templates/recovery.v1.json";
import employment from "@/data/templates/employment.v1.json";
import financing from "@/data/templates/financing.v1.json";
import generic from "@/data/templates/generic.v1.json";
import { validateTemplate } from "@/lib/templates/schema";
import type { MatterTypeTemplate } from "@/lib/templates/types";

export const templateCatalog = [recovery, employment, financing, generic] as MatterTypeTemplate[];

export function getTemplate(templateId: string, version = "v1") {
  return templateCatalog.find(
    (template) => template.template_id === templateId && template.version === version
  );
}

export function validateTemplateCatalog() {
  return templateCatalog.map((template) => ({
    template,
    result: validateTemplate(template),
  }));
}
