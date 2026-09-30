import type { SupabaseClient } from "@supabase/supabase-js";
import { citationSupportsValue } from "@/lib/extraction/citation-matching";
import type {
  AIFinding,
  Assertion,
  AuditEvent,
  Asset,
  Counsel,
  CounselBrief,
  CounselEngagement,
  CounselOutput,
  Decision,
  Document,
  FindingCitation,
  HistoricalMatter,
  InstitutionalMemory,
  LegalIssue,
  Matter,
  MatterAsset,
  MatterAssetBundle,
  MatterBundle,
  MatterLink,
  MatterType,
  Party,
  SecurityInterest,
  TimelineEvent,
  Workstream,
} from "@/lib/types/matter";

export interface MatterDataService {
  allMatterIds(): Promise<string[]>;
  getMatter(matterId: string): Promise<MatterBundle | null>;
  getAllMatters(): Promise<MatterBundle[]>;
  getWorkstream(matterId: string, workstreamId: string): Promise<Workstream | null>;
}

type Row = Record<string, unknown>;

function throwIfError(error: { message: string } | null) {
  if (error) {
    throw new Error(`Supabase data request failed: ${error.message}`);
  }
}

async function selectRows(client: SupabaseClient, table: string, column?: string, value?: string) {
  let query = client.from(table).select("*");

  if (column && value) {
    query = query.eq(column, value);
  }

  const { data, error } = await query;
  throwIfError(error);
  return (data ?? []) as Row[];
}

async function selectRowsIn(
  client: SupabaseClient,
  table: string,
  column: string,
  values: string[]
) {
  if (!values.length) {
    return [];
  }

  const { data, error } = await client
    .from(table)
    .select("*")
    .in(column, values);
  throwIfError(error);
  return (data ?? []) as Row[];
}

function stringValue(row: Row, key: string) {
  return typeof row[key] === "string" ? (row[key] as string) : undefined;
}

function nullableString(row: Row, key: string) {
  return stringValue(row, key) ?? null;
}

function mapMatter(row: Row): Matter {
  return {
    matter_id: row.matter_id as string,
    matter_type_id: row.matter_type_id as string,
    matter_title: row.matter_title as string,
    matter_description: stringValue(row, "matter_description"),
    client_id: stringValue(row, "client_id"),
    counterparty_id: stringValue(row, "counterparty_id"),
    matter_status: row.matter_status as string,
    risk_rating: stringValue(row, "risk_rating"),
    outstanding_exposure_inr:
      typeof row.outstanding_exposure_inr === "number"
        ? row.outstanding_exposure_inr
        : undefined,
    created_date: stringValue(row, "created_date"),
    created_by: stringValue(row, "created_by"),
    template_id: nullableString(row, "template_id"),
    template_version: nullableString(row, "template_version"),
    workflow_stage: nullableString(row, "stage"),
  };
}

function mapWorkstream(row: Row): Workstream {
  return {
    workstream_id: row.workstream_id as string,
    matter_id: row.matter_id as string,
    parent_workstream_id: nullableString(row, "parent_workstream_id"),
    workstream_name: row.workstream_name as string,
    workstream_description: stringValue(row, "workstream_description"),
    workstream_type: stringValue(row, "workstream_type"),
    workstream_status: stringValue(row, "workstream_status"),
    created_date: stringValue(row, "created_date"),
    created_by: stringValue(row, "created_by"),
  };
}

function mapParty(row: Row, partyId: string): Party {
  return {
    party_id: partyId,
    party_name: row.display_name as string,
    party_type: row.kind as string,
  };
}

function mapDocument(row: Row, pages: Row[]): Document {
  const documentPages = pages
    .filter((page) => page.document_id === row.document_id)
    .sort((a, b) => Number(a.page_number ?? 0) - Number(b.page_number ?? 0));

  return {
    document_id: row.document_id as string,
    matter_id: row.matter_id as string,
    workstream_id: stringValue(row, "workstream_id"),
    document_title: row.document_title as string,
    document_type: row.document_type as string,
    document_date: nullableString(row, "document_date"),
    document_source: stringValue(row, "document_source"),
    document_status: stringValue(row, "document_status"),
    created_date: stringValue(row, "created_date"),
    created_by: stringValue(row, "created_by"),
    sections: documentPages.map((page) => ({
      section_id:
        stringValue(page, "section_id") ?? String(page.page_id).replace(/^PAGE-/, ""),
      document_id: row.document_id as string,
      section_title: stringValue(page, "section_title") ?? `Page ${page.page_number}`,
      section_content: (page.text_content as string) ?? "",
      section_order: Number(page.section_order ?? page.page_number ?? 0),
    })),
  };
}

