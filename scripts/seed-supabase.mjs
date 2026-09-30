import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = resolve(import.meta.dirname, "..");

async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
}

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function uniqueById(rows, key) {
  return Array.from(new Map(rows.filter(Boolean).map((row) => [row[key], row])).values());
}

function flattenDocuments(bundle) {
  const workstreamDocuments = bundle.workstreams.flatMap(
    (workstream) => workstream.documents ?? []
  );
  const assetDocuments = (bundle.assets ?? []).flatMap((assetBundle) =>
    (assetBundle.documents ?? []).map((item) => item.document)
  );
  return uniqueById([...workstreamDocuments, ...assetDocuments], "document_id");
}

function flattenAssets(bundle) {
  return (bundle.assets ?? []).map((assetBundle) => ({
    ...assetBundle.asset,
    matter_asset: assetBundle.matter_asset,
    security_interest: assetBundle.security_interest,
    documents: assetBundle.documents ?? [],
  }));
}

function matterRows(bundle) {
  return {
    ...bundle.matter,
    practice_area_id: null,
    template_id: null,
    template_version: null,
    owner_id: bundle.matter.created_by ?? null,
    stage: null,
    next_deadline: null,
  };
}

function matterAssertions(bundle) {
  const fields = [
    ["matter_title", bundle.matter.matter_title],
    ["matter_status", bundle.matter.matter_status],
    ["risk_rating", bundle.matter.risk_rating],
    ["outstanding_exposure_inr", bundle.matter.outstanding_exposure_inr],
  ];

  return fields.map(([attribute, value]) => ({
    assertion_id: `SEED-${bundle.matter.matter_id}-${attribute}`,
    matter_id: bundle.matter.matter_id,
    entity_id: null,
    attribute,
    value: { value },
    trust_state: "SUPPORTED",
    status: "accepted",
    source: "seed",
    run_id: null,
  }));
}

async function upsert(client, table, rows, onConflict) {
  if (!rows.length) return;
  const { error } = await client.from(table).upsert(rows, { onConflict });
  if (error) throw new Error(`${table}: ${error.message}`);
}

const [users, parties, matterTypes, companyPolicies, matter001, matter002] = await Promise.all([
  readJson("data/raw/users.json"),
  readJson("data/raw/parties.json"),
  readJson("data/raw/matter_types.json"),
  readJson("data/raw/company_policies.json"),
  readJson("data/matters/MAT-001.json"),
  readJson("data/matters/MAT-002.json"),
]);

