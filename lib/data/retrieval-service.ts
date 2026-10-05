import type { MatterKnowledge } from "@/lib/knowledge/matter-knowledge";
import type { MatterBundle } from "@/lib/types/matter";

export type RetrievalHit = {
  kind: "fact" | "open_item" | "counsel_advice" | "decision" | "source" | "document_passage";
  id: string;
  text: string;
  score: number;
  provenance: MatterKnowledge["facts"][number]["provenance"];
};

export type DocumentRetrievalHit = {
  kind: "document_passage";
  id: string;
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  text: string;
  score: number;
  provenance: MatterKnowledge["facts"][number]["provenance"];
};

function tokens(value: string) {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function scoreText(queryTokens: string[], text: string, weight: number) {
  const haystack = text.toLowerCase();
  return queryTokens.reduce((score, token) => score + (haystack.includes(token) ? weight : 0), 0);
}

export function retrieveMatterKnowledge(matter: MatterKnowledge, query: string, limit = 12): RetrievalHit[] {
  const queryTokens = tokens(query);
  const hits: RetrievalHit[] = [];
  for (const fact of matter.facts.filter((item) => item.state === "current")) {
    const score = scoreText(queryTokens, `${fact.canonicalKey} ${String(fact.value)}`, fact.citationVerified ? 4 : 2);
    if (score) hits.push({ kind: "fact", id: fact.id, text: `${fact.canonicalKey}: ${String(fact.value)}`, score, provenance: fact.provenance });
  }
  for (const item of matter.openItems) {
    const score = scoreText(queryTokens, `${item.title} ${item.description ?? ""}`, 5);
    if (score) hits.push({ kind: "open_item", id: item.id, text: item.title, score, provenance: item.provenance });
  }
  for (const advice of matter.counselAdvice) {
    const score = scoreText(queryTokens, advice.summary ?? "", 5);
    if (score) hits.push({ kind: "counsel_advice", id: advice.id, text: advice.summary ?? "Counsel advice recorded.", score, provenance: advice.provenance });
  }
  for (const decision of matter.decisions) {
    const score = scoreText(queryTokens, `${decision.title ?? ""} ${decision.summary ?? ""}`, 4);
    if (score) hits.push({ kind: "decision", id: decision.id, text: `${decision.title ?? "Internal strategy"}: ${decision.summary ?? ""}`, score, provenance: decision.provenance });
  }
  for (const source of matter.sources) {
    const score = scoreText(queryTokens, source.title ?? "", 2);
    if (score) hits.push({ kind: "source", id: source.id, text: source.title ?? source.id, score, provenance: source.provenance });
  }
  return hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
}

export function retrieveDocumentSections(bundle: MatterBundle, query: string, limit = 6): DocumentRetrievalHit[] {
  const queryTokens = tokens(query);
  const hits: DocumentRetrievalHit[] = [];
  for (const document of bundle.documents ?? []) {
    for (const section of document.sections ?? []) {
      const text = section.section_content.trim();
      const score = scoreText(queryTokens, `${document.document_title} ${section.section_title} ${text}`, 3);
      if (!score || !text) continue;
      hits.push({
        kind: "document_passage",
        id: `${document.document_id}:${section.section_id}`,
        documentId: document.document_id,
        documentTitle: document.document_title,
        pageNumber: section.section_order,
        text: text.length > 700 ? `${text.slice(0, 700)}…` : text,
        score,
        provenance: [{ kind: "uploaded_document", sourceId: document.document_id, documentId: document.document_id, pageNumber: section.section_order }],
      });
    }
  }
  return hits.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, limit);
}
