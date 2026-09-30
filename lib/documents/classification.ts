import { getTemplate } from "@/lib/templates/catalog";

export function classifyDocument(fileName: string, matterTypeId?: string, selectedTemplateId?: string) {
  const templateId = selectedTemplateId ?? (matterTypeId === "MT-002" ? "employment" : matterTypeId === "MT-001" ? "recovery" : "generic");
  const template = getTemplate(templateId) ?? getTemplate("generic");
  const name = fileName.toLowerCase();
  const explicitKey = template?.document_types.find((documentType) => {
    const key = documentType.key;
    if (key === "counsel_letter") return /counsel|opinion|legal[-_ ]?advice|advice/.test(name);
    if (key === "financing_agreement") return /facility|agreement|loan|disbursement|summary/.test(name);
    if (key === "security_document") return /security|charge|registry|registration|collateral/.test(name);
    if (key === "notice") return /notice|demand|default/.test(name);
    return false;
  })?.key;
  const match = template?.document_types.find((documentType) =>
    documentType.key.split("_").some((term) => term.length > 3 && name.includes(term))
  );

  return {
    templateId,
    documentType: explicitKey ?? match?.key ?? "other",
    status: explicitKey || match ? "classified" : "uploaded",
  } as const;
}