const client = createClient(required("NEXT_PUBLIC_SUPABASE_URL"), required("SUPABASE_SECRET_KEY"), {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
const bundles = [matter001, matter002];

await upsert(client, "app_user", users.map((user) => ({
  user_id: user.user_id,
  user_name: user.user_name,
  user_email: user.user_email ?? null,
  user_role: user.user_role ?? null,
  department: user.department ?? null,
})), "user_id");

await upsert(client, "entity", parties.map((party) => ({
  entity_id: `ENTITY-${party.party_id}`,
  kind: party.party_type,
  display_name: party.party_name,
})), "entity_id");

await upsert(client, "matter_type", matterTypes.map((matterType) => ({
  matter_type_id: matterType.matter_type_id,
  matter_type_name: matterType.matter_type_name,
  description: matterType.description ?? null,
  created_date: matterType.created_date ?? null,
})), "matter_type_id");

await upsert(client, "company_policy", companyPolicies.map((policy) => ({
  policy_id: policy.policy_id,
  policy_name: policy.policy_name,
  policy_category: policy.policy_category ?? null,
  policy_description: policy.policy_description ?? null,
  effective_date: policy.effective_date ?? null,
  policy_status: policy.policy_status ?? null,
})), "policy_id");

await upsert(client, "matter", bundles.map(matterRows), "matter_id");

await upsert(client, "workstream", bundles.flatMap((bundle) => bundle.workstreams.map((workstream) => ({
  workstream_id: workstream.workstream_id,
  matter_id: workstream.matter_id,
  parent_workstream_id: workstream.parent_workstream_id ?? null,
  workstream_name: workstream.workstream_name,
  workstream_description: workstream.workstream_description ?? null,
  workstream_type: workstream.workstream_type ?? null,
  workstream_status: workstream.workstream_status ?? null,
  created_date: workstream.created_date ?? null,
  created_by: workstream.created_by ?? null,
}))), "workstream_id");

const documents = bundles.flatMap(flattenDocuments);
await upsert(client, "document", documents.map((document) => ({
  document_id: document.document_id,
  matter_id: document.matter_id,
  workstream_id: document.workstream_id ?? null,
  document_title: document.document_title,
  document_type: document.document_type,
  document_date: document.document_date ?? null,
  document_source: document.document_source ?? null,
  document_status: document.document_status ?? null,
  created_date: document.created_date ?? null,
  created_by: document.created_by ?? null,
})), "document_id");

const pages = documents.flatMap((document) =>
  (document.sections ?? []).map((section) => ({
    page_id: `PAGE-${section.section_id}`,
    document_id: document.document_id,
    page_number: section.section_order ?? 1,
    text_content: section.section_content,
    section_id: section.section_id,
    section_title: section.section_title,
    section_order: section.section_order ?? 1,
  }))
);
await upsert(client, "page", pages, "page_id");
await upsert(client, "span", pages.map((page) => ({
  span_id: `SPAN-${page.page_id.replace("PAGE-", "")}`,
  page_id: page.page_id,
  start_char: 0,
  end_char: page.text_content.length,
  bbox: null,
  text_content: page.text_content,
})), "span_id");

await upsert(client, "matter_entity", bundles.flatMap((bundle) => [
  { matter_id: bundle.matter.matter_id, entity_id: `ENTITY-${bundle.matter.client_id}`, role: "client" },
  { matter_id: bundle.matter.matter_id, entity_id: `ENTITY-${bundle.matter.counterparty_id}`, role: "counterparty" },
]), "matter_id,entity_id,role");

await upsert(client, "matter_access", bundles.flatMap((bundle) => (bundle.access ?? []).map((access) => ({
  access_id: access.access_id,
  matter_id: access.matter_id,
  user_id: access.user_id,
  access_level: access.access_level,
  granted_date: access.granted_date ?? null,
  granted_by: access.granted_by ?? null,
}))), "access_id");

await upsert(client, "historical_matter", uniqueById(
  bundles.flatMap((bundle) => bundle.historical_precedents ?? []),
  "historical_matter_id"
), "historical_matter_id");

await upsert(client, "matter_institutional_memory", bundles
  .filter((bundle) => bundle.institutional_memory)
  .map((bundle) => ({
    matter_id: bundle.matter.matter_id,
    outcome_status: bundle.institutional_memory.outcome_status,
    future_outcome_fields: bundle.institutional_memory.future_outcome_fields ?? {},
  })), "matter_id");

await upsert(client, "knowledge_item", bundles.flatMap((bundle) =>
  (bundle.institutional_memory?.knowledge_items ?? []).map((item) => ({
    knowledge_item_id: item.knowledge_item_id,
    matter_id: bundle.matter.matter_id,
    title: item.knowledge_item_title,
    content: item.lesson,
    source: "institutional_memory",
    assertion_ids: [],
    context: item.context ?? null,
    lesson: item.lesson,
    use_when: item.use_when,
    matter_application: item.matter_application,
    relevant_historical_matter_ids: item.relevant_historical_matter_ids ?? [],
    source_ids: item.source_ids ?? [],
  }))
), "knowledge_item_id");

await upsert(client, "legal_finding", bundles.flatMap((bundle) => (bundle.findings ?? []).map((finding) => ({
  finding_id: finding.finding_id,
  matter_id: finding.matter_id,
  workstream_id: finding.workstream_id ?? null,
  finding_type: finding.finding_type,
  finding_title: finding.finding_title ?? null,
  finding_summary: finding.finding_summary ?? null,
  confidence_level: finding.confidence_level ?? null,
  requires_verification: finding.requires_verification ?? null,
  requires_legal_judgment: finding.requires_legal_judgment ?? null,
  created_date: finding.created_date ?? null,
  created_by: finding.created_by ?? null,
}))), "finding_id");
await upsert(client, "finding_citation", bundles.flatMap((bundle) =>
  (bundle.findings ?? []).flatMap((finding) => (finding.citations ?? []).map((citation) => ({
    citation_id: citation.citation_id,
    finding_id: citation.finding_id,
    source_type: citation.source_type,
    source_id: citation.source_id,
    source_section: citation.source_section ?? null,
    citation_text: citation.citation_text ?? null,
  })))
), "citation_id");

await upsert(client, "issue", bundles.flatMap((bundle) => (bundle.issues ?? []).map((issue) => ({
  issue_id: issue.issue_id,
  matter_id: issue.matter_id,
  workstream_id: issue.workstream_id ?? null,
  rule_code: null,
  rule_version: null,
  issue_title: issue.issue_title,
  issue_description: issue.issue_description ?? null,
  status: issue.issue_status ?? "ACTIVE",
  severity: issue.issue_priority ?? null,
  issue_priority: issue.issue_priority ?? null,
  requires_legal_judgment: issue.requires_legal_judgment === "YES",
  created_date: issue.created_date ?? null,
  created_by: issue.created_by ?? null,
}))), "issue_id");

await upsert(client, "matter_timeline_event", bundles.flatMap((bundle) => (bundle.timeline ?? []).map((event) => ({
  event_id: event.timeline_id,
  matter_id: event.matter_id,
  workstream_id: event.workstream_id ?? null,
  event_date: event.event_date,
  event_title: event.event_title,
  event_description: event.event_description ?? null,
  event_type: event.event_type,
  source_document_id: event.related_document_id ?? null,
}))), "event_id");

const assets = bundles.flatMap(flattenAssets);
await upsert(client, "asset", assets.map((asset) => ({
  asset_id: asset.asset_id,
  asset_name: asset.asset_name ?? null,
  asset_type: asset.asset_type ?? null,
  asset_description: asset.asset_description ?? null,
  asset_status: asset.asset_status ?? null,
  created_date: asset.created_date ?? null,
  created_by: asset.created_by ?? null,
})), "asset_id");
await upsert(client, "security_interest", assets.map((asset) => asset.security_interest).filter(Boolean), "security_interest_id");
await upsert(client, "matter_asset", assets.map((asset) => asset.matter_asset), "matter_asset_id");
await upsert(client, "asset_document", assets.flatMap((asset) => asset.documents.map((item) => ({
  asset_document_id: item.asset_document.asset_document_id,
  asset_id: item.asset_document.asset_id,
  document_id: item.asset_document.document_id,
  created_date: item.asset_document.created_date ?? null,
}))), "asset_document_id");

await upsert(client, "counsel", bundles.flatMap((bundle) => (bundle.counsel_engagements ?? []).map((engagement) => engagement.counsel).filter(Boolean)), "counsel_id");
await upsert(client, "engagement", bundles.flatMap((bundle) => (bundle.counsel_engagements ?? []).map((engagement) => ({
  engagement_id: engagement.engagement_id,
  matter_id: engagement.matter_id,
  counsel_id: engagement.counsel_id,
  engagement_type: engagement.engagement_type ?? null,
  engagement_status: engagement.engagement_status ?? null,
  engagement_date: engagement.engagement_date ?? null,
  engagement_description: engagement.engagement_description ?? null,
  budget_inr: engagement.budget_inr ?? null,
  created_date: engagement.created_date ?? null,
}))), "engagement_id");
const briefs = bundles.flatMap((bundle) => (bundle.counsel_engagements ?? []).flatMap((engagement) => engagement.briefs ?? []));
await upsert(client, "brief", briefs.map((brief) => ({
  brief_id: brief.brief_id,
  engagement_id: brief.engagement_id,
  brief_title: brief.brief_title ?? null,
  brief_date: brief.brief_date ?? null,
  brief_status: brief.brief_status ?? null,
  created_date: brief.created_date ?? null,
  created_by: brief.created_by ?? null,
})), "brief_id");
await upsert(client, "question", briefs.flatMap((brief) => (brief.questions ?? []).map((question) => ({
  question_id: question.question_id,
  brief_id: question.brief_id,
  issue_id: null,
  question_text: question.question_text,
  question_category: question.question_category ?? null,
  question_priority: question.question_priority ?? null,
  created_date: question.created_date ?? null,
}))), "question_id");
await upsert(client, "counsel_output", bundles.flatMap((bundle) => (bundle.counsel_engagements ?? []).flatMap((engagement) => (engagement.outputs ?? []).map((output) => ({
  output_id: output.output_id,
  engagement_id: output.engagement_id,
  brief_id: output.brief_id ?? null,
  output_type: output.output_type ?? null,
  output_date: output.output_date ?? null,
  output_status: output.output_status ?? null,
  opinion_summary: output.opinion_summary ?? null,
  opinion_sections: output.opinion_sections ?? [],
  review_points: output.review_points ?? [],
  created_date: output.created_date ?? null,
})))), "output_id");

await upsert(client, "decision", bundles.flatMap((bundle) => (bundle.decisions ?? []).map((decision) => ({
  decision_id: decision.decision_id,
  matter_id: decision.matter_id,
  workstream_id: decision.workstream_id ?? null,
  decision_type: decision.decision_type ?? null,
  decision_title: decision.decision_title ?? null,
  decision_status: decision.decision_status ?? null,
  decision_summary: decision.decision_summary ?? null,
  decision_rationale: decision.decision_rationale ?? null,
  decision_date: decision.decision_date ?? null,
  decided_by: decision.decided_by ?? null,
  selected_actions: decision.selected_actions ?? [],
  decision_factors: decision.decision_factors ?? {},
  alternatives_considered: decision.alternatives_considered ?? [],
  follow_up_actions: decision.follow_up_actions ?? [],
  created_date: decision.created_date ?? null,
}))), "decision_id");

await upsert(client, "assertion", bundles.flatMap(matterAssertions), "assertion_id");

await upsert(client, "matter", [{
  matter_id: "MAT-003",
  matter_type_id: "MT-003",
  matter_title: "Meridian Facility — Original Disbursement",
  matter_description: "Closed lifecycle predecessor for the Meridian Components facility.",
  client_id: "PARTY-001",
  counterparty_id: "PARTY-002",
  matter_status: "CLOSED",
  risk_rating: "LOW",
  outstanding_exposure_inr: 0,
  practice_area_id: null,
  template_id: null,
  template_version: null,
  owner_id: "USR-001",
  stage: "CLOSED",
  next_deadline: null,
  created_date: "2024-03-01",
  created_by: "USR-001",
}], "matter_id");
await upsert(client, "matter_link", [{
  from_matter_id: "MAT-003",
  to_matter_id: "MAT-001",
  link_type: "lifecycle_successor",
}], "from_matter_id,to_matter_id,link_type");

console.log("Seeded MAT-001 and MAT-002 foundation data, six existing users, and stub MAT-003.");
