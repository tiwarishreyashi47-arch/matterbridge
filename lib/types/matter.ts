export type LegalJudgmentFlag = "YES" | "NO";

export interface Matter {
  matter_id: string;
  matter_type_id: string;
  matter_title: string;
  matter_description?: string;
  client_id?: string;
  counterparty_id?: string;
  matter_status: string;
  risk_rating?: "LOW" | "MEDIUM" | "HIGH" | string;
  outstanding_exposure_inr?: number;
  created_date?: string;
  created_by?: string;
}

export interface MatterType {
  matter_type_id: string;
  matter_type_name: string;
  description?: string;
  created_date?: string;
}

export interface Party {
  party_id: string;
  party_name: string;
  party_type: string;
  registration_number?: string | null;
  registered_address?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  created_date?: string;
}

export interface Workstream {
  workstream_id: string;
  matter_id: string;
  parent_workstream_id?: string | null;
  workstream_name: string;
  workstream_description?: string;
  workstream_type?: string;
  workstream_status?: string;
  created_date?: string;
  created_by?: string;
  documents?: Document[];
  issues?: LegalIssue[];
  findings?: AIFinding[];
}

export interface Asset {
  asset_id: string;
  asset_name?: string;
  asset_type?: string;
  asset_description?: string;
  asset_status?: string;
  created_date?: string;
  created_by?: string;
}

export interface SecurityInterest {
  security_interest_id: string;
  security_type: string;
  security_description?: string;
  registration_number?: string | null;
  registration_date?: string | null;
  registration_authority?: string | null;
  security_value_inr?: number | null;
  created_date?: string;
}

export interface MatterAsset {
  matter_asset_id: string;
  matter_id: string;
  asset_id: string;
  security_interest_id?: string | null;
  created_date?: string;
}

export interface AssetDocument {
  asset_document: {
    asset_document_id: string;
    asset_id: string;
    document_id: string;
    created_date?: string;
  };
  document: Document;
}

export interface MatterAssetBundle {
  matter_asset: MatterAsset;
  asset: Asset;
  security_interest?: SecurityInterest | null;
  documents?: AssetDocument[];
}

export interface Document {
  document_id: string;
  matter_id: string;
  workstream_id?: string;
  document_title: string;
  document_type: string;
  document_date?: string | null;
  document_source?: string;
  document_status?: string;
  created_date?: string;
  created_by?: string;
  sections?: DocumentSection[];
}

export interface DocumentSection {
  section_id: string;
  document_id: string;
  section_title: string;
  section_content: string;
  section_order?: number;
}

export interface LegalIssue {
  issue_id: string;
  matter_id: string;
  workstream_id?: string;
  issue_title: string;
  issue_description?: string;
  issue_status?: string;
  issue_priority?: string;
  requires_legal_judgment?: LegalJudgmentFlag | string;
  created_date?: string;
  created_by?: string;
}

export interface AIFinding {
  finding_id: string;
  matter_id: string;
  workstream_id?: string;
  finding_type: string;
  finding_title?: string;
  finding_summary?: string;
  confidence_level?: string;
  requires_verification?: LegalJudgmentFlag | string;
  requires_legal_judgment?: LegalJudgmentFlag | string;
  created_date?: string;
  created_by?: string;
  citations?: FindingCitation[];
}

export interface FindingCitation {
  citation_id: string;
  finding_id: string;
  source_type: string;
  source_id: string;
  source_section?: string;
  citation_text?: string;
}

export interface Counsel {
  counsel_id: string;
  counsel_name: string;
  counsel_type: string;
  firm_name?: string;
  email?: string;
  phone?: string;
  specialization?: string;
  counsel_status?: string;
}

export interface CounselQuestion {
  question_id: string;
  brief_id: string;
  question_text: string;
  question_category?: string;
  question_priority?: string;
  created_date?: string;
}

export interface CounselBrief {
  brief_id: string;
  engagement_id: string;
  brief_title?: string;
  brief_date?: string;
  brief_status?: string;
  created_date?: string;
  created_by?: string;
  questions?: CounselQuestion[];
}

export interface CounselOutput {
  output_id: string;
  engagement_id: string;
  brief_id?: string;
  output_type?: string;
  output_date?: string | null;
  output_status?: string;
  created_date?: string;
  opinion_summary?: string;
  opinion_sections?: CounselOpinionSection[];
  review_points?: CounselOpinionReviewPoint[];
}

export interface CounselOpinionSection {
  opinion_section_id: string;
  section_type: string;
  section_title: string;
  section_summary: string;
  source_document_ids?: string[];
  source_section_ids?: string[];
}