function mapFinding(row: Row, citations: FindingCitation[]): AIFinding {
  return {
    finding_id: row.finding_id as string,
    matter_id: row.matter_id as string,
    workstream_id: stringValue(row, "workstream_id"),
    finding_type: row.finding_type as string,
    finding_title: stringValue(row, "finding_title"),
    finding_summary: stringValue(row, "finding_summary"),
    confidence_level: stringValue(row, "confidence_level"),
    requires_verification: stringValue(row, "requires_verification"),
    requires_legal_judgment: stringValue(row, "requires_legal_judgment"),
    created_date: stringValue(row, "created_date"),
    created_by: stringValue(row, "created_by"),
    citations: citations.filter((citation) => citation.finding_id === row.finding_id),
  };
}

function mapIssue(row: Row): LegalIssue {
  return {
    issue_id: row.issue_id as string,
    matter_id: row.matter_id as string,
    workstream_id: stringValue(row, "workstream_id"),
    issue_title: row.issue_title as string,
    issue_description: stringValue(row, "issue_description"),
    issue_status: stringValue(row, "status"),
    issue_priority: stringValue(row, "issue_priority") ?? stringValue(row, "severity"),
    requires_legal_judgment: row.requires_legal_judgment === true ? "YES" : "NO",
    created_date: stringValue(row, "created_date"),
    created_by: stringValue(row, "created_by"),
  };
}

function mapTimeline(row: Row): TimelineEvent {
  return {
    timeline_id: row.event_id as string,
    matter_id: row.matter_id as string,
    workstream_id: stringValue(row, "workstream_id"),
    event_date: row.event_date as string,
    event_type: row.event_type as string,
    event_title: row.event_title as string,
    event_description: stringValue(row, "event_description"),
    related_document_id: nullableString(row, "source_document_id"),
  };
}

function mapCounsel(row: Row): Counsel {
  return {
    counsel_id: row.counsel_id as string,
    counsel_name: row.counsel_name as string,
    counsel_type: row.counsel_type as string,
    firm_name: stringValue(row, "firm_name"),
    email: stringValue(row, "email"),
    phone: stringValue(row, "phone"),
    specialization: stringValue(row, "specialization"),
    counsel_status: stringValue(row, "counsel_status"),
  };
}

function mapBrief(row: Row, questions: Row[]): CounselBrief {
  return {
    brief_id: row.brief_id as string,
    engagement_id: row.engagement_id as string,
    brief_title: stringValue(row, "brief_title"),
    brief_date: stringValue(row, "brief_date"),
    brief_status: stringValue(row, "brief_status"),
    created_date: stringValue(row, "created_date"),
    created_by: stringValue(row, "created_by"),
    questions: questions
      .filter((question) => question.brief_id === row.brief_id)
      .map((question) => ({
        question_id: question.question_id as string,
        brief_id: question.brief_id as string,
        question_text: question.question_text as string,
        question_category: stringValue(question, "question_category"),
        question_priority: stringValue(question, "question_priority"),
        issue_id: nullableString(question, "issue_id"),
        created_date: stringValue(question, "created_date"),
      })),
  };
}

function mapCounselOutput(row: Row): CounselOutput {
  return {
    output_id: row.output_id as string,
    engagement_id: row.engagement_id as string,
    brief_id: stringValue(row, "brief_id"),
    output_type: stringValue(row, "output_type"),
    output_date: nullableString(row, "output_date"),
    output_status: stringValue(row, "output_status"),
    created_date: stringValue(row, "created_date"),
    opinion_summary: stringValue(row, "opinion_summary"),
    opinion_sections: (row.opinion_sections ?? []) as CounselOutput["opinion_sections"],
    review_points: (row.review_points ?? []) as CounselOutput["review_points"],
  };
}

function mapEngagement(
  row: Row,
  counsel: Counsel | undefined,
  briefs: CounselBrief[],
  outputs: CounselOutput[]
): CounselEngagement {
  return {
    engagement_id: row.engagement_id as string,
    matter_id: row.matter_id as string,
    counsel_id: row.counsel_id as string,
    engagement_type: stringValue(row, "engagement_type"),
    engagement_status: stringValue(row, "engagement_status"),
    engagement_date: stringValue(row, "engagement_date"),
    engagement_description: stringValue(row, "engagement_description"),
    budget_inr: typeof row.budget_inr === "number" ? row.budget_inr : undefined,
    created_date: stringValue(row, "created_date"),
    counsel,
    briefs: briefs.filter((brief) => brief.engagement_id === row.engagement_id),
    outputs: outputs.filter((output) => output.engagement_id === row.engagement_id),
  };
}

