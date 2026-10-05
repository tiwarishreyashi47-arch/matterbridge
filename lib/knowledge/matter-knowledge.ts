import type {
  Assertion,
  AuditEvent,
  CounselEngagement,
  CounselOpinionReviewPoint,
  Decision,
  LegalIssue,
  MatterBundle,
} from "../types/matter";
import { canonicalFieldKey } from "./field-registry.ts";

export type KnowledgeProvenanceKind =
  | "uploaded_document"
  | "ai_extraction"
  | "citation_verification"
  | "human_acceptance"
  | "human_rejection"
  | "human_entered"
  | "counsel_advice"
  | "organizational_decision"
  | "system_derived";

export type KnowledgeProvenance = {
  kind: KnowledgeProvenanceKind;
  sourceId?: string;
  documentId?: string;
  pageNumber?: number;
  spanId?: string;
  assertionId?: string;
  detail?: string;
};

export type RelationshipState = "present" | "absent" | "unknown";

export type KnowledgeRelationship = {
  state: RelationshipState;
  ids: string[];
};

export type CanonicalFactState = "current" | "superseded" | "proposed" | "rejected";

export type CanonicalFact = {
  id: string;
  canonicalKey: string;
  value: unknown;
  state: CanonicalFactState;
  reviewState: Assertion["status"];
  citationVerified: boolean;
  provenance: KnowledgeProvenance[];
};

export type CanonicalAction = {
  id: string;
  text: string;
  owner?: string;
  status?: string;
  sourceDecisionId: string;
  provenance: KnowledgeProvenance[];
};

export type CanonicalOpenItem = {
  id: string;
  title: string;
  category?: string;
  description?: string;
  status?: string;
  resolutionStatus: "unresolved" | "resolved" | "unknown";
  linkedDocumentIds: KnowledgeRelationship;
  facts: KnowledgeRelationship;
  actions: KnowledgeRelationship;
  counselQuestions: KnowledgeRelationship;
  counselAdvice: KnowledgeRelationship;
  decisions: KnowledgeRelationship;
  provenance: KnowledgeProvenance[];
};

export type CanonicalCounselQuestion = {
  id: string;
  text: string;
  category?: string;
  priority?: string;
  openItems: KnowledgeRelationship;
  provenance: KnowledgeProvenance[];
};

export type CanonicalCounselAdvice = {
  id: string;
  summary?: string;
  reviewPoints: CounselOpinionReviewPoint[];
  questions: KnowledgeRelationship;
  decisions: KnowledgeRelationship;
  provenance: KnowledgeProvenance[];
};

export type CanonicalDecision = {
  id: string;
  title?: string;
  summary?: string;
  status?: string;
  actions: CanonicalAction[];
  openItems: KnowledgeRelationship;
  provenance: KnowledgeProvenance[];
};

export type MatterAttentionStatusCode =
  | "closed"
  | "pending_external_counsel"
  | "open_items_require_resolution"
  | "pending_internal_action"
  | "in_progress"
  | "open";

export type MatterAttentionStatus = {
  code: MatterAttentionStatusCode;
  label: string;
  reason?: string;
  blockerIds: string[];
  nextActionIds: string[];
  provenance: KnowledgeProvenance[];
};

export type MatterWorkflowStatus = {
  code: string;
  label: string;
  configured: boolean;
  provenance: KnowledgeProvenance[];
};

export type CanonicalSource = {
  id: string;
  kind: "document" | "page" | "span" | "counsel_advice" | "decision" | "history";
  title?: string;
  documentId?: string;
  pageNumber?: number;
  sourceId?: string;
  provenance: KnowledgeProvenance[];
};

export type CanonicalHistoryEvent = {
  id: string;
  eventType: string;
  occurredAt?: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  provenance: KnowledgeProvenance[];
};

export type CanonicalCounselDeliverable = {
  id: string;
  label: string;
  status: "pending" | "received";
  questionId?: string;
  adviceId?: string;
  provenance: KnowledgeProvenance[];
};