export interface CounselOpinionReviewPoint {
  review_point_id: string;
  review_title: string;
  review_type: string;
  severity: string;
  counsel_position?: string;
  counsel_assertion?: string;
  matterbridge_review: string;
  recommended_action: string;
  suggested_question?: string;
  counsel_source_ids?: string[];
  company_source_ids?: string[];
  company_source_section_ids?: string[];
}

export interface CounselEngagement {
  engagement_id: string;
  matter_id: string;
  counsel_id: string;
  engagement_type?: string;
  engagement_status?: string;
  engagement_date?: string;
  engagement_description?: string;
  budget_inr?: number;
  created_date?: string;
  counsel?: Counsel;
  briefs?: CounselBrief[];
  outputs?: CounselOutput[];
}

export interface Decision {
  decision_id: string;
  matter_id: string;
  workstream_id?: string;
  decision_type?: string;
  decision_title?: string;
  decision_status?: string;
  decision_summary?: string;
  decision_rationale?: string;
  decision_date?: string;
  decided_by?: string;
  created_date?: string;
  selected_actions?: string[];
  decision_factors?: {
    legal_risk?: string;
    recovery_probability?: string | null;
    cost?: string;
    timeline?: string;
    commercial_considerations?: string;
    process_legal_considerations?: string;
  };
  alternatives_considered?: {
    alternative: string;
    decision: string;
    reason: string;
  }[];
  follow_up_actions?: {
    action_id: string;
    action: string;
    owner: string;
    status: string;
  }[];
  decision_finality?: string;
}

export interface TimelineEvent {
  timeline_id: string;
  matter_id: string;
  workstream_id?: string;
  event_date: string;
  event_type: string;
  event_title: string;
  event_description?: string;
  related_document_id?: string | null;
  created_date?: string;
}

export interface HistoricalMatter {
  historical_matter_id: string;
  matter_reference?: string;
  original_matter_id?: string;
  matter_type?: string;
  outcome?: string;
  outcome_type?: string;
  recovery_amount_inr?: number;
  recovery_percentage?: number;
  timeline_months?: number;
  lessons_learned?: string;
  outcome_summary?: string;
  created_date?: string;
}

export interface KnowledgeChunk {
  chunk_id: string;
  matter_id: string;
  matter_title?: string;
  matter_type_id?: string;
  risk_rating?: string;
  workstream_id?: string;
  workstream_name?: string;
  parent_workstream_id?: string | null;
  document_id?: string;
  document_title?: string;
  document_type?: string;
  document_date?: string;
  document_source?: string;
  document_status?: string;
  asset_ids?: string[];
  section_title?: string;
  section_order?: number;
  text: string;
  citation_label?: string;
  tags?: string[];
}

export interface EvidencePacketSource {
  chunk_id: string;
  matter_id: string;
  workstream_id?: string;
  document_id?: string;
  document_title?: string;
  document_type?: string;
  section_title?: string;
  citation_label?: string;
  text: string;
  score: number;
}

export interface EvidencePacket {
  scope: "matter" | "workstream";
  matter_id: string;
  workstream_id?: string;
  retrieval_query: string;
  sources: EvidencePacketSource[];
  required_output_states: [
    "SUPPORTED",
    "INFERRED",
    "INFORMATION_MISSING",
    "REQUIRES_LEGAL_JUDGMENT",
  ];
  guardrails: string[];
}

export interface MatterBundle {
  matter: Matter;
  matter_type?: MatterType;
  parties?: {
    client?: Party;
    counterparty?: Party;
  };
  workstreams: Workstream[];
  timeline?: TimelineEvent[];
  issues?: LegalIssue[];
  findings?: AIFinding[];
  decisions?: Decision[];
  counsel_engagements?: CounselEngagement[];
  assets?: MatterAssetBundle[];
  company_policies?: unknown[];
  historical_precedents?: HistoricalMatter[];
  institutional_memory?: InstitutionalMemory;
  access?: unknown[];
}

export interface InstitutionalMemory {
  outcome_status: string;
  knowledge_items: InstitutionalKnowledgeItem[];
  future_outcome_fields: {
    recovery_route?: string | null;
    zenith_satisfaction_verified?: string | null;
    property_enforced?: string | null;
    guarantee_invoked?: string | null;
    receivables_charge_recovery?: string | null;
    settlement?: string | null;
    final_recovery_result?: string | null;
    material_external_legal_cost?: string | null;
    total_duration?: string | null;
    procedural_obstacles?: string | null;
    strategy_effectiveness?: string | null;
  };
}

export interface InstitutionalKnowledgeItem {
  knowledge_item_id: string;
  knowledge_item_title: string;
  context?: string;
  lesson: string;
  use_when: string;
  matter_application: string;
  relevant_historical_matter_ids?: string[];
  source_ids?: string[];
}