function mapDecision(row: Row): Decision {
  return {
    decision_id: row.decision_id as string,
    matter_id: row.matter_id as string,
    workstream_id: stringValue(row, "workstream_id"),
    decision_type: stringValue(row, "decision_type"),
    decision_title: stringValue(row, "decision_title"),
    decision_status: stringValue(row, "decision_status"),
    decision_summary: stringValue(row, "decision_summary"),
    decision_rationale: stringValue(row, "decision_rationale"),
    decision_date: stringValue(row, "decision_date"),
    decided_by: stringValue(row, "decided_by"),
    created_date: stringValue(row, "created_date"),
    selected_actions: (row.selected_actions ?? []) as string[],
    decision_factors: row.decision_factors as Decision["decision_factors"],
    alternatives_considered: row.alternatives_considered as Decision["alternatives_considered"],
    follow_up_actions: row.follow_up_actions as Decision["follow_up_actions"],
  };
}

function mapSecurityInterest(row: Row): SecurityInterest {
  return {
    security_interest_id: row.security_interest_id as string,
    security_type: row.security_type as string,
    security_description: stringValue(row, "security_description"),
    registration_number: nullableString(row, "registration_number"),
    registration_date: nullableString(row, "registration_date"),
    registration_authority: nullableString(row, "registration_authority"),
    security_value_inr: typeof row.security_value_inr === "number" ? row.security_value_inr : null,
    created_date: stringValue(row, "created_date"),
  };
}

