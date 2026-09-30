-- MatterBridge Phase 1 parity extension
-- Extends the applied foundation without replacing existing tables or rows.

create table if not exists matter_type (
  matter_type_id text primary key,
  matter_type_name text not null,
  description text,
  created_date date
);

create table if not exists matter_access (
  access_id text primary key,
  matter_id text not null references matter(matter_id) on delete cascade,
  user_id text not null references app_user(user_id),
  access_level text not null,
  granted_date date,
  granted_by text references app_user(user_id)
);

create index if not exists matter_access_matter_idx on matter_access(matter_id);

create table if not exists historical_matter (
  historical_matter_id text primary key,
  matter_reference text,
  original_matter_id text,
  matter_type text,
  outcome text,
  outcome_type text,
  recovery_amount_inr numeric,
  recovery_percentage numeric,
  timeline_months numeric,
  lessons_learned text,
  outcome_summary text,
  created_date date
);

create table if not exists company_policy (
  policy_id text primary key,
  policy_name text not null,
  policy_category text,
  policy_description text,
  effective_date date,
  policy_status text
);

create table if not exists matter_institutional_memory (
  matter_id text primary key references matter(matter_id) on delete cascade,
  outcome_status text not null,
  future_outcome_fields jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table knowledge_item
  add column if not exists context text,
  add column if not exists lesson text,
  add column if not exists use_when text,
  add column if not exists matter_application text,
  add column if not exists relevant_historical_matter_ids jsonb not null default '[]'::jsonb,
  add column if not exists source_ids jsonb not null default '[]'::jsonb;

alter table page
  add column if not exists section_id text,
  add column if not exists section_title text,
  add column if not exists section_order integer;

create index if not exists knowledge_item_matter_idx on knowledge_item(matter_id);
create index if not exists knowledge_item_source_idx on knowledge_item using gin(source_ids);
create index if not exists page_document_section_idx on page(document_id, section_order);

comment on table matter_access is
  'Matter-scoped access records used by the Phase 1 counsel workspace and future workflow seams.';

comment on table matter_institutional_memory is
  'Matter-level institutional-memory state; knowledge_item stores the reusable lessons.';

comment on table page is
  'Page rows retain original Phase 1 section IDs, titles, and ordering for citation/UI parity.';

grant select, insert, update on table
  public.matter_type,
  public.matter_access,
  public.historical_matter,
  public.company_policy,
  public.matter_institutional_memory
to service_role;

grant select, insert, update on table public.knowledge_item to service_role;