export type CanonicalExternalCounsel = {
  engagementId: string;
  counselId: string;
  name: string;
  firmName?: string;
  engagementStatus?: string;
  deliverables: CanonicalCounselDeliverable[];
  adviceIds: string[];
  provenance: KnowledgeProvenance[];
};

export type MatterKnowledge = {
  matterId: string;
  context: {
    title: string;
    description?: string;
    matterType?: string;
    parties: { client?: string; counterparty?: string };
  };
  metadata: {
    status: string;
    riskRating?: string;
    createdDate?: string;
    canonicalFields: Record<string, unknown[]>;
  };
  currentStatus: MatterAttentionStatus;
  workflowStatus: MatterWorkflowStatus;
  facts: CanonicalFact[];
  openItems: CanonicalOpenItem[];
  actions: CanonicalAction[];
  counselQuestions: CanonicalCounselQuestion[];
  counselAdvice: CanonicalCounselAdvice[];
  externalCounsel: CanonicalExternalCounsel[];
  decisions: CanonicalDecision[];
  sources: CanonicalSource[];
  history: CanonicalHistoryEvent[];
  provenance: KnowledgeProvenance[];
};

function relation(ids: string[]): KnowledgeRelationship {
  return ids.length ? { state: "present", ids } : { state: "unknown", ids: [] };
}

function resolutionStatus(status?: string): CanonicalOpenItem["resolutionStatus"] {
  if (!status) return "unknown";
  return ["RESOLVED", "CLOSED", "COMPLETED"].includes(status.toUpperCase()) ? "resolved" : "unresolved";
}

function workflowStatusFor(bundle: MatterBundle): MatterWorkflowStatus {
  const code = bundle.matter.workflow_stage ?? bundle.matter.matter_status;
  return {
    code,
    label: code.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()),
    configured: Boolean(bundle.matter.workflow_stage),
    provenance: [{ kind: "system_derived", detail: bundle.matter.workflow_stage ? "matter.workflow_stage" : "matter.matter_status" }],
  };
}

function factProvenance(assertion: Assertion): KnowledgeProvenance[] {
  const provenance: KnowledgeProvenance[] = [];
  if (assertion.source_document_ids?.length) {
    for (const documentId of assertion.source_document_ids) {
      provenance.push({ kind: "uploaded_document", documentId, assertionId: assertion.assertion_id, sourceId: documentId });
    }
  }
  if (assertion.source === "extraction") provenance.push({ kind: "ai_extraction", assertionId: assertion.assertion_id, sourceId: assertion.run_id ?? undefined });
  if (assertion.source === "user") provenance.push({ kind: assertion.status === "accepted" ? "human_acceptance" : assertion.status === "rejected" ? "human_rejection" : "human_entered", assertionId: assertion.assertion_id });
  if (assertion.source === "seed" || assertion.source === "rule") provenance.push({ kind: "system_derived", assertionId: assertion.assertion_id, detail: assertion.source });
  for (const citation of assertion.citations ?? []) {
    provenance.push({ kind: "citation_verification", assertionId: assertion.assertion_id, documentId: citation.document_id, pageNumber: citation.page_number, spanId: citation.span_id, detail: citation.quote });
  }
  return provenance;
}

function factState(assertion: Assertion): CanonicalFactState {
  if (assertion.status === "superseded") return "superseded";
  if (assertion.status === "rejected") return "rejected";
  if (assertion.status === "proposed") return "proposed";
  return "current";
}

function factRank(assertion: Assertion) {
  const statusRank = assertion.status === "accepted" ? 0 : assertion.status === "proposed" ? 1 : 2;
  const sourceRank = assertion.source === "user" ? 0 : 1;
  const timestamp = assertion.updated_at ?? assertion.created_at ?? "";
  return [statusRank, sourceRank, timestamp, assertion.assertion_id] as const;
}

