import "server-only";

import fs from "node:fs";
import path from "node:path";

type Row = Record<string, unknown>;
type Database = Record<string, Row[]>;

// Vercel's function filesystem is read-only outside /tmp. The local adapter
// is still useful for the proposal demo, so keep its ephemeral state in the
// writable runtime directory when deployed there.
const runtimeRoot = process.env.VERCEL ? path.join("/tmp", "matterbridge") : path.join(process.cwd(), "tmp");
const root = path.join(runtimeRoot, "local-data");
const databasePath = path.join(root, "database.json");
const storageRoot = path.join(runtimeRoot, "local-storage");

function ensureStore() {
  fs.mkdirSync(root, { recursive: true });
  fs.mkdirSync(storageRoot, { recursive: true });
  if (!fs.existsSync(databasePath)) fs.writeFileSync(databasePath, JSON.stringify({}, null, 2));
}

function readDatabase(): Database {
  ensureStore();
  try {
    return JSON.parse(fs.readFileSync(databasePath, "utf8")) as Database;
  } catch {
    return {};
  }
}

function writeDatabase(database: Database) {
  ensureStore();
  const temporaryPath = `${databasePath}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(database, null, 2));
  fs.renameSync(temporaryPath, databasePath);
}

/**
 * Seed a small, proposal-friendly local workspace on first run. The local
 * adapter is intentionally self-contained so a reviewer can run the demo
 * without Supabase credentials or a remote write path.
 */
export function ensureLocalDemoData() {
  const database = readDatabase();
  if ((database.matter ?? []).length) return;

  const today = new Date().toISOString().slice(0, 10);
  const rows: Database = {
    matter_type: [
      { matter_type_id: "MT-EMP", matter_type_name: "Employment / HR Review", description: "A focused employment review workflow.", created_date: today },
      { matter_type_id: "MT-FIN", matter_type_name: "Financing Matter", description: "A focused financing review workflow.", created_date: today },
    ],
    app_user: [
      { user_id: "USER-DEMO-MANAGER", user_name: "Demo Legal Manager", user_email: "manager@example.test", user_role: "MANAGER", department: "Legal" },
      { user_id: "USER-DEMO-COUNSEL", user_name: "Northstar Legal", user_email: "counsel@example.test", user_role: "EXTERNAL_COUNSEL", department: "External Counsel" },
    ],
    matter: [
      { matter_id: "MAT-101", matter_type_id: "MT-EMP", matter_title: "Project Atlas — Employee Review", matter_description: "A simple employment matter showing document intake, issue triage, and counsel referral.", client_id: "DEMO-CO", counterparty_id: "DEMO-EMPLOYEE", matter_status: "OPEN", risk_rating: "MEDIUM", outstanding_exposure_inr: 0, stage: "COUNSEL_REVIEW", template_id: "employment", template_version: "v1", created_date: today, created_by: "USER-DEMO-MANAGER" },
      { matter_id: "MAT-102", matter_type_id: "MT-FIN", matter_title: "Northstar — Financing Renewal", matter_description: "A simple financing matter showing document-backed obligations and an external counsel question.", client_id: "DEMO-CO", counterparty_id: "DEMO-VENDOR", matter_status: "OPEN", risk_rating: "LOW", outstanding_exposure_inr: 12500000, stage: "MONITORING", template_id: "financing", template_version: "v1", created_date: today, created_by: "USER-DEMO-MANAGER" },
    ],
    entity: [
      { entity_id: "ENTITY-DEMO-CO", kind: "company", display_name: "Meridian Holdings" },
      { entity_id: "ENTITY-DEMO-EMPLOYEE", kind: "employee", display_name: "Aarav Mehta" },
      { entity_id: "ENTITY-DEMO-VENDOR", kind: "counterparty", display_name: "Northstar Systems" },
    ],
    matter_entity: [
      { matter_id: "MAT-101", entity_id: "ENTITY-DEMO-CO", role: "client" },
      { matter_id: "MAT-101", entity_id: "ENTITY-DEMO-EMPLOYEE", role: "employee" },
      { matter_id: "MAT-102", entity_id: "ENTITY-DEMO-CO", role: "client" },
      { matter_id: "MAT-102", entity_id: "ENTITY-DEMO-VENDOR", role: "counterparty" },
    ],
    workstream: [
      { workstream_id: "WS-101", matter_id: "MAT-101", workstream_name: "Employment Review", workstream_description: "Performance, leave, and process review.", workstream_type: "employment_review", workstream_status: "IN_PROGRESS", created_date: today },
      { workstream_id: "WS-102", matter_id: "MAT-102", workstream_name: "Financing Review", workstream_description: "Renewal terms, obligations, and exceptions.", workstream_type: "financing_review", workstream_status: "IN_PROGRESS", created_date: today },
    ],
    document: [
      { document_id: "DOC-DEMO-EMP", matter_id: "MAT-101", workstream_id: "WS-101", document_title: "Project Atlas performance record.pdf", document_type: "pip_record", document_source: "DEMO_SEED", document_status: "READY_FOR_REVIEW", created_date: today },
      { document_id: "DOC-DEMO-FIN", matter_id: "MAT-102", workstream_id: "WS-102", document_title: "Northstar financing renewal.pdf", document_type: "financing_agreement", document_source: "DEMO_SEED", document_status: "READY_FOR_REVIEW", created_date: today },
    ],
    page: [
      { page_id: "PAGE-DEMO-EMP-1", document_id: "DOC-DEMO-EMP", page_number: 1, section_id: "SECTION-DEMO-EMP-1", section_title: "Performance record", section_order: 1, text_content: "Project Atlas performance record. The performance improvement plan requires a documented review meeting and a clear separation between historical performance and the current investigation." },
      { page_id: "PAGE-DEMO-FIN-1", document_id: "DOC-DEMO-FIN", page_number: 1, section_id: "SECTION-DEMO-FIN-1", section_title: "Renewal terms", section_order: 1, text_content: "Northstar financing renewal. The facility amount is INR 12,500,000 and the renewal requires updated lender consent before the next draw." },
    ],
    assertion: [
      { assertion_id: "ASSERT-DEMO-EMP-OPEN", matter_id: "MAT-101", entity_id: "ENTITY-DEMO-EMPLOYEE", attribute: "open_item", value: "Confirm the investigation process is separate from historical performance", trust_state: "SUPPORTED", status: "accepted", source: "seed", run_id: null },
      { assertion_id: "ASSERT-DEMO-EMP-COUNSEL", matter_id: "MAT-101", entity_id: null, attribute: "counsel_advice", value: "Keep the performance record separate from the current investigation and document the review meeting.", trust_state: "SUPPORTED", status: "accepted", source: "seed", run_id: null },
      { assertion_id: "ASSERT-DEMO-FIN-OPEN", matter_id: "MAT-102", entity_id: null, attribute: "open_item", value: "Obtain updated lender consent before the next draw", trust_state: "SUPPORTED", status: "accepted", source: "seed", run_id: null },
      { assertion_id: "ASSERT-DEMO-FIN-AMOUNT", matter_id: "MAT-102", entity_id: null, attribute: "facility_amount", value: 12500000, trust_state: "SUPPORTED", status: "accepted", source: "seed", run_id: null },
    ],
    issue: [
      { issue_id: "ISSUE-DEMO-EMP", matter_id: "MAT-101", workstream_id: "WS-101", issue_title: "Separate performance history from current investigation", issue_description: "The workflow flags a process check before the matter can move to decision.", status: "OPEN", issue_priority: "HIGH", severity: "HIGH", requires_legal_judgment: true, created_date: today },
      { issue_id: "ISSUE-DEMO-FIN", matter_id: "MAT-102", workstream_id: "WS-102", issue_title: "Updated lender consent required", issue_description: "The renewal cannot be marked ready until consent is recorded.", status: "OPEN", issue_priority: "MEDIUM", severity: "MEDIUM", requires_legal_judgment: true, created_date: today },
    ],
    counsel: [
      { counsel_id: "COUNSEL-DEMO-EMP", counsel_name: "Riya Menon", counsel_type: "EXTERNAL", firm_name: "PeopleLaw Partners", counsel_status: "ACTIVE", specialization: "Employment" },
      { counsel_id: "COUNSEL-DEMO-FIN", counsel_name: "Kabir Shah", counsel_type: "EXTERNAL", firm_name: "Capital Chambers", counsel_status: "ACTIVE", specialization: "Financing" },
    ],
    engagement: [
      { engagement_id: "ENG-DEMO-EMP", matter_id: "MAT-101", counsel_id: "COUNSEL-DEMO-EMP", engagement_type: "LEGAL_ADVICE", engagement_status: "ENGAGED", engagement_description: "Process advice for the Project Atlas employment review.", engagement_date: today, created_date: today },
      { engagement_id: "ENG-DEMO-FIN", matter_id: "MAT-102", counsel_id: "COUNSEL-DEMO-FIN", engagement_type: "LEGAL_ADVICE", engagement_status: "ENGAGED", engagement_description: "Consent and renewal advice for the Northstar financing.", engagement_date: today, created_date: today },
    ],
    brief: [
      { brief_id: "BRIEF-DEMO-EMP", engagement_id: "ENG-DEMO-EMP", brief_title: "Employment process sequence", brief_status: "OPEN", brief_date: today },
      { brief_id: "BRIEF-DEMO-FIN", engagement_id: "ENG-DEMO-FIN", brief_title: "Lender consent question", brief_status: "OPEN", brief_date: today },
    ],
    question: [
      { question_id: "QUESTION-DEMO-EMP", brief_id: "BRIEF-DEMO-EMP", issue_id: "ISSUE-DEMO-EMP", question_text: "Should the current investigation be documented separately from the historical performance record?", question_category: "PROCESS", question_priority: "HIGH", created_date: today },
      { question_id: "QUESTION-DEMO-FIN", brief_id: "BRIEF-DEMO-FIN", issue_id: "ISSUE-DEMO-FIN", question_text: "What consent is required before the next draw under the renewal terms?", question_category: "CONSENT", question_priority: "MEDIUM", created_date: today },
    ],
    counsel_output: [
      { output_id: "OUTPUT-DEMO-EMP", engagement_id: "ENG-DEMO-EMP", brief_id: "BRIEF-DEMO-EMP", output_type: "WRITTEN_ADVICE", output_status: "RECEIVED", opinion_summary: "Keep the performance record separate from the current investigation and document the review meeting.", output_date: today, opinion_sections: [], review_points: [], created_date: today },
    ],
    matter_access: [
      { access_id: "ACCESS-DEMO-EMP-COUNSEL", matter_id: "MAT-101", user_id: "USER-DEMO-COUNSEL", access_level: "EXTERNAL_COUNSEL", granted_date: today, granted_by: "USER-DEMO-MANAGER" },
      { access_id: "ACCESS-DEMO-FIN-COUNSEL", matter_id: "MAT-102", user_id: "USER-DEMO-COUNSEL", access_level: "EXTERNAL_COUNSEL", granted_date: today, granted_by: "USER-DEMO-MANAGER" },
    ],
    matter_link: [{ from_matter_id: "MAT-101", to_matter_id: "MAT-102", link_type: "related" }],
    job: [
      { job_id: "JOB-DEMO-EMP", matter_id: "MAT-101", document_id: "DOC-DEMO-EMP", job_type: "DOCUMENT_PROCESSING", status: "completed", attempt_count: 1 },
      { job_id: "JOB-DEMO-FIN", matter_id: "MAT-102", document_id: "DOC-DEMO-FIN", job_type: "DOCUMENT_PROCESSING", status: "completed", attempt_count: 1 },
    ],
    audit_event: [
      { audit_event_id: "AUDIT-DEMO-EMP", matter_id: "MAT-101", event_type: "AUTOMATION_COMPLETED", entity_type: "document", entity_id: "DOC-DEMO-EMP", payload: { steps: ["classified", "extracted", "cited", "queued_for_review"] }, created_at: today },
      { audit_event_id: "AUDIT-DEMO-FIN", matter_id: "MAT-102", event_type: "AUTOMATION_COMPLETED", entity_type: "document", entity_id: "DOC-DEMO-FIN", payload: { steps: ["classified", "extracted", "cited", "queued_for_review"] }, created_at: today },
    ],
    span: [], assertion_evidence: [], issue_basis: [], decision: [], decision_issue: [], knowledge_item: [], matter_institutional_memory: [], matter_timeline_event: [], legal_finding: [], finding_citation: [], asset: [], matter_asset: [], asset_document: [], security_interest: [], historical_matter: [], company_policy: [], extraction_run: [],
  };
  writeDatabase(rows);
}

function keyFor(row: Row, conflict?: string) {
  const keys = (conflict ?? "").split(",").map((key) => key.trim()).filter(Boolean);
  if (!keys.length) return undefined;
  return keys.map((key) => `${key}:${String(row[key] ?? "")}`).join("|");
}

function project(row: Row, columns?: string) {
  if (!columns || columns === "*") return { ...row };
  const keys = columns.split(",").map((key) => key.trim()).filter(Boolean);
  return Object.fromEntries(keys.map((key) => [key, row[key]]));
}

class LocalQuery<T = Row | Row[]> implements PromiseLike<{ data: T | null; error: { message: string } | null }> {
  private filters: Array<(row: Row) => boolean> = [];
  private columns = "*";
  private mode: "select" | "insert" | "update" | "upsert" = "select";
  private values: Row | Row[] | null = null;
  private conflict: string | undefined;
  private wantSingle = false;
  private allowEmpty = false;
  private sort: { column: string; ascending: boolean } | null = null;

  constructor(private readonly table: string, private readonly database: LocalStore) {}

  select(columns = "*") { this.columns = columns; return this; }
  eq(column: string, value: unknown) { this.filters.push((row) => row[column] === value); return this; }
  in(column: string, values: unknown[]) { this.filters.push((row) => values.includes(row[column])); return this; }
  order(column: string, options?: { ascending?: boolean }) { this.sort = { column, ascending: options?.ascending !== false }; return this; }
  insert(values: Row | Row[]) { this.mode = "insert"; this.values = values; return this; }
  update(values: Row) { this.mode = "update"; this.values = values; return this; }
  upsert(values: Row | Row[], options?: { onConflict?: string }) { this.mode = "upsert"; this.values = values; this.conflict = options?.onConflict; return this; }
  single() { this.wantSingle = true; this.allowEmpty = false; return this; }
  maybeSingle() { this.wantSingle = true; this.allowEmpty = true; return this; }

  then<TResult1 = { data: T | null; error: { message: string } | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: T | null; error: { message: string } | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): PromiseLike<TResult1 | TResult2> {
    return Promise.resolve(this.execute()).then(onfulfilled, onrejected);
  }

  private execute(): { data: T | null; error: { message: string } | null } {
    try {
      const rows = this.database.rows(this.table);
      const inputRows = Array.isArray(this.values) ? this.values : this.values ? [this.values] : [];
      if (this.mode === "insert") rows.push(...inputRows.map((row) => ({ ...row })));
      if (this.mode === "upsert") {
        for (const input of inputRows) {
          const key = keyFor(input, this.conflict);
          const index = key ? rows.findIndex((row) => keyFor(row, this.conflict) === key) : -1;
          if (index >= 0) rows[index] = { ...rows[index], ...input };
          else rows.push({ ...input });
        }
      }
      if (this.mode === "update") {
        for (const row of rows) if (this.filters.every((filter) => filter(row))) Object.assign(row, this.values ?? {});
      }
      if (this.mode !== "select") this.database.persist();
      let result = rows.filter((row) => this.filters.every((filter) => filter(row)));
      if (this.sort) result = [...result].sort((a, b) => {
        const left = String(a[this.sort!.column] ?? "");
        const right = String(b[this.sort!.column] ?? "");
        return this.sort!.ascending ? left.localeCompare(right) : right.localeCompare(left);
      });
      const projected = result.map((row) => project(row, this.columns));
      if (this.wantSingle) {
        if (!projected.length && !this.allowEmpty) return { data: null, error: { message: "No rows found" } };
        return { data: (projected[0] ?? null) as T, error: null };
      }
      return { data: projected as T, error: null };
    } catch (error) {
      return { data: null, error: { message: error instanceof Error ? error.message : String(error) } };
    }
  }
}

export class LocalStore {
  private database: Database;
  constructor() { this.database = readDatabase(); }
  rows(table: string) {
    // Server components and API routes live for the life of the dev server.
    // Reload before every query so a page service never serves a pre-upload snapshot.
    this.database = readDatabase();
    if (table === "matter" && !this.database.matter?.length) {
      ensureLocalDemoData();
      this.database = readDatabase();
    }
    this.database[table] ??= [];
    return this.database[table];
  }
  persist() { writeDatabase(this.database); }
  query(table: string) { return new LocalQuery(table, this); }
  storagePath(bucket: string, filePath: string) { return path.join(storageRoot, bucket, filePath); }
}

export class LocalClient {
  readonly local = new LocalStore();
  from(table: string) { return this.local.query(table); }
  storage = {
    from: (bucket: string) => ({
      upload: async (filePath: string, body: Uint8Array) => {
        const target = this.local.storagePath(bucket, filePath);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, body);
        return { data: { path: filePath }, error: null };
      },
      createSignedUrl: async (filePath: string) => ({ data: { signedUrl: `/api/local-storage/${encodeURIComponent(bucket)}/${filePath.split("/").map(encodeURIComponent).join("/")}` }, error: null }),
    }),
  };
}

export function localStorageFile(bucket: string, filePath: string) {
  return path.join(storageRoot, bucket, filePath);
}

export function resetLocalStore() {
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(storageRoot, { recursive: true, force: true });
  ensureStore();
}
