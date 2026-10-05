import assert from "node:assert/strict";
import test from "node:test";
import { canonicalFieldKey } from "./field-registry.ts";
import { buildMatterKnowledge } from "./matter-knowledge.ts";
import { retrieveDocumentSections, retrieveMatterKnowledge } from "../data/retrieval-service.ts";
import { synthesizeLocalCounselResponse } from "../rag/local-synthesis.ts";
import type { MatterBundle } from "../types/matter";

const baseMatter = (assertions: MatterBundle["assertions"]): MatterBundle => ({
  matter: { matter_id: "MAT-TEST", matter_type_id: "generic", matter_title: "Test matter", matter_status: "OPEN" },
  workstreams: [],
  assertions,
});

test("keeps legally distinct field concepts distinct while normalizing true aliases", () => {
  assert.equal(canonicalFieldKey("facility limit"), "facility_amount");
  assert.equal(canonicalFieldKey("amount claimed"), "amount_claimed");
  assert.notEqual(canonicalFieldKey("facility amount"), canonicalFieldKey("outstanding exposure"));
  assert.notEqual(canonicalFieldKey("security value"), canonicalFieldKey("recovery amount"));
});

test("selects one deterministic current fact and preserves historical assertions", () => {
  const knowledge = buildMatterKnowledge(baseMatter([
    { assertion_id: "A-old", matter_id: "MAT-TEST", attribute: "facility amount", value: 10, trust_state: "SUPPORTED", status: "proposed", source: "extraction", created_at: "2026-01-01" },
    { assertion_id: "A-new", matter_id: "MAT-TEST", attribute: "facility_amount", value: 12, trust_state: "SUPPORTED", status: "proposed", source: "extraction", created_at: "2026-02-01" },
    { assertion_id: "A-rejected", matter_id: "MAT-TEST", attribute: "facility_amount", value: 9, trust_state: "INFERRED", status: "rejected", source: "user" },
  ]));
  assert.equal(knowledge.facts.find((fact) => fact.id === "A-new")?.state, "current");
  assert.equal(knowledge.facts.find((fact) => fact.id === "A-old")?.state, "superseded");
  assert.equal(knowledge.facts.find((fact) => fact.id === "A-rejected")?.state, "rejected");
});

test("keeps provenance authority categories distinct", () => {
  const knowledge = buildMatterKnowledge(baseMatter([
    { assertion_id: "A-doc", matter_id: "MAT-TEST", attribute: "facility_amount", value: 10, trust_state: "SUPPORTED", status: "accepted", source: "extraction", source_document_ids: ["DOC-1"], citations: [{ quote: "10", trust_state: "SUPPORTED", document_id: "DOC-1", page_number: 2, span_id: "SPAN-1" }] },
    { assertion_id: "A-human", matter_id: "MAT-TEST", attribute: "risk_rating", value: "HIGH", trust_state: "SUPPORTED", status: "accepted", source: "user" },
    { assertion_id: "A-entered", matter_id: "MAT-TEST", attribute: "review_note", value: "Needs review", trust_state: "INFERRED", status: "proposed", source: "user" },
  ]));
  const kinds = new Set(knowledge.provenance.map((item) => item.kind));
  assert.ok(kinds.has("uploaded_document"));
  assert.ok(kinds.has("ai_extraction"));
  assert.ok(kinds.has("citation_verification"));
  assert.ok(kinds.has("human_acceptance"));
  assert.ok(kinds.has("human_entered"));
});

test("derives a useful matter status and counsel deliverable state", () => {
  const knowledge = buildMatterKnowledge({
    ...baseMatter([]),
    issues: [{ issue_id: "ISSUE-1", matter_id: "MAT-TEST", issue_title: "Security priority unresolved", issue_status: "ACTIVE" }],
    counsel_engagements: [{
      engagement_id: "ENG-1",
      matter_id: "MAT-TEST",
      counsel_id: "COUNSEL-1",
      engagement_status: "ENGAGED",
      counsel: { counsel_id: "COUNSEL-1", counsel_name: "External Counsel", firm_name: "Example LLP", counsel_type: "EXTERNAL" },
      briefs: [{
        brief_id: "BRIEF-1",
        engagement_id: "ENG-1",
        questions: [{ question_id: "Q-1", brief_id: "BRIEF-1", question_text: "Can we enforce?", issue_id: "ISSUE-1" }],
      }],
      outputs: [],
    }],
    timeline: [{ timeline_id: "TM-1", matter_id: "MAT-TEST", event_date: "2026-02-01", event_type: "DOCUMENT_UPLOAD", event_title: "Document uploaded" }],
  });
  assert.equal(knowledge.currentStatus.code, "pending_external_counsel");
  assert.equal(knowledge.externalCounsel[0]?.deliverables[0]?.status, "pending");
  assert.equal(knowledge.counselQuestions[0]?.openItems.ids[0], "ISSUE-1");
  assert.equal(knowledge.history[0]?.id, "TM-1");
  assert.equal(knowledge.sources.find((source) => source.kind === "history")?.id, "TM-1");
});

test("retrieves canonical evidence by category without flattening authority", () => {
  const knowledge = buildMatterKnowledge({
    ...baseMatter([
      { assertion_id: "A-1", matter_id: "MAT-TEST", attribute: "security value", value: "INR 10m", trust_state: "SUPPORTED", status: "accepted", source: "extraction", source_document_ids: ["DOC-1"] },
    ]),
    issues: [{ issue_id: "ISSUE-1", matter_id: "MAT-TEST", issue_title: "Security priority unresolved", issue_status: "ACTIVE" }],
  });
  const hits = retrieveMatterKnowledge(knowledge, "security priority");
  assert.equal(hits[0]?.kind, "open_item");
  assert.equal(hits[0]?.id, "ISSUE-1");
});

test("retrieves documentary passages with document and page provenance", () => {
  const bundle = {
    ...baseMatter([]),
    documents: [{
      document_id: "DOC-1",
      matter_id: "MAT-TEST",
      document_title: "Facility Agreement",
      document_type: "financing_agreement",
      sections: [{ section_id: "DOC-1-SECTION-1", document_id: "DOC-1", section_title: "Security", section_content: "The receivables charge is subject to priority confirmation.", section_order: 1 }],
    }],
  };
  const hits = retrieveDocumentSections(bundle, "priority confirmation");
  assert.equal(hits[0]?.documentId, "DOC-1");
  assert.equal(hits[0]?.pageNumber, 1);
  assert.equal(hits[0]?.provenance[0]?.kind, "uploaded_document");
});

test("synthesizes a grounded local answer with follow-ups and navigation", () => {
  const response = synthesizeLocalCounselResponse("What is blocking enforcement?", [{
    matterId: "MAT-TEST",
    title: "Test matter",
    hits: [{ kind: "open_item", id: "ISSUE-1", text: "open_item: Charge priority unresolved", score: 5, provenance: [] }, { kind: "counsel_advice", id: "ADVICE-1", text: "counsel_advice: Obtain an updated search.", score: 5, provenance: [] }],
    documentHits: [],
  }]);
  assert.match(response.answer, /Charge priority unresolved/);
  assert.ok(response.followUpQuestions.length > 0);
  assert.ok(response.navigation.some((link) => link.href.includes("/open-items#ISSUE-1")));
});