function selectFactStates(assertions: Assertion[]) {
  const selected = new Set<string>();
  const groups = new Map<string, Assertion[]>();
  for (const assertion of assertions) {
    if (!["accepted", "proposed"].includes(assertion.status)) continue;
    const key = `${assertion.entity_id ?? "matter"}:${canonicalFieldKey(assertion.attribute)}`;
    groups.set(key, [...(groups.get(key) ?? []), assertion]);
  }
  for (const group of groups.values()) {
    const winner = [...group].sort((a, b) => {
      const aRank = factRank(a);
      const bRank = factRank(b);
      return aRank[0] - bRank[0] || aRank[1] - bRank[1] || bRank[2].localeCompare(aRank[2]) || bRank[3].localeCompare(aRank[3]);
    })[0];
    if (winner) selected.add(winner.assertion_id);
  }
  return selected;
}

function actionsFor(decision: Decision): CanonicalAction[] {
  return (decision.follow_up_actions ?? []).map((action) => ({
    id: action.action_id,
    text: action.action,
    owner: action.owner,
    status: action.status,
    sourceDecisionId: decision.decision_id,
    provenance: [{ kind: "organizational_decision", sourceId: decision.decision_id } satisfies KnowledgeProvenance],
  }));
}

function counselAdviceFor(engagement: CounselEngagement): CanonicalCounselAdvice[] {
  return (engagement.outputs ?? []).map((output) => ({
    id: output.output_id,
    summary: output.opinion_summary,
    reviewPoints: output.review_points ?? [],
    questions: relation((engagement.briefs ?? []).filter((brief) => brief.brief_id === output.brief_id).flatMap((brief) => (brief.questions ?? []).map((question) => question.question_id))),
    decisions: relation([]),
    provenance: [{ kind: "counsel_advice", sourceId: output.output_id } satisfies KnowledgeProvenance],
  }));
}

function externalCounselFor(engagement: CounselEngagement, advice: CanonicalCounselAdvice[]): CanonicalExternalCounsel {
  const engagementAdvice = advice.filter((item) => (engagement.outputs ?? []).some((output) => output.output_id === item.id));
  const deliverables = (engagement.briefs ?? []).flatMap((brief) => (brief.questions ?? []).map((question) => {
    const matchingAdvice = engagementAdvice.find((item) => item.questions.ids.includes(question.question_id));
    return {
      id: question.question_id,
      label: question.question_text,
      status: matchingAdvice ? "received" : "pending",
      questionId: question.question_id,
      adviceId: matchingAdvice?.id,
      provenance: [{ kind: matchingAdvice ? "counsel_advice" : "human_entered", sourceId: question.question_id } satisfies KnowledgeProvenance],
    } satisfies CanonicalCounselDeliverable;
  }));
  return {
    engagementId: engagement.engagement_id,
    counselId: engagement.counsel_id,
    name: engagement.counsel?.counsel_name ?? engagement.counsel_id,
    firmName: engagement.counsel?.firm_name,
    engagementStatus: engagement.engagement_status,
    deliverables,
    adviceIds: engagementAdvice.map((item) => item.id),
    provenance: [{ kind: "human_entered", sourceId: engagement.engagement_id } satisfies KnowledgeProvenance],
  };
}

function statusLabel(code: MatterAttentionStatusCode) {
  return {
    closed: "Matter closed",
    pending_external_counsel: "Pending external counsel response",
    open_items_require_resolution: "Open items require resolution",
    pending_internal_action: "Pending internal action",
    in_progress: "Matter in progress",
    open: "Matter open",
  }[code];
}

