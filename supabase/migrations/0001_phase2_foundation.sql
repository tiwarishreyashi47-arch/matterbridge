-- MatterBridge Phase 2 foundation
-- Apply with the Supabase CLI or SQL editor after reviewing the project.
-- IDs intentionally remain text so existing MAT-001/MAT-002 and source IDs
-- remain traceable during the JSON -> Postgres seed transition.

create extension if not exists pgcrypto;
create extension if not exists vector with schema extensions;

create table if not exists practice_area (
  practice_area_id text primary key,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists app_user (
  user_id text primary key,
  user_name text not null,
  user_email text,
  user_role text,
  department text,
  created_at timestamptz not null default now()
);

create table if not exists matter_type_template (
  template_id text not null,
  version text not null,
  practice_area_id text references practice_area(practice_area_id),
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (template_id, version)
);

create table if not exists matter (
  matter_id text primary key,
  matter_type_id text,
  matter_title text not null,
  matter_description text,
  client_id text,
  counterparty_id text,
  matter_status text not null,
  risk_rating text,
  outstanding_exposure_inr numeric,
  practice_area_id text references practice_area(practice_area_id),
  template_id text,
  template_version text,
  owner_id text references app_user(user_id),
  stage text,
  next_deadline date,
  created_date date,
  created_by text,
  created_at timestamptz not null default now(),
  foreign key (template_id, template_version)
    references matter_type_template(template_id, version)
);

create table if not exists matter_member (
  matter_id text not null references matter(matter_id) on delete cascade,
  user_id text not null references app_user(user_id),
  role text not null check (role in ('lead', 'member', 'reviewer')),
  created_at timestamptz not null default now(),
  primary key (matter_id, user_id)
);

create table if not exists matter_link (
  from_matter_id text not null references matter(matter_id) on delete cascade,
  to_matter_id text not null references matter(matter_id) on delete cascade,
  link_type text not null check (link_type in ('lifecycle_successor', 'related', 'precedent')),
  created_at timestamptz not null default now(),
  primary key (from_matter_id, to_matter_id, link_type),
  check (from_matter_id <> to_matter_id)
);

create table if not exists workstream (
  workstream_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  parent_workstream_id text references workstream(workstream_id),
  workstream_name text not null,
  workstream_description text,
  workstream_type text,
  workstream_status text,
  created_date date,
  created_by text
);

create table if not exists document (
  document_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  workstream_id text references workstream(workstream_id),
  document_title text not null,
  document_type text not null,
  document_date date,
  document_source text,
  document_status text,
  file_path text,
  file_hash text,
  zone text,
  created_date date,
  created_by text
);

create unique index if not exists document_matter_file_hash_idx
  on document(matter_id, file_hash)
  where file_hash is not null;

create table if not exists page (
  page_id text primary key,
  document_id text not null references document(document_id) on delete cascade,
  page_number integer not null,
  text_content text not null default '',
  width numeric,
  height numeric,
  unique (document_id, page_number)
);

create table if not exists span (
  span_id text primary key,
  page_id text not null references page(page_id) on delete cascade,
  start_char integer,
  end_char integer,
  bbox jsonb,
  text_content text not null,
  check (start_char is null or start_char >= 0),
  check (end_char is null or end_char >= coalesce(start_char, 0))
);

create table if not exists entity (
  entity_id text primary key,
  kind text not null,
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists matter_entity (
  matter_id text not null references matter(matter_id) on delete cascade,
  entity_id text not null references entity(entity_id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  primary key (matter_id, entity_id, role)
);

create table if not exists relation (
  relation_id text primary key,
  from_entity_id text not null references entity(entity_id),
  to_entity_id text not null references entity(entity_id),
  relation_type text not null,
  assertion_id text,
  created_at timestamptz not null default now(),
  check (from_entity_id <> to_entity_id)
);

create table if not exists assertion (
  assertion_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  entity_id text references entity(entity_id),
  attribute text not null,
  value jsonb not null,
  trust_state text not null check (trust_state in ('SUPPORTED', 'INFERRED', 'INFORMATION_MISSING', 'REQUIRES_LEGAL_JUDGMENT')),
  status text not null check (status in ('proposed', 'accepted', 'rejected', 'superseded')),
  source text not null check (source in ('extraction', 'user', 'seed', 'rule')),
  run_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists assertion_evidence (
  assertion_id text not null references assertion(assertion_id) on delete cascade,
  span_id text not null references span(span_id) on delete cascade,
  stance text not null check (stance in ('supports', 'contradicts')),
  created_at timestamptz not null default now(),
  primary key (assertion_id, span_id, stance)
);

create table if not exists asset (
  asset_id text primary key,
  asset_name text,
  asset_type text,
  asset_description text,
  asset_status text,
  created_date date,
  created_by text
);

create table if not exists security_interest (
  security_interest_id text primary key,
  security_type text not null,
  security_description text,
  registration_number text,
  registration_date date,
  registration_authority text,
  security_value_inr numeric,
  created_date date
);

create table if not exists matter_asset (
  matter_asset_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  asset_id text not null references asset(asset_id),
  security_interest_id text references security_interest(security_interest_id),
  created_date date
);

create table if not exists asset_document (
  asset_document_id text primary key,
  asset_id text not null references asset(asset_id) on delete cascade,
  document_id text not null references document(document_id) on delete cascade,
  created_date date,
  unique (asset_id, document_id)
);

create table if not exists legal_finding (
  finding_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  workstream_id text references workstream(workstream_id),
  finding_type text not null,
  finding_title text,
  finding_summary text,
  confidence_level text,
  requires_verification text,
  requires_legal_judgment text,
  created_date date,
  created_by text
);

create table if not exists finding_citation (
  citation_id text primary key,
  finding_id text not null references legal_finding(finding_id) on delete cascade,
  source_type text not null,
  source_id text not null,
  source_section text,
  citation_text text
);

create table if not exists issue (
  issue_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  workstream_id text references workstream(workstream_id),
  rule_code text,
  rule_version text,
  issue_title text not null,
  issue_description text,
  status text not null,
  severity text,
  issue_priority text,
  requires_legal_judgment boolean,
  created_date date,
  created_by text
);

create table if not exists issue_basis (
  issue_id text not null references issue(issue_id) on delete cascade,
  assertion_id text references assertion(assertion_id),
  missing_item_key text,
  basis_type text not null,
  created_at timestamptz not null default now(),
  check (assertion_id is not null or missing_item_key is not null),
  primary key (issue_id, basis_type, assertion_id, missing_item_key)
);

create table if not exists matter_timeline_event (
  event_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  workstream_id text references workstream(workstream_id),
  event_date date,
  event_title text not null,
  event_description text,
  event_type text,
  source_document_id text references document(document_id)
);

create table if not exists counsel (
  counsel_id text primary key,
  counsel_name text not null,
  counsel_type text not null,
  firm_name text,
  email text,
  phone text,
  specialization text,
  counsel_status text
);

create table if not exists engagement (
  engagement_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  counsel_id text not null references counsel(counsel_id),
  engagement_type text,
  engagement_status text,
  engagement_date date,
  engagement_description text,
  budget_inr numeric,
  created_date date
);

create table if not exists brief (
  brief_id text primary key,
  engagement_id text not null references engagement(engagement_id) on delete cascade,
  brief_title text,
  brief_date date,
  brief_status text,
  created_date date,
  created_by text
);

create table if not exists question (
  question_id text primary key,
  brief_id text not null references brief(brief_id) on delete cascade,
  issue_id text references issue(issue_id),
  question_text text not null,
  question_category text,
  question_priority text,
  created_date date
);

create table if not exists counsel_output (
  output_id text primary key,
  engagement_id text not null references engagement(engagement_id) on delete cascade,
  brief_id text references brief(brief_id),
  output_type text,
  output_date date,
  output_status text,
  opinion_summary text,
  opinion_sections jsonb not null default '[]'::jsonb,
  review_points jsonb not null default '[]'::jsonb,
  created_date date
);

create table if not exists decision (
  decision_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  workstream_id text references workstream(workstream_id),
  decision_type text,
  decision_title text,
  decision_status text,
  decision_summary text,
  decision_rationale text,
  decision_date date,
  decided_by text references app_user(user_id),
  selected_actions jsonb not null default '[]'::jsonb,
  decision_factors jsonb not null default '{}'::jsonb,
  alternatives_considered jsonb not null default '[]'::jsonb,
  follow_up_actions jsonb not null default '[]'::jsonb,
  created_date date
);

create table if not exists decision_issue (
  decision_id text not null references decision(decision_id) on delete cascade,
  issue_id text not null references issue(issue_id),
  relationship text not null default 'considers',
  primary key (decision_id, issue_id)
);

create table if not exists extraction_run (
  run_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  model text,
  prompt_version text,
  template_id text,
  template_version text,
  document_ids jsonb not null default '[]'::jsonb,
  status text,
  started_at timestamptz,
  completed_at timestamptz
);

create table if not exists job (
  job_id text primary key,
  matter_id text references matter(matter_id) on delete cascade,
  document_id text references document(document_id) on delete cascade,
  job_type text not null,
  status text not null,
  attempt_count integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists audit_event (
  audit_event_id text primary key,
  matter_id text references matter(matter_id) on delete cascade,
  actor_user_id text references app_user(user_id),
  event_type text not null,
  entity_type text,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists knowledge_item (
  knowledge_item_id text primary key,
  matter_id text references matter(matter_id) on delete cascade,
  title text not null,
  content text not null,
  source text,
  assertion_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workstream_matter_idx on workstream(matter_id);
create index if not exists document_matter_idx on document(matter_id);
create index if not exists document_workstream_idx on document(workstream_id);
create index if not exists assertion_matter_attribute_idx on assertion(matter_id, entity_id, attribute);
create index if not exists issue_matter_workstream_idx on issue(matter_id, workstream_id);
create index if not exists finding_matter_workstream_idx on legal_finding(matter_id, workstream_id);
create index if not exists timeline_matter_date_idx on matter_timeline_event(matter_id, event_date);
create index if not exists engagement_matter_idx on engagement(matter_id);

create or replace view current_fact as
select distinct on (a.matter_id, a.entity_id, a.attribute)
  a.assertion_id,
  a.matter_id,
  a.entity_id,
  a.attribute,
  a.value,
  a.trust_state,
  a.status,
  a.source,
  a.run_id,
  a.created_at,
  a.updated_at
from assertion a
where a.status in ('accepted', 'proposed')
order by
  a.matter_id,
  a.entity_id,
  a.attribute,
  case when a.source = 'user' then 0 else 1 end,
  case when a.status = 'accepted' then 0 else 1 end,
  a.updated_at desc,
  a.assertion_id desc;

comment on view current_fact is
  'Latest non-rejected assertion per matter/entity/attribute. User assertions take precedence, followed by accepted seed/extraction assertions, then proposed assertions.';

comment on table document is
  'Matter documents reference Supabase Storage through file_path/file_hash. Create the private matter-documents bucket in Storage before enabling uploads.';

comment on table knowledge_item is
  'The vector extension is enabled for future embeddings. Embedding dimensions are intentionally deferred until the provider contract is selected.';