async function mapMatterBundle(client: SupabaseClient, matterRow: Row): Promise<MatterBundle> {
  const matterId = matterRow.matter_id as string;
  const [workstreamRows, documentRows, findingRows, issueRows, timelineRows, entityRows, matterEntityRows, matterAssetRows, securityRows, counselRows, engagementRows, decisionRows, assertionRows, matterTypeRows, userRows, accessRows, historicalRows, policyRows, memoryRows, knowledgeRows, matterLinkRows, extractionRunRows, auditRows] = await Promise.all([
    selectRows(client, "workstream", "matter_id", matterId),
    selectRows(client, "document", "matter_id", matterId),
    selectRows(client, "legal_finding", "matter_id", matterId),
    selectRows(client, "issue", "matter_id", matterId),
    selectRows(client, "matter_timeline_event", "matter_id", matterId),
    selectRows(client, "entity"),
    selectRows(client, "matter_entity", "matter_id", matterId),
    selectRows(client, "matter_asset", "matter_id", matterId),
    selectRows(client, "security_interest"),
    selectRows(client, "counsel"),
    selectRows(client, "engagement", "matter_id", matterId),
    selectRows(client, "decision", "matter_id", matterId),
    selectRows(client, "assertion", "matter_id", matterId),
    selectRows(client, "matter_type", "matter_type_id", String(matterRow.matter_type_id)),
    selectRows(client, "app_user"),
    selectRows(client, "matter_access", "matter_id", matterId),
    selectRows(client, "historical_matter"),
    selectRows(client, "company_policy"),
    selectRows(client, "matter_institutional_memory", "matter_id", matterId),
    selectRows(client, "knowledge_item", "matter_id", matterId),
    selectRows(client, "matter_link"),
    selectRows(client, "extraction_run", "matter_id", matterId),
    selectRows(client, "audit_event", "matter_id", matterId),
  ]);

  const documentIds = documentRows.map((row) => row.document_id as string);
  const findingIds = findingRows.map((row) => row.finding_id as string);
  const assetIds = matterAssetRows.map((row) => row.asset_id as string);
  const engagementIds = engagementRows.map((row) => row.engagement_id as string);
  const pages = await selectRowsIn(client, "page", "document_id", documentIds);
  const citations = await selectRowsIn(client, "finding_citation", "finding_id", findingIds) as unknown as FindingCitation[];
  const assertionEvidenceRows = await selectRowsIn(client, "assertion_evidence", "assertion_id", assertionRows.map((row) => row.assertion_id as string));
  const assertionSpanRows = await selectRowsIn(client, "span", "span_id", assertionEvidenceRows.map((row) => row.span_id as string));
  const assertionPageRows = await selectRowsIn(client, "page", "page_id", assertionSpanRows.map((row) => row.page_id as string));
  const assets = await selectRowsIn(client, "asset", "asset_id", assetIds);
  const assetDocuments = await selectRowsIn(client, "asset_document", "asset_id", assetIds);
  const briefs = await selectRowsIn(client, "brief", "engagement_id", engagementIds);
  const briefIds = briefs.map((row) => row.brief_id as string);
  const questions = await selectRowsIn(client, "question", "brief_id", briefIds);
  const outputs = await selectRowsIn(client, "counsel_output", "engagement_id", engagementIds);
  const issueBasisRows = await selectRowsIn(client, "issue_basis", "issue_id", issueRows.map((row) => row.issue_id as string));
  const decisionIssueRows = await selectRowsIn(client, "decision_issue", "decision_id", decisionRows.map((row) => row.decision_id as string));

  const documents = documentRows.map((row) => mapDocument(row, pages));
  const findings = findingRows.map((row) => mapFinding(row, citations));
  const issues = issueRows.map(mapIssue);
  const workstreams = workstreamRows.map((row) => ({
    ...mapWorkstream(row),
    documents: documents.filter((document) => document.workstream_id === row.workstream_id),
    issues: issues.filter((issue) => issue.workstream_id === row.workstream_id),
    findings: findings.filter((finding) => finding.workstream_id === row.workstream_id),
  }));
  const counsel = new Map(counselRows.map((row) => [row.counsel_id as string, mapCounsel(row)]));
  const mappedBriefs = briefs.map((row) => mapBrief(row, questions));
  const mappedOutputs = outputs.map((row) => mapCounselOutput(row));
  const engagements = engagementRows.map((row) =>
    mapEngagement(row, counsel.get(row.counsel_id as string), mappedBriefs, mappedOutputs)
  );

  const matterAssets: MatterAssetBundle[] = matterAssetRows.map((matterAssetRow) => {
    const asset = assets.find((row) => row.asset_id === matterAssetRow.asset_id) as Row | undefined;
    const security = securityRows.find(
      (row) => row.security_interest_id === matterAssetRow.security_interest_id
    );
    return {
      matter_asset: matterAssetRow as unknown as MatterAsset,
      asset: (asset ?? { asset_id: matterAssetRow.asset_id }) as unknown as Asset,
      security_interest: security ? mapSecurityInterest(security) : null,
      documents: assetDocuments
        .filter((row) => row.asset_id === matterAssetRow.asset_id)
        .map((row) => ({
          asset_document: row as unknown as {
            asset_document_id: string;
            asset_id: string;
            document_id: string;
            created_date?: string;
          },
          document: documents.find((document) => document.document_id === row.document_id) as Document,
        })),
    };
  });

  const parties = new Map<string, Party>();
  for (const relation of matterEntityRows) {
    const entity = entityRows.find((row) => row.entity_id === relation.entity_id);
    if (entity) {
      const partyId = String(relation.entity_id).replace(/^ENTITY-/, "");
      parties.set(partyId, mapParty(entity, partyId));
    }
  }

  const matterType = matterTypeRows[0]
    ? ({
        matter_type_id: matterTypeRows[0].matter_type_id as string,
        matter_type_name: matterTypeRows[0].matter_type_name as string,
        description: stringValue(matterTypeRows[0], "description"),
        created_date: stringValue(matterTypeRows[0], "created_date"),
      } satisfies MatterType)
    : undefined;
  const users = new Map(userRows.map((row) => [row.user_id as string, row]));
  const access = accessRows.map((row) => {
    const user = users.get(row.user_id as string);
    return {
      access_id: row.access_id as string,
      matter_id: row.matter_id as string,
      user_id: row.user_id as string,
      access_level: row.access_level as string,
      granted_date: stringValue(row, "granted_date"),
      granted_by: stringValue(row, "granted_by"),
      user: user
        ? {
            user_id: user.user_id as string,
            user_name: user.user_name as string,
            user_email: stringValue(user, "user_email"),
            user_role: stringValue(user, "user_role"),
            department: stringValue(user, "department"),
          }
        : undefined,
    };
  });
  const memoryRow = memoryRows[0];
  const institutionalMemory = memoryRow
    ? ({
        outcome_status: memoryRow.outcome_status as string,
        knowledge_items: knowledgeRows.map((row) => ({
          knowledge_item_id: row.knowledge_item_id as string,
          knowledge_item_title: row.title as string,
          context: stringValue(row, "context") ?? undefined,
          lesson: (stringValue(row, "lesson") ?? row.content) as string,
          use_when: (stringValue(row, "use_when") ?? "") as string,
          matter_application: (stringValue(row, "matter_application") ?? "") as string,
          relevant_historical_matter_ids: (row.relevant_historical_matter_ids ?? []) as string[],
          source_ids: (row.source_ids ?? []) as string[],
        })),
        future_outcome_fields: (memoryRow.future_outcome_fields ?? {}) as InstitutionalMemory["future_outcome_fields"],
      } satisfies InstitutionalMemory)
    : undefined;

  return {
    matter: mapMatter(matterRow),
    matter_type: matterType,
    workstreams,
    documents,
    timeline: timelineRows.map(mapTimeline),
    issues,
    findings,
    decisions: decisionRows.map(mapDecision),
    counsel_engagements: engagements,
    assets: matterAssets,
    parties: {
      client: parties.get(String(matterRow.client_id)) as Party | undefined,
      counterparty: parties.get(String(matterRow.counterparty_id)) as Party | undefined,
    },
    historical_precedents: historicalRows as unknown as HistoricalMatter[],
    company_policies: policyRows,
    institutional_memory: institutionalMemory,
    access,
    assertions: assertionRows.map((row) => {
      const mappedCitations = assertionEvidenceRows
        .filter((evidence) => evidence.assertion_id === row.assertion_id && evidence.stance === "supports")
        .map((evidence) => {
          const span = assertionSpanRows.find((item) => item.span_id === evidence.span_id);
          const page = assertionPageRows.find((item) => item.page_id === span?.page_id);
          return {
            page_number: typeof page?.page_number === "number" ? page.page_number : undefined,
            quote: span?.text_content as string,
            trust_state: row.trust_state as string,
            document_id: page?.document_id as string | undefined,
            span_id: span?.span_id as string | undefined,
          };
        })
        .filter((citation) => citation.quote && citationSupportsValue(row.value, citation.quote));
      const runDocumentIds = extractionRunRows.find((run) => run.run_id === row.run_id)?.document_ids;
      const sourceDocumentIds = Array.from(new Set([
        ...(Array.isArray(runDocumentIds) ? runDocumentIds.filter((id): id is string => typeof id === "string") : []),
        ...mappedCitations.map((citation) => citation.document_id).filter((id): id is string => typeof id === "string"),
      ]));
      return {
        ...row,
        source_document_ids: sourceDocumentIds.length ? sourceDocumentIds : undefined,
        citations: mappedCitations,
      };
    }) as unknown as Assertion[],
    links: matterLinkRows
      .filter((row) => row.from_matter_id === matterId || row.to_matter_id === matterId)
      .map((row) => ({
        from_matter_id: row.from_matter_id as string,
        to_matter_id: row.to_matter_id as string,
        link_type: row.link_type as string,
      } satisfies MatterLink)),
    knowledgeRelations: {
      issueBasis: issueBasisRows.map((row) => ({ issue_id: row.issue_id as string, assertion_id: nullableString(row, "assertion_id") })),
      decisionIssues: decisionIssueRows.map((row) => ({ decision_id: row.decision_id as string, issue_id: row.issue_id as string })),
    },
    history: auditRows as unknown as AuditEvent[],
  };
}

export function createMatterDataService(client: SupabaseClient): MatterDataService {
  return {
    async allMatterIds() {
      const { data, error } = await client
        .from("matter")
        .select("matter_id")
        .order("matter_id");
      throwIfError(error);
      return (data ?? []).map((row) => row.matter_id as string);
    },

    async getMatter(matterId) {
      const { data, error } = await client
        .from("matter")
        .select("*")
        .eq("matter_id", matterId)
        .maybeSingle();
      throwIfError(error);
      return data ? mapMatterBundle(client, data as Row) : null;
    },

    async getAllMatters() {
      const ids = await this.allMatterIds();
      const matters = await Promise.all(ids.map((id) => this.getMatter(id)));
      return matters.filter((matter): matter is MatterBundle => Boolean(matter));
    },

    async getWorkstream(matterId, workstreamId) {
      const matter = await this.getMatter(matterId);
      return matter?.workstreams.find(
        (workstream) => workstream.workstream_id === workstreamId
      ) ?? null;
    },
  };
}