function deriveCurrentStatus(bundle: MatterBundle, openItems: CanonicalOpenItem[], actions: CanonicalAction[], externalCounsel: CanonicalExternalCounsel[]): MatterAttentionStatus {
  const matterStatus = bundle.matter.matter_status.toUpperCase();
  if (matterStatus === "CLOSED") return { code: "closed", label: statusLabel("closed"), blockerIds: [], nextActionIds: [], provenance: [{ kind: "system_derived", detail: "matter_status" }] };
  const pendingDeliverables = externalCounsel.flatMap((engagement) => engagement.deliverables.filter((deliverable) => deliverable.status === "pending"));
  if (pendingDeliverables.length) {
    return {
      code: "pending_external_counsel",
      label: statusLabel("pending_external_counsel"),
      reason: "One or more counsel questions do not yet have a linked counsel response.",
      blockerIds: pendingDeliverables.map((deliverable) => deliverable.id),
      nextActionIds: [],
      provenance: [{ kind: "system_derived", detail: "unanswered_counsel_questions" }],
    };
  }
  const unresolvedItems = openItems.filter((item) => !["RESOLVED", "CLOSED", "COMPLETED"].includes((item.status ?? "").toUpperCase()));
  if (unresolvedItems.length) {
    return {
      code: "open_items_require_resolution",
      label: statusLabel("open_items_require_resolution"),
      reason: "The matter has active or in-progress open items.",
      blockerIds: unresolvedItems.map((item) => item.id),
      nextActionIds: [],
      provenance: [{ kind: "system_derived", detail: "unresolved_open_items" }],
    };
  }
  const pendingActions = actions.filter((action) => !["COMPLETED", "CLOSED", "DONE"].includes((action.status ?? "").toUpperCase()));
  if (pendingActions.length) {
    return {
      code: "pending_internal_action",
      label: statusLabel("pending_internal_action"),
      reason: "The latest organizational decision has follow-up actions that remain open.",
      blockerIds: [],
      nextActionIds: pendingActions.map((action) => action.id),
      provenance: [{ kind: "system_derived", detail: "pending_decision_actions" }],
    };
  }
  const code: MatterAttentionStatusCode = matterStatus === "IN_PROGRESS" ? "in_progress" : "open";
  return { code, label: statusLabel(code), blockerIds: [], nextActionIds: [], provenance: [{ kind: "system_derived", detail: "matter_status" }] };
}

function historyFor(bundle: MatterBundle): CanonicalHistoryEvent[] {
  const timeline = (bundle.timeline ?? []).map((event) => ({
    id: event.timeline_id,
    eventType: event.event_type,
    occurredAt: event.event_date,
    entityType: "timeline",
    entityId: event.timeline_id,
    summary: event.event_title,
    provenance: [{ kind: "system_derived", sourceId: event.timeline_id } satisfies KnowledgeProvenance],
  } satisfies CanonicalHistoryEvent));
  const audit = (bundle.history ?? []).map((event: AuditEvent) => ({
    id: event.audit_event_id,
    eventType: event.event_type,
    occurredAt: event.created_at,
    entityType: event.entity_type ?? undefined,
    entityId: event.entity_id ?? undefined,
    summary: event.event_type.replaceAll("_", " ").toLowerCase(),
    provenance: [{ kind: event.event_type === "ASSERTION_REVIEWED" && event.payload?.status === "rejected" ? "human_rejection" : event.event_type === "ASSERTION_REVIEWED" ? "human_acceptance" : event.event_type.includes("COUNSEL") ? "counsel_advice" : event.event_type.includes("DECISION") ? "organizational_decision" : "system_derived", sourceId: event.audit_event_id } satisfies KnowledgeProvenance],
  } satisfies CanonicalHistoryEvent));
  return [...timeline, ...audit].sort((a, b) => (b.occurredAt ?? "").localeCompare(a.occurredAt ?? ""));
}

