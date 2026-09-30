-- MatterBridge Phase 2 server permissions
-- Apply only after reviewing the grants. This migration does not change RLS.

grant usage on schema public to service_role;

-- Server-side MatterBridge services require read access to the foundation
-- tables and the derived current_fact view.
grant select on table
  public.practice_area,
  public.app_user,
  public.matter_type_template,
  public.matter,
  public.matter_member,
  public.matter_link,
  public.workstream,
  public.document,
  public.page,
  public.span,
  public.entity,
  public.matter_entity,
  public.relation,
  public.assertion,
  public.assertion_evidence,
  public.asset,
  public.security_interest,
  public.matter_asset,
  public.asset_document,
  public.legal_finding,
  public.finding_citation,
  public.issue,
  public.issue_basis,
  public.matter_timeline_event,
  public.counsel,
  public.engagement,
  public.brief,
  public.question,
  public.counsel_output,
  public.decision,
  public.decision_issue,
  public.extraction_run,
  public.job,
  public.audit_event,
  public.knowledge_item
to service_role;

grant select on table public.current_fact to service_role;

-- The seed script uses Supabase upsert operations on these tables. Upsert
-- requires INSERT and UPDATE; the SELECT grant above supports server reads.
grant insert, update on table
  public.app_user,
  public.entity,
  public.matter,
  public.workstream,
  public.document,
  public.page,
  public.span,
  public.matter_entity,
  public.legal_finding,
  public.finding_citation,
  public.issue,
  public.matter_timeline_event,
  public.asset,
  public.security_interest,
  public.matter_asset,
  public.asset_document,
  public.counsel,
  public.engagement,
  public.brief,
  public.question,
  public.counsel_output,
  public.decision,
  public.assertion,
  public.matter_link
to service_role;