export function buildMatterKnowledge(bundle: MatterBundle): MatterKnowledge {
  const assertions = bundle.assertions ?? [];
  const selectedCurrent = selectFactStates(assertions);
  const issueBasis = bundle.knowledgeRelations?.issueBasis ?? [];
  const decisionIssues = bundle.knowledgeRelations?.decisionIssues ?? [];
  const allQuestions = (bundle.counsel_engagements ?? []).flatMap((engagement) => (engagement.briefs ?? []).flatMap((brief) => brief.questions ?? []));
  const counselAdvice = (bundle.counsel_engagements ?? []).flatMap(counselAdviceFor);
  const adviceByQuestion = new Map(counselAdvice.flatMap((advice) => advice.questions.ids.map((questionId) => [questionId, advice.id] as const)));
  const facts = [...assertions]
    .sort((a, b) => a.attribute.localeCompare(b.attribute) || a.assertion_id.localeCompare(b.assertion_id))
    .map((assertion) => ({
      id: assertion.assertion_id,
      canonicalKey: canonicalFieldKey(assertion.attribute),
      value: assertion.value,
      state: selectedCurrent.has(assertion.assertion_id) ? "current" : ["accepted", "proposed"].includes(assertion.status) ? "superseded" : factState(assertion),
      reviewState: assertion.status,
      citationVerified: (assertion.citations ?? []).some((citation) => citation.trust_state === "SUPPORTED"),
      provenance: factProvenance(assertion),
    }));
  const decisions = (bundle.decisions ?? []).map((decision) => ({
    id: decision.decision_id,
    title: decision.decision_title,
    summary: decision.decision_summary,
    status: decision.decision_status,
    actions: actionsFor(decision),
    openItems: relation(decisionIssues.filter((item) => item.decision_id === decision.decision_id).map((item) => item.issue_id)),
    provenance: [{ kind: "organizational_decision", sourceId: decision.decision_id } satisfies KnowledgeProvenance],
  }));
  const actions = decisions.flatMap((decision) => decision.actions);
  const actionsByIssue = new Map<string, string[]>();
  for (const decision of decisions) {
    for (const issueId of decision.openItems.ids) actionsByIssue.set(issueId, [...(actionsByIssue.get(issueId) ?? []), ...decision.actions.map((action) => action.id)]);
  }
  const persistedOpenItems = (bundle.issues ?? []).map((issue: LegalIssue) => ({
    id: issue.issue_id,
    title: issue.issue_title,
    category: issue.requires_legal_judgment === "YES" ? "Legal judgment" : issue.issue_priority,
    description: issue.issue_description,
    status: issue.issue_status,
    resolutionStatus: resolutionStatus(issue.issue_status),
    linkedDocumentIds: relation(issueBasis.filter((item) => item.issue_id === issue.issue_id && item.assertion_id).flatMap((item) => assertions.find((assertion) => assertion.assertion_id === item.assertion_id)?.source_document_ids ?? [])),
    facts: relation(issueBasis.filter((item) => item.issue_id === issue.issue_id && item.assertion_id).map((item) => item.assertion_id as string)),
    actions: relation(actionsByIssue.get(issue.issue_id) ?? []),
    counselQuestions: relation(allQuestions.filter((question) => question.issue_id === issue.issue_id).map((question) => question.question_id)),
    counselAdvice: relation(allQuestions.filter((question) => question.issue_id === issue.issue_id).map((question) => adviceByQuestion.get(question.question_id)).filter((id): id is string => Boolean(id))),
    decisions: relation(decisionIssues.filter((item) => item.issue_id === issue.issue_id).map((item) => item.decision_id)),
    provenance: [{ kind: "system_derived", sourceId: issue.issue_id } satisfies KnowledgeProvenance],
  }));
  const proposedOpenItems = assertions
    .filter((assertion) => assertion.status === "proposed" && canonicalFieldKey(assertion.attribute) === "open_item")
    .map((assertion) => ({
      id: `ISSUE-${assertion.assertion_id}`,
      title: String(assertion.value),
      category: "Proposed review item",
      description: "Extracted from an uploaded document and awaiting lawyer confirmation.",
      status: "PROPOSED",
      resolutionStatus: "unknown" as const,
      linkedDocumentIds: relation(assertion.source_document_ids ?? []),
      facts: relation([assertion.assertion_id]),
      actions: relation([]),
      counselQuestions: relation([]),
      counselAdvice: relation([]),
      decisions: relation([]),
      provenance: [...factProvenance(assertion), { kind: "system_derived", sourceId: assertion.assertion_id, detail: "proposed_open_item_from_extraction" } satisfies KnowledgeProvenance],
    }));
  const documentOpenItems = (bundle.documents ?? []).flatMap((document) => (document.sections ?? []).flatMap((section, index) => {
    const match = section.section_content.match(/Open item for review\s+([\s\S]+?)(?:\.\s+The document|$)/i);
    if (!match) return [];
    return [{
      id: `DOC-OPEN-${document.document_id}-${index + 1}`,
      title: match[1].trim(),
      category: "Proposed review item",
      description: "The uploaded document identifies this matter as requiring resolution.",
      status: "PROPOSED",
      resolutionStatus: "unknown" as const,
      linkedDocumentIds: relation([document.document_id]),
      facts: relation([]),
      actions: relation([]),
      counselQuestions: relation([]),
      counselAdvice: relation([]),
      decisions: relation([]),
      provenance: [{ kind: "uploaded_document", sourceId: document.document_id, documentId: document.document_id, pageNumber: Number(section.section_order) } satisfies KnowledgeProvenance],
    }];
  }));
  const knownOpenItemTitles = new Set([...persistedOpenItems, ...proposedOpenItems].map((item) => item.title.trim().toLowerCase()));
  const openItems = [...persistedOpenItems, ...proposedOpenItems, ...documentOpenItems.filter((item) => !knownOpenItemTitles.has(item.title.trim().toLowerCase()))];
  const counselQuestions = (bundle.counsel_engagements ?? []).flatMap((engagement) => (engagement.briefs ?? []).flatMap((brief) => (brief.questions ?? []).map((question) => ({
    id: question.question_id,
    text: question.question_text,
    category: question.question_category,
    priority: question.question_priority,
    openItems: relation(question.issue_id ? [question.issue_id] : []),
    provenance: [{ kind: "human_entered", sourceId: question.question_id } satisfies KnowledgeProvenance],
  }))));
  const externalCounsel = (bundle.counsel_engagements ?? []).map((engagement) => externalCounselFor(engagement, counselAdvice));
  const history = historyFor(bundle);
  const sources: CanonicalSource[] = [
    ...(bundle.documents ?? []).map((document) => ({ id: document.document_id, kind: "document" as const, title: document.document_title, sourceId: document.document_id, provenance: [{ kind: "uploaded_document" as const, sourceId: document.document_id, documentId: document.document_id }] })),
    ...counselAdvice.map((advice) => ({ id: advice.id, kind: "counsel_advice" as const, title: advice.summary, sourceId: advice.id, provenance: advice.provenance })),
    ...decisions.map((decision) => ({ id: decision.id, kind: "decision" as const, title: decision.title, sourceId: decision.id, provenance: decision.provenance })),
    ...history.map((event) => ({ id: event.id, kind: "history" as const, title: event.summary, sourceId: event.id, provenance: event.provenance })),
  ];
  const currentStatus = deriveCurrentStatus(bundle, openItems, actions, externalCounsel);
  const workflowStatus = workflowStatusFor(bundle);
  const provenance = facts.flatMap((fact) => fact.provenance);
  return {
    matterId: bundle.matter.matter_id,
    context: {
      title: bundle.matter.matter_title,
      description: bundle.matter.matter_description,
      matterType: bundle.matter_type?.matter_type_name,
      parties: { client: bundle.parties?.client?.party_name, counterparty: bundle.parties?.counterparty?.party_name },
    },
    metadata: {
      status: bundle.matter.matter_status,
      riskRating: bundle.matter.risk_rating,
      createdDate: bundle.matter.created_date,
      canonicalFields: facts.filter((fact) => fact.state === "current").reduce<Record<string, unknown[]>>((fields, fact) => {
        fields[fact.canonicalKey] = [...(fields[fact.canonicalKey] ?? []), fact.value];
        return fields;
      }, {}),
    },
    currentStatus,
    workflowStatus,
    facts,
    openItems,
    actions,
    counselQuestions,
    counselAdvice,
    externalCounsel,
    decisions,
    sources,
    history,
    provenance,
  };
}
