# MatterBridge — Complete Project Export

> Generated from the repository workspace. This Markdown file is a portable review/export bundle, not a replacement for the original project directory.

## Contents

- 85 portable text/config/source files included.
- Dependencies, build output, Git metadata, secrets, and binary assets omitted.

## Technical architecture

### Runtime and framework

- Next.js App Router with TypeScript.
- Tailwind CSS and shared UI components.
- Server-rendered data-backed pages with route-level loading states.
- No database, external vector store, LangChain layer, or production auth layer.

### Application layers

```text
app/ routes and page composition
  ↓
components/ reusable navigation, cards, panels, issue workspace, AI review UI
  ↓
lib/data/ typed data access, correlation, retrieval, counsel/access helpers
  ↓
data/ JSON matter records, raw source structures, knowledge chunks
```

### Primary routes

- `/` — Legal Matter Intelligence dashboard.
- `/evidence` — Documentary Evidence library.
- `/counsel-review` — Overall Counsel Engagement Review.
- `/matters/[matterId]` — matter overview, timeline, and Counsel & Decisions.
- `/matters/[matterId]/workstreams/[workstreamId]` — issue-first workstream view.
- `/matters/[matterId]/counsel-brief` — counsel brief.
- `/matters/[matterId]/opinion-review` — counsel opinion review.
- `/matters/[matterId]/legal-decision` — internal legal decision.
- `/matters/[matterId]/institutional-memory` — precedents and reusable knowledge.
- `/counsel-workspace/[matterId]` — simulated scoped external counsel workspace.
- `/api/opinion-review` — server-side Gemini opinion-review workflow.

### Data and relationship model

Matter records are file-backed JSON. Workstreams contain documents, findings,
and issues. Issue support is correlated in `lib/data/issue-mapping.ts` by
matter/workstream scope first and topic/meaning second; multiple findings or
documents may support one issue. Source and chunk identifiers are preserved for
traceability.

### Retrieval and Gemini integration

`lib/data/evidence-service.ts` applies deterministic matter/workstream filters,
lexical ranking, and bounded evidence-packet construction over
`data/knowledge_chunks.json`. The API route sends only that bounded packet to
Gemini using server-side `GEMINI_API_KEY` and `GEMINI_MODEL` environment
variables. Structured output is validated, and returned source IDs must belong
to the retrieved evidence scope. Stored review data remains available when the
live provider is unavailable.

### Prototype boundaries

Uploads, comments, and live review results are not persisted. Authentication,
RBAC, production storage, deployment, and live-provider/browser verification are
outside this export's verified scope. `.env.local`, dependencies, build output,
Git metadata, and binary assets are intentionally omitted.

## Project file tree

```text
AGENTS.md
BUILD_PLAN.md
CLAUDE.md
README.md
app/api/opinion-review/route.ts
app/counsel-review/loading.tsx
app/counsel-review/page.tsx
app/counsel-workspace/[matterId]/loading.tsx
app/counsel-workspace/[matterId]/page.tsx
app/evidence/loading.tsx
app/evidence/page.tsx
app/globals.css
app/layout.tsx
app/matters/[matterId]/counsel-brief/loading.tsx
app/matters/[matterId]/counsel-brief/page.tsx
app/matters/[matterId]/institutional-memory/loading.tsx
app/matters/[matterId]/institutional-memory/page.tsx
app/matters/[matterId]/legal-decision/loading.tsx
app/matters/[matterId]/legal-decision/page.tsx
app/matters/[matterId]/loading.tsx
app/matters/[matterId]/opinion-review/loading.tsx
app/matters/[matterId]/opinion-review/page.tsx
app/matters/[matterId]/page.tsx
app/matters/[matterId]/workstreams/[workstreamId]/loading.tsx
app/matters/[matterId]/workstreams/[workstreamId]/page.tsx
app/page.tsx
app/settings/page.tsx
components/matter/DecisionWorkspace.tsx
components/matter/DocumentLibrary.tsx
components/matter/EvidencePacket.tsx
components/matter/LiveOpinionReview.tsx
components/matter/MatterActivityPanels.tsx
components/matter/MatterCard.tsx
components/matter/MatterStatusTabs.tsx
components/matter/RecoveryIssueWorkspace.tsx
components/navigation/PrimaryNavigation.tsx
components/shared/PageLoading.tsx
data/knowledge_chunks.json
data/matter_index.json
data/matters/MAT-001.json
data/matters/MAT-002.json
data/raw/ai_findings.json
data/raw/asset_documents.json
data/raw/assets.json
data/raw/audit_log.json
data/raw/company_policies.json
data/raw/counsel.json
data/raw/counsel_briefs.json
data/raw/counsel_engagements.json
data/raw/counsel_outputs.json
data/raw/counsel_questions.json
data/raw/data_dictionary.json
data/raw/dataset_summary.json
data/raw/decisions.json
data/raw/document_sections.json
data/raw/documents.json
data/raw/finding_citations.json
data/raw/historical_matters.json
data/raw/legal_issues.json
data/raw/matter_access.json
data/raw/matter_assets.json
data/raw/matter_timeline.json
data/raw/matter_types.json
data/raw/matters.json
data/raw/parties.json
data/raw/security_interests.json
data/raw/users.json
data/raw/workstreams.json
data/validation_report.json
eslint.config.mjs
handoff-context.md
lib/data/access-service.ts
lib/data/counsel-service.ts
lib/data/evidence-service.ts
lib/data/issue-mapping.ts
lib/data/matter-service.ts
lib/types/matter.ts
next-env.d.ts
next.config.ts
package-lock.json
package.json
postcss.config.mjs
scripts/convert_excel_to_json.py
scripts/create_project_export.py
tsconfig.json
```

## File contents

### `AGENTS.md`

```md
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

```

### `BUILD_PLAN.md`

```md
# MatterBridge Build Plan

> This is the build control panel for MatterBridge. Codex should keep it current.
> Mark an item complete only when it is verified from the repository and, where applicable, lint/build/runtime checks.
>
> Source of truth: working repository -> actual generated JSON -> package/compiler behavior -> handoff-context.md -> older specifications.
>
> Model guidance: default to GPT-5.6 Luna + Medium. Use Luna + High for difficult debugging. Escalate to Terra for reasoning-heavy cross-system work such as Opinion Review, retrieval/LLM architecture, or persistent cross-file/schema problems.

## Milestone 0 - Baseline Audit
Model: Luna / Medium

- [x] Read `handoff-context.md` (the repository's context file; no `context.md` exists)
- [x] Read `AGENTS.md`
- [x] Inspect the actual repository structure
- [x] Inspect relevant generated JSON rather than assuming schema
- [x] Reconcile this plan against what is already implemented
- [x] Mark already-completed items below only when verified
- [x] Run current lint baseline
- [x] Run current production build baseline with webpack
- [x] Record existing errors/blockers under Current Blockers

Exit: We know what is already built, what works, and the first genuinely incomplete milestone.

## Milestone 1 - Security Verification
Path: MAT-001 -> WS-002 Security Verification
Model: Luna / Medium

- [x] Security Verification route exists
- [x] Workstream header/status is implemented
- [x] Workstream findings render from actual MAT-001 data
- [x] Securities/assets render correctly from the matter asset bundles
- [x] Security timeline renders from actual workstream data
- [x] Relevant legal/issues data is visible
- [x] Source/evidence information is traceable to underlying documents and chunk IDs
- [x] No incorrect assumptions between `workstream.documents` and `assets[].documents`
- [ ] `/matters/MAT-001/workstreams/WS-002` works
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: A reviewer can understand the security package, chronology, unresolved issues, findings, and supporting evidence.

## Milestone 2 - Counsel Brief
Model: Luna / Medium

- [x] Inspect actual counsel engagement, brief, question, document, issue, and finding data
- [x] Counsel Brief route/page exists at `/matters/[matterId]/counsel-brief`
- [x] Matter context is displayed
- [x] Relevant facts/issues are included
- [x] Relevant supporting documents/evidence are included
- [x] Counsel questions are displayed
- [x] Information gaps are distinguished from supported facts
- [x] Matters requiring legal judgment are clearly identified
- [x] Navigation from MAT-001 to Counsel Brief is implemented
- [x] Counsel Brief renders using actual repository data
- [x] No invented legal conclusions are presented
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: In-house Legal can review an evidence-linked brief before sending work to outside counsel.

## Milestone 3 - Scoped External Counsel Workspace
Model: Luna / Medium

- [x] External counsel workspace/route exists
- [x] Relevant counsel engagement is displayed
- [x] Only scoped matter/workstream context is shown
- [x] Relevant documents/evidence are available
- [x] Counsel questions are visible
- [x] Internal-only information is not accidentally exposed in the simulated scoped view
- [x] Prototype distinguishes simulated access control from production RBAC
- [ ] Navigation works
- [ ] Scoped counsel flow can be demonstrated end-to-end
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: The prototype demonstrates controlled outside-counsel context without implying production-grade RBAC.

## Milestone 4 - Counsel Opinion Review - Hero Feature
Model: Terra / Medium first; High only if needed

- [x] Inspect actual counsel output/opinion data
- [x] Inspect relevant company precedent/historical matter data
- [x] Inspect relevant MAT-001 evidence and findings
- [x] Opinion Review route/page exists
- [x] Counsel advice is displayed
- [x] Review identifies a prior-position/precedent conflict
- [x] Review identifies a missing issue
- [x] Review identifies an unsupported assertion or evidence requiring verification
- [x] Review identifies the security-related gap
- [x] Each review finding is source-linked
- [x] Findings distinguish evidence from legal judgment
- [x] Recommended user actions are explicit
- [x] Review output follows the intended structured schema
- [x] Finding type, severity, counsel source IDs, company source IDs, and recommended action are represented
- [ ] Hero review flow works for MAT-001
- [x] No fake confidence percentages
- [x] No unsupported final legal opinion
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: MatterBridge demonstrates reviewing external counsel advice against company evidence, precedent, and institutional knowledge.

## Milestone 5 - Legal Decision
Model: Luna / Medium

- [x] Legal Decision route/page exists
- [x] Counsel advice/review context is available to the decision-maker
- [x] Decision actions are represented
- [x] User can capture decision rationale
- [x] Relevant decision factors are represented
- [x] Legal risk, recovery probability, cost, timing, commercial relationship, and regulatory considerations appear where relevant
- [x] Prototype does not make the final legal decision for the user
- [x] Decision state can be demonstrated even if persistence is simulated
- [ ] MAT-001 decision flow works
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: The user can move from counsel advice to a documented human decision with rationale.

## Milestone 6 - Institutional Memory
Model: Luna / Medium

- [x] Institutional Memory / precedent view exists
- [x] Historical matters can be surfaced
- [x] Counsel advice can be associated with a matter
- [x] Internal decision and rationale can be associated with a matter
- [x] Supporting sources can be surfaced
- [x] Outcome/precedent context can be surfaced where data exists
- [x] "Have we dealt with this before?" experience is demonstrable
- [x] MAT-001 decision can conceptually become future institutional knowledge
- [ ] Memory/precedent navigation works
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: The demo closes the loop from external legal work back into reusable company knowledge.

## Milestone 7 - Retrieval + Live LLM Integration
Model: Terra / High

Retrieval:
- [x] Inspect `knowledge_chunks.json`
- [x] Implement deterministic metadata filtering
- [x] Support filtering by `matter_id`
- [x] Support the relevant optional `workstream_id` filter
- [x] Implement simple lexical matching/reranking where appropriate
- [x] Build a small evidence packet rather than sending the entire dataset
- [x] Preserve source/chunk IDs through the pipeline

LLM:
- [x] Server-side LLM/API integration exists
- [x] API key remains server-side
- [x] At least one selected intelligence workflow uses a real model call
- [x] Prompt receives retrieved evidence
- [x] Model returns structured JSON
- [x] Output validates or fails safely
- [x] Citations/source IDs survive into the UI
- [x] Error/loading states exist
- [x] Prototype remains usable if the model call fails

Trust:
- [x] `SUPPORTED` is represented
- [x] `INFERRED` is represented in the evidence-packet output contract
- [x] `INFORMATION_MISSING` is represented
- [x] `REQUIRES_LEGAL_JUDGMENT` is represented

Verification:
- [ ] Live call works locally
- [x] No secret is exposed client-side
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: MatterBridge contains a real evidence-grounded AI workflow rather than only simulated intelligence.

## Milestone 8 - MAT-002 Generalization Proof
Model: Luna / Medium

- [ ] MAT-002 matter page renders cleanly
- [ ] MAT-002 workstream navigation works
- [x] Documents/issues/findings/timeline render from actual MAT-002 data
- [x] Document-authenticity issue remains REQUIRES VERIFICATION, not confirmed fraud
- [x] Historical attendance/performance is separate from current document verification
- [x] PIP is correctly represented as passed
- [x] Potentially protected/sensitive leave considerations remain separate
- [x] AI does not collapse the facts into a termination recommendation
- [x] External employment counsel access is limited/scoped where relevant
- [x] Legal review/judgment boundary is preserved
- [x] MAT-002 demonstrates that the architecture works beyond MAT-001
- [ ] No runtime errors
- [x] Lint passes
- [x] Production build passes

Exit: MatterBridge demonstrates a reusable legal workflow rather than one hard-coded recovery demo.

## Milestone 9 - Product and UI Cleanup
Model: Luna / Medium

- [x] Navigation is coherent across the primary matter, evidence, and counsel-review paths
- [x] Page headings and terminology are consistent across the restructured surfaces
- [x] `Security Verification` terminology is used consistently
- [x] Loading/empty/error states are reasonable in the implemented routes
- [x] Obvious duplicated UI logic is cleaned up where worthwhile
- [x] No unnecessary dependencies are introduced
- [x] No obvious TypeScript/schema warnings remain
- [x] Visual hierarchy is presentation-ready
- [x] Demo does not expose unfinished/internal implementation artifacts in the normal lawyer-facing routes

Exit: The prototype is coherent enough to show an interviewer without explaining around obvious rough edges.

## Milestone 10 - Deployment and Portfolio Readiness
Model: Luna / Medium

Technical:
- [x] Final lint passes
- [x] Final production build passes
- [ ] Git repository is clean enough for portfolio review
- [x] README explains the product problem
- [x] README explains architecture
- [x] README distinguishes real vs simulated capabilities
- [x] README explains trust/evidence approach
- [x] Environment variables are documented safely
- [ ] Deploy to Vercel
- [ ] Production deployment loads successfully
- [ ] Critical routes work in production

Demo:
- [ ] Matter Dashboard tested
- [ ] MAT-001 Matter Intelligence tested
- [ ] Security Verification tested
- [ ] Counsel Brief tested
- [ ] External Counsel Workspace tested
- [ ] Counsel Opinion Review tested
- [ ] Legal Decision tested
- [ ] Institutional Memory tested
- [ ] MAT-002 can be shown as generalization proof
- [ ] Short demo narrative is prepared
- [ ] Known prototype limitations are documented

Exit: MatterBridge is deployed, explainable, and portfolio-ready.

# Current Blockers

- Runtime route verification remains intentionally deferred per the current handoff instruction; no dev server was started during this audit.
- No lint, TypeScript, or production-build blockers are present.
- Batch 2 runtime verification remains pending: the counsel opinion, decision rationale, and institutional-memory records are surfaced in UI workflows, but no dev server/browser click-through was run.
- MAT-001 outcome remains intentionally `OPEN`; final recovery route, satisfaction verification, property enforcement, guarantee recovery, receivables recovery, settlement, cost, duration, and strategy effectiveness are not yet known.
- Batch 3 live-call verification is intentionally deferred for manual testing; `GEMINI_API_KEY` and `GEMINI_MODEL` are configured locally, but no further API/runtime checks will be run in this build pass.

# Build Log

Codex should append concise entries only after verified work.

| Date | Milestone | Verified change | Verification |
|---|---|---|---|
| 2026-09-21 | Milestone 0 | Audited repository, handoff context, generated JSON, and current implementation; reconciled this plan. | `npm run lint` passed; `npm run build` passed with webpack. |
| 2026-09-21 | Milestone 1 | Verified the data-backed MAT-001 Security Verification implementation, including WS-002 findings, issues, assets, timeline, documents, and evidence references. | Source inspection; lint/build passed. Runtime route check intentionally deferred. |
| 2026-09-21 | Product/UI | Restructured MAT-001 Recovery Assessment around active issues with mapped evidence, AI findings, and local lawyer comments. | `npm run lint` passed; `npm run build` passed. Runtime interaction check intentionally deferred. |
| 2026-09-21 | Milestone 7 | Verified deterministic evidence retrieval with matter/workstream filtering, lexical ranking, bounded packets, chunk IDs, required trust states, and guardrails. | Source inspection; lint/build passed. No live LLM call exists yet. |
| 2026-09-21 | Milestone 2 | Added the data-backed Counsel Brief route and matter-page entry point; corrected counsel-question types to match generated JSON. | `npm run lint` passed; `npm run build` passed. Runtime route check intentionally deferred. |

| 2026-09-21 | Milestone 9 | Added primary navigation, focused matter overview, collapsed matter activity panels, central Documentary Evidence library, and Overall Counsel Engagement Review. Removed technical Evidence Packet presentation from normal matter/workstream/Counsel Brief UI. | npm run lint passed; npm run build passed. Runtime navigation check intentionally deferred. |
| 2026-09-22 | Milestones 3 + 8 | Added a simulated scoped external-counsel workspace driven by the actual MAT-002 LIMITED/EXTERNAL_COUNSEL access record; MAT-001 correctly has no provisioned external workspace. Verified MAT-002’s generic matter/workstream data and legal boundaries, including document verification, passed PIP, separate leave/performance analysis, counsel escalation, and human legal judgment. Added shared route loading states. | `npm run lint` passed; `npm run build` passed with webpack; `git diff --check` passed. Runtime/browser verification intentionally deferred. |
| 2026-09-22 | Batch 2 data preparation | Populated MAT-001 counsel opinion `OUT-001`, four source-linked opinion review points, conditional decision `DEC-001` with rationale/factors/actions, and three reusable institutional-memory items referencing existing historical precedents. Preserved the open outcome state. | JSON parse/reference assertions passed; `npm run lint` passed; `npm run build` passed with webpack. |
| 2026-09-22 | Batch 2 UI | Added matter-scoped Counsel Opinion Review, Legal Decision, and Institutional Memory routes with source-aware review cards, local rationale capture, precedent/knowledge views, and Matter-level navigation links. | `npm run lint` passed; `npm run build` passed with webpack; `git diff --check` passed. Runtime/browser verification intentionally deferred. |
| 2026-09-22 | Batch 3 | Added a server-side `/api/opinion-review` Gemini `generateContent` workflow using bounded MAT-001 retrieval context, structured JSON output, source-ID validation, and graceful missing-key/model-failure handling. Added a guarded UI action and `.env.example`. | `npm run lint` passed; `npm run build` passed with webpack. Live API verification intentionally deferred for manual testing. |
| 2026-09-24 | Product/UI cleanup | Removed an unused Counsel Brief finding component so lint is warning-free. | `npm run lint` passed; `npm run build` passed with webpack. No API/runtime verification run. |
| 2026-09-24 | Batch 3 readiness | Replaced the starter README with MatterBridge product, architecture, trust/evidence, real-vs-simulated capability, environment, and limitation documentation. Source-audited terminology, shared loading/error states, and lawyer-facing route boundaries. | `npm run lint` passed; `npm run build` passed with webpack. No API/browser/Vercel verification run. |

# Codex Operating Rule

When asked to continue the build:

1. Read this file and the relevant implementation/data.
2. Select the next unchecked item within the current milestone unless the user explicitly selects another milestone.
3. Make the smallest coherent change required.
4. Verify the change.
5. Mark only verified items `[x]`.
6. Update Current Blockers if something prevents completion.
7. Add a short Build Log entry after a meaningful verified step.
8. Stop at the requested milestone boundary rather than silently expanding scope.

```

### `CLAUDE.md`

```md
@AGENTS.md

```

### `README.md`

```md
# MatterBridge

MatterBridge is a lawyer-focused legal matter intelligence prototype. It helps
Legal teams move from matter facts and documentary evidence to scoped AI
findings, external counsel review, and an explicitly owned internal decision.
The prototype uses synthetic matter data for Meridian Components and Project
Atlas to demonstrate the workflow without pretending that unresolved legal
questions or outcomes are settled.

## Product flow

- **Matters** provides the focused matter dashboard and matter overview.
- **Documentary Evidence** is the matter document library.
- **Recovery Assessment**, **Security Verification**, and the MAT-002
  employment workstream expose active issues with related findings and
  supporting evidence.
- **Counsel Opinion Review** separates external counsel advice from the
  company’s own evidence and review questions.
- **Legal Decision** records the internal decision, rationale, conditions, and
  follow-up actions.
- **Institutional Memory** surfaces reusable historical precedents and
  knowledge without manufacturing a final outcome for MAT-001.
- **Overall Counsel Engagement Review** provides a portfolio-level counsel
  view, while matter-level Counsel & Decisions remains inside each matter.

## Architecture

This is a Next.js App Router application using TypeScript and Tailwind CSS.
The repository is intentionally file-backed for the prototype:

- `data/matters/*.json` contains matter-scoped matters, workstreams, documents,
  findings, issues, counsel records, decisions, and institutional memory.
- `data/knowledge_chunks.json` contains retrieval chunks with source and chunk
  identifiers.
- `lib/data` provides typed data access, issue/finding/evidence correlation,
  deterministic retrieval, and counsel/access helpers.
- `app/` contains the dashboard, matter, workstream, evidence, counsel, and
  decision routes.
- `components/` contains shared navigation, progressive-disclosure panels,
  issue workspaces, and live review UI.

The current AI workflow is the server-side `/api/opinion-review` route. It
retrieves a bounded, matter/workstream-scoped evidence packet before making a
Gemini `generateContent` request. Source IDs returned by the model are checked
against the retrieved scope before results are shown.

## Real versus simulated capabilities

Implemented in the prototype:

- data-backed matter, workstream, document, issue, finding, counsel, decision,
  and precedent views;
- deterministic evidence retrieval with metadata filtering and lexical
  ranking;
- issue-to-finding/evidence correlation using existing matter/workstream and
  topic relationships;
- server-side Gemini integration with structured output and source validation;
- local lawyer assessment/comment state in issue workspaces;
- loading, missing-record, configuration, and model-failure handling.

Intentionally simulated or deferred:

- document upload does not persist files;
- comments and live review results are not persisted to a backend;
- production authentication, authorization, RBAC, and storage are not
  implemented;
- final MAT-001 recovery outcome remains open and unknown;
- live Gemini/manual browser verification is deferred for the current build
  pass;
- Vercel deployment and production route verification are not yet complete.

## Trust and evidence approach

MatterBridge keeps documentary evidence, MatterBridge findings, external
counsel advice, and internal Legal decisions visibly distinct. Findings retain
their trust state and source references where available. Retrieval is scoped by
matter and workstream, and a single issue may be supported by multiple findings
or documents. The application does not convert an unresolved issue into a
confirmed legal conclusion, and it leaves final legal judgment with the user.

## Local setup

Install dependencies and run the standard checks:

```bash
npm install
npm run lint
npm run build
```

For local development, use `npm run dev` and open the local URL printed by
Next.js.

### Environment variables

Copy `.env.example` to `.env.local` and provide the values locally. Never
commit `.env.local` or expose the API key to client-side code.

```text
GEMINI_API_KEY=your-server-side-key
GEMINI_MODEL=gemini-3.1-flash-lite
```

The Gemini variables enable the guarded live opinion-review action. The stored
MatterBridge review remains available when the integration is not configured
or a provider request fails.

## Prototype limitations

This repository is a portfolio prototype, not a production legal system. The
dataset is synthetic, source completeness is bounded by the available JSON,
and no production deployment, persistence, authentication, or live-provider
verification should be inferred from a passing build alone.

```

### `app/api/opinion-review/route.ts`

```ts
import { NextResponse } from "next/server";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { getMatter } from "@/lib/data/matter-service";

const reviewSchema = {
  type: "object",
  properties: {
    overall_assessment: { type: "string" },
    review_points: {
      type: "array",
      items: {
        type: "object",
        properties: {
          review_type: { type: "string" },
          title: { type: "string" },
          severity: { type: "string" },
          counsel_position: { type: "string" },
          company_review: { type: "string" },
          recommended_action: { type: "string" },
          source_ids: { type: "array", items: { type: "string" } },
        },
        required: [
          "review_type",
          "title",
          "severity",
          "counsel_position",
          "company_review",
          "recommended_action",
          "source_ids",
        ],
      },
    },
  },
  required: ["overall_assessment", "review_points"],
};

function parseReview(text: string) {
  if (!text) {
    throw new Error("The model returned no structured review output.");
  }

  return JSON.parse(text) as {
    overall_assessment: string;
    review_points: Array<{
      review_type: string;
      title: string;
      severity: string;
      counsel_position: string;
      company_review: string;
      recommended_action: string;
      source_ids: string[];
    }>;
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        code: "CONFIGURATION_MISSING",
        error: "Live review is not configured. Add GEMINI_API_KEY on the server to enable it.",
      },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => null)) as { matterId?: string } | null;
  const matterId = body?.matterId ?? "MAT-001";
  const matterData = getMatter(matterId);

  if (!matterData) {
    return NextResponse.json({ code: "MATTER_NOT_FOUND", error: "Matter not found." }, { status: 404 });
  }

  const engagement = matterData.counsel_engagements?.[0];
  const output = engagement?.outputs?.[0];
  const workstream = matterData.workstreams.find(
    (candidate) => candidate.workstream_name === "Recovery Assessment"
  );

  if (!output || !workstream) {
    return NextResponse.json(
      { code: "REVIEW_CONTEXT_MISSING", error: "Counsel review context is incomplete for this matter." },
      { status: 422 }
    );
  }

  const packet = buildEvidencePacket(matterData, { workstream, maxSources: 24 });
  const allowedSourceIds = [
    output.output_id,
    ...(output.opinion_sections ?? []).map((section) => section.opinion_section_id),
    ...packet.sources.flatMap((source) => [source.chunk_id, source.document_id].filter(Boolean)),
    ...(matterData.historical_precedents ?? []).map((precedent) => precedent.historical_matter_id),
    ...(matterData.issues ?? []).map((issue) => issue.issue_id),
    ...(matterData.findings ?? []).map((finding) => finding.finding_id),
  ];

  const prompt = JSON.stringify({
    task: "Review external counsel advice against the company's evidence and historical precedent.",
    constraints: [
      "Do not give a final legal opinion or make the legal decision for Internal Legal.",
      "Distinguish counsel position from company evidence and legal judgment.",
      "Only use source IDs from allowed_source_ids.",
      "Do not invent confidence percentages or facts.",
      "If evidence is missing, say so explicitly.",
    ],
    allowed_source_ids: allowedSourceIds,
    counsel_output: output,
    relevant_issues: workstream.issues ?? [],
    relevant_findings: workstream.findings ?? [],
    evidence_packet: packet.sources,
    relevant_precedents: matterData.historical_precedents ?? [],
  });

  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are MatterBridge, an evidence-grounded legal operations review assistant.",
            },
          ],
        },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: reviewSchema,
        },
      }),
      }
    );

    const payload = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      return NextResponse.json(
        { code: "MODEL_REQUEST_FAILED", error: payload.error?.message ?? "The model request failed." },
        { status: 502 }
      );
    }

    const modelText = payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("");
    const review = parseReview(modelText ?? "");
    const allowed = new Set(allowedSourceIds);
    const invalidSourceIds = review.review_points.flatMap((point) =>
      point.source_ids.filter((sourceId) => !allowed.has(sourceId))
    );

    if (invalidSourceIds.length > 0) {
      return NextResponse.json(
        { code: "INVALID_CITATIONS", error: "The model returned a source ID outside the retrieved evidence scope." },
        { status: 502 }
      );
    }

    return NextResponse.json({ review, source_ids: allowedSourceIds });
  } catch {
    return NextResponse.json(
      { code: "MODEL_OUTPUT_INVALID", error: "The live review could not be validated. Existing review data remains available." },
      { status: 502 }
    );
  }
}

```

### `app/counsel-review/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/counsel-review/page.tsx`

```tsx
import Link from "next/link";
import { getCounselPortfolio } from "@/lib/data/counsel-service";

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function statusClassName(value?: string) {
  if (value === "PENDING" || value === "IN_PROGRESS") {
    return "bg-amber-50 text-amber-800";
  }

  if (value === "ENGAGED" || value === "APPROVED") {
    return "bg-emerald-50 text-emerald-800";
  }

  return "bg-slate-100 text-slate-700";
}

export default function CounselReviewPage() {
  const portfolio = getCounselPortfolio();

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="surface-card rounded-xl p-7">
          <p className="eyebrow text-blue-700">
            Overall Counsel Engagement Review
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            External counsel portfolio
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            A portfolio view of the law firms and counsel currently associated
            with MatterBridge matters. Topics are derived only from the current
            engagement and workstream descriptions.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Counsel and firms
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {portfolio.length} counsel groups in the current dataset.
              </p>
            </div>
          </div>

          <div className="mt-4 grid gap-5 lg:grid-cols-2">
            {portfolio.map((group) => (
              <article
                key={group.counsel.counsel_id}
                className="surface-card rounded-xl p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      {group.counsel.counsel_id}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                      {group.counsel.firm_name ?? group.counsel.counsel_name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {group.counsel.counsel_name}
                      {group.counsel.specialization
                        ? " · " + group.counsel.specialization
                        : ""}
                    </p>
                  </div>
                  <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {group.matters.length} {group.matters.length === 1 ? "matter" : "matters"}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Common work
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {group.matters.map((matter) => (
                    <div key={matter.matterId} className="rounded-lg bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={"/matters/" + matter.matterId}
                        className="font-semibold text-blue-700 hover:text-blue-900"
                        >
                          {matter.matterId} · {matter.matterTitle}
                        </Link>
                        <span
                          className={
                            "rounded-full px-3 py-1 text-xs font-semibold " +
                            statusClassName(matter.engagement.engagement_status)
                          }
                        >
                          {label(matter.engagement.engagement_status)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {matter.matterType} ·{" "}
                        {matter.workstreams.join(" · ")}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {matter.engagement.engagement_description}
                      </p>
                      {matter.hasExternalCounselAccess ? (
                        <Link
                          href={"/counsel-workspace/" + matter.matterId}
                          className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-900"
                        >
                          Open scoped counsel workspace →
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

```

### `app/counsel-workspace/[matterId]/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/counsel-workspace/[matterId]/page.tsx`

```tsx
import Link from "next/link";
import { getExternalCounselAccess } from "@/lib/data/access-service";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { getMatter } from "@/lib/data/matter-service";
import type { Document } from "@/lib/types/matter";

type CounselWorkspacePageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function DocumentRow({ document }: { document: Document }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{document.document_id}</p>
          <h3 className="mt-1 text-sm font-semibold text-slate-950">
            {document.document_title}
          </h3>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {label(document.document_status)}
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-slate-500">
        {label(document.document_type)} · {document.document_date ?? "Undated"}
      </p>
    </article>
  );
}

export default async function CounselWorkspacePage({
  params,
}: CounselWorkspacePageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>Matter not found.</p>
      </main>
    );
  }

  const access = getExternalCounselAccess(matterData);
  const engagement = matterData.counsel_engagements?.[0];
  const brief = engagement?.briefs?.[0];
  const questions = brief?.questions ?? [];
  const workstream = matterData.workstreams[0];
  const evidence = workstream
    ? buildEvidencePacket(matterData, {
        workstream,
        maxSources: 8,
      }).sources
    : [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/counsel-review"
          className="text-sm font-semibold text-slate-500 hover:text-blue-700"
        >
          Back to counsel review
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow text-blue-700">Scoped external counsel workspace</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {matterData.matter.matter_title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                This is a simulated limited-access view. It contains the matter
                context, scoped questions, and documents prepared for external
                counsel; internal decisions and portfolio information are not shown.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Simulated access</p>
              <p className="mt-1">
                {access
                  ? label(access.access_level) + " · " + (access.user?.user_name ?? "External counsel")
                  : "No external-counsel access record"}
              </p>
            </div>
          </div>
        </header>

        {!access ? (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Workspace not provisioned
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The repository has no external-counsel access record for this
              matter. The prototype will not infer or create one.
            </p>
          </section>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6">
              <section className="surface-card rounded-xl p-6">
                <p className="eyebrow">Engagement</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  {engagement?.counsel?.firm_name ?? "External counsel"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {engagement?.counsel?.counsel_name ?? "Counsel contact not recorded"}
                  {engagement?.counsel?.email ? " · " + engagement.counsel.email : ""}
                </p>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {engagement?.engagement_description ?? "No engagement scope recorded."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {label(engagement?.engagement_status)}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {workstream?.workstream_name ?? "Workstream not recorded"}
                  </span>
                </div>
              </section>

              <section className="surface-card rounded-xl p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow">Queries</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">
                      Questions for counsel
                    </h2>
                  </div>
                  <span className="text-sm text-slate-500">{questions.length} questions</span>
                </div>
                <div className="mt-4 space-y-3">
                  {questions.map((question) => (
                    <article key={question.question_id} className="rounded-lg bg-slate-50 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-slate-500">
                          {question.question_id}
                        </span>
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                          {label(question.question_priority)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {question.question_text}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="surface-card rounded-xl p-6">
                <p className="eyebrow">Scoped documents</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950">
                  Documents shared for this matter
                </h2>
                <div className="mt-4 space-y-3">
                  {(workstream?.documents ?? []).map((document) => (
                    <DocumentRow key={document.document_id} document={document} />
                  ))}
                </div>
              </section>

              <section className="surface-card rounded-xl p-6">
                <p className="eyebrow">Supporting evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Evidence is shown as a scoped reference list for the current
                  workstream, not as an unrestricted internal data view.
                </p>
                <div className="mt-4 space-y-2">
                  {evidence.map((source) => (
                    <div key={source.chunk_id} className="rounded-lg bg-slate-50 p-3">
                      <p className="font-mono text-xs font-medium text-blue-700">
                        {source.chunk_id}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {source.section_title ?? source.document_title}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

```

### `app/evidence/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/evidence/page.tsx`

```tsx
import DocumentLibrary, {
  type DocumentLibraryItem,
} from "@/components/matter/DocumentLibrary";
import { getAllMatters } from "@/lib/data/matter-service";

type EvidencePageProps = {
  searchParams: Promise<{
    matterId?: string;
    workstreamId?: string;
  }>;
};

export default async function EvidencePage({ searchParams }: EvidencePageProps) {
  const { matterId, workstreamId } = await searchParams;
  const items: DocumentLibraryItem[] = getAllMatters().flatMap((matterData) =>
    matterData.workstreams.flatMap((workstream) =>
      (workstream.documents ?? []).map((document) => ({
        matterId: matterData.matter.matter_id,
        matterTitle: matterData.matter.matter_title,
        workstreamId: workstream.workstream_id,
        workstreamName: workstream.workstream_name,
        document,
      }))
    )
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="surface-card rounded-xl p-7">
          <p className="eyebrow text-blue-700">
            Documentary Evidence
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Matter document library
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Browse the complete document set associated with each matter. Issue
            evidence remains scoped to the relevant issue inside its workstream.
          </p>
        </header>

        <DocumentLibrary
          items={items}
          initialMatterId={matterId ?? "all"}
          initialWorkstreamId={
            matterId && workstreamId ? matterId + ":" + workstreamId : "all"
          }
        />
      </div>
    </main>
  );
}

```

### `app/globals.css`

```css
@import "tailwindcss";

:root {
  --background: #f5f7fa;
  --foreground: #132238;
  --navy: #132238;
  --blue: #2563eb;
  --muted: #64748b;
  --line: #e2e8f0;
  --surface: #ffffff;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: Arial, Helvetica, sans-serif;
  --font-mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
}

* {
  border-color: var(--line);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

button,
a,
summary,
select,
input,
textarea {
  -webkit-tap-highlight-color: transparent;
}

summary::-webkit-details-marker {
  display: none;
}

.surface-card {
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.eyebrow {
  color: #64748b;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

```

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import PrimaryNavigation from "@/components/navigation/PrimaryNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "MatterBridge",
  description: "Legal matter intelligence prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 lg:flex-row">
        <PrimaryNavigation />
        <div className="min-w-0 flex-1">{children}</div>
      </body>
    </html>
  );
}

```

### `app/matters/[matterId]/counsel-brief/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/matters/[matterId]/counsel-brief/page.tsx`

```tsx
import Link from "next/link";
import { getMatter } from "@/lib/data/matter-service";
import type {
  AIFinding,
  Document,
  LegalIssue,
  MatterBundle,
} from "@/lib/types/matter";

type CounselBriefPageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Not applicable";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function findingState(finding: AIFinding) {
  if (
    finding.finding_type === "INFORMATION_GAP" ||
    finding.requires_verification === "YES"
  ) {
    return {
      label: "Information Missing",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (
    finding.finding_type === "LEGAL_ISSUE" ||
    finding.requires_legal_judgment === "YES"
  ) {
    return {
      label: "Legal Judgment Required",
      className: "border-sky-200 bg-sky-50 text-sky-800",
    };
  }

  return {
    label: "Supported",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
}

function priorityClassName(priority?: string) {
  if (priority === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (priority === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function getCounselData(matterData: MatterBundle) {
  const engagement = matterData.counsel_engagements?.[0];
  const brief = engagement?.briefs?.[0];
  const questions =
    matterData.counsel_engagements?.flatMap((item) =>
      item.briefs?.flatMap((itemBrief) => itemBrief.questions ?? []) ?? []
    ) ?? [];
  const documents = matterData.workstreams.flatMap(
    (workstream) => workstream.documents ?? []
  );
  const findings = matterData.workstreams.flatMap(
    (workstream) => workstream.findings ?? []
  );
  const issues = matterData.workstreams.flatMap(
    (workstream) => workstream.issues ?? []
  );

  return { engagement, brief, questions, documents, findings, issues };
}

function ContextCard({ matterData }: { matterData: MatterBundle }) {
  const { matter, parties } = matterData;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-slate-500">
            Matter context
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            {matter.matter_title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            {matter.matter_description}
          </p>
        </div>

        <div className="grid min-w-64 grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Client</p>
            <p className="mt-1 font-medium text-slate-900">
              {parties?.client?.party_name ?? "Not recorded"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Counterparty</p>
            <p className="mt-1 font-medium text-slate-900">
              {parties?.counterparty?.party_name ?? "Not recorded"}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Risk</p>
            <p className="mt-1 font-semibold text-rose-700">
              {matter.risk_rating}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Exposure</p>
            <p className="mt-1 font-semibold text-slate-900">
              {formatCurrency(matter.outstanding_exposure_inr)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuestionCard({
  question,
}: {
  question: NonNullable<
    NonNullable<MatterBundle["counsel_engagements"]>[number]["briefs"]
  >[number]["questions"] extends infer Questions
    ? Questions extends Array<infer Question>
      ? Question
      : never
    : never;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {question.question_id}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-800">
            {question.question_text}
          </p>
        </div>
        <span
          className={
            "w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold " +
            priorityClassName(question.question_priority)
          }
        >
          {label(question.question_priority)}
        </span>
      </div>
      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
        {label(question.question_category)}
      </p>
    </article>
  );
}

function IssueCard({ issue }: { issue: LegalIssue }) {
  return (
    <article className="rounded-lg border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-medium text-sky-700">
            {issue.issue_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-sky-950">
            {issue.issue_title}
          </h3>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-800">
          Legal judgment
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-sky-900/80">
        {issue.issue_description}
      </p>
    </article>
  );
}

function DocumentCard({ document }: { document: Document }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-mono text-xs font-medium text-slate-500">
        {document.document_id}
      </p>
      <h3 className="mt-2 text-sm font-semibold text-slate-950">
        {document.document_title}
      </h3>
      <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
        <span>{label(document.document_type)}</span>
        <span>{document.document_date ?? "Undated"}</span>
        <span>{label(document.document_status)}</span>
      </div>
    </article>
  );
}

export default async function CounselBriefPage({
  params,
}: CounselBriefPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>Matter not found.</p>
      </main>
    );
  }

  const {
    engagement,
    brief,
    questions,
    documents,
    findings,
    issues,
  } = getCounselData(matterData);
  const informationMissing = findings.filter(
    (finding) => findingState(finding).label === "Information Missing"
  );
  const judgmentIssues = issues.filter(
    (issue) => issue.requires_legal_judgment === "YES"
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/matters/${matterId}`}
            className="text-sm font-semibold text-slate-500 hover:text-blue-700"
          >
            Back to matter
          </Link>
          {matterId === "MAT-001" ? (
            <Link
              href="/matters/MAT-001/workstreams/WS-002"
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View Security Verification →
            </Link>
          ) : null}
        </div>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow text-blue-700">
                {matterData.matter.matter_id} / Counsel workspace
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Counsel Brief
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                Evidence-linked instructions for external counsel. The brief
                preserves what is supported, what is missing, and what requires
                legal judgment before advice is requested.
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Output status</p>
              <p className="mt-1">{label(engagement?.outputs?.[0]?.output_status)}</p>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <div className="space-y-6">
            <ContextCard matterData={matterData} />

            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Counsel engagement
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    The current brief and its intended external recipient.
                  </p>
                </div>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {label(engagement?.engagement_status)}
                </span>
              </div>

              <article className="mt-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs font-medium text-slate-500">
                      {engagement?.engagement_id ?? "No engagement"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950">
                      {engagement?.counsel?.firm_name ?? "External counsel not recorded"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {engagement?.counsel?.counsel_name ?? "No counsel contact recorded"}
                      {engagement?.counsel?.specialization
                        ? ` · ${engagement.counsel.specialization}`
                        : ""}
                    </p>
                  </div>
                  <div className="text-sm text-slate-700 sm:text-right">
                    <p>{label(engagement?.engagement_type)}</p>
                    <p className="mt-1">
                      Budget: {formatCurrency(engagement?.budget_inr)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-6 text-slate-600">
                  {engagement?.engagement_description ??
                    "No counsel engagement description recorded."}
                </p>

                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Brief record
                  </p>
                  <p className="mt-2 font-medium text-slate-900">
                    {brief?.brief_title ?? "No brief recorded"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {brief?.brief_id ?? "—"} · {label(brief?.brief_status)} ·{" "}
                    {brief?.brief_date ?? "Undated"}
                  </p>
                </div>
              </article>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-950">
                Questions for counsel
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Questions are preserved from the issued brief; no legal answer
                is inferred in this prototype.
              </p>
              <div className="mt-4 grid gap-3">
                {questions.map((question) => (
                  <QuestionCard key={question.question_id} question={question} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-slate-950">
                Brief boundaries
              </h2>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                  <p className="text-sm font-semibold text-amber-900">
                    Information missing · {informationMissing.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-amber-900/80">
                    These items should trigger targeted verification or evidence
                    requests, not a definitive conclusion.
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-amber-950">
                    {informationMissing.map((finding) => (
                      <li key={finding.finding_id}>
                        <span className="font-medium">{finding.finding_id}</span>{" "}
                        {finding.finding_title}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50 p-5">
                  <p className="text-sm font-semibold text-sky-900">
                    Legal judgment required · {judgmentIssues.length}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-sky-900/80">
                    These are questions for counsel or Internal Legal. The
                    system does not select an enforcement route or issue a title
                    opinion.
                  </p>
                  <div className="mt-3 space-y-2">
                    {judgmentIssues.map((issue) => (
                      <IssueCard key={issue.issue_id} issue={issue} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">
                    Supporting documents
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {documents.length} documents from the matter workstreams.
                  </p>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {documents.map((document) => (
                  <DocumentCard key={document.document_id} document={document} />
                ))}
              </div>
            </section>
          </aside>
        </div>

      </div>
    </main>
  );
}

```

### `app/matters/[matterId]/institutional-memory/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/matters/[matterId]/institutional-memory/page.tsx`

```tsx
import Link from "next/link";
import { getMatter } from "@/lib/data/matter-service";
import type { HistoricalMatter, InstitutionalKnowledgeItem } from "@/lib/types/matter";

type InstitutionalMemoryPageProps = {
  params: Promise<{ matterId: string }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function HistoricalCard({ precedent }: { precedent: HistoricalMatter }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{precedent.historical_matter_id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{precedent.matter_reference}</h3>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{label(precedent.outcome)}</span>
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div><p className="text-xs text-slate-400">Matter type</p><p className="mt-1 font-medium text-slate-800">{label(precedent.matter_type)}</p></div>
        <div><p className="text-xs text-slate-400">Timeline</p><p className="mt-1 font-medium text-slate-800">{precedent.timeline_months ?? "Not recorded"} months</p></div>
        <div><p className="text-xs text-slate-400">Result</p><p className="mt-1 font-medium text-slate-800">{precedent.recovery_percentage != null ? `${precedent.recovery_percentage}% recovery` : "Not recorded"}</p></div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{precedent.lessons_learned}</p>
    </article>
  );
}

function KnowledgeCard({ item }: { item: InstitutionalKnowledgeItem }) {
  return (
    <article className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-blue-700">{item.knowledge_item_id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">{item.knowledge_item_title}</h3>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-700">Reusable knowledge</span>
      </div>
      {item.context ? <p className="mt-4 text-sm leading-6 text-slate-700">{item.context}</p> : null}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Lesson</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.lesson}</p></div>
        <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Use when</p><p className="mt-2 text-sm leading-6 text-slate-700">{item.use_when}</p></div>
      </div>
      <p className="mt-4 border-t border-blue-100 pt-4 text-sm leading-6 text-slate-700"><span className="font-semibold">MAT-001 application:</span> {item.matter_application}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(item.relevant_historical_matter_ids ?? []).map((id) => <span key={id} className="rounded-full bg-white px-3 py-1 font-mono text-xs text-slate-600">{id}</span>)}
        {(item.source_ids ?? []).map((id) => <span key={id} className="rounded-full bg-blue-100 px-3 py-1 font-mono text-xs text-blue-800">{id}</span>)}
      </div>
    </article>
  );
}

export default async function InstitutionalMemoryPage({ params }: InstitutionalMemoryPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return <main className="min-h-screen bg-slate-50 p-10 text-slate-950">Matter not found.</main>;
  }

  const memory = matterData.institutional_memory;
  const precedents = matterData.historical_precedents ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-blue-700">Back to matter</Link>
        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">{matterData.matter.matter_id} / Institutional Memory</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">Precedent and reusable knowledge</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">Use prior matters and the current counsel-to-decision trail to answer: have we dealt with something like this before?</p>
            </div>
            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">Current outcome: {label(memory?.outcome_status)}</span>
          </div>
        </header>

        <section className="mt-8">
          <p className="eyebrow text-blue-700">MAT-001 knowledge</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Reusable lessons from this matter</h2>
          <div className="mt-4 grid gap-4">{(memory?.knowledge_items ?? []).map((item) => <KnowledgeCard key={item.knowledge_item_id} item={item} />)}</div>
        </section>

        <section className="mt-10">
          <p className="eyebrow text-blue-700">Existing company precedents</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Relevant historical matters</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">These records are reused from the existing historical-matters dataset. Their facts and outcomes have not been altered to create a match.</p>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">{precedents.map((precedent) => <HistoricalCard key={precedent.historical_matter_id} precedent={precedent} />)}</div>
        </section>

        <section className="surface-card mt-10 rounded-xl p-6">
          <p className="eyebrow">Future outcome record</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Outcome remains open</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Final recovery route, enforcement result, settlement, cost, duration, and strategy effectiveness remain unknown and are intentionally not synthesized.</p>
          <div className="mt-4 flex flex-wrap gap-2">{Object.entries(memory?.future_outcome_fields ?? {}).map(([key, value]) => <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{label(key)}: {value ?? "Open"}</span>)}</div>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/matters/${matterId}/opinion-review`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">Back to Opinion Review</Link>
          <Link href={`/matters/${matterId}/legal-decision`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">Open Legal Decision</Link>
        </div>
      </div>
    </main>
  );
}

```

### `app/matters/[matterId]/legal-decision/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/matters/[matterId]/legal-decision/page.tsx`

```tsx
import Link from "next/link";
import DecisionWorkspace from "@/components/matter/DecisionWorkspace";
import { getMatter } from "@/lib/data/matter-service";
import type { Decision } from "@/lib/types/matter";

type LegalDecisionPageProps = {
  params: Promise<{ matterId: string }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function DecisionList({ decision }: { decision: Decision }) {
  return (
    <div className="space-y-3">
      {(decision.selected_actions ?? []).map((action) => (
        <div key={action} className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {action}
        </div>
      ))}
    </div>
  );
}

export default async function LegalDecisionPage({ params }: LegalDecisionPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return <main className="min-h-screen bg-slate-50 p-10 text-slate-950">Matter not found.</main>;
  }

  const decision = matterData.decisions?.[0];

  if (!decision) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-blue-700">Back to matter</Link>
        <p className="mt-6">No legal decision is recorded for this matter.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to matter
        </Link>
        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">{matterData.matter.matter_id} / Legal Decision</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">{decision.decision_title}</h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">{decision.decision_summary}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800">{label(decision.decision_status)}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{decision.decision_date}</span>
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Selected action</p>
              <div className="mt-4"><DecisionList decision={decision} /></div>
            </section>

            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Alternatives considered</p>
              <div className="mt-4 space-y-3">
                {(decision.alternatives_considered ?? []).map((alternative) => (
                  <article key={alternative.alternative} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">{alternative.alternative}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{label(alternative.decision)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{alternative.reason}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Follow-up actions</p>
              <div className="mt-4 space-y-3">
                {(decision.follow_up_actions ?? []).map((action) => (
                  <article key={action.action_id} className="rounded-lg bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">{action.action}</h3>
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{label(action.status)}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">Owner: {action.owner}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Decision factors</p>
              <dl className="mt-4 space-y-4 text-sm">
                {Object.entries(decision.decision_factors ?? {}).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label(key)}</dt>
                    <dd className="mt-1 leading-6 text-slate-700">{value ?? "Not quantified"}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <DecisionWorkspace decision={decision} />
          </aside>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/matters/${matterId}/opinion-review`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">Back to Opinion Review</Link>
          <Link href={`/matters/${matterId}/institutional-memory`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">View Institutional Memory</Link>
        </div>
      </div>
    </main>
  );
}

```

### `app/matters/[matterId]/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/matters/[matterId]/opinion-review/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/matters/[matterId]/opinion-review/page.tsx`

```tsx
import Link from "next/link";
import LiveOpinionReview from "@/components/matter/LiveOpinionReview";
import { getMatter } from "@/lib/data/matter-service";
import type { CounselOpinionReviewPoint, CounselOpinionSection } from "@/lib/types/matter";

type OpinionReviewPageProps = {
  params: Promise<{ matterId: string }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function severityClassName(value: string) {
  if (value === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (value === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function SourceList({
  label: sourceLabel,
  ids,
}: {
  label: string;
  ids?: string[];
}) {
  if (!ids?.length) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {sourceLabel}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {ids.map((id) => (
          <span
            key={id}
            className="rounded-full bg-slate-100 px-3 py-1 font-mono text-xs font-medium text-slate-700"
          >
            {id}
          </span>
        ))}
      </div>
    </div>
  );
}

function OpinionSection({ section }: { section: CounselOpinionSection }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{section.opinion_section_id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">
            {section.section_title}
          </h3>
        </div>
        <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {label(section.section_type)}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{section.section_summary}</p>
      <div className="mt-4 flex flex-wrap gap-4">
        <SourceList label="Counsel source" ids={section.source_document_ids} />
        <SourceList label="Source sections" ids={section.source_section_ids} />
      </div>
    </article>
  );
}

function ReviewPoint({ point }: { point: CounselOpinionReviewPoint }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{point.review_point_id}</p>
          <h3 className="mt-1 text-base font-semibold text-slate-950">
            {point.review_title}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className={"rounded-full border px-3 py-1 " + severityClassName(point.severity)}>
            {label(point.severity)} severity
          </span>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
            {label(point.review_type)}
          </span>
        </div>
      </div>

      {point.counsel_position || point.counsel_assertion ? (
        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Counsel position
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {point.counsel_position ?? point.counsel_assertion}
          </p>
        </div>
      ) : null}

      <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          MatterBridge review
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{point.matterbridge_review}</p>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Recommended action
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {label(point.recommended_action)}
          </p>
        </div>
        {point.suggested_question ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Suggested question
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{point.suggested_question}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <SourceList label="Counsel references" ids={point.counsel_source_ids} />
        <SourceList label="Company evidence / precedent" ids={point.company_source_ids} />
      </div>
      <SourceList label="Company source sections" ids={point.company_source_section_ids} />
    </article>
  );
}

export default async function OpinionReviewPage({ params }: OpinionReviewPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return <main className="min-h-screen bg-slate-50 p-10 text-slate-950">Matter not found.</main>;
  }

  const engagement = matterData.counsel_engagements?.[0];
  const output = engagement?.outputs?.[0];
  const sections = output?.opinion_sections ?? [];
  const reviewPoints = output?.review_points ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href={`/matters/${matterId}`} className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to matter
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">{matterData.matter.matter_id} / Counsel Opinion Review</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Review external counsel advice
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Compare counsel&apos;s position with company evidence and historical precedent. MatterBridge surfaces differences for Internal Legal review; it does not replace legal judgment.
              </p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="font-semibold">{label(output?.output_status)}</p>
              <p className="mt-1">Opinion date: {output?.output_date ?? "Not recorded"}</p>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-6">
            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Counsel engagement</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-950">
                {engagement?.counsel?.firm_name ?? "External counsel"}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {engagement?.counsel?.counsel_name ?? "Counsel not recorded"}
              </p>
              <p className="mt-4 text-sm leading-6 text-slate-600">{engagement?.engagement_description}</p>
            </section>

            <section className="surface-card rounded-xl p-6">
              <p className="eyebrow">Counsel summary</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">
                {output?.opinion_summary ?? "No substantive counsel opinion is recorded."}
              </p>
            </section>
          </aside>

          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-blue-700">Review findings</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                  Differences requiring legal attention
                </h2>
              </div>
              <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {reviewPoints.length} review points
              </span>
            </div>
            <div className="mt-4 grid gap-4">
              {reviewPoints.map((point) => (
                <ReviewPoint key={point.review_point_id} point={point} />
              ))}
            </div>
          </section>
        </section>

        <section className="mt-10">
          <p className="eyebrow text-blue-700">Counsel advice</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Opinion sections
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {sections.map((section) => (
              <OpinionSection key={section.opinion_section_id} section={section} />
            ))}
          </div>
        </section>

        <LiveOpinionReview matterId={matterId} />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/matters/${matterId}/legal-decision`} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Continue to Legal Decision →
          </Link>
          <Link href={`/matters/${matterId}/institutional-memory`} className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700">
            View Institutional Memory
          </Link>
        </div>
      </div>
    </main>
  );
}

```

### `app/matters/[matterId]/page.tsx`

```tsx
import Link from "next/link";
import MatterActivityPanels from "@/components/matter/MatterActivityPanels";
import { getMatter } from "@/lib/data/matter-service";

type MatterPageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Not applicable";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function statusClassName(value?: string) {
  if (value === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (value === "MEDIUM" || value === "IN_PROGRESS" || value === "PENDING") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export default async function MatterPage({ params }: MatterPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>Matter not found.</p>
      </main>
    );
  }

  const { matter, parties } = matterData;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to matters
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">
                {matter.matter_id} / {label(matterData.matter_type?.matter_type_name)}
              </p>
              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                {matter.matter_title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {matter.matter_description}
              </p>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <p className="eyebrow">Client</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {parties?.client?.party_name ?? "Not recorded"}
                  </p>
                </div>
                <div>
                  <p className="eyebrow">Counterparty</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {parties?.counterparty?.party_name ?? "Not recorded"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid min-w-64 grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs text-slate-500">Risk</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{matter.risk_rating}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs text-slate-500">Status</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">{label(matter.matter_status)}</p>
              </div>
              <div className="col-span-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-xs text-slate-500">Exposure</p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {formatCurrency(matter.outstanding_exposure_inr)}
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-blue-700">Matter workspace</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Workstreams</h2>
              <p className="mt-1 text-sm text-slate-600">
                Open a focused work area for the legal work that needs attention.
              </p>
            </div>
            <Link
              href={"/evidence?matterId=" + matter.matter_id}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Browse Documentary Evidence →
            </Link>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {matterData.workstreams.map((workstream) => (
              <Link
                key={workstream.workstream_id}
                href={
                  "/matters/" +
                  matter.matter_id +
                  "/workstreams/" +
                  workstream.workstream_id
                }
                className="group rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgb(15_23_42_/_0.04)] transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-medium text-slate-500">{workstream.workstream_id}</p>
                    <h3 className="mt-2 text-lg font-semibold text-slate-950 group-hover:text-blue-700">
                      {workstream.workstream_name}
                    </h3>
                  </div>
                  <span
                    className={
                      "rounded-full border px-3 py-1 text-xs font-semibold " +
                      statusClassName(workstream.workstream_status)
                    }
                  >
                    {label(workstream.workstream_status)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {workstream.workstream_description}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-slate-600">
                  <span>{workstream.documents?.length ?? 0} documents</span>
                  <span>{workstream.findings?.length ?? 0} findings</span>
                  <span>{workstream.issues?.length ?? 0} issues</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <MatterActivityPanels
          matterId={matter.matter_id}
          timeline={matterData.timeline ?? []}
          engagements={matterData.counsel_engagements ?? []}
          decisions={matterData.decisions ?? []}
          workstreams={matterData.workstreams}
        />
      </div>
    </main>
  );
}

```

### `app/matters/[matterId]/workstreams/[workstreamId]/loading.tsx`

```tsx
import PageLoading from "@/components/shared/PageLoading";

export default function Loading() {
  return <PageLoading />;
}

```

### `app/matters/[matterId]/workstreams/[workstreamId]/page.tsx`

```tsx
import Link from "next/link";
import RecoveryIssueWorkspace from "@/components/matter/RecoveryIssueWorkspace";
import { getMatter, getWorkstream } from "@/lib/data/matter-service";
import { buildEvidencePacket } from "@/lib/data/evidence-service";
import { mapIssuesToSupport } from "@/lib/data/issue-mapping";
import type { AIFinding, LegalIssue, MatterAssetBundle } from "@/lib/types/matter";

type WorkstreamPageProps = {
  params: Promise<{
    matterId: string;
    workstreamId: string;
  }>;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function formatCurrency(value?: number | null) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function classifyFinding(finding: AIFinding) {
  if (
    finding.finding_type === "INFORMATION_GAP" ||
    finding.requires_verification === "YES"
  ) {
    return {
      label: "Information Missing",
      className: "border-amber-200 bg-amber-50 text-amber-800",
    };
  }

  if (
    finding.finding_type === "LEGAL_ISSUE" ||
    finding.finding_type === "RECOMMENDATION" ||
    finding.requires_legal_judgment === "YES"
  ) {
    return {
      label: "Legal Judgment Required",
      className: "border-sky-200 bg-sky-50 text-sky-800",
    };
  }

  return {
    label: "Supported",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  };
}

function issueClassName(issue: LegalIssue) {
  if (issue.requires_legal_judgment === "YES") {
    return "border-sky-200 bg-sky-50 text-sky-800";
  }

  if (issue.issue_priority === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function FindingCard({ finding }: { finding: AIFinding }) {
  const state = classifyFinding(finding);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {finding.finding_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-950">
            {finding.finding_title}
          </h3>
        </div>

        <span
          className={
            "w-fit rounded-full border px-3 py-1 text-xs font-semibold " +
            state.className
          }
        >
          {state.label}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {finding.finding_summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
          {label(finding.finding_type)}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
          Verification: {finding.requires_verification === "YES" ? "Yes" : "No"}
        </span>
      </div>

      {(finding.citations?.length ?? 0) > 0 ? (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Evidence
          </p>
          <div className="mt-3 grid gap-2">
            {finding.citations?.map((citation) => (
              <div
                key={citation.citation_id}
                className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700"
              >
                <p className="font-medium text-slate-900">
                  {citation.source_id}
                  {citation.source_section ? " / " + citation.source_section : ""}
                </p>
                <p className="mt-1 leading-6">{citation.citation_text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function IssueCard({ issue }: { issue: LegalIssue }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {issue.issue_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-950">
            {issue.issue_title}
          </h3>
        </div>

        <span
          className={
            "rounded-full border px-3 py-1 text-xs font-semibold " +
            issueClassName(issue)
          }
        >
          {issue.requires_legal_judgment === "YES"
            ? "Legal judgment"
            : issue.issue_priority}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {issue.issue_description}
      </p>
    </article>
  );
}

function SecurityCard({ assetBundle }: { assetBundle: MatterAssetBundle }) {
  const { asset, security_interest: securityInterest } = assetBundle;

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium text-slate-500">
            {asset.asset_id}
          </p>
          <h3 className="mt-2 text-base font-semibold text-slate-950">
            {asset.asset_name}
          </h3>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {label(asset.asset_status)}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        {asset.asset_description}
      </p>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Security
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {label(securityInterest?.security_type)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Value
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {formatCurrency(securityInterest?.security_value_inr)}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Registration
          </p>
          <p className="mt-1 font-medium text-slate-900">
            {securityInterest?.registration_number ?? "Not applicable"}
          </p>
        </div>
      </div>
    </article>
  );
}

export default async function WorkstreamPage({
  params,
}: WorkstreamPageProps) {
  const { matterId, workstreamId } = await params;
  const matterData = getMatter(matterId);
  const workstream = getWorkstream(matterId, workstreamId);

  if (!matterData || !workstream) {
    return (
      <main className="min-h-screen bg-slate-50 p-10 text-slate-950">
        <p>{matterData ? "Workstream not found." : "Matter not found."}</p>
      </main>
    );
  }

  const isSecurityVerification =
    matterData.matter.matter_id === "MAT-001" &&
    workstream.workstream_name === "Security Verification";
  const isRecoveryAssessment =
    matterData.matter.matter_id === "MAT-001" &&
    workstream.workstream_name === "Recovery Assessment";
  const isEmployeeLeaveReview =
    matterData.matter.matter_id === "MAT-002" &&
    workstream.workstream_name === "Employee Leave & Misconduct Review";
  const securityAssets = isSecurityVerification ? matterData.assets ?? [] : [];
  const usesIssueRelationshipWorkspace =
    isRecoveryAssessment || isSecurityVerification || isEmployeeLeaveReview;
  const issueSupport = usesIssueRelationshipWorkspace
    ? mapIssuesToSupport(
        workstream.issues ?? [],
        workstream.findings ?? [],
        workstream.documents ?? [],
        buildEvidencePacket(matterData, {
          workstream,
          maxSources: 40,
        }).sources
      )
    : [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href={"/matters/" + matterId}
          className="text-sm font-semibold text-slate-500 hover:text-blue-700"
        >
          Back to matter
        </Link>

        <header className="surface-card mt-5 rounded-xl p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow text-blue-700">
                {matterData.matter.matter_id} / {workstream.workstream_id}
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                {workstream.workstream_name}
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {workstream.workstream_description}
              </p>
            </div>

            <div className="grid min-w-64 grid-cols-3 gap-2 text-sm">
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Findings</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {workstream.findings?.length ?? 0}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Active Issues</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {workstream.issues?.length ?? 0}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="eyebrow">Documents</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {workstream.documents?.length ?? 0}
                </p>
              </div>
            </div>
          </div>
        </header>

        {usesIssueRelationshipWorkspace ? (
          <RecoveryIssueWorkspace
            issueSupport={issueSupport}
            workstreamName={workstream.workstream_name}
          />
        ) : (
          <section className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Findings
              </h2>

              <div className="mt-4 grid gap-4">
                {(workstream.findings ?? []).map((finding) => (
                  <FindingCard key={finding.finding_id} finding={finding} />
                ))}
              </div>
            </div>

            <aside>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                Active Issues
              </h2>

              <div className="mt-4 grid gap-4">
                {(workstream.issues ?? []).map((issue) => (
                  <IssueCard key={issue.issue_id} issue={issue} />
                ))}
              </div>
            </aside>
          </section>
        )}

        {securityAssets.length > 0 ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-950">
              Security Package
            </h2>

            <p className="mt-1 text-sm text-slate-600">
              Security Verification should preserve unresolved title and
              perfection questions for counsel review.
            </p>

            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {securityAssets.map((assetBundle) => (
                <SecurityCard
                  key={assetBundle.asset.asset_id}
                  assetBundle={assetBundle}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="surface-card mt-8 rounded-xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">
                Documents in this workstream
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                View the complete documentary record in the central evidence library.
              </p>
            </div>
            <Link
              href={
                "/evidence?matterId=" +
                matterId +
                "&workstreamId=" +
                workstreamId
              }
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Documentary Evidence ({workstream.documents?.length ?? 0}) →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

```

### `app/page.tsx`

```tsx
import MatterStatusTabs from "@/components/matter/MatterStatusTabs";
import { getAllMatters } from "@/lib/data/matter-service";

export default function Home() {
  const matters = getAllMatters();
  const closedStatuses = new Set(["CLOSED", "COMPLETED", "ARCHIVED"]);
  const openMatters = matters.filter(
    (matterData) => !closedStatuses.has(matterData.matter.matter_status)
  );
  const closedMatters = matters.filter((matterData) =>
    closedStatuses.has(matterData.matter.matter_status)
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-slate-200 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-blue-700">Legal operations workspace</p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
                Legal Matter Intelligence
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                A legal operating layer for preserving matter context, evidence,
                counsel advice, internal decisions, and institutional memory.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Open matters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{openMatters.length}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Closed matters</p>
                <p className="mt-1 text-2xl font-semibold text-slate-950">{closedMatters.length}</p>
              </div>
            </div>
          </div>
        </header>

        <MatterStatusTabs openMatters={openMatters} closedMatters={closedMatters} />
      </div>
    </main>
  );
}

```

### `app/settings/page.tsx`

```tsx
export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-950 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <header className="surface-card rounded-xl p-7">
          <p className="eyebrow text-blue-700">
            Settings
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Prototype settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Settings are not persisted in this prototype. Production access
            controls, notifications, and integrations would be configured here.
          </p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="surface-card rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-900">Access model</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Simulated matter access only. Production RBAC is not implemented.
            </p>
          </div>
          <div className="surface-card rounded-xl p-5">
            <p className="text-sm font-semibold text-slate-900">Document uploads</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Upload actions are simulated and do not store files.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

```

### `components/matter/DecisionWorkspace.tsx`

```tsx
"use client";

import { useState } from "react";
import type { Decision } from "@/lib/types/matter";

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

export default function DecisionWorkspace({ decision }: { decision: Decision }) {
  const [rationale, setRationale] = useState(decision.decision_rationale ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <section className="surface-card rounded-xl p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs text-slate-500">{decision.decision_id}</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Decision rationale</h2>
        </div>
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
          Local prototype state
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Review and amend the rationale before recording the internal legal position. This prototype does not persist changes.
      </p>
      <textarea
        value={rationale}
        onChange={(event) => {
          setRationale(event.target.value);
          setSaved(false);
        }}
        rows={8}
        className="mt-4 w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        aria-label="Decision rationale"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-400">Local prototype note · not saved</span>
        <button
          type="button"
          onClick={() => setSaved(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {saved ? "Rationale captured locally" : "Capture rationale"}
        </button>
      </div>
      <p className="mt-4 text-xs text-slate-500">Current state: {label(decision.decision_finality)}</p>
    </section>
  );
}

```

### `components/matter/DocumentLibrary.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Document } from "@/lib/types/matter";

export type DocumentLibraryItem = {
  matterId: string;
  matterTitle: string;
  workstreamId: string;
  workstreamName: string;
  document: Document;
};

type DocumentLibraryProps = {
  items: DocumentLibraryItem[];
  initialMatterId?: string;
  initialWorkstreamId?: string;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

export default function DocumentLibrary({
  items,
  initialMatterId = "all",
  initialWorkstreamId = "all",
}: DocumentLibraryProps) {
  const [matterId, setMatterId] = useState(initialMatterId);
  const [workstreamId, setWorkstreamId] = useState(initialWorkstreamId);
  const [query, setQuery] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const matterOptions = useMemo(
    () =>
      Array.from(
        new Map(items.map((item) => [item.matterId, item.matterTitle])).entries()
      ),
    [items]
  );

  const workstreamOptions = useMemo(
    () =>
      Array.from(
        new Map(
          items
            .filter((item) => matterId === "all" || item.matterId === matterId)
            .map((item) => [
              `${item.matterId}:${item.workstreamId}`,
              `${item.matterTitle} · ${item.workstreamName}`,
            ])
        ).entries()
      ),
    [items, matterId]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesMatter = matterId === "all" || item.matterId === matterId;
      const matchesWorkstream =
        workstreamId === "all" ||
        `${item.matterId}:${item.workstreamId}` === workstreamId;
      const searchable = [
        item.document.document_title,
        item.document.document_type,
        item.document.document_source,
        item.workstreamName,
        item.matterTitle,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesMatter && matchesWorkstream && searchable.includes(normalizedQuery)
      );
    });
  }, [items, matterId, query, workstreamId]);

  function handleMatterChange(nextMatterId: string) {
    setMatterId(nextMatterId);
    setWorkstreamId("all");
  }

  return (
    <section className="mt-8">
      <div className="surface-card flex flex-col gap-4 rounded-xl p-5 lg:flex-row lg:items-end">
        <label className="flex-1 text-sm font-medium text-slate-700">
          Matter
          <select
            value={matterId}
            onChange={(event) => handleMatterChange(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All matters</option>
            {matterOptions.map(([id, title]) => (
              <option key={id} value={id}>
                {id} · {title}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm font-medium text-slate-700">
          Workstream
          <select
            value={workstreamId}
            onChange={(event) => setWorkstreamId(event.target.value)}
            className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="all">All workstreams</option>
            {workstreamOptions.map(([id, labelText]) => (
              <option key={id} value={id}>
                {labelText}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 text-sm font-medium text-slate-700">
          Search documents
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title, type, source..."
            className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="button"
          onClick={() =>
            setUploadMessage("Upload is simulated in this prototype; no file was stored.")
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Upload Document
        </button>
      </div>

      {uploadMessage ? (
        <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          {uploadMessage}
        </p>
      ) : null}

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{filteredItems.length} documents shown</span>
        <span>Source data is read-only in this prototype</span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {filteredItems.map((item) => (
          <details
            key={`${item.matterId}:${item.document.document_id}`}
            className="surface-card rounded-xl p-5 transition hover:border-blue-300"
          >
            <summary className="cursor-pointer list-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-medium text-slate-500">
                    {item.document.document_id}
                  </p>
                  <h2 className="mt-2 text-base font-semibold tracking-tight text-slate-950">
                    {item.document.document_title}
                  </h2>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {label(item.document.document_status)}
                </span>
              </div>
            </summary>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                <span>{item.matterId} · {item.matterTitle}</span>
                <span>{item.workstreamName}</span>
                <span>{label(item.document.document_type)}</span>
                <span>{item.document.document_date ?? "Undated"}</span>
                <span>{label(item.document.document_source)}</span>
              </div>

              {(item.document.sections?.length ?? 0) > 0 ? (
                <div className="mt-4 space-y-3">
                  {item.document.sections?.map((section) => (
                    <div key={section.section_id} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {section.section_title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {section.section_content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-600">
                  No document sections are recorded.
                </p>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

```

### `components/matter/EvidencePacket.tsx`

```tsx
import type { EvidencePacket } from "@/lib/types/matter";

type EvidencePacketViewProps = {
  packet: EvidencePacket;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function excerpt(text: string) {
  if (text.length <= 260) {
    return text;
  }

  return text.slice(0, 257).trimEnd() + "...";
}

export default function EvidencePacketView({ packet }: EvidencePacketViewProps) {
  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Evidence Packet
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Deterministic retrieval context for an AI response. Every supported
            statement should cite one of these chunks.
          </p>
        </div>

        <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-700">
          {packet.scope}
        </span>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Retrieved Sources
          </p>

          <div className="mt-4 grid gap-3">
            {packet.sources.map((source) => (
              <article key={source.chunk_id} className="rounded-lg bg-slate-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs font-medium text-slate-500">
                      {source.chunk_id}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-950">
                      {source.citation_label ??
                        [source.document_title, source.section_title]
                          .filter(Boolean)
                          .join(" — ")}
                    </h3>
                  </div>

                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    Score {source.score}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {excerpt(source.text)}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                  <span>{source.document_id}</span>
                  <span>{label(source.document_type)}</span>
                  <span>{source.workstream_id}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Required States
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {packet.required_output_states.map((state) => (
                <span
                  key={state}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {label(state)}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Guardrails
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
              {packet.guardrails.map((guardrail) => (
                <li key={guardrail}>{guardrail}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

```

### `components/matter/LiveOpinionReview.tsx`

```tsx
"use client";

import { useState } from "react";

type LiveReview = {
  overall_assessment: string;
  review_points: Array<{
    review_type: string;
    title: string;
    severity: string;
    counsel_position: string;
    company_review: string;
    recommended_action: string;
    source_ids: string[];
  }>;
};

function label(value: string) {
  return value.replaceAll("_", " ");
}

export default function LiveOpinionReview({ matterId }: { matterId: string }) {
  const [review, setReview] = useState<LiveReview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runReview() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/opinion-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matterId }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Live review is unavailable.");
      }

      setReview(payload.review);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Live review is unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="surface-card mt-8 rounded-xl p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-blue-700">Live intelligence</p>
          <h2 className="mt-1 text-xl font-semibold text-slate-950">Run an evidence-grounded review</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            This sends the bounded MAT-001 counsel context and retrieved evidence to the configured server-side Gemini model. Source IDs are validated before the result is shown.
          </p>
        </div>
        <button
          type="button"
          onClick={runReview}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          {loading ? "Reviewing…" : "Run live review"}
        </button>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <p className="font-semibold">Live review unavailable</p>
          <p className="mt-1">{error} The stored MatterBridge review remains available above.</p>
        </div>
      ) : null}

      {review ? (
        <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          <div className="rounded-lg bg-blue-50/70 p-4 text-sm leading-6 text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Model assessment</p>
            <p className="mt-2">{review.overall_assessment}</p>
          </div>
          {review.review_points.map((point, index) => (
            <article key={`${point.title}-${index}`} className="rounded-lg border border-slate-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-950">{point.title}</h3>
                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">{label(point.severity)}</span>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{label(point.review_type)}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700"><span className="font-semibold">Counsel position:</span> {point.counsel_position}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">Company review:</span> {point.company_review}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700"><span className="font-semibold">Recommended action:</span> {label(point.recommended_action)}</p>
              <div className="mt-3 flex flex-wrap gap-2">{point.source_ids.map((sourceId) => <span key={sourceId} className="rounded-full bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">{sourceId}</span>)}</div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

```

### `components/matter/MatterActivityPanels.tsx`

```tsx
import Link from "next/link";
import type {
  CounselEngagement,
  Decision,
  TimelineEvent,
  Workstream,
} from "@/lib/types/matter";

type MatterActivityPanelsProps = {
  timeline: TimelineEvent[];
  engagements: CounselEngagement[];
  decisions: Decision[];
  workstreams: Workstream[];
  matterId: string;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function workstreamName(
  workstreams: Workstream[],
  workstreamId?: string | null
) {
  return (
    workstreams.find((workstream) => workstream.workstream_id === workstreamId)
      ?.workstream_name ?? "Matter-level"
  );
}

function statusClassName(value?: string) {
  if (value === "PENDING" || value === "IN_PROGRESS" || value === "DRAFT") {
    return "bg-amber-50 text-amber-800";
  }

  if (value === "APPROVED" || value === "ISSUED" || value === "ENGAGED") {
    return "bg-emerald-50 text-emerald-800";
  }

  return "bg-slate-100 text-slate-700";
}

export default function MatterActivityPanels({
  timeline,
  engagements,
  decisions,
  workstreams,
  matterId,
}: MatterActivityPanelsProps) {
  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-2">
      <details className="surface-card group rounded-xl overflow-hidden">
        <summary className="cursor-pointer list-none p-5 text-base font-semibold text-slate-950 transition hover:bg-slate-50">
          <span className="flex items-center justify-between gap-4">
            Matter Timeline
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              {timeline.length} events <span className="text-lg text-slate-400 group-open:rotate-180">⌄</span>
            </span>
          </span>
        </summary>

        <div className="border-t border-slate-100 p-5">
          <div className="space-y-3">
            {[...timeline]
              .sort((a, b) => a.event_date.localeCompare(b.event_date))
              .map((event) => (
                <article
                  key={event.timeline_id}
                  className="grid gap-2 rounded-lg bg-slate-50 p-4 sm:grid-cols-[7rem_1fr]"
                >
                  <p className="font-mono text-xs text-slate-500">
                    {event.event_date}
                  </p>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-950">
                        {event.event_title}
                      </h3>
                      <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-600">
                        {workstreamName(workstreams, event.workstream_id)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {event.event_description}
                    </p>
                  </div>
                </article>
              ))}
          </div>
        </div>
      </details>

      <details className="surface-card group rounded-xl overflow-hidden">
        <summary className="cursor-pointer list-none p-5 text-base font-semibold text-slate-950 transition hover:bg-slate-50">
          <span className="flex items-center justify-between gap-4">
            Counsel &amp; Decisions
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              {engagements.length} engagements <span className="text-lg text-slate-400 group-open:rotate-180">⌄</span>
            </span>
          </span>
        </summary>

        <div className="space-y-4 border-t border-slate-100 p-5">
          {engagements.map((engagement) => {
            const questions =
              engagement.briefs?.flatMap((brief) => brief.questions ?? []) ?? [];
            const outputs = engagement.outputs ?? [];
            const openItems = [
              ...(outputs.length === 0 && engagement.engagement_status === "PENDING"
                ? [
                    {
                      id: engagement.engagement_id,
                      title: "Engagement awaiting next step",
                      detail: engagement.engagement_description,
                      status: engagement.engagement_status,
                    },
                  ]
                : []),
              ...outputs
                .filter((output) => output.output_status !== "RECEIVED")
                .map((output) => ({
                  id: output.output_id,
                  title: label(output.output_type),
                  detail: "Counsel deliverable has not been received.",
                  status: output.output_status,
                })),
            ];

            return (
              <article
                key={engagement.engagement_id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-mono text-xs text-slate-500">
                      {engagement.engagement_id}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-slate-950">
                      {engagement.counsel?.firm_name ??
                        engagement.counsel?.counsel_name ??
                        "External counsel"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {engagement.counsel?.counsel_name ?? "Counsel not recorded"}
                      {engagement.counsel?.email
                        ? ` · ${engagement.counsel.email}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(
                      engagement.engagement_status
                    )}`}
                  >
                    {label(engagement.engagement_status)}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {engagement.engagement_description}
                </p>

                <div className="mt-4 grid gap-3">
                  <details className="rounded-lg bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                      Queries ({questions.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {questions.map((question) => (
                        <div key={question.question_id} className="rounded-lg bg-white p-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-slate-500">
                              {question.question_id}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              {label(question.question_priority)}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              Matter-level · status not recorded
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {question.question_text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </details>

                  <details className="rounded-lg bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                      Deliverables ({outputs.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {outputs.length > 0 ? (
                        outputs.map((output) => (
                          <div key={output.output_id} className="rounded-lg bg-white p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-xs text-slate-500">
                                {output.output_id}
                              </span>
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassName(
                                  output.output_status
                                )}`}
                              >
                                {label(output.output_status)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-700">
                              {label(output.output_type)} · workstream not recorded
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">
                          No counsel deliverable is recorded yet.
                        </p>
                      )}
                    </div>
                  </details>

                  <details className="rounded-lg bg-slate-50 p-3">
                    <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                      Open Items ({openItems.length})
                    </summary>
                    <div className="mt-3 space-y-2">
                      {openItems.length > 0 ? (
                        openItems.map((item) => (
                          <div key={item.id} className="rounded-lg bg-white p-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-slate-900">
                                {item.title}
                              </p>
                              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                                {label(item.status)}
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {item.detail}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-600">No open items recorded.</p>
                      )}
                    </div>
                  </details>
                </div>
              </article>
            );
          })}

          <details className="rounded-lg bg-slate-50 p-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-900">
              Decisions ({decisions.length})
            </summary>
            <div className="mt-3 space-y-2">
              {decisions.map((decision) => (
                <div key={decision.decision_id} className="rounded-lg bg-white p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      {decision.decision_id}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
                      {label(decision.decision_status)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                      {workstreamName(workstreams, decision.workstream_id)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {decision.decision_title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {decision.decision_summary}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <Link
            href={`/matters/${matterId}/counsel-brief`}
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Open the full Counsel Brief →
          </Link>
          <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4">
            <Link
              href={`/matters/${matterId}/opinion-review`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Review Counsel Opinion →
            </Link>
            <Link
              href={`/matters/${matterId}/legal-decision`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              Open Legal Decision →
            </Link>
            <Link
              href={`/matters/${matterId}/institutional-memory`}
              className="text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View Institutional Memory →
            </Link>
          </div>
        </div>
      </details>
    </section>
  );
}

```

### `components/matter/MatterCard.tsx`

```tsx
import Link from "next/link";
import type { MatterBundle } from "@/lib/types/matter";

type MatterCardProps = {
  matterData: MatterBundle;
};

function formatCurrency(value?: number) {
  if (!value) {
    return "No financial exposure";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 1,
    notation: "compact",
    style: "currency",
    currency: "INR",
  }).format(value);
}

function riskClassName(risk?: string) {
  if (risk === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  if (risk === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function MatterCard({ matterData }: MatterCardProps) {
  const { matter, parties } = matterData;
  return (
    <Link
      href={"/matters/" + matter.matter_id}
      className="group block rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgb(15_23_42_/_0.04)] transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wide text-slate-500">
            {matter.matter_id} · {matter.created_date ?? "Date not recorded"}
          </p>

          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950 group-hover:text-blue-700">
            {matter.matter_title}
          </h3>
        </div>

        <span
          className={
            "rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide " +
            riskClassName(matter.risk_rating)
          }
        >
          {matter.risk_rating}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {matter.matter_description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-sm">
        <div>
          <p className="eyebrow">
            Client
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {parties?.client?.party_name ?? "Not recorded"}
          </p>
        </div>

        <div>
          <p className="eyebrow">
            Counterparty
          </p>
          <p className="mt-1 font-medium text-slate-800">
            {parties?.counterparty?.party_name ?? "Not recorded"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-xs font-medium text-slate-500">Exposure</p>
          <p className="mt-1 truncate text-lg font-semibold text-slate-950">
            {formatCurrency(matter.outstanding_exposure_inr)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-xs font-medium text-slate-500">Workstreams</p>
          <p className="mt-1 text-lg font-semibold text-slate-950">
            {matterData.workstreams.length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {matter.matter_status.replaceAll("_", " ")}
        </span>

        <span className="font-semibold text-blue-700">Open matter →</span>
      </div>
    </Link>
  );
}

```

### `components/matter/MatterStatusTabs.tsx`

```tsx
"use client";

import { useState } from "react";
import MatterCard from "@/components/matter/MatterCard";
import type { MatterBundle } from "@/lib/types/matter";

type MatterStatusTabsProps = {
  openMatters: MatterBundle[];
  closedMatters: MatterBundle[];
};

export default function MatterStatusTabs({
  openMatters,
  closedMatters,
}: MatterStatusTabsProps) {
  const [selected, setSelected] = useState<"open" | "closed">("open");
  const matters = selected === "open" ? openMatters : closedMatters;

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Matters</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
            Your legal workspace
          </h2>
        </div>

        <div className="flex w-fit rounded-lg border border-slate-200 bg-slate-100 p-1" role="tablist">
          {[
            { key: "open" as const, label: "Open Matters", count: openMatters.length },
            { key: "closed" as const, label: "Closed Matters", count: closedMatters.length },
          ].map((tab) => {
            const active = selected === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelected(tab.key)}
                className={
                  "rounded-md px-3 py-2 text-sm font-semibold transition " +
                  (active
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-800")
                }
              >
                {tab.label} <span className="ml-1 text-xs text-slate-400">{tab.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {matters.length > 0 ? (
        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {matters.map((matterData) => (
            <MatterCard
              key={matterData.matter.matter_id}
              matterData={matterData}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <p className="text-sm font-semibold text-slate-800">
            No {selected} matters yet
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Matters will appear here as the portfolio changes.
          </p>
        </div>
      )}
    </section>
  );
}

```

### `components/matter/RecoveryIssueWorkspace.tsx`

```tsx
"use client";

import { useState } from "react";
import type { IssueSupport } from "@/lib/data/issue-mapping";

type RecoveryIssueWorkspaceProps = {
  issueSupport: IssueSupport[];
  workstreamName: string;
};

function label(value?: string | null) {
  return value?.replaceAll("_", " ") ?? "Not recorded";
}

function priorityClassName(priority?: string) {
  if (priority === "HIGH") {
    return "border-rose-200 bg-rose-50 text-rose-800";
  }

  if (priority === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-800";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

function findingState(finding: IssueSupport["findings"][number]) {
  if (
    finding.finding_type === "INFORMATION_GAP" ||
    finding.requires_verification === "YES"
  ) {
    return "Information Missing";
  }

  if (
    finding.finding_type === "LEGAL_ISSUE" ||
    finding.requires_legal_judgment === "YES"
  ) {
    return "Legal Judgment Required";
  }

  return "Supported";
}

export default function RecoveryIssueWorkspace({
  issueSupport,
  workstreamName,
}: RecoveryIssueWorkspaceProps) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});

  function togglePanel(issueId: string, panel: "evidence" | "findings") {
    const nextPanel = `${issueId}:${panel}`;
    setOpenPanel((current) => (current === nextPanel ? null : nextPanel));
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-blue-700">
            {workstreamName}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Active Issues
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Work each issue from the source evidence and AI findings before
            deciding the next legal action.
          </p>
        </div>

        <span className="w-fit rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {issueSupport.length} active work items
        </span>
      </div>

      <div className="mt-4 grid gap-4">
        {issueSupport.map(({ issue, findings, documents, evidence }) => {
          const evidencePanel = openPanel === `${issue.issue_id}:evidence`;
          const findingsPanel = openPanel === `${issue.issue_id}:findings`;

          return (
            <article
              key={issue.issue_id}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_rgb(15_23_42_/_0.04)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-4xl">
                  <p className="font-mono text-xs font-medium text-slate-500">
                    {issue.issue_id}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-950">
                    {issue.issue_title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {issue.issue_description}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 text-xs font-semibold">
                  <span
                    className={
                      "rounded-full border px-3 py-1 " +
                      priorityClassName(issue.issue_priority)
                    }
                  >
                    {label(issue.issue_priority)} priority
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    {label(issue.issue_status)}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  aria-expanded={evidencePanel}
                  onClick={() => togglePanel(issue.issue_id, "evidence")}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
                >
                  Evidence {evidencePanel ? "↑" : "↓"}
                </button>
                <button
                  type="button"
                  aria-expanded={findingsPanel}
                  onClick={() => togglePanel(issue.issue_id, "findings")}
                  className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:border-blue-400 hover:bg-blue-100"
                >
                  AI Findings {findingsPanel ? "↑" : "↓"}
                </button>
                <span className="self-center text-xs text-slate-500">
                  {documents.length} documents · {findings.length} findings
                </span>
              </div>

              {evidencePanel ? (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Supporting evidence
                    </p>
                    <span className="text-xs font-medium text-slate-500">
                      {evidence.length} matched source chunks
                    </span>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {documents.map((document) => (
                      <div
                        key={document.document_id}
                        className="rounded-lg border border-slate-200 bg-white p-3"
                      >
                        <p className="font-mono text-xs text-slate-500">
                          {document.document_id}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          {document.document_title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {label(document.document_type)} ·{" "}
                          {document.document_date ?? "Undated"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {evidence.length > 0 ? (
                    <div className="mt-3 space-y-2">
                      {evidence.map((source) => (
                        <div
                          key={source.chunk_id}
                          className="rounded-lg border border-slate-200 bg-white p-3"
                        >
                          <p className="font-mono text-xs font-medium text-blue-700">
                            {source.chunk_id} · {source.document_id}
                          </p>
                          <p className="mt-1 text-sm font-medium text-slate-900">
                            {source.citation_label ?? source.section_title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {source.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No directly matched source chunk was found in the current
                      evidence packet.
                    </p>
                  )}
                </div>
              ) : null}

              {findingsPanel ? (
                <div className="mt-4 rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mapped AI findings
                  </p>
                  {findings.length > 0 ? (
                    <div className="mt-3 grid gap-3">
                      {findings.map((finding) => (
                        <div
                          key={finding.finding_id}
                          className="rounded-lg border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <p className="font-mono text-xs font-medium text-slate-500">
                                {finding.finding_id}
                              </p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">
                                {finding.finding_title}
                              </p>
                            </div>
                            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {findingState(finding)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {finding.finding_summary}
                          </p>
                          {(finding.citations?.length ?? 0) > 0 ? (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {finding.citations?.map((citation) => (
                                <span
                                  key={citation.citation_id}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                  {citation.source_id}
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">
                      No directly related AI finding was identified from the
                      shared matter/workstream scope and topic match.
                    </p>
                  )}
                </div>
              ) : null}

              <div className="mt-5 border-t border-slate-100 pt-4">
                <label
                  htmlFor={`comment-${issue.issue_id}`}
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Lawyer comment
                </label>
                <textarea
                  id={`comment-${issue.issue_id}`}
                  value={comments[issue.issue_id] ?? ""}
                  onChange={(event) =>
                    setComments((current) => ({
                      ...current,
                      [issue.issue_id]: event.target.value,
                    }))
                  }
                  placeholder="Add a working note, question, or next step..."
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  Local prototype note · not saved
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

```

### `components/navigation/PrimaryNavigation.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Legal Matter Intelligence", shortLabel: "Matters", icon: "▦" },
  { href: "/evidence", label: "Documentary Evidence", shortLabel: "Evidence", icon: "▤" },
  {
    href: "/counsel-review",
    label: "Overall Counsel Engagement Review",
    shortLabel: "Counsel Review",
    icon: "◫",
  },
  { href: "/settings", label: "Settings", shortLabel: "Settings", icon: "⚙" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/" || pathname.startsWith("/matters");
  }

  return pathname === href || pathname.startsWith(href + "/");
}

export default function PrimaryNavigation() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col px-4 py-4 lg:px-5 lg:py-6">
        <Link href="/" className="flex items-center gap-3 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm">
            M
          </span>
          <span>
            <span className="block text-sm font-bold tracking-tight text-slate-950">
              MatterBridge
            </span>
            <span className="block text-[11px] font-medium text-slate-500">
              Legal operations
            </span>
          </span>
        </Link>

        <div className="mt-6 flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          <p className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 lg:block">
            Workspace
          </p>
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={
                  "group flex min-w-max items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:w-full lg:min-w-0 " +
                  (active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950")
                }
              >
                <span
                  className={
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-sm " +
                    (active
                      ? "bg-blue-100 text-blue-700"
                      : "bg-slate-100 text-slate-500 group-hover:text-slate-700")
                  }
                  aria-hidden="true"
                >
                  {link.icon}
                </span>
                <span className="lg:hidden">{link.shortLabel}</span>
                <span className="hidden min-w-0 flex-1 leading-5 lg:block">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto hidden rounded-lg border border-slate-200 bg-slate-50 p-3 lg:block">
          <p className="text-xs font-semibold text-slate-700">Prototype workspace</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Matter context, evidence, counsel work, and decisions in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}

```

### `components/shared/PageLoading.tsx`

```tsx
export default function PageLoading() {
  return (
    <div className="min-h-[40vh] bg-slate-50 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
      <div className="mx-auto max-w-7xl animate-pulse space-y-5">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-10 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/2 rounded bg-slate-200" />
        <div className="grid gap-4 pt-6 lg:grid-cols-2">
          <div className="h-40 rounded-xl border border-slate-200 bg-white" />
          <div className="h-40 rounded-xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}

```

### `data/knowledge_chunks.json`

```json
[
  {
    "chunk_id": "SEC-DOC-001",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Facility Amount and Terms",
    "section_order": 1,
    "text": "The Lender agrees to extend to the Borrower a secured term loan facility of INR 15,00,00,000 (Indian Rupees Fifteen Crore Only). The facility shall be disbursed in a single tranche upon satisfaction of conditions precedent outlined in Schedule A. The tenure of the facility shall be 60 (sixty) months from the date of first disbursement.",
    "citation_label": "Facility Agreement — Facility Amount and Terms (SEC-DOC-001)"
  },
  {
    "chunk_id": "SEC-DOC-002",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Repayment Obligations",
    "section_order": 2,
    "text": "The Borrower shall repay the facility in 60 (sixty) equated monthly installments (EMIs) commencing from 2024-06-01. Each EMI shall comprise principal and interest components. The EMI amount shall be INR 32,50,000 (Indian Rupees Thirty-Two Lakh Fifty Thousand Only) payable on the 1st day of each calendar month. Prepayment is permitted subject to a prepayment penalty of 2% if prepaid within the first 24 months.",
    "citation_label": "Facility Agreement — Repayment Obligations (SEC-DOC-002)"
  },
  {
    "chunk_id": "SEC-DOC-003",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Interest Provisions",
    "section_order": 3,
    "text": "The facility shall carry interest at the rate of 13.5% (Thirteen Point Five Percent) per annum, calculated on a daily reducing balance basis. Interest shall be compounded monthly. In the event of default, penal interest at an additional rate of 3% (Three Percent) per annum shall apply on the overdue amount from the date of default until payment in full.",
    "citation_label": "Facility Agreement — Interest Provisions (SEC-DOC-003)"
  },
  {
    "chunk_id": "SEC-DOC-004",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Events of Default",
    "section_order": 4,
    "text": "The following shall constitute events of default: (a) failure to pay any installment within 15 (fifteen) days of the due date; (b) breach of any covenant or representation; (c) insolvency or liquidation of the Borrower; (d) attachment or sale of any secured asset; (e) material adverse change in the Borrower's financial condition. Upon occurrence of an event of default, the Lender may declare the entire outstanding amount immediately due and payable.",
    "citation_label": "Facility Agreement — Events of Default (SEC-DOC-004)"
  },
  {
    "chunk_id": "SEC-DOC-005",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Cure Period",
    "section_order": 5,
    "text": "Notwithstanding clause 12 (Events of Default), the Borrower shall have a cure period of 30 (thirty) days from the date of receipt of written notice from the Lender specifying the default. During the cure period, the Borrower may remedy the default by payment of overdue amounts plus applicable penal interest. If the default is not cured within the cure period, the Lender's enforcement rights shall become exercisable.",
    "citation_label": "Facility Agreement — Cure Period (SEC-DOC-005)"
  },
  {
    "chunk_id": "SEC-DOC-006",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Enforcement Provisions",
    "section_order": 6,
    "text": "Upon the occurrence and continuance of an event of default, the Lender shall be entitled to: (a) enforce any or all security interests created in favor of the Lender; (b) take possession of secured assets; (c) appoint a receiver for the Borrower's business; (d) initiate proceedings under applicable laws including but not limited to SARFAESI Act, 2002, Recovery of Debts and Bankruptcy Act, 1993, or Insolvency and Bankruptcy Code, 2016. All costs of enforcement shall be borne by the Borrower.",
    "citation_label": "Facility Agreement — Enforcement Provisions (SEC-DOC-006)"
  },
  {
    "chunk_id": "SEC-DOC-007",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-002",
    "document_title": "Security Agreement",
    "document_type": "SECURITY_DOCUMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-003"
    ],
    "section_title": "Security Package Description",
    "section_order": 1,
    "text": "The Borrower and third parties have created the following security package in favor of the Lender: (a) First mortgage by way of registered mortgage deed over commercial property at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059, bearing municipal no. A-45/2019, built-up area 12,500 sq ft; (b) Unconditional and irrevocable corporate guarantee by Rajesh Kumar Sharma; (c) First pari passu charge over all present and future book debts and receivables of the Borrower.",
    "citation_label": "Security Agreement — Security Package Description (SEC-DOC-007)"
  },
  {
    "chunk_id": "SEC-DOC-008",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-002",
    "document_title": "Security Agreement",
    "document_type": "SECURITY_DOCUMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-003"
    ],
    "section_title": "Security Creation and Perfection",
    "section_order": 2,
    "text": "All security interests shall be created and perfected in accordance with applicable laws. The mortgage shall be registered with the Sub-Registrar of Assurances within 4 (four) months of execution. All charges shall be registered with CERSAI within 30 (thirty) days of creation. The Borrower shall execute all documents and do all acts necessary for creation, perfection, and registration of security interests.",
    "citation_label": "Security Agreement — Security Creation and Perfection (SEC-DOC-008)"
  },
  {
    "chunk_id": "SEC-DOC-009",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-002",
    "document_title": "Security Agreement",
    "document_type": "SECURITY_DOCUMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-003"
    ],
    "section_title": "CERSAI Registration",
    "section_order": 3,
    "text": "The Borrower acknowledges that all security interests created in favor of the Lender shall be registered with the Central Registry of Securitisation Asset Reconstruction and Security Interest of India (CERSAI) in accordance with Section 20 of the SARFAESI Act, 2002. The Borrower authorizes the Lender to file necessary forms and particulars with CERSAI. All registration fees and costs shall be borne by the Borrower.",
    "citation_label": "Security Agreement — CERSAI Registration (SEC-DOC-009)"
  },
  {
    "chunk_id": "SEC-DOC-010",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-002",
    "document_title": "Security Agreement",
    "document_type": "SECURITY_DOCUMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-003"
    ],
    "section_title": "Representations Regarding Security",
    "section_order": 4,
    "text": "The Borrower represents and warrants that: (a) it has clear, marketable, and encumbrance-free title to the mortgaged property except for prior charges disclosed in writing; (b) the property is free from all litigation, attachment, or encumbrance; (c) all documents relating to the property are genuine and valid; (d) no prior mortgage, charge, or lien exists on the property except as disclosed. Any breach of representations shall constitute an event of default.",
    "citation_label": "Security Agreement — Representations Regarding Security (SEC-DOC-010)"
  },
  {
    "chunk_id": "SEC-DOC-011",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-002",
    "document_title": "Security Agreement",
    "document_type": "SECURITY_DOCUMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-003"
    ],
    "section_title": "Enforcement of Security",
    "section_order": 5,
    "text": "Upon enforcement, the Lender shall be entitled to take all measures permitted by law including: (a) taking possession of secured assets; (b) sale or lease of secured assets by public auction or private treaty; (c) appointment of a manager or receiver; (d) recovery from guarantors; (e) recovery from receivables debtors. The Borrower shall not create any further charge or encumbrance on secured assets without prior written consent of the Lender.",
    "citation_label": "Security Agreement — Enforcement of Security (SEC-DOC-011)"
  },
  {
    "chunk_id": "SEC-DOC-012",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-003",
    "document_title": "Corporate Guarantee",
    "document_type": "GUARANTEE_DEED",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-002"
    ],
    "section_title": "Guarantee Obligations",
    "section_order": 1,
    "text": "The Guarantor hereby unconditionally and irrevocably guarantees to the Lender the due and punctual payment and discharge of all obligations and liabilities of the Borrower under the Facility Agreement. This guarantee is a continuing guarantee and shall extend to the ultimate balance of sums payable by the Borrower, regardless of any intermediate payment or discharge.",
    "citation_label": "Corporate Guarantee — Guarantee Obligations (SEC-DOC-012)"
  },
  {
    "chunk_id": "SEC-DOC-013",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-003",
    "document_title": "Corporate Guarantee",
    "document_type": "GUARANTEE_DEED",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-002"
    ],
    "section_title": "Guarantee Amount and Scope",
    "section_order": 2,
    "text": "This guarantee covers principal amount up to INR 15,00,00,000 (Indian Rupees Fifteen Crore Only) together with interest, penal interest, costs, charges, and expenses. The Guarantor's liability shall be that of a principal debtor and shall not be affected by any change in the constitution of the Borrower or the Lender, or by any forbearance or variation made by the Lender.",
    "citation_label": "Corporate Guarantee — Guarantee Amount and Scope (SEC-DOC-013)"
  },
  {
    "chunk_id": "SEC-DOC-014",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-003",
    "document_title": "Corporate Guarantee",
    "document_type": "GUARANTEE_DEED",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-002"
    ],
    "section_title": "Invocation of Guarantee",
    "section_order": 3,
    "text": "The Lender may invoke this guarantee at any time after the occurrence of an event of default under the Facility Agreement. The Guarantor shall pay the Lender within 7 (seven) days of receipt of written demand. The Guarantor waives all rights to require the Lender to first proceed against the Borrower or any other person or to enforce any other security before claiming against the Guarantor.",
    "citation_label": "Corporate Guarantee — Invocation of Guarantee (SEC-DOC-014)"
  },
  {
    "chunk_id": "SEC-DOC-015",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-003",
    "document_title": "Corporate Guarantee",
    "document_type": "GUARANTEE_DEED",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-002"
    ],
    "section_title": "Continuing Liability",
    "section_order": 4,
    "text": "This guarantee shall remain in full force and effect until all obligations of the Borrower are fully discharged. The Guarantor shall not revoke this guarantee without prior written consent of the Lender. The death, insolvency, or incapacity of the Guarantor shall not terminate this guarantee, and the Guarantor's legal heirs and estate shall remain liable.",
    "citation_label": "Corporate Guarantee — Continuing Liability (SEC-DOC-015)"
  },
  {
    "chunk_id": "SEC-DOC-016",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-004",
    "document_title": "Repayment / Loan Account Summary",
    "document_type": "ACCOUNT_STATEMENT",
    "document_date": "2025-08-31",
    "document_source": "LENDER_SYSTEMS",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Disbursement History",
    "section_order": 1,
    "text": "Disbursement Date: 2024-03-20. Disbursement Amount: INR 15,00,00,000. Disbursement Mode: NEFT to Borrower's account with HDFC Bank, Account No. 50200012345678, IFSC: HDFC0001234. All conditions precedent satisfied as per certificate dated 2024-03-19 issued by advocates M/s. Kapoor & Associates.",
    "citation_label": "Repayment / Loan Account Summary — Disbursement History (SEC-DOC-016)"
  },
  {
    "chunk_id": "SEC-DOC-017",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-004",
    "document_title": "Repayment / Loan Account Summary",
    "document_type": "ACCOUNT_STATEMENT",
    "document_date": "2025-08-31",
    "document_source": "LENDER_SYSTEMS",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Repayment Schedule vs Actuals",
    "section_order": 2,
    "text": "Scheduled EMIs: 60 monthly installments of INR 32,50,000 each from 2024-06-01 to 2029-05-01. Repayments Received: Installments 1-10 (2024-06-01 to 2025-03-01): Paid in full and on time. Installments 11-15 (2025-04-01 to 2025-08-01): Not paid. Total EMIs paid: 10. Total EMIs overdue as of 2025-08-31: 5.",
    "citation_label": "Repayment / Loan Account Summary — Repayment Schedule vs Actuals (SEC-DOC-017)"
  },
  {
    "chunk_id": "SEC-DOC-018",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-004",
    "document_title": "Repayment / Loan Account Summary",
    "document_type": "ACCOUNT_STATEMENT",
    "document_date": "2025-08-31",
    "document_source": "LENDER_SYSTEMS",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Outstanding Exposure Calculation",
    "section_order": 3,
    "text": "As of 2025-08-31: Principal Outstanding: INR 12,00,00,000. Accrued Interest: INR 37,30,000. Penal Interest: INR 2,70,000. Total Outstanding Exposure: INR 12,40,00,000 (Indian Rupees Twelve Crore Forty Lakh Only). Five scheduled EMIs remain overdue from 2025-04-01 through 2025-08-01.",
    "citation_label": "Repayment / Loan Account Summary — Outstanding Exposure Calculation (SEC-DOC-018)"
  },
  {
    "chunk_id": "SEC-DOC-019",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-005",
    "document_title": "Default Notice",
    "document_type": "LEGAL_NOTICE",
    "document_date": "2025-07-10",
    "document_source": "LENDER_LEGAL",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Notice of Default",
    "section_order": 1,
    "text": "To: Meridian Components Private Limited. From: Aster Fintech Limited. Date: 2025-07-10. Subject: Notice of Default under Facility Agreement dated 2024-03-15. We hereby notify you that you are in default under the above-referenced Facility Agreement by reason of failure to pay equated monthly installments due on 2025-04-01, 2025-05-01, 2025-06-01, and 2025-07-01, each in the amount of INR 32,50,000. Total amount overdue as of date: INR 1,30,00,000 plus accrued interest and penal interest.",
    "citation_label": "Default Notice — Notice of Default (SEC-DOC-019)"
  },
  {
    "chunk_id": "SEC-DOC-020",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-005",
    "document_title": "Default Notice",
    "document_type": "LEGAL_NOTICE",
    "document_date": "2025-07-10",
    "document_source": "LENDER_LEGAL",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Cure Period Invocation",
    "section_order": 2,
    "text": "Pursuant to Clause 12.5 (Cure Period) of the Facility Agreement, you are hereby granted a cure period of 30 (thirty) days from the date of receipt of this notice to remedy the default by payment of all overdue amounts together with applicable interest and penal interest. Payment must be received in our account no. 12345678901234, IFSC: HDFC0001234, by 2025-08-09.",
    "citation_label": "Default Notice — Cure Period Invocation (SEC-DOC-020)"
  },
  {
    "chunk_id": "SEC-DOC-021",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-005",
    "document_title": "Default Notice",
    "document_type": "LEGAL_NOTICE",
    "document_date": "2025-07-10",
    "document_source": "LENDER_LEGAL",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Consequences of Non-Cure",
    "section_order": 3,
    "text": "If the default is not cured within the cure period specified above, Aster Fintech Limited shall be entitled to exercise all rights and remedies available under the Facility Agreement, Security Documents, and applicable law, including but not limited to: (a) declaring the entire outstanding amount immediately due and payable; (b) enforcing security interests; (c) initiating recovery proceedings. All costs and expenses shall be to your account.",
    "citation_label": "Default Notice — Consequences of Non-Cure (SEC-DOC-021)"
  },
  {
    "chunk_id": "SEC-DOC-022",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-006",
    "document_title": "Borrower Response",
    "document_type": "CORRESPONDENCE",
    "document_date": "2025-07-28",
    "document_source": "BORROWER",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Acknowledgment of Default",
    "section_order": 1,
    "text": "To: Aster Fintech Limited. From: Meridian Components Private Limited. Date: 2025-07-28. Subject: Response to Default Notice dated 2025-07-10. We acknowledge receipt of your notice dated 2025-07-10 and confirm that we are currently experiencing temporary financial difficulties due to delayed payments from our key customers and disruption in our supply chain. We have not been able to make the scheduled payments for April, May, June, and July 2025.",
    "citation_label": "Borrower Response — Acknowledgment of Default (SEC-DOC-022)"
  },
  {
    "chunk_id": "SEC-DOC-023",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-006",
    "document_title": "Borrower Response",
    "document_type": "CORRESPONDENCE",
    "document_date": "2025-07-28",
    "document_source": "BORROWER",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Explanation of Financial Distress",
    "section_order": 2,
    "text": "Our company has been impacted by: (a) delayed receivables from two major customers totaling INR 8.5 crore, now overdue by 90-120 days; (b) temporary shutdown of one production line due to machinery breakdown requiring replacement parts from Germany, expected to be operational by September 2025; (c) increased raw material costs by approximately 18% due to global supply chain disruptions. These factors have resulted in temporary cash flow constraints.",
    "citation_label": "Borrower Response — Explanation of Financial Distress (SEC-DOC-023)"
  },
  {
    "chunk_id": "SEC-DOC-024",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-006",
    "document_title": "Borrower Response",
    "document_type": "CORRESPONDENCE",
    "document_date": "2025-07-28",
    "document_source": "BORROWER",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Request for Restructuring",
    "section_order": 3,
    "text": "We respectfully request Aster Fintech Limited to consider the following restructuring options: (a) moratorium on principal repayment for 6 months with interest servicing; (b) extension of loan tenure by 12 months; (c) conversion of overdue interest into funded interest term loan. We are committed to honoring our obligations and believe these measures will enable us to return to regular repayment by Q1 2026. We request a meeting to discuss this proposal.",
    "citation_label": "Borrower Response — Request for Restructuring (SEC-DOC-024)"
  },
  {
    "chunk_id": "SEC-DOC-025",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-007",
    "document_title": "Internal Credit Risk Memo",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-15",
    "document_source": "CREDIT_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Credit Assessment Summary",
    "section_order": 1,
    "text": "Borrower: Meridian Components Private Limited. Facility: INR 15 crore secured term loan. Current Exposure: INR 12.4 crore (as of 2025-08-31). Days Past Due: 153 days. Current Risk Rating: HIGH (downgraded from MEDIUM on 2025-07-15). Security Coverage: Estimated at 1.45x based on last valuation (2024-02). Key Concerns: (a) 6 consecutive EMIs overdue; (b) borrower's financial position deteriorating; (c) no concrete restructuring proposal received; (d) security verification incomplete.",
    "citation_label": "Internal Credit Risk Memo — Credit Assessment Summary (SEC-DOC-025)"
  },
  {
    "chunk_id": "SEC-DOC-026",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-007",
    "document_title": "Internal Credit Risk Memo",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-15",
    "document_source": "CREDIT_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Risk Rating Downgrade Rationale",
    "section_order": 2,
    "text": "Risk rating downgraded from MEDIUM to HIGH based on: (a) payment default exceeding 90 days; (b) borrower's admission of financial distress in response dated 2025-07-28; (c) lack of immediate liquidity to cure default; (d) concentration risk with delayed receivables from two customers; (e) operational issues affecting production capacity. Recommend immediate escalation to Legal for recovery assessment and external counsel engagement.",
    "citation_label": "Internal Credit Risk Memo — Risk Rating Downgrade Rationale (SEC-DOC-026)"
  },
  {
    "chunk_id": "SEC-DOC-027",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-007",
    "document_title": "Internal Credit Risk Memo",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-15",
    "document_source": "CREDIT_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Recommended Actions",
    "section_order": 3,
    "text": "Recommended actions: (a) escalate to Internal Legal for recovery strategy assessment; (b) engage external recovery counsel with expertise in SARFAESI and DRT matters; (c) initiate comprehensive security verification to confirm enforceability of all securities; (d) obtain updated valuation of mortgaged property; (e) verify CERSAI registration status; (f) assess guarantor's current financial position; (g) consider issuing demand notice to guarantor; (h) evaluate options: SARFAESI enforcement vs. DRT application vs. IBC initiation.",
    "citation_label": "Internal Credit Risk Memo — Recommended Actions (SEC-DOC-027)"
  },
  {
    "chunk_id": "SEC-DOC-028",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-007",
    "document_title": "Internal Credit Risk Memo",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-15",
    "document_source": "CREDIT_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Information Gaps",
    "section_order": 4,
    "text": "Critical information gaps identified: (a) latest borrower financials (last audited: FY2023-24); (b) current collateral valuation (last: 2024-02, pre-disbursement); (c) CERSAI registration certificate copy pending verification; (d) guarantor's current net worth and asset position; (e) status of receivables charge perfection; (f) title deed custody confirmation; (g) prior encumbrances on property; (h) borrower's other borrowing facilities and defaults.",
    "citation_label": "Internal Credit Risk Memo — Information Gaps (SEC-DOC-028)"
  },
  {
    "chunk_id": "SEC-DOC-029",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-008",
    "document_title": "Internal Legal Intake / Escalation Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-22",
    "document_source": "LEGAL_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Matter Summary",
    "section_order": 1,
    "text": "Matter: Recovery of secured loan facility of INR 15 crore extended to Meridian Components Private Limited. Current Outstanding: INR 12.4 crore. Borrower in default since 2025-04-01 (153 days past due). Security package includes: (a) mortgage over commercial property in Mumbai; (b) corporate guarantee by Rajesh Kumar Sharma; (c) charge over receivables. Borrower has acknowledged default and requested restructuring. Credit Department recommends legal escalation.",
    "citation_label": "Internal Legal Intake / Escalation Note — Matter Summary (SEC-DOC-029)"
  },
  {
    "chunk_id": "SEC-DOC-030",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-008",
    "document_title": "Internal Legal Intake / Escalation Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-22",
    "document_source": "LEGAL_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Documents Reviewed",
    "section_order": 2,
    "text": "Documents reviewed in preparation for external counsel engagement: (1) Facility Agreement dated 2024-03-15; (2) Security Agreement dated 2024-03-15; (3) Corporate Guarantee dated 2024-03-15; (4) Loan Account Summary as of 2025-08-31; (5) Default Notice dated 2025-07-10; (6) Borrower Response dated 2025-07-28; (7) Internal Credit Risk Memo dated 2025-08-15. All documents appear to be in order and properly executed.",
    "citation_label": "Internal Legal Intake / Escalation Note — Documents Reviewed (SEC-DOC-030)"
  },
  {
    "chunk_id": "SEC-DOC-031",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-008",
    "document_title": "Internal Legal Intake / Escalation Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-22",
    "document_source": "LEGAL_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Preliminary Issues Identified",
    "section_order": 3,
    "text": "Preliminary legal issues requiring external counsel advice: (a) compliance with contractual notice requirements and cure period; (b) completeness and enforceability of security package; (c) guarantee position and invocation strategy; (d) appropriate recovery forum and mechanism (SARFAESI vs. DRT vs. IBC); (e) timeline and cost estimates for each recovery pathway; (f) likelihood of successful recovery given borrower's financial position; (g) risk of borrower initiating pre-emptive IBC or NCLT proceedings.",
    "citation_label": "Internal Legal Intake / Escalation Note — Preliminary Issues Identified (SEC-DOC-031)"
  },
  {
    "chunk_id": "SEC-DOC-032",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-001",
    "workstream_name": "Recovery Assessment",
    "parent_workstream_id": null,
    "document_id": "DOC-008",
    "document_title": "Internal Legal Intake / Escalation Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-22",
    "document_source": "LEGAL_DEPT",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Recommendation for External Counsel",
    "section_order": 4,
    "text": "Recommend engagement of external counsel specializing in secured lending recovery and enforcement. Counsel should be briefed to: (a) review all documentation and confirm enforceability; (b) advise on optimal recovery strategy and forum; (c) prepare and issue legal demand notice; (d) initiate enforcement proceedings if settlement not achieved; (e) provide timeline and cost estimates. Suggested counsel: M/s. Rajani & Associates (Mumbai) or M/s. Economic Laws Practice (Delhi). Budget estimate: INR 5-8 lakhs for initial engagement.",
    "citation_label": "Internal Legal Intake / Escalation Note — Recommendation for External Counsel (SEC-DOC-032)"
  },
  {
    "chunk_id": "SEC-DOC-033",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-009",
    "document_title": "Sale Deed - Commercial Property",
    "document_type": "TITLE_DEED",
    "document_date": "1998-09-14",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Property Transfer",
    "section_order": 1,
    "text": "Under Sale Deed dated 1998-09-14, Shakti Industrial Estates Private Limited transferred the commercial property identified as Plot No. 45, Andheri-Kurla Road, Mumbai to Western Engineering Works Private Limited for stated consideration.",
    "citation_label": "Sale Deed - Commercial Property — Property Transfer (SEC-DOC-033)"
  },
  {
    "chunk_id": "SEC-DOC-034",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-009",
    "document_title": "Sale Deed - Commercial Property",
    "document_type": "TITLE_DEED",
    "document_date": "1998-09-14",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Property Description",
    "section_order": 2,
    "text": "The property comprises approximately 12,500 square feet of built-up industrial and commercial premises together with associated land and appurtenant rights.",
    "citation_label": "Sale Deed - Commercial Property — Property Description (SEC-DOC-034)"
  },
  {
    "chunk_id": "SEC-DOC-035",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-010",
    "document_title": "Conveyance Deed - Commercial Property",
    "document_type": "CONVEYANCE_DEED",
    "document_date": "2007-03-22",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "2007 Conveyance",
    "section_order": 1,
    "text": "Western Engineering Works Private Limited conveyed the property to Meridian Components Private Limited pursuant to a restructuring transaction documented by Conveyance Deed dated 2007-03-22.",
    "citation_label": "Conveyance Deed - Commercial Property — 2007 Conveyance (SEC-DOC-035)"
  },
  {
    "chunk_id": "SEC-DOC-036",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-010",
    "document_title": "Conveyance Deed - Commercial Property",
    "document_type": "CONVEYANCE_DEED",
    "document_date": "2007-03-22",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Ownership Representation",
    "section_order": 2,
    "text": "The conveyance records Meridian Components Private Limited as transferee and states that the property is transferred together with all rights, easements and interests held by the transferor.",
    "citation_label": "Conveyance Deed - Commercial Property — Ownership Representation (SEC-DOC-036)"
  },
  {
    "chunk_id": "SEC-DOC-037",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-011",
    "document_title": "Prior Mortgage Deed - Zenith Commercial Bank",
    "document_type": "MORTGAGE_DEED",
    "document_date": "2014-06-18",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Prior Mortgage Creation",
    "section_order": 1,
    "text": "Meridian Components Private Limited created a mortgage over the commercial property in favour of Zenith Commercial Bank Limited on 2014-06-18 to secure working capital facilities up to INR 9 crore.",
    "citation_label": "Prior Mortgage Deed - Zenith Commercial Bank — Prior Mortgage Creation (SEC-DOC-037)"
  },
  {
    "chunk_id": "SEC-DOC-038",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-011",
    "document_title": "Prior Mortgage Deed - Zenith Commercial Bank",
    "document_type": "MORTGAGE_DEED",
    "document_date": "2014-06-18",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Release Requirement",
    "section_order": 2,
    "text": "The mortgage deed provides that the security shall continue until all secured obligations to Zenith Commercial Bank Limited are discharged and appropriate release documentation is issued.",
    "citation_label": "Prior Mortgage Deed - Zenith Commercial Bank — Release Requirement (SEC-DOC-038)"
  },
  {
    "chunk_id": "SEC-DOC-039",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-012",
    "document_title": "Release and Satisfaction Letter",
    "document_type": "RELEASE_DOCUMENT",
    "document_date": "2019-11-08",
    "document_source": "BORROWER_RECORDS",
    "document_status": "VERIFICATION_REQUIRED",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Release Statement",
    "section_order": 1,
    "text": "The letter states that credit facilities extended by Zenith Commercial Bank Limited to Meridian Components Private Limited were repaid and that the bank has no objection to release of security over the property.",
    "citation_label": "Release and Satisfaction Letter — Release Statement (SEC-DOC-039)"
  },
  {
    "chunk_id": "SEC-DOC-040",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-012",
    "document_title": "Release and Satisfaction Letter",
    "document_type": "RELEASE_DOCUMENT",
    "document_date": "2019-11-08",
    "document_source": "BORROWER_RECORDS",
    "document_status": "VERIFICATION_REQUIRED",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Verification Limitation",
    "section_order": 2,
    "text": "The available release letter does not contain a corresponding registration endorsement or certified satisfaction record confirming removal of the 2014 mortgage from all relevant security and property records.",
    "citation_label": "Release and Satisfaction Letter — Verification Limitation (SEC-DOC-040)"
  },
  {
    "chunk_id": "SEC-DOC-041",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-013",
    "document_title": "Current Security and Encumbrance Search",
    "document_type": "SECURITY_SEARCH",
    "document_date": "2025-08-19",
    "document_source": "LEGAL_SEARCH",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Current Search Result",
    "section_order": 1,
    "text": "The current search identifies Aster Fintech Limited's mortgage registered in 2024. Historical records also reference the 2014 Zenith Commercial Bank mortgage. The materials reviewed do not contain conclusive evidence confirming formal satisfaction of that earlier mortgage.",
    "citation_label": "Current Security and Encumbrance Search — Current Search Result (SEC-DOC-041)"
  },
  {
    "chunk_id": "SEC-DOC-042",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-013",
    "document_title": "Current Security and Encumbrance Search",
    "document_type": "SECURITY_SEARCH",
    "document_date": "2025-08-19",
    "document_source": "LEGAL_SEARCH",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Verification Requirement",
    "section_order": 2,
    "text": "External property counsel should confirm whether additional registry records, charge-satisfaction filings or lender confirmations are required to establish discharge of the earlier security interest.",
    "citation_label": "Current Security and Encumbrance Search — Verification Requirement (SEC-DOC-042)"
  },
  {
    "chunk_id": "SEC-DOC-043",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-014",
    "document_title": "Property Valuation Report",
    "document_type": "VALUATION_REPORT",
    "document_date": "2024-02-12",
    "document_source": "VALUER",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Valuation Conclusion",
    "section_order": 1,
    "text": "The February 2024 valuation assessed the property at approximately INR 18 crore based on prevailing comparable transactions and existing property use.",
    "citation_label": "Property Valuation Report — Valuation Conclusion (SEC-DOC-043)"
  },
  {
    "chunk_id": "SEC-DOC-044",
    "matter_id": "MAT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_type_id": "MT-001",
    "risk_rating": "HIGH",
    "workstream_id": "WS-002",
    "workstream_name": "Security Verification",
    "parent_workstream_id": "WS-001",
    "document_id": "DOC-014",
    "document_title": "Property Valuation Report",
    "document_type": "VALUATION_REPORT",
    "document_date": "2024-02-12",
    "document_source": "VALUER",
    "document_status": "FINAL",
    "asset_ids": [
      "AST-001"
    ],
    "section_title": "Valuation Limitation",
    "section_order": 2,
    "text": "The report predates the current recovery assessment and should not be treated as evidence of current realizable value. An updated valuation is recommended before enforcement strategy is finalized.",
    "citation_label": "Property Valuation Report — Valuation Limitation (SEC-DOC-044)"
  },
  {
    "chunk_id": "SEC-DOC-045",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-015",
    "document_title": "Employee Leave Request",
    "document_type": "LEAVE_REQUEST",
    "document_date": "2025-08-25",
    "document_source": "EMPLOYEE",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Leave Request",
    "section_order": 1,
    "text": "Priya Menon requested medical leave beginning 2025-08-25 following a reported miscarriage and submitted supporting medical documentation for HR review.",
    "citation_label": "Employee Leave Request — Leave Request (SEC-DOC-045)"
  },
  {
    "chunk_id": "SEC-DOC-046",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-015",
    "document_title": "Employee Leave Request",
    "document_type": "LEAVE_REQUEST",
    "document_date": "2025-08-25",
    "document_source": "EMPLOYEE",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Requested Leave Period",
    "section_order": 2,
    "text": "The employee requested 14 calendar days of leave and asked HR to confirm applicable medical and statutory leave treatment.",
    "citation_label": "Employee Leave Request — Requested Leave Period (SEC-DOC-046)"
  },
  {
    "chunk_id": "SEC-DOC-047",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-016",
    "document_title": "Medical Certificate Submitted by Employee",
    "document_type": "MEDICAL_CERTIFICATE",
    "document_date": "2025-08-24",
    "document_source": "EMPLOYEE",
    "document_status": "VERIFICATION_REQUIRED",
    "asset_ids": [],
    "section_title": "Medical Certificate",
    "section_order": 1,
    "text": "The certificate states that Priya Menon received medical treatment and was advised rest beginning 2025-08-24.",
    "citation_label": "Medical Certificate Submitted by Employee — Medical Certificate (SEC-DOC-047)"
  },
  {
    "chunk_id": "SEC-DOC-048",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-016",
    "document_title": "Medical Certificate Submitted by Employee",
    "document_type": "MEDICAL_CERTIFICATE",
    "document_date": "2025-08-24",
    "document_source": "EMPLOYEE",
    "document_status": "VERIFICATION_REQUIRED",
    "asset_ids": [],
    "section_title": "Document Verification Concern",
    "section_order": 2,
    "text": "The facility identifier and doctor registration format shown on the certificate differ from identifiers appearing on other documents supplied with the leave request and require verification.",
    "citation_label": "Medical Certificate Submitted by Employee — Document Verification Concern (SEC-DOC-048)"
  },
  {
    "chunk_id": "SEC-DOC-049",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-017",
    "document_title": "Consultation Receipt Submitted by Employee",
    "document_type": "MEDICAL_RECEIPT",
    "document_date": "2025-08-23",
    "document_source": "EMPLOYEE",
    "document_status": "VERIFICATION_REQUIRED",
    "asset_ids": [],
    "section_title": "Consultation Details",
    "section_order": 1,
    "text": "The consultation receipt records a visit dated 2025-08-23 and contains a patient reference number that differs from the reference number appearing on the medical certificate.",
    "citation_label": "Consultation Receipt Submitted by Employee — Consultation Details (SEC-DOC-049)"
  },
  {
    "chunk_id": "SEC-DOC-050",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-018",
    "document_title": "Employee Attendance Summary",
    "document_type": "ATTENDANCE_RECORD",
    "document_date": "2025-08-31",
    "document_source": "HR_SYSTEMS",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Attendance History",
    "section_order": 1,
    "text": "Over the preceding 12 months the employee recorded 17 unscheduled absence days. On five occasions the required manager notification process was not followed within the expected timeframe.",
    "citation_label": "Employee Attendance Summary — Attendance History (SEC-DOC-050)"
  },
  {
    "chunk_id": "SEC-DOC-051",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-018",
    "document_title": "Employee Attendance Summary",
    "document_type": "ATTENDANCE_RECORD",
    "document_date": "2025-08-31",
    "document_source": "HR_SYSTEMS",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Prior Interventions",
    "section_order": 2,
    "text": "The employee received two manager-level attendance interventions and one formal attendance warning before commencement of the performance improvement plan.",
    "citation_label": "Employee Attendance Summary — Prior Interventions (SEC-DOC-051)"
  },
  {
    "chunk_id": "SEC-DOC-052",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-019",
    "document_title": "Performance Improvement Plan",
    "document_type": "PERFORMANCE_PLAN",
    "document_date": "2025-06-01",
    "document_source": "HR",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "PIP Objectives",
    "section_order": 1,
    "text": "The one-month performance improvement plan measured attendance reliability, client response SLA compliance, CRM record maintenance and manager communication.",
    "citation_label": "Performance Improvement Plan — PIP Objectives (SEC-DOC-052)"
  },
  {
    "chunk_id": "SEC-DOC-053",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-019",
    "document_title": "Performance Improvement Plan",
    "document_type": "PERFORMANCE_PLAN",
    "document_date": "2025-06-01",
    "document_source": "HR",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "PIP Passing Threshold",
    "section_order": 2,
    "text": "The PIP required an overall score of at least 75 out of 100 with no critical compliance failure.",
    "citation_label": "Performance Improvement Plan — PIP Passing Threshold (SEC-DOC-053)"
  },
  {
    "chunk_id": "SEC-DOC-054",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-020",
    "document_title": "PIP Completion Assessment",
    "document_type": "PERFORMANCE_ASSESSMENT",
    "document_date": "2025-06-30",
    "document_source": "HR",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "PIP Result",
    "section_order": 1,
    "text": "Priya Menon completed the PIP with an overall score of 77 out of 100 and therefore met the stated passing threshold.",
    "citation_label": "PIP Completion Assessment — PIP Result (SEC-DOC-054)"
  },
  {
    "chunk_id": "SEC-DOC-055",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-020",
    "document_title": "PIP Completion Assessment",
    "document_type": "PERFORMANCE_ASSESSMENT",
    "document_date": "2025-06-30",
    "document_source": "HR",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Ongoing Observation",
    "section_order": 2,
    "text": "Although the employee passed the PIP, HR noted that attendance reliability and manager communication remained areas requiring monitoring.",
    "citation_label": "PIP Completion Assessment — Ongoing Observation (SEC-DOC-055)"
  },
  {
    "chunk_id": "SEC-DOC-056",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-021",
    "document_title": "Employee Clarification on Medical Documents",
    "document_type": "EMPLOYEE_RESPONSE",
    "document_date": "2025-09-02",
    "document_source": "EMPLOYEE",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Employee Explanation",
    "section_order": 1,
    "text": "The employee stated that a family member assisted in collecting some medical records and that she was unaware of the inconsistencies identified by HR. She denied intentionally submitting inaccurate documentation.",
    "citation_label": "Employee Clarification on Medical Documents — Employee Explanation (SEC-DOC-056)"
  },
  {
    "chunk_id": "SEC-DOC-057",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-021",
    "document_title": "Employee Clarification on Medical Documents",
    "document_type": "EMPLOYEE_RESPONSE",
    "document_date": "2025-09-02",
    "document_source": "EMPLOYEE",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Replacement Information",
    "section_order": 2,
    "text": "The employee supplied an additional clarification document addressing one identifier discrepancy, but HR considered at least one verification question unresolved.",
    "citation_label": "Employee Clarification on Medical Documents — Replacement Information (SEC-DOC-057)"
  },
  {
    "chunk_id": "SEC-DOC-058",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-022",
    "document_title": "HR Legal Intake Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-09-03",
    "document_source": "HR",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "HR Intake Summary",
    "section_order": 1,
    "text": "HR escalated the matter to Internal Legal because the matter combines a medically sensitive leave request, unresolved document-authenticity questions, prior attendance issues and a recently completed PIP.",
    "citation_label": "HR Legal Intake Note — HR Intake Summary (SEC-DOC-058)"
  },
  {
    "chunk_id": "SEC-DOC-059",
    "matter_id": "MAT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_type_id": "MT-002",
    "risk_rating": "MEDIUM",
    "workstream_id": "WS-003",
    "workstream_name": "Employee Leave & Misconduct Review",
    "parent_workstream_id": null,
    "document_id": "DOC-022",
    "document_title": "HR Legal Intake Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-09-03",
    "document_source": "HR",
    "document_status": "FINAL",
    "asset_ids": [],
    "section_title": "Requested Legal Assessment",
    "section_order": 2,
    "text": "HR requested advice on appropriate investigation steps, treatment of the leave request, separation of historic performance concerns from the current document-verification issue, procedural fairness and whether external employment counsel should be consulted before disciplinary action.",
    "citation_label": "HR Legal Intake Note — Requested Legal Assessment (SEC-DOC-059)"
  }
]
```

### `data/matter_index.json`

```json
[
  {
    "matter_id": "MAT-001",
    "title": "Meridian Components — Secured Loan Recovery",
    "status": "COUNSEL_ENGAGED",
    "risk_rating": "HIGH",
    "matter_type_id": "MT-001",
    "outstanding_exposure_inr": 124000000,
    "workstreams": [
      {
        "workstream_id": "WS-001",
        "name": "Recovery Assessment",
        "status": "ACTIVE",
        "parent_workstream_id": null
      },
      {
        "workstream_id": "WS-002",
        "name": "Security Verification",
        "status": "IN_PROGRESS",
        "parent_workstream_id": "WS-001"
      }
    ],
    "issue_count": 10,
    "finding_count": 10,
    "document_count": 14
  },
  {
    "matter_id": "MAT-002",
    "title": "Project Atlas — Employee Leave & Misconduct Review",
    "status": "INTERNAL_REVIEW",
    "risk_rating": "MEDIUM",
    "matter_type_id": "MT-002",
    "outstanding_exposure_inr": 0,
    "workstreams": [
      {
        "workstream_id": "WS-003",
        "name": "Employee Leave & Misconduct Review",
        "status": "ACTIVE",
        "parent_workstream_id": null
      }
    ],
    "issue_count": 5,
    "finding_count": 5,
    "document_count": 8
  }
]
```

### `data/matters/MAT-001.json`

```json
{
  "matter": {
    "matter_id": "MAT-001",
    "matter_type_id": "MT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_description": "Recovery of secured financing extended to Meridian Components Private Limited",
    "client_id": "PARTY-001",
    "counterparty_id": "PARTY-002",
    "matter_status": "COUNSEL_ENGAGED",
    "risk_rating": "HIGH",
    "outstanding_exposure_inr": 124000000,
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  "matter_type": {
    "matter_type_id": "MT-001",
    "matter_type_name": "secured_loan_recovery",
    "description": "Secured loan recovery and enforcement matters",
    "created_date": "2024-01-01"
  },
  "parties": {
    "client": {
      "party_id": "PARTY-001",
      "party_name": "Aster Fintech Limited",
      "party_type": "LENDER",
      "registration_number": "U65923DL2018PLC334567",
      "registered_address": "A-42, Sector 63, Noida, Uttar Pradesh 201301",
      "contact_email": "legal@asterfintech.in",
      "contact_phone": "+91-120-4567890",
      "created_date": "2024-01-01"
    },
    "counterparty": {
      "party_id": "PARTY-002",
      "party_name": "Meridian Components Private Limited",
      "party_type": "BORROWER",
      "registration_number": "U29100MH2015PTC267890",
      "registered_address": "Plot 15-B, MIDC Industrial Area, Andheri East, Mumbai 400093",
      "contact_email": "info@meridiancomponents.in",
      "contact_phone": "+91-22-28765432",
      "created_date": "2024-03-10"
    }
  },
  "workstreams": [
    {
      "workstream_id": "WS-001",
      "matter_id": "MAT-001",
      "parent_workstream_id": null,
      "workstream_name": "Recovery Assessment",
      "workstream_description": "Comprehensive recovery assessment including financing documentation, default chronology, repayment history, notices, borrower correspondence, recovery issues, and external counsel strategy",
      "workstream_status": "ACTIVE",
      "created_date": "2025-08-15",
      "created_by": "USR-001",
      "documents": [
        {
          "document_id": "DOC-001",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Facility Agreement",
          "document_type": "FINANCING_AGREEMENT",
          "document_date": "2024-03-15",
          "document_source": "LENDER_ORIGINATION",
          "document_status": "FINAL",
          "created_date": "2025-08-15",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-001",
              "document_id": "DOC-001",
              "section_title": "Facility Amount and Terms",
              "section_content": "The Lender agrees to extend to the Borrower a secured term loan facility of INR 15,00,00,000 (Indian Rupees Fifteen Crore Only). The facility shall be disbursed in a single tranche upon satisfaction of conditions precedent outlined in Schedule A. The tenure of the facility shall be 60 (sixty) months from the date of first disbursement.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-002",
              "document_id": "DOC-001",
              "section_title": "Repayment Obligations",
              "section_content": "The Borrower shall repay the facility in 60 (sixty) equated monthly installments (EMIs) commencing from 2024-06-01. Each EMI shall comprise principal and interest components. The EMI amount shall be INR 32,50,000 (Indian Rupees Thirty-Two Lakh Fifty Thousand Only) payable on the 1st day of each calendar month. Prepayment is permitted subject to a prepayment penalty of 2% if prepaid within the first 24 months.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-003",
              "document_id": "DOC-001",
              "section_title": "Interest Provisions",
              "section_content": "The facility shall carry interest at the rate of 13.5% (Thirteen Point Five Percent) per annum, calculated on a daily reducing balance basis. Interest shall be compounded monthly. In the event of default, penal interest at an additional rate of 3% (Three Percent) per annum shall apply on the overdue amount from the date of default until payment in full.",
              "section_order": 3
            },
            {
              "section_id": "SEC-DOC-004",
              "document_id": "DOC-001",
              "section_title": "Events of Default",
              "section_content": "The following shall constitute events of default: (a) failure to pay any installment within 15 (fifteen) days of the due date; (b) breach of any covenant or representation; (c) insolvency or liquidation of the Borrower; (d) attachment or sale of any secured asset; (e) material adverse change in the Borrower's financial condition. Upon occurrence of an event of default, the Lender may declare the entire outstanding amount immediately due and payable.",
              "section_order": 4
            },
            {
              "section_id": "SEC-DOC-005",
              "document_id": "DOC-001",
              "section_title": "Cure Period",
              "section_content": "Notwithstanding clause 12 (Events of Default), the Borrower shall have a cure period of 30 (thirty) days from the date of receipt of written notice from the Lender specifying the default. During the cure period, the Borrower may remedy the default by payment of overdue amounts plus applicable penal interest. If the default is not cured within the cure period, the Lender's enforcement rights shall become exercisable.",
              "section_order": 5
            },
            {
              "section_id": "SEC-DOC-006",
              "document_id": "DOC-001",
              "section_title": "Enforcement Provisions",
              "section_content": "Upon the occurrence and continuance of an event of default, the Lender shall be entitled to: (a) enforce any or all security interests created in favor of the Lender; (b) take possession of secured assets; (c) appoint a receiver for the Borrower's business; (d) initiate proceedings under applicable laws including but not limited to SARFAESI Act, 2002, Recovery of Debts and Bankruptcy Act, 1993, or Insolvency and Bankruptcy Code, 2016. All costs of enforcement shall be borne by the Borrower.",
              "section_order": 6
            }
          ]
        },
        {
          "document_id": "DOC-002",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Security Agreement",
          "document_type": "SECURITY_DOCUMENT",
          "document_date": "2024-03-15",
          "document_source": "LENDER_ORIGINATION",
          "document_status": "FINAL",
          "created_date": "2025-08-15",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-007",
              "document_id": "DOC-002",
              "section_title": "Security Package Description",
              "section_content": "The Borrower and third parties have created the following security package in favor of the Lender: (a) First mortgage by way of registered mortgage deed over commercial property at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059, bearing municipal no. A-45/2019, built-up area 12,500 sq ft; (b) Unconditional and irrevocable corporate guarantee by Rajesh Kumar Sharma; (c) First pari passu charge over all present and future book debts and receivables of the Borrower.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-008",
              "document_id": "DOC-002",
              "section_title": "Security Creation and Perfection",
              "section_content": "All security interests shall be created and perfected in accordance with applicable laws. The mortgage shall be registered with the Sub-Registrar of Assurances within 4 (four) months of execution. All charges shall be registered with CERSAI within 30 (thirty) days of creation. The Borrower shall execute all documents and do all acts necessary for creation, perfection, and registration of security interests.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-009",
              "document_id": "DOC-002",
              "section_title": "CERSAI Registration",
              "section_content": "The Borrower acknowledges that all security interests created in favor of the Lender shall be registered with the Central Registry of Securitisation Asset Reconstruction and Security Interest of India (CERSAI) in accordance with Section 20 of the SARFAESI Act, 2002. The Borrower authorizes the Lender to file necessary forms and particulars with CERSAI. All registration fees and costs shall be borne by the Borrower.",
              "section_order": 3
            },
            {
              "section_id": "SEC-DOC-010",
              "document_id": "DOC-002",
              "section_title": "Representations Regarding Security",
              "section_content": "The Borrower represents and warrants that: (a) it has clear, marketable, and encumbrance-free title to the mortgaged property except for prior charges disclosed in writing; (b) the property is free from all litigation, attachment, or encumbrance; (c) all documents relating to the property are genuine and valid; (d) no prior mortgage, charge, or lien exists on the property except as disclosed. Any breach of representations shall constitute an event of default.",
              "section_order": 4
            },
            {
              "section_id": "SEC-DOC-011",
              "document_id": "DOC-002",
              "section_title": "Enforcement of Security",
              "section_content": "Upon enforcement, the Lender shall be entitled to take all measures permitted by law including: (a) taking possession of secured assets; (b) sale or lease of secured assets by public auction or private treaty; (c) appointment of a manager or receiver; (d) recovery from guarantors; (e) recovery from receivables debtors. The Borrower shall not create any further charge or encumbrance on secured assets without prior written consent of the Lender.",
              "section_order": 5
            }
          ]
        },
        {
          "document_id": "DOC-003",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Corporate Guarantee",
          "document_type": "GUARANTEE_DEED",
          "document_date": "2024-03-15",
          "document_source": "LENDER_ORIGINATION",
          "document_status": "FINAL",
          "created_date": "2025-08-15",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-012",
              "document_id": "DOC-003",
              "section_title": "Guarantee Obligations",
              "section_content": "The Guarantor hereby unconditionally and irrevocably guarantees to the Lender the due and punctual payment and discharge of all obligations and liabilities of the Borrower under the Facility Agreement. This guarantee is a continuing guarantee and shall extend to the ultimate balance of sums payable by the Borrower, regardless of any intermediate payment or discharge.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-013",
              "document_id": "DOC-003",
              "section_title": "Guarantee Amount and Scope",
              "section_content": "This guarantee covers principal amount up to INR 15,00,00,000 (Indian Rupees Fifteen Crore Only) together with interest, penal interest, costs, charges, and expenses. The Guarantor's liability shall be that of a principal debtor and shall not be affected by any change in the constitution of the Borrower or the Lender, or by any forbearance or variation made by the Lender.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-014",
              "document_id": "DOC-003",
              "section_title": "Invocation of Guarantee",
              "section_content": "The Lender may invoke this guarantee at any time after the occurrence of an event of default under the Facility Agreement. The Guarantor shall pay the Lender within 7 (seven) days of receipt of written demand. The Guarantor waives all rights to require the Lender to first proceed against the Borrower or any other person or to enforce any other security before claiming against the Guarantor.",
              "section_order": 3
            },
            {
              "section_id": "SEC-DOC-015",
              "document_id": "DOC-003",
              "section_title": "Continuing Liability",
              "section_content": "This guarantee shall remain in full force and effect until all obligations of the Borrower are fully discharged. The Guarantor shall not revoke this guarantee without prior written consent of the Lender. The death, insolvency, or incapacity of the Guarantor shall not terminate this guarantee, and the Guarantor's legal heirs and estate shall remain liable.",
              "section_order": 4
            }
          ]
        },
        {
          "document_id": "DOC-004",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Repayment / Loan Account Summary",
          "document_type": "ACCOUNT_STATEMENT",
          "document_date": "2025-08-31",
          "document_source": "LENDER_SYSTEMS",
          "document_status": "FINAL",
          "created_date": "2025-08-31",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-016",
              "document_id": "DOC-004",
              "section_title": "Disbursement History",
              "section_content": "Disbursement Date: 2024-03-20. Disbursement Amount: INR 15,00,00,000. Disbursement Mode: NEFT to Borrower's account with HDFC Bank, Account No. 50200012345678, IFSC: HDFC0001234. All conditions precedent satisfied as per certificate dated 2024-03-19 issued by advocates M/s. Kapoor & Associates.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-017",
              "document_id": "DOC-004",
              "section_title": "Repayment Schedule vs Actuals",
              "section_content": "Scheduled EMIs: 60 monthly installments of INR 32,50,000 each from 2024-06-01 to 2029-05-01. Repayments Received: Installments 1-10 (2024-06-01 to 2025-03-01): Paid in full and on time. Installments 11-15 (2025-04-01 to 2025-08-01): Not paid. Total EMIs paid: 10. Total EMIs overdue as of 2025-08-31: 5.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-018",
              "document_id": "DOC-004",
              "section_title": "Outstanding Exposure Calculation",
              "section_content": "As of 2025-08-31: Principal Outstanding: INR 12,00,00,000. Accrued Interest: INR 37,30,000. Penal Interest: INR 2,70,000. Total Outstanding Exposure: INR 12,40,00,000 (Indian Rupees Twelve Crore Forty Lakh Only). Five scheduled EMIs remain overdue from 2025-04-01 through 2025-08-01.",
              "section_order": 3
            }
          ]
        },
        {
          "document_id": "DOC-005",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Default Notice",
          "document_type": "LEGAL_NOTICE",
          "document_date": "2025-07-10",
          "document_source": "LENDER_LEGAL",
          "document_status": "FINAL",
          "created_date": "2025-08-15",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-019",
              "document_id": "DOC-005",
              "section_title": "Notice of Default",
              "section_content": "To: Meridian Components Private Limited. From: Aster Fintech Limited. Date: 2025-07-10. Subject: Notice of Default under Facility Agreement dated 2024-03-15. We hereby notify you that you are in default under the above-referenced Facility Agreement by reason of failure to pay equated monthly installments due on 2025-04-01, 2025-05-01, 2025-06-01, and 2025-07-01, each in the amount of INR 32,50,000. Total amount overdue as of date: INR 1,30,00,000 plus accrued interest and penal interest.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-020",
              "document_id": "DOC-005",
              "section_title": "Cure Period Invocation",
              "section_content": "Pursuant to Clause 12.5 (Cure Period) of the Facility Agreement, you are hereby granted a cure period of 30 (thirty) days from the date of receipt of this notice to remedy the default by payment of all overdue amounts together with applicable interest and penal interest. Payment must be received in our account no. 12345678901234, IFSC: HDFC0001234, by 2025-08-09.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-021",
              "document_id": "DOC-005",
              "section_title": "Consequences of Non-Cure",
              "section_content": "If the default is not cured within the cure period specified above, Aster Fintech Limited shall be entitled to exercise all rights and remedies available under the Facility Agreement, Security Documents, and applicable law, including but not limited to: (a) declaring the entire outstanding amount immediately due and payable; (b) enforcing security interests; (c) initiating recovery proceedings. All costs and expenses shall be to your account.",
              "section_order": 3
            }
          ]
        },
        {
          "document_id": "DOC-006",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Borrower Response",
          "document_type": "CORRESPONDENCE",
          "document_date": "2025-07-28",
          "document_source": "BORROWER",
          "document_status": "FINAL",
          "created_date": "2025-08-15",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-022",
              "document_id": "DOC-006",
              "section_title": "Acknowledgment of Default",
              "section_content": "To: Aster Fintech Limited. From: Meridian Components Private Limited. Date: 2025-07-28. Subject: Response to Default Notice dated 2025-07-10. We acknowledge receipt of your notice dated 2025-07-10 and confirm that we are currently experiencing temporary financial difficulties due to delayed payments from our key customers and disruption in our supply chain. We have not been able to make the scheduled payments for April, May, June, and July 2025.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-023",
              "document_id": "DOC-006",
              "section_title": "Explanation of Financial Distress",
              "section_content": "Our company has been impacted by: (a) delayed receivables from two major customers totaling INR 8.5 crore, now overdue by 90-120 days; (b) temporary shutdown of one production line due to machinery breakdown requiring replacement parts from Germany, expected to be operational by September 2025; (c) increased raw material costs by approximately 18% due to global supply chain disruptions. These factors have resulted in temporary cash flow constraints.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-024",
              "document_id": "DOC-006",
              "section_title": "Request for Restructuring",
              "section_content": "We respectfully request Aster Fintech Limited to consider the following restructuring options: (a) moratorium on principal repayment for 6 months with interest servicing; (b) extension of loan tenure by 12 months; (c) conversion of overdue interest into funded interest term loan. We are committed to honoring our obligations and believe these measures will enable us to return to regular repayment by Q1 2026. We request a meeting to discuss this proposal.",
              "section_order": 3
            }
          ]
        },
        {
          "document_id": "DOC-007",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Internal Credit Risk Memo",
          "document_type": "INTERNAL_MEMO",
          "document_date": "2025-08-15",
          "document_source": "CREDIT_DEPT",
          "document_status": "FINAL",
          "created_date": "2025-08-15",
          "created_by": "USR-003",
          "sections": [
            {
              "section_id": "SEC-DOC-025",
              "document_id": "DOC-007",
              "section_title": "Credit Assessment Summary",
              "section_content": "Borrower: Meridian Components Private Limited. Facility: INR 15 crore secured term loan. Current Exposure: INR 12.4 crore (as of 2025-08-31). Days Past Due: 153 days. Current Risk Rating: HIGH (downgraded from MEDIUM on 2025-07-15). Security Coverage: Estimated at 1.45x based on last valuation (2024-02). Key Concerns: (a) 6 consecutive EMIs overdue; (b) borrower's financial position deteriorating; (c) no concrete restructuring proposal received; (d) security verification incomplete.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-026",
              "document_id": "DOC-007",
              "section_title": "Risk Rating Downgrade Rationale",
              "section_content": "Risk rating downgraded from MEDIUM to HIGH based on: (a) payment default exceeding 90 days; (b) borrower's admission of financial distress in response dated 2025-07-28; (c) lack of immediate liquidity to cure default; (d) concentration risk with delayed receivables from two customers; (e) operational issues affecting production capacity. Recommend immediate escalation to Legal for recovery assessment and external counsel engagement.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-027",
              "document_id": "DOC-007",
              "section_title": "Recommended Actions",
              "section_content": "Recommended actions: (a) escalate to Internal Legal for recovery strategy assessment; (b) engage external recovery counsel with expertise in SARFAESI and DRT matters; (c) initiate comprehensive security verification to confirm enforceability of all securities; (d) obtain updated valuation of mortgaged property; (e) verify CERSAI registration status; (f) assess guarantor's current financial position; (g) consider issuing demand notice to guarantor; (h) evaluate options: SARFAESI enforcement vs. DRT application vs. IBC initiation.",
              "section_order": 3
            },
            {
              "section_id": "SEC-DOC-028",
              "document_id": "DOC-007",
              "section_title": "Information Gaps",
              "section_content": "Critical information gaps identified: (a) latest borrower financials (last audited: FY2023-24); (b) current collateral valuation (last: 2024-02, pre-disbursement); (c) CERSAI registration certificate copy pending verification; (d) guarantor's current net worth and asset position; (e) status of receivables charge perfection; (f) title deed custody confirmation; (g) prior encumbrances on property; (h) borrower's other borrowing facilities and defaults.",
              "section_order": 4
            }
          ]
        },
        {
          "document_id": "DOC-008",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "document_title": "Internal Legal Intake / Escalation Note",
          "document_type": "INTERNAL_MEMO",
          "document_date": "2025-08-22",
          "document_source": "LEGAL_DEPT",
          "document_status": "FINAL",
          "created_date": "2025-08-22",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-029",
              "document_id": "DOC-008",
              "section_title": "Matter Summary",
              "section_content": "Matter: Recovery of secured loan facility of INR 15 crore extended to Meridian Components Private Limited. Current Outstanding: INR 12.4 crore. Borrower in default since 2025-04-01 (153 days past due). Security package includes: (a) mortgage over commercial property in Mumbai; (b) corporate guarantee by Rajesh Kumar Sharma; (c) charge over receivables. Borrower has acknowledged default and requested restructuring. Credit Department recommends legal escalation.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-030",
              "document_id": "DOC-008",
              "section_title": "Documents Reviewed",
              "section_content": "Documents reviewed in preparation for external counsel engagement: (1) Facility Agreement dated 2024-03-15; (2) Security Agreement dated 2024-03-15; (3) Corporate Guarantee dated 2024-03-15; (4) Loan Account Summary as of 2025-08-31; (5) Default Notice dated 2025-07-10; (6) Borrower Response dated 2025-07-28; (7) Internal Credit Risk Memo dated 2025-08-15. All documents appear to be in order and properly executed.",
              "section_order": 2
            },
            {
              "section_id": "SEC-DOC-031",
              "document_id": "DOC-008",
              "section_title": "Preliminary Issues Identified",
              "section_content": "Preliminary legal issues requiring external counsel advice: (a) compliance with contractual notice requirements and cure period; (b) completeness and enforceability of security package; (c) guarantee position and invocation strategy; (d) appropriate recovery forum and mechanism (SARFAESI vs. DRT vs. IBC); (e) timeline and cost estimates for each recovery pathway; (f) likelihood of successful recovery given borrower's financial position; (g) risk of borrower initiating pre-emptive IBC or NCLT proceedings.",
              "section_order": 3
            },
            {
              "section_id": "SEC-DOC-032",
              "document_id": "DOC-008",
              "section_title": "Recommendation for External Counsel",
              "section_content": "Recommend engagement of external counsel specializing in secured lending recovery and enforcement. Counsel should be briefed to: (a) review all documentation and confirm enforceability; (b) advise on optimal recovery strategy and forum; (c) prepare and issue legal demand notice; (d) initiate enforcement proceedings if settlement not achieved; (e) provide timeline and cost estimates. Suggested counsel: M/s. Rajani & Associates (Mumbai) or M/s. Economic Laws Practice (Delhi). Budget estimate: INR 5-8 lakhs for initial engagement.",
              "section_order": 4
            }
          ]
        }
      ],
      "timeline": [
        {
          "timeline_id": "TM-001",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2024-03-15",
          "event_type": "AGREEMENT_EXECUTION",
          "event_title": "Facility Agreement Execution",
          "event_description": "Facility Agreement, Security Agreement, and Corporate Guarantee executed by all parties at Aster Fintech Limited office, Noida",
          "related_document_id": "DOC-001",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-002",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2024-03-20",
          "event_type": "DISBURSEMENT",
          "event_title": "Loan Disbursement",
          "event_description": "Full facility amount of INR 15 crore disbursed to Borrower's account with HDFC Bank via NEFT",
          "related_document_id": "DOC-004",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-003",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2024-03-18",
          "event_type": "SECURITY_CREATION",
          "event_title": "Property Mortgage Execution",
          "event_description": "Registered mortgage deed executed over commercial property at Andheri-Kurla Road, Mumbai before Sub-Registrar of Assurances, Mumbai",
          "related_document_id": "DOC-002",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-004",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2024-04-05",
          "event_type": "REGISTRATION",
          "event_title": "CERSAI Registration",
          "event_description": "Security interests registered with CERSAI (Registration Nos. CERSAI-2024-0315-789456 and CERSAI-2024-0315-789457)",
          "related_document_id": "DOC-002",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-005",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2024-06-01",
          "event_type": "REPAYMENT_DUE",
          "event_title": "First EMI Due",
          "event_description": "First equated monthly installment of INR 32,50,000 due and paid on time",
          "related_document_id": "DOC-004",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-006",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-03-01",
          "event_type": "REPAYMENT_RECEIVED",
          "event_title": "Last Timely Repayment",
          "event_description": "Tenth EMI of INR 32,50,000 paid on time. Total repaid to date: INR 3,25,00,000",
          "related_document_id": "DOC-004",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-007",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-04-01",
          "event_type": "DEFAULT_FIRST",
          "event_title": "First Payment Default",
          "event_description": "Eleventh EMI of INR 32,50,000 not received on due date. First instance of payment delay",
          "related_document_id": "DOC-004",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-008",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-07-01",
          "event_type": "DEFAULT_CONTINUING",
          "event_title": "Continuing Defaults",
          "event_description": "Four consecutive EMIs are now overdue for April, May, June and July 2025. Total scheduled overdue payments: INR 1,30,00,000 plus applicable interest.",
          "related_document_id": "DOC-004",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-009",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-07-10",
          "event_type": "LEGAL_NOTICE",
          "event_title": "Default Notice Issued",
          "event_description": "Formal default notice issued to Borrower under Clause 12 of Facility Agreement, invoking 30-day cure period",
          "related_document_id": "DOC-005",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-010",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-07-28",
          "event_type": "BORROWER_RESPONSE",
          "event_title": "Borrower Response Received",
          "event_description": "Borrower acknowledged default, explained financial distress, and requested loan restructuring",
          "related_document_id": "DOC-006",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-011",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-08-15",
          "event_type": "INTERNAL_ESCALATION",
          "event_title": "Credit Escalation to Legal",
          "event_description": "Credit Department escalated matter to Internal Legal with HIGH risk rating and recommendation for external counsel",
          "related_document_id": "DOC-007",
          "created_date": "2025-08-15"
        },
        {
          "timeline_id": "TM-012",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "event_date": "2025-08-22",
          "event_type": "DECISION_EXTERNAL_COUNSEL",
          "event_title": "Decision to Engage External Counsel",
          "event_description": "Internal Legal approved engagement of external recovery counsel. Matter ready for counsel briefing",
          "related_document_id": "DOC-008",
          "created_date": "2025-08-22"
        }
      ],
      "issues": [
        {
          "issue_id": "ISSUE-001",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "issue_title": "Continuing Payment Default",
          "issue_description": "Borrower has failed to pay 5 consecutive monthly installments from April 2025 through August 2025 totaling INR 1,62,50,000 in scheduled EMIs, together with accrued and penal interest. The first payment default occurred on 2025-04-01 and remains uncured as of 2025-08-31.",
          "issue_status": "ACTIVE",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "NO",
          "created_date": "2025-08-15",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-002",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "issue_title": "Compliance with Contractual Notice Requirements",
          "issue_description": "Whether default notice dated 2025-07-10 was properly served in accordance with Clause 18.3 of Facility Agreement (notice requirements). Notice sent via registered post and email. Borrower acknowledged receipt in response dated 2025-07-28. Cure period of 30 days expired on 2025-08-09 without payment.",
          "issue_status": "ACTIVE",
          "issue_priority": "MEDIUM",
          "requires_legal_judgment": "NO",
          "created_date": "2025-08-15",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-003",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "issue_title": "Completeness of Security Package",
          "issue_description": "Security package comprises three securities: (a) mortgage over commercial property; (b) corporate guarantee; (c) charge over receivables. All securities appear to be documented. However, verification of CERSAI registration certificates, title deed custody, and prior encumbrances remains incomplete pending WS-002 Security Verification workstream.",
          "issue_status": "IN_PROGRESS",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "NO",
          "created_date": "2025-08-15",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-004",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "issue_title": "Guarantee Position Requiring Review",
          "issue_description": "Corporate guarantee executed by Rajesh Kumar Sharma for INR 15 crore plus interest. Guarantee is unconditional and irrevocable. However, guarantor's current financial position, net worth, and asset availability have not been assessed. Recommend verification before guarantee invocation.",
          "issue_status": "ACTIVE",
          "issue_priority": "MEDIUM",
          "requires_legal_judgment": "NO",
          "created_date": "2025-08-15",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-005",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "issue_title": "Appropriate Recovery/Enforcement Strategy",
          "issue_description": "Multiple recovery pathways potentially available: (a) SARFAESI Act enforcement (possession and sale of secured assets); (b) DRT application for recovery certificate; (c) IBC initiation if borrower insolvent; (d) civil suit. Optimal pathway depends on: security enforceability, borrower solvency, asset valuation, timeline, costs, and likelihood of recovery. REQUIRES_LEGAL_JUDGMENT by qualified counsel.",
          "issue_status": "ACTIVE",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-08-22",
          "created_by": "USR-001"
        }
      ],
      "findings": [
        {
          "finding_id": "FIND-001",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "finding_type": "FACTUAL",
          "finding_title": "Payment Default Confirmed",
          "finding_summary": "Borrower has failed to pay 5 consecutive monthly installments from April 2025 through August 2025 totaling INR 1,62,50,000 in scheduled EMIs, together with accrued and penal interest. The first payment default occurred on 2025-04-01 and remains uncured as of 2025-08-31.",
          "confidence_level": "HIGH",
          "requires_verification": "NO",
          "created_date": "2025-08-31",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-001",
              "finding_id": "FIND-001",
              "source_type": "DOCUMENT",
              "source_id": "DOC-004",
              "source_section": "SEC-DOC-017",
              "citation_text": "Repayment Schedule vs Actuals section showing 5 EMIs overdue"
            },
            {
              "citation_id": "CITE-002",
              "finding_id": "FIND-001",
              "source_type": "DOCUMENT",
              "source_id": "DOC-006",
              "source_section": "SEC-DOC-022",
              "citation_text": "Borrower acknowledgment of default"
            }
          ]
        },
        {
          "finding_id": "FIND-002",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "finding_type": "EXPOSURE",
          "finding_title": "Outstanding Exposure Calculation",
          "finding_summary": "Total outstanding exposure as of 2025-08-31 is INR 12,40,00,000 comprising principal outstanding of INR 12,00,00,000, accrued interest of INR 37,30,000, and penal interest of INR 2,70,000.",
          "confidence_level": "HIGH",
          "requires_verification": "NO",
          "created_date": "2025-08-31",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-003",
              "finding_id": "FIND-002",
              "source_type": "DOCUMENT",
              "source_id": "DOC-004",
              "source_section": "SEC-DOC-018",
              "citation_text": "Outstanding Exposure Calculation section"
            }
          ]
        },
        {
          "finding_id": "FIND-003",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "finding_type": "DOCUMENTATION",
          "finding_title": "Security Package Appears Complete",
          "finding_summary": "Three securities documented: (a) property mortgage; (b) corporate guarantee; (c) receivables charge. All appear properly documented pending verification of registration certificates and title deeds.",
          "confidence_level": "MEDIUM",
          "requires_verification": "YES",
          "created_date": "2025-08-31",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-004",
              "finding_id": "FIND-003",
              "source_type": "DOCUMENT",
              "source_id": "DOC-002",
              "source_section": "SEC-DOC-007",
              "citation_text": "Security Package Description section"
            }
          ]
        },
        {
          "finding_id": "FIND-004",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "finding_type": "INFORMATION_GAP",
          "finding_title": "Current Collateral Valuation Missing",
          "finding_summary": "Last property valuation dated 2024-02 (pre-disbursement). Current market value unknown. Property values in Andheri-Kurla Road area may have appreciated 15-20% since 2024, but this requires confirmation.",
          "confidence_level": "MEDIUM",
          "requires_verification": "YES",
          "created_date": "2025-08-31",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-005",
              "finding_id": "FIND-004",
              "source_type": "DOCUMENT",
              "source_id": "DOC-007",
              "source_section": "SEC-DOC-028",
              "citation_text": "Information Gaps section noting valuation missing"
            }
          ]
        },
        {
          "finding_id": "FIND-005",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "finding_type": "INFORMATION_GAP",
          "finding_title": "Latest Borrower Financials Unavailable",
          "finding_summary": "Last audited financials available: FY2023-24. FY2024-25 financials not yet available. Borrower's current financial position and solvency status cannot be definitively assessed without updated financials.",
          "confidence_level": "MEDIUM",
          "requires_verification": "YES",
          "created_date": "2025-08-31",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-006",
              "finding_id": "FIND-005",
              "source_type": "DOCUMENT",
              "source_id": "DOC-007",
              "source_section": "SEC-DOC-028",
              "citation_text": "Information Gaps section noting latest financials unavailable"
            }
          ]
        },
        {
          "finding_id": "FIND-006",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "finding_type": "LEGAL_ISSUE",
          "finding_title": "Recovery Strategy Requires Legal Judgment",
          "finding_summary": "Optimal recovery pathway (SARFAESI vs. DRT vs. IBC) requires legal judgment based on: security enforceability, borrower solvency, asset valuation, timeline, costs, and recovery likelihood. Cannot be determined without external counsel advice.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-08-31",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-007",
              "finding_id": "FIND-006",
              "source_type": "LEGAL_ISSUE",
              "source_id": "ISSUE-005",
              "source_section": null,
              "citation_text": "Legal issue flagged as REQUIRES_LEGAL_JUDGMENT"
            }
          ]
        }
      ],
      "decisions": [
        {
          "decision_id": "DEC-001",
          "matter_id": "MAT-001",
          "workstream_id": "WS-001",
          "decision_type": "PROCESS",
          "decision_title": "Conditional Recovery Strategy",
          "decision_summary": "Internal Legal approved continued recovery preparation against Meridian Components while preserving multiple recovery routes. Material enforcement against the commercial property remains conditional on further treatment of the unresolved Zenith mortgage satisfaction issue or explicit documented acceptance of the residual risk.",
          "decision_status": "APPROVED_WITH_CONDITIONS",
          "decision_rationale": "Meridian Components remains in payment default with approximately INR 12.4 crore outstanding. Aster has multiple potential recovery routes and a security package comprising the commercial property, Corporate Guarantee, and charge over receivables. The unresolved Zenith mortgage/release issue creates uncertainty concerning reliance on the commercial property. External counsel considers the existing release evidence sufficient to progress enforcement preparation, but Internal Legal requires either further verification or explicit acceptance of the residual security risk before a material property-enforcement step. This approach allows recovery preparation to continue without treating an unresolved evidentiary issue as conclusively resolved.",
          "decision_date": "2025-09-16",
          "decided_by": "USR-001",
          "created_date": "2025-08-22",
          "selected_actions": [
            "Proceed with recovery preparation against Meridian Components while preserving multiple available recovery routes.",
            "Continue preparation relating to the secured recovery process without treating the Zenith release issue as conclusively resolved.",
            "Preserve recovery rights under the Corporate Guarantee.",
            "Obtain further analysis of guarantor recoverability and the receivables charge.",
            "Remain open to a commercially credible settlement without prejudicing existing recovery rights."
          ],
          "decision_factors": {
            "legal_risk": "MEDIUM-HIGH in relation to reliance on the commercial property until the Zenith issue is resolved or expressly accepted. Other recovery routes require separate assessment.",
            "recovery_probability": null,
            "cost": "Not yet sufficiently established. External legal and enforcement costs depend on the routes pursued and whether proceedings become contested.",
            "timeline": "Not fixed. Timing depends on security verification, procedural requirements, borrower response, enforcement route, and any contested proceedings.",
            "commercial_considerations": "A commercially credible settlement proposal may be considered. Settlement discussions should not unnecessarily prejudice Aster's recovery rights.",
            "process_legal_considerations": "Before material enforcement action, confirm applicable procedural prerequisites, complete required security verification, document Internal Legal's treatment of any remaining Zenith risk, and obtain required internal approvals."
          },
          "alternatives_considered": [
            {
              "alternative": "Proceed against the commercial property based solely on counsel's current opinion.",
              "decision": "NOT_SELECTED_AT_THIS_STAGE",
              "reason": "Internal evidence still contains an unresolved verification gap relating to the historical Zenith mortgage."
            },
            {
              "alternative": "Pause the entire recovery matter until the Zenith issue is completely resolved.",
              "decision": "NOT_SELECTED",
              "reason": "Uncertainty affecting one security asset does not require Aster to stop assessment or preservation of its other recovery routes."
            },
            {
              "alternative": "Pursue settlement as the sole strategy.",
              "decision": "NOT_SELECTED",
              "reason": "Settlement may be considered, but Aster should preserve its enforcement and recovery options."
            },
            {
              "alternative": "Conditional multi-route recovery strategy.",
              "decision": "SELECTED",
              "reason": "Recovery preparation can continue while the property-enforcement decision remains conditional on further treatment of the Zenith security issue."
            }
          ],
          "follow_up_actions": [
            {
              "action_id": "DEC001-ACT-001",
              "action": "Request further clarification from external counsel regarding the Zenith release conclusion.",
              "owner": "Internal Legal / External Counsel",
              "status": "OPEN"
            },
            {
              "action_id": "DEC001-ACT-002",
              "action": "Seek additional evidence of Zenith mortgage satisfaction where available.",
              "owner": "Internal Legal / External Counsel",
              "status": "OPEN"
            },
            {
              "action_id": "DEC001-ACT-003",
              "action": "Assess guarantor financial position and practical recoverability.",
              "owner": "External Counsel / Internal Legal",
              "status": "OPEN"
            },
            {
              "action_id": "DEC001-ACT-004",
              "action": "Obtain substantive analysis of the charge over receivables.",
              "owner": "External Counsel",
              "status": "OPEN"
            },
            {
              "action_id": "DEC001-ACT-005",
              "action": "Continue recovery preparation while preserving available recovery rights.",
              "owner": "Internal Legal / Recovery Team",
              "status": "IN_PROGRESS"
            }
          ],
          "decision_finality": "PROVISIONAL / APPROVED WITH CONDITIONS"
        }
      ]
    },
    {
      "workstream_id": "WS-002",
      "matter_id": "MAT-001",
      "parent_workstream_id": "WS-001",
      "workstream_name": "Security Verification",
      "workstream_description": "Determine what securities support the facility, whether available evidence supports those securities, what verification gaps exist, and which issues require legal judgment",
      "workstream_status": "IN_PROGRESS",
      "created_date": "2025-08-15",
      "created_by": "USR-001",
      "documents": [
        {
          "document_id": "DOC-009",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "document_title": "Sale Deed - Commercial Property",
          "document_type": "TITLE_DEED",
          "document_date": "1998-09-14",
          "document_source": "TITLE_RECORDS",
          "document_status": "FINAL",
          "created_date": "2025-08-20",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-033",
              "document_id": "DOC-009",
              "section_title": "Property Transfer",
              "section_content": "Under Sale Deed dated 1998-09-14, Shakti Industrial Estates Private Limited transferred the commercial property identified as Plot No. 45, Andheri-Kurla Road, Mumbai to Western Engineering Works Private Limited for stated consideration.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-034",
              "document_id": "DOC-009",
              "section_title": "Property Description",
              "section_content": "The property comprises approximately 12,500 square feet of built-up industrial and commercial premises together with associated land and appurtenant rights.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-010",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "document_title": "Conveyance Deed - Commercial Property",
          "document_type": "CONVEYANCE_DEED",
          "document_date": "2007-03-22",
          "document_source": "TITLE_RECORDS",
          "document_status": "FINAL",
          "created_date": "2025-08-20",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-035",
              "document_id": "DOC-010",
              "section_title": "2007 Conveyance",
              "section_content": "Western Engineering Works Private Limited conveyed the property to Meridian Components Private Limited pursuant to a restructuring transaction documented by Conveyance Deed dated 2007-03-22.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-036",
              "document_id": "DOC-010",
              "section_title": "Ownership Representation",
              "section_content": "The conveyance records Meridian Components Private Limited as transferee and states that the property is transferred together with all rights, easements and interests held by the transferor.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-011",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "document_title": "Prior Mortgage Deed - Zenith Commercial Bank",
          "document_type": "MORTGAGE_DEED",
          "document_date": "2014-06-18",
          "document_source": "TITLE_RECORDS",
          "document_status": "FINAL",
          "created_date": "2025-08-20",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-037",
              "document_id": "DOC-011",
              "section_title": "Prior Mortgage Creation",
              "section_content": "Meridian Components Private Limited created a mortgage over the commercial property in favour of Zenith Commercial Bank Limited on 2014-06-18 to secure working capital facilities up to INR 9 crore.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-038",
              "document_id": "DOC-011",
              "section_title": "Release Requirement",
              "section_content": "The mortgage deed provides that the security shall continue until all secured obligations to Zenith Commercial Bank Limited are discharged and appropriate release documentation is issued.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-012",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "document_title": "Release and Satisfaction Letter",
          "document_type": "RELEASE_DOCUMENT",
          "document_date": "2019-11-08",
          "document_source": "BORROWER_RECORDS",
          "document_status": "VERIFICATION_REQUIRED",
          "created_date": "2025-08-20",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-039",
              "document_id": "DOC-012",
              "section_title": "Release Statement",
              "section_content": "The letter states that credit facilities extended by Zenith Commercial Bank Limited to Meridian Components Private Limited were repaid and that the bank has no objection to release of security over the property.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-040",
              "document_id": "DOC-012",
              "section_title": "Verification Limitation",
              "section_content": "The available release letter does not contain a corresponding registration endorsement or certified satisfaction record confirming removal of the 2014 mortgage from all relevant security and property records.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-013",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "document_title": "Current Security and Encumbrance Search",
          "document_type": "SECURITY_SEARCH",
          "document_date": "2025-08-19",
          "document_source": "LEGAL_SEARCH",
          "document_status": "FINAL",
          "created_date": "2025-08-20",
          "created_by": "USR-001",
          "sections": [
            {
              "section_id": "SEC-DOC-041",
              "document_id": "DOC-013",
              "section_title": "Current Search Result",
              "section_content": "The current search identifies Aster Fintech Limited's mortgage registered in 2024. Historical records also reference the 2014 Zenith Commercial Bank mortgage. The materials reviewed do not contain conclusive evidence confirming formal satisfaction of that earlier mortgage.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-042",
              "document_id": "DOC-013",
              "section_title": "Verification Requirement",
              "section_content": "External property counsel should confirm whether additional registry records, charge-satisfaction filings or lender confirmations are required to establish discharge of the earlier security interest.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-014",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "document_title": "Property Valuation Report",
          "document_type": "VALUATION_REPORT",
          "document_date": "2024-02-12",
          "document_source": "VALUER",
          "document_status": "FINAL",
          "created_date": "2025-08-20",
          "created_by": "USR-003",
          "sections": [
            {
              "section_id": "SEC-DOC-043",
              "document_id": "DOC-014",
              "section_title": "Valuation Conclusion",
              "section_content": "The February 2024 valuation assessed the property at approximately INR 18 crore based on prevailing comparable transactions and existing property use.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-044",
              "document_id": "DOC-014",
              "section_title": "Valuation Limitation",
              "section_content": "The report predates the current recovery assessment and should not be treated as evidence of current realizable value. An updated valuation is recommended before enforcement strategy is finalized.",
              "section_order": 2
            }
          ]
        }
      ],
      "timeline": [
        {
          "timeline_id": "TM-013",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "event_date": "1998-09-14",
          "event_type": "TITLE_EVENT",
          "event_title": "Original Sale Deed",
          "event_description": "Property transferred to Western Engineering Works Private Limited",
          "related_document_id": "DOC-009",
          "created_date": "2025-08-20"
        },
        {
          "timeline_id": "TM-014",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "event_date": "2007-03-22",
          "event_type": "TITLE_EVENT",
          "event_title": "Conveyance to Meridian",
          "event_description": "Property conveyed to Meridian Components Private Limited",
          "related_document_id": "DOC-010",
          "created_date": "2025-08-20"
        },
        {
          "timeline_id": "TM-015",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "event_date": "2014-06-18",
          "event_type": "PRIOR_SECURITY",
          "event_title": "Prior Mortgage Created",
          "event_description": "Mortgage created in favour of Zenith Commercial Bank Limited",
          "related_document_id": "DOC-011",
          "created_date": "2025-08-20"
        },
        {
          "timeline_id": "TM-016",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "event_date": "2019-11-08",
          "event_type": "RELEASE_RECORD",
          "event_title": "Purported Release",
          "event_description": "Zenith Commercial Bank issued release and satisfaction letter; formal satisfaction evidence remains to be verified",
          "related_document_id": "DOC-012",
          "created_date": "2025-08-20"
        },
        {
          "timeline_id": "TM-017",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "event_date": "2024-03-18",
          "event_type": "SECURITY_CREATION",
          "event_title": "Aster Mortgage Created",
          "event_description": "Property mortgaged in favour of Aster Fintech Limited",
          "related_document_id": "DOC-002",
          "created_date": "2025-08-20"
        },
        {
          "timeline_id": "TM-018",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "event_date": "2025-08-19",
          "event_type": "SECURITY_SEARCH",
          "event_title": "Security Search Completed",
          "event_description": "Search confirms Aster security but identifies unresolved historical mortgage record",
          "related_document_id": "DOC-013",
          "created_date": "2025-08-20"
        }
      ],
      "issues": [
        {
          "issue_id": "ISSUE-006",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "issue_title": "Security Verification Workstream Incomplete",
          "issue_description": "WS-002 Security Verification workstream remains in progress. Critical verification items pending: (a) title deed examination and ownership history; (b) prior mortgage/charge search; (c) CERSAI registration confirmation; (d) current property valuation; (e) receivables charge perfection status. Recovery strategy cannot be finalized until security verification complete.",
          "issue_status": "IN_PROGRESS",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "NO",
          "created_date": "2025-08-15",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-007",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "issue_title": "Prior Mortgage Requires Verification",
          "issue_description": "Historical title and security records show a mortgage created in 2014 in favour of Zenith Commercial Bank Limited. Available records indicate repayment but formal satisfaction evidence has not yet been conclusively verified.",
          "issue_status": "IN_PROGRESS",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-08-20",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-008",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "issue_title": "Release Documentation Incomplete",
          "issue_description": "A 2019 release letter exists, but available evidence does not include a corresponding certified satisfaction or registration record conclusively demonstrating discharge of the prior mortgage.",
          "issue_status": "IN_PROGRESS",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-08-20",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-009",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "issue_title": "Current Property Valuation Outdated",
          "issue_description": "The latest available property valuation is dated February 2024 and may not reflect current realizable value for recovery planning.",
          "issue_status": "ACTIVE",
          "issue_priority": "MEDIUM",
          "requires_legal_judgment": "NO",
          "created_date": "2025-08-20",
          "created_by": "USR-003"
        },
        {
          "issue_id": "ISSUE-010",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "issue_title": "Impact of Security Verification on Recovery Strategy",
          "issue_description": "Unresolved historical mortgage and release evidence may affect the timing, process or strategy for enforcement against the property. External counsel judgment is required before relying on the property as an immediately enforceable recovery asset.",
          "issue_status": "ACTIVE",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-08-20",
          "created_by": "USR-001"
        }
      ],
      "findings": [
        {
          "finding_id": "FIND-007",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "finding_type": "SECURITY_VERIFICATION",
          "finding_title": "Prior Mortgage Identified",
          "finding_summary": "Title and security records identify a mortgage created in 2014 in favour of Zenith Commercial Bank Limited over AST-001.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-08-20",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-008",
              "finding_id": "FIND-007",
              "source_type": "DOCUMENT",
              "source_id": "DOC-011",
              "source_section": "SEC-DOC-037",
              "citation_text": "Prior Mortgage Creation"
            }
          ]
        },
        {
          "finding_id": "FIND-008",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "finding_type": "INFORMATION_GAP",
          "finding_title": "Formal Mortgage Satisfaction Not Confirmed",
          "finding_summary": "A 2019 release letter indicates repayment and release intent, but the available dataset does not contain conclusive registration evidence establishing formal satisfaction of the 2014 mortgage.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-08-20",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-009",
              "finding_id": "FIND-008",
              "source_type": "DOCUMENT",
              "source_id": "DOC-012",
              "source_section": "SEC-DOC-039",
              "citation_text": "Release Statement"
            },
            {
              "citation_id": "CITE-010",
              "finding_id": "FIND-008",
              "source_type": "DOCUMENT",
              "source_id": "DOC-012",
              "source_section": "SEC-DOC-040",
              "citation_text": "Verification Limitation"
            },
            {
              "citation_id": "CITE-011",
              "finding_id": "FIND-008",
              "source_type": "DOCUMENT",
              "source_id": "DOC-013",
              "source_section": "SEC-DOC-041",
              "citation_text": "Current Search Result"
            }
          ]
        },
        {
          "finding_id": "FIND-009",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "finding_type": "DOCUMENTATION",
          "finding_title": "Aster Mortgage Recorded",
          "finding_summary": "Current security records identify Aster Fintech Limited's 2024 mortgage over AST-001. This supports existence of the lender's claimed security, subject to counsel verification of priority and enforceability.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-08-20",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-012",
              "finding_id": "FIND-009",
              "source_type": "DOCUMENT",
              "source_id": "DOC-013",
              "source_section": "SEC-DOC-041",
              "citation_text": "Current Search Result"
            }
          ]
        },
        {
          "finding_id": "FIND-010",
          "matter_id": "MAT-001",
          "workstream_id": "WS-002",
          "finding_type": "LEGAL_ISSUE",
          "finding_title": "Security Issue May Affect Recovery Strategy",
          "finding_summary": "The unresolved historical mortgage record could affect recovery strategy or sequencing. MatterBridge cannot determine legal priority or enforceability from the available documents and external counsel review is required.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-08-20",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-013",
              "finding_id": "FIND-010",
              "source_type": "DOCUMENT",
              "source_id": "DOC-013",
              "source_section": "SEC-DOC-042",
              "citation_text": "Verification Requirement"
            },
            {
              "citation_id": "CITE-014",
              "finding_id": "FIND-010",
              "source_type": "LEGAL_ISSUE",
              "source_id": "ISSUE-010",
              "source_section": null,
              "citation_text": "Security verification affects recovery strategy and requires legal judgment"
            }
          ]
        }
      ],
      "decisions": []
    }
  ],
  "timeline": [
    {
      "timeline_id": "TM-013",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "event_date": "1998-09-14",
      "event_type": "TITLE_EVENT",
      "event_title": "Original Sale Deed",
      "event_description": "Property transferred to Western Engineering Works Private Limited",
      "related_document_id": "DOC-009",
      "created_date": "2025-08-20"
    },
    {
      "timeline_id": "TM-014",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "event_date": "2007-03-22",
      "event_type": "TITLE_EVENT",
      "event_title": "Conveyance to Meridian",
      "event_description": "Property conveyed to Meridian Components Private Limited",
      "related_document_id": "DOC-010",
      "created_date": "2025-08-20"
    },
    {
      "timeline_id": "TM-015",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "event_date": "2014-06-18",
      "event_type": "PRIOR_SECURITY",
      "event_title": "Prior Mortgage Created",
      "event_description": "Mortgage created in favour of Zenith Commercial Bank Limited",
      "related_document_id": "DOC-011",
      "created_date": "2025-08-20"
    },
    {
      "timeline_id": "TM-016",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "event_date": "2019-11-08",
      "event_type": "RELEASE_RECORD",
      "event_title": "Purported Release",
      "event_description": "Zenith Commercial Bank issued release and satisfaction letter; formal satisfaction evidence remains to be verified",
      "related_document_id": "DOC-012",
      "created_date": "2025-08-20"
    },
    {
      "timeline_id": "TM-001",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2024-03-15",
      "event_type": "AGREEMENT_EXECUTION",
      "event_title": "Facility Agreement Execution",
      "event_description": "Facility Agreement, Security Agreement, and Corporate Guarantee executed by all parties at Aster Fintech Limited office, Noida",
      "related_document_id": "DOC-001",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-003",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2024-03-18",
      "event_type": "SECURITY_CREATION",
      "event_title": "Property Mortgage Execution",
      "event_description": "Registered mortgage deed executed over commercial property at Andheri-Kurla Road, Mumbai before Sub-Registrar of Assurances, Mumbai",
      "related_document_id": "DOC-002",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-017",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "event_date": "2024-03-18",
      "event_type": "SECURITY_CREATION",
      "event_title": "Aster Mortgage Created",
      "event_description": "Property mortgaged in favour of Aster Fintech Limited",
      "related_document_id": "DOC-002",
      "created_date": "2025-08-20"
    },
    {
      "timeline_id": "TM-002",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2024-03-20",
      "event_type": "DISBURSEMENT",
      "event_title": "Loan Disbursement",
      "event_description": "Full facility amount of INR 15 crore disbursed to Borrower's account with HDFC Bank via NEFT",
      "related_document_id": "DOC-004",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-004",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2024-04-05",
      "event_type": "REGISTRATION",
      "event_title": "CERSAI Registration",
      "event_description": "Security interests registered with CERSAI (Registration Nos. CERSAI-2024-0315-789456 and CERSAI-2024-0315-789457)",
      "related_document_id": "DOC-002",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-005",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2024-06-01",
      "event_type": "REPAYMENT_DUE",
      "event_title": "First EMI Due",
      "event_description": "First equated monthly installment of INR 32,50,000 due and paid on time",
      "related_document_id": "DOC-004",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-006",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-03-01",
      "event_type": "REPAYMENT_RECEIVED",
      "event_title": "Last Timely Repayment",
      "event_description": "Tenth EMI of INR 32,50,000 paid on time. Total repaid to date: INR 3,25,00,000",
      "related_document_id": "DOC-004",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-007",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-04-01",
      "event_type": "DEFAULT_FIRST",
      "event_title": "First Payment Default",
      "event_description": "Eleventh EMI of INR 32,50,000 not received on due date. First instance of payment delay",
      "related_document_id": "DOC-004",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-008",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-07-01",
      "event_type": "DEFAULT_CONTINUING",
      "event_title": "Continuing Defaults",
      "event_description": "Four consecutive EMIs are now overdue for April, May, June and July 2025. Total scheduled overdue payments: INR 1,30,00,000 plus applicable interest.",
      "related_document_id": "DOC-004",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-009",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-07-10",
      "event_type": "LEGAL_NOTICE",
      "event_title": "Default Notice Issued",
      "event_description": "Formal default notice issued to Borrower under Clause 12 of Facility Agreement, invoking 30-day cure period",
      "related_document_id": "DOC-005",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-010",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-07-28",
      "event_type": "BORROWER_RESPONSE",
      "event_title": "Borrower Response Received",
      "event_description": "Borrower acknowledged default, explained financial distress, and requested loan restructuring",
      "related_document_id": "DOC-006",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-011",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-08-15",
      "event_type": "INTERNAL_ESCALATION",
      "event_title": "Credit Escalation to Legal",
      "event_description": "Credit Department escalated matter to Internal Legal with HIGH risk rating and recommendation for external counsel",
      "related_document_id": "DOC-007",
      "created_date": "2025-08-15"
    },
    {
      "timeline_id": "TM-018",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "event_date": "2025-08-19",
      "event_type": "SECURITY_SEARCH",
      "event_title": "Security Search Completed",
      "event_description": "Search confirms Aster security but identifies unresolved historical mortgage record",
      "related_document_id": "DOC-013",
      "created_date": "2025-08-20"
    },
    {
      "timeline_id": "TM-012",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "event_date": "2025-08-22",
      "event_type": "DECISION_EXTERNAL_COUNSEL",
      "event_title": "Decision to Engage External Counsel",
      "event_description": "Internal Legal approved engagement of external recovery counsel. Matter ready for counsel briefing",
      "related_document_id": "DOC-008",
      "created_date": "2025-08-22"
    }
  ],
  "issues": [
    {
      "issue_id": "ISSUE-001",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "issue_title": "Continuing Payment Default",
      "issue_description": "Borrower has failed to pay 5 consecutive monthly installments from April 2025 through August 2025 totaling INR 1,62,50,000 in scheduled EMIs, together with accrued and penal interest. The first payment default occurred on 2025-04-01 and remains uncured as of 2025-08-31.",
      "issue_status": "ACTIVE",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "NO",
      "created_date": "2025-08-15",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-002",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "issue_title": "Compliance with Contractual Notice Requirements",
      "issue_description": "Whether default notice dated 2025-07-10 was properly served in accordance with Clause 18.3 of Facility Agreement (notice requirements). Notice sent via registered post and email. Borrower acknowledged receipt in response dated 2025-07-28. Cure period of 30 days expired on 2025-08-09 without payment.",
      "issue_status": "ACTIVE",
      "issue_priority": "MEDIUM",
      "requires_legal_judgment": "NO",
      "created_date": "2025-08-15",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-003",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "issue_title": "Completeness of Security Package",
      "issue_description": "Security package comprises three securities: (a) mortgage over commercial property; (b) corporate guarantee; (c) charge over receivables. All securities appear to be documented. However, verification of CERSAI registration certificates, title deed custody, and prior encumbrances remains incomplete pending WS-002 Security Verification workstream.",
      "issue_status": "IN_PROGRESS",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "NO",
      "created_date": "2025-08-15",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-004",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "issue_title": "Guarantee Position Requiring Review",
      "issue_description": "Corporate guarantee executed by Rajesh Kumar Sharma for INR 15 crore plus interest. Guarantee is unconditional and irrevocable. However, guarantor's current financial position, net worth, and asset availability have not been assessed. Recommend verification before guarantee invocation.",
      "issue_status": "ACTIVE",
      "issue_priority": "MEDIUM",
      "requires_legal_judgment": "NO",
      "created_date": "2025-08-15",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-005",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "issue_title": "Appropriate Recovery/Enforcement Strategy",
      "issue_description": "Multiple recovery pathways potentially available: (a) SARFAESI Act enforcement (possession and sale of secured assets); (b) DRT application for recovery certificate; (c) IBC initiation if borrower insolvent; (d) civil suit. Optimal pathway depends on: security enforceability, borrower solvency, asset valuation, timeline, costs, and likelihood of recovery. REQUIRES_LEGAL_JUDGMENT by qualified counsel.",
      "issue_status": "ACTIVE",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-08-22",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-006",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "issue_title": "Security Verification Workstream Incomplete",
      "issue_description": "WS-002 Security Verification workstream remains in progress. Critical verification items pending: (a) title deed examination and ownership history; (b) prior mortgage/charge search; (c) CERSAI registration confirmation; (d) current property valuation; (e) receivables charge perfection status. Recovery strategy cannot be finalized until security verification complete.",
      "issue_status": "IN_PROGRESS",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "NO",
      "created_date": "2025-08-15",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-007",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "issue_title": "Prior Mortgage Requires Verification",
      "issue_description": "Historical title and security records show a mortgage created in 2014 in favour of Zenith Commercial Bank Limited. Available records indicate repayment but formal satisfaction evidence has not yet been conclusively verified.",
      "issue_status": "IN_PROGRESS",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-08-20",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-008",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "issue_title": "Release Documentation Incomplete",
      "issue_description": "A 2019 release letter exists, but available evidence does not include a corresponding certified satisfaction or registration record conclusively demonstrating discharge of the prior mortgage.",
      "issue_status": "IN_PROGRESS",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-08-20",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-009",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "issue_title": "Current Property Valuation Outdated",
      "issue_description": "The latest available property valuation is dated February 2024 and may not reflect current realizable value for recovery planning.",
      "issue_status": "ACTIVE",
      "issue_priority": "MEDIUM",
      "requires_legal_judgment": "NO",
      "created_date": "2025-08-20",
      "created_by": "USR-003"
    },
    {
      "issue_id": "ISSUE-010",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "issue_title": "Impact of Security Verification on Recovery Strategy",
      "issue_description": "Unresolved historical mortgage and release evidence may affect the timing, process or strategy for enforcement against the property. External counsel judgment is required before relying on the property as an immediately enforceable recovery asset.",
      "issue_status": "ACTIVE",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-08-20",
      "created_by": "USR-001"
    }
  ],
  "findings": [
    {
      "finding_id": "FIND-001",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "finding_type": "FACTUAL",
      "finding_title": "Payment Default Confirmed",
      "finding_summary": "Borrower has failed to pay 5 consecutive monthly installments from April 2025 through August 2025 totaling INR 1,62,50,000 in scheduled EMIs, together with accrued and penal interest. The first payment default occurred on 2025-04-01 and remains uncured as of 2025-08-31.",
      "confidence_level": "HIGH",
      "requires_verification": "NO",
      "created_date": "2025-08-31",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-001",
          "finding_id": "FIND-001",
          "source_type": "DOCUMENT",
          "source_id": "DOC-004",
          "source_section": "SEC-DOC-017",
          "citation_text": "Repayment Schedule vs Actuals section showing 5 EMIs overdue"
        },
        {
          "citation_id": "CITE-002",
          "finding_id": "FIND-001",
          "source_type": "DOCUMENT",
          "source_id": "DOC-006",
          "source_section": "SEC-DOC-022",
          "citation_text": "Borrower acknowledgment of default"
        }
      ]
    },
    {
      "finding_id": "FIND-002",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "finding_type": "EXPOSURE",
      "finding_title": "Outstanding Exposure Calculation",
      "finding_summary": "Total outstanding exposure as of 2025-08-31 is INR 12,40,00,000 comprising principal outstanding of INR 12,00,00,000, accrued interest of INR 37,30,000, and penal interest of INR 2,70,000.",
      "confidence_level": "HIGH",
      "requires_verification": "NO",
      "created_date": "2025-08-31",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-003",
          "finding_id": "FIND-002",
          "source_type": "DOCUMENT",
          "source_id": "DOC-004",
          "source_section": "SEC-DOC-018",
          "citation_text": "Outstanding Exposure Calculation section"
        }
      ]
    },
    {
      "finding_id": "FIND-003",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "finding_type": "DOCUMENTATION",
      "finding_title": "Security Package Appears Complete",
      "finding_summary": "Three securities documented: (a) property mortgage; (b) corporate guarantee; (c) receivables charge. All appear properly documented pending verification of registration certificates and title deeds.",
      "confidence_level": "MEDIUM",
      "requires_verification": "YES",
      "created_date": "2025-08-31",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-004",
          "finding_id": "FIND-003",
          "source_type": "DOCUMENT",
          "source_id": "DOC-002",
          "source_section": "SEC-DOC-007",
          "citation_text": "Security Package Description section"
        }
      ]
    },
    {
      "finding_id": "FIND-004",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "finding_type": "INFORMATION_GAP",
      "finding_title": "Current Collateral Valuation Missing",
      "finding_summary": "Last property valuation dated 2024-02 (pre-disbursement). Current market value unknown. Property values in Andheri-Kurla Road area may have appreciated 15-20% since 2024, but this requires confirmation.",
      "confidence_level": "MEDIUM",
      "requires_verification": "YES",
      "created_date": "2025-08-31",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-005",
          "finding_id": "FIND-004",
          "source_type": "DOCUMENT",
          "source_id": "DOC-007",
          "source_section": "SEC-DOC-028",
          "citation_text": "Information Gaps section noting valuation missing"
        }
      ]
    },
    {
      "finding_id": "FIND-005",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "finding_type": "INFORMATION_GAP",
      "finding_title": "Latest Borrower Financials Unavailable",
      "finding_summary": "Last audited financials available: FY2023-24. FY2024-25 financials not yet available. Borrower's current financial position and solvency status cannot be definitively assessed without updated financials.",
      "confidence_level": "MEDIUM",
      "requires_verification": "YES",
      "created_date": "2025-08-31",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-006",
          "finding_id": "FIND-005",
          "source_type": "DOCUMENT",
          "source_id": "DOC-007",
          "source_section": "SEC-DOC-028",
          "citation_text": "Information Gaps section noting latest financials unavailable"
        }
      ]
    },
    {
      "finding_id": "FIND-006",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "finding_type": "LEGAL_ISSUE",
      "finding_title": "Recovery Strategy Requires Legal Judgment",
      "finding_summary": "Optimal recovery pathway (SARFAESI vs. DRT vs. IBC) requires legal judgment based on: security enforceability, borrower solvency, asset valuation, timeline, costs, and recovery likelihood. Cannot be determined without external counsel advice.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-08-31",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-007",
          "finding_id": "FIND-006",
          "source_type": "LEGAL_ISSUE",
          "source_id": "ISSUE-005",
          "source_section": null,
          "citation_text": "Legal issue flagged as REQUIRES_LEGAL_JUDGMENT"
        }
      ]
    },
    {
      "finding_id": "FIND-007",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "finding_type": "SECURITY_VERIFICATION",
      "finding_title": "Prior Mortgage Identified",
      "finding_summary": "Title and security records identify a mortgage created in 2014 in favour of Zenith Commercial Bank Limited over AST-001.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-08-20",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-008",
          "finding_id": "FIND-007",
          "source_type": "DOCUMENT",
          "source_id": "DOC-011",
          "source_section": "SEC-DOC-037",
          "citation_text": "Prior Mortgage Creation"
        }
      ]
    },
    {
      "finding_id": "FIND-008",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "finding_type": "INFORMATION_GAP",
      "finding_title": "Formal Mortgage Satisfaction Not Confirmed",
      "finding_summary": "A 2019 release letter indicates repayment and release intent, but the available dataset does not contain conclusive registration evidence establishing formal satisfaction of the 2014 mortgage.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-08-20",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-009",
          "finding_id": "FIND-008",
          "source_type": "DOCUMENT",
          "source_id": "DOC-012",
          "source_section": "SEC-DOC-039",
          "citation_text": "Release Statement"
        },
        {
          "citation_id": "CITE-010",
          "finding_id": "FIND-008",
          "source_type": "DOCUMENT",
          "source_id": "DOC-012",
          "source_section": "SEC-DOC-040",
          "citation_text": "Verification Limitation"
        },
        {
          "citation_id": "CITE-011",
          "finding_id": "FIND-008",
          "source_type": "DOCUMENT",
          "source_id": "DOC-013",
          "source_section": "SEC-DOC-041",
          "citation_text": "Current Search Result"
        }
      ]
    },
    {
      "finding_id": "FIND-009",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "finding_type": "DOCUMENTATION",
      "finding_title": "Aster Mortgage Recorded",
      "finding_summary": "Current security records identify Aster Fintech Limited's 2024 mortgage over AST-001. This supports existence of the lender's claimed security, subject to counsel verification of priority and enforceability.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-08-20",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-012",
          "finding_id": "FIND-009",
          "source_type": "DOCUMENT",
          "source_id": "DOC-013",
          "source_section": "SEC-DOC-041",
          "citation_text": "Current Search Result"
        }
      ]
    },
    {
      "finding_id": "FIND-010",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "finding_type": "LEGAL_ISSUE",
      "finding_title": "Security Issue May Affect Recovery Strategy",
      "finding_summary": "The unresolved historical mortgage record could affect recovery strategy or sequencing. MatterBridge cannot determine legal priority or enforceability from the available documents and external counsel review is required.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-08-20",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-013",
          "finding_id": "FIND-010",
          "source_type": "DOCUMENT",
          "source_id": "DOC-013",
          "source_section": "SEC-DOC-042",
          "citation_text": "Verification Requirement"
        },
        {
          "citation_id": "CITE-014",
          "finding_id": "FIND-010",
          "source_type": "LEGAL_ISSUE",
          "source_id": "ISSUE-010",
          "source_section": null,
          "citation_text": "Security verification affects recovery strategy and requires legal judgment"
        }
      ]
    }
  ],
  "decisions": [
    {
      "decision_id": "DEC-001",
      "matter_id": "MAT-001",
      "workstream_id": "WS-001",
      "decision_type": "PROCESS",
      "decision_title": "Conditional Recovery Strategy",
      "decision_summary": "Internal Legal approved continued recovery preparation against Meridian Components while preserving multiple recovery routes. Material enforcement against the commercial property remains conditional on further treatment of the unresolved Zenith mortgage satisfaction issue or explicit documented acceptance of the residual risk.",
      "decision_status": "APPROVED_WITH_CONDITIONS",
      "decision_rationale": "Meridian Components remains in payment default with approximately INR 12.4 crore outstanding. Aster has multiple potential recovery routes and a security package comprising the commercial property, Corporate Guarantee, and charge over receivables. The unresolved Zenith mortgage/release issue creates uncertainty concerning reliance on the commercial property. External counsel considers the existing release evidence sufficient to progress enforcement preparation, but Internal Legal requires either further verification or explicit acceptance of the residual security risk before a material property-enforcement step. This approach allows recovery preparation to continue without treating an unresolved evidentiary issue as conclusively resolved.",
      "decision_date": "2025-09-16",
      "decided_by": "USR-001",
      "created_date": "2025-08-22",
      "selected_actions": [
        "Proceed with recovery preparation against Meridian Components while preserving multiple available recovery routes.",
        "Continue preparation relating to the secured recovery process without treating the Zenith release issue as conclusively resolved.",
        "Preserve recovery rights under the Corporate Guarantee.",
        "Obtain further analysis of guarantor recoverability and the receivables charge.",
        "Remain open to a commercially credible settlement without prejudicing existing recovery rights."
      ],
      "decision_factors": {
        "legal_risk": "MEDIUM-HIGH in relation to reliance on the commercial property until the Zenith issue is resolved or expressly accepted. Other recovery routes require separate assessment.",
        "recovery_probability": null,
        "cost": "Not yet sufficiently established. External legal and enforcement costs depend on the routes pursued and whether proceedings become contested.",
        "timeline": "Not fixed. Timing depends on security verification, procedural requirements, borrower response, enforcement route, and any contested proceedings.",
        "commercial_considerations": "A commercially credible settlement proposal may be considered. Settlement discussions should not unnecessarily prejudice Aster's recovery rights.",
        "process_legal_considerations": "Before material enforcement action, confirm applicable procedural prerequisites, complete required security verification, document Internal Legal's treatment of any remaining Zenith risk, and obtain required internal approvals."
      },
      "alternatives_considered": [
        {
          "alternative": "Proceed against the commercial property based solely on counsel's current opinion.",
          "decision": "NOT_SELECTED_AT_THIS_STAGE",
          "reason": "Internal evidence still contains an unresolved verification gap relating to the historical Zenith mortgage."
        },
        {
          "alternative": "Pause the entire recovery matter until the Zenith issue is completely resolved.",
          "decision": "NOT_SELECTED",
          "reason": "Uncertainty affecting one security asset does not require Aster to stop assessment or preservation of its other recovery routes."
        },
        {
          "alternative": "Pursue settlement as the sole strategy.",
          "decision": "NOT_SELECTED",
          "reason": "Settlement may be considered, but Aster should preserve its enforcement and recovery options."
        },
        {
          "alternative": "Conditional multi-route recovery strategy.",
          "decision": "SELECTED",
          "reason": "Recovery preparation can continue while the property-enforcement decision remains conditional on further treatment of the Zenith security issue."
        }
      ],
      "follow_up_actions": [
        {
          "action_id": "DEC001-ACT-001",
          "action": "Request further clarification from external counsel regarding the Zenith release conclusion.",
          "owner": "Internal Legal / External Counsel",
          "status": "OPEN"
        },
        {
          "action_id": "DEC001-ACT-002",
          "action": "Seek additional evidence of Zenith mortgage satisfaction where available.",
          "owner": "Internal Legal / External Counsel",
          "status": "OPEN"
        },
        {
          "action_id": "DEC001-ACT-003",
          "action": "Assess guarantor financial position and practical recoverability.",
          "owner": "External Counsel / Internal Legal",
          "status": "OPEN"
        },
        {
          "action_id": "DEC001-ACT-004",
          "action": "Obtain substantive analysis of the charge over receivables.",
          "owner": "External Counsel",
          "status": "OPEN"
        },
        {
          "action_id": "DEC001-ACT-005",
          "action": "Continue recovery preparation while preserving available recovery rights.",
          "owner": "Internal Legal / Recovery Team",
          "status": "IN_PROGRESS"
        }
      ],
      "decision_finality": "PROVISIONAL / APPROVED WITH CONDITIONS"
    }
  ],
  "institutional_memory": {
    "outcome_status": "OPEN",
    "knowledge_items": [
      {
        "knowledge_item_id": "MEM-001",
        "knowledge_item_title": "Security Evidence and External Counsel Disagreement",
        "context": "External counsel considered the existing Zenith release evidence sufficient to progress enforcement preparation, while internal company evidence continued to classify the historical mortgage discharge as requiring verification.",
        "lesson": "Where external counsel's conclusion differs from the company's existing evidence or treatment of a material security issue, surface both positions and require Internal Legal to explicitly resolve or accept the difference.",
        "use_when": "External advice materially differs from existing company evidence, prior legal treatment, or relevant historical precedent.",
        "matter_application": "Internal Legal did not automatically adopt counsel's Zenith conclusion and retained a verification requirement.",
        "relevant_historical_matter_ids": ["HM-002", "HM-004"],
        "source_ids": ["OUT-001", "REVIEW-001", "DEC-001", "DOC-011", "DOC-012", "DOC-013"]
      },
      {
        "knowledge_item_id": "MEM-002",
        "knowledge_item_title": "Uncertainty in One Recovery Route Does Not Necessarily Stop the Entire Matter",
        "context": "The Zenith issue affects reliance on the commercial property but does not automatically eliminate the Corporate Guarantee, receivables charge, or other recovery options.",
        "lesson": "A material issue affecting one security asset should be assessed independently from other available contractual or recovery rights.",
        "use_when": "A particular asset or security instrument requires further verification while other recovery mechanisms remain available.",
        "matter_application": "Aster continued recovery preparation and preserved multiple routes while keeping property enforcement conditional.",
        "relevant_historical_matter_ids": ["HM-001", "HM-002", "HM-003", "HM-004"],
        "source_ids": ["ISSUE-003", "ISSUE-005", "DEC-001"]
      },
      {
        "knowledge_item_id": "MEM-003",
        "knowledge_item_title": "External Counsel Advice Requires Internal Decision Ownership",
        "context": "External counsel advice is an input into the company's legal decision, not the final company decision itself.",
        "lesson": "Internal Legal should record whether counsel advice was accepted, accepted with conditions, rejected, escalated, or subjected to further verification.",
        "use_when": "External counsel provides advice on a material matter requiring an internal legal or business decision.",
        "matter_application": "Counsel's Zenith conclusion was not automatically adopted. Internal Legal approved a conditional strategy and retained the verification requirement.",
        "relevant_historical_matter_ids": ["HM-004"],
        "source_ids": ["OUT-001", "REVIEW-001", "DEC-001"]
      }
    ],
    "future_outcome_fields": {
      "recovery_route": null,
      "zenith_satisfaction_verified": null,
      "property_enforced": null,
      "guarantee_invoked": null,
      "receivables_charge_recovery": null,
      "settlement": null,
      "final_recovery_result": null,
      "material_external_legal_cost": null,
      "total_duration": null,
      "procedural_obstacles": null,
      "strategy_effectiveness": null
    }
  },
  "access": [
    {
      "access_id": "ACC-001",
      "matter_id": "MAT-001",
      "user_id": "USR-001",
      "access_level": "OWNER",
      "granted_date": "2025-08-15",
      "granted_by": "USR-004",
      "user": {
        "user_id": "USR-001",
        "user_name": "Aditya Malhotra",
        "user_email": "aditya.malhotra@asterfintech.in",
        "user_role": "LEGAL_COUNSEL",
        "department": "Legal",
        "user_status": "ACTIVE",
        "created_date": "2024-01-01"
      }
    },
    {
      "access_id": "ACC-002",
      "matter_id": "MAT-001",
      "user_id": "USR-003",
      "access_level": "EDIT",
      "granted_date": "2025-08-15",
      "granted_by": "USR-001",
      "user": {
        "user_id": "USR-003",
        "user_name": "Rahul Verma",
        "user_email": "rahul.verma@asterfintech.in",
        "user_role": "CREDIT_MANAGER",
        "department": "Credit",
        "user_status": "ACTIVE",
        "created_date": "2024-01-01"
      }
    },
    {
      "access_id": "ACC-003",
      "matter_id": "MAT-001",
      "user_id": "USR-004",
      "access_level": "VIEW",
      "granted_date": "2025-08-15",
      "granted_by": "USR-001",
      "user": {
        "user_id": "USR-004",
        "user_name": "Kavita Reddy",
        "user_email": "kavita.reddy@asterfintech.in",
        "user_role": "LEGAL_HEAD",
        "department": "Legal",
        "user_status": "ACTIVE",
        "created_date": "2024-01-01"
      }
    }
  ],
  "counsel_engagements": [
    {
      "engagement_id": "ENG-001",
      "matter_id": "MAT-001",
      "counsel_id": "COUN-001",
      "engagement_type": "RECOVERY_COUNSEL",
      "engagement_status": "ENGAGED",
      "engagement_date": "2025-08-25",
      "engagement_description": "External recovery counsel engaged to review recovery strategy, security position and enforcement options",
      "budget_inr": 800000,
      "created_date": "2025-08-22",
      "counsel": {
        "counsel_id": "COUN-001",
        "counsel_name": "Adv. Sunita Rajani",
        "counsel_type": "EXTERNAL",
        "firm_name": "Rajani & Associates",
        "email": "sunita.rajani@rajaniassociates.in",
        "phone": "+91-22-22881234",
        "specialization": "Banking, SARFAESI, DRT",
        "counsel_status": "PREFERRED"
      },
      "briefs": [
        {
          "brief_id": "BRIEF-001",
          "engagement_id": "ENG-001",
          "brief_title": "Recovery and Security Strategy Brief",
          "brief_date": "2025-08-25",
          "brief_status": "ISSUED",
          "created_date": "2025-08-22",
          "created_by": "USR-001",
          "questions": [
            {
              "question_id": "Q-001",
              "brief_id": "BRIEF-001",
              "question_text": "Based on the facts and documentation provided, what is the optimal recovery pathway: SARFAESI enforcement, DRT application, or IBC initiation? Please provide comparative analysis of timeline, costs, and likelihood of recovery for each option.",
              "question_category": "STRATEGY",
              "question_priority": "HIGH",
              "created_date": "2025-08-22"
            },
            {
              "question_id": "Q-002",
              "brief_id": "BRIEF-001",
              "question_text": "Please confirm whether all security documents are properly executed, registered, and enforceable. Identify any gaps or defects in documentation or registration that could impede enforcement.",
              "question_category": "DOCUMENTATION",
              "question_priority": "HIGH",
              "created_date": "2025-08-22"
            },
            {
              "question_id": "Q-003",
              "brief_id": "BRIEF-001",
              "question_text": "What are the specific steps, timeline, and estimated costs for SARFAESI enforcement including possession notice, physical possession, and sale of secured assets?",
              "question_category": "PROCEDURE",
              "question_priority": "HIGH",
              "created_date": "2025-08-22"
            },
            {
              "question_id": "Q-004",
              "brief_id": "BRIEF-001",
              "question_text": "Should the corporate guarantee be invoked simultaneously with enforcement against the Borrower? What are the advantages and risks of this approach?",
              "question_category": "GUARANTEE",
              "question_priority": "MEDIUM",
              "created_date": "2025-08-22"
            },
            {
              "question_id": "Q-005",
              "brief_id": "BRIEF-001",
              "question_text": "What is the risk of the Borrower initiating pre-emptive proceedings under IBC or NCLT? How should we mitigate this risk?",
              "question_category": "RISK",
              "question_priority": "MEDIUM",
              "created_date": "2025-08-22"
            },
            {
              "question_id": "Q-006",
              "brief_id": "BRIEF-001",
              "question_text": "Please assess whether the unresolved historical mortgage and incomplete satisfaction evidence relating to the commercial property affects priority, enforceability or sequencing of recovery action against that asset.",
              "question_category": "SECURITY",
              "question_priority": "HIGH",
              "created_date": "2025-08-25"
            }
          ]
        }
      ],
      "outputs": [
        {
          "output_id": "OUT-001",
          "engagement_id": "ENG-001",
          "brief_id": "BRIEF-001",
          "output_type": "LEGAL_OPINION",
          "output_date": "2025-09-12",
          "output_status": "RECEIVED",
          "created_date": "2025-08-22",
          "opinion_summary": "Counsel considers Aster Fintech to have viable recovery options against Meridian Components based on the facility documentation, payment default, and existing security package. Counsel recommends progressing secured enforcement while preserving other recovery routes, including recovery against the corporate guarantor. Counsel considers the existing commercial-property documentation sufficient to begin enforcement preparation, while noting that the historical Zenith mortgage issue may still warrant additional verification and that no final title opinion is provided.",
          "opinion_sections": [
            {
              "opinion_section_id": "OPSEC-001",
              "section_type": "OVERALL_ADVICE",
              "section_title": "Overall Counsel Advice",
              "section_summary": "Aster has viable recovery options. Secured enforcement should progress as the principal strategy while preserving guarantee, debt-recovery, insolvency-related, and commercially credible settlement routes. Counsel does not provide a final title opinion.",
              "source_document_ids": ["DOC-001", "DOC-002", "DOC-003", "DOC-004"]
            },
            {
              "opinion_section_id": "OPSEC-002",
              "section_type": "RECOVERY_PATHWAY",
              "section_title": "Recovery Pathway",
              "section_summary": "Progress secured recovery/enforcement as the principal current strategy. Other recovery mechanisms remain available depending on the borrower's position and developments. Settlement may be considered if a commercially credible proposal preserves Aster's recovery rights.",
              "source_document_ids": ["DOC-004", "DOC-005", "DOC-006"]
            },
            {
              "opinion_section_id": "OPSEC-003",
              "section_type": "SECURITY_ENFORCEABILITY",
              "section_title": "Security Enforceability",
              "section_summary": "The commercial property, Corporate Guarantee, and charge over receivables are capable of supporting a recovery strategy based on the documents reviewed. The property security is sufficiently documented to progress enforcement preparation, subject to applicable legal and procedural requirements.",
              "source_document_ids": ["DOC-002", "DOC-003"]
            },
            {
              "opinion_section_id": "OPSEC-004",
              "section_type": "ZENITH_PRIOR_MORTGAGE",
              "section_title": "Zenith Prior Mortgage / Release Issue",
              "section_summary": "Counsel reviewed DOC-011, DOC-012, and DOC-013 and considers the available Release and Satisfaction Letter, together with current records, sufficient to progress enforcement preparation. Additional formal historical satisfaction evidence is not treated as a prerequisite, although further verification may remain appropriate during enforcement.",
              "source_document_ids": ["DOC-011", "DOC-012", "DOC-013"],
              "source_section_ids": ["SEC-DOC-037", "SEC-DOC-039", "SEC-DOC-040", "SEC-DOC-041", "SEC-DOC-042"]
            },
            {
              "opinion_section_id": "OPSEC-005",
              "section_type": "CORPORATE_GUARANTEE",
              "section_title": "Corporate Guarantee",
              "section_summary": "The Corporate Guarantee should be preserved as an additional recovery route and may be invoked in parallel with secured recovery where commercially appropriate. The opinion does not substantively assess the guarantor's current financial position, available assets, or practical recoverability.",
              "source_document_ids": ["DOC-003"]
            },
            {
              "opinion_section_id": "OPSEC-006",
              "section_type": "RECEIVABLES_CHARGE",
              "section_title": "Charge over Receivables",
              "section_summary": "The receivables charge forms part of the security package, but the opinion provides limited analysis of the current receivables pool, realizable value, competing claims, and practical enforcement steps.",
              "source_document_ids": ["DOC-002"]
            },
            {
              "opinion_section_id": "OPSEC-007",
              "section_type": "TIMING_COST_RISK",
              "section_title": "Timing, Cost, and Recovery Risks",
              "section_summary": "Timing depends on borrower challenge, procedural requirements, security challenges, asset realization, and parallel proceedings. No reliable fixed completion date or final cost estimate is provided. Risks include enforcement challenge, procedural delay, asset-realization uncertainty, further security investigation, guarantor uncertainty, and parallel proceedings."
            }
          ],
          "review_points": [
            {
              "review_point_id": "REVIEW-001",
              "review_title": "Prior Position Conflict — Zenith Mortgage Release",
              "review_type": "PRIOR_POSITION_CONFLICT",
              "severity": "HIGH",
              "counsel_position": "Counsel considers the Zenith Release and Satisfaction Letter, together with current records, sufficient to progress enforcement preparation without first obtaining additional formal evidence of historical satisfaction.",
              "matterbridge_review": "The company's existing evidence continues to identify the Zenith release as requiring verification. DOC-012 is not currently treated internally as conclusive evidence that the historical mortgage was formally satisfied. Relevant company evidence and historical precedent indicate that material ambiguity concerning a prior security interest should be resolved or explicitly accepted by Legal before relying on the affected asset as a primary enforcement route. MatterBridge should not conclude that external counsel is wrong; it should surface the difference between counsel's position, current company evidence, and relevant historical precedent.",
              "recommended_action": "ASK_COUNSEL",
              "suggested_question": "What specific evidence supports treating the 2019 Release and Satisfaction Letter as sufficient despite the company's current verification gap, and what enforcement risk remains if formal satisfaction evidence cannot be obtained?",
              "counsel_source_ids": ["OUT-001", "OPSEC-004"],
              "company_source_ids": ["DOC-012", "DOC-013", "HM-004"],
              "company_source_section_ids": ["SEC-DOC-039", "SEC-DOC-040", "SEC-DOC-041", "SEC-DOC-042"]
            },
            {
              "review_point_id": "REVIEW-002",
              "review_title": "Missing Issue — Guarantor Recoverability",
              "review_type": "MISSING_ISSUE",
              "severity": "MEDIUM",
              "counsel_position": "The Corporate Guarantee should be preserved as a parallel recovery route.",
              "matterbridge_review": "The opinion does not substantively assess the guarantor's current financial position, identifiable assets, or practical recoverability. The legal availability of a guarantee does not by itself establish its commercial recovery value.",
              "recommended_action": "ASK_COUNSEL",
              "suggested_question": "Please assess the guarantor's current financial position and practical recovery prospects before Aster commits material resources to guarantee enforcement.",
              "counsel_source_ids": ["OUT-001", "OPSEC-005"],
              "company_source_ids": ["DOC-003", "ISSUE-004"]
            },
            {
              "review_point_id": "REVIEW-003",
              "review_title": "Missing Analysis — Receivables Charge",
              "review_type": "MISSING_ISSUE",
              "severity": "MEDIUM",
              "counsel_position": "The charge over receivables forms part of the available security package.",
              "matterbridge_review": "The opinion does not materially analyze the current receivables pool, realizable value, competing claims, or practical enforcement considerations.",
              "recommended_action": "REQUEST_FURTHER_ANALYSIS",
              "suggested_question": "Please assess the current status and practical enforceability of the receivables charge, including the available receivables pool and any known competing claims.",
              "counsel_source_ids": ["OUT-001", "OPSEC-006"],
              "company_source_ids": ["DOC-002", "ISSUE-003"]
            },
            {
              "review_point_id": "REVIEW-004",
              "review_title": "Source Verification — Zenith Release Conclusion",
              "review_type": "VERIFY_EVIDENCE",
              "severity": "HIGH",
              "counsel_assertion": "The existing release documentation and current records provide sufficient basis to progress enforcement.",
              "matterbridge_review": "This conclusion depends materially on the interpretation of the historical Zenith release evidence. The underlying source should remain directly visible to the internal lawyer reviewing counsel's conclusion.",
              "recommended_action": "VERIFY_SOURCE",
              "counsel_source_ids": ["OUT-001", "OPSEC-004"],
              "company_source_ids": ["DOC-011", "DOC-012", "DOC-013"],
              "company_source_section_ids": ["SEC-DOC-037", "SEC-DOC-039", "SEC-DOC-040", "SEC-DOC-041", "SEC-DOC-042"]
            }
          ]
        }
      ]
    }
  ],
  "assets": [
    {
      "matter_asset": {
        "matter_asset_id": "MA-001",
        "matter_id": "MAT-001",
        "asset_id": "AST-001",
        "security_interest_id": "SEC-001",
        "created_date": "2025-08-15"
      },
      "asset": {
        "asset_id": "AST-001",
        "asset_type": "COMMERCIAL_PROPERTY",
        "asset_name": "Commercial Property - Mumbai",
        "asset_description": "Commercial property located at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059. Built-up area: 12,500 sq ft. Current use: Manufacturing and warehouse facility.",
        "asset_status": "VERIFICATION_PENDING",
        "created_date": "2025-08-15",
        "created_by": "USR-001"
      },
      "security_interest": {
        "security_interest_id": "SEC-001",
        "security_type": "MORTGAGE",
        "security_description": "First mortgage by way of registered mortgage deed over commercial property at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059",
        "registration_number": "CERSAI-2024-0315-789456",
        "registration_date": "2024-04-05",
        "registration_authority": "CERSAI",
        "security_value_inr": 180000000,
        "created_date": "2024-03-18"
      },
      "documents": [
        {
          "asset_document": {
            "asset_document_id": "AD-001",
            "asset_id": "AST-001",
            "document_id": "DOC-009",
            "relationship_type": "TITLE_DOCUMENT",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-009",
            "matter_id": "MAT-001",
            "workstream_id": "WS-002",
            "document_title": "Sale Deed - Commercial Property",
            "document_type": "TITLE_DEED",
            "document_date": "1998-09-14",
            "document_source": "TITLE_RECORDS",
            "document_status": "FINAL",
            "created_date": "2025-08-20",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-033",
                "document_id": "DOC-009",
                "section_title": "Property Transfer",
                "section_content": "Under Sale Deed dated 1998-09-14, Shakti Industrial Estates Private Limited transferred the commercial property identified as Plot No. 45, Andheri-Kurla Road, Mumbai to Western Engineering Works Private Limited for stated consideration.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-034",
                "document_id": "DOC-009",
                "section_title": "Property Description",
                "section_content": "The property comprises approximately 12,500 square feet of built-up industrial and commercial premises together with associated land and appurtenant rights.",
                "section_order": 2
              }
            ]
          }
        },
        {
          "asset_document": {
            "asset_document_id": "AD-002",
            "asset_id": "AST-001",
            "document_id": "DOC-010",
            "relationship_type": "TITLE_DOCUMENT",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-010",
            "matter_id": "MAT-001",
            "workstream_id": "WS-002",
            "document_title": "Conveyance Deed - Commercial Property",
            "document_type": "CONVEYANCE_DEED",
            "document_date": "2007-03-22",
            "document_source": "TITLE_RECORDS",
            "document_status": "FINAL",
            "created_date": "2025-08-20",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-035",
                "document_id": "DOC-010",
                "section_title": "2007 Conveyance",
                "section_content": "Western Engineering Works Private Limited conveyed the property to Meridian Components Private Limited pursuant to a restructuring transaction documented by Conveyance Deed dated 2007-03-22.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-036",
                "document_id": "DOC-010",
                "section_title": "Ownership Representation",
                "section_content": "The conveyance records Meridian Components Private Limited as transferee and states that the property is transferred together with all rights, easements and interests held by the transferor.",
                "section_order": 2
              }
            ]
          }
        },
        {
          "asset_document": {
            "asset_document_id": "AD-003",
            "asset_id": "AST-001",
            "document_id": "DOC-011",
            "relationship_type": "PRIOR_SECURITY",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-011",
            "matter_id": "MAT-001",
            "workstream_id": "WS-002",
            "document_title": "Prior Mortgage Deed - Zenith Commercial Bank",
            "document_type": "MORTGAGE_DEED",
            "document_date": "2014-06-18",
            "document_source": "TITLE_RECORDS",
            "document_status": "FINAL",
            "created_date": "2025-08-20",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-037",
                "document_id": "DOC-011",
                "section_title": "Prior Mortgage Creation",
                "section_content": "Meridian Components Private Limited created a mortgage over the commercial property in favour of Zenith Commercial Bank Limited on 2014-06-18 to secure working capital facilities up to INR 9 crore.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-038",
                "document_id": "DOC-011",
                "section_title": "Release Requirement",
                "section_content": "The mortgage deed provides that the security shall continue until all secured obligations to Zenith Commercial Bank Limited are discharged and appropriate release documentation is issued.",
                "section_order": 2
              }
            ]
          }
        },
        {
          "asset_document": {
            "asset_document_id": "AD-004",
            "asset_id": "AST-001",
            "document_id": "DOC-012",
            "relationship_type": "RELEASE_DOCUMENT",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-012",
            "matter_id": "MAT-001",
            "workstream_id": "WS-002",
            "document_title": "Release and Satisfaction Letter",
            "document_type": "RELEASE_DOCUMENT",
            "document_date": "2019-11-08",
            "document_source": "BORROWER_RECORDS",
            "document_status": "VERIFICATION_REQUIRED",
            "created_date": "2025-08-20",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-039",
                "document_id": "DOC-012",
                "section_title": "Release Statement",
                "section_content": "The letter states that credit facilities extended by Zenith Commercial Bank Limited to Meridian Components Private Limited were repaid and that the bank has no objection to release of security over the property.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-040",
                "document_id": "DOC-012",
                "section_title": "Verification Limitation",
                "section_content": "The available release letter does not contain a corresponding registration endorsement or certified satisfaction record confirming removal of the 2014 mortgage from all relevant security and property records.",
                "section_order": 2
              }
            ]
          }
        },
        {
          "asset_document": {
            "asset_document_id": "AD-005",
            "asset_id": "AST-001",
            "document_id": "DOC-013",
            "relationship_type": "SECURITY_SEARCH",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-013",
            "matter_id": "MAT-001",
            "workstream_id": "WS-002",
            "document_title": "Current Security and Encumbrance Search",
            "document_type": "SECURITY_SEARCH",
            "document_date": "2025-08-19",
            "document_source": "LEGAL_SEARCH",
            "document_status": "FINAL",
            "created_date": "2025-08-20",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-041",
                "document_id": "DOC-013",
                "section_title": "Current Search Result",
                "section_content": "The current search identifies Aster Fintech Limited's mortgage registered in 2024. Historical records also reference the 2014 Zenith Commercial Bank mortgage. The materials reviewed do not contain conclusive evidence confirming formal satisfaction of that earlier mortgage.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-042",
                "document_id": "DOC-013",
                "section_title": "Verification Requirement",
                "section_content": "External property counsel should confirm whether additional registry records, charge-satisfaction filings or lender confirmations are required to establish discharge of the earlier security interest.",
                "section_order": 2
              }
            ]
          }
        },
        {
          "asset_document": {
            "asset_document_id": "AD-006",
            "asset_id": "AST-001",
            "document_id": "DOC-014",
            "relationship_type": "VALUATION",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-014",
            "matter_id": "MAT-001",
            "workstream_id": "WS-002",
            "document_title": "Property Valuation Report",
            "document_type": "VALUATION_REPORT",
            "document_date": "2024-02-12",
            "document_source": "VALUER",
            "document_status": "FINAL",
            "created_date": "2025-08-20",
            "created_by": "USR-003",
            "sections": [
              {
                "section_id": "SEC-DOC-043",
                "document_id": "DOC-014",
                "section_title": "Valuation Conclusion",
                "section_content": "The February 2024 valuation assessed the property at approximately INR 18 crore based on prevailing comparable transactions and existing property use.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-044",
                "document_id": "DOC-014",
                "section_title": "Valuation Limitation",
                "section_content": "The report predates the current recovery assessment and should not be treated as evidence of current realizable value. An updated valuation is recommended before enforcement strategy is finalized.",
                "section_order": 2
              }
            ]
          }
        }
      ]
    },
    {
      "matter_asset": {
        "matter_asset_id": "MA-002",
        "matter_id": "MAT-001",
        "asset_id": "AST-002",
        "security_interest_id": "SEC-002",
        "created_date": "2025-08-15"
      },
      "asset": {
        "asset_id": "AST-002",
        "asset_type": "CORPORATE_GUARANTEE",
        "asset_name": "Corporate Guarantee - Rajesh Kumar Sharma",
        "asset_description": "Unconditional and irrevocable corporate guarantee executed by Rajesh Kumar Sharma in favor of Aster Fintech Limited.",
        "asset_status": "ACTIVE",
        "created_date": "2025-08-15",
        "created_by": "USR-001"
      },
      "security_interest": {
        "security_interest_id": "SEC-002",
        "security_type": "GUARANTEE",
        "security_description": "Unconditional and irrevocable guarantee by Rajesh Kumar Sharma for INR 15 crore plus interest and costs",
        "registration_number": null,
        "registration_date": null,
        "registration_authority": null,
        "security_value_inr": 150000000,
        "created_date": "2024-03-15"
      },
      "documents": [
        {
          "asset_document": {
            "asset_document_id": "AD-007",
            "asset_id": "AST-002",
            "document_id": "DOC-003",
            "relationship_type": "GUARANTEE_DOCUMENT",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-003",
            "matter_id": "MAT-001",
            "workstream_id": "WS-001",
            "document_title": "Corporate Guarantee",
            "document_type": "GUARANTEE_DEED",
            "document_date": "2024-03-15",
            "document_source": "LENDER_ORIGINATION",
            "document_status": "FINAL",
            "created_date": "2025-08-15",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-012",
                "document_id": "DOC-003",
                "section_title": "Guarantee Obligations",
                "section_content": "The Guarantor hereby unconditionally and irrevocably guarantees to the Lender the due and punctual payment and discharge of all obligations and liabilities of the Borrower under the Facility Agreement. This guarantee is a continuing guarantee and shall extend to the ultimate balance of sums payable by the Borrower, regardless of any intermediate payment or discharge.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-013",
                "document_id": "DOC-003",
                "section_title": "Guarantee Amount and Scope",
                "section_content": "This guarantee covers principal amount up to INR 15,00,00,000 (Indian Rupees Fifteen Crore Only) together with interest, penal interest, costs, charges, and expenses. The Guarantor's liability shall be that of a principal debtor and shall not be affected by any change in the constitution of the Borrower or the Lender, or by any forbearance or variation made by the Lender.",
                "section_order": 2
              },
              {
                "section_id": "SEC-DOC-014",
                "document_id": "DOC-003",
                "section_title": "Invocation of Guarantee",
                "section_content": "The Lender may invoke this guarantee at any time after the occurrence of an event of default under the Facility Agreement. The Guarantor shall pay the Lender within 7 (seven) days of receipt of written demand. The Guarantor waives all rights to require the Lender to first proceed against the Borrower or any other person or to enforce any other security before claiming against the Guarantor.",
                "section_order": 3
              },
              {
                "section_id": "SEC-DOC-015",
                "document_id": "DOC-003",
                "section_title": "Continuing Liability",
                "section_content": "This guarantee shall remain in full force and effect until all obligations of the Borrower are fully discharged. The Guarantor shall not revoke this guarantee without prior written consent of the Lender. The death, insolvency, or incapacity of the Guarantor shall not terminate this guarantee, and the Guarantor's legal heirs and estate shall remain liable.",
                "section_order": 4
              }
            ]
          }
        }
      ]
    },
    {
      "matter_asset": {
        "matter_asset_id": "MA-003",
        "matter_id": "MAT-001",
        "asset_id": "AST-003",
        "security_interest_id": "SEC-003",
        "created_date": "2025-08-15"
      },
      "asset": {
        "asset_id": "AST-003",
        "asset_type": "CHARGE_RECEIVABLES",
        "asset_name": "Charge over Receivables",
        "asset_description": "First pari passu charge over all present and future book debts and receivables of Meridian Components Private Limited.",
        "asset_status": "VERIFICATION_PENDING",
        "created_date": "2025-08-15",
        "created_by": "USR-001"
      },
      "security_interest": {
        "security_interest_id": "SEC-003",
        "security_type": "CHARGE",
        "security_description": "First pari passu charge over all present and future book debts and receivables",
        "registration_number": "CERSAI-2024-0315-789457",
        "registration_date": "2024-04-05",
        "registration_authority": "CERSAI",
        "security_value_inr": 50000000,
        "created_date": "2024-03-18"
      },
      "documents": [
        {
          "asset_document": {
            "asset_document_id": "AD-008",
            "asset_id": "AST-003",
            "document_id": "DOC-002",
            "relationship_type": "SECURITY_DOCUMENT",
            "created_date": "2025-08-20"
          },
          "document": {
            "document_id": "DOC-002",
            "matter_id": "MAT-001",
            "workstream_id": "WS-001",
            "document_title": "Security Agreement",
            "document_type": "SECURITY_DOCUMENT",
            "document_date": "2024-03-15",
            "document_source": "LENDER_ORIGINATION",
            "document_status": "FINAL",
            "created_date": "2025-08-15",
            "created_by": "USR-001",
            "sections": [
              {
                "section_id": "SEC-DOC-007",
                "document_id": "DOC-002",
                "section_title": "Security Package Description",
                "section_content": "The Borrower and third parties have created the following security package in favor of the Lender: (a) First mortgage by way of registered mortgage deed over commercial property at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059, bearing municipal no. A-45/2019, built-up area 12,500 sq ft; (b) Unconditional and irrevocable corporate guarantee by Rajesh Kumar Sharma; (c) First pari passu charge over all present and future book debts and receivables of the Borrower.",
                "section_order": 1
              },
              {
                "section_id": "SEC-DOC-008",
                "document_id": "DOC-002",
                "section_title": "Security Creation and Perfection",
                "section_content": "All security interests shall be created and perfected in accordance with applicable laws. The mortgage shall be registered with the Sub-Registrar of Assurances within 4 (four) months of execution. All charges shall be registered with CERSAI within 30 (thirty) days of creation. The Borrower shall execute all documents and do all acts necessary for creation, perfection, and registration of security interests.",
                "section_order": 2
              },
              {
                "section_id": "SEC-DOC-009",
                "document_id": "DOC-002",
                "section_title": "CERSAI Registration",
                "section_content": "The Borrower acknowledges that all security interests created in favor of the Lender shall be registered with the Central Registry of Securitisation Asset Reconstruction and Security Interest of India (CERSAI) in accordance with Section 20 of the SARFAESI Act, 2002. The Borrower authorizes the Lender to file necessary forms and particulars with CERSAI. All registration fees and costs shall be borne by the Borrower.",
                "section_order": 3
              },
              {
                "section_id": "SEC-DOC-010",
                "document_id": "DOC-002",
                "section_title": "Representations Regarding Security",
                "section_content": "The Borrower represents and warrants that: (a) it has clear, marketable, and encumbrance-free title to the mortgaged property except for prior charges disclosed in writing; (b) the property is free from all litigation, attachment, or encumbrance; (c) all documents relating to the property are genuine and valid; (d) no prior mortgage, charge, or lien exists on the property except as disclosed. Any breach of representations shall constitute an event of default.",
                "section_order": 4
              },
              {
                "section_id": "SEC-DOC-011",
                "document_id": "DOC-002",
                "section_title": "Enforcement of Security",
                "section_content": "Upon enforcement, the Lender shall be entitled to take all measures permitted by law including: (a) taking possession of secured assets; (b) sale or lease of secured assets by public auction or private treaty; (c) appointment of a manager or receiver; (d) recovery from guarantors; (e) recovery from receivables debtors. The Borrower shall not create any further charge or encumbrance on secured assets without prior written consent of the Lender.",
                "section_order": 5
              }
            ]
          }
        }
      ]
    }
  ],
  "company_policies": [
    {
      "policy_id": "POL-001",
      "policy_name": "Credit Risk Management Policy",
      "policy_category": "CREDIT",
      "policy_description": "Framework for credit assessment, risk rating, monitoring, and escalation of credit facilities",
      "effective_date": "2023-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-002",
      "policy_name": "Legal Matter Escalation Policy",
      "policy_category": "LEGAL",
      "policy_description": "Criteria and process for escalation of matters from business/credit to internal legal and external counsel",
      "effective_date": "2023-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-003",
      "policy_name": "Security Documentation Standards",
      "policy_category": "CREDIT",
      "policy_description": "Minimum requirements for security documentation, registration, and perfection for secured lending",
      "effective_date": "2023-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-004",
      "policy_name": "Recovery and Enforcement Policy",
      "policy_category": "RECOVERY",
      "policy_description": "Guidelines for recovery actions, enforcement of security, and engagement of external recovery counsel",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-005",
      "policy_name": "Medical and Family Leave Policy",
      "policy_category": "HR",
      "policy_description": "Framework for employee requests for medical, maternity-related and other protected or company-approved leave; Legal review required where statutory treatment is uncertain",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-006",
      "policy_name": "Attendance and Absence Management Policy",
      "policy_category": "HR",
      "policy_description": "Requirements for attendance, absence notification, manager escalation and documented attendance interventions",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-007",
      "policy_name": "Employee Document Accuracy Policy",
      "policy_category": "HR",
      "policy_description": "Employees are expected to provide accurate and authentic information and documentation; suspected irregularities must be verified before misconduct conclusions are reached",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-008",
      "policy_name": "Employee Investigation and Disciplinary Policy",
      "policy_category": "HR",
      "policy_description": "Framework for factual investigation, employee response, evidence assessment, proportionality and Legal review before material disciplinary action",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-009",
      "policy_name": "Performance Improvement Policy",
      "policy_category": "HR",
      "policy_description": "Standards for structured performance improvement plans, objective measurement and documentation of outcomes",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    }
  ],
  "historical_precedents": [
    {
      "historical_matter_id": "HM-001",
      "matter_reference": "MATTER-2023-045",
      "matter_type": "secured_loan_recovery",
      "outcome": "FULL_RECOVERY",
      "recovery_amount_inr": 85000000,
      "recovery_percentage": 100,
      "timeline_months": 8,
      "lessons_learned": "SARFAESI enforcement effective for commercial property with clear title. Timeline: 8 months from notice to sale completion.",
      "created_date": "2024-01-01"
    },
    {
      "historical_matter_id": "HM-002",
      "matter_reference": "MATTER-2023-067",
      "matter_type": "secured_loan_recovery",
      "outcome": "PARTIAL_RECOVERY",
      "recovery_amount_inr": 42000000,
      "recovery_percentage": 65,
      "timeline_months": 14,
      "lessons_learned": "Multiple securities helped but property title dispute delayed enforcement. Recommend enhanced title verification pre-disbursement.",
      "created_date": "2024-01-01"
    },
    {
      "historical_matter_id": "HM-003",
      "matter_reference": "MATTER-2024-012",
      "matter_type": "secured_loan_recovery",
      "outcome": "SETTLEMENT",
      "recovery_amount_inr": 95000000,
      "recovery_percentage": 85,
      "timeline_months": 5,
      "lessons_learned": "Early engagement and restructuring proposal led to settlement. Faster recovery than enforcement but required concession.",
      "created_date": "2024-06-01"
    },
    {
      "historical_matter_id": "HM-004",
      "matter_reference": "MATTER-2024-031",
      "matter_type": "secured_loan_recovery",
      "outcome": "PARTIAL_RECOVERY",
      "recovery_amount_inr": 61000000,
      "recovery_percentage": 72,
      "timeline_months": 11,
      "lessons_learned": "Recovery was delayed because a prior mortgage satisfaction entry was incomplete. External title verification resolved priority before enforcement proceeded.",
      "created_date": "2025-01-01"
    },
    {
      "historical_matter_id": "HM-005",
      "matter_reference": "MATTER-2024-HR-018",
      "matter_type": "hr_employment",
      "outcome": "INTERNAL_RESOLUTION",
      "recovery_amount_inr": 0,
      "recovery_percentage": 0,
      "timeline_months": 2,
      "lessons_learned": "Medical-document discrepancies were investigated separately from attendance history. No disciplinary conclusion was reached until source verification and employee clarification were complete.",
      "created_date": "2025-01-01"
    },
    {
      "historical_matter_id": "HM-006",
      "matter_reference": "MATTER-2025-HR-007",
      "matter_type": "hr_employment",
      "outcome": "FINAL_WARNING",
      "recovery_amount_inr": 0,
      "recovery_percentage": 0,
      "timeline_months": 1,
      "lessons_learned": "Employee had prior attendance issues but had formally completed a PIP. Subsequent misconduct allegation was assessed independently and resulted in targeted disciplinary action based only on verified facts.",
      "created_date": "2025-06-01"
    }
  ]
}

```

### `data/matters/MAT-002.json`

```json
{
  "matter": {
    "matter_id": "MAT-002",
    "matter_type_id": "MT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_description": "Employee leave and misconduct review matter",
    "client_id": "PARTY-001",
    "counterparty_id": "PARTY-004",
    "matter_status": "INTERNAL_REVIEW",
    "risk_rating": "MEDIUM",
    "outstanding_exposure_inr": 0,
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  "matter_type": {
    "matter_type_id": "MT-002",
    "matter_type_name": "hr_employment",
    "description": "HR and employment-related legal matters",
    "created_date": "2024-01-01"
  },
  "parties": {
    "client": {
      "party_id": "PARTY-001",
      "party_name": "Aster Fintech Limited",
      "party_type": "LENDER",
      "registration_number": "U65923DL2018PLC334567",
      "registered_address": "A-42, Sector 63, Noida, Uttar Pradesh 201301",
      "contact_email": "legal@asterfintech.in",
      "contact_phone": "+91-120-4567890",
      "created_date": "2024-01-01"
    },
    "counterparty": {
      "party_id": "PARTY-004",
      "party_name": "Priya Menon",
      "party_type": "EMPLOYEE",
      "registration_number": "ABCDE1234F",
      "registered_address": "Flat 302, Green Valley Residency, Koramangala, Bangalore 560034",
      "contact_email": "priya.menon@email.com",
      "contact_phone": "+91-9845067890",
      "created_date": "2025-09-01"
    }
  },
  "workstreams": [
    {
      "workstream_id": "WS-003",
      "matter_id": "MAT-002",
      "parent_workstream_id": null,
      "workstream_name": "Employee Leave & Misconduct Review",
      "workstream_description": "HR intake, leave request, document verification, employment history review, internal legal assessment, further investigation, external counsel escalation if required, internal decision",
      "workstream_status": "ACTIVE",
      "created_date": "2025-09-01",
      "created_by": "USR-002",
      "documents": [
        {
          "document_id": "DOC-015",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "Employee Leave Request",
          "document_type": "LEAVE_REQUEST",
          "document_date": "2025-08-25",
          "document_source": "EMPLOYEE",
          "document_status": "FINAL",
          "created_date": "2025-09-01",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-045",
              "document_id": "DOC-015",
              "section_title": "Leave Request",
              "section_content": "Priya Menon requested medical leave beginning 2025-08-25 following a reported miscarriage and submitted supporting medical documentation for HR review.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-046",
              "document_id": "DOC-015",
              "section_title": "Requested Leave Period",
              "section_content": "The employee requested 14 calendar days of leave and asked HR to confirm applicable medical and statutory leave treatment.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-016",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "Medical Certificate Submitted by Employee",
          "document_type": "MEDICAL_CERTIFICATE",
          "document_date": "2025-08-24",
          "document_source": "EMPLOYEE",
          "document_status": "VERIFICATION_REQUIRED",
          "created_date": "2025-09-01",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-047",
              "document_id": "DOC-016",
              "section_title": "Medical Certificate",
              "section_content": "The certificate states that Priya Menon received medical treatment and was advised rest beginning 2025-08-24.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-048",
              "document_id": "DOC-016",
              "section_title": "Document Verification Concern",
              "section_content": "The facility identifier and doctor registration format shown on the certificate differ from identifiers appearing on other documents supplied with the leave request and require verification.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-017",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "Consultation Receipt Submitted by Employee",
          "document_type": "MEDICAL_RECEIPT",
          "document_date": "2025-08-23",
          "document_source": "EMPLOYEE",
          "document_status": "VERIFICATION_REQUIRED",
          "created_date": "2025-09-01",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-049",
              "document_id": "DOC-017",
              "section_title": "Consultation Details",
              "section_content": "The consultation receipt records a visit dated 2025-08-23 and contains a patient reference number that differs from the reference number appearing on the medical certificate.",
              "section_order": 1
            }
          ]
        },
        {
          "document_id": "DOC-018",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "Employee Attendance Summary",
          "document_type": "ATTENDANCE_RECORD",
          "document_date": "2025-08-31",
          "document_source": "HR_SYSTEMS",
          "document_status": "FINAL",
          "created_date": "2025-09-01",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-050",
              "document_id": "DOC-018",
              "section_title": "Attendance History",
              "section_content": "Over the preceding 12 months the employee recorded 17 unscheduled absence days. On five occasions the required manager notification process was not followed within the expected timeframe.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-051",
              "document_id": "DOC-018",
              "section_title": "Prior Interventions",
              "section_content": "The employee received two manager-level attendance interventions and one formal attendance warning before commencement of the performance improvement plan.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-019",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "Performance Improvement Plan",
          "document_type": "PERFORMANCE_PLAN",
          "document_date": "2025-06-01",
          "document_source": "HR",
          "document_status": "FINAL",
          "created_date": "2025-09-01",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-052",
              "document_id": "DOC-019",
              "section_title": "PIP Objectives",
              "section_content": "The one-month performance improvement plan measured attendance reliability, client response SLA compliance, CRM record maintenance and manager communication.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-053",
              "document_id": "DOC-019",
              "section_title": "PIP Passing Threshold",
              "section_content": "The PIP required an overall score of at least 75 out of 100 with no critical compliance failure.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-020",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "PIP Completion Assessment",
          "document_type": "PERFORMANCE_ASSESSMENT",
          "document_date": "2025-06-30",
          "document_source": "HR",
          "document_status": "FINAL",
          "created_date": "2025-09-01",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-054",
              "document_id": "DOC-020",
              "section_title": "PIP Result",
              "section_content": "Priya Menon completed the PIP with an overall score of 77 out of 100 and therefore met the stated passing threshold.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-055",
              "document_id": "DOC-020",
              "section_title": "Ongoing Observation",
              "section_content": "Although the employee passed the PIP, HR noted that attendance reliability and manager communication remained areas requiring monitoring.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-021",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "Employee Clarification on Medical Documents",
          "document_type": "EMPLOYEE_RESPONSE",
          "document_date": "2025-09-02",
          "document_source": "EMPLOYEE",
          "document_status": "FINAL",
          "created_date": "2025-09-02",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-056",
              "document_id": "DOC-021",
              "section_title": "Employee Explanation",
              "section_content": "The employee stated that a family member assisted in collecting some medical records and that she was unaware of the inconsistencies identified by HR. She denied intentionally submitting inaccurate documentation.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-057",
              "document_id": "DOC-021",
              "section_title": "Replacement Information",
              "section_content": "The employee supplied an additional clarification document addressing one identifier discrepancy, but HR considered at least one verification question unresolved.",
              "section_order": 2
            }
          ]
        },
        {
          "document_id": "DOC-022",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "document_title": "HR Legal Intake Note",
          "document_type": "INTERNAL_MEMO",
          "document_date": "2025-09-03",
          "document_source": "HR",
          "document_status": "FINAL",
          "created_date": "2025-09-03",
          "created_by": "USR-002",
          "sections": [
            {
              "section_id": "SEC-DOC-058",
              "document_id": "DOC-022",
              "section_title": "HR Intake Summary",
              "section_content": "HR escalated the matter to Internal Legal because the matter combines a medically sensitive leave request, unresolved document-authenticity questions, prior attendance issues and a recently completed PIP.",
              "section_order": 1
            },
            {
              "section_id": "SEC-DOC-059",
              "document_id": "DOC-022",
              "section_title": "Requested Legal Assessment",
              "section_content": "HR requested advice on appropriate investigation steps, treatment of the leave request, separation of historic performance concerns from the current document-verification issue, procedural fairness and whether external employment counsel should be consulted before disciplinary action.",
              "section_order": 2
            }
          ]
        }
      ],
      "timeline": [
        {
          "timeline_id": "TM-019",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-06-01",
          "event_type": "PIP_START",
          "event_title": "Performance Improvement Plan Started",
          "event_description": "One-month PIP commenced covering attendance, SLA compliance, CRM hygiene and manager communication",
          "related_document_id": "DOC-019",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-020",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-06-30",
          "event_type": "PIP_COMPLETE",
          "event_title": "PIP Completed",
          "event_description": "Employee achieved 77/100 against required threshold of 75/100",
          "related_document_id": "DOC-020",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-021",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-08-25",
          "event_type": "LEAVE_REQUEST",
          "event_title": "Medical Leave Requested",
          "event_description": "Employee submitted leave request following reported miscarriage",
          "related_document_id": "DOC-015",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-022",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-08-25",
          "event_type": "DOCUMENT_SUBMISSION",
          "event_title": "Medical Records Submitted",
          "event_description": "Employee submitted medical certificate and consultation receipt",
          "related_document_id": "DOC-016",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-023",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-08-28",
          "event_type": "VERIFICATION_FLAG",
          "event_title": "Document Discrepancies Identified",
          "event_description": "HR identified inconsistent identifiers across supporting medical documents",
          "related_document_id": "DOC-016",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-024",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-08-29",
          "event_type": "HR_REVIEW",
          "event_title": "Attendance History Reviewed",
          "event_description": "HR reviewed prior absences, warning history and completed PIP",
          "related_document_id": "DOC-018",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-025",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-09-01",
          "event_type": "CLARIFICATION_REQUEST",
          "event_title": "Employee Clarification Requested",
          "event_description": "HR asked employee to explain discrepancies in submitted medical records",
          "related_document_id": "DOC-016",
          "created_date": "2025-09-01"
        },
        {
          "timeline_id": "TM-026",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-09-02",
          "event_type": "EMPLOYEE_RESPONSE",
          "event_title": "Employee Clarification Received",
          "event_description": "Employee denied intentional falsification and explained family assistance in obtaining records",
          "related_document_id": "DOC-021",
          "created_date": "2025-09-02"
        },
        {
          "timeline_id": "TM-027",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "event_date": "2025-09-03",
          "event_type": "LEGAL_ESCALATION",
          "event_title": "HR Escalates Matter to Legal",
          "event_description": "HR requested Legal assessment before taking disciplinary action",
          "related_document_id": "DOC-022",
          "created_date": "2025-09-03"
        }
      ],
      "issues": [
        {
          "issue_id": "ISSUE-011",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "issue_title": "Medical Document Authenticity Requires Verification",
          "issue_description": "Multiple identifiers across submitted medical documents are inconsistent. The available evidence does not establish whether the inconsistencies resulted from fraud, administrative error or another cause.",
          "issue_status": "IN_PROGRESS",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-09-03",
          "created_by": "USR-002"
        },
        {
          "issue_id": "ISSUE-012",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "issue_title": "Leave Request Requires Legal Review",
          "issue_description": "The employee's request relates to a reported miscarriage and may engage statutory or legally protected leave rights. Appropriate treatment should be confirmed by qualified Legal review.",
          "issue_status": "ACTIVE",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-09-03",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-013",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "issue_title": "Prior Attendance and PIP History",
          "issue_description": "Documented attendance issues and a recent PIP exist, but the employee formally passed the PIP with a score of 77 against the required threshold of 75.",
          "issue_status": "ACTIVE",
          "issue_priority": "MEDIUM",
          "requires_legal_judgment": "NO",
          "created_date": "2025-09-03",
          "created_by": "USR-002"
        },
        {
          "issue_id": "ISSUE-014",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "issue_title": "Separation of Historical Performance from Current Investigation",
          "issue_description": "Prior attendance/performance history should be evaluated separately from the current leave request and document-verification inquiry so that each issue is supported by its own evidence.",
          "issue_status": "ACTIVE",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-09-03",
          "created_by": "USR-001"
        },
        {
          "issue_id": "ISSUE-015",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "issue_title": "Disciplinary Action Requires Legal Judgment",
          "issue_description": "Whether any disciplinary action is appropriate depends on completion of factual verification, employee response, applicable leave protections, company policy and procedural fairness.",
          "issue_status": "ACTIVE",
          "issue_priority": "HIGH",
          "requires_legal_judgment": "YES",
          "created_date": "2025-09-03",
          "created_by": "USR-001"
        }
      ],
      "findings": [
        {
          "finding_id": "FIND-011",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "finding_type": "DOCUMENT_VERIFICATION",
          "finding_title": "Medical Documentation Contains Inconsistencies",
          "finding_summary": "Submitted medical documents contain inconsistent facility, doctor or patient identifiers. These inconsistencies support further verification but do not establish intentional falsification.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-09-03",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-015",
              "finding_id": "FIND-011",
              "source_type": "DOCUMENT",
              "source_id": "DOC-016",
              "source_section": "SEC-DOC-048",
              "citation_text": "Document Verification Concern"
            },
            {
              "citation_id": "CITE-016",
              "finding_id": "FIND-011",
              "source_type": "DOCUMENT",
              "source_id": "DOC-017",
              "source_section": "SEC-DOC-049",
              "citation_text": "Consultation identifier discrepancy"
            }
          ]
        },
        {
          "finding_id": "FIND-012",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "finding_type": "FACTUAL",
          "finding_title": "Prior Attendance Concerns Documented",
          "finding_summary": "HR records show 17 unscheduled absence days, five notification-process failures and prior attendance interventions during the preceding 12 months.",
          "confidence_level": "HIGH",
          "requires_verification": "NO",
          "created_date": "2025-09-03",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-017",
              "finding_id": "FIND-012",
              "source_type": "DOCUMENT",
              "source_id": "DOC-018",
              "source_section": "SEC-DOC-050",
              "citation_text": "Attendance History"
            },
            {
              "citation_id": "CITE-018",
              "finding_id": "FIND-012",
              "source_type": "DOCUMENT",
              "source_id": "DOC-018",
              "source_section": "SEC-DOC-051",
              "citation_text": "Prior Interventions"
            }
          ]
        },
        {
          "finding_id": "FIND-013",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "finding_type": "FACTUAL",
          "finding_title": "PIP Was Formally Passed",
          "finding_summary": "The employee achieved 77/100 against the stated passing threshold of 75/100. Historical performance concerns therefore should not be represented as a failed PIP.",
          "confidence_level": "HIGH",
          "requires_verification": "NO",
          "created_date": "2025-09-03",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-019",
              "finding_id": "FIND-013",
              "source_type": "DOCUMENT",
              "source_id": "DOC-020",
              "source_section": "SEC-DOC-054",
              "citation_text": "PIP Result"
            }
          ]
        },
        {
          "finding_id": "FIND-014",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "finding_type": "LEGAL_ISSUE",
          "finding_title": "Leave and Misconduct Analysis Should Remain Separate",
          "finding_summary": "The leave request, prior attendance history and current document-authenticity investigation involve different evidence and legal considerations. Combining them into a single misconduct conclusion would exceed the available evidence.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-09-03",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-020",
              "finding_id": "FIND-014",
              "source_type": "DOCUMENT",
              "source_id": "DOC-022",
              "source_section": "SEC-DOC-059",
              "citation_text": "Requested Legal Assessment"
            }
          ]
        },
        {
          "finding_id": "FIND-015",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "finding_type": "RECOMMENDATION",
          "finding_title": "Complete Verification Before Disciplinary Decision",
          "finding_summary": "Complete document verification and obtain Legal review before linking the current leave request to disciplinary action. Any decision should distinguish verified misconduct evidence from historical performance records and leave-related rights.",
          "confidence_level": "HIGH",
          "requires_verification": "YES",
          "created_date": "2025-09-03",
          "created_by": "AI-001",
          "citations": [
            {
              "citation_id": "CITE-021",
              "finding_id": "FIND-015",
              "source_type": "LEGAL_ISSUE",
              "source_id": "ISSUE-015",
              "source_section": null,
              "citation_text": "Disciplinary action requires Legal judgment"
            }
          ]
        }
      ],
      "decisions": [
        {
          "decision_id": "DEC-002",
          "matter_id": "MAT-002",
          "workstream_id": "WS-003",
          "decision_type": "LEGAL_REVIEW",
          "decision_title": "Complete Verification and Seek Targeted Employment Counsel Advice",
          "decision_summary": "Internal Legal determined that document verification should be completed and targeted external employment-law advice obtained before any material disciplinary decision. Historical attendance and PIP records should be assessed separately from the current leave and document-verification inquiry.",
          "decision_status": "IN_PROGRESS",
          "decision_date": "2025-09-03",
          "decided_by": "USR-001",
          "created_date": "2025-09-03"
        }
      ]
    }
  ],
  "timeline": [
    {
      "timeline_id": "TM-019",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-06-01",
      "event_type": "PIP_START",
      "event_title": "Performance Improvement Plan Started",
      "event_description": "One-month PIP commenced covering attendance, SLA compliance, CRM hygiene and manager communication",
      "related_document_id": "DOC-019",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-020",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-06-30",
      "event_type": "PIP_COMPLETE",
      "event_title": "PIP Completed",
      "event_description": "Employee achieved 77/100 against required threshold of 75/100",
      "related_document_id": "DOC-020",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-021",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-08-25",
      "event_type": "LEAVE_REQUEST",
      "event_title": "Medical Leave Requested",
      "event_description": "Employee submitted leave request following reported miscarriage",
      "related_document_id": "DOC-015",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-022",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-08-25",
      "event_type": "DOCUMENT_SUBMISSION",
      "event_title": "Medical Records Submitted",
      "event_description": "Employee submitted medical certificate and consultation receipt",
      "related_document_id": "DOC-016",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-023",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-08-28",
      "event_type": "VERIFICATION_FLAG",
      "event_title": "Document Discrepancies Identified",
      "event_description": "HR identified inconsistent identifiers across supporting medical documents",
      "related_document_id": "DOC-016",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-024",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-08-29",
      "event_type": "HR_REVIEW",
      "event_title": "Attendance History Reviewed",
      "event_description": "HR reviewed prior absences, warning history and completed PIP",
      "related_document_id": "DOC-018",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-025",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-09-01",
      "event_type": "CLARIFICATION_REQUEST",
      "event_title": "Employee Clarification Requested",
      "event_description": "HR asked employee to explain discrepancies in submitted medical records",
      "related_document_id": "DOC-016",
      "created_date": "2025-09-01"
    },
    {
      "timeline_id": "TM-026",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-09-02",
      "event_type": "EMPLOYEE_RESPONSE",
      "event_title": "Employee Clarification Received",
      "event_description": "Employee denied intentional falsification and explained family assistance in obtaining records",
      "related_document_id": "DOC-021",
      "created_date": "2025-09-02"
    },
    {
      "timeline_id": "TM-027",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "event_date": "2025-09-03",
      "event_type": "LEGAL_ESCALATION",
      "event_title": "HR Escalates Matter to Legal",
      "event_description": "HR requested Legal assessment before taking disciplinary action",
      "related_document_id": "DOC-022",
      "created_date": "2025-09-03"
    }
  ],
  "issues": [
    {
      "issue_id": "ISSUE-011",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "issue_title": "Medical Document Authenticity Requires Verification",
      "issue_description": "Multiple identifiers across submitted medical documents are inconsistent. The available evidence does not establish whether the inconsistencies resulted from fraud, administrative error or another cause.",
      "issue_status": "IN_PROGRESS",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-09-03",
      "created_by": "USR-002"
    },
    {
      "issue_id": "ISSUE-012",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "issue_title": "Leave Request Requires Legal Review",
      "issue_description": "The employee's request relates to a reported miscarriage and may engage statutory or legally protected leave rights. Appropriate treatment should be confirmed by qualified Legal review.",
      "issue_status": "ACTIVE",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-09-03",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-013",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "issue_title": "Prior Attendance and PIP History",
      "issue_description": "Documented attendance issues and a recent PIP exist, but the employee formally passed the PIP with a score of 77 against the required threshold of 75.",
      "issue_status": "ACTIVE",
      "issue_priority": "MEDIUM",
      "requires_legal_judgment": "NO",
      "created_date": "2025-09-03",
      "created_by": "USR-002"
    },
    {
      "issue_id": "ISSUE-014",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "issue_title": "Separation of Historical Performance from Current Investigation",
      "issue_description": "Prior attendance/performance history should be evaluated separately from the current leave request and document-verification inquiry so that each issue is supported by its own evidence.",
      "issue_status": "ACTIVE",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-09-03",
      "created_by": "USR-001"
    },
    {
      "issue_id": "ISSUE-015",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "issue_title": "Disciplinary Action Requires Legal Judgment",
      "issue_description": "Whether any disciplinary action is appropriate depends on completion of factual verification, employee response, applicable leave protections, company policy and procedural fairness.",
      "issue_status": "ACTIVE",
      "issue_priority": "HIGH",
      "requires_legal_judgment": "YES",
      "created_date": "2025-09-03",
      "created_by": "USR-001"
    }
  ],
  "findings": [
    {
      "finding_id": "FIND-011",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "finding_type": "DOCUMENT_VERIFICATION",
      "finding_title": "Medical Documentation Contains Inconsistencies",
      "finding_summary": "Submitted medical documents contain inconsistent facility, doctor or patient identifiers. These inconsistencies support further verification but do not establish intentional falsification.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-09-03",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-015",
          "finding_id": "FIND-011",
          "source_type": "DOCUMENT",
          "source_id": "DOC-016",
          "source_section": "SEC-DOC-048",
          "citation_text": "Document Verification Concern"
        },
        {
          "citation_id": "CITE-016",
          "finding_id": "FIND-011",
          "source_type": "DOCUMENT",
          "source_id": "DOC-017",
          "source_section": "SEC-DOC-049",
          "citation_text": "Consultation identifier discrepancy"
        }
      ]
    },
    {
      "finding_id": "FIND-012",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "finding_type": "FACTUAL",
      "finding_title": "Prior Attendance Concerns Documented",
      "finding_summary": "HR records show 17 unscheduled absence days, five notification-process failures and prior attendance interventions during the preceding 12 months.",
      "confidence_level": "HIGH",
      "requires_verification": "NO",
      "created_date": "2025-09-03",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-017",
          "finding_id": "FIND-012",
          "source_type": "DOCUMENT",
          "source_id": "DOC-018",
          "source_section": "SEC-DOC-050",
          "citation_text": "Attendance History"
        },
        {
          "citation_id": "CITE-018",
          "finding_id": "FIND-012",
          "source_type": "DOCUMENT",
          "source_id": "DOC-018",
          "source_section": "SEC-DOC-051",
          "citation_text": "Prior Interventions"
        }
      ]
    },
    {
      "finding_id": "FIND-013",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "finding_type": "FACTUAL",
      "finding_title": "PIP Was Formally Passed",
      "finding_summary": "The employee achieved 77/100 against the stated passing threshold of 75/100. Historical performance concerns therefore should not be represented as a failed PIP.",
      "confidence_level": "HIGH",
      "requires_verification": "NO",
      "created_date": "2025-09-03",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-019",
          "finding_id": "FIND-013",
          "source_type": "DOCUMENT",
          "source_id": "DOC-020",
          "source_section": "SEC-DOC-054",
          "citation_text": "PIP Result"
        }
      ]
    },
    {
      "finding_id": "FIND-014",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "finding_type": "LEGAL_ISSUE",
      "finding_title": "Leave and Misconduct Analysis Should Remain Separate",
      "finding_summary": "The leave request, prior attendance history and current document-authenticity investigation involve different evidence and legal considerations. Combining them into a single misconduct conclusion would exceed the available evidence.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-09-03",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-020",
          "finding_id": "FIND-014",
          "source_type": "DOCUMENT",
          "source_id": "DOC-022",
          "source_section": "SEC-DOC-059",
          "citation_text": "Requested Legal Assessment"
        }
      ]
    },
    {
      "finding_id": "FIND-015",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "finding_type": "RECOMMENDATION",
      "finding_title": "Complete Verification Before Disciplinary Decision",
      "finding_summary": "Complete document verification and obtain Legal review before linking the current leave request to disciplinary action. Any decision should distinguish verified misconduct evidence from historical performance records and leave-related rights.",
      "confidence_level": "HIGH",
      "requires_verification": "YES",
      "created_date": "2025-09-03",
      "created_by": "AI-001",
      "citations": [
        {
          "citation_id": "CITE-021",
          "finding_id": "FIND-015",
          "source_type": "LEGAL_ISSUE",
          "source_id": "ISSUE-015",
          "source_section": null,
          "citation_text": "Disciplinary action requires Legal judgment"
        }
      ]
    }
  ],
  "decisions": [
    {
      "decision_id": "DEC-002",
      "matter_id": "MAT-002",
      "workstream_id": "WS-003",
      "decision_type": "LEGAL_REVIEW",
      "decision_title": "Complete Verification and Seek Targeted Employment Counsel Advice",
      "decision_summary": "Internal Legal determined that document verification should be completed and targeted external employment-law advice obtained before any material disciplinary decision. Historical attendance and PIP records should be assessed separately from the current leave and document-verification inquiry.",
      "decision_status": "IN_PROGRESS",
      "decision_date": "2025-09-03",
      "decided_by": "USR-001",
      "created_date": "2025-09-03"
    }
  ],
  "access": [
    {
      "access_id": "ACC-004",
      "matter_id": "MAT-002",
      "user_id": "USR-002",
      "access_level": "OWNER",
      "granted_date": "2025-09-01",
      "granted_by": "USR-004",
      "user": {
        "user_id": "USR-002",
        "user_name": "Neha Gupta",
        "user_email": "neha.gupta@asterfintech.in",
        "user_role": "HR_MANAGER",
        "department": "Human Resources",
        "user_status": "ACTIVE",
        "created_date": "2024-01-01"
      }
    },
    {
      "access_id": "ACC-005",
      "matter_id": "MAT-002",
      "user_id": "USR-001",
      "access_level": "EDIT",
      "granted_date": "2025-09-01",
      "granted_by": "USR-002",
      "user": {
        "user_id": "USR-001",
        "user_name": "Aditya Malhotra",
        "user_email": "aditya.malhotra@asterfintech.in",
        "user_role": "LEGAL_COUNSEL",
        "department": "Legal",
        "user_status": "ACTIVE",
        "created_date": "2024-01-01"
      }
    },
    {
      "access_id": "ACC-006",
      "matter_id": "MAT-002",
      "user_id": "USR-005",
      "access_level": "LIMITED",
      "granted_date": "2025-09-05",
      "granted_by": "USR-001",
      "user": {
        "user_id": "USR-005",
        "user_name": "Rhea Sethi",
        "user_email": "rhea.sethi@sethiemployment.example",
        "user_role": "EXTERNAL_COUNSEL",
        "department": "External Counsel",
        "user_status": "ACTIVE",
        "created_date": "2025-09-03"
      }
    }
  ],
  "counsel_engagements": [
    {
      "engagement_id": "ENG-002",
      "matter_id": "MAT-002",
      "counsel_id": "COUN-004",
      "engagement_type": "EMPLOYMENT_COUNSEL",
      "engagement_status": "PENDING",
      "engagement_date": "2025-09-05",
      "engagement_description": "Targeted external employment-law review proposed before material disciplinary decision",
      "budget_inr": 300000,
      "created_date": "2025-09-03",
      "counsel": {
        "counsel_id": "COUN-004",
        "counsel_name": "Adv. Rhea Sethi",
        "counsel_type": "EXTERNAL",
        "firm_name": "Sethi Employment Advisory",
        "email": "rhea.sethi@sethiemployment.example",
        "phone": "+91-80-40001234",
        "specialization": "Employment Law, Workplace Investigations",
        "counsel_status": "PANEL"
      },
      "briefs": [
        {
          "brief_id": "BRIEF-002",
          "engagement_id": "ENG-002",
          "brief_title": "Employee Leave and Document Verification Brief",
          "brief_date": "2025-09-05",
          "brief_status": "DRAFT",
          "created_date": "2025-09-03",
          "created_by": "USR-001",
          "questions": [
            {
              "question_id": "Q-007",
              "brief_id": "BRIEF-002",
              "question_text": "What further factual verification should HR complete regarding the submitted medical records before reaching any misconduct conclusion?",
              "question_category": "INVESTIGATION",
              "question_priority": "HIGH",
              "created_date": "2025-09-05"
            },
            {
              "question_id": "Q-008",
              "brief_id": "BRIEF-002",
              "question_text": "What legal protections or leave requirements should be considered in relation to the employee's reported miscarriage and requested leave?",
              "question_category": "LEAVE",
              "question_priority": "HIGH",
              "created_date": "2025-09-05"
            },
            {
              "question_id": "Q-009",
              "brief_id": "BRIEF-002",
              "question_text": "How should the company distinguish prior attendance and PIP history from the current document-verification issue when assessing disciplinary risk?",
              "question_category": "DISCIPLINE",
              "question_priority": "HIGH",
              "created_date": "2025-09-05"
            },
            {
              "question_id": "Q-010",
              "brief_id": "BRIEF-002",
              "question_text": "What process should the company follow before considering any final disciplinary action, including opportunity to respond and additional evidence gathering?",
              "question_category": "PROCEDURE",
              "question_priority": "HIGH",
              "created_date": "2025-09-05"
            }
          ]
        }
      ],
      "outputs": []
    }
  ],
  "assets": [],
  "company_policies": [
    {
      "policy_id": "POL-001",
      "policy_name": "Credit Risk Management Policy",
      "policy_category": "CREDIT",
      "policy_description": "Framework for credit assessment, risk rating, monitoring, and escalation of credit facilities",
      "effective_date": "2023-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-002",
      "policy_name": "Legal Matter Escalation Policy",
      "policy_category": "LEGAL",
      "policy_description": "Criteria and process for escalation of matters from business/credit to internal legal and external counsel",
      "effective_date": "2023-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-003",
      "policy_name": "Security Documentation Standards",
      "policy_category": "CREDIT",
      "policy_description": "Minimum requirements for security documentation, registration, and perfection for secured lending",
      "effective_date": "2023-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-004",
      "policy_name": "Recovery and Enforcement Policy",
      "policy_category": "RECOVERY",
      "policy_description": "Guidelines for recovery actions, enforcement of security, and engagement of external recovery counsel",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-005",
      "policy_name": "Medical and Family Leave Policy",
      "policy_category": "HR",
      "policy_description": "Framework for employee requests for medical, maternity-related and other protected or company-approved leave; Legal review required where statutory treatment is uncertain",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-006",
      "policy_name": "Attendance and Absence Management Policy",
      "policy_category": "HR",
      "policy_description": "Requirements for attendance, absence notification, manager escalation and documented attendance interventions",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-007",
      "policy_name": "Employee Document Accuracy Policy",
      "policy_category": "HR",
      "policy_description": "Employees are expected to provide accurate and authentic information and documentation; suspected irregularities must be verified before misconduct conclusions are reached",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-008",
      "policy_name": "Employee Investigation and Disciplinary Policy",
      "policy_category": "HR",
      "policy_description": "Framework for factual investigation, employee response, evidence assessment, proportionality and Legal review before material disciplinary action",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    },
    {
      "policy_id": "POL-009",
      "policy_name": "Performance Improvement Policy",
      "policy_category": "HR",
      "policy_description": "Standards for structured performance improvement plans, objective measurement and documentation of outcomes",
      "effective_date": "2024-01-01",
      "policy_status": "ACTIVE"
    }
  ],
  "historical_precedents": [
    {
      "historical_matter_id": "HM-001",
      "matter_reference": "MATTER-2023-045",
      "matter_type": "secured_loan_recovery",
      "outcome": "FULL_RECOVERY",
      "recovery_amount_inr": 85000000,
      "recovery_percentage": 100,
      "timeline_months": 8,
      "lessons_learned": "SARFAESI enforcement effective for commercial property with clear title. Timeline: 8 months from notice to sale completion.",
      "created_date": "2024-01-01"
    },
    {
      "historical_matter_id": "HM-002",
      "matter_reference": "MATTER-2023-067",
      "matter_type": "secured_loan_recovery",
      "outcome": "PARTIAL_RECOVERY",
      "recovery_amount_inr": 42000000,
      "recovery_percentage": 65,
      "timeline_months": 14,
      "lessons_learned": "Multiple securities helped but property title dispute delayed enforcement. Recommend enhanced title verification pre-disbursement.",
      "created_date": "2024-01-01"
    },
    {
      "historical_matter_id": "HM-003",
      "matter_reference": "MATTER-2024-012",
      "matter_type": "secured_loan_recovery",
      "outcome": "SETTLEMENT",
      "recovery_amount_inr": 95000000,
      "recovery_percentage": 85,
      "timeline_months": 5,
      "lessons_learned": "Early engagement and restructuring proposal led to settlement. Faster recovery than enforcement but required concession.",
      "created_date": "2024-06-01"
    },
    {
      "historical_matter_id": "HM-004",
      "matter_reference": "MATTER-2024-031",
      "matter_type": "secured_loan_recovery",
      "outcome": "PARTIAL_RECOVERY",
      "recovery_amount_inr": 61000000,
      "recovery_percentage": 72,
      "timeline_months": 11,
      "lessons_learned": "Recovery was delayed because a prior mortgage satisfaction entry was incomplete. External title verification resolved priority before enforcement proceeded.",
      "created_date": "2025-01-01"
    },
    {
      "historical_matter_id": "HM-005",
      "matter_reference": "MATTER-2024-HR-018",
      "matter_type": "hr_employment",
      "outcome": "INTERNAL_RESOLUTION",
      "recovery_amount_inr": 0,
      "recovery_percentage": 0,
      "timeline_months": 2,
      "lessons_learned": "Medical-document discrepancies were investigated separately from attendance history. No disciplinary conclusion was reached until source verification and employee clarification were complete.",
      "created_date": "2025-01-01"
    },
    {
      "historical_matter_id": "HM-006",
      "matter_reference": "MATTER-2025-HR-007",
      "matter_type": "hr_employment",
      "outcome": "FINAL_WARNING",
      "recovery_amount_inr": 0,
      "recovery_percentage": 0,
      "timeline_months": 1,
      "lessons_learned": "Employee had prior attendance issues but had formally completed a PIP. Subsequent misconduct allegation was assessed independently and resulted in targeted disciplinary action based only on verified facts.",
      "created_date": "2025-06-01"
    }
  ]
}
```

### `data/raw/ai_findings.json`

```json
[
  {
    "finding_id": "FIND-001",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "finding_type": "FACTUAL",
    "finding_title": "Payment Default Confirmed",
    "finding_summary": "Borrower has failed to pay 5 consecutive monthly installments from April 2025 through August 2025 totaling INR 1,62,50,000 in scheduled EMIs, together with accrued and penal interest. The first payment default occurred on 2025-04-01 and remains uncured as of 2025-08-31.",
    "confidence_level": "HIGH",
    "requires_verification": "NO",
    "created_date": "2025-08-31",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-002",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "finding_type": "EXPOSURE",
    "finding_title": "Outstanding Exposure Calculation",
    "finding_summary": "Total outstanding exposure as of 2025-08-31 is INR 12,40,00,000 comprising principal outstanding of INR 12,00,00,000, accrued interest of INR 37,30,000, and penal interest of INR 2,70,000.",
    "confidence_level": "HIGH",
    "requires_verification": "NO",
    "created_date": "2025-08-31",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-003",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "finding_type": "DOCUMENTATION",
    "finding_title": "Security Package Appears Complete",
    "finding_summary": "Three securities documented: (a) property mortgage; (b) corporate guarantee; (c) receivables charge. All appear properly documented pending verification of registration certificates and title deeds.",
    "confidence_level": "MEDIUM",
    "requires_verification": "YES",
    "created_date": "2025-08-31",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-004",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "finding_type": "INFORMATION_GAP",
    "finding_title": "Current Collateral Valuation Missing",
    "finding_summary": "Last property valuation dated 2024-02 (pre-disbursement). Current market value unknown. Property values in Andheri-Kurla Road area may have appreciated 15-20% since 2024, but this requires confirmation.",
    "confidence_level": "MEDIUM",
    "requires_verification": "YES",
    "created_date": "2025-08-31",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-005",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "finding_type": "INFORMATION_GAP",
    "finding_title": "Latest Borrower Financials Unavailable",
    "finding_summary": "Last audited financials available: FY2023-24. FY2024-25 financials not yet available. Borrower's current financial position and solvency status cannot be definitively assessed without updated financials.",
    "confidence_level": "MEDIUM",
    "requires_verification": "YES",
    "created_date": "2025-08-31",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-006",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "finding_type": "LEGAL_ISSUE",
    "finding_title": "Recovery Strategy Requires Legal Judgment",
    "finding_summary": "Optimal recovery pathway (SARFAESI vs. DRT vs. IBC) requires legal judgment based on: security enforceability, borrower solvency, asset valuation, timeline, costs, and recovery likelihood. Cannot be determined without external counsel advice.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-08-31",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-007",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "finding_type": "SECURITY_VERIFICATION",
    "finding_title": "Prior Mortgage Identified",
    "finding_summary": "Title and security records identify a mortgage created in 2014 in favour of Zenith Commercial Bank Limited over AST-001.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-08-20",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-008",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "finding_type": "INFORMATION_GAP",
    "finding_title": "Formal Mortgage Satisfaction Not Confirmed",
    "finding_summary": "A 2019 release letter indicates repayment and release intent, but the available dataset does not contain conclusive registration evidence establishing formal satisfaction of the 2014 mortgage.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-08-20",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-009",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "finding_type": "DOCUMENTATION",
    "finding_title": "Aster Mortgage Recorded",
    "finding_summary": "Current security records identify Aster Fintech Limited's 2024 mortgage over AST-001. This supports existence of the lender's claimed security, subject to counsel verification of priority and enforceability.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-08-20",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-010",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "finding_type": "LEGAL_ISSUE",
    "finding_title": "Security Issue May Affect Recovery Strategy",
    "finding_summary": "The unresolved historical mortgage record could affect recovery strategy or sequencing. MatterBridge cannot determine legal priority or enforceability from the available documents and external counsel review is required.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-08-20",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-011",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "finding_type": "DOCUMENT_VERIFICATION",
    "finding_title": "Medical Documentation Contains Inconsistencies",
    "finding_summary": "Submitted medical documents contain inconsistent facility, doctor or patient identifiers. These inconsistencies support further verification but do not establish intentional falsification.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-09-03",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-012",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "finding_type": "FACTUAL",
    "finding_title": "Prior Attendance Concerns Documented",
    "finding_summary": "HR records show 17 unscheduled absence days, five notification-process failures and prior attendance interventions during the preceding 12 months.",
    "confidence_level": "HIGH",
    "requires_verification": "NO",
    "created_date": "2025-09-03",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-013",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "finding_type": "FACTUAL",
    "finding_title": "PIP Was Formally Passed",
    "finding_summary": "The employee achieved 77/100 against the stated passing threshold of 75/100. Historical performance concerns therefore should not be represented as a failed PIP.",
    "confidence_level": "HIGH",
    "requires_verification": "NO",
    "created_date": "2025-09-03",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-014",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "finding_type": "LEGAL_ISSUE",
    "finding_title": "Leave and Misconduct Analysis Should Remain Separate",
    "finding_summary": "The leave request, prior attendance history and current document-authenticity investigation involve different evidence and legal considerations. Combining them into a single misconduct conclusion would exceed the available evidence.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-09-03",
    "created_by": "AI-001"
  },
  {
    "finding_id": "FIND-015",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "finding_type": "RECOMMENDATION",
    "finding_title": "Complete Verification Before Disciplinary Decision",
    "finding_summary": "Complete document verification and obtain Legal review before linking the current leave request to disciplinary action. Any decision should distinguish verified misconduct evidence from historical performance records and leave-related rights.",
    "confidence_level": "HIGH",
    "requires_verification": "YES",
    "created_date": "2025-09-03",
    "created_by": "AI-001"
  }
]
```

### `data/raw/asset_documents.json`

```json
[
  {
    "asset_document_id": "AD-001",
    "asset_id": "AST-001",
    "document_id": "DOC-009",
    "relationship_type": "TITLE_DOCUMENT",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-002",
    "asset_id": "AST-001",
    "document_id": "DOC-010",
    "relationship_type": "TITLE_DOCUMENT",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-003",
    "asset_id": "AST-001",
    "document_id": "DOC-011",
    "relationship_type": "PRIOR_SECURITY",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-004",
    "asset_id": "AST-001",
    "document_id": "DOC-012",
    "relationship_type": "RELEASE_DOCUMENT",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-005",
    "asset_id": "AST-001",
    "document_id": "DOC-013",
    "relationship_type": "SECURITY_SEARCH",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-006",
    "asset_id": "AST-001",
    "document_id": "DOC-014",
    "relationship_type": "VALUATION",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-007",
    "asset_id": "AST-002",
    "document_id": "DOC-003",
    "relationship_type": "GUARANTEE_DOCUMENT",
    "created_date": "2025-08-20"
  },
  {
    "asset_document_id": "AD-008",
    "asset_id": "AST-003",
    "document_id": "DOC-002",
    "relationship_type": "SECURITY_DOCUMENT",
    "created_date": "2025-08-20"
  }
]
```

### `data/raw/assets.json`

```json
[
  {
    "asset_id": "AST-001",
    "asset_type": "COMMERCIAL_PROPERTY",
    "asset_name": "Commercial Property - Mumbai",
    "asset_description": "Commercial property located at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059. Built-up area: 12,500 sq ft. Current use: Manufacturing and warehouse facility.",
    "asset_status": "VERIFICATION_PENDING",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "asset_id": "AST-002",
    "asset_type": "CORPORATE_GUARANTEE",
    "asset_name": "Corporate Guarantee - Rajesh Kumar Sharma",
    "asset_description": "Unconditional and irrevocable corporate guarantee executed by Rajesh Kumar Sharma in favor of Aster Fintech Limited.",
    "asset_status": "ACTIVE",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "asset_id": "AST-003",
    "asset_type": "CHARGE_RECEIVABLES",
    "asset_name": "Charge over Receivables",
    "asset_description": "First pari passu charge over all present and future book debts and receivables of Meridian Components Private Limited.",
    "asset_status": "VERIFICATION_PENDING",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  }
]
```

### `data/raw/audit_log.json`

```json
[
  {
    "audit_id": "AUD-001",
    "table_name": "matters",
    "record_id": "MAT-001",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-15",
    "change_description": "Matter created"
  },
  {
    "audit_id": "AUD-002",
    "table_name": "matters",
    "record_id": "MAT-002",
    "action": "CREATE",
    "changed_by": "USR-002",
    "changed_date": "2025-09-01",
    "change_description": "Matter created"
  },
  {
    "audit_id": "AUD-003",
    "table_name": "workstreams",
    "record_id": "WS-001",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-15",
    "change_description": "Workstream created"
  },
  {
    "audit_id": "AUD-004",
    "table_name": "workstreams",
    "record_id": "WS-002",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-15",
    "change_description": "Workstream created"
  },
  {
    "audit_id": "AUD-005",
    "table_name": "workstreams",
    "record_id": "WS-003",
    "action": "CREATE",
    "changed_by": "USR-002",
    "changed_date": "2025-09-01",
    "change_description": "Workstream created"
  },
  {
    "audit_id": "AUD-006",
    "table_name": "documents",
    "record_id": "DOC-001",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-15",
    "change_description": "Document created"
  },
  {
    "audit_id": "AUD-007",
    "table_name": "documents",
    "record_id": "DOC-008",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-22",
    "change_description": "Document created"
  },
  {
    "audit_id": "AUD-008",
    "table_name": "legal_issues",
    "record_id": "ISSUE-001",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-15",
    "change_description": "Issue created"
  },
  {
    "audit_id": "AUD-009",
    "table_name": "decisions",
    "record_id": "DEC-001",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-22",
    "change_description": "Decision created"
  },
  {
    "audit_id": "AUD-010",
    "table_name": "documents",
    "record_id": "DOC-009",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-08-20",
    "change_description": "Security Verification source documents added"
  },
  {
    "audit_id": "AUD-011",
    "table_name": "documents",
    "record_id": "DOC-015",
    "action": "CREATE",
    "changed_by": "USR-002",
    "changed_date": "2025-09-01",
    "change_description": "HR leave and misconduct matter documents added"
  },
  {
    "audit_id": "AUD-012",
    "table_name": "ai_findings",
    "record_id": "FIND-007",
    "action": "CREATE",
    "changed_by": "AI-001",
    "changed_date": "2025-08-20",
    "change_description": "Security Verification findings generated"
  },
  {
    "audit_id": "AUD-013",
    "table_name": "ai_findings",
    "record_id": "FIND-011",
    "action": "CREATE",
    "changed_by": "AI-001",
    "changed_date": "2025-09-03",
    "change_description": "HR matter findings generated"
  },
  {
    "audit_id": "AUD-014",
    "table_name": "decisions",
    "record_id": "DEC-002",
    "action": "CREATE",
    "changed_by": "USR-001",
    "changed_date": "2025-09-03",
    "change_description": "HR legal review decision recorded"
  }
]
```

### `data/raw/company_policies.json`

```json
[
  {
    "policy_id": "POL-001",
    "policy_name": "Credit Risk Management Policy",
    "policy_category": "CREDIT",
    "policy_description": "Framework for credit assessment, risk rating, monitoring, and escalation of credit facilities",
    "effective_date": "2023-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-002",
    "policy_name": "Legal Matter Escalation Policy",
    "policy_category": "LEGAL",
    "policy_description": "Criteria and process for escalation of matters from business/credit to internal legal and external counsel",
    "effective_date": "2023-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-003",
    "policy_name": "Security Documentation Standards",
    "policy_category": "CREDIT",
    "policy_description": "Minimum requirements for security documentation, registration, and perfection for secured lending",
    "effective_date": "2023-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-004",
    "policy_name": "Recovery and Enforcement Policy",
    "policy_category": "RECOVERY",
    "policy_description": "Guidelines for recovery actions, enforcement of security, and engagement of external recovery counsel",
    "effective_date": "2024-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-005",
    "policy_name": "Medical and Family Leave Policy",
    "policy_category": "HR",
    "policy_description": "Framework for employee requests for medical, maternity-related and other protected or company-approved leave; Legal review required where statutory treatment is uncertain",
    "effective_date": "2024-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-006",
    "policy_name": "Attendance and Absence Management Policy",
    "policy_category": "HR",
    "policy_description": "Requirements for attendance, absence notification, manager escalation and documented attendance interventions",
    "effective_date": "2024-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-007",
    "policy_name": "Employee Document Accuracy Policy",
    "policy_category": "HR",
    "policy_description": "Employees are expected to provide accurate and authentic information and documentation; suspected irregularities must be verified before misconduct conclusions are reached",
    "effective_date": "2024-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-008",
    "policy_name": "Employee Investigation and Disciplinary Policy",
    "policy_category": "HR",
    "policy_description": "Framework for factual investigation, employee response, evidence assessment, proportionality and Legal review before material disciplinary action",
    "effective_date": "2024-01-01",
    "policy_status": "ACTIVE"
  },
  {
    "policy_id": "POL-009",
    "policy_name": "Performance Improvement Policy",
    "policy_category": "HR",
    "policy_description": "Standards for structured performance improvement plans, objective measurement and documentation of outcomes",
    "effective_date": "2024-01-01",
    "policy_status": "ACTIVE"
  }
]
```

### `data/raw/counsel.json`

```json
[
  {
    "counsel_id": "COUN-001",
    "counsel_name": "Adv. Sunita Rajani",
    "counsel_type": "EXTERNAL",
    "firm_name": "Rajani & Associates",
    "email": "sunita.rajani@rajaniassociates.in",
    "phone": "+91-22-22881234",
    "specialization": "Banking, SARFAESI, DRT",
    "counsel_status": "PREFERRED"
  },
  {
    "counsel_id": "COUN-002",
    "counsel_name": "Adv. Vikram Mehta",
    "counsel_type": "EXTERNAL",
    "firm_name": "Economic Laws Practice",
    "email": "vikram.mehta@elp.in",
    "phone": "+91-11-46001234",
    "specialization": "Banking, IBC, NCLT",
    "counsel_status": "PREFERRED"
  },
  {
    "counsel_id": "COUN-003",
    "counsel_name": "Adv. Anjali Kapoor",
    "counsel_type": "EXTERNAL",
    "firm_name": "Kapoor & Associates",
    "email": "anjali.kapoor@kapoorassociates.in",
    "phone": "+91-22-26781234",
    "specialization": "Property, Title Verification",
    "counsel_status": "PANEL"
  },
  {
    "counsel_id": "COUN-004",
    "counsel_name": "Adv. Rhea Sethi",
    "counsel_type": "EXTERNAL",
    "firm_name": "Sethi Employment Advisory",
    "email": "rhea.sethi@sethiemployment.example",
    "phone": "+91-80-40001234",
    "specialization": "Employment Law, Workplace Investigations",
    "counsel_status": "PANEL"
  }
]
```

### `data/raw/counsel_briefs.json`

```json
[
  {
    "brief_id": "BRIEF-001",
    "engagement_id": "ENG-001",
    "brief_title": "Recovery and Security Strategy Brief",
    "brief_date": "2025-08-25",
    "brief_status": "ISSUED",
    "created_date": "2025-08-22",
    "created_by": "USR-001"
  },
  {
    "brief_id": "BRIEF-002",
    "engagement_id": "ENG-002",
    "brief_title": "Employee Leave and Document Verification Brief",
    "brief_date": "2025-09-05",
    "brief_status": "DRAFT",
    "created_date": "2025-09-03",
    "created_by": "USR-001"
  }
]
```

### `data/raw/counsel_engagements.json`

```json
[
  {
    "engagement_id": "ENG-001",
    "matter_id": "MAT-001",
    "counsel_id": "COUN-001",
    "engagement_type": "RECOVERY_COUNSEL",
    "engagement_status": "ENGAGED",
    "engagement_date": "2025-08-25",
    "engagement_description": "External recovery counsel engaged to review recovery strategy, security position and enforcement options",
    "budget_inr": 800000,
    "created_date": "2025-08-22"
  },
  {
    "engagement_id": "ENG-002",
    "matter_id": "MAT-002",
    "counsel_id": "COUN-004",
    "engagement_type": "EMPLOYMENT_COUNSEL",
    "engagement_status": "PENDING",
    "engagement_date": "2025-09-05",
    "engagement_description": "Targeted external employment-law review proposed before material disciplinary decision",
    "budget_inr": 300000,
    "created_date": "2025-09-03"
  }
]
```

### `data/raw/counsel_outputs.json`

```json
[
  {
    "output_id": "OUT-001",
    "engagement_id": "ENG-001",
    "brief_id": "BRIEF-001",
    "output_type": "LEGAL_OPINION",
    "output_date": "2025-09-12",
    "output_status": "RECEIVED",
    "created_date": "2025-08-22",
    "opinion_summary": "Counsel considers Aster Fintech to have viable recovery options against Meridian Components based on the facility documentation, payment default, and existing security package. Counsel recommends progressing secured enforcement while preserving other recovery routes, including recovery against the corporate guarantor. Counsel considers the existing commercial-property documentation sufficient to begin enforcement preparation, while noting that the historical Zenith mortgage issue may still warrant additional verification and that no final title opinion is provided.",
    "opinion_sections": [
      {
        "opinion_section_id": "OPSEC-001",
        "section_type": "OVERALL_ADVICE",
        "section_title": "Overall Counsel Advice",
        "section_summary": "Aster has viable recovery options. Secured enforcement should progress as the principal strategy while preserving guarantee, debt-recovery, insolvency-related, and commercially credible settlement routes. Counsel does not provide a final title opinion.",
        "source_document_ids": ["DOC-001", "DOC-002", "DOC-003", "DOC-004"]
      },
      {
        "opinion_section_id": "OPSEC-002",
        "section_type": "RECOVERY_PATHWAY",
        "section_title": "Recovery Pathway",
        "section_summary": "Progress secured recovery/enforcement as the principal current strategy. Other recovery mechanisms remain available depending on the borrower's position and developments. Settlement may be considered if a commercially credible proposal preserves Aster's recovery rights.",
        "source_document_ids": ["DOC-004", "DOC-005", "DOC-006"]
      },
      {
        "opinion_section_id": "OPSEC-003",
        "section_type": "SECURITY_ENFORCEABILITY",
        "section_title": "Security Enforceability",
        "section_summary": "The commercial property, Corporate Guarantee, and charge over receivables are capable of supporting a recovery strategy based on the documents reviewed. The property security is sufficiently documented to progress enforcement preparation, subject to applicable legal and procedural requirements.",
        "source_document_ids": ["DOC-002", "DOC-003"]
      },
      {
        "opinion_section_id": "OPSEC-004",
        "section_type": "ZENITH_PRIOR_MORTGAGE",
        "section_title": "Zenith Prior Mortgage / Release Issue",
        "section_summary": "Counsel reviewed DOC-011, DOC-012, and DOC-013 and considers the available Release and Satisfaction Letter, together with current records, sufficient to progress enforcement preparation. Additional formal historical satisfaction evidence is not treated as a prerequisite, although further verification may remain appropriate during enforcement.",
        "source_document_ids": ["DOC-011", "DOC-012", "DOC-013"],
        "source_section_ids": ["SEC-DOC-037", "SEC-DOC-039", "SEC-DOC-040", "SEC-DOC-041", "SEC-DOC-042"]
      },
      {
        "opinion_section_id": "OPSEC-005",
        "section_type": "CORPORATE_GUARANTEE",
        "section_title": "Corporate Guarantee",
        "section_summary": "The Corporate Guarantee should be preserved as an additional recovery route and may be invoked in parallel with secured recovery where commercially appropriate. The opinion does not substantively assess the guarantor's current financial position, available assets, or practical recoverability.",
        "source_document_ids": ["DOC-003"]
      },
      {
        "opinion_section_id": "OPSEC-006",
        "section_type": "RECEIVABLES_CHARGE",
        "section_title": "Charge over Receivables",
        "section_summary": "The receivables charge forms part of the security package, but the opinion provides limited analysis of the current receivables pool, realizable value, competing claims, and practical enforcement steps.",
        "source_document_ids": ["DOC-002"]
      },
      {
        "opinion_section_id": "OPSEC-007",
        "section_type": "TIMING_COST_RISK",
        "section_title": "Timing, Cost, and Recovery Risks",
        "section_summary": "Timing depends on borrower challenge, procedural requirements, security challenges, asset realization, and parallel proceedings. No reliable fixed completion date or final cost estimate is provided. Risks include enforcement challenge, procedural delay, asset-realization uncertainty, further security investigation, guarantor uncertainty, and parallel proceedings."
      }
    ],
    "review_points": [
      {
        "review_point_id": "REVIEW-001",
        "review_title": "Prior Position Conflict — Zenith Mortgage Release",
        "review_type": "PRIOR_POSITION_CONFLICT",
        "severity": "HIGH",
        "counsel_position": "Counsel considers the Zenith Release and Satisfaction Letter, together with current records, sufficient to progress enforcement preparation without first obtaining additional formal evidence of historical satisfaction.",
        "matterbridge_review": "The company's existing evidence continues to identify the Zenith release as requiring verification. DOC-012 is not currently treated internally as conclusive evidence that the historical mortgage was formally satisfied. Relevant company evidence and historical precedent indicate that material ambiguity concerning a prior security interest should be resolved or explicitly accepted by Legal before relying on the affected asset as a primary enforcement route. MatterBridge should not conclude that external counsel is wrong; it should surface the difference between counsel's position, current company evidence, and relevant historical precedent.",
        "recommended_action": "ASK_COUNSEL",
        "suggested_question": "What specific evidence supports treating the 2019 Release and Satisfaction Letter as sufficient despite the company's current verification gap, and what enforcement risk remains if formal satisfaction evidence cannot be obtained?",
        "counsel_source_ids": ["OUT-001", "OPSEC-004"],
        "company_source_ids": ["DOC-012", "DOC-013", "HM-004"],
        "company_source_section_ids": ["SEC-DOC-039", "SEC-DOC-040", "SEC-DOC-041", "SEC-DOC-042"]
      },
      {
        "review_point_id": "REVIEW-002",
        "review_title": "Missing Issue — Guarantor Recoverability",
        "review_type": "MISSING_ISSUE",
        "severity": "MEDIUM",
        "counsel_position": "The Corporate Guarantee should be preserved as a parallel recovery route.",
        "matterbridge_review": "The opinion does not substantively assess the guarantor's current financial position, identifiable assets, or practical recoverability. The legal availability of a guarantee does not by itself establish its commercial recovery value.",
        "recommended_action": "ASK_COUNSEL",
        "suggested_question": "Please assess the guarantor's current financial position and practical recovery prospects before Aster commits material resources to guarantee enforcement.",
        "counsel_source_ids": ["OUT-001", "OPSEC-005"],
        "company_source_ids": ["DOC-003", "ISSUE-004"]
      },
      {
        "review_point_id": "REVIEW-003",
        "review_title": "Missing Analysis — Receivables Charge",
        "review_type": "MISSING_ISSUE",
        "severity": "MEDIUM",
        "counsel_position": "The charge over receivables forms part of the available security package.",
        "matterbridge_review": "The opinion does not materially analyze the current receivables pool, realizable value, competing claims, or practical enforcement considerations.",
        "recommended_action": "REQUEST_FURTHER_ANALYSIS",
        "suggested_question": "Please assess the current status and practical enforceability of the receivables charge, including the available receivables pool and any known competing claims.",
        "counsel_source_ids": ["OUT-001", "OPSEC-006"],
        "company_source_ids": ["DOC-002", "ISSUE-003"]
      },
      {
        "review_point_id": "REVIEW-004",
        "review_title": "Source Verification — Zenith Release Conclusion",
        "review_type": "VERIFY_EVIDENCE",
        "severity": "HIGH",
        "counsel_assertion": "The existing release documentation and current records provide sufficient basis to progress enforcement.",
        "matterbridge_review": "This conclusion depends materially on the interpretation of the historical Zenith release evidence. The underlying source should remain directly visible to the internal lawyer reviewing counsel's conclusion.",
        "recommended_action": "VERIFY_SOURCE",
        "counsel_source_ids": ["OUT-001", "OPSEC-004"],
        "company_source_ids": ["DOC-011", "DOC-012", "DOC-013"],
        "company_source_section_ids": ["SEC-DOC-037", "SEC-DOC-039", "SEC-DOC-040", "SEC-DOC-041", "SEC-DOC-042"]
      }
    ]
  }
]

```

### `data/raw/counsel_questions.json`

```json
[
  {
    "question_id": "Q-001",
    "brief_id": "BRIEF-001",
    "question_text": "Based on the facts and documentation provided, what is the optimal recovery pathway: SARFAESI enforcement, DRT application, or IBC initiation? Please provide comparative analysis of timeline, costs, and likelihood of recovery for each option.",
    "question_category": "STRATEGY",
    "question_priority": "HIGH",
    "created_date": "2025-08-22"
  },
  {
    "question_id": "Q-002",
    "brief_id": "BRIEF-001",
    "question_text": "Please confirm whether all security documents are properly executed, registered, and enforceable. Identify any gaps or defects in documentation or registration that could impede enforcement.",
    "question_category": "DOCUMENTATION",
    "question_priority": "HIGH",
    "created_date": "2025-08-22"
  },
  {
    "question_id": "Q-003",
    "brief_id": "BRIEF-001",
    "question_text": "What are the specific steps, timeline, and estimated costs for SARFAESI enforcement including possession notice, physical possession, and sale of secured assets?",
    "question_category": "PROCEDURE",
    "question_priority": "HIGH",
    "created_date": "2025-08-22"
  },
  {
    "question_id": "Q-004",
    "brief_id": "BRIEF-001",
    "question_text": "Should the corporate guarantee be invoked simultaneously with enforcement against the Borrower? What are the advantages and risks of this approach?",
    "question_category": "GUARANTEE",
    "question_priority": "MEDIUM",
    "created_date": "2025-08-22"
  },
  {
    "question_id": "Q-005",
    "brief_id": "BRIEF-001",
    "question_text": "What is the risk of the Borrower initiating pre-emptive proceedings under IBC or NCLT? How should we mitigate this risk?",
    "question_category": "RISK",
    "question_priority": "MEDIUM",
    "created_date": "2025-08-22"
  },
  {
    "question_id": "Q-006",
    "brief_id": "BRIEF-001",
    "question_text": "Please assess whether the unresolved historical mortgage and incomplete satisfaction evidence relating to the commercial property affects priority, enforceability or sequencing of recovery action against that asset.",
    "question_category": "SECURITY",
    "question_priority": "HIGH",
    "created_date": "2025-08-25"
  },
  {
    "question_id": "Q-007",
    "brief_id": "BRIEF-002",
    "question_text": "What further factual verification should HR complete regarding the submitted medical records before reaching any misconduct conclusion?",
    "question_category": "INVESTIGATION",
    "question_priority": "HIGH",
    "created_date": "2025-09-05"
  },
  {
    "question_id": "Q-008",
    "brief_id": "BRIEF-002",
    "question_text": "What legal protections or leave requirements should be considered in relation to the employee's reported miscarriage and requested leave?",
    "question_category": "LEAVE",
    "question_priority": "HIGH",
    "created_date": "2025-09-05"
  },
  {
    "question_id": "Q-009",
    "brief_id": "BRIEF-002",
    "question_text": "How should the company distinguish prior attendance and PIP history from the current document-verification issue when assessing disciplinary risk?",
    "question_category": "DISCIPLINE",
    "question_priority": "HIGH",
    "created_date": "2025-09-05"
  },
  {
    "question_id": "Q-010",
    "brief_id": "BRIEF-002",
    "question_text": "What process should the company follow before considering any final disciplinary action, including opportunity to respond and additional evidence gathering?",
    "question_category": "PROCEDURE",
    "question_priority": "HIGH",
    "created_date": "2025-09-05"
  }
]
```

### `data/raw/data_dictionary.json`

```json
[
  {
    "table_name": "matters",
    "column_name": "matter_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique matter identifier"
  },
  {
    "table_name": "matters",
    "column_name": "matter_type_id",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "YES",
    "foreign_key_table": "matter_types",
    "is_required": "YES",
    "description": "Reference to matter type"
  },
  {
    "table_name": "matters",
    "column_name": "matter_title",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Descriptive matter title"
  },
  {
    "table_name": "matters",
    "column_name": "risk_rating",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Risk rating: LOW, MEDIUM, HIGH"
  },
  {
    "table_name": "workstreams",
    "column_name": "workstream_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique workstream identifier"
  },
  {
    "table_name": "workstreams",
    "column_name": "matter_id",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "YES",
    "foreign_key_table": "matters",
    "is_required": "YES",
    "description": "Parent matter"
  },
  {
    "table_name": "workstreams",
    "column_name": "parent_workstream_id",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "YES",
    "foreign_key_table": "workstreams",
    "is_required": "NO",
    "description": "Parent workstream for nesting"
  },
  {
    "table_name": "documents",
    "column_name": "document_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique document identifier"
  },
  {
    "table_name": "documents",
    "column_name": "matter_id",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "YES",
    "foreign_key_table": "matters",
    "is_required": "YES",
    "description": "Parent matter"
  },
  {
    "table_name": "document_sections",
    "column_name": "section_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique section identifier"
  },
  {
    "table_name": "document_sections",
    "column_name": "document_id",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "YES",
    "foreign_key_table": "documents",
    "is_required": "YES",
    "description": "Parent document"
  },
  {
    "table_name": "legal_issues",
    "column_name": "issue_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique issue identifier"
  },
  {
    "table_name": "legal_issues",
    "column_name": "requires_legal_judgment",
    "data_type": "BOOLEAN",
    "is_primary_key": "NO",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Whether issue requires legal judgment"
  },
  {
    "table_name": "ai_findings",
    "column_name": "finding_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique finding identifier"
  },
  {
    "table_name": "ai_findings",
    "column_name": "confidence_level",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Confidence: LOW, MEDIUM, HIGH"
  },
  {
    "table_name": "decisions",
    "column_name": "decision_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique decision identifier"
  },
  {
    "table_name": "users",
    "column_name": "user_id",
    "data_type": "TEXT",
    "is_primary_key": "YES",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "Unique user identifier"
  },
  {
    "table_name": "users",
    "column_name": "user_role",
    "data_type": "TEXT",
    "is_primary_key": "NO",
    "is_foreign_key": "NO",
    "foreign_key_table": null,
    "is_required": "YES",
    "description": "User role in system"
  }
]
```

### `data/raw/dataset_summary.json`

```json
[
  {
    "table_name": "matter_types",
    "record_count": 2,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Reference data for matter types"
  },
  {
    "table_name": "matters",
    "record_count": 2,
    "last_updated": "2025-09-09",
    "population_status": "ACTIVE",
    "notes": "MAT-001 and MAT-002 populated for prototype workflows"
  },
  {
    "table_name": "workstreams",
    "record_count": 3,
    "last_updated": "2025-09-09",
    "population_status": "ACTIVE",
    "notes": "WS-001/002 for MAT-001, WS-003 for MAT-002"
  },
  {
    "table_name": "parties",
    "record_count": 4,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Lender, borrower, guarantor, employee"
  },
  {
    "table_name": "matter_parties",
    "record_count": 5,
    "last_updated": "2025-09-01",
    "population_status": "COMPLETE",
    "notes": "Party-matter relationships"
  },
  {
    "table_name": "assets",
    "record_count": 3,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "AST-001/002/003 for MAT-001"
  },
  {
    "table_name": "matter_assets",
    "record_count": 3,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Asset-matter linkages"
  },
  {
    "table_name": "security_interests",
    "record_count": 4,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "SEC-001/002/003"
  },
  {
    "table_name": "documents",
    "record_count": 22,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "DOC-001 through DOC-022"
  },
  {
    "table_name": "document_sections",
    "record_count": 59,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Sections populated for recovery, security verification, and HR source documents"
  },
  {
    "table_name": "matter_timeline",
    "record_count": 27,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Chronology from execution to counsel decision"
  },
  {
    "table_name": "legal_issues",
    "record_count": 15,
    "last_updated": "2025-09-09",
    "population_status": "ACTIVE",
    "notes": "Preliminary issues identified"
  },
  {
    "table_name": "company_policies",
    "record_count": 9,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Reference policies"
  },
  {
    "table_name": "counsel",
    "record_count": 4,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Panel counsel list"
  },
  {
    "table_name": "counsel_engagements",
    "record_count": 2,
    "last_updated": "2025-09-09",
    "population_status": "PENDING",
    "notes": "ENG-001 pending counsel selection"
  },
  {
    "table_name": "counsel_briefs",
    "record_count": 2,
    "last_updated": "2025-09-09",
    "population_status": "DRAFT",
    "notes": "BRIEF-001 draft"
  },
  {
    "table_name": "counsel_questions",
    "record_count": 10,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Questions for counsel"
  },
  {
    "table_name": "counsel_outputs",
    "record_count": 1,
    "last_updated": "2025-09-09",
    "population_status": "PENDING",
    "notes": "Awaiting counsel opinion"
  },
  {
    "table_name": "ai_findings",
    "record_count": 15,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "AI findings with confidence levels"
  },
  {
    "table_name": "finding_citations",
    "record_count": 21,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Citations for findings"
  },
  {
    "table_name": "decisions",
    "record_count": 2,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "DEC-001: escalate to counsel"
  },
  {
    "table_name": "decision_factors",
    "record_count": 6,
    "last_updated": "2025-08-22",
    "population_status": "COMPLETE",
    "notes": "Factors for DEC-001"
  },
  {
    "table_name": "historical_matters",
    "record_count": 6,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Recovery, security-defect, and HR historical precedents"
  },
  {
    "table_name": "users",
    "record_count": 6,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "System users including AI"
  },
  {
    "table_name": "matter_access",
    "record_count": 6,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Access permissions"
  },
  {
    "table_name": "audit_log",
    "record_count": 14,
    "last_updated": "2025-09-09",
    "population_status": "ACTIVE",
    "notes": "Audit trail"
  },
  {
    "table_name": "data_dictionary",
    "record_count": 18,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Schema documentation"
  },
  {
    "table_name": "dataset_summary",
    "record_count": 29,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "This summary table"
  },
  {
    "table_name": "asset_documents",
    "record_count": 8,
    "last_updated": "2025-09-09",
    "population_status": "COMPLETE",
    "notes": "Asset-document junction table for Security Verification"
  }
]
```

### `data/raw/decisions.json`

```json
[
  {
    "decision_id": "DEC-001",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "decision_type": "PROCESS",
    "decision_title": "Conditional Recovery Strategy",
    "decision_summary": "Internal Legal approved continued recovery preparation against Meridian Components while preserving multiple recovery routes. Material enforcement against the commercial property remains conditional on further treatment of the unresolved Zenith mortgage satisfaction issue or explicit documented acceptance of the residual risk.",
    "decision_status": "APPROVED_WITH_CONDITIONS",
    "decision_rationale": "Meridian Components remains in payment default with approximately INR 12.4 crore outstanding. Aster has multiple potential recovery routes and a security package comprising the commercial property, Corporate Guarantee, and charge over receivables. The unresolved Zenith mortgage/release issue creates uncertainty concerning reliance on the commercial property. External counsel considers the existing release evidence sufficient to progress enforcement preparation, but Internal Legal requires either further verification or explicit acceptance of the residual security risk before a material property-enforcement step. This approach allows recovery preparation to continue without treating an unresolved evidentiary issue as conclusively resolved.",
    "decision_date": "2025-09-16",
    "decided_by": "USR-001",
    "created_date": "2025-08-22",
    "selected_actions": [
      "Proceed with recovery preparation against Meridian Components while preserving multiple available recovery routes.",
      "Continue preparation relating to the secured recovery process without treating the Zenith release issue as conclusively resolved.",
      "Preserve recovery rights under the Corporate Guarantee.",
      "Obtain further analysis of guarantor recoverability and the receivables charge.",
      "Remain open to a commercially credible settlement without prejudicing existing recovery rights."
    ],
    "decision_factors": {
      "legal_risk": "MEDIUM-HIGH in relation to reliance on the commercial property until the Zenith issue is resolved or expressly accepted. Other recovery routes require separate assessment.",
      "recovery_probability": null,
      "cost": "Not yet sufficiently established. External legal and enforcement costs depend on the routes pursued and whether proceedings become contested.",
      "timeline": "Not fixed. Timing depends on security verification, procedural requirements, borrower response, enforcement route, and any contested proceedings.",
      "commercial_considerations": "A commercially credible settlement proposal may be considered. Settlement discussions should not unnecessarily prejudice Aster's recovery rights.",
      "process_legal_considerations": "Before material enforcement action, confirm applicable procedural prerequisites, complete required security verification, document Internal Legal's treatment of any remaining Zenith risk, and obtain required internal approvals."
    },
    "alternatives_considered": [
      {
        "alternative": "Proceed against the commercial property based solely on counsel's current opinion.",
        "decision": "NOT_SELECTED_AT_THIS_STAGE",
        "reason": "Internal evidence still contains an unresolved verification gap relating to the historical Zenith mortgage."
      },
      {
        "alternative": "Pause the entire recovery matter until the Zenith issue is completely resolved.",
        "decision": "NOT_SELECTED",
        "reason": "Uncertainty affecting one security asset does not require Aster to stop assessment or preservation of its other recovery routes."
      },
      {
        "alternative": "Pursue settlement as the sole strategy.",
        "decision": "NOT_SELECTED",
        "reason": "Settlement may be considered, but Aster should preserve its enforcement and recovery options."
      },
      {
        "alternative": "Conditional multi-route recovery strategy.",
        "decision": "SELECTED",
        "reason": "Recovery preparation can continue while the property-enforcement decision remains conditional on further treatment of the Zenith security issue."
      }
    ],
    "follow_up_actions": [
      {
        "action_id": "DEC001-ACT-001",
        "action": "Request further clarification from external counsel regarding the Zenith release conclusion.",
        "owner": "Internal Legal / External Counsel",
        "status": "OPEN"
      },
      {
        "action_id": "DEC001-ACT-002",
        "action": "Seek additional evidence of Zenith mortgage satisfaction where available.",
        "owner": "Internal Legal / External Counsel",
        "status": "OPEN"
      },
      {
        "action_id": "DEC001-ACT-003",
        "action": "Assess guarantor financial position and practical recoverability.",
        "owner": "External Counsel / Internal Legal",
        "status": "OPEN"
      },
      {
        "action_id": "DEC001-ACT-004",
        "action": "Obtain substantive analysis of the charge over receivables.",
        "owner": "External Counsel",
        "status": "OPEN"
      },
      {
        "action_id": "DEC001-ACT-005",
        "action": "Continue recovery preparation while preserving available recovery rights.",
        "owner": "Internal Legal / Recovery Team",
        "status": "IN_PROGRESS"
      }
    ],
    "decision_finality": "PROVISIONAL / APPROVED WITH CONDITIONS"
  },
  {
    "decision_id": "DEC-002",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "decision_type": "LEGAL_REVIEW",
    "decision_title": "Complete Verification and Seek Targeted Employment Counsel Advice",
    "decision_summary": "Internal Legal determined that document verification should be completed and targeted external employment-law advice obtained before any material disciplinary decision. Historical attendance and PIP records should be assessed separately from the current leave and document-verification inquiry.",
    "decision_status": "IN_PROGRESS",
    "decision_date": "2025-09-03",
    "decided_by": "USR-001",
    "created_date": "2025-09-03"
  }
]

```

### `data/raw/document_sections.json`

```json
[
  {
    "section_id": "SEC-DOC-001",
    "document_id": "DOC-001",
    "section_title": "Facility Amount and Terms",
    "section_content": "The Lender agrees to extend to the Borrower a secured term loan facility of INR 15,00,00,000 (Indian Rupees Fifteen Crore Only). The facility shall be disbursed in a single tranche upon satisfaction of conditions precedent outlined in Schedule A. The tenure of the facility shall be 60 (sixty) months from the date of first disbursement.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-002",
    "document_id": "DOC-001",
    "section_title": "Repayment Obligations",
    "section_content": "The Borrower shall repay the facility in 60 (sixty) equated monthly installments (EMIs) commencing from 2024-06-01. Each EMI shall comprise principal and interest components. The EMI amount shall be INR 32,50,000 (Indian Rupees Thirty-Two Lakh Fifty Thousand Only) payable on the 1st day of each calendar month. Prepayment is permitted subject to a prepayment penalty of 2% if prepaid within the first 24 months.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-003",
    "document_id": "DOC-001",
    "section_title": "Interest Provisions",
    "section_content": "The facility shall carry interest at the rate of 13.5% (Thirteen Point Five Percent) per annum, calculated on a daily reducing balance basis. Interest shall be compounded monthly. In the event of default, penal interest at an additional rate of 3% (Three Percent) per annum shall apply on the overdue amount from the date of default until payment in full.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-004",
    "document_id": "DOC-001",
    "section_title": "Events of Default",
    "section_content": "The following shall constitute events of default: (a) failure to pay any installment within 15 (fifteen) days of the due date; (b) breach of any covenant or representation; (c) insolvency or liquidation of the Borrower; (d) attachment or sale of any secured asset; (e) material adverse change in the Borrower's financial condition. Upon occurrence of an event of default, the Lender may declare the entire outstanding amount immediately due and payable.",
    "section_order": 4
  },
  {
    "section_id": "SEC-DOC-005",
    "document_id": "DOC-001",
    "section_title": "Cure Period",
    "section_content": "Notwithstanding clause 12 (Events of Default), the Borrower shall have a cure period of 30 (thirty) days from the date of receipt of written notice from the Lender specifying the default. During the cure period, the Borrower may remedy the default by payment of overdue amounts plus applicable penal interest. If the default is not cured within the cure period, the Lender's enforcement rights shall become exercisable.",
    "section_order": 5
  },
  {
    "section_id": "SEC-DOC-006",
    "document_id": "DOC-001",
    "section_title": "Enforcement Provisions",
    "section_content": "Upon the occurrence and continuance of an event of default, the Lender shall be entitled to: (a) enforce any or all security interests created in favor of the Lender; (b) take possession of secured assets; (c) appoint a receiver for the Borrower's business; (d) initiate proceedings under applicable laws including but not limited to SARFAESI Act, 2002, Recovery of Debts and Bankruptcy Act, 1993, or Insolvency and Bankruptcy Code, 2016. All costs of enforcement shall be borne by the Borrower.",
    "section_order": 6
  },
  {
    "section_id": "SEC-DOC-007",
    "document_id": "DOC-002",
    "section_title": "Security Package Description",
    "section_content": "The Borrower and third parties have created the following security package in favor of the Lender: (a) First mortgage by way of registered mortgage deed over commercial property at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059, bearing municipal no. A-45/2019, built-up area 12,500 sq ft; (b) Unconditional and irrevocable corporate guarantee by Rajesh Kumar Sharma; (c) First pari passu charge over all present and future book debts and receivables of the Borrower.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-008",
    "document_id": "DOC-002",
    "section_title": "Security Creation and Perfection",
    "section_content": "All security interests shall be created and perfected in accordance with applicable laws. The mortgage shall be registered with the Sub-Registrar of Assurances within 4 (four) months of execution. All charges shall be registered with CERSAI within 30 (thirty) days of creation. The Borrower shall execute all documents and do all acts necessary for creation, perfection, and registration of security interests.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-009",
    "document_id": "DOC-002",
    "section_title": "CERSAI Registration",
    "section_content": "The Borrower acknowledges that all security interests created in favor of the Lender shall be registered with the Central Registry of Securitisation Asset Reconstruction and Security Interest of India (CERSAI) in accordance with Section 20 of the SARFAESI Act, 2002. The Borrower authorizes the Lender to file necessary forms and particulars with CERSAI. All registration fees and costs shall be borne by the Borrower.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-010",
    "document_id": "DOC-002",
    "section_title": "Representations Regarding Security",
    "section_content": "The Borrower represents and warrants that: (a) it has clear, marketable, and encumbrance-free title to the mortgaged property except for prior charges disclosed in writing; (b) the property is free from all litigation, attachment, or encumbrance; (c) all documents relating to the property are genuine and valid; (d) no prior mortgage, charge, or lien exists on the property except as disclosed. Any breach of representations shall constitute an event of default.",
    "section_order": 4
  },
  {
    "section_id": "SEC-DOC-011",
    "document_id": "DOC-002",
    "section_title": "Enforcement of Security",
    "section_content": "Upon enforcement, the Lender shall be entitled to take all measures permitted by law including: (a) taking possession of secured assets; (b) sale or lease of secured assets by public auction or private treaty; (c) appointment of a manager or receiver; (d) recovery from guarantors; (e) recovery from receivables debtors. The Borrower shall not create any further charge or encumbrance on secured assets without prior written consent of the Lender.",
    "section_order": 5
  },
  {
    "section_id": "SEC-DOC-012",
    "document_id": "DOC-003",
    "section_title": "Guarantee Obligations",
    "section_content": "The Guarantor hereby unconditionally and irrevocably guarantees to the Lender the due and punctual payment and discharge of all obligations and liabilities of the Borrower under the Facility Agreement. This guarantee is a continuing guarantee and shall extend to the ultimate balance of sums payable by the Borrower, regardless of any intermediate payment or discharge.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-013",
    "document_id": "DOC-003",
    "section_title": "Guarantee Amount and Scope",
    "section_content": "This guarantee covers principal amount up to INR 15,00,00,000 (Indian Rupees Fifteen Crore Only) together with interest, penal interest, costs, charges, and expenses. The Guarantor's liability shall be that of a principal debtor and shall not be affected by any change in the constitution of the Borrower or the Lender, or by any forbearance or variation made by the Lender.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-014",
    "document_id": "DOC-003",
    "section_title": "Invocation of Guarantee",
    "section_content": "The Lender may invoke this guarantee at any time after the occurrence of an event of default under the Facility Agreement. The Guarantor shall pay the Lender within 7 (seven) days of receipt of written demand. The Guarantor waives all rights to require the Lender to first proceed against the Borrower or any other person or to enforce any other security before claiming against the Guarantor.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-015",
    "document_id": "DOC-003",
    "section_title": "Continuing Liability",
    "section_content": "This guarantee shall remain in full force and effect until all obligations of the Borrower are fully discharged. The Guarantor shall not revoke this guarantee without prior written consent of the Lender. The death, insolvency, or incapacity of the Guarantor shall not terminate this guarantee, and the Guarantor's legal heirs and estate shall remain liable.",
    "section_order": 4
  },
  {
    "section_id": "SEC-DOC-016",
    "document_id": "DOC-004",
    "section_title": "Disbursement History",
    "section_content": "Disbursement Date: 2024-03-20. Disbursement Amount: INR 15,00,00,000. Disbursement Mode: NEFT to Borrower's account with HDFC Bank, Account No. 50200012345678, IFSC: HDFC0001234. All conditions precedent satisfied as per certificate dated 2024-03-19 issued by advocates M/s. Kapoor & Associates.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-017",
    "document_id": "DOC-004",
    "section_title": "Repayment Schedule vs Actuals",
    "section_content": "Scheduled EMIs: 60 monthly installments of INR 32,50,000 each from 2024-06-01 to 2029-05-01. Repayments Received: Installments 1-10 (2024-06-01 to 2025-03-01): Paid in full and on time. Installments 11-15 (2025-04-01 to 2025-08-01): Not paid. Total EMIs paid: 10. Total EMIs overdue as of 2025-08-31: 5.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-018",
    "document_id": "DOC-004",
    "section_title": "Outstanding Exposure Calculation",
    "section_content": "As of 2025-08-31: Principal Outstanding: INR 12,00,00,000. Accrued Interest: INR 37,30,000. Penal Interest: INR 2,70,000. Total Outstanding Exposure: INR 12,40,00,000 (Indian Rupees Twelve Crore Forty Lakh Only). Five scheduled EMIs remain overdue from 2025-04-01 through 2025-08-01.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-019",
    "document_id": "DOC-005",
    "section_title": "Notice of Default",
    "section_content": "To: Meridian Components Private Limited. From: Aster Fintech Limited. Date: 2025-07-10. Subject: Notice of Default under Facility Agreement dated 2024-03-15. We hereby notify you that you are in default under the above-referenced Facility Agreement by reason of failure to pay equated monthly installments due on 2025-04-01, 2025-05-01, 2025-06-01, and 2025-07-01, each in the amount of INR 32,50,000. Total amount overdue as of date: INR 1,30,00,000 plus accrued interest and penal interest.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-020",
    "document_id": "DOC-005",
    "section_title": "Cure Period Invocation",
    "section_content": "Pursuant to Clause 12.5 (Cure Period) of the Facility Agreement, you are hereby granted a cure period of 30 (thirty) days from the date of receipt of this notice to remedy the default by payment of all overdue amounts together with applicable interest and penal interest. Payment must be received in our account no. 12345678901234, IFSC: HDFC0001234, by 2025-08-09.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-021",
    "document_id": "DOC-005",
    "section_title": "Consequences of Non-Cure",
    "section_content": "If the default is not cured within the cure period specified above, Aster Fintech Limited shall be entitled to exercise all rights and remedies available under the Facility Agreement, Security Documents, and applicable law, including but not limited to: (a) declaring the entire outstanding amount immediately due and payable; (b) enforcing security interests; (c) initiating recovery proceedings. All costs and expenses shall be to your account.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-022",
    "document_id": "DOC-006",
    "section_title": "Acknowledgment of Default",
    "section_content": "To: Aster Fintech Limited. From: Meridian Components Private Limited. Date: 2025-07-28. Subject: Response to Default Notice dated 2025-07-10. We acknowledge receipt of your notice dated 2025-07-10 and confirm that we are currently experiencing temporary financial difficulties due to delayed payments from our key customers and disruption in our supply chain. We have not been able to make the scheduled payments for April, May, June, and July 2025.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-023",
    "document_id": "DOC-006",
    "section_title": "Explanation of Financial Distress",
    "section_content": "Our company has been impacted by: (a) delayed receivables from two major customers totaling INR 8.5 crore, now overdue by 90-120 days; (b) temporary shutdown of one production line due to machinery breakdown requiring replacement parts from Germany, expected to be operational by September 2025; (c) increased raw material costs by approximately 18% due to global supply chain disruptions. These factors have resulted in temporary cash flow constraints.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-024",
    "document_id": "DOC-006",
    "section_title": "Request for Restructuring",
    "section_content": "We respectfully request Aster Fintech Limited to consider the following restructuring options: (a) moratorium on principal repayment for 6 months with interest servicing; (b) extension of loan tenure by 12 months; (c) conversion of overdue interest into funded interest term loan. We are committed to honoring our obligations and believe these measures will enable us to return to regular repayment by Q1 2026. We request a meeting to discuss this proposal.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-025",
    "document_id": "DOC-007",
    "section_title": "Credit Assessment Summary",
    "section_content": "Borrower: Meridian Components Private Limited. Facility: INR 15 crore secured term loan. Current Exposure: INR 12.4 crore (as of 2025-08-31). Days Past Due: 153 days. Current Risk Rating: HIGH (downgraded from MEDIUM on 2025-07-15). Security Coverage: Estimated at 1.45x based on last valuation (2024-02). Key Concerns: (a) 6 consecutive EMIs overdue; (b) borrower's financial position deteriorating; (c) no concrete restructuring proposal received; (d) security verification incomplete.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-026",
    "document_id": "DOC-007",
    "section_title": "Risk Rating Downgrade Rationale",
    "section_content": "Risk rating downgraded from MEDIUM to HIGH based on: (a) payment default exceeding 90 days; (b) borrower's admission of financial distress in response dated 2025-07-28; (c) lack of immediate liquidity to cure default; (d) concentration risk with delayed receivables from two customers; (e) operational issues affecting production capacity. Recommend immediate escalation to Legal for recovery assessment and external counsel engagement.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-027",
    "document_id": "DOC-007",
    "section_title": "Recommended Actions",
    "section_content": "Recommended actions: (a) escalate to Internal Legal for recovery strategy assessment; (b) engage external recovery counsel with expertise in SARFAESI and DRT matters; (c) initiate comprehensive security verification to confirm enforceability of all securities; (d) obtain updated valuation of mortgaged property; (e) verify CERSAI registration status; (f) assess guarantor's current financial position; (g) consider issuing demand notice to guarantor; (h) evaluate options: SARFAESI enforcement vs. DRT application vs. IBC initiation.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-028",
    "document_id": "DOC-007",
    "section_title": "Information Gaps",
    "section_content": "Critical information gaps identified: (a) latest borrower financials (last audited: FY2023-24); (b) current collateral valuation (last: 2024-02, pre-disbursement); (c) CERSAI registration certificate copy pending verification; (d) guarantor's current net worth and asset position; (e) status of receivables charge perfection; (f) title deed custody confirmation; (g) prior encumbrances on property; (h) borrower's other borrowing facilities and defaults.",
    "section_order": 4
  },
  {
    "section_id": "SEC-DOC-029",
    "document_id": "DOC-008",
    "section_title": "Matter Summary",
    "section_content": "Matter: Recovery of secured loan facility of INR 15 crore extended to Meridian Components Private Limited. Current Outstanding: INR 12.4 crore. Borrower in default since 2025-04-01 (153 days past due). Security package includes: (a) mortgage over commercial property in Mumbai; (b) corporate guarantee by Rajesh Kumar Sharma; (c) charge over receivables. Borrower has acknowledged default and requested restructuring. Credit Department recommends legal escalation.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-030",
    "document_id": "DOC-008",
    "section_title": "Documents Reviewed",
    "section_content": "Documents reviewed in preparation for external counsel engagement: (1) Facility Agreement dated 2024-03-15; (2) Security Agreement dated 2024-03-15; (3) Corporate Guarantee dated 2024-03-15; (4) Loan Account Summary as of 2025-08-31; (5) Default Notice dated 2025-07-10; (6) Borrower Response dated 2025-07-28; (7) Internal Credit Risk Memo dated 2025-08-15. All documents appear to be in order and properly executed.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-031",
    "document_id": "DOC-008",
    "section_title": "Preliminary Issues Identified",
    "section_content": "Preliminary legal issues requiring external counsel advice: (a) compliance with contractual notice requirements and cure period; (b) completeness and enforceability of security package; (c) guarantee position and invocation strategy; (d) appropriate recovery forum and mechanism (SARFAESI vs. DRT vs. IBC); (e) timeline and cost estimates for each recovery pathway; (f) likelihood of successful recovery given borrower's financial position; (g) risk of borrower initiating pre-emptive IBC or NCLT proceedings.",
    "section_order": 3
  },
  {
    "section_id": "SEC-DOC-032",
    "document_id": "DOC-008",
    "section_title": "Recommendation for External Counsel",
    "section_content": "Recommend engagement of external counsel specializing in secured lending recovery and enforcement. Counsel should be briefed to: (a) review all documentation and confirm enforceability; (b) advise on optimal recovery strategy and forum; (c) prepare and issue legal demand notice; (d) initiate enforcement proceedings if settlement not achieved; (e) provide timeline and cost estimates. Suggested counsel: M/s. Rajani & Associates (Mumbai) or M/s. Economic Laws Practice (Delhi). Budget estimate: INR 5-8 lakhs for initial engagement.",
    "section_order": 4
  },
  {
    "section_id": "SEC-DOC-033",
    "document_id": "DOC-009",
    "section_title": "Property Transfer",
    "section_content": "Under Sale Deed dated 1998-09-14, Shakti Industrial Estates Private Limited transferred the commercial property identified as Plot No. 45, Andheri-Kurla Road, Mumbai to Western Engineering Works Private Limited for stated consideration.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-034",
    "document_id": "DOC-009",
    "section_title": "Property Description",
    "section_content": "The property comprises approximately 12,500 square feet of built-up industrial and commercial premises together with associated land and appurtenant rights.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-035",
    "document_id": "DOC-010",
    "section_title": "2007 Conveyance",
    "section_content": "Western Engineering Works Private Limited conveyed the property to Meridian Components Private Limited pursuant to a restructuring transaction documented by Conveyance Deed dated 2007-03-22.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-036",
    "document_id": "DOC-010",
    "section_title": "Ownership Representation",
    "section_content": "The conveyance records Meridian Components Private Limited as transferee and states that the property is transferred together with all rights, easements and interests held by the transferor.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-037",
    "document_id": "DOC-011",
    "section_title": "Prior Mortgage Creation",
    "section_content": "Meridian Components Private Limited created a mortgage over the commercial property in favour of Zenith Commercial Bank Limited on 2014-06-18 to secure working capital facilities up to INR 9 crore.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-038",
    "document_id": "DOC-011",
    "section_title": "Release Requirement",
    "section_content": "The mortgage deed provides that the security shall continue until all secured obligations to Zenith Commercial Bank Limited are discharged and appropriate release documentation is issued.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-039",
    "document_id": "DOC-012",
    "section_title": "Release Statement",
    "section_content": "The letter states that credit facilities extended by Zenith Commercial Bank Limited to Meridian Components Private Limited were repaid and that the bank has no objection to release of security over the property.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-040",
    "document_id": "DOC-012",
    "section_title": "Verification Limitation",
    "section_content": "The available release letter does not contain a corresponding registration endorsement or certified satisfaction record confirming removal of the 2014 mortgage from all relevant security and property records.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-041",
    "document_id": "DOC-013",
    "section_title": "Current Search Result",
    "section_content": "The current search identifies Aster Fintech Limited's mortgage registered in 2024. Historical records also reference the 2014 Zenith Commercial Bank mortgage. The materials reviewed do not contain conclusive evidence confirming formal satisfaction of that earlier mortgage.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-042",
    "document_id": "DOC-013",
    "section_title": "Verification Requirement",
    "section_content": "External property counsel should confirm whether additional registry records, charge-satisfaction filings or lender confirmations are required to establish discharge of the earlier security interest.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-043",
    "document_id": "DOC-014",
    "section_title": "Valuation Conclusion",
    "section_content": "The February 2024 valuation assessed the property at approximately INR 18 crore based on prevailing comparable transactions and existing property use.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-044",
    "document_id": "DOC-014",
    "section_title": "Valuation Limitation",
    "section_content": "The report predates the current recovery assessment and should not be treated as evidence of current realizable value. An updated valuation is recommended before enforcement strategy is finalized.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-045",
    "document_id": "DOC-015",
    "section_title": "Leave Request",
    "section_content": "Priya Menon requested medical leave beginning 2025-08-25 following a reported miscarriage and submitted supporting medical documentation for HR review.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-046",
    "document_id": "DOC-015",
    "section_title": "Requested Leave Period",
    "section_content": "The employee requested 14 calendar days of leave and asked HR to confirm applicable medical and statutory leave treatment.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-047",
    "document_id": "DOC-016",
    "section_title": "Medical Certificate",
    "section_content": "The certificate states that Priya Menon received medical treatment and was advised rest beginning 2025-08-24.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-048",
    "document_id": "DOC-016",
    "section_title": "Document Verification Concern",
    "section_content": "The facility identifier and doctor registration format shown on the certificate differ from identifiers appearing on other documents supplied with the leave request and require verification.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-049",
    "document_id": "DOC-017",
    "section_title": "Consultation Details",
    "section_content": "The consultation receipt records a visit dated 2025-08-23 and contains a patient reference number that differs from the reference number appearing on the medical certificate.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-050",
    "document_id": "DOC-018",
    "section_title": "Attendance History",
    "section_content": "Over the preceding 12 months the employee recorded 17 unscheduled absence days. On five occasions the required manager notification process was not followed within the expected timeframe.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-051",
    "document_id": "DOC-018",
    "section_title": "Prior Interventions",
    "section_content": "The employee received two manager-level attendance interventions and one formal attendance warning before commencement of the performance improvement plan.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-052",
    "document_id": "DOC-019",
    "section_title": "PIP Objectives",
    "section_content": "The one-month performance improvement plan measured attendance reliability, client response SLA compliance, CRM record maintenance and manager communication.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-053",
    "document_id": "DOC-019",
    "section_title": "PIP Passing Threshold",
    "section_content": "The PIP required an overall score of at least 75 out of 100 with no critical compliance failure.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-054",
    "document_id": "DOC-020",
    "section_title": "PIP Result",
    "section_content": "Priya Menon completed the PIP with an overall score of 77 out of 100 and therefore met the stated passing threshold.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-055",
    "document_id": "DOC-020",
    "section_title": "Ongoing Observation",
    "section_content": "Although the employee passed the PIP, HR noted that attendance reliability and manager communication remained areas requiring monitoring.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-056",
    "document_id": "DOC-021",
    "section_title": "Employee Explanation",
    "section_content": "The employee stated that a family member assisted in collecting some medical records and that she was unaware of the inconsistencies identified by HR. She denied intentionally submitting inaccurate documentation.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-057",
    "document_id": "DOC-021",
    "section_title": "Replacement Information",
    "section_content": "The employee supplied an additional clarification document addressing one identifier discrepancy, but HR considered at least one verification question unresolved.",
    "section_order": 2
  },
  {
    "section_id": "SEC-DOC-058",
    "document_id": "DOC-022",
    "section_title": "HR Intake Summary",
    "section_content": "HR escalated the matter to Internal Legal because the matter combines a medically sensitive leave request, unresolved document-authenticity questions, prior attendance issues and a recently completed PIP.",
    "section_order": 1
  },
  {
    "section_id": "SEC-DOC-059",
    "document_id": "DOC-022",
    "section_title": "Requested Legal Assessment",
    "section_content": "HR requested advice on appropriate investigation steps, treatment of the leave request, separation of historic performance concerns from the current document-verification issue, procedural fairness and whether external employment counsel should be consulted before disciplinary action.",
    "section_order": 2
  }
]
```

### `data/raw/documents.json`

```json
[
  {
    "document_id": "DOC-001",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Facility Agreement",
    "document_type": "FINANCING_AGREEMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-002",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Security Agreement",
    "document_type": "SECURITY_DOCUMENT",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-003",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Corporate Guarantee",
    "document_type": "GUARANTEE_DEED",
    "document_date": "2024-03-15",
    "document_source": "LENDER_ORIGINATION",
    "document_status": "FINAL",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-004",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Repayment / Loan Account Summary",
    "document_type": "ACCOUNT_STATEMENT",
    "document_date": "2025-08-31",
    "document_source": "LENDER_SYSTEMS",
    "document_status": "FINAL",
    "created_date": "2025-08-31",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-005",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Default Notice",
    "document_type": "LEGAL_NOTICE",
    "document_date": "2025-07-10",
    "document_source": "LENDER_LEGAL",
    "document_status": "FINAL",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-006",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Borrower Response",
    "document_type": "CORRESPONDENCE",
    "document_date": "2025-07-28",
    "document_source": "BORROWER",
    "document_status": "FINAL",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-007",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Internal Credit Risk Memo",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-15",
    "document_source": "CREDIT_DEPT",
    "document_status": "FINAL",
    "created_date": "2025-08-15",
    "created_by": "USR-003"
  },
  {
    "document_id": "DOC-008",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "document_title": "Internal Legal Intake / Escalation Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-08-22",
    "document_source": "LEGAL_DEPT",
    "document_status": "FINAL",
    "created_date": "2025-08-22",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-009",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "document_title": "Sale Deed - Commercial Property",
    "document_type": "TITLE_DEED",
    "document_date": "1998-09-14",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-010",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "document_title": "Conveyance Deed - Commercial Property",
    "document_type": "CONVEYANCE_DEED",
    "document_date": "2007-03-22",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-011",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "document_title": "Prior Mortgage Deed - Zenith Commercial Bank",
    "document_type": "MORTGAGE_DEED",
    "document_date": "2014-06-18",
    "document_source": "TITLE_RECORDS",
    "document_status": "FINAL",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-012",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "document_title": "Release and Satisfaction Letter",
    "document_type": "RELEASE_DOCUMENT",
    "document_date": "2019-11-08",
    "document_source": "BORROWER_RECORDS",
    "document_status": "VERIFICATION_REQUIRED",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-013",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "document_title": "Current Security and Encumbrance Search",
    "document_type": "SECURITY_SEARCH",
    "document_date": "2025-08-19",
    "document_source": "LEGAL_SEARCH",
    "document_status": "FINAL",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "document_id": "DOC-014",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "document_title": "Property Valuation Report",
    "document_type": "VALUATION_REPORT",
    "document_date": "2024-02-12",
    "document_source": "VALUER",
    "document_status": "FINAL",
    "created_date": "2025-08-20",
    "created_by": "USR-003"
  },
  {
    "document_id": "DOC-015",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "Employee Leave Request",
    "document_type": "LEAVE_REQUEST",
    "document_date": "2025-08-25",
    "document_source": "EMPLOYEE",
    "document_status": "FINAL",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-016",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "Medical Certificate Submitted by Employee",
    "document_type": "MEDICAL_CERTIFICATE",
    "document_date": "2025-08-24",
    "document_source": "EMPLOYEE",
    "document_status": "VERIFICATION_REQUIRED",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-017",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "Consultation Receipt Submitted by Employee",
    "document_type": "MEDICAL_RECEIPT",
    "document_date": "2025-08-23",
    "document_source": "EMPLOYEE",
    "document_status": "VERIFICATION_REQUIRED",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-018",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "Employee Attendance Summary",
    "document_type": "ATTENDANCE_RECORD",
    "document_date": "2025-08-31",
    "document_source": "HR_SYSTEMS",
    "document_status": "FINAL",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-019",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "Performance Improvement Plan",
    "document_type": "PERFORMANCE_PLAN",
    "document_date": "2025-06-01",
    "document_source": "HR",
    "document_status": "FINAL",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-020",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "PIP Completion Assessment",
    "document_type": "PERFORMANCE_ASSESSMENT",
    "document_date": "2025-06-30",
    "document_source": "HR",
    "document_status": "FINAL",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-021",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "Employee Clarification on Medical Documents",
    "document_type": "EMPLOYEE_RESPONSE",
    "document_date": "2025-09-02",
    "document_source": "EMPLOYEE",
    "document_status": "FINAL",
    "created_date": "2025-09-02",
    "created_by": "USR-002"
  },
  {
    "document_id": "DOC-022",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "document_title": "HR Legal Intake Note",
    "document_type": "INTERNAL_MEMO",
    "document_date": "2025-09-03",
    "document_source": "HR",
    "document_status": "FINAL",
    "created_date": "2025-09-03",
    "created_by": "USR-002"
  }
]
```

### `data/raw/finding_citations.json`

```json
[
  {
    "citation_id": "CITE-001",
    "finding_id": "FIND-001",
    "source_type": "DOCUMENT",
    "source_id": "DOC-004",
    "source_section": "SEC-DOC-017",
    "citation_text": "Repayment Schedule vs Actuals section showing 5 EMIs overdue"
  },
  {
    "citation_id": "CITE-002",
    "finding_id": "FIND-001",
    "source_type": "DOCUMENT",
    "source_id": "DOC-006",
    "source_section": "SEC-DOC-022",
    "citation_text": "Borrower acknowledgment of default"
  },
  {
    "citation_id": "CITE-003",
    "finding_id": "FIND-002",
    "source_type": "DOCUMENT",
    "source_id": "DOC-004",
    "source_section": "SEC-DOC-018",
    "citation_text": "Outstanding Exposure Calculation section"
  },
  {
    "citation_id": "CITE-004",
    "finding_id": "FIND-003",
    "source_type": "DOCUMENT",
    "source_id": "DOC-002",
    "source_section": "SEC-DOC-007",
    "citation_text": "Security Package Description section"
  },
  {
    "citation_id": "CITE-005",
    "finding_id": "FIND-004",
    "source_type": "DOCUMENT",
    "source_id": "DOC-007",
    "source_section": "SEC-DOC-028",
    "citation_text": "Information Gaps section noting valuation missing"
  },
  {
    "citation_id": "CITE-006",
    "finding_id": "FIND-005",
    "source_type": "DOCUMENT",
    "source_id": "DOC-007",
    "source_section": "SEC-DOC-028",
    "citation_text": "Information Gaps section noting latest financials unavailable"
  },
  {
    "citation_id": "CITE-007",
    "finding_id": "FIND-006",
    "source_type": "LEGAL_ISSUE",
    "source_id": "ISSUE-005",
    "source_section": null,
    "citation_text": "Legal issue flagged as REQUIRES_LEGAL_JUDGMENT"
  },
  {
    "citation_id": "CITE-008",
    "finding_id": "FIND-007",
    "source_type": "DOCUMENT",
    "source_id": "DOC-011",
    "source_section": "SEC-DOC-037",
    "citation_text": "Prior Mortgage Creation"
  },
  {
    "citation_id": "CITE-009",
    "finding_id": "FIND-008",
    "source_type": "DOCUMENT",
    "source_id": "DOC-012",
    "source_section": "SEC-DOC-039",
    "citation_text": "Release Statement"
  },
  {
    "citation_id": "CITE-010",
    "finding_id": "FIND-008",
    "source_type": "DOCUMENT",
    "source_id": "DOC-012",
    "source_section": "SEC-DOC-040",
    "citation_text": "Verification Limitation"
  },
  {
    "citation_id": "CITE-011",
    "finding_id": "FIND-008",
    "source_type": "DOCUMENT",
    "source_id": "DOC-013",
    "source_section": "SEC-DOC-041",
    "citation_text": "Current Search Result"
  },
  {
    "citation_id": "CITE-012",
    "finding_id": "FIND-009",
    "source_type": "DOCUMENT",
    "source_id": "DOC-013",
    "source_section": "SEC-DOC-041",
    "citation_text": "Current Search Result"
  },
  {
    "citation_id": "CITE-013",
    "finding_id": "FIND-010",
    "source_type": "DOCUMENT",
    "source_id": "DOC-013",
    "source_section": "SEC-DOC-042",
    "citation_text": "Verification Requirement"
  },
  {
    "citation_id": "CITE-014",
    "finding_id": "FIND-010",
    "source_type": "LEGAL_ISSUE",
    "source_id": "ISSUE-010",
    "source_section": null,
    "citation_text": "Security verification affects recovery strategy and requires legal judgment"
  },
  {
    "citation_id": "CITE-015",
    "finding_id": "FIND-011",
    "source_type": "DOCUMENT",
    "source_id": "DOC-016",
    "source_section": "SEC-DOC-048",
    "citation_text": "Document Verification Concern"
  },
  {
    "citation_id": "CITE-016",
    "finding_id": "FIND-011",
    "source_type": "DOCUMENT",
    "source_id": "DOC-017",
    "source_section": "SEC-DOC-049",
    "citation_text": "Consultation identifier discrepancy"
  },
  {
    "citation_id": "CITE-017",
    "finding_id": "FIND-012",
    "source_type": "DOCUMENT",
    "source_id": "DOC-018",
    "source_section": "SEC-DOC-050",
    "citation_text": "Attendance History"
  },
  {
    "citation_id": "CITE-018",
    "finding_id": "FIND-012",
    "source_type": "DOCUMENT",
    "source_id": "DOC-018",
    "source_section": "SEC-DOC-051",
    "citation_text": "Prior Interventions"
  },
  {
    "citation_id": "CITE-019",
    "finding_id": "FIND-013",
    "source_type": "DOCUMENT",
    "source_id": "DOC-020",
    "source_section": "SEC-DOC-054",
    "citation_text": "PIP Result"
  },
  {
    "citation_id": "CITE-020",
    "finding_id": "FIND-014",
    "source_type": "DOCUMENT",
    "source_id": "DOC-022",
    "source_section": "SEC-DOC-059",
    "citation_text": "Requested Legal Assessment"
  },
  {
    "citation_id": "CITE-021",
    "finding_id": "FIND-015",
    "source_type": "LEGAL_ISSUE",
    "source_id": "ISSUE-015",
    "source_section": null,
    "citation_text": "Disciplinary action requires Legal judgment"
  }
]
```

### `data/raw/historical_matters.json`

```json
[
  {
    "historical_matter_id": "HM-001",
    "matter_reference": "MATTER-2023-045",
    "matter_type": "secured_loan_recovery",
    "outcome": "FULL_RECOVERY",
    "recovery_amount_inr": 85000000,
    "recovery_percentage": 100,
    "timeline_months": 8,
    "lessons_learned": "SARFAESI enforcement effective for commercial property with clear title. Timeline: 8 months from notice to sale completion.",
    "created_date": "2024-01-01"
  },
  {
    "historical_matter_id": "HM-002",
    "matter_reference": "MATTER-2023-067",
    "matter_type": "secured_loan_recovery",
    "outcome": "PARTIAL_RECOVERY",
    "recovery_amount_inr": 42000000,
    "recovery_percentage": 65,
    "timeline_months": 14,
    "lessons_learned": "Multiple securities helped but property title dispute delayed enforcement. Recommend enhanced title verification pre-disbursement.",
    "created_date": "2024-01-01"
  },
  {
    "historical_matter_id": "HM-003",
    "matter_reference": "MATTER-2024-012",
    "matter_type": "secured_loan_recovery",
    "outcome": "SETTLEMENT",
    "recovery_amount_inr": 95000000,
    "recovery_percentage": 85,
    "timeline_months": 5,
    "lessons_learned": "Early engagement and restructuring proposal led to settlement. Faster recovery than enforcement but required concession.",
    "created_date": "2024-06-01"
  },
  {
    "historical_matter_id": "HM-004",
    "matter_reference": "MATTER-2024-031",
    "matter_type": "secured_loan_recovery",
    "outcome": "PARTIAL_RECOVERY",
    "recovery_amount_inr": 61000000,
    "recovery_percentage": 72,
    "timeline_months": 11,
    "lessons_learned": "Recovery was delayed because a prior mortgage satisfaction entry was incomplete. External title verification resolved priority before enforcement proceeded.",
    "created_date": "2025-01-01"
  },
  {
    "historical_matter_id": "HM-005",
    "matter_reference": "MATTER-2024-HR-018",
    "matter_type": "hr_employment",
    "outcome": "INTERNAL_RESOLUTION",
    "recovery_amount_inr": 0,
    "recovery_percentage": 0,
    "timeline_months": 2,
    "lessons_learned": "Medical-document discrepancies were investigated separately from attendance history. No disciplinary conclusion was reached until source verification and employee clarification were complete.",
    "created_date": "2025-01-01"
  },
  {
    "historical_matter_id": "HM-006",
    "matter_reference": "MATTER-2025-HR-007",
    "matter_type": "hr_employment",
    "outcome": "FINAL_WARNING",
    "recovery_amount_inr": 0,
    "recovery_percentage": 0,
    "timeline_months": 1,
    "lessons_learned": "Employee had prior attendance issues but had formally completed a PIP. Subsequent misconduct allegation was assessed independently and resulted in targeted disciplinary action based only on verified facts.",
    "created_date": "2025-06-01"
  }
]
```

### `data/raw/legal_issues.json`

```json
[
  {
    "issue_id": "ISSUE-001",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "issue_title": "Continuing Payment Default",
    "issue_description": "Borrower has failed to pay 5 consecutive monthly installments from April 2025 through August 2025 totaling INR 1,62,50,000 in scheduled EMIs, together with accrued and penal interest. The first payment default occurred on 2025-04-01 and remains uncured as of 2025-08-31.",
    "issue_status": "ACTIVE",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "NO",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-002",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "issue_title": "Compliance with Contractual Notice Requirements",
    "issue_description": "Whether default notice dated 2025-07-10 was properly served in accordance with Clause 18.3 of Facility Agreement (notice requirements). Notice sent via registered post and email. Borrower acknowledged receipt in response dated 2025-07-28. Cure period of 30 days expired on 2025-08-09 without payment.",
    "issue_status": "ACTIVE",
    "issue_priority": "MEDIUM",
    "requires_legal_judgment": "NO",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-003",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "issue_title": "Completeness of Security Package",
    "issue_description": "Security package comprises three securities: (a) mortgage over commercial property; (b) corporate guarantee; (c) charge over receivables. All securities appear to be documented. However, verification of CERSAI registration certificates, title deed custody, and prior encumbrances remains incomplete pending WS-002 Security Verification workstream.",
    "issue_status": "IN_PROGRESS",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "NO",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-004",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "issue_title": "Guarantee Position Requiring Review",
    "issue_description": "Corporate guarantee executed by Rajesh Kumar Sharma for INR 15 crore plus interest. Guarantee is unconditional and irrevocable. However, guarantor's current financial position, net worth, and asset availability have not been assessed. Recommend verification before guarantee invocation.",
    "issue_status": "ACTIVE",
    "issue_priority": "MEDIUM",
    "requires_legal_judgment": "NO",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-005",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "issue_title": "Appropriate Recovery/Enforcement Strategy",
    "issue_description": "Multiple recovery pathways potentially available: (a) SARFAESI Act enforcement (possession and sale of secured assets); (b) DRT application for recovery certificate; (c) IBC initiation if borrower insolvent; (d) civil suit. Optimal pathway depends on: security enforceability, borrower solvency, asset valuation, timeline, costs, and likelihood of recovery. REQUIRES_LEGAL_JUDGMENT by qualified counsel.",
    "issue_status": "ACTIVE",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-08-22",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-006",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "issue_title": "Security Verification Workstream Incomplete",
    "issue_description": "WS-002 Security Verification workstream remains in progress. Critical verification items pending: (a) title deed examination and ownership history; (b) prior mortgage/charge search; (c) CERSAI registration confirmation; (d) current property valuation; (e) receivables charge perfection status. Recovery strategy cannot be finalized until security verification complete.",
    "issue_status": "IN_PROGRESS",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "NO",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-007",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "issue_title": "Prior Mortgage Requires Verification",
    "issue_description": "Historical title and security records show a mortgage created in 2014 in favour of Zenith Commercial Bank Limited. Available records indicate repayment but formal satisfaction evidence has not yet been conclusively verified.",
    "issue_status": "IN_PROGRESS",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-008",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "issue_title": "Release Documentation Incomplete",
    "issue_description": "A 2019 release letter exists, but available evidence does not include a corresponding certified satisfaction or registration record conclusively demonstrating discharge of the prior mortgage.",
    "issue_status": "IN_PROGRESS",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-009",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "issue_title": "Current Property Valuation Outdated",
    "issue_description": "The latest available property valuation is dated February 2024 and may not reflect current realizable value for recovery planning.",
    "issue_status": "ACTIVE",
    "issue_priority": "MEDIUM",
    "requires_legal_judgment": "NO",
    "created_date": "2025-08-20",
    "created_by": "USR-003"
  },
  {
    "issue_id": "ISSUE-010",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "issue_title": "Impact of Security Verification on Recovery Strategy",
    "issue_description": "Unresolved historical mortgage and release evidence may affect the timing, process or strategy for enforcement against the property. External counsel judgment is required before relying on the property as an immediately enforceable recovery asset.",
    "issue_status": "ACTIVE",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-08-20",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-011",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "issue_title": "Medical Document Authenticity Requires Verification",
    "issue_description": "Multiple identifiers across submitted medical documents are inconsistent. The available evidence does not establish whether the inconsistencies resulted from fraud, administrative error or another cause.",
    "issue_status": "IN_PROGRESS",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-09-03",
    "created_by": "USR-002"
  },
  {
    "issue_id": "ISSUE-012",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "issue_title": "Leave Request Requires Legal Review",
    "issue_description": "The employee's request relates to a reported miscarriage and may engage statutory or legally protected leave rights. Appropriate treatment should be confirmed by qualified Legal review.",
    "issue_status": "ACTIVE",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-09-03",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-013",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "issue_title": "Prior Attendance and PIP History",
    "issue_description": "Documented attendance issues and a recent PIP exist, but the employee formally passed the PIP with a score of 77 against the required threshold of 75.",
    "issue_status": "ACTIVE",
    "issue_priority": "MEDIUM",
    "requires_legal_judgment": "NO",
    "created_date": "2025-09-03",
    "created_by": "USR-002"
  },
  {
    "issue_id": "ISSUE-014",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "issue_title": "Separation of Historical Performance from Current Investigation",
    "issue_description": "Prior attendance/performance history should be evaluated separately from the current leave request and document-verification inquiry so that each issue is supported by its own evidence.",
    "issue_status": "ACTIVE",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-09-03",
    "created_by": "USR-001"
  },
  {
    "issue_id": "ISSUE-015",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "issue_title": "Disciplinary Action Requires Legal Judgment",
    "issue_description": "Whether any disciplinary action is appropriate depends on completion of factual verification, employee response, applicable leave protections, company policy and procedural fairness.",
    "issue_status": "ACTIVE",
    "issue_priority": "HIGH",
    "requires_legal_judgment": "YES",
    "created_date": "2025-09-03",
    "created_by": "USR-001"
  }
]
```

### `data/raw/matter_access.json`

```json
[
  {
    "access_id": "ACC-001",
    "matter_id": "MAT-001",
    "user_id": "USR-001",
    "access_level": "OWNER",
    "granted_date": "2025-08-15",
    "granted_by": "USR-004"
  },
  {
    "access_id": "ACC-002",
    "matter_id": "MAT-001",
    "user_id": "USR-003",
    "access_level": "EDIT",
    "granted_date": "2025-08-15",
    "granted_by": "USR-001"
  },
  {
    "access_id": "ACC-003",
    "matter_id": "MAT-001",
    "user_id": "USR-004",
    "access_level": "VIEW",
    "granted_date": "2025-08-15",
    "granted_by": "USR-001"
  },
  {
    "access_id": "ACC-004",
    "matter_id": "MAT-002",
    "user_id": "USR-002",
    "access_level": "OWNER",
    "granted_date": "2025-09-01",
    "granted_by": "USR-004"
  },
  {
    "access_id": "ACC-005",
    "matter_id": "MAT-002",
    "user_id": "USR-001",
    "access_level": "EDIT",
    "granted_date": "2025-09-01",
    "granted_by": "USR-002"
  },
  {
    "access_id": "ACC-006",
    "matter_id": "MAT-002",
    "user_id": "USR-005",
    "access_level": "LIMITED",
    "granted_date": "2025-09-05",
    "granted_by": "USR-001"
  }
]
```

### `data/raw/matter_assets.json`

```json
[
  {
    "matter_asset_id": "MA-001",
    "matter_id": "MAT-001",
    "asset_id": "AST-001",
    "security_interest_id": "SEC-001",
    "created_date": "2025-08-15"
  },
  {
    "matter_asset_id": "MA-002",
    "matter_id": "MAT-001",
    "asset_id": "AST-002",
    "security_interest_id": "SEC-002",
    "created_date": "2025-08-15"
  },
  {
    "matter_asset_id": "MA-003",
    "matter_id": "MAT-001",
    "asset_id": "AST-003",
    "security_interest_id": "SEC-003",
    "created_date": "2025-08-15"
  }
]
```

### `data/raw/matter_timeline.json`

```json
[
  {
    "timeline_id": "TM-001",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2024-03-15",
    "event_type": "AGREEMENT_EXECUTION",
    "event_title": "Facility Agreement Execution",
    "event_description": "Facility Agreement, Security Agreement, and Corporate Guarantee executed by all parties at Aster Fintech Limited office, Noida",
    "related_document_id": "DOC-001",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-002",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2024-03-20",
    "event_type": "DISBURSEMENT",
    "event_title": "Loan Disbursement",
    "event_description": "Full facility amount of INR 15 crore disbursed to Borrower's account with HDFC Bank via NEFT",
    "related_document_id": "DOC-004",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-003",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2024-03-18",
    "event_type": "SECURITY_CREATION",
    "event_title": "Property Mortgage Execution",
    "event_description": "Registered mortgage deed executed over commercial property at Andheri-Kurla Road, Mumbai before Sub-Registrar of Assurances, Mumbai",
    "related_document_id": "DOC-002",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-004",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2024-04-05",
    "event_type": "REGISTRATION",
    "event_title": "CERSAI Registration",
    "event_description": "Security interests registered with CERSAI (Registration Nos. CERSAI-2024-0315-789456 and CERSAI-2024-0315-789457)",
    "related_document_id": "DOC-002",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-005",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2024-06-01",
    "event_type": "REPAYMENT_DUE",
    "event_title": "First EMI Due",
    "event_description": "First equated monthly installment of INR 32,50,000 due and paid on time",
    "related_document_id": "DOC-004",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-006",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-03-01",
    "event_type": "REPAYMENT_RECEIVED",
    "event_title": "Last Timely Repayment",
    "event_description": "Tenth EMI of INR 32,50,000 paid on time. Total repaid to date: INR 3,25,00,000",
    "related_document_id": "DOC-004",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-007",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-04-01",
    "event_type": "DEFAULT_FIRST",
    "event_title": "First Payment Default",
    "event_description": "Eleventh EMI of INR 32,50,000 not received on due date. First instance of payment delay",
    "related_document_id": "DOC-004",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-008",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-07-01",
    "event_type": "DEFAULT_CONTINUING",
    "event_title": "Continuing Defaults",
    "event_description": "Four consecutive EMIs are now overdue for April, May, June and July 2025. Total scheduled overdue payments: INR 1,30,00,000 plus applicable interest.",
    "related_document_id": "DOC-004",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-009",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-07-10",
    "event_type": "LEGAL_NOTICE",
    "event_title": "Default Notice Issued",
    "event_description": "Formal default notice issued to Borrower under Clause 12 of Facility Agreement, invoking 30-day cure period",
    "related_document_id": "DOC-005",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-010",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-07-28",
    "event_type": "BORROWER_RESPONSE",
    "event_title": "Borrower Response Received",
    "event_description": "Borrower acknowledged default, explained financial distress, and requested loan restructuring",
    "related_document_id": "DOC-006",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-011",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-08-15",
    "event_type": "INTERNAL_ESCALATION",
    "event_title": "Credit Escalation to Legal",
    "event_description": "Credit Department escalated matter to Internal Legal with HIGH risk rating and recommendation for external counsel",
    "related_document_id": "DOC-007",
    "created_date": "2025-08-15"
  },
  {
    "timeline_id": "TM-012",
    "matter_id": "MAT-001",
    "workstream_id": "WS-001",
    "event_date": "2025-08-22",
    "event_type": "DECISION_EXTERNAL_COUNSEL",
    "event_title": "Decision to Engage External Counsel",
    "event_description": "Internal Legal approved engagement of external recovery counsel. Matter ready for counsel briefing",
    "related_document_id": "DOC-008",
    "created_date": "2025-08-22"
  },
  {
    "timeline_id": "TM-013",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "event_date": "1998-09-14",
    "event_type": "TITLE_EVENT",
    "event_title": "Original Sale Deed",
    "event_description": "Property transferred to Western Engineering Works Private Limited",
    "related_document_id": "DOC-009",
    "created_date": "2025-08-20"
  },
  {
    "timeline_id": "TM-014",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "event_date": "2007-03-22",
    "event_type": "TITLE_EVENT",
    "event_title": "Conveyance to Meridian",
    "event_description": "Property conveyed to Meridian Components Private Limited",
    "related_document_id": "DOC-010",
    "created_date": "2025-08-20"
  },
  {
    "timeline_id": "TM-015",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "event_date": "2014-06-18",
    "event_type": "PRIOR_SECURITY",
    "event_title": "Prior Mortgage Created",
    "event_description": "Mortgage created in favour of Zenith Commercial Bank Limited",
    "related_document_id": "DOC-011",
    "created_date": "2025-08-20"
  },
  {
    "timeline_id": "TM-016",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "event_date": "2019-11-08",
    "event_type": "RELEASE_RECORD",
    "event_title": "Purported Release",
    "event_description": "Zenith Commercial Bank issued release and satisfaction letter; formal satisfaction evidence remains to be verified",
    "related_document_id": "DOC-012",
    "created_date": "2025-08-20"
  },
  {
    "timeline_id": "TM-017",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "event_date": "2024-03-18",
    "event_type": "SECURITY_CREATION",
    "event_title": "Aster Mortgage Created",
    "event_description": "Property mortgaged in favour of Aster Fintech Limited",
    "related_document_id": "DOC-002",
    "created_date": "2025-08-20"
  },
  {
    "timeline_id": "TM-018",
    "matter_id": "MAT-001",
    "workstream_id": "WS-002",
    "event_date": "2025-08-19",
    "event_type": "SECURITY_SEARCH",
    "event_title": "Security Search Completed",
    "event_description": "Search confirms Aster security but identifies unresolved historical mortgage record",
    "related_document_id": "DOC-013",
    "created_date": "2025-08-20"
  },
  {
    "timeline_id": "TM-019",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-06-01",
    "event_type": "PIP_START",
    "event_title": "Performance Improvement Plan Started",
    "event_description": "One-month PIP commenced covering attendance, SLA compliance, CRM hygiene and manager communication",
    "related_document_id": "DOC-019",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-020",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-06-30",
    "event_type": "PIP_COMPLETE",
    "event_title": "PIP Completed",
    "event_description": "Employee achieved 77/100 against required threshold of 75/100",
    "related_document_id": "DOC-020",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-021",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-08-25",
    "event_type": "LEAVE_REQUEST",
    "event_title": "Medical Leave Requested",
    "event_description": "Employee submitted leave request following reported miscarriage",
    "related_document_id": "DOC-015",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-022",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-08-25",
    "event_type": "DOCUMENT_SUBMISSION",
    "event_title": "Medical Records Submitted",
    "event_description": "Employee submitted medical certificate and consultation receipt",
    "related_document_id": "DOC-016",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-023",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-08-28",
    "event_type": "VERIFICATION_FLAG",
    "event_title": "Document Discrepancies Identified",
    "event_description": "HR identified inconsistent identifiers across supporting medical documents",
    "related_document_id": "DOC-016",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-024",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-08-29",
    "event_type": "HR_REVIEW",
    "event_title": "Attendance History Reviewed",
    "event_description": "HR reviewed prior absences, warning history and completed PIP",
    "related_document_id": "DOC-018",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-025",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-09-01",
    "event_type": "CLARIFICATION_REQUEST",
    "event_title": "Employee Clarification Requested",
    "event_description": "HR asked employee to explain discrepancies in submitted medical records",
    "related_document_id": "DOC-016",
    "created_date": "2025-09-01"
  },
  {
    "timeline_id": "TM-026",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-09-02",
    "event_type": "EMPLOYEE_RESPONSE",
    "event_title": "Employee Clarification Received",
    "event_description": "Employee denied intentional falsification and explained family assistance in obtaining records",
    "related_document_id": "DOC-021",
    "created_date": "2025-09-02"
  },
  {
    "timeline_id": "TM-027",
    "matter_id": "MAT-002",
    "workstream_id": "WS-003",
    "event_date": "2025-09-03",
    "event_type": "LEGAL_ESCALATION",
    "event_title": "HR Escalates Matter to Legal",
    "event_description": "HR requested Legal assessment before taking disciplinary action",
    "related_document_id": "DOC-022",
    "created_date": "2025-09-03"
  }
]
```

### `data/raw/matter_types.json`

```json
[
  {
    "matter_type_id": "MT-001",
    "matter_type_name": "secured_loan_recovery",
    "description": "Secured loan recovery and enforcement matters",
    "created_date": "2024-01-01"
  },
  {
    "matter_type_id": "MT-002",
    "matter_type_name": "hr_employment",
    "description": "HR and employment-related legal matters",
    "created_date": "2024-01-01"
  }
]
```

### `data/raw/matters.json`

```json
[
  {
    "matter_id": "MAT-001",
    "matter_type_id": "MT-001",
    "matter_title": "Meridian Components — Secured Loan Recovery",
    "matter_description": "Recovery of secured financing extended to Meridian Components Private Limited",
    "client_id": "PARTY-001",
    "counterparty_id": "PARTY-002",
    "matter_status": "COUNSEL_ENGAGED",
    "risk_rating": "HIGH",
    "outstanding_exposure_inr": 124000000,
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "matter_id": "MAT-002",
    "matter_type_id": "MT-002",
    "matter_title": "Project Atlas — Employee Leave & Misconduct Review",
    "matter_description": "Employee leave and misconduct review matter",
    "client_id": "PARTY-001",
    "counterparty_id": "PARTY-004",
    "matter_status": "INTERNAL_REVIEW",
    "risk_rating": "MEDIUM",
    "outstanding_exposure_inr": 0,
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  }
]
```

### `data/raw/parties.json`

```json
[
  {
    "party_id": "PARTY-001",
    "party_name": "Aster Fintech Limited",
    "party_type": "LENDER",
    "registration_number": "U65923DL2018PLC334567",
    "registered_address": "A-42, Sector 63, Noida, Uttar Pradesh 201301",
    "contact_email": "legal@asterfintech.in",
    "contact_phone": "+91-120-4567890",
    "created_date": "2024-01-01"
  },
  {
    "party_id": "PARTY-002",
    "party_name": "Meridian Components Private Limited",
    "party_type": "BORROWER",
    "registration_number": "U29100MH2015PTC267890",
    "registered_address": "Plot 15-B, MIDC Industrial Area, Andheri East, Mumbai 400093",
    "contact_email": "info@meridiancomponents.in",
    "contact_phone": "+91-22-28765432",
    "created_date": "2024-03-10"
  },
  {
    "party_id": "PARTY-003",
    "party_name": "Rajesh Kumar Sharma",
    "party_type": "GUARANTOR",
    "registration_number": "AADPS1234K",
    "registered_address": "B-204, Silver Oaks Apartments, Bandra West, Mumbai 400050",
    "contact_email": "rajesh.sharma@email.com",
    "contact_phone": "+91-9820012345",
    "created_date": "2024-03-10"
  },
  {
    "party_id": "PARTY-004",
    "party_name": "Priya Menon",
    "party_type": "EMPLOYEE",
    "registration_number": "ABCDE1234F",
    "registered_address": "Flat 302, Green Valley Residency, Koramangala, Bangalore 560034",
    "contact_email": "priya.menon@email.com",
    "contact_phone": "+91-9845067890",
    "created_date": "2025-09-01"
  }
]
```

### `data/raw/security_interests.json`

```json
[
  {
    "security_interest_id": "SEC-001",
    "security_type": "MORTGAGE",
    "security_description": "First mortgage by way of registered mortgage deed over commercial property at Plot No. 45, Andheri-Kurla Road, Andheri East, Mumbai 400059",
    "registration_number": "CERSAI-2024-0315-789456",
    "registration_date": "2024-04-05",
    "registration_authority": "CERSAI",
    "security_value_inr": 180000000,
    "created_date": "2024-03-18"
  },
  {
    "security_interest_id": "SEC-002",
    "security_type": "GUARANTEE",
    "security_description": "Unconditional and irrevocable guarantee by Rajesh Kumar Sharma for INR 15 crore plus interest and costs",
    "registration_number": null,
    "registration_date": null,
    "registration_authority": null,
    "security_value_inr": 150000000,
    "created_date": "2024-03-15"
  },
  {
    "security_interest_id": "SEC-003",
    "security_type": "CHARGE",
    "security_description": "First pari passu charge over all present and future book debts and receivables",
    "registration_number": "CERSAI-2024-0315-789457",
    "registration_date": "2024-04-05",
    "registration_authority": "CERSAI",
    "security_value_inr": 50000000,
    "created_date": "2024-03-18"
  },
  {
    "security_interest_id": "SEC-004",
    "security_type": "PRIOR_MORTGAGE",
    "security_description": "Prior mortgage created over AST-001 commercial property in favour of Zenith Commercial Bank Limited",
    "registration_number": "ZCB-MTG-2014-7742",
    "registration_date": "2014-06-18",
    "registration_authority": "Sub-Registrar of Assurances, Mumbai",
    "security_value_inr": 90000000,
    "created_date": "2025-08-20"
  }
]
```

### `data/raw/users.json`

```json
[
  {
    "user_id": "USR-001",
    "user_name": "Aditya Malhotra",
    "user_email": "aditya.malhotra@asterfintech.in",
    "user_role": "LEGAL_COUNSEL",
    "department": "Legal",
    "user_status": "ACTIVE",
    "created_date": "2024-01-01"
  },
  {
    "user_id": "USR-002",
    "user_name": "Neha Gupta",
    "user_email": "neha.gupta@asterfintech.in",
    "user_role": "HR_MANAGER",
    "department": "Human Resources",
    "user_status": "ACTIVE",
    "created_date": "2024-01-01"
  },
  {
    "user_id": "USR-003",
    "user_name": "Rahul Verma",
    "user_email": "rahul.verma@asterfintech.in",
    "user_role": "CREDIT_MANAGER",
    "department": "Credit",
    "user_status": "ACTIVE",
    "created_date": "2024-01-01"
  },
  {
    "user_id": "USR-004",
    "user_name": "Kavita Reddy",
    "user_email": "kavita.reddy@asterfintech.in",
    "user_role": "LEGAL_HEAD",
    "department": "Legal",
    "user_status": "ACTIVE",
    "created_date": "2024-01-01"
  },
  {
    "user_id": "AI-001",
    "user_name": "MatterBridge AI",
    "user_email": "ai@matterbridge.system",
    "user_role": "AI_ASSISTANT",
    "department": "System",
    "user_status": "ACTIVE",
    "created_date": "2024-01-01"
  },
  {
    "user_id": "USR-005",
    "user_name": "Rhea Sethi",
    "user_email": "rhea.sethi@sethiemployment.example",
    "user_role": "EXTERNAL_COUNSEL",
    "department": "External Counsel",
    "user_status": "ACTIVE",
    "created_date": "2025-09-03"
  }
]
```

### `data/raw/workstreams.json`

```json
[
  {
    "workstream_id": "WS-001",
    "matter_id": "MAT-001",
    "parent_workstream_id": null,
    "workstream_name": "Recovery Assessment",
    "workstream_description": "Comprehensive recovery assessment including financing documentation, default chronology, repayment history, notices, borrower correspondence, recovery issues, and external counsel strategy",
    "workstream_status": "ACTIVE",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "workstream_id": "WS-002",
    "matter_id": "MAT-001",
    "parent_workstream_id": "WS-001",
    "workstream_name": "Security Verification",
    "workstream_description": "Determine what securities support the facility, whether available evidence supports those securities, what verification gaps exist, and which issues require legal judgment",
    "workstream_status": "IN_PROGRESS",
    "created_date": "2025-08-15",
    "created_by": "USR-001"
  },
  {
    "workstream_id": "WS-003",
    "matter_id": "MAT-002",
    "parent_workstream_id": null,
    "workstream_name": "Employee Leave & Misconduct Review",
    "workstream_description": "HR intake, leave request, document verification, employment history review, internal legal assessment, further investigation, external counsel escalation if required, internal decision",
    "workstream_status": "ACTIVE",
    "created_date": "2025-09-01",
    "created_by": "USR-002"
  }
]
```

### `data/validation_report.json`

```json
{
  "source_file": "MatterBridge_Database_Completed.xlsx",
  "generated_at": "2026-09-09T12:55:47",
  "sheet_row_counts": {
    "workstreams": 3,
    "users": 6,
    "parties": 4,
    "security_interests": 4,
    "asset_documents": 8,
    "matters": 2,
    "matter_types": 2,
    "matter_timeline": 27,
    "matter_assets": 3,
    "matter_access": 6,
    "legal_issues": 15,
    "historical_matters": 6,
    "finding_citations": 21,
    "documents": 22,
    "document_sections": 59,
    "decisions": 2,
    "dataset_summary": 29,
    "data_dictionary": 18,
    "counsel": 4,
    "counsel_questions": 10,
    "counsel_outputs": 1,
    "counsel_engagements": 2,
    "counsel_briefs": 2,
    "company_policies": 9,
    "audit_log": 14,
    "assets": 3,
    "ai_findings": 15
  },
  "matter_count": 2,
  "knowledge_chunk_count": 59,
  "critical_reference_errors": [],
  "warnings": [],
  "status": "PASS"
}
```

### `eslint.config.mjs`

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

### `handoff-context.md`

```md
# MatterBridge — Coding Harness Handoff Context

**Project:** MatterBridge  
**Purpose:** Portfolio prototype for an AI-native legal workflow / Product Manager application  
**Handoff target:** Codex / Claude Code / similar coding harness  
**Status date:** 2026-09-17

> **Primary rule for the coding agent:** Treat the existing repository and generated JSON as the source of truth. Inspect actual files and schemas before modifying code. Do not invent property names, routes, or data shapes.

## 1. Product Context

MatterBridge is an AI-native collaboration and operating layer between enterprise in-house legal teams, internal business stakeholders, and external counsel.

Core thesis: external legal work should not disappear into emails or law firms. Each engagement should preserve matter context, evidence, counsel advice, internal decisions, rationale, and outcomes so the company becomes smarter over time.

Product principles:
- Traceable over magical.
- Assist before automate.
- Least-privilege external sharing.
- Every external-counsel engagement should leave institutional memory behind.
- Reuse one workflow architecture across different legal matter types.

Canonical hierarchy:

```text
Matter Type
└── Matter
    └── Workstream
        └── Nested Workstream / Asset
            └── Documents
                └── Issues
                    └── Counsel Advice
                        └── Internal Decision
```

## 2. Golden Path — MAT-001

```text
MAT-001 Meridian Components Recovery
└── WS-001 Recovery Assessment
    └── WS-002 Security Verification
        ├── AST-001 Commercial Property
        ├── AST-002 Corporate Guarantee
        └── AST-003 Charge over Receivables
```

**Security Verification** is the correct product label. Do not rename it to Collateral Title Verification, Real Estate DD, or Title Verification.

Synthetic scenario:
- Client/lender: Aster Fintech Limited
- Borrower: Meridian Components Private Limited
- Outstanding exposure: approximately INR 12.4 crore
- Risk: HIGH
- Security package: commercial property, corporate guarantee, charge over receivables

Property chain:

```text
1998 Sale Deed
→ 2007 Conveyance
→ 2014 prior mortgage to Zenith Commercial Bank
→ 2019 release/satisfaction letter
→ 2024 Aster security
→ current security/encumbrance search
```

Deliberate issues: prior mortgage, ambiguous/incomplete release, missing formal satisfaction evidence, current security requiring counsel verification, outdated valuation, and an unresolved security issue that may affect recovery strategy.

The AI must not give a final title opinion or definitive enforcement-route conclusion.

## 3. Secondary Matter — MAT-002

**Project Atlas — Employee Leave & Misconduct Review**

Synthetic facts:
- Employee: Priya Menon
- Leave request following reported miscarriage; 14 calendar days
- Medical certificate and consultation receipt have inconsistent identifiers
- State must initially be DOCUMENT AUTHENTICITY REQUIRES VERIFICATION, not confirmed fraud
- Employee denies intentional falsification
- Prior 12 months: 17 unscheduled absence days, 5 notification-process failures, 2 manager interventions + 1 formal warning
- One-month PIP; threshold 75/100; score 77/100
- Therefore PIP PASSED, not failed

Keep separate:
1. historical performance,
2. current document verification,
3. potentially protected/sensitive leave request.

Do not implement reasoning equivalent to “poor attendance + PIP + suspicious documents = terminate.”

Expected workflow: further verification + internal Legal review + targeted external employment counsel before a material disciplinary decision.

## 4. Trust Model

Preferred user-facing evidence states:

```text
SUPPORTED
INFERRED
INFORMATION_MISSING
REQUIRES_LEGAL_JUDGMENT
```

Avoid fake confidence percentages.

Current UI has begun grouping findings into:
- Supported
- Information Missing
- Legal Judgment Required

## 5. Architecture

```text
Next.js UI
→ server-side/data access
→ Matter JSON
→ retrieval/context builder
→ LLM API
→ structured JSON
→ UI
→ workflow action / decision
```

Data pipeline:

```text
MatterBridge_Database_Completed.xlsx
→ scripts/convert_excel_to_json.py
→ data/raw/
→ data/matters/
→ data/knowledge_chunks.json
→ data/matter_index.json
→ data/validation_report.json
```

Technology:
- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint
- no React Compiler
- no /src directory
- default @/* alias
- Vercel target
- GitHub target
- no Supabase in v1
- no vector DB in v1

Retrieval v1: metadata filtering → lexical matching/simple rerank → small evidence packet → structured LLM response requiring source/chunk IDs.

Do not introduce LangChain, LlamaIndex, Supabase, pgvector, etc. without a concrete need.

## 6. Expected Repository Structure

```text
matterbridge/
├── app/
│   ├── page.tsx
│   └── matters/
│       └── [matterId]/
│           ├── page.tsx
│           └── workstreams/
│               └── [workstreamId]/
│                   └── page.tsx
├── components/
│   └── matter/
│       └── MatterCard.tsx
├── lib/
│   ├── data/
│   │   └── matter-service.ts
│   └── types/
│       └── matter.ts
├── data/
│   ├── raw/
│   ├── matters/
│   │   ├── MAT-001.json
│   │   └── MAT-002.json
│   ├── knowledge_chunks.json
│   ├── validation_report.json
│   └── matter_index.json
├── scripts/
│   └── convert_excel_to_json.py
├── public/
├── package.json
├── README.md
└── context.md
```

Inspect the actual filesystem first. The user manually followed earlier instructions in VS Code, so the repository is authoritative.

## 7. Existing Files and Known State

### `app/page.tsx`

Dashboard. Calls `getAllMatters()` and maps matters into `MatterCard`.

Known working pattern:

```tsx
import { getAllMatters } from "@/lib/data/matter-service";
import MatterCard from "@/components/matter/MatterCard";

export default function Home() {
  const matters = getAllMatters();

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MatterBridge</h1>
          <p className="mt-2 text-gray-600">Legal Matter Intelligence</p>
        </div>

        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Active Matters
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {matters.map((matterData) => (
            <MatterCard
              key={matterData.matter.matter_id}
              matterData={matterData}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
```

### `components/matter/MatterCard.tsx`

Dashboard card. Known working navigation:

```tsx
<Link href={"/matters/" + matterData.matter.matter_id}>
```

Do not refactor working navigation merely for style.

### `lib/data/matter-service.ts`

Known working implementation:

```ts
import matter001 from "@/data/matters/MAT-001.json";
import matter002 from "@/data/matters/MAT-002.json";

const matters = {
  "MAT-001": matter001,
  "MAT-002": matter002,
};

export function getMatter(matterId: string) {
  return matters[matterId as keyof typeof matters] ?? null;
}

export function getAllMatters() {
  return Object.values(matters);
}
```

Do not add separate raw-table imports to compensate for guessed nested JSON properties.

### `lib/types/matter.ts`

Interfaces were created for Matter, Workstream, Asset, Document, DocumentSection, LegalIssue, AIFinding, FindingCitation, CounselEngagement, CounselBrief, CounselQuestion, CounselOutput, Decision, HistoricalMatter, KnowledgeChunk, MatterBundle.

**Warning:** these types were drafted before every nested JSON shape was verified. Inspect MAT-001.json and MAT-002.json before tightening types. Do not modify JSON merely to satisfy stale interfaces.

### `app/matters/[matterId]/page.tsx`

Main matter workspace.

Known behavior:
- `params` is a Promise
- calls `getMatter(matterId)`
- handles missing matter
- renders header
- Workstreams
- Legal Issues
- Documents
- Matter Intelligence
- AI Findings
- Timeline

Known beginning:

```tsx
import Link from "next/link";
import { getMatter } from "@/lib/data/matter-service";

type MatterPageProps = {
  params: Promise<{
    matterId: string;
  }>;
};

export default async function MatterPage({ params }: MatterPageProps) {
  const { matterId } = await params;
  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="p-10">
        <p>Matter not found.</p>
      </main>
    );
  }

  const matter = matterData.matter;
```

Trust-state arrays added after `const matter = matterData.matter;`:

```ts
const supportedFindings =
  matterData.findings?.filter((finding: any) =>
    ["FACTUAL", "EXPOSURE", "DOCUMENTATION"].includes(finding.finding_type)
  ) ?? [];

const informationGaps =
  matterData.findings?.filter(
    (finding: any) => finding.finding_type === "INFORMATION_GAP"
  ) ?? [];

const legalJudgmentFindings =
  matterData.findings?.filter(
    (finding: any) => finding.finding_type === "LEGAL_ISSUE"
  ) ?? [];
```

These compile. Verify actual finding types before changing classification.

#### Workstreams

Uses `matterData.workstreams`. Cards are Links to:

```text
/matters/{matterId}/workstreams/{workstreamId}
```

Known href:

```tsx
href={
  "/matters/" +
  matter.matter_id +
  "/workstreams/" +
  workstream.workstream_id
}
```

#### Legal Issues

Important correction:

```tsx
// WRONG
matterData.legal_issues

// CORRECT
matterData.issues
```

Verified fields include:
`issue_id`, `matter_id`, `workstream_id`, `issue_title`, `issue_description`, `issue_status`, `issue_priority`, `requires_legal_judgment`.

The visible heading remains `"Legal Issues"`.

#### Documents

There is no top-level `matterData.documents`.

Matter-page documents are aggregated from workstreams:

```tsx
matterData.workstreams
  .flatMap((workstream: any) => workstream.documents ?? [])
```

Workstream documents are direct document objects:

```tsx
// CORRECT
item.document_id
item.document_title
item.document_type
item.document_date
item.document_status

// WRONG for workstream.documents
item.document.document_id
```

This correction fixed a runtime crash on `/matters/MAT-001`.

#### Matter Intelligence

Three cards before AI Findings:
- Supported
- Information Missing
- Legal Judgment Required

Counts:
` supportedFindings.length`, `informationGaps.length`, `legalJudgmentFindings.length`.

#### AI Findings

Uses `matterData.findings`, with fields currently referenced:
`finding_id`, `finding_title`, `finding_summary`, `finding_type`.

#### Timeline

Uses `matterData.timeline`, with:
`timeline_id`, `event_date`, `event_title`, `event_description`, `event_type`.

### `app/matters/[matterId]/workstreams/[workstreamId]/page.tsx`

Created with:

```bash
mkdir -p 'app/matters/[matterId]/workstreams/[workstreamId]'
touch 'app/matters/[matterId]/workstreams/[workstreamId]/page.tsx'
```

Known route:
`/matters/MAT-001/workstreams/WS-002`

Known beginning:

```tsx
import Link from "next/link";
import { getMatter } from "@/lib/data/matter-service";

type WorkstreamPageProps = {
  params: Promise<{
    matterId: string;
    workstreamId: string;
  }>;
};

export default async function WorkstreamPage({
  params,
}: WorkstreamPageProps) {
  const { matterId, workstreamId } = await params;

  const matterData = getMatter(matterId);

  if (!matterData) {
    return (
      <main className="p-10">
        <p>Matter not found.</p>
      </main>
    );
  }

  const workstream = matterData.workstreams.find(
    (item: any) => item.workstream_id === workstreamId
  );

  if (!workstream) {
    return (
      <main className="p-10">
        <p>Workstream not found.</p>
      </main>
    );
  }

  const workstreamFindings = workstream.findings ?? [];
```

Known rendered sections:
- Back to Matter
- workstream ID/name/status
- Findings
- Securities

Workstream findings use `workstreamFindings.map(...)` and fields:
`finding_id`, `finding_title`, `finding_summary`, `finding_type`.

Securities section maps `matterData.assets?.map(...)` and currently references:
`asset_id`, `asset_name`, `asset_type`, `asset_description`.

Inspect actual JSON/rendering before renaming.

#### Security Timeline — status uncertain

This was the next proposed block immediately before handoff:

```tsx
<section className="mt-8">
  <h2 className="text-xl font-semibold text-gray-900">
    Security Timeline
  </h2>

  <div className="mt-4 space-y-4">
    {workstream.timeline?.map((event: any) => (
      <div
        key={event.timeline_id}
        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <p className="text-sm text-gray-500">{event.event_date}</p>
        <h3 className="mt-1 text-lg font-semibold text-gray-900">
          {event.event_title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {event.event_description}
        </p>
      </div>
    ))}
  </div>
</section>
```

The user did not explicitly confirm completion before requesting this handoff. Inspect the local file before adding it again.

## 8. Critical JSON Shape Rules

Earlier errors came from assuming Excel table names and nested JSON keys were identical.

Before referencing a new field:
1. inspect actual JSON;
2. identify parent;
3. identify object vs array;
4. inspect one actual child object;
5. only then write UI code.

Known/established MAT-001 top-level properties include:

```text
matter
matter_type
parties
workstreams
timeline
issues
findings
decisions
access
counsel_engagements
assets
company_policies
historical_precedents
```

Do not assume this list is exhaustive.

### No top-level documents

Do not write `matterData.documents` unless JSON has later changed.

### Workstream documents

`workstream.documents` contains direct document objects.

### Asset documents have a different shape

An observed asset-level structure was:

```json
"documents": [
  {
    "asset_document": {
      "asset_document_id": "AD-001",
      "asset_id": "AST-001",
      "document_id": "DOC-009",
      "relationship_type": "TITLE_DOCUMENT",
      "created_date": "2025-08-20"
    },
    "document": {
      "document_id": "DOC-009",
      "matter_id": "MAT-001",
      "workstream_id": "WS-002",
      "document_title": "Sale Deed - Commercial Property",
      "document_type": "TITLE_DEED",
      "document_date": "1998-09-14",
      "document_source": "TITLE_RECORDS",
      "document_status": "FINAL",
      "created_date": "2025-08-20",
      "created_by": "USR-001",
      "sections": []
    }
  }
]
```

Therefore asset-level documents and workstream-level documents must not be assumed to have identical shapes.

## 9. Known MAT-001 Documents

WS-001:
- DOC-001 Facility Agreement
- DOC-002 Security Agreement
- DOC-003 Corporate Guarantee
- DOC-004 Repayment / Loan Account Summary
- DOC-005 Default Notice
- DOC-006 Borrower Response
- DOC-007 Internal Credit Risk Memo
- DOC-008 Internal Legal Intake / Escalation Note

WS-002:
- DOC-009 Sale Deed - Commercial Property
- DOC-010 Conveyance Deed - Commercial Property
- DOC-011 Prior Mortgage Deed - Zenith Commercial Bank
- DOC-012 Release and Satisfaction Letter
- DOC-013 Current Security and Encumbrance Search
- DOC-014 Property Valuation Report

DOC-012 intentionally has status `VERIFICATION_REQUIRED`.

## 10. Generated Data Package

Earlier generated artifacts:
- `MatterBridge_Database_Completed.xlsx`
- `MatterBridge_JSON_v1.zip`
- `build_matterbridge_json.py`
- `MatterBridge_Build_Specification_v1.docx`
- `MatterBridge_48_Hour_Build_Specification.docx`

JSON package included approximately:

```text
raw/*.json
matters/MAT-001.json
matters/MAT-002.json
matter_index.json
knowledge_chunks.json
validation_report.json
README.md
convert_excel_to_json.py
```

Generation validation:
- 2 matters
- 59 knowledge chunks
- 0 critical reference errors
- 0 warnings after stale citation correction

CITE-001 was corrected from “6 EMIs overdue” to “5 EMIs overdue”.

Workbook counts approximately:
- documents 22
- document_sections 59
- matter_timeline 27
- legal_issues 15
- ai_findings 15
- finding_citations 21
- historical_matters 6
- counsel 4
- counsel_engagements 2
- counsel_briefs 2
- counsel_questions 10
- decisions 2
- users 6
- matter_access 6

Other tables include matter_types, matters, workstreams, parties, assets, security_interests, company_policies, counsel_outputs, audit_log, asset_documents.

## 11. Counsel Workflow — Major Remaining Build

Target golden path:

```text
Matter Intelligence
→ Security Verification
→ Generate Counsel Brief
→ Scoped External Counsel Workspace
→ Counsel Opinion
→ AI Counsel Opinion Review
→ Internal Legal Decision
→ Institutional Memory
```

Counsel questions for MAT-001 should cover:
- recovery routes
- prerequisites
- notice sufficiency
- jurisdiction/forum
- security package
- impact of unresolved security/title issue
- additional evidence
- strategy

External counsel must receive scoped/least-privilege access rather than every internal matter record.

## 12. Hero Feature — Counsel Opinion Review

This is the strongest intended product moment.

Detect:
- conflict with prior company precedent
- missing issue
- unsupported assertion
- source/evidence requiring verification
- security gap

Every finding should be source-linked.

Suggested contract:

```json
{
  "overall_summary": "...",
  "findings": [
    {
      "type": "prior_position_conflict | missing_issue | verify_evidence",
      "severity": "high | medium | low",
      "finding": "...",
      "counsel_source_ids": ["COUNSEL-001"],
      "company_source_ids": ["PREC-002"],
      "recommended_user_action": "ask_counsel | accept_difference | verify_source"
    }
  ]
}
```

Prefer structured JSON to arbitrary model prose.

## 13. Matter Intelligence Contract

```json
{
  "summary": "...",
  "facts": [
    {
      "text": "...",
      "evidence_state": "supported",
      "source_ids": ["SRC-001"]
    }
  ],
  "inferences": [
    {
      "text": "...",
      "evidence_state": "inference",
      "source_ids": ["SRC-002", "SRC-004"]
    }
  ],
  "information_gaps": ["..."],
  "legal_judgment_questions": ["..."]
}
```

## 14. Intended Routes / APIs

Original intended API surface:

```text
GET  /api/matters
GET  /api/matters/:matterId
GET  /api/matters/:matterId/workstreams/:workstreamId
POST /api/intelligence/matter-summary
POST /api/intelligence/counsel-brief
POST /api/intelligence/opinion-review
POST /api/decisions
```

An older build spec also contemplated:

```text
/app/matters/[id]/brief/page.tsx
/app/matters/[id]/counsel/page.tsx
/app/matters/[id]/review/page.tsx
/app/matters/[id]/decision/page.tsx
/app/memory/page.tsx
/app/api/ai/matter-intelligence/route.ts
/app/api/ai/counsel-brief/route.ts
/app/api/ai/opinion-review/route.ts
/app/api/matters/[id]/decision/route.ts
```

Do not blindly create both conventions. Current working route uses `[matterId]`; keep naming consistent with the actual repo.

## 15. Institutional Memory

Each completed counsel engagement should preserve:

```text
matter
counsel advice
internal decision
decision rationale
sources
outcome
```

and make it discoverable as precedent.

Target question: **“Have we dealt with this before?”**

Historical matters already exist in the dataset.

## 16. Decision Workflow

Target actions:
- Accept
- Request further analysis
- Seek second opinion

Potential decision factors:
- legal risk
- recovery probability
- cost
- timing
- commercial relationship
- regulatory considerations

Include free-text rationale. Prototype persistence may be simulated.

## 17. Real vs Simulated

Real/functional where possible:
- Excel→JSON conversion
- data model
- matter/workstream navigation
- Security Verification
- source documents
- citations
- deterministic retrieval
- selected LLM calls
- structured AI output
- counsel workflow
- opinion review
- decision interaction
- HR matter variant

Simulated:
- production auth/SSO
- real law-firm accounts
- production RBAC/audit infrastructure
- live DMS/email/CERSAI/HRIS integrations
- persistent multi-user collaboration
- vector DB
- production upload pipeline

## 18. Current Completion / Priority

Estimated at handoff: roughly **55–65% of intended MVP**.

Completed/mostly completed:
- setup
- generated data
- data service
- dashboard
- MatterCard
- matter navigation
- main matter workspace
- Workstreams
- Legal Issues
- Documents
- AI Findings
- Timeline
- Matter Intelligence summary
- workstream routing
- WS-002 Security Verification page
- WS-002 findings
- WS-002 securities

Immediate remaining:
1. verify whether Security Timeline is already present
2. finish WS-002 issues/source evidence
3. counsel brief
4. scoped counsel workspace
5. counsel opinion review
6. internal legal decision
7. institutional memory
8. ensure MAT-002 works cleanly
9. selective retrieval + live LLM integration
10. UI cleanup/error handling
11. README
12. GitHub/Vercel
13. demo script

Priority:

```text
MAT-001
→ Security Verification
→ Counsel Brief
→ Counsel Opinion Review
→ Decision
→ Institutional Memory
```

Then use MAT-002 to prove generalization.

## 19. Coding-Agent Operating Instructions

Before changing code:
1. inspect repository tree;
2. read target file;
3. read relevant JSON/data shape;
4. run existing app/build if possible;
5. make smallest coherent change;
6. run lint/build/type-check as available;
7. report exactly what changed.

Never:
- invent JSON properties
- infer nested JSON shape from Excel table names
- add service-layer workarounds before checking JSON
- replace an entire working file for a one-line fix
- refactor working navigation for aesthetics
- casually change synthetic legal facts
- turn unresolved evidence into definitive legal conclusions
- add unnecessary infrastructure during the prototype

Preferred patch format:

```text
file
→ exact existing code anchor
→ insertion/replacement
→ verification command
```

The user prefers surgical patches, explicit line/code anchors, and concise instructions.

## 20. Verification

Inspect `package.json` and use scripts actually present. Likely:

```bash
npm run dev
npm run lint
npm run build
```

Do not assume a typecheck script exists.

Golden browser path:

```text
/
→ /matters/MAT-001
→ /matters/MAT-001/workstreams/WS-002
```

Also verify `/matters/MAT-002`.

## 21. Environment

Original setup:
- macOS
- VS Code
- zsh
- Node v24.21.0
- npm 11.19.0
- create-next-app 16.3.5

The user is a non-engineer learning while building. Keep changes understandable and bounded.

## 22. Deployment / Secrets

Target GitHub + Vercel Hobby for a personal/non-commercial portfolio prototype.

LLM keys stay server-side. Intended pattern:

```text
LLM_API_KEY=...
LLM_MODEL=...
USE_LIVE_AI=true
```

Never expose secrets through `NEXT_PUBLIC_*`.

## 23. Legal/Product Guardrails

MAT-001:
- no final title opinion as established fact
- no definitive enforcement route without legal review
- flag missing evidence
- show sources
- escalate legal judgment

MAT-002:
- no confirmed-fraud label from inconsistent documents
- PIP passed: 77/100 vs 75 threshold
- do not collapse leave rights, verification, and historical performance
- preserve procedural fairness
- material disciplinary judgment goes through Legal/external counsel

## 24. First Task for Codex / Claude Code

**Do not immediately generate code.**

First:
1. inspect repository tree;
2. inspect `package.json`;
3. inspect `app/matters/[matterId]/page.tsx`;
4. inspect `app/matters/[matterId]/workstreams/[workstreamId]/page.tsx`;
5. inspect `lib/data/matter-service.ts`;
6. inspect `data/matters/MAT-001.json`;
7. inspect `data/matters/MAT-002.json`;
8. run lint/build;
9. compare actual repo against this handoff;
10. report discrepancies before structural changes.

Then continue from the first incomplete milestone, likely:

```text
Finish Security Verification
→ Counsel Brief
→ Counsel Opinion Review
→ Decision
→ Institutional Memory
```

## 25. Source-of-Truth Priority

When this handoff and the repository differ:

```text
1. Existing working repository
2. Actual generated JSON
3. package.json / compiler behavior
4. This context.md
5. Older build-specification documents
```

This file captures product intent and known build history, but must never override verified working code or actual data.

---

**End of handoff.**

```

### `lib/data/access-service.ts`

```ts
import type { MatterBundle } from "@/lib/types/matter";

export type MatterAccessRecord = {
  access_id: string;
  matter_id: string;
  user_id: string;
  access_level: string;
  granted_date?: string;
  user?: {
    user_id: string;
    user_name: string;
    user_email?: string;
    user_role?: string;
    department?: string;
  };
};

export function getExternalCounselAccess(matterData: MatterBundle) {
  const accessRecords = (matterData.access ?? []) as MatterAccessRecord[];

  return (
    accessRecords.find(
      (access) => access.user?.user_role === "EXTERNAL_COUNSEL"
    ) ?? null
  );
}

```

### `lib/data/counsel-service.ts`

```ts
import { getAllMatters } from "@/lib/data/matter-service";
import { getExternalCounselAccess } from "@/lib/data/access-service";
import type { Counsel, CounselEngagement, MatterBundle } from "@/lib/types/matter";

export interface CounselPortfolioMatter {
  matterId: string;
  matterTitle: string;
  matterType: string;
  engagement: CounselEngagement;
  workstreams: string[];
  hasExternalCounselAccess: boolean;
}

export interface CounselPortfolioGroup {
  counsel: Counsel;
  matters: CounselPortfolioMatter[];
  topics: string[];
}

function portfolioText(matterData: MatterBundle, engagement: CounselEngagement) {
  return [
    matterData.matter.matter_title,
    matterData.matter_type?.matter_type_name,
    engagement.engagement_type,
    engagement.engagement_description,
    ...matterData.workstreams.map((workstream) => workstream.workstream_name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function topicsFor(matterData: MatterBundle, engagement: CounselEngagement) {
  const text = portfolioText(matterData, engagement);
  const topicRules = [
    ["Recovery", ["recover", "recovery"]],
    ["Security", ["security", "secured"]],
    ["Enforcement", ["enforcement"]],
    ["Employment", ["employment", "employee", "workplace", "hr"]],
    ["Regulatory", ["regulatory", "compliance"]],
    ["Contract", ["contract", "facility"]],
  ] as const;

  return topicRules
    .filter(([, terms]) => terms.some((term) => text.includes(term)))
    .map(([topic]) => topic);
}

export function getCounselPortfolio(): CounselPortfolioGroup[] {
  const groups = new Map<string, CounselPortfolioGroup>();

  for (const matterData of getAllMatters()) {
    for (const engagement of matterData.counsel_engagements ?? []) {
      const counsel = engagement.counsel;

      if (!counsel) {
        continue;
      }

      const key = counsel.counsel_id;
      const existing = groups.get(key) ?? {
        counsel,
        matters: [],
        topics: [],
      };
      const matter = {
        matterId: matterData.matter.matter_id,
        matterTitle: matterData.matter.matter_title,
        matterType: matterData.matter_type?.matter_type_name ?? "Not recorded",
        engagement,
        workstreams: matterData.workstreams.map(
          (workstream) => workstream.workstream_name
        ),
        hasExternalCounselAccess: Boolean(getExternalCounselAccess(matterData)),
      };

      existing.matters.push(matter);
      existing.topics = Array.from(
        new Set([...existing.topics, ...topicsFor(matterData, engagement)])
      );
      groups.set(key, existing);
    }
  }

  return Array.from(groups.values());
}

```

### `lib/data/evidence-service.ts`

```ts
import knowledgeChunks from "@/data/knowledge_chunks.json";
import type {
  AIFinding,
  EvidencePacket,
  EvidencePacketSource,
  KnowledgeChunk,
  LegalIssue,
  MatterBundle,
  Workstream,
} from "@/lib/types/matter";

const chunks = knowledgeChunks as KnowledgeChunk[];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "before",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

function joinText(values: Array<string | undefined | null>) {
  return values.filter(Boolean).join(" ");
}

function issueText(issue: LegalIssue) {
  return joinText([
    issue.issue_title,
    issue.issue_description,
    issue.issue_priority,
    issue.issue_status,
  ]);
}

function findingText(finding: AIFinding) {
  return joinText([
    finding.finding_type,
    finding.finding_title,
    finding.finding_summary,
  ]);
}

function chunkSearchText(chunk: KnowledgeChunk) {
  return joinText([
    chunk.document_title,
    chunk.document_type,
    chunk.section_title,
    chunk.text,
    chunk.citation_label,
    ...(chunk.asset_ids ?? []),
  ]).toLowerCase();
}

function scoreChunk(chunk: KnowledgeChunk, queryTokens: string[]) {
  const haystack = chunkSearchText(chunk);
  let score = 0;

  for (const token of queryTokens) {
    if (haystack.includes(token)) {
      score += 1;
    }

    if (chunk.section_title?.toLowerCase().includes(token)) {
      score += 1;
    }

    if (chunk.document_title?.toLowerCase().includes(token)) {
      score += 1;
    }
  }

  return score;
}

function toSource(chunk: KnowledgeChunk, score: number): EvidencePacketSource {
  return {
    chunk_id: chunk.chunk_id,
    matter_id: chunk.matter_id,
    workstream_id: chunk.workstream_id,
    document_id: chunk.document_id,
    document_title: chunk.document_title,
    document_type: chunk.document_type,
    section_title: chunk.section_title,
    citation_label: chunk.citation_label,
    text: chunk.text,
    score,
  };
}

function guardrailsFor(matterData: MatterBundle, workstream?: Workstream) {
  const guardrails = [
    "Use only cited source or chunk IDs for supported statements.",
    "Separate supported facts, missing information, and legal judgment.",
    "Do not use confidence percentages.",
  ];

  if (matterData.matter.matter_id === "MAT-001") {
    guardrails.push(
      "Do not give a final title opinion or definitive enforcement-route conclusion."
    );
  }

  if (matterData.matter.matter_id === "MAT-002") {
    guardrails.push(
      "Keep performance history, document verification, and sensitive leave context separate."
    );
    guardrails.push(
      "Do not infer termination from attendance history plus document inconsistencies."
    );
  }

  if (workstream?.workstream_name === "Security Verification") {
    guardrails.push(
      "Treat unresolved prior mortgage and release evidence as verification issues for counsel."
    );
  }

  return guardrails;
}

function buildRetrievalQuery(matterData: MatterBundle, workstream?: Workstream) {
  const scopedIssues = workstream?.issues ?? matterData.issues ?? [];
  const scopedFindings = workstream?.findings ?? matterData.findings ?? [];
  const counselQuestions =
    matterData.counsel_engagements?.flatMap((engagement) =>
      engagement.briefs?.flatMap((brief) =>
        brief.questions?.map((question) => question.question_text) ?? []
      ) ?? []
    ) ?? [];

  return joinText([
    matterData.matter.matter_title,
    matterData.matter.matter_description,
    matterData.matter_type?.matter_type_name,
    workstream?.workstream_name,
    workstream?.workstream_description,
    ...scopedIssues.map(issueText),
    ...scopedFindings.map(findingText),
    ...counselQuestions,
  ]);
}

export function buildEvidencePacket(
  matterData: MatterBundle,
  options: {
    workstream?: Workstream;
    maxSources?: number;
  } = {}
): EvidencePacket {
  const { workstream, maxSources = 6 } = options;
  const retrievalQuery = buildRetrievalQuery(matterData, workstream);
  const queryTokens = Array.from(new Set(tokenize(retrievalQuery)));
  const scopedChunks = chunks.filter((chunk) => {
    if (chunk.matter_id !== matterData.matter.matter_id) {
      return false;
    }

    if (workstream && chunk.workstream_id !== workstream.workstream_id) {
      return false;
    }

    return true;
  });

  const scoredSources = scopedChunks
    .map((chunk) => toSource(chunk, scoreChunk(chunk, queryTokens)))
    .filter((source) => source.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.chunk_id.localeCompare(b.chunk_id);
    });

  const fallbackSources = scopedChunks
    .map((chunk) => toSource(chunk, 0))
    .sort((a, b) => a.chunk_id.localeCompare(b.chunk_id));

  return {
    scope: workstream ? "workstream" : "matter",
    matter_id: matterData.matter.matter_id,
    workstream_id: workstream?.workstream_id,
    retrieval_query: retrievalQuery,
    sources: (scoredSources.length > 0 ? scoredSources : fallbackSources).slice(
      0,
      maxSources
    ),
    required_output_states: [
      "SUPPORTED",
      "INFERRED",
      "INFORMATION_MISSING",
      "REQUIRES_LEGAL_JUDGMENT",
    ],
    guardrails: guardrailsFor(matterData, workstream),
  };
}

```

### `lib/data/issue-mapping.ts`

```ts
import type {
  AIFinding,
  Document,
  EvidencePacketSource,
  LegalIssue,
} from "@/lib/types/matter";

export interface IssueSupport {
  issue: LegalIssue;
  findings: AIFinding[];
  documents: Document[];
  evidence: EvidencePacketSource[];
}

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "into",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function tokens(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !stopWords.has(token))
  );
}

function overlapScore(sourceTokens: Set<string>, targetText: string) {
  const targetTokens = tokens(targetText);
  return [...sourceTokens].filter((token) => targetTokens.has(token)).length;
}

function findingText(finding: AIFinding) {
  return [
    finding.finding_type,
    finding.finding_title,
    finding.finding_summary,
  ]
    .filter(Boolean)
    .join(" ");
}

function documentText(document: Document) {
  return [
    document.document_title,
    document.document_type,
    ...(document.sections ?? []).flatMap((section) => [
      section.section_title,
      section.section_content,
    ]),
  ].join(" ");
}

function sourceText(source: EvidencePacketSource) {
  return [
    source.document_title,
    source.document_type,
    source.section_title,
    source.text,
  ]
    .filter(Boolean)
    .join(" ");
}

function relatedFindings(issue: LegalIssue, findings: AIFinding[]) {
  const issueTokens = tokens(
    [issue.issue_title, issue.issue_description].filter(Boolean).join(" ")
  );

  return findings
    .filter(
      (finding) =>
        finding.matter_id === issue.matter_id &&
        finding.workstream_id === issue.workstream_id
    )
    .map((finding) => ({
      finding,
      score: overlapScore(issueTokens, findingText(finding)),
    }))
    .filter(({ finding, score }) => {
      const titleScore = overlapScore(
        tokens(issue.issue_title),
        [finding.finding_title, finding.finding_type].filter(Boolean).join(" ")
      );

      return score >= 2 || titleScore >= 1;
    })
    .sort((a, b) => b.score - a.score)
    .map(({ finding }) => finding);
}

function relatedDocuments(
  issue: LegalIssue,
  findings: AIFinding[],
  documents: Document[]
) {
  const issueTokens = tokens(
    [issue.issue_title, issue.issue_description].filter(Boolean).join(" ")
  );
  const citedDocumentIds = new Set(
    findings.flatMap(
      (finding) =>
        finding.citations
          ?.filter((citation) => citation.source_type === "DOCUMENT")
          .map((citation) => citation.source_id) ?? []
    )
  );

  return documents
    .filter(
      (document) =>
        document.matter_id === issue.matter_id &&
        document.workstream_id === issue.workstream_id
    )
    .map((document) => ({
      document,
      score:
        (citedDocumentIds.has(document.document_id) ? 4 : 0) +
        overlapScore(issueTokens, documentText(document)),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ document }) => document);
}

function relatedEvidence(
  issue: LegalIssue,
  documents: Document[],
  sources: EvidencePacketSource[]
) {
  const issueTokens = tokens(
    [issue.issue_title, issue.issue_description].filter(Boolean).join(" ")
  );
  const documentIds = new Set(documents.map((document) => document.document_id));

  return sources
    .filter(
      (source) =>
        source.matter_id === issue.matter_id &&
        source.workstream_id === issue.workstream_id &&
        source.document_id &&
        documentIds.has(source.document_id)
    )
    .map((source) => ({
      source,
      score: overlapScore(issueTokens, sourceText(source)),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.source.score - a.source.score;
    })
    .slice(0, 8)
    .map(({ source }) => source);
}

export function mapIssuesToSupport(
  issues: LegalIssue[],
  findings: AIFinding[],
  documents: Document[],
  sources: EvidencePacketSource[]
): IssueSupport[] {
  return issues
    .filter(
      (issue) => issue.issue_status === "ACTIVE" || issue.issue_status === "IN_PROGRESS"
    )
    .map((issue) => {
      const issueFindings = relatedFindings(issue, findings);
      const issueDocuments = relatedDocuments(issue, issueFindings, documents);

      return {
        issue,
        findings: issueFindings,
        documents: issueDocuments,
        evidence: relatedEvidence(issue, issueDocuments, sources),
      };
    });
}

```

### `lib/data/matter-service.ts`

```ts
import matter001 from "@/data/matters/MAT-001.json";
import matter002 from "@/data/matters/MAT-002.json";
import type { MatterBundle } from "@/lib/types/matter";

const matters: Record<string, MatterBundle> = {
  "MAT-001": matter001 as MatterBundle,
  "MAT-002": matter002 as MatterBundle,
};

export function getMatter(matterId: string) {
  return matters[matterId] ?? null;
}

export function getAllMatters() {
  return Object.values(matters);
}

export function getWorkstream(matterId: string, workstreamId: string) {
  const matterData = getMatter(matterId);

  if (!matterData) {
    return null;
  }

  return (
    matterData.workstreams.find(
      (workstream) => workstream.workstream_id === workstreamId
    ) ?? null
  );
}

```

### `lib/types/matter.ts`

```ts
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

```

### `next-env.d.ts`

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

### `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

### `package-lock.json`

```json
{
  "name": "matterbridge",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "matterbridge",
      "version": "0.1.0",
      "dependencies": {
        "next": "16.3.5",
        "react": "19.2.8",
        "react-dom": "19.2.8"
      },
      "devDependencies": {
        "@tailwindcss/postcss": "^4",
        "@types/node": "^20",
        "@types/react": "^19",
        "@types/react-dom": "^19",
        "eslint": "^9",
        "eslint-config-next": "16.3.5",
        "tailwindcss": "^4",
        "typescript": "^5"
      }
    },
    "node_modules/@alloc/quick-lru": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.3.0.tgz",
      "integrity": "sha512-U4+70Pc5ZS9osnCBCE5Jha/ciHM+Yp+CNMNC/7HvYbNRk1Ldd+f7qO65W5qfhu/TCv+/ozljlXXe9Nj8419DMA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/@babel/code-frame": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.7.tgz",
      "integrity": "sha512-Aup7aUOfpbAUg2ROOJN6Iw5f9DMBlzu0mIkm/malLQFN/YQgO48wCj0Kxa3sEHJvPVFg7siR+qRInwXd2qhQKw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-validator-identifier": "^7.29.7",
        "js-tokens": "^4.0.0",
        "picocolors": "^1.1.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/compat-data": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.7.tgz",
      "integrity": "sha512-locTkQyKvwIEgBzVrn8693ebc97F2U8ZHjbXwDXJ5Fn2TCpNwTlKcaKLkdHop5c/icOFE7qt7Q9JC5hnKNa6Gg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/core": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.7.tgz",
      "integrity": "sha512-RgHBCvtjbOK2gXSNBNIkNoEc9qoVEtau3hj8gEqKQuL3HZAibKarWFEI3Lfm6EYKkLalOh8eSrj9b+ch9H/VBA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.7",
        "@babel/helper-compilation-targets": "^7.29.7",
        "@babel/helper-module-transforms": "^7.29.7",
        "@babel/helpers": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/template": "^7.29.7",
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7",
        "@jridgewell/remapping": "^2.3.5",
        "convert-source-map": "^2.0.0",
        "debug": "^4.1.0",
        "gensync": "^1.0.0-beta.2",
        "json5": "^2.2.3",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/babel"
      }
    },
    "node_modules/@babel/generator": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.8.tgz",
      "integrity": "sha512-gZbepsdh3WDtgZKWL+vTPh71LSBrm/Y4/QDZBVCcYfmeTEEuoOYwlSy+G1StfJg+/Zy550u/3TATbm7qDbbMtg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/parser": "^7.29.8",
        "@babel/types": "^7.29.8",
        "@jridgewell/gen-mapping": "^0.3.12",
        "@jridgewell/trace-mapping": "^0.3.28",
        "jsesc": "^3.0.2"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-compilation-targets": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.29.7.tgz",
      "integrity": "sha512-wem6WaBj4NaVYVdNhLPPVacES6ZJ+KBBfSkTMD3YZxbP3rm3Di85tJU5ljaUNhaOynt+Aj0xruhYuzQBt8n71g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/compat-data": "^7.29.7",
        "@babel/helper-validator-option": "^7.29.7",
        "browserslist": "^4.24.0",
        "lru-cache": "^5.1.1",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-globals": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.29.7.tgz",
      "integrity": "sha512-3nQVUAtvkKH9zahfWgw96Jc/uFOmjACE1kQz82E2lqWmHBgjzbNlsC22nuQTfahmWeQtTq5nQ/4Nnd2A1wj4zA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-imports": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.29.7.tgz",
      "integrity": "sha512-ejHwrQQYcm9xnTivShn2IDOlIzInN34AXskvq9QicvCtEzq1Vzclu/tKF8Jq1Cg8JG2GL6/EmjgsCT7lXepE3g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/traverse": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-module-transforms": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.29.7.tgz",
      "integrity": "sha512-UPUVSyXbOh627KiCIGQSgwWzGeBKLkaJ9PJEdrngIwMSzxLR4jS4+f1f1jb7VzBbg8nFLaYotvVPFCTqdrmTAg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-module-imports": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7",
        "@babel/traverse": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      },
      "peerDependencies": {
        "@babel/core": "^7.0.0"
      }
    },
    "node_modules/@babel/helper-string-parser": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.29.7.tgz",
      "integrity": "sha512-Pb5ijPrZ89GDH8223L4UP8i6QApWxs04RbPQJTeWDV0/keR2E36MeKnyr6LYmUUvqRRI+Iv87SuF1W6ErINzYw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-identifier": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.29.7.tgz",
      "integrity": "sha512-qehxGkRj55h/ff8EMaJ+cYhyaKlHIxqYDn682wQD7RNp9UujOQsHog2uS0r2vzr4pW+sXf90NeeayjcNaX3fFg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helper-validator-option": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.29.7.tgz",
      "integrity": "sha512-N9ZErrD+yW5geCDtBqnOoxmR8+tNKiGuxKlDpuJxfsqpa2dFcexaziGAE/qoHLiDDreVNMupxGmSoNlyvsA3gw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/helpers": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.7.tgz",
      "integrity": "sha512-1k2lAGRMfHTcwuNYcCNUmaUffmQv8KWMfh2iJUUeRlwlwH4FdNG7mfPI10NPfLHJFThE4Tyr4mv7kTNZOiPuBg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/parser": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.8.tgz",
      "integrity": "sha512-E8lTAYNB1KW+FH+VGJuZM1ioAx2E6oVlvQFRrf5P8ZZmsiJXYAD9vTFV7yyEURNzgh1dFqMZuO6tUwcARbqFCA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/types": "^7.29.8"
      },
      "bin": {
        "parser": "bin/babel-parser.js"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@babel/template": {
      "version": "7.29.7",
      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.29.7.tgz",
      "integrity": "sha512-puq+Gf35oI24FeN11LkoUQFqv9uwNeWpxXZi/Ji3rRIoKAzKnxRaZ+Gkj0vKS9ZCiTESfng1N9LyOyXvo+m+Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/parser": "^7.29.7",
        "@babel/types": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/traverse": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.8.tgz",
      "integrity": "sha512-I5z7H3bf/41ktsNVLtpN0wAa336HkqIHQ5BuPLEhTkt1jVSyZpeNKIzTgEWmlxjdg81R0IgUCcaE+Ok3NvrfZg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/code-frame": "^7.29.7",
        "@babel/generator": "^7.29.8",
        "@babel/helper-globals": "^7.29.7",
        "@babel/parser": "^7.29.8",
        "@babel/template": "^7.29.7",
        "@babel/types": "^7.29.8",
        "debug": "^4.3.1"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@babel/types": {
      "version": "7.29.8",
      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.8.tgz",
      "integrity": "sha512-Vj1jF3cPfxg7OAfoI7QnVKLoILlm2JF9pnVHrX8qx7AHMiYWT+NDAA7jChlNgRS4WTLc/fD1lXLmPixluj+3Gg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/helper-string-parser": "^7.29.7",
        "@babel/helper-validator-identifier": "^7.29.7"
      },
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/@emnapi/core": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
      "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/wasi-threads": "1.2.1",
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.11.3",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.11.3.tgz",
      "integrity": "sha512-Xz4Tpyki7XyrpbUK1jR1AhdAdaXyhhY4lZ3neLodmhpuWfy2PAQN5B46sAiU4liOXGLkHypn/qU+jvfWSCYYLA==",
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@emnapi/wasi-threads": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
      "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils": {
      "version": "4.10.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.10.1.tgz",
      "integrity": "sha512-cuadcxVFE8sDK6iWJbs8Sn0av2Nrh2QSGQhVlBW9AaAHqHwjWsZHT8LJ4hFGPh7ASBV2deFdM7H/DPjulmh8rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@eslint-community/eslint-utils/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint-community/regexpp": {
      "version": "4.12.2",
      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
      }
    },
    "node_modules/@eslint/config-array": {
      "version": "0.21.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.2.tgz",
      "integrity": "sha512-nJl2KGTlrf9GjLimgIru+V/mzgSK0ABCDQRvxw5BjURL7WfH5uoWmizbH7QB6MmnMBd8cIC9uceWnezL1VZWWw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/object-schema": "^2.1.7",
        "debug": "^4.3.1",
        "minimatch": "^3.1.5"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/config-helpers": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/core": {
      "version": "0.17.0",
      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@types/json-schema": "^7.0.15"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/eslintrc": {
      "version": "3.3.7",
      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.7.tgz",
      "integrity": "sha512-F42g89Qd5oAWtp0k0nnSrjziAKza7w8SVT4mStc18LZMaRb4J1HQAHLCalEtDCxrTuksx7NU9qsmeLwpOfPqWw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ajv": "^6.14.0",
        "debug": "^4.3.2",
        "espree": "^10.0.1",
        "globals": "^14.0.0",
        "ignore": "^5.2.0",
        "import-fresh": "^3.2.1",
        "js-yaml": "^4.3.2",
        "minimatch": "^3.1.5",
        "strip-json-comments": "^3.1.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@eslint/js": {
      "version": "9.39.5",
      "resolved": "https://registry.npmjs.org/@eslint/js/-/js-9.39.5.tgz",
      "integrity": "sha512-QywQuszQh77pIXCsq998c8hbhSTI/azTty1Z6N53dmAudKHhy573j3yvRLsX2BSp8YpLtoCEG8E9DJe+8zUh4A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      }
    },
    "node_modules/@eslint/object-schema": {
      "version": "2.1.7",
      "resolved": "https://registry.npmjs.org/@eslint/object-schema/-/object-schema-2.1.7.tgz",
      "integrity": "sha512-VtAOaymWVfZcmZbp6E2mympDIHvyjXs/12LqWYjVw6qjrfF+VK+fyG33kChz3nnK+SU5/NeHOqrTEHS8sXO3OA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@eslint/plugin-kit": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/@eslint/plugin-kit/-/plugin-kit-0.4.1.tgz",
      "integrity": "sha512-43/qtrDUokr7LJqoF2c3+RInu/t4zfrpYdoSDfYyhg52rwLV6TnOvdG4fXm7IkSB3wErkcmJS9iEhjVtOSEjjA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@eslint/core": "^0.17.0",
        "levn": "^0.4.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      }
    },
    "node_modules/@humanfs/core": {
      "version": "0.19.2",
      "resolved": "https://registry.npmjs.org/@humanfs/core/-/core-0.19.2.tgz",
      "integrity": "sha512-UhXNm+CFMWcbChXywFwkmhqjs3PRCmcSa/hfBgLIb7oQ5HNb1wS0icWsGtSAUNgefHeI+eBrA8I1fxmbHsGdvA==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/types": "^0.15.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/node": {
      "version": "0.16.8",
      "resolved": "https://registry.npmjs.org/@humanfs/node/-/node-0.16.8.tgz",
      "integrity": "sha512-gE1eQNZ3R++kTzFUpdGlpmy8kDZD/MLyHqDwqjkVQI0JMdI1D51sy1H958PNXYkM2rAac7e5/CnIKZrHtPh3BQ==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@humanfs/core": "^0.19.2",
        "@humanfs/types": "^0.15.0",
        "@humanwhocodes/retry": "^0.4.0"
      },
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanfs/types": {
      "version": "0.15.0",
      "resolved": "https://registry.npmjs.org/@humanfs/types/-/types-0.15.0.tgz",
      "integrity": "sha512-ZZ1w0aoQkwuUuC7Yf+7sdeaNfqQiiLcSRbfI08oAxqLtpXQr9AIVX7Ay7HLDuiLYAaFPu8oBYNq/QIi9URHJ3Q==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18.0"
      }
    },
    "node_modules/@humanwhocodes/module-importer": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/module-importer/-/module-importer-1.0.1.tgz",
      "integrity": "sha512-bxveV4V8v5Yb4ncFTT3rPSgZBOpCkjfK0y4oVVVJwIuDVBRMDXrPyXRL988i5ap9m9bnyEEjWfm5WkBmtffLfA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=12.22"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@humanwhocodes/retry": {
      "version": "0.4.3",
      "resolved": "https://registry.npmjs.org/@humanwhocodes/retry/-/retry-0.4.3.tgz",
      "integrity": "sha512-bV0Tgo9K4hfPCek+aMAn81RppFKv2ySDQeMoSZuvTASywNTnVJCArCZE2FWqpvIatKu7VMRLWlR1EazvVhDyhQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.18"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/nzakas"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.1.0.tgz",
      "integrity": "sha512-Td76q7j57o/tLVdgS746cYARfSyxk8iEfRxewL9h4OMzYhbW4TAcppl0mT4eyqXddh6L/jwoM75mo7ixa/pCeQ==",
      "license": "MIT",
      "optional": true,
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.35.4.tgz",
      "integrity": "sha512-Uhfl4V4lhP2nbUVF9+hyH1+luj86f1gUFeo8ALYxFoULoU+G87D43BfeMP8XHsk9boxAnCY/bf2EHwhA7MuGsA==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.35.4.tgz",
      "integrity": "sha512-hWniXY3bG5qKpkKrAwPe4y+VTPmf086YQAnkxWh7uA1YrlRouWGa0M0Mxj3ZjnXFkv7/TD1bTy9lGUK26vRvWw==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-freebsd-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-freebsd-wasm32/-/sharp-freebsd-wasm32-0.35.4.tgz",
      "integrity": "sha512-lIsKw/BU+kjB4eZjxrYrZmwOJYi3Ajrv66iAlBmUPyKc3HpnloevB1g3wxGD9P/5BbQ1brBGl65VRRrCvQDEqA==",
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.3.3.tgz",
      "integrity": "sha512-suTBPTDGrI9WodccaDdwZItTSaBYASlBk1NSfElSHrUfzu3szG6lvIF58+WiFvnfzuK8ZBFS5zE00PxqxnRiPg==",
      "cpu": [
        "arm64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.3.3.tgz",
      "integrity": "sha512-FVJZ5mITMobmXIz/hPDTw0EintTW5H3WfrxwLqEqjiIihlu+hVRyGrFQ60xl0Lxn7Bt3zdpevPaQi0HEzqz9fw==",
      "cpu": [
        "x64"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.3.3.tgz",
      "integrity": "sha512-3rbU4vqXXc3hY/OiXdl52xZvT0F1yEngWfvqudtPJg/KkyiaQw2DRsFrNzpmLvfavbwOq3qXn36GP8obHRULQA==",
      "cpu": [
        "arm"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.3.3.tgz",
      "integrity": "sha512-0DaL0A6Xu6sQSQFwe4iVCrKWU2cCTItnRsYsCdxAMm9NF6twAA9BKnoqy4hqz4+azQ0JHuA26qiUKsf1XJ/v5A==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.3.3.tgz",
      "integrity": "sha512-cdn1OvUBwsXhbC0zSzJnNzf5MZ/mTrobawDvNXBTxe8VtqKAm0sRuEY2Evzovb/w9JMk4TvRxqt1mekSuJz64w==",
      "cpu": [
        "ppc64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.3.3.tgz",
      "integrity": "sha512-HjPVx7yKz+0lqdhDlTw1tt90wamBoxhiXpvl1XZpJLiHH4RCJ5yDTqH+VlYPv2fwFs89JFw4c1IexYOcQUi4IQ==",
      "cpu": [
        "riscv64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.3.3.tgz",
      "integrity": "sha512-neWLh+3yCNThxnfy3c4BbVBeGgt9aftno+XbT56iK28RgeDs3UOFWviLWlUu0bArYVYJaFDK+RRohbicUNCm8Q==",
      "cpu": [
        "s390x"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.3.3.tgz",
      "integrity": "sha512-4vKmvAst9nrowcqquKFAyZJUDolUaIp8uRiN0mWFguJ1IplC9/pitXtlnnlU4aa/eJw3J7i67V+pwUL+wZGdsA==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.3.3.tgz",
      "integrity": "sha512-Y9kQaLMuNoB0bPYOOdcZMaseNrFpPodIWWMrx+CZyydf2xn68j9WYc6sWWRrDwNkzCQjKYfc68L7jKjGlHMibw==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "musl"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.3.3.tgz",
      "integrity": "sha512-fj8Mv0HHfD1Rr+4I68+3agJynxDWtBFgicTbSOb9Bke6pIwzGcJ+RX/yHjmiEGFMCavY/dxvem7MyNaJF+wDiw==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "musl"
      ],
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.35.4.tgz",
      "integrity": "sha512-7OAS8gI0EReKGVN2HssHlM6umJgxF5VI3xN0p9FA91p/YO+ou5hiNghLdZ5BEHztwaaK5+bLKRf8x/o2L2nk9A==",
      "cpu": [
        "arm"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.35.4.tgz",
      "integrity": "sha512-De4jpEnAU8Hd5oT0j1G3uL4ZvTuipVMn7YC6vPaJhy6/7EwEae0SVAoBrUMYQbkLGDm85taVWwuPc1a44LTzCQ==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.35.4.tgz",
      "integrity": "sha512-2oYZJeIl4kCcMGk4ouZVjnkCtFrpQFlNEtJ6GbxzhHQchwH0NH/qEb9ykmOl29dqwMq+JhFdZn+1ak2FKhI9fQ==",
      "cpu": [
        "ppc64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.35.4.tgz",
      "integrity": "sha512-cPbNChoRURAWdebDIHSenxRpgEdy7JkPydSnUxRm9VvKD7m0/xVaR/8Fzlu81pk5nHEvHH87UZUA7cTtwnbJSA==",
      "cpu": [
        "riscv64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.35.4.tgz",
      "integrity": "sha512-RY0JFY8Fd6RonCBtHz+DvadaPkXDSI1AUn6yWL9TipqkZ1vY8w8evqdgyDFnkm4/K1ve1TvZiaePP5oSd4+WVQ==",
      "cpu": [
        "s390x"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.35.4.tgz",
      "integrity": "sha512-9qvvEAuk8k89TfWUoX2htWjbAMX8p+NxCppjpcg5k6xMsjhBQPTsoIh36h9Qde4WRuGpJeYnOjdosDn/cnv+OA==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.35.4.tgz",
      "integrity": "sha512-KB5jxpfWQTr0nc3xdHtWChdbifHrBGsd2SM62Eyxrl8afikm+f5qGBU75SJIZBT/S1MC8XyacdlXBMSWq6OURA==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "musl"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.35.4.tgz",
      "integrity": "sha512-f+eZJZIQNEEd26RPSW+76chwOf1XtA2Y/O+5ocVyLliHkeih3e+jhLVBdNTd2rS3IbNXK8+ug93Vf5ZXtF5Lxg==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "musl"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.35.4.tgz",
      "integrity": "sha512-zQnl4Kwp7Q6NHsENtU2T/00Zi+w3AQNwz3+UaTyVBy2FpXrzXzGjndpK61onhZjRtRpQXxCTeqw19bVyXOh7jA==",
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.11.3"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-webcontainers-wasm32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-webcontainers-wasm32/-/sharp-webcontainers-wasm32-0.35.4.tgz",
      "integrity": "sha512-ESfNkywmCfPNyaZjxooddJQiQ+l/nTpGEOGthxiLnIHXC/CmcBixnfwUleX9mCz9ovrUUvKMap/pm8RYbzfwaA==",
      "cpu": [
        "wasm32"
      ],
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/sharp-wasm32": "0.35.4"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.35.4.tgz",
      "integrity": "sha512-iNdlBX9gLVvqe2I3uIJSIKTq6wckP/DYxZtcqxm09x5Gi24DnFBmPAWZmr60ZyYMG0xlzo6goG3670ar+RXvRw==",
      "cpu": [
        "arm64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.35.4.tgz",
      "integrity": "sha512-kqRsbaa5CS6KHlpxnN7WhE6vAAugXyZButpRdvDWetlv6Qv4N9WTcrWzF7tXfB9T7MsoadqdI8hmwLq6UlLvtw==",
      "cpu": [
        "ia32"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.35.4.tgz",
      "integrity": "sha512-XtmnYhBcrORsJ4XJngyzr/EWP0hRZLAZRFaApdKuviyqF78+ylxh2y06ZmtULAMOnObJ3ucpN0AcwSWnMowTRg==",
      "cpu": [
        "x64"
      ],
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@jridgewell/gen-mapping": {
      "version": "0.3.13",
      "resolved": "https://registry.npmjs.org/@jridgewell/gen-mapping/-/gen-mapping-0.3.13.tgz",
      "integrity": "sha512-2kkt/7niJ6MgEPxF0bYdQ6etZaA+fQvDcLKckhy1yIQOzaoKjBBjSj63/aLVjYE3qhRt5dvM+uUyfCg6UKCBbA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.0",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/remapping": {
      "version": "2.3.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/remapping/-/remapping-2.3.5.tgz",
      "integrity": "sha512-LI9u/+laYG4Ds1TDKSJW2YPrIlcVYOwi2fUC6xB43lueCjgxV4lffOCZCtYFiH6TNOX+tQKXx97T4IKHbhyHEQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/gen-mapping": "^0.3.5",
        "@jridgewell/trace-mapping": "^0.3.24"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.6.0",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.6.0.tgz",
      "integrity": "sha512-T7jf+5zgsZHwNJ4lvQ7/aezbyk0nNX+zJVWpmHA7VYsEx7a7qr5Rg5IbtJFqkgze5Y2sruq1RUY8Q837Od7iFw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.31",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.31.tgz",
      "integrity": "sha512-zzNR+SdQSDJzc8joaeP8QQoCQr8NuYx2dIIytl1QeBEZHJ9uW6hebsrYgbz8hJwUQao3TWCMtmfV8Nu1twOLAw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.1.0",
        "@jridgewell/sourcemap-codec": "^1.4.14"
      }
    },
    "node_modules/@napi-rs/wasm-runtime": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@napi-rs/wasm-runtime/-/wasm-runtime-1.2.4.tgz",
      "integrity": "sha512-AJxoUD2/15ESHbvpcyjU274nsAPLuOtPHCk0vKJM5pj//Fg/B1FXNWjPnXTT9PymCYYiHo4zPj0ZomXBKhoy7g==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@tybys/wasm-util": "^0.10.3"
      },
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=23.5.0"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/Brooooooklyn"
      },
      "peerDependencies": {
        "@emnapi/core": "^1.7.1 || ^2.0.0-alpha.4",
        "@emnapi/runtime": "^1.7.1 || ^2.0.0-alpha.4"
      }
    },
    "node_modules/@next/env": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/env/-/env-16.3.5.tgz",
      "integrity": "sha512-NWEXVDMqoEo0ktmU6u0sE2Vg0LOcsD7NnOTJNo3/fEaTfsg+F1bMIxuDmQbda4e3yTIQwVdUREF2yIuMOusKtg==",
      "license": "MIT"
    },
    "node_modules/@next/eslint-plugin-next": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/eslint-plugin-next/-/eslint-plugin-next-16.3.5.tgz",
      "integrity": "sha512-PGfSeItHJ12DH8t+6sEbuMe59NE5rAhCfgk06QKTH2ne9VUL1JlaXdYXY3B8RaiF2SO50rDYvd39TulP6A6xZQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "4.9.1",
        "fast-glob": "3.3.1"
      }
    },
    "node_modules/@next/eslint-plugin-next/node_modules/@eslint-community/eslint-utils": {
      "version": "4.9.1",
      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "eslint-visitor-keys": "^3.4.3"
      },
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      },
      "peerDependencies": {
        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
      }
    },
    "node_modules/@next/eslint-plugin-next/node_modules/eslint-visitor-keys": {
      "version": "3.4.3",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-3.4.3.tgz",
      "integrity": "sha512-wpc+LXeiyiisxPlEkUzU6svyS1frIO3Mgxj1fdy7Pm8Ygzguax2N3Fa/D/ag1WqbOprdI+uY6wMUl8/a2G+iag==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@next/swc-darwin-arm64": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-arm64/-/swc-darwin-arm64-16.3.5.tgz",
      "integrity": "sha512-pMmGgETfKvElucLHtVaeiMRbp2zUbvKx7b1yGko0liBz3cw1mKSggWN/Rp/wPz8z+E1O82u3r4L1Co+ZS5hokQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-darwin-x64": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-darwin-x64/-/swc-darwin-x64-16.3.5.tgz",
      "integrity": "sha512-76VaGYvf6HPa5/w12yLkE3dXTn9AfdEviI79oEL3aZoAmRLc9rWitjWqyjViVysK/ht/y9YKzFkBrUdi/wGkow==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-gnu": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-gnu/-/swc-linux-arm64-gnu-16.3.5.tgz",
      "integrity": "sha512-zKDELJ5jSQMHeO/hmXUQsAzagX4bQD4OiMi3pQ5FbUj+yK506oLVHnKA2YXMlbg1EHHqJYtyePOgByIDXD1lqw==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-arm64-musl": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-arm64-musl/-/swc-linux-arm64-musl-16.3.5.tgz",
      "integrity": "sha512-7Vql0pgzCoHagv6+FNOZoqmJqA52c6zeVbhtS/47qFozO1MSx4ms7x7GHiciY8R5CDsSMKMQjJEryoJLcsBIbA==",
      "cpu": [
        "arm64"
      ],
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-gnu": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-gnu/-/swc-linux-x64-gnu-16.3.5.tgz",
      "integrity": "sha512-NH/xzehyHEFWE2nlcZon7TB/0+H4shfWCi7S1zka815XCOhJDYZhoeJtOYy0dh0WVRWACVXSyGNFFytoMxUhRg==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-linux-x64-musl": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-linux-x64-musl/-/swc-linux-x64-musl-16.3.5.tgz",
      "integrity": "sha512-lV4+EhWMfS8jcC+EH2nn/Cm5cn6XsgbE07bU9tMH8fCo0tNAqhyzi1b5wQ/Tn6NGFTvKDY65w3ZH95EjwBRAnQ==",
      "cpu": [
        "x64"
      ],
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-arm64-msvc": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-arm64-msvc/-/swc-win32-arm64-msvc-16.3.5.tgz",
      "integrity": "sha512-/wKzAREX2RF++MhicjDbg8tGn2AiBIM0+EFeTFKoUEUbW5D6amCJehd5Z5G1H5/gxNdgnwoXMcHz24H/c2tGkQ==",
      "cpu": [
        "arm64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@next/swc-win32-x64-msvc": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.3.5.tgz",
      "integrity": "sha512-LNdCHzgLFc+UeqMS84LzXPaeBRKyqDN9OMyFAr1OrB0XrNw78IRrEVtZvvA7245W/HsaoeVOQX9jPjPk8jojwA==",
      "cpu": [
        "x64"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 10"
      }
    },
    "node_modules/@nodelib/fs.scandir": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.scandir/-/fs.scandir-2.1.5.tgz",
      "integrity": "sha512-vq24Bq3ym5HEQm2NKCr3yXDwjc7vTsEThRDnkp2DK9p1uqLR+DHurm/NOTo0KG7HYHU7eppKZj3MyqYuMBf62g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "2.0.5",
        "run-parallel": "^1.1.9"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.stat": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.stat/-/fs.stat-2.0.5.tgz",
      "integrity": "sha512-RkhPPp2zrqDAQA/2jNhnztcPAlv64XdhIp7a7454A5ovI7Bukxgt7MX7udwAu3zg1DcpPU0rz3VV1SeaqvY4+A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nodelib/fs.walk": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/@nodelib/fs.walk/-/fs.walk-1.2.8.tgz",
      "integrity": "sha512-oGB+UxlgWcgQkgwo8GcEGwemoTFt3FIO9ababBmaGwXIoBKZ+GTy0pP185beGg7Llih/NSHSV2XAs1lnznocSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.scandir": "2.1.5",
        "fastq": "^1.6.0"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/@nolyfill/is-core-module": {
      "version": "1.0.39",
      "resolved": "https://registry.npmjs.org/@nolyfill/is-core-module/-/is-core-module-1.0.39.tgz",
      "integrity": "sha512-nn5ozdjYQpUCZlWGuxcJY/KpxkWQs4DcbMCmKojjyrYDEAGy4Ce19NN4v5MduafTwJlbKc99UA8YhSVqq9yPZA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.4.0"
      }
    },
    "node_modules/@rtsao/scc": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/@rtsao/scc/-/scc-1.1.0.tgz",
      "integrity": "sha512-zt6OdqaDoOnJ1ZYsCYGt9YmWzDXl4vQdKTyJev62gFhRGKdx7mcT54V9KIjg+d2wi9EXsPvAPKe7i7WjfVWB8g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@swc/helpers": {
      "version": "0.5.23",
      "resolved": "https://registry.npmjs.org/@swc/helpers/-/helpers-0.5.23.tgz",
      "integrity": "sha512-5lSsMOTXURePglDfvuAQUqkGek9Hg2kksOYay2m0+XR++b2NWYL/4sWyuvVBIs8oKnJaxkdi9whaL/sqN13afw==",
      "license": "Apache-2.0",
      "dependencies": {
        "tslib": "^2.8.0"
      }
    },
    "node_modules/@tailwindcss/node": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/node/-/node-4.3.3.tgz",
      "integrity": "sha512-/T8IKEsf9VTU6tLjgC7+sv2mOPtQxzE2jMw7u4Tt40Tx+QSZxpzh95/H6cMKoja9XuW7iMdLJYBB0o9G1CaAgg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/remapping": "^2.3.5",
        "enhanced-resolve": "^5.24.1",
        "jiti": "^2.7.0",
        "lightningcss": "1.32.0",
        "magic-string": "^0.30.21",
        "source-map-js": "^1.2.1",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide/-/oxide-4.3.3.tgz",
      "integrity": "sha512-krXjAikiaFSPaK/FkAQT5UTx3VormQaiZ5hBFlJZ9UFQGB/rwg1MZIhHAG9smMQRTdyJxP6Qt5MwMtdyU5FWrA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 20"
      },
      "optionalDependencies": {
        "@tailwindcss/oxide-android-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-arm64": "4.3.3",
        "@tailwindcss/oxide-darwin-x64": "4.3.3",
        "@tailwindcss/oxide-freebsd-x64": "4.3.3",
        "@tailwindcss/oxide-linux-arm-gnueabihf": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-arm64-musl": "4.3.3",
        "@tailwindcss/oxide-linux-x64-gnu": "4.3.3",
        "@tailwindcss/oxide-linux-x64-musl": "4.3.3",
        "@tailwindcss/oxide-wasm32-wasi": "4.3.3",
        "@tailwindcss/oxide-win32-arm64-msvc": "4.3.3",
        "@tailwindcss/oxide-win32-x64-msvc": "4.3.3"
      }
    },
    "node_modules/@tailwindcss/oxide-android-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-android-arm64/-/oxide-android-arm64-4.3.3.tgz",
      "integrity": "sha512-Y85A2gmPSkl5Ve5qR86GL4HT509cFqQh1aes9p3sSkyTPwt0Pppf3GkwGe4JPACcRYjgJIEhQgM6dBClnr0NYw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-arm64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-arm64/-/oxide-darwin-arm64-4.3.3.tgz",
      "integrity": "sha512-BiaWatpBcERQFDlOjRDpIVXuFK5PJez5SA4JMg6VYZdBYU+qKfV/vqjcIs+IYmtitf1xYQZTwXvU/8y4lfZUGw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-darwin-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-darwin-x64/-/oxide-darwin-x64-4.3.3.tgz",
      "integrity": "sha512-fAeUqfV5ndhxRwai8cXGzdLvul9utWOmeTkv69unv4ZXixjn61Z+p9lCWdwOwA3TYboG3BwdVuN/RDjhBRl0mw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-freebsd-x64": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-freebsd-x64/-/oxide-freebsd-x64-4.3.3.tgz",
      "integrity": "sha512-iyf5bV6+wnAlflVeEy7R25dupxTNECZN5QMI0qNT6eT+EgaGdZcKhGkr5SdoaWiLJ3spLqIY9VCeSGrwmtg4kw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm-gnueabihf": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm-gnueabihf/-/oxide-linux-arm-gnueabihf-4.3.3.tgz",
      "integrity": "sha512-aAYUprJAJQWWbRrPvtjdroZ56Md+JM8pMiopS6xGEwDfLhqj+2ver2p4nU4Mb3CRqcMmNBjo8KkUgcxhkzVQGQ==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-gnu/-/oxide-linux-arm64-gnu-4.3.3.tgz",
      "integrity": "sha512-nDxldcEENOxZRzC2uu9jrutZdAAQtb+8WWDCSnWL1zvBk1+FN+x6MtDViPB5AJMfttVCUhehGWus3XBPgatM/w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-arm64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-arm64-musl/-/oxide-linux-arm64-musl-4.3.3.tgz",
      "integrity": "sha512-Md44bD6veX/PC5iyF8cDVnw4HBIANZepRZZ7a8DQOvkfo5WUBwcp6iAuCUz23u+4SUkhJlD3eL7hNdW8ezd/kA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-gnu": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-gnu/-/oxide-linux-x64-gnu-4.3.3.tgz",
      "integrity": "sha512-tx7us1muwOKAKWao2v/GaafFeQboE6aj88vC6ziN2NCGcRm8gWUhwjzg+YdVB1e4boAtdtma4L43onunI6NS4w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-linux-x64-musl": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-linux-x64-musl/-/oxide-linux-x64-musl-4.3.3.tgz",
      "integrity": "sha512-SJxX60smvHgasZoBy11dX6YRjXJFovwWBoedhbQPOBzgFWBHGB+TVPWB9BxzR7TTxU8FQZAI2AyiNCMzFm8Img==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-wasm32-wasi": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-wasm32-wasi/-/oxide-wasm32-wasi-4.3.3.tgz",
      "integrity": "sha512-jx1+rPhY/5Ympkktd656HBWEBLxP7dH06losBLjjf5vgCODXvi9KhtftWcMIwTFIDqBr7cRnQkdLnAG+IOlGvQ==",
      "bundleDependencies": [
        "@napi-rs/wasm-runtime",
        "@emnapi/core",
        "@emnapi/runtime",
        "@tybys/wasm-util",
        "@emnapi/wasi-threads",
        "tslib"
      ],
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "^1.11.1",
        "@emnapi/runtime": "^1.11.1",
        "@emnapi/wasi-threads": "^1.2.2",
        "@napi-rs/wasm-runtime": "^1.1.4",
        "@tybys/wasm-util": "^0.10.2",
        "tslib": "^2.8.1"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-arm64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-arm64-msvc/-/oxide-win32-arm64-msvc-4.3.3.tgz",
      "integrity": "sha512-3rc292Ca2ceK6Ulcc/bAVnTs/3nDtoPhyEKlgPv+yQJQi/JS/AMJlqzxvlDacL1nekbrcf6bTqp/jV4qgnPxNQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/oxide-win32-x64-msvc": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/oxide-win32-x64-msvc/-/oxide-win32-x64-msvc-4.3.3.tgz",
      "integrity": "sha512-yJ0pwIVc/nYeGoV02WtsN8KYyLQv7kyI2wDnkezyJlGGjkd4QLwDGAwl47YpPJeuI0M0ObaXGSPjvWDPeTPggw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 20"
      }
    },
    "node_modules/@tailwindcss/postcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/@tailwindcss/postcss/-/postcss-4.3.3.tgz",
      "integrity": "sha512-JTSZZGQi1AyKirbLN3azmjVzef92tcX7h+iSqPdaeStyFpGpDlKvvpxeOE8njhbUanbRwr3z8DyzhICWnMtQeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@alloc/quick-lru": "^5.2.0",
        "@tailwindcss/node": "4.3.3",
        "@tailwindcss/oxide": "4.3.3",
        "postcss": "^8.5.16",
        "tailwindcss": "4.3.3"
      }
    },
    "node_modules/@tybys/wasm-util": {
      "version": "0.10.3",
      "resolved": "https://registry.npmjs.org/@tybys/wasm-util/-/wasm-util-0.10.3.tgz",
      "integrity": "sha512-F3fo1MYrRJYL3zER0OUOmkutjr1Vp23m7OsSgp7nq4SP6OqX6C/56XFIPAl5bt3zaBRjmW7SGz3u/6LwFpYcOg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@types/estree": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/@types/estree/-/estree-1.0.9.tgz",
      "integrity": "sha512-GhdPgy1el4/ImP05X05Uw4cw2/M93BCUmnEvWZNStlCzEKME4Fkk+YpoA5OiHNQmoS7Cafb8Xa3Pya8m1Qrzeg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json-schema": {
      "version": "7.0.15",
      "resolved": "https://registry.npmjs.org/@types/json-schema/-/json-schema-7.0.15.tgz",
      "integrity": "sha512-5+fP8P8MFNC+AyZCDxrB2pkZFPGzqQWUzpSeuuVLvm8VMcorNYavBqoFcxK8bQz4Qsbn4oUEEem4wDLfcysGHA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/json5": {
      "version": "0.0.29",
      "resolved": "https://registry.npmjs.org/@types/json5/-/json5-0.0.29.tgz",
      "integrity": "sha512-dRLjCWHYg4oaA77cxO64oO+7JwCwnIzkZPdrrC71jQmQtlhM556pwKo5bUzqvZndkVbeFLIIi+9TC40JNF5hNQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@types/node": {
      "version": "20.19.43",
      "resolved": "https://registry.npmjs.org/@types/node/-/node-20.19.43.tgz",
      "integrity": "sha512-6oYBAi5ikg4Pl+kGsoYtawUMBT2zZMCvPNF7pVLnHZfd1zf38DRiWn/gT01RYCdUqkv7Fhr+C9ot4/tb+2sVvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "undici-types": "~6.21.0"
      }
    },
    "node_modules/@types/react": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/@types/react/-/react-19.3.0.tgz",
      "integrity": "sha512-N0rFCuH9YoxG9/m61l9MfpJKfmLOVU0em7ipIz6TRgSSkvReLB9vL85GB+yr8Bs5leqpvg96JSwF4ZS1s4viQg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "csstype": "^3.2.2"
      }
    },
    "node_modules/@types/react-dom": {
      "version": "19.3.0",
      "resolved": "https://registry.npmjs.org/@types/react-dom/-/react-dom-19.3.0.tgz",
      "integrity": "sha512-ZI7bU42mZXXKHn/qNLEw2IrbiINU7X5+vfgdixBHkCNpYWXjKgfQ/P+uyGb5CjOLB9UcnTeg3rylQtV2hym44Q==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "@types/react": "^19.3.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/eslint-plugin/-/eslint-plugin-8.70.0.tgz",
      "integrity": "sha512-/v8HZt6RlyIZxB3ntehELOcUcfxKPVGWXnQdJuHRmzrqgF8nQypcC/oxGW+Ot4VGKDq81XugPKxx0n5PBtf9PA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/regexpp": "^4.12.2",
        "@typescript-eslint/scope-manager": "8.70.0",
        "@typescript-eslint/type-utils": "8.70.0",
        "@typescript-eslint/utils": "8.70.0",
        "@typescript-eslint/visitor-keys": "8.70.0",
        "ignore": "^7.0.5",
        "natural-compare": "^1.4.0",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "@typescript-eslint/parser": "^8.70.0",
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/eslint-plugin/node_modules/ignore": {
      "version": "7.0.9",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-7.0.9.tgz",
      "integrity": "sha512-brTTsvFRt5C1gGHtPst/281UjPD5t9fBqbgoMPlVWy11ZLTPfu7HxK4ZYqO9H7o/yC9rSTCI85EaQ4OoY12qYw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/@typescript-eslint/parser": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/parser/-/parser-8.70.0.tgz",
      "integrity": "sha512-zYvrmj9Yxd63UGaXw+kdt6A0F0s0qveJyuatIM77bYC2DE4pgmg7a50u8LR7PRtXd0x+h+Tl3eXabGm06SWd3Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/scope-manager": "8.70.0",
        "@typescript-eslint/types": "8.70.0",
        "@typescript-eslint/typescript-estree": "8.70.0",
        "@typescript-eslint/visitor-keys": "8.70.0",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/project-service": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/project-service/-/project-service-8.70.0.tgz",
      "integrity": "sha512-hFHbTNqhU9G+2eKFXCBVb1tjFT/LceiJ4+HfLO4pTpDI0KHi6iajpcFFkaSQ9gXmCh7n82A0PthaayEdN6mspQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/tsconfig-utils": "^8.70.0",
        "@typescript-eslint/types": "^8.70.0",
        "debug": "^4.4.3"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/scope-manager": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/scope-manager/-/scope-manager-8.70.0.tgz",
      "integrity": "sha512-8nP3Kwh5hlgZ4FicGvmznAmJe8UL4sdU8tLukrPaMuQmDuk4Y8xYfzu/aYZW4xT2JCgc7H/TpDI5cGlxcWJSqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.0",
        "@typescript-eslint/visitor-keys": "8.70.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/tsconfig-utils": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/tsconfig-utils/-/tsconfig-utils-8.70.0.tgz",
      "integrity": "sha512-adnkeeNq9Sq1sUf4+FRVc0KdgYghzsgFpZSQVZVvY0LCuUuN0FnQgyGzCJeC4fW1cdXseBAjU2EOqUIjbNcZUw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/type-utils": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/type-utils/-/type-utils-8.70.0.tgz",
      "integrity": "sha512-NUMKIhYVaVIVLnRL9CRt+VVcuLgSHUCpXn4/+K8wql+vdInUzvx8BjUO1oJ7cG9shjFJKtF8F8Hh2kCh3/KBVw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.0",
        "@typescript-eslint/typescript-estree": "8.70.0",
        "@typescript-eslint/utils": "8.70.0",
        "debug": "^4.4.3",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/types": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/types/-/types-8.70.0.tgz",
      "integrity": "sha512-asTOIYhDg4zdzOScCyaytrsV3cR6B4ecPQlXw/dJIm7J/MZTtCtfVII9JD8Geh4jTCrK/Xe6cg5UevoleMcoJQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/typescript-estree/-/typescript-estree-8.70.0.tgz",
      "integrity": "sha512-d9NmHMPEKQ7QCLLm1jI3zmoQBwT5KwFYjXBJ9ymZfKCUU+5rmTRykKAFvH5Qn/ZCds3CEAFS9OC9M/jkl0X2bA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/project-service": "8.70.0",
        "@typescript-eslint/tsconfig-utils": "8.70.0",
        "@typescript-eslint/types": "8.70.0",
        "@typescript-eslint/visitor-keys": "8.70.0",
        "debug": "^4.4.3",
        "minimatch": "^10.2.2",
        "semver": "^7.7.3",
        "tinyglobby": "^0.2.15",
        "ts-api-utils": "^2.5.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/balanced-match": {
      "version": "4.0.4",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-4.0.4.tgz",
      "integrity": "sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": "18 || 20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/brace-expansion": {
      "version": "5.0.9",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-5.0.9.tgz",
      "integrity": "sha512-ScQ4IuvIEF1TMlP7Zt+vjJ//9zlPb2SDcxWxM3bk8s6t6GGdJ7KO1dCcTidOPJKePW30LE/2cT7wCyPho9/Wxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^4.0.2"
      },
      "engines": {
        "node": "20 || >=22"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/minimatch": {
      "version": "10.2.6",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-10.2.6.tgz",
      "integrity": "sha512-vpLQEs+VLCr1nU0BXS07maYoFwlDAH0gngQuuttxIwutDFEMHq2blX+8vpgxDdK3J1PwjCJiep77OitTZ4Ll1A==",
      "dev": true,
      "license": "BlueOak-1.0.0",
      "dependencies": {
        "brace-expansion": "^5.0.8"
      },
      "engines": {
        "node": "18 || 20 || >=22"
      },
      "funding": {
        "url": "https://github.com/sponsors/isaacs"
      }
    },
    "node_modules/@typescript-eslint/typescript-estree/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/@typescript-eslint/utils": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/utils/-/utils-8.70.0.tgz",
      "integrity": "sha512-oZmtKJz/4fufZ2p3+Cn3ijEojcdfR+1zYDH2xKYrEly0dR/Q/1xUPRCOlKGxod78nWlU2UnDe09GZ3TaknBFGA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.9.1",
        "@typescript-eslint/scope-manager": "8.70.0",
        "@typescript-eslint/types": "8.70.0",
        "@typescript-eslint/typescript-estree": "8.70.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/@typescript-eslint/visitor-keys/-/visitor-keys-8.70.0.tgz",
      "integrity": "sha512-BoC8PiO4Hkdo0TVJh9Ntxr5MxPDI7/oFsrygN5ADelFSeXG/qgNuucIGA+L5Z6JpPTE/uRfcTWtscjbUaufepQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/types": "8.70.0",
        "eslint-visitor-keys": "^5.0.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      }
    },
    "node_modules/@typescript-eslint/visitor-keys/node_modules/eslint-visitor-keys": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-5.0.1.tgz",
      "integrity": "sha512-tD40eHxA35h0PEIZNeIjkHoDR4YjjJp34biM0mDvplBe//mB+IHCqHDGV7pxF+7MklTvighcCPPZC7ynWyjdTA==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^20.19.0 || ^22.13.0 || >=24"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/@unrs/resolver-binding-android-arm-eabi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm-eabi/-/resolver-binding-android-arm-eabi-1.12.2.tgz",
      "integrity": "sha512-g5T90pqg1bo/7mytQx6F4iBNC0Wsh9cu+z9veDbFjc7HjpesJFWD7QMS0NGStXM075+7dJPPVvBbpZlnrdpi/w==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-android-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-android-arm64/-/resolver-binding-android-arm64-1.12.2.tgz",
      "integrity": "sha512-YGCRZv/9GLhwmz6mYDeTsm/92BAyR28l6c2ReweVW5pWgfsitWLY8upvfRlGdoyD8HjeTHSYJWyZGD4KJA/nFQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-arm64/-/resolver-binding-darwin-arm64-1.12.2.tgz",
      "integrity": "sha512-u9DiNT1auQMO20A9SyTuG3wUgQWB9Z7KjAg0uFuCDR1FsAY8A0CG2S6JpHS1xwm/w1G08bjXZDcyOCjv1WAm2w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-darwin-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-darwin-x64/-/resolver-binding-darwin-x64-1.12.2.tgz",
      "integrity": "sha512-f7rPLi/T1HVKZu/u6t87lroib16n8vrSzcyxI7lg4BGO9UF26KhQL44sd9eOUgrTYhvRXtWOIZT5PejdPyJfUA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ]
    },
    "node_modules/@unrs/resolver-binding-freebsd-x64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-freebsd-x64/-/resolver-binding-freebsd-x64-1.12.2.tgz",
      "integrity": "sha512-BpcOjWCJub6nRZUS2zA20pmLvjtqAtGejETaIyRLiZiQf++cbrjltLA5NN/xaXfqeOBOSlMFbemIl5/S5tljmg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-gnueabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-gnueabihf/-/resolver-binding-linux-arm-gnueabihf-1.12.2.tgz",
      "integrity": "sha512-vZTDvdSISZjJx66OzJqtsOhzifbqRjbmI1Mnu49fQDwog5GtDI4QidRiEAYbZCRj9C8YZEW+3ZjqsyS9GR4k2A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm-musleabihf": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm-musleabihf/-/resolver-binding-linux-arm-musleabihf-1.12.2.tgz",
      "integrity": "sha512-BiPI+IrIlwcW4nLLMM21+B1dFPzd55yAVgVGrdgDjNef+ch03GdxrcyaIz8X9SsQirh/kCQ7mviyWlMxdh2D7g==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-gnu/-/resolver-binding-linux-arm64-gnu-1.12.2.tgz",
      "integrity": "sha512-zJc0H99FEPoFfSrNpa91HYfxzfAJCr502oxNK1cfdC9hlaFI43RT+JFCann9JUgZmLzzntChHyn13Sgn9ljHNg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-arm64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-arm64-musl/-/resolver-binding-linux-arm64-musl-1.12.2.tgz",
      "integrity": "sha512-KQ3Lki6l+Pz1k/eBipN41ES+YUK30beLGb9YqcB1O542cyLCNE6GaxrfcY3T6EezmGGk84wb5XyO9loTM9tkcA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-gnu/-/resolver-binding-linux-loong64-gnu-1.12.2.tgz",
      "integrity": "sha512-3SJGEh1DborhG6pyxvhPzCT4bbSIVihsvgJc13P1bHG7KLdNDaF9T3gsTwFc7Jw/5Y5/iWOjkEx7Zy0NvCGX3Q==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-loong64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-loong64-musl/-/resolver-binding-linux-loong64-musl-1.12.2.tgz",
      "integrity": "sha512-jiuG/Obbel7uw1PwHNFfrkiKhLAF6mnyZ6aWlOAVN9WqKm8v0OFGnciJIHu8+CMvXLQ8AD51LPzAoUfT21D5Ew==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-ppc64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-ppc64-gnu/-/resolver-binding-linux-ppc64-gnu-1.12.2.tgz",
      "integrity": "sha512-q7xRvVpmcfeL+LlZg8Pbbo6QaTZwDU5BaGZbwfhkEsXJn3Was8xYfE0RBH266xZt0rM6B7i8xAYIvjthuUIWHg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-gnu/-/resolver-binding-linux-riscv64-gnu-1.12.2.tgz",
      "integrity": "sha512-0CVdx6lcnT3Q9inOH8tsMIOJ6ImndllMjqJHg8RLVdB7Vq4SfkEXl9mCSsVNuNA4MCYycRicCUxPCabVHJRr6A==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-riscv64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-riscv64-musl/-/resolver-binding-linux-riscv64-musl-1.12.2.tgz",
      "integrity": "sha512-iOwlRo9vnp6R6ohHQS11n0NnfdXx/omhkocmIfaPRpQhKZ+3BDMkkdRVh53qjkFkpPddf+FETA28NwGN7l5l+w==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-s390x-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-s390x-gnu/-/resolver-binding-linux-s390x-gnu-1.12.2.tgz",
      "integrity": "sha512-HYJtLfXq94q8iZNFT1lknx258wlkkWhZeUXJRqzKBBUJ00CvZ+N33zgbCqimLjsyw5Va6uUxhVa12mI+kaveEw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-gnu": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-gnu/-/resolver-binding-linux-x64-gnu-1.12.2.tgz",
      "integrity": "sha512-mPsUhunKKDih5O96Y6enDQyHc1SqBPlY1E/SfMWDM3EdJ95Z9CArPeCVwCCqbP45ljvivdEk8Fxn+SIb1rDAJQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-linux-x64-musl": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-linux-x64-musl/-/resolver-binding-linux-x64-musl-1.12.2.tgz",
      "integrity": "sha512-azrt6+5ydLd8Vt210AAFis/lZevSfPw93EJRIJG+xPu4WCJ8K0kppCTpMyLPcKT7H15M4Jnt2tMp5bOvCkRC6A==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ]
    },
    "node_modules/@unrs/resolver-binding-openharmony-arm64": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-openharmony-arm64/-/resolver-binding-openharmony-arm64-1.12.2.tgz",
      "integrity": "sha512-YZ9hP4O0X9PQb8eO980qmLNGH4zT3I9+SZTdt0Pr0YyuGQhYKoOZkV02VzrzyOZJ5xIJ3UFIenKkUkGg8GjgWQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ]
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-wasm32-wasi/-/resolver-binding-wasm32-wasi-1.12.2.tgz",
      "integrity": "sha512-tYFDIkMxSflfEc/h92ZWNsZlHSwgimbNHSO3PL2JWQHfCuC2q316jMyYU9TIWZsFK2bQwyK5VAdYgn8ygPj69A==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/core": "1.10.0",
        "@emnapi/runtime": "1.10.0",
        "@napi-rs/wasm-runtime": "^1.1.4"
      },
      "engines": {
        "node": ">=14.0.0"
      }
    },
    "node_modules/@unrs/resolver-binding-wasm32-wasi/node_modules/@emnapi/runtime": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
      "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@unrs/resolver-binding-win32-arm64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-arm64-msvc/-/resolver-binding-win32-arm64-msvc-1.12.2.tgz",
      "integrity": "sha512-qzNyg3xL0VPQmCaUh+N5jSitce6k+uCBfMDesWRnlULOZaqUkaJ0ybdT+UqlAWJoQjuqfIU/0Ptx9bteN4D82g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-ia32-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-ia32-msvc/-/resolver-binding-win32-ia32-msvc-1.12.2.tgz",
      "integrity": "sha512-WD9sY00OfpHVGfsnHZoA8jVT+esS/Bg8z8jzxp5BnDCjjwsuKsPQrzswwpFy4J1AUJbXPRfkpcX0mXrzeXW79g==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/@unrs/resolver-binding-win32-x64-msvc": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/@unrs/resolver-binding-win32-x64-msvc/-/resolver-binding-win32-x64-msvc-1.12.2.tgz",
      "integrity": "sha512-nAB74NfSNKknqQ1RrYj6uz8FcXEomu/MATJZxh/x+BArzN2U3JbOYC0APYzUIGhVY3m5hRxA8VPNdPBoG8txlA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ]
    },
    "node_modules/acorn": {
      "version": "8.18.0",
      "resolved": "https://registry.npmjs.org/acorn/-/acorn-8.18.0.tgz",
      "integrity": "sha512-lGq+9yr1/GuAWaVYIHRjvvySG5/4VfKIvC8EWxStPdcDh/Ka7FG3twP6v4d5BkravUilhIAsG4Qj83t02LWUPQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "acorn": "bin/acorn"
      },
      "engines": {
        "node": ">=0.4.0"
      }
    },
    "node_modules/acorn-jsx": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-5.3.2.tgz",
      "integrity": "sha512-rq9s+JNhf0IChjtDXxllJ7g41oZk5SlXtp0LHwyA5cejwn7vKmKp4pPri6YEePv2PU65sAsegbXtIinmDFDXgQ==",
      "dev": true,
      "license": "MIT",
      "peerDependencies": {
        "acorn": "^6.0.0 || ^7.0.0 || ^8.0.0"
      }
    },
    "node_modules/ajv": {
      "version": "6.15.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.15.0.tgz",
      "integrity": "sha512-fgFx7Hfoq60ytK2c7DhnF8jIvzYgOMxfugjLOSMHjLIPgenqa7S7oaagATUq99mV6IYvN2tRmC0wnTYX6iPbMw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      },
      "funding": {
        "type": "github",
        "url": "https://github.com/sponsors/epoberezkin"
      }
    },
    "node_modules/ansi-styles": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-4.3.0.tgz",
      "integrity": "sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-convert": "^2.0.1"
      },
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/chalk/ansi-styles?sponsor=1"
      }
    },
    "node_modules/argparse": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/argparse/-/argparse-2.0.1.tgz",
      "integrity": "sha512-8+9WqebbFzpX9OR+Wa6O29asIogeRMzcGtAINdpMHHyAg10f05aSFVBbcEqGf/PXw1EjAZ+q2/bEBg3DvurK3Q==",
      "dev": true,
      "license": "Python-2.0"
    },
    "node_modules/aria-query": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/aria-query/-/aria-query-5.3.2.tgz",
      "integrity": "sha512-COROpnaoap1E2F000S62r6A60uHZnmlvomhfyT2DlTcrY1OrBKn2UhH7qn5wTC9zMvD0AY7csdPSNwKP+7WiQw==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/array-buffer-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/array-buffer-byte-length/-/array-buffer-byte-length-1.0.2.tgz",
      "integrity": "sha512-LHE+8BuR7RYGDKvnrmcuSq3tDcKv9OFEXQt/HpbZhY7V6h0zlUXutnAD82GiFx9rdieCMjkvtcsPqBwgUl1Iiw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "is-array-buffer": "^3.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array-includes": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/array-includes/-/array-includes-3.2.0.tgz",
      "integrity": "sha512-VXY5eFRarnXcYxwBjJzPmEhH55+rmP79/+ueDhi0F+TuqfHCItagIHqxeUZrmgrOPa31QTh9H85DjX3FfJ0FTg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "es-shim-unscopables": "^1.1.0",
        "is-string": "^1.1.1",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlast": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/array.prototype.findlast/-/array.prototype.findlast-1.2.5.tgz",
      "integrity": "sha512-CVvd6FHg1Z3POpBLxO6E6zr+rSKEQ9L6rZHAaY7lLfhKsWYUBBOuMs0e9o24oopj6H+geRCX0YJ+TJLBK2eHyQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.findlastindex": {
      "version": "1.2.6",
      "resolved": "https://registry.npmjs.org/array.prototype.findlastindex/-/array.prototype.findlastindex-1.2.6.tgz",
      "integrity": "sha512-F/TKATkzseUExPlfvmwQKGITM3DGTK+vkAsCZoDc5daVygbJBnjEUCbgkAvVFsgfXfX4YIqZ/27G3k3tdXrTxQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-shim-unscopables": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flat": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flat/-/array.prototype.flat-1.3.3.tgz",
      "integrity": "sha512-rwG/ja1neyLqCuGZ5YYrznA62D4mZXg0i1cIskIUKSiqF3Cje9/wXAls9B9s1Wa2fomMsIv8czB8jZcPmxCXFg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.flatmap": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/array.prototype.flatmap/-/array.prototype.flatmap-1.3.3.tgz",
      "integrity": "sha512-Y7Wt51eKJSyi80hFrJCePGGNo5ktJCslFuboqJsbf57CCPcm5zztluPlc4/aD8sWsKvlwatezpV4U1efk8kpjg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/array.prototype.tosorted": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/array.prototype.tosorted/-/array.prototype.tosorted-1.1.4.tgz",
      "integrity": "sha512-p6Fx8B7b7ZhL/gmUsAy0D15WhvDccw3mnGNbZpi3pmeJdxtWsj2jEaI4Y6oo3XiHfzuSgPwKc04MYt6KgvC/wA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3",
        "es-errors": "^1.3.0",
        "es-shim-unscopables": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/arraybuffer.prototype.slice": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/arraybuffer.prototype.slice/-/arraybuffer.prototype.slice-1.0.4.tgz",
      "integrity": "sha512-BNoCY6SXXPQ7gF2opIP4GBE+Xw7U+pHMYKuzjgCN3GwiaIR09UUeKfheyIry77QtrCBlC0KK0q5/TER/tYh3PQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.1",
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.5",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "is-array-buffer": "^3.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ast-types-flow": {
      "version": "0.0.8",
      "resolved": "https://registry.npmjs.org/ast-types-flow/-/ast-types-flow-0.0.8.tgz",
      "integrity": "sha512-OH/2E5Fg20h2aPrbe+QL8JZQFko0YZaF+j4mnQ7BGhfavO7OpSLa8a0y9sBwomHdSbkhTS8TQNayBfnW5DwbvQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/async-function": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/async-function/-/async-function-1.0.0.tgz",
      "integrity": "sha512-hsU18Ae8CDTR6Kgu9DYf0EbCr/a5iGL0rytQDobUcdpYOKokk8LEjVphnXkDkgpi0wYVsqrXuP0bZxJaTqdgoA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/available-typed-arrays": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/available-typed-arrays/-/available-typed-arrays-1.0.7.tgz",
      "integrity": "sha512-wvUjBtSGN7+7SjNpq/9M2Tg350UZD3q62IFZLbRAR1bSMlCo1ZaeW+BJ+D090e4hIIZLBcTDWe4Mh4jvUDajzQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "possible-typed-array-names": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/axe-core": {
      "version": "4.13.0",
      "resolved": "https://registry.npmjs.org/axe-core/-/axe-core-4.13.0.tgz",
      "integrity": "sha512-UzGt8zg7Ny8djbYMhxl2zuEevVa7r2gJjYY5Lwr1xM7+XU2nd6CkIWFTVcCIbAP63vSz71NaVyyuSk9lHKcy0A==",
      "dev": true,
      "license": "MPL-2.0",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/axobject-query": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/axobject-query/-/axobject-query-4.1.0.tgz",
      "integrity": "sha512-qIj0G9wZbMGNLjLmg1PT6v2mE9AH2zlnADJD/2tC6E00hgmhUOfEB6greHPAfLRSufHqROIUTkw6E+M3lH0PTQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/balanced-match": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/baseline-browser-mapping": {
      "version": "2.11.22",
      "resolved": "https://registry.npmjs.org/baseline-browser-mapping/-/baseline-browser-mapping-2.11.22.tgz",
      "integrity": "sha512-pWc4w51fBFd7mav43/zKRC+RI6f4yfzQoVlfvE8dECePyfkn1bzLp01Fj0QACcyCZyFhiEMyD2qScfKRWgWibA==",
      "license": "Apache-2.0",
      "bin": {
        "baseline-browser-mapping": "dist/cli.cjs"
      },
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/brace-expansion": {
      "version": "1.1.18",
      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.18.tgz",
      "integrity": "sha512-Edep/X9fGqVNmzKBVsDYIOtD+z1tuezV70LBjdCst9Tqu76lsnvRiZ6oTic1n+/BIwX6QDGAO94PN4N2SADvtw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "balanced-match": "^1.0.0",
        "concat-map": "0.0.1"
      }
    },
    "node_modules/braces": {
      "version": "3.0.3",
      "resolved": "https://registry.npmjs.org/braces/-/braces-3.0.3.tgz",
      "integrity": "sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fill-range": "^7.1.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/browserslist": {
      "version": "4.28.9",
      "resolved": "https://registry.npmjs.org/browserslist/-/browserslist-4.28.9.tgz",
      "integrity": "sha512-EWazOblFYUvlGZcfGhPUPmYh3nikUxBVb+y9MJun5f3hBi812X+8MSQTujLBtgK3cf51fJWbWfOjyeO954d+Eg==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "baseline-browser-mapping": "^2.11.20",
        "caniuse-lite": "^1.0.30001810",
        "electron-to-chromium": "^1.5.420",
        "node-releases": "^2.0.54",
        "update-browserslist-db": "^1.3.2"
      },
      "bin": {
        "browserslist": "cli.js"
      },
      "engines": {
        "node": "^6 || ^7 || ^8 || ^9 || ^10 || ^11 || ^12 || >=13.7"
      }
    },
    "node_modules/call-bind": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/call-bind/-/call-bind-1.0.9.tgz",
      "integrity": "sha512-a/hy+pNsFUTR+Iz8TCJvXudKVLAnz/DyeSUo10I5yvFDQJBFU2s9uqQpoSrJlroHUKoKqzg+epxyP9lqFdzfBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "get-intrinsic": "^1.3.0",
        "set-function-length": "^1.2.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/callsites": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/callsites/-/callsites-3.1.0.tgz",
      "integrity": "sha512-P8BjAsXvZS+VIDUI11hHCQEv74YT67YUi5JJFNWIqL235sBmjX4+qx9Muvls5ivyNENctx46xQLQ3aTuE7ssaQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/caniuse-lite": {
      "version": "1.0.30001810",
      "resolved": "https://registry.npmjs.org/caniuse-lite/-/caniuse-lite-1.0.30001810.tgz",
      "integrity": "sha512-TITQPUkaz+aVk5GL6NhOdwk1aEaNTSDPsGFWrTuhKGtjTF70jL/Oht2W4c6rXUe5fu7Ie19VIahAXHIIiWWNeg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/caniuse-lite"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "CC-BY-4.0"
    },
    "node_modules/chalk": {
      "version": "4.1.2",
      "resolved": "https://registry.npmjs.org/chalk/-/chalk-4.1.2.tgz",
      "integrity": "sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ansi-styles": "^4.1.0",
        "supports-color": "^7.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/chalk/chalk?sponsor=1"
      }
    },
    "node_modules/client-only": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/client-only/-/client-only-0.0.1.tgz",
      "integrity": "sha512-IV3Ou0jSMzZrd3pZ48nLkT9DA7Ag1pnPzaiQhpW7c3RbcqqzvzzVu+L8gfqMp/8IM2MQtSiqaCxrrcfu8I8rMA==",
      "license": "MIT"
    },
    "node_modules/color-convert": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/color-convert/-/color-convert-2.0.1.tgz",
      "integrity": "sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "color-name": "~1.1.4"
      },
      "engines": {
        "node": ">=7.0.0"
      }
    },
    "node_modules/color-name": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/color-name/-/color-name-1.1.4.tgz",
      "integrity": "sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/concat-map": {
      "version": "0.0.1",
      "resolved": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
      "integrity": "sha512-/Srv4dswyQNBfohGpz9o6Yb3Gz3SrUDqBH5rTuhGR7ahtlbYKnVxw2bCFMRljaA7EXHaXZ8wsHdodFvbkhKmqg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/convert-source-map": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/convert-source-map/-/convert-source-map-2.0.0.tgz",
      "integrity": "sha512-Kvp459HrV2FEJ1CAsi1Ku+MY3kasH19TFykTz2xWmMeq6bk2NU3XXvfJ+Q61m0xktWwt+1HSYf3JZsTms3aRJg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cross-spawn": {
      "version": "7.0.6",
      "resolved": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-7.0.6.tgz",
      "integrity": "sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "path-key": "^3.1.0",
        "shebang-command": "^2.0.0",
        "which": "^2.0.1"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/csstype": {
      "version": "3.2.3",
      "resolved": "https://registry.npmjs.org/csstype/-/csstype-3.2.3.tgz",
      "integrity": "sha512-z1HGKcYy2xA8AGQfwrn0PAy+PB7X/GSj3UVJW9qKyn43xWa+gl5nXmU4qqLMRzWVLFC8KusUX8T/0kCiOYpAIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/damerau-levenshtein": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/damerau-levenshtein/-/damerau-levenshtein-1.0.8.tgz",
      "integrity": "sha512-sdQSFB7+llfUcQHUQO3+B8ERRj0Oa4w9POWMI/puGtuf7gFywGmkaLCElnudfTiKZV+NvHqL0ifzdrI8Ro7ESA==",
      "dev": true,
      "license": "BSD-2-Clause"
    },
    "node_modules/data-view-buffer": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-buffer/-/data-view-buffer-1.0.2.tgz",
      "integrity": "sha512-EmKO5V3OLXh1rtK2wgXRansaK1/mtVdTUEiEI0W8RkvgT05kfxaH29PliLnpLP73yYO6142Q72QNa8Wx/A5CqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/data-view-byte-length": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/data-view-byte-length/-/data-view-byte-length-1.0.2.tgz",
      "integrity": "sha512-tuhGbE6CfTM9+5ANGf+oQb72Ky/0+s3xKUpHvShfiz2RxMFgFPjsXuRLBVMtvMs15awe45SRb83D6wH4ew6wlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/inspect-js"
      }
    },
    "node_modules/data-view-byte-offset": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/data-view-byte-offset/-/data-view-byte-offset-1.0.1.tgz",
      "integrity": "sha512-BS8PfmtDGnrgYdOonGZQdLZslWIeCGFP9tpan0hi1Co2Zr2NKADsvGYA8XxuG/4UWgJ6Cjtv+YJnB6MM69QGlQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-data-view": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/debug": {
      "version": "4.4.3",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.3.tgz",
      "integrity": "sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/deep-is": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.4.tgz",
      "integrity": "sha512-oIPzksmTg4/MriiaYGO+okXDT7ztn/w3Eptv/+gSIdMdKsJo0u4CfYNFJPy+4SKMuCqGw2wxnA+URMg3t8a/bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/define-data-property": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/define-data-property/-/define-data-property-1.1.4.tgz",
      "integrity": "sha512-rBMvIzlpA8v6E+SJZoo++HAYqsLrkg7MSfIinMPFhmkorw7X+dOXVJQs+QT69zGkzMyfDnIMN2Wid1+NbL3T+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0",
        "es-errors": "^1.3.0",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/define-properties": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/define-properties/-/define-properties-1.2.1.tgz",
      "integrity": "sha512-8QmQKqEASLd5nx0U1B1okLElbUuuttJ/AnYmRXbbbGDWh6uS208EjD4Xqq/I9wK7u0v6O08XhTWnt5XtEbR6Dg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.0.1",
        "has-property-descriptors": "^1.0.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "devOptional": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/doctrine": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/doctrine/-/doctrine-2.1.0.tgz",
      "integrity": "sha512-35mSku4ZXK0vfCuHEDAwt55dg2jNajHZ1odvF+8SSr82EsZY4QmXfuWso8oEd8zRhVObSN18aM0CjSdoBX7zIw==",
      "dev": true,
      "license": "Apache-2.0",
      "dependencies": {
        "esutils": "^2.0.2"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/electron-to-chromium": {
      "version": "1.5.427",
      "resolved": "https://registry.npmjs.org/electron-to-chromium/-/electron-to-chromium-1.5.427.tgz",
      "integrity": "sha512-n14zb3FdsChZ2BNobqNHAJMcP3ifFv4paox2LvCrfVAQcqGiSURgbJl+PfMpHVCNFkStnNc+RRVtPBTVW5PDgw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/emoji-regex": {
      "version": "9.2.2",
      "resolved": "https://registry.npmjs.org/emoji-regex/-/emoji-regex-9.2.2.tgz",
      "integrity": "sha512-L18DaJsXSUk2+42pv8mLs5jJT2hqFkFE4j21wOmgbUqsZ2hL72NsUU785g9RXgo3s0ZNgVl42TiHp3ZtOv/Vyg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/enhanced-resolve": {
      "version": "5.24.5",
      "resolved": "https://registry.npmjs.org/enhanced-resolve/-/enhanced-resolve-5.24.5.tgz",
      "integrity": "sha512-L1l8TNvomm6UVW5B253AGxQagSQr+vGwhMlrrfRS2qmhx46AMpMVJKQYLvWYbysTMY8VoicOvzHzoHMbyzB+4A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "graceful-fs": "^4.2.4",
        "tapable": "^2.3.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/es-abstract": {
      "version": "1.24.2",
      "resolved": "https://registry.npmjs.org/es-abstract/-/es-abstract-1.24.2.tgz",
      "integrity": "sha512-2FpH9Q5i2RRwyEP1AylXe6nYLR5OhaJTZwmlcP0dL/+JCbgg7yyEo/sEK6HeGZRf3dFpWwThaRHVApXSkW3xeg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-buffer-byte-length": "^1.0.2",
        "arraybuffer.prototype.slice": "^1.0.4",
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "data-view-buffer": "^1.0.2",
        "data-view-byte-length": "^1.0.2",
        "data-view-byte-offset": "^1.0.1",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "es-set-tostringtag": "^2.1.0",
        "es-to-primitive": "^1.3.0",
        "function.prototype.name": "^1.1.8",
        "get-intrinsic": "^1.3.0",
        "get-proto": "^1.0.1",
        "get-symbol-description": "^1.1.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "internal-slot": "^1.1.0",
        "is-array-buffer": "^3.0.5",
        "is-callable": "^1.2.7",
        "is-data-view": "^1.0.2",
        "is-negative-zero": "^2.0.3",
        "is-regex": "^1.2.1",
        "is-set": "^2.0.3",
        "is-shared-array-buffer": "^1.0.4",
        "is-string": "^1.1.1",
        "is-typed-array": "^1.1.15",
        "is-weakref": "^1.1.1",
        "math-intrinsics": "^1.1.0",
        "object-inspect": "^1.13.4",
        "object-keys": "^1.1.1",
        "object.assign": "^4.1.7",
        "own-keys": "^1.0.1",
        "regexp.prototype.flags": "^1.5.4",
        "safe-array-concat": "^1.1.3",
        "safe-push-apply": "^1.0.0",
        "safe-regex-test": "^1.1.0",
        "set-proto": "^1.0.0",
        "stop-iteration-iterator": "^1.1.0",
        "string.prototype.trim": "^1.2.10",
        "string.prototype.trimend": "^1.0.9",
        "string.prototype.trimstart": "^1.0.8",
        "typed-array-buffer": "^1.0.3",
        "typed-array-byte-length": "^1.0.3",
        "typed-array-byte-offset": "^1.0.4",
        "typed-array-length": "^1.0.7",
        "unbox-primitive": "^1.1.0",
        "which-typed-array": "^1.1.19"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-abstract-get": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/es-abstract-get/-/es-abstract-get-1.0.0.tgz",
      "integrity": "sha512-6PMWXpdhshVvFp+FoWYs1EvG1Nj0tvk0dZM+XcK0xMEM1czRVcP6ohqPWHy6qPagSpC8j4+p89WXlT+xXJs/fg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.2",
        "is-callable": "^1.2.7",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-iterator-helpers": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/es-iterator-helpers/-/es-iterator-helpers-1.4.0.tgz",
      "integrity": "sha512-c/A0P0oxkACDc+cKWw8evLXK83oBKgn0qPOqCYT4x9uolpCIJAcYvJC9QYKNDRPsTeGyCrQ326jrvgZWdCdK5Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-set-tostringtag": "^2.1.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "globalthis": "^1.0.4",
        "gopd": "^1.2.0",
        "has-property-descriptors": "^1.0.2",
        "has-proto": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "iterator.prototype": "^1.1.5",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.2.tgz",
      "integrity": "sha512-HWcBoN6NileqtSydK2FqHbS/LoDd2pqrnQHLyJzBj4kOp/ky2MWMN694xOfkK8/SnUsW2DH7EfyVlydKCsm1Zw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-set-tostringtag": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/es-set-tostringtag/-/es-set-tostringtag-2.1.0.tgz",
      "integrity": "sha512-j6vWzfrGVfyXxge+O0x5sh6cvxAog0a/4Rdd2K36zCMV5eJ+/+tOAngRO8cODMNWbVRdVlmGZQL2YS3yR8bIUA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-shim-unscopables": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/es-shim-unscopables/-/es-shim-unscopables-1.1.0.tgz",
      "integrity": "sha512-d9T8ucsEhh8Bi1woXCf+TIKDIROLG5WCkxg8geBCbvk22kzwC5G2OnXVMO6FUsvQlgUUXQ2itephWDLqDzbeCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-to-primitive": {
      "version": "1.3.4",
      "resolved": "https://registry.npmjs.org/es-to-primitive/-/es-to-primitive-1.3.4.tgz",
      "integrity": "sha512-yPDz7wqpg1/mmHLmS3tcfTfbw5f1eryXvyghYBffGdERwe+mV7ZcWzTR8LR17Kvqt3qfPurjlonmnq3MKXIOXw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-abstract-get": "^1.0.0",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "is-callable": "^1.2.7",
        "is-date-object": "^1.1.0",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/escalade": {
      "version": "3.2.0",
      "resolved": "https://registry.npmjs.org/escalade/-/escalade-3.2.0.tgz",
      "integrity": "sha512-WUj2qlxaQtO4g6Pq5c29GTcWGDyd8itL8zTlipgECz3JesAiiOKotd8JU6otB3PACgG6xkJUyVhboMS+bje/jA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/escape-string-regexp": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-4.0.0.tgz",
      "integrity": "sha512-TtpcNJ3XAzx3Gq8sWRzJaVajRs0uVxA2YAkdb1jm2YkPz4G6egUFAyA3n5vtEIZefPk5Wa4UXbKuS5fKkJWdgA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint": {
      "version": "9.39.5",
      "resolved": "https://registry.npmjs.org/eslint/-/eslint-9.39.5.tgz",
      "integrity": "sha512-DgZS62aPLXKlnxILS/AYCoRvHaZeXceIzlXPkkGGzJWSow1aEk0lbTlxUSlyjC8jcaKxAdOnTDz+o1JFSBsyjw==",
      "deprecated": "This version is no longer supported. Please see https://eslint.org/version-support for other options.",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@eslint-community/eslint-utils": "^4.8.0",
        "@eslint-community/regexpp": "^4.12.1",
        "@eslint/config-array": "^0.21.2",
        "@eslint/config-helpers": "^0.4.2",
        "@eslint/core": "^0.17.0",
        "@eslint/eslintrc": "^3.3.6",
        "@eslint/js": "9.39.5",
        "@eslint/plugin-kit": "^0.4.1",
        "@humanfs/node": "^0.16.6",
        "@humanwhocodes/module-importer": "^1.0.1",
        "@humanwhocodes/retry": "^0.4.2",
        "@types/estree": "^1.0.6",
        "ajv": "^6.14.0",
        "chalk": "^4.0.0",
        "cross-spawn": "^7.0.6",
        "debug": "^4.3.2",
        "escape-string-regexp": "^4.0.0",
        "eslint-scope": "^8.4.0",
        "eslint-visitor-keys": "^4.2.1",
        "espree": "^10.4.0",
        "esquery": "^1.5.0",
        "esutils": "^2.0.2",
        "fast-deep-equal": "^3.1.3",
        "file-entry-cache": "^8.0.0",
        "find-up": "^5.0.0",
        "glob-parent": "^6.0.2",
        "ignore": "^5.2.0",
        "imurmurhash": "^0.1.4",
        "is-glob": "^4.0.0",
        "json-stable-stringify-without-jsonify": "^1.0.1",
        "lodash.merge": "^4.6.2",
        "minimatch": "^3.1.5",
        "natural-compare": "^1.4.0",
        "optionator": "^0.9.3"
      },
      "bin": {
        "eslint": "bin/eslint.js"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://eslint.org/donate"
      },
      "peerDependencies": {
        "jiti": "*"
      },
      "peerDependenciesMeta": {
        "jiti": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/eslint-config-next/-/eslint-config-next-16.3.5.tgz",
      "integrity": "sha512-wPjq9MLQuWykHs8tsm2gH6OJThk6N27L8Te2JatlaGZ7jT1gtgGmJKukygL28xOlWsg5J1a1bGy/PvLyQC8OYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@next/eslint-plugin-next": "16.3.5",
        "eslint-import-resolver-node": "^0.3.6",
        "eslint-import-resolver-typescript": "^3.5.2",
        "eslint-plugin-import": "^2.32.0",
        "eslint-plugin-jsx-a11y": "^6.10.0",
        "eslint-plugin-react": "^7.37.0",
        "eslint-plugin-react-hooks": "^7.0.0",
        "globals": "16.4.0",
        "typescript-eslint": "^8.46.0"
      },
      "peerDependencies": {
        "eslint": ">=9.0.0",
        "typescript": ">=3.3.1"
      },
      "peerDependenciesMeta": {
        "typescript": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-config-next/node_modules/globals": {
      "version": "16.4.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-16.4.0.tgz",
      "integrity": "sha512-ob/2LcVVaVGCYN+r14cnwnoDPUufjiYgSqRhiFD0Q1iI4Odora5RE8Iv1D24hAz5oMophRGkGz+yuvQmmUMnMw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/eslint-import-resolver-node": {
      "version": "0.3.10",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-node/-/eslint-import-resolver-node-0.3.10.tgz",
      "integrity": "sha512-tRrKqFyCaKict5hOd244sL6EQFNycnMQnBe+j8uqGNXYzsImGbGUU4ibtoaBmv5FLwJwcFJNeg1GeVjQfbMrDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7",
        "is-core-module": "^2.16.1",
        "resolve": "^2.0.0-next.6"
      }
    },
    "node_modules/eslint-import-resolver-node/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-import-resolver-typescript": {
      "version": "3.10.1",
      "resolved": "https://registry.npmjs.org/eslint-import-resolver-typescript/-/eslint-import-resolver-typescript-3.10.1.tgz",
      "integrity": "sha512-A1rHYb06zjMGAxdLSkN2fXPBwuSaQ0iO5M/hdyS0Ajj1VBaRp0sPD3dn1FhME3c/JluGFbwSxyCfqdSbtQLAHQ==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "@nolyfill/is-core-module": "1.0.39",
        "debug": "^4.4.0",
        "get-tsconfig": "^4.10.0",
        "is-bun-module": "^2.0.0",
        "stable-hash": "^0.0.5",
        "tinyglobby": "^0.2.13",
        "unrs-resolver": "^1.6.2"
      },
      "engines": {
        "node": "^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint-import-resolver-typescript"
      },
      "peerDependencies": {
        "eslint": "*",
        "eslint-plugin-import": "*",
        "eslint-plugin-import-x": "*"
      },
      "peerDependenciesMeta": {
        "eslint-plugin-import": {
          "optional": true
        },
        "eslint-plugin-import-x": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils": {
      "version": "2.14.0",
      "resolved": "https://registry.npmjs.org/eslint-module-utils/-/eslint-module-utils-2.14.0.tgz",
      "integrity": "sha512-W2WCRZ9Dqntd+2u8jJcVMV2PKulc6RdLgUUoh/yQr3uB6lo/ZOeGx11sv60/8S4QFFKNslAlWhr9u0Ef7ZW6Ig==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "debug": "^3.2.7"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependenciesMeta": {
        "eslint": {
          "optional": true
        }
      }
    },
    "node_modules/eslint-module-utils/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-import": {
      "version": "2.32.0",
      "resolved": "https://registry.npmjs.org/eslint-plugin-import/-/eslint-plugin-import-2.32.0.tgz",
      "integrity": "sha512-whOE1HFo/qJDyX4SnXzP4N6zOWn79WhnCUY/iDR0mPfQZO8wcYE4JClzI2oZrhBnnMUCBCHZhO6VQyoBU95mZA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@rtsao/scc": "^1.1.0",
        "array-includes": "^3.1.9",
        "array.prototype.findlastindex": "^1.2.6",
        "array.prototype.flat": "^1.3.3",
        "array.prototype.flatmap": "^1.3.3",
        "debug": "^3.2.7",
        "doctrine": "^2.1.0",
        "eslint-import-resolver-node": "^0.3.9",
        "eslint-module-utils": "^2.12.1",
        "hasown": "^2.0.2",
        "is-core-module": "^2.16.1",
        "is-glob": "^4.0.3",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "object.groupby": "^1.0.3",
        "object.values": "^1.2.1",
        "semver": "^6.3.1",
        "string.prototype.trimend": "^1.0.9",
        "tsconfig-paths": "^3.15.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^2 || ^3 || ^4 || ^5 || ^6 || ^7.2.0 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-import/node_modules/debug": {
      "version": "3.2.7",
      "resolved": "https://registry.npmjs.org/debug/-/debug-3.2.7.tgz",
      "integrity": "sha512-CFjzYYAi4ThfiQvizrFQevTTXHtnCqWfe7x1AhgEscTz6ZbLbfoLRLPugTQyBth6f8ZERVUSyWHFD/7Wu4t1XQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.1"
      }
    },
    "node_modules/eslint-plugin-jsx-a11y": {
      "version": "6.10.2",
      "resolved": "https://registry.npmjs.org/eslint-plugin-jsx-a11y/-/eslint-plugin-jsx-a11y-6.10.2.tgz",
      "integrity": "sha512-scB3nz4WmG75pV8+3eRUQOHZlNSUhFNq37xnpgRkCCELU3XMvXAxLk1eqWWyE22Ki4Q01Fnsw9BA3cJHDPgn2Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "aria-query": "^5.3.2",
        "array-includes": "^3.1.8",
        "array.prototype.flatmap": "^1.3.2",
        "ast-types-flow": "^0.0.8",
        "axe-core": "^4.10.0",
        "axobject-query": "^4.1.0",
        "damerau-levenshtein": "^1.0.8",
        "emoji-regex": "^9.2.2",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^3.3.5",
        "language-tags": "^1.0.9",
        "minimatch": "^3.1.2",
        "object.fromentries": "^2.0.8",
        "safe-regex-test": "^1.0.3",
        "string.prototype.includes": "^2.0.1"
      },
      "engines": {
        "node": ">=4.0"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9"
      }
    },
    "node_modules/eslint-plugin-react": {
      "version": "7.37.5",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-7.37.5.tgz",
      "integrity": "sha512-Qteup0SqU15kdocexFNAJMvCJEfa2xUKNV4CC1xsVMrIIqEy3SQ/rqyxCWNzfrd3/ldy6HMlD2e0JDVpDg2qIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.8",
        "array.prototype.findlast": "^1.2.5",
        "array.prototype.flatmap": "^1.3.3",
        "array.prototype.tosorted": "^1.1.4",
        "doctrine": "^2.1.0",
        "es-iterator-helpers": "^1.2.1",
        "estraverse": "^5.3.0",
        "hasown": "^2.0.2",
        "jsx-ast-utils": "^2.4.1 || ^3.0.0",
        "minimatch": "^3.1.2",
        "object.entries": "^1.1.9",
        "object.fromentries": "^2.0.8",
        "object.values": "^1.2.1",
        "prop-types": "^15.8.1",
        "resolve": "^2.0.0-next.5",
        "semver": "^6.3.1",
        "string.prototype.matchall": "^4.0.12",
        "string.prototype.repeat": "^1.0.0"
      },
      "engines": {
        "node": ">=4"
      },
      "peerDependencies": {
        "eslint": "^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7"
      }
    },
    "node_modules/eslint-plugin-react-hooks": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/eslint-plugin-react-hooks/-/eslint-plugin-react-hooks-7.1.1.tgz",
      "integrity": "sha512-f2I7Gw6JbvCexzIInuSbZpfdQ44D7iqdWX01FKLvrPgqxoE7oMj8clOfto8U6vYiz4yd5oKu39rRSVOe1zRu0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@babel/core": "^7.24.4",
        "@babel/parser": "^7.24.4",
        "hermes-parser": "^0.25.1",
        "zod": "^3.25.0 || ^4.0.0",
        "zod-validation-error": "^3.5.0 || ^4.0.0"
      },
      "engines": {
        "node": ">=18"
      },
      "peerDependencies": {
        "eslint": "^3.0.0 || ^4.0.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0-0 || ^9.0.0 || ^10.0.0"
      }
    },
    "node_modules/eslint-scope": {
      "version": "8.4.0",
      "resolved": "https://registry.npmjs.org/eslint-scope/-/eslint-scope-8.4.0.tgz",
      "integrity": "sha512-sNXOfKCn74rt8RICKMvJS7XKV/Xk9kA7DyJr8mJik3S7Cwgy3qlkkmyS2uQB3jiJg6VNdZd/pDBJu0nvG2NlTg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "esrecurse": "^4.3.0",
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/eslint-visitor-keys": {
      "version": "4.2.1",
      "resolved": "https://registry.npmjs.org/eslint-visitor-keys/-/eslint-visitor-keys-4.2.1.tgz",
      "integrity": "sha512-Uhdk5sfqcee/9H/rCOJikYz67o0a2Tw2hGRPOG2Y1R2dg7brRe1uG0yaNQDHu+TO/uQPF/5eCapvYSmHUjt7JQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/espree": {
      "version": "10.4.0",
      "resolved": "https://registry.npmjs.org/espree/-/espree-10.4.0.tgz",
      "integrity": "sha512-j6PAQ2uUr79PZhBjP5C5fhl8e39FmRnOjsD5lGnWrFU8i2G776tBK7+nP8KuQUTTyAZUwfQqXAgrVH5MbH9CYQ==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "acorn": "^8.15.0",
        "acorn-jsx": "^5.3.2",
        "eslint-visitor-keys": "^4.2.1"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "url": "https://opencollective.com/eslint"
      }
    },
    "node_modules/esquery": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/esquery/-/esquery-1.7.0.tgz",
      "integrity": "sha512-Ap6G0WQwcU/LHsvLwON1fAQX9Zp0A2Y6Y/cJBl9r/JbW90Zyg4/zbG6zzKa2OTALELarYHmKu0GhpM5EO+7T0g==",
      "dev": true,
      "license": "BSD-3-Clause",
      "dependencies": {
        "estraverse": "^5.1.0"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/esrecurse": {
      "version": "4.3.0",
      "resolved": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.3.0.tgz",
      "integrity": "sha512-KmfKL3b6G+RXvP8N1vr3Tq1kL/oCFgn2NYXEtqP8/L3pKapUA4G8cFVaoF3SU323CD4XypR/ffioHmkti6/Tag==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "estraverse": "^5.2.0"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/estraverse": {
      "version": "5.3.0",
      "resolved": "https://registry.npmjs.org/estraverse/-/estraverse-5.3.0.tgz",
      "integrity": "sha512-MMdARuVEQziNTeJD8DgMqmhwR11BRQ/cBP+pLtYdSTnf3MIO8fFeiINEbX36ZdNlfU/7A9f3gUw49B3oQsvwBA==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/esutils": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/esutils/-/esutils-2.0.3.tgz",
      "integrity": "sha512-kVscqXk4OCp68SZ0dkgEKVi6/8ij300KBWTJq32P/dYeWTSwK41WyTxalN1eRmA5Z9UU/LX9D7FWSmV9SAYx6g==",
      "dev": true,
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/fast-deep-equal": {
      "version": "3.1.3",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.3.tgz",
      "integrity": "sha512-f3qQ9oQy9j2AhBe/H9VC91wLmKBCCU/gDOnKNAYG5hswO7BLKj09Hc5HYNz9cGI++xlpDCIgDaitVs03ATR84Q==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-glob": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/fast-glob/-/fast-glob-3.3.1.tgz",
      "integrity": "sha512-kNFPyjhh5cKjrUltxs+wFx+ZkbRaxxmZ+X0ZU31SOsxCEtP9VPgtq2teZw1DebupL5GmDaNQ6yKMMVcM41iqDg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@nodelib/fs.stat": "^2.0.2",
        "@nodelib/fs.walk": "^1.2.3",
        "glob-parent": "^5.1.2",
        "merge2": "^1.3.0",
        "micromatch": "^4.0.4"
      },
      "engines": {
        "node": ">=8.6.0"
      }
    },
    "node_modules/fast-glob/node_modules/glob-parent": {
      "version": "5.1.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-5.1.2.tgz",
      "integrity": "sha512-AOIgSQCepiJYwP3ARnGx+5VnTu2HBYdzbGP45eLw1vr3zB3vZLeyed1sC9hnbcOc9/SrMyM5RPQrkGz4aS9Zow==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.1"
      },
      "engines": {
        "node": ">= 6"
      }
    },
    "node_modules/fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fast-levenshtein": {
      "version": "2.0.6",
      "resolved": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
      "integrity": "sha512-DCXu6Ifhqcks7TZKY3Hxp3y6qphY5SJZmrWMDrKcERSOXWQdMhU9Ig/PYrzyw/ul9jOIyh0N4M0tbC5hodg8dw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/fastq": {
      "version": "1.20.3",
      "resolved": "https://registry.npmjs.org/fastq/-/fastq-1.20.3.tgz",
      "integrity": "sha512-XKv5nnLs6nLF71NgiKJLIZFLkPyIEuOselLG7ujZnGrRfQK8HpvY+WqKhAJUAdLomwVHErVS4LfxFlPq0/FTAw==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "reusify": "^1.0.4"
      }
    },
    "node_modules/file-entry-cache": {
      "version": "8.0.0",
      "resolved": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-8.0.0.tgz",
      "integrity": "sha512-XXTUwCvisa5oacNGRP9SfNtYBNAMi+RPwBFmblZEF7N7swHYQS6/Zfk7SRwx4D5j3CH211YNRco1DEMNVfZCnQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flat-cache": "^4.0.0"
      },
      "engines": {
        "node": ">=16.0.0"
      }
    },
    "node_modules/fill-range": {
      "version": "7.1.1",
      "resolved": "https://registry.npmjs.org/fill-range/-/fill-range-7.1.1.tgz",
      "integrity": "sha512-YsGpe3WHLK8ZYi4tWDg2Jy3ebRz2rXowDxnld4bkQB00cc/1Zw9AWnC0i9ztDJitivtQvaI9KaLyKrc+hBW0yg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "to-regex-range": "^5.0.1"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/find-up": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/find-up/-/find-up-5.0.0.tgz",
      "integrity": "sha512-78/PXT1wlLLDgTzDs7sjq9hzz0vXD+zn+7wypEe4fXQxCmdmqfGsEPQxmiCSQI3ajFV91bVSsvNtrJRiW6nGng==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "locate-path": "^6.0.0",
        "path-exists": "^4.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/flat-cache": {
      "version": "4.0.1",
      "resolved": "https://registry.npmjs.org/flat-cache/-/flat-cache-4.0.1.tgz",
      "integrity": "sha512-f7ccFPK3SXFHpx15UIGyRJ/FJQctuKZ0zVuN3frBo4HnK3cay9VEW0R6yPYFHC0AgqhukPzKjq22t5DmAyqGyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "flatted": "^3.2.9",
        "keyv": "^4.5.4"
      },
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/flatted": {
      "version": "3.4.4",
      "resolved": "https://registry.npmjs.org/flatted/-/flatted-3.4.4.tgz",
      "integrity": "sha512-5+ybhBZANEJxaH3X5evAFatUxLfEHSr7n6kYJ+1Qd0mUqr4eu9gIf6GDbWHf8RJijHrjjO8G+la14SlL2SeS1Q==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/for-each": {
      "version": "0.3.5",
      "resolved": "https://registry.npmjs.org/for-each/-/for-each-0.3.5.tgz",
      "integrity": "sha512-dKx12eRCVIzqCxFGplyFKJMPvLEWgmNtUrpTiJIR5u97zEhRG8ySrtboPHZXx7daLxQVrl643cTzbab2tkQjxg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-callable": "^1.2.7"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/function.prototype.name": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/function.prototype.name/-/function.prototype.name-1.2.0.tgz",
      "integrity": "sha512-jObKIik1P2QjPHP5nz5BaOtUlfgS0fWo8IUByNXkM+o+02sJOi94em77GwJKQSJ3gfPHdgzLNrHc1uokV4P/ew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2",
        "hasown": "^2.0.4",
        "is-callable": "^1.2.7",
        "is-document.all": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/functions-have-names": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/functions-have-names/-/functions-have-names-1.2.3.tgz",
      "integrity": "sha512-xckBUXyTIqT97tq2x2AMb+g163b5JFysYk0x4qxNFwbfQkmNZoiRHb6sPzI9/QV33WeuvVYBUIiD4NzNIyqaRQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/generator-function": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/generator-function/-/generator-function-2.0.1.tgz",
      "integrity": "sha512-SFdFmIJi+ybC0vjlHN0ZGVGHc3lgE0DxPAT0djjVg+kjOnSqclqmj0KQ7ykTOLP6YxoqOvuAODGdcHJn+43q3g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gensync": {
      "version": "1.0.0-beta.2",
      "resolved": "https://registry.npmjs.org/gensync/-/gensync-1.0.0-beta.2.tgz",
      "integrity": "sha512-3hN7NaskYvMDLQY55gnW3NQ+mesEAepTqlg+VEbj7zzqEMBVNhzcGYYeqFo/TlYz6eQiFcp1HcsCZO+nGgS8zg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.9.0"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/get-symbol-description": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/get-symbol-description/-/get-symbol-description-1.1.0.tgz",
      "integrity": "sha512-w9UMqWwJxHNOvoNzSJ2oPF5wvYcvP7jUvYzhp67yEhTi17ZDBBC1z9pTdGuzjD+EFIqLSYRweZjqfiPzQ06Ebg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-tsconfig": {
      "version": "4.14.3",
      "resolved": "https://registry.npmjs.org/get-tsconfig/-/get-tsconfig-4.14.3.tgz",
      "integrity": "sha512-++QEw4DIY7WGoukz+/+A/8dGYPT9l9yIadnmSgZ8Rjr3YVSVDipQSO9CdnJo9ePqFqUUqh+wk9uIaoiAwsiPkA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "resolve-pkg-maps": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/privatenumber/get-tsconfig?sponsor=1"
      }
    },
    "node_modules/glob-parent": {
      "version": "6.0.2",
      "resolved": "https://registry.npmjs.org/glob-parent/-/glob-parent-6.0.2.tgz",
      "integrity": "sha512-XxwI8EOhVQgWp6iDL+3b0r86f4d6AX6zSU55HfB4ydCEuXLXc5FcYeOu+nnGftS4TEju/11rt4KJPTMgbfmv4A==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "is-glob": "^4.0.3"
      },
      "engines": {
        "node": ">=10.13.0"
      }
    },
    "node_modules/globals": {
      "version": "14.0.0",
      "resolved": "https://registry.npmjs.org/globals/-/globals-14.0.0.tgz",
      "integrity": "sha512-oahGvuMGQlPw/ivIYBjVSrWAfWLBeku5tpPE2fOPLi+WHffIWbuh2tCjhyQhTBPMf5E9jDEH4FOmTYgYwbKwtQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/globalthis": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/globalthis/-/globalthis-1.0.4.tgz",
      "integrity": "sha512-DpLKbNU4WylpxJykQujfCcwYWiV/Jhm50Goo0wrVILAv5jOr9d+H+UR3PhSCD2rCCEIg0uc+G+muBTwD54JhDQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.2.1",
        "gopd": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/graceful-fs": {
      "version": "4.2.11",
      "resolved": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.2.11.tgz",
      "integrity": "sha512-RbJ5/jmFcNNCcDV5o9eTnBLJ/HszWV0P73bc+Ff4nS/rJj+YaS6IGyiOL0VoBYX+l1Wrl3k63h/KrH+nhJ0XvQ==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/has-bigints": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-bigints/-/has-bigints-1.1.0.tgz",
      "integrity": "sha512-R3pbpkcIqv2Pm3dUwgjclDRVmWpTJW2DcMzcIhEXEx1oh/CEMObMm3KLmRJOdvhM7o4uQBnwr8pzRK2sJWIqfg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-flag": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/has-flag/-/has-flag-4.0.0.tgz",
      "integrity": "sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/has-property-descriptors": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-property-descriptors/-/has-property-descriptors-1.0.2.tgz",
      "integrity": "sha512-55JNKuIW+vq4Ke1BjOTjM2YctQIvCT7GFzHwmfZPGo5wnrgkid0YQtnAleFSqumZm4az3n2BS+erby5ipJdgrg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-define-property": "^1.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-proto": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/has-proto/-/has-proto-1.2.0.tgz",
      "integrity": "sha512-KIL7eQPfHQRC8+XluaIw7BHUwwqL19bQn4hzNgdr+1wXoU0KKj6rufu47lhY7KbJR2C6T6+PfyN0Ea7wkSS+qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-tostringtag": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/has-tostringtag/-/has-tostringtag-1.0.2.tgz",
      "integrity": "sha512-NqADB8VjPFLM2V0VvHUewwwsw0ZWBaIdgo+ieHtK3hasLz4qeCRjYcqfB6AQrBggRKppKF8L52/VqdVsO47Dlw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-symbols": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.4.tgz",
      "integrity": "sha512-T2UbfbBEF32wiepXIsMlTW9+dDYC6wMh/t/vYA4tuOMKqWz/n3vr1NFSxQiyP+zk2mXsoMA/i/7qV6LKut1t1A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/hermes-estree": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-estree/-/hermes-estree-0.25.1.tgz",
      "integrity": "sha512-0wUoCcLp+5Ev5pDW2OriHC2MJCbwLwuRx+gAqMTOkGKJJiBCLjtrvy4PWUGn6MIVefecRpzoOZ/UV6iGdOr+Cw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/hermes-parser": {
      "version": "0.25.1",
      "resolved": "https://registry.npmjs.org/hermes-parser/-/hermes-parser-0.25.1.tgz",
      "integrity": "sha512-6pEjquH3rqaI6cYAXYPcz9MS4rY6R4ngRgrgfDshRptUZIc3lw0MCIJIGDj9++mfySOuPTHB4nrSW99BCvOPIA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hermes-estree": "0.25.1"
      }
    },
    "node_modules/ignore": {
      "version": "5.3.2",
      "resolved": "https://registry.npmjs.org/ignore/-/ignore-5.3.2.tgz",
      "integrity": "sha512-hsBTNUqQTDwkWtcdYI2i06Y/nUBEsNEDJKjWdigLvegy8kDuJAS8uRlpkkcQpyEXL0Z/pjDy5HBmMjRCJ2gq+g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 4"
      }
    },
    "node_modules/import-fresh": {
      "version": "3.3.1",
      "resolved": "https://registry.npmjs.org/import-fresh/-/import-fresh-3.3.1.tgz",
      "integrity": "sha512-TR3KfrTZTYLPB6jUjfx6MF9WcWrHL9su5TObK4ZkYgBdWKPOFoSoQIdEuTuR82pmtxH2spWG9h6etwfr1pLBqQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "parent-module": "^1.0.0",
        "resolve-from": "^4.0.0"
      },
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/imurmurhash": {
      "version": "0.1.4",
      "resolved": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
      "integrity": "sha512-JmXMZ6wuvDmLiHEml9ykzqO6lwFbof0GG4IkcGaENdCRDDmMVnny7s5HsIgHCbaq0w2MyPhDqkhTUgS2LU2PHA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.8.19"
      }
    },
    "node_modules/internal-slot": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/internal-slot/-/internal-slot-1.1.0.tgz",
      "integrity": "sha512-4gd7VpWNQNB4UKKCFFVcp1AVv+FMOgs9NKzjHKusc8jTMhd5eL1NqQqOpE0KzMds804/yHlglp3uxgluOqAPLw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "hasown": "^2.0.2",
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/is-array-buffer": {
      "version": "3.0.5",
      "resolved": "https://registry.npmjs.org/is-array-buffer/-/is-array-buffer-3.0.5.tgz",
      "integrity": "sha512-DDfANUiiG2wC1qawP66qlTugJeL5HyzMpfr8lLK+jMQirGzNod0B12cFB/9q838Ru27sBwfw78/rdoU7RERz6A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-async-function": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-async-function/-/is-async-function-2.1.1.tgz",
      "integrity": "sha512-9dgM/cZBnNvjzaMYHVoxxfPj2QXt22Ev7SuuPrs+xav0ukGB0S6d4ydZdEiM48kLx5kDV+QBPrpVnFyefL8kkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "async-function": "^1.0.0",
        "call-bound": "^1.0.3",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bigint": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-bigint/-/is-bigint-1.1.0.tgz",
      "integrity": "sha512-n4ZT37wG78iz03xPRKJrHTdZbe3IicyucEtdRsV5yglwc3GyUfbAfpSeD0FJ41NbUNSt5wbhqfp1fS+BgnvDFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-bigints": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-boolean-object": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/is-boolean-object/-/is-boolean-object-1.2.2.tgz",
      "integrity": "sha512-wa56o2/ElJMYqjCjGkXri7it5FbebW5usLw/nPmCMs5DeZ7eziSYZhSmPRn0txqeW4LnAmQQU7FgqLpsEFKM4A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-bun-module": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/is-bun-module/-/is-bun-module-2.0.0.tgz",
      "integrity": "sha512-gNCGbnnnnFAUGKeZ9PdbyeGYJqewpmc2aKHUEMO5nQPWU9lOmv7jcmQIv+qHD8fXW6W7qfuCwX4rY9LNRjXrkQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "semver": "^7.7.1"
      }
    },
    "node_modules/is-bun-module/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/is-callable": {
      "version": "1.2.7",
      "resolved": "https://registry.npmjs.org/is-callable/-/is-callable-1.2.7.tgz",
      "integrity": "sha512-1BC0BVFhS/p0qtw6enp8e+8OD0UrK0oFLztSjNzhcKA3WDuJxxAPXzPuPtKkjEY9UUoEWlX/8fgKeu2S8i9JTA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-core-module": {
      "version": "2.16.2",
      "resolved": "https://registry.npmjs.org/is-core-module/-/is-core-module-2.16.2.tgz",
      "integrity": "sha512-evOr8xfXKxE6qSR0hSXL2r3sd7ALj8+7jQEUvPYcm5sgZFdJ+AYzT6yNmJenvIYQBgIGwfwz08sL8zoL7yq2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "hasown": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-data-view": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/is-data-view/-/is-data-view-1.0.2.tgz",
      "integrity": "sha512-RKtWF8pGmS87i2D6gqQu/l7EYRlVdfzemCJN/P3UOs//x1QE7mfhvzHIApBTRf7axvT6DMGwSwBXYCT0nfB9xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "get-intrinsic": "^1.2.6",
        "is-typed-array": "^1.1.13"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-date-object": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/is-date-object/-/is-date-object-1.1.0.tgz",
      "integrity": "sha512-PwwhEakHVKTdRNVOw+/Gyh0+MzlCl4R6qKvkhuvLtPMggI1WAHt9sOwZxQLSGpUaDnrdyDsomoRgNnCfKNSXXg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-document.all": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-document.all/-/is-document.all-1.0.0.tgz",
      "integrity": "sha512-+XSoyS05OdBbhFuELhgTCpFNHkpBOJqtsZfUFFpe5QTw+9Sjbh8zitxhQkYAo6wV7e1Vb8cAPvpCk9jGam/82g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-extglob": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/is-extglob/-/is-extglob-2.1.1.tgz",
      "integrity": "sha512-SbKbANkN603Vi4jEZv49LeVJMn4yGwsbzZworEoyEiutsN3nJYdbO36zfhGJ6QEDpOZIFkDtnq5JRxmvl3jsoQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-finalizationregistry": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-finalizationregistry/-/is-finalizationregistry-1.1.1.tgz",
      "integrity": "sha512-1pC6N8qWJbWoPtEjgcL2xyhQOP491EQjeUo3qTKcmV8YSDDJrOepfG8pcC7h/QgnQHYSv0mJ3Z/ZWxmatVrysg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-generator-function": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/is-generator-function/-/is-generator-function-1.1.2.tgz",
      "integrity": "sha512-upqt1SkGkODW9tsGNG5mtXTXtECizwtS2kA161M+gJPc1xdb/Ax629af6YrTwcOeQHbewrPNlE5Dx7kzvXTizA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "generator-function": "^2.0.0",
        "get-proto": "^1.0.1",
        "has-tostringtag": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-glob": {
      "version": "4.0.3",
      "resolved": "https://registry.npmjs.org/is-glob/-/is-glob-4.0.3.tgz",
      "integrity": "sha512-xelSayHH36ZgE7ZWhli7pW34hNbNl8Ojv5KVmkJD4hBdD3th8Tfk9vYasLM+mXWOZhFkgZfxhLSnrwRr4elSSg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-extglob": "^2.1.1"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/is-map": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-map/-/is-map-2.0.3.tgz",
      "integrity": "sha512-1Qed0/Hr2m+YqxnM09CjA2d/i6YZNfF6R2oRAOj36eUdS6qIV/huPJNSEpKbupewFs+ZsJlxsjjPbc0/afW6Lw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-negative-zero": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-negative-zero/-/is-negative-zero-2.0.3.tgz",
      "integrity": "sha512-5KoIu2Ngpyek75jXodFvnafB6DJgr3u8uuK0LEZJjrU19DrMD3EVERaR8sjz8CCGgpZvxPl9SuE1GMVPFHx1mw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-number": {
      "version": "7.0.0",
      "resolved": "https://registry.npmjs.org/is-number/-/is-number-7.0.0.tgz",
      "integrity": "sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.12.0"
      }
    },
    "node_modules/is-number-object": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-number-object/-/is-number-object-1.1.1.tgz",
      "integrity": "sha512-lZhclumE1G6VYD8VHe35wFaIif+CTy5SJIi5+3y4psDgWu4wPDoBhF8NxUOinEc7pHgiTsT6MaBb92rKhhD+Xw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-regex": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/is-regex/-/is-regex-1.2.1.tgz",
      "integrity": "sha512-MjYsKHO5O7mCsmRGxWcLWheFqN9DJ/2TmngvjKXihe6efViPqc274+Fx/4fYj/r03+ESvBdTXK0V6tA3rgez1g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2",
        "hasown": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-set": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/is-set/-/is-set-2.0.3.tgz",
      "integrity": "sha512-iPAjerrse27/ygGLxw+EBR9agv9Y6uLeYVJMu+QNCoouJ1/1ri0mGrcWpfCqFZuzzx3WjtwxG098X+n4OuRkPg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-shared-array-buffer": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/is-shared-array-buffer/-/is-shared-array-buffer-1.0.4.tgz",
      "integrity": "sha512-ISWac8drv4ZGfwKl5slpHG9OwPNty4jOWPRIhBpxOoD+hqITiwuipOQ2bNthAzwA3B4fIjO4Nln74N0S9byq8A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-string": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-string/-/is-string-1.1.1.tgz",
      "integrity": "sha512-BtEeSsoaQjlSPBemMQIrY1MY0uM6vnS1g5fmufYOtnxLGUZM2178PKbhsk7Ffv58IX+ZtcvoGwccYsh0PglkAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-symbol": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-symbol/-/is-symbol-1.1.1.tgz",
      "integrity": "sha512-9gGx6GTtCQM73BgmHQXfDmLtfjjTUDSyoxTCbp5WtoixAhfgsDirWIcVQ/IHpvI5Vgd5i/J5F7B9cN/WlVbC/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "has-symbols": "^1.1.0",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-typed-array": {
      "version": "1.1.15",
      "resolved": "https://registry.npmjs.org/is-typed-array/-/is-typed-array-1.1.15.tgz",
      "integrity": "sha512-p3EcsicXjit7SaskXHs1hA91QxgTw46Fv6EFKKGS5DRFLD8yKnohjF3hxoju94b/OcMZoQukzpPpBE9uLVKzgQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakmap": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/is-weakmap/-/is-weakmap-2.0.2.tgz",
      "integrity": "sha512-K5pXYOm9wqY1RgjpL3YTkF39tni1XajUIkawTLUo9EZEVUFga5gSQJF8nNS7ZwJQ02y+1YCNYcMh+HIf1ZqE+w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakref": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/is-weakref/-/is-weakref-1.1.1.tgz",
      "integrity": "sha512-6i9mGWSlqzNMEqpCp93KwRS1uUOodk2OJ6b+sq7ZPDSy2WuI5NFIxp/254TytR8ftefexkWn5xNiHUNpPOfSew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/is-weakset": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/is-weakset/-/is-weakset-2.0.4.tgz",
      "integrity": "sha512-mfcwb6IzQyOKTs84CQMrOwW4gQcaTOAWJ0zzJCl2WSPDrWk/OzDaImWFH3djXhb24g4eudZfLRozAvPGw4d9hQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "get-intrinsic": "^1.2.6"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/isarray": {
      "version": "2.0.5",
      "resolved": "https://registry.npmjs.org/isarray/-/isarray-2.0.5.tgz",
      "integrity": "sha512-xHjhDr3cNBK0BzdUJSPXZntQUx/mwMS5Rw4A7lPJ90XGAO6ISP/ePDNuo0vhqOZU+UD5JoodwCAAoZQd3FeAKw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/isexe": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/isexe/-/isexe-2.0.0.tgz",
      "integrity": "sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/iterator.prototype": {
      "version": "1.1.5",
      "resolved": "https://registry.npmjs.org/iterator.prototype/-/iterator.prototype-1.1.5.tgz",
      "integrity": "sha512-H0dkQoCa3b2VEeKQBOxFph+JAbcrQdE7KC0UkqwpLmv2EC4P41QXP+rqo9wYodACiG5/WM5s9oDApTU8utwj9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.6",
        "get-proto": "^1.0.0",
        "has-symbols": "^1.1.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/jiti": {
      "version": "2.7.0",
      "resolved": "https://registry.npmjs.org/jiti/-/jiti-2.7.0.tgz",
      "integrity": "sha512-AC/7JofJvZGrrneWNaEnJeOLUx+JlGt7tNa0wZiRPT4MY1wmfKjt2+6O2p2uz2+skll8OZZmJMNqeke7kKbNgQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jiti": "lib/jiti-cli.mjs"
      }
    },
    "node_modules/js-tokens": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/js-tokens/-/js-tokens-4.0.0.tgz",
      "integrity": "sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/js-yaml": {
      "version": "4.3.2",
      "resolved": "https://registry.npmjs.org/js-yaml/-/js-yaml-4.3.2.tgz",
      "integrity": "sha512-SFNOvSJ+Dgf/9An904Yx+CgSlIPCkIpao4qo51lpee25TIRejdH3rhR4EZMGoNx3/TP3O+wzWuiTFl4sqbltzA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/puzrin"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/nodeca"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "argparse": "^2.0.1"
      },
      "bin": {
        "js-yaml": "bin/js-yaml.js"
      }
    },
    "node_modules/jsesc": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/jsesc/-/jsesc-3.1.0.tgz",
      "integrity": "sha512-/sM3dO2FOzXjKQhJuo0Q173wf2KOo8t4I8vHy6lF9poUp7bKT0/NHE8fPX23PwfhnykfqnC2xRxOnVw5XuGIaA==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "jsesc": "bin/jsesc"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/json-buffer": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/json-buffer/-/json-buffer-3.0.1.tgz",
      "integrity": "sha512-4bV5BfR2mqfQTJm+V5tPPdf+ZpuhiIvTuAB5g8kcrXOZpTT/QwwVRWBywX1ozr6lEuPdbHxwaJlm9G6mI2sfSQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json-stable-stringify-without-jsonify": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/json-stable-stringify-without-jsonify/-/json-stable-stringify-without-jsonify-1.0.1.tgz",
      "integrity": "sha512-Bdboy+l7tA3OGW6FjyFHWkP5LuByj1Tk33Ljyq0axyzdk9//JSi2u3fP1QSmd1KNwq6VOKYGlAu87CisVir6Pw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/json5": {
      "version": "2.2.3",
      "resolved": "https://registry.npmjs.org/json5/-/json5-2.2.3.tgz",
      "integrity": "sha512-XmOWe7eyHYH14cLdVPoyg+GOH3rYX++KpzrylJwSW98t3Nk+U8XOl8FWKOgwtzdb8lXGf6zYwDUzeHMWfxasyg==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "json5": "lib/cli.js"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/jsx-ast-utils": {
      "version": "3.3.5",
      "resolved": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-3.3.5.tgz",
      "integrity": "sha512-ZZow9HBI5O6EPgSJLUb8n2NKgmVWTwCvHGwFuJlMjvLFqlGG6pjirPhtdsseaLZjSibD8eegzmYpUZwoIlj2cQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array-includes": "^3.1.6",
        "array.prototype.flat": "^1.3.1",
        "object.assign": "^4.1.4",
        "object.values": "^1.1.6"
      },
      "engines": {
        "node": ">=4.0"
      }
    },
    "node_modules/keyv": {
      "version": "4.5.4",
      "resolved": "https://registry.npmjs.org/keyv/-/keyv-4.5.4.tgz",
      "integrity": "sha512-oxVHkHR/EJf2CNXnWxRLW6mg7JyCCUcG0DtEGmL2ctUo1PNTin1PUil+r/+4r5MpVgC/fn1kjsx7mjSujKqIpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "json-buffer": "3.0.1"
      }
    },
    "node_modules/language-subtag-registry": {
      "version": "0.3.23",
      "resolved": "https://registry.npmjs.org/language-subtag-registry/-/language-subtag-registry-0.3.23.tgz",
      "integrity": "sha512-0K65Lea881pHotoGEa5gDlMxt3pctLi2RplBb7Ezh4rRdLEOtgi7n4EwK9lamnUCkKBqaeKRVebTq6BAxSkpXQ==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/language-tags": {
      "version": "1.0.9",
      "resolved": "https://registry.npmjs.org/language-tags/-/language-tags-1.0.9.tgz",
      "integrity": "sha512-MbjN408fEndfiQXbFQ1vnd+1NoLDsnQW41410oQBXiyXDMYH5z505juWa4KUE1LqxRC7DgOgZDbKLxHIwm27hA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "language-subtag-registry": "^0.3.20"
      },
      "engines": {
        "node": ">=0.10"
      }
    },
    "node_modules/levn": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/levn/-/levn-0.4.1.tgz",
      "integrity": "sha512-+bT2uH4E5LGE7h/n3evcS/sQlJXCpIp6ym8OWJ5eV6+67Dsql/LaaT7qJBAt2rzfoa/5QBGBhxDix1dMt2kQKQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1",
        "type-check": "~0.4.0"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/lightningcss": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss/-/lightningcss-1.32.0.tgz",
      "integrity": "sha512-NXYBzinNrblfraPGyrbPoD19C1h9lfI/1mzgWYvXUTe414Gz/X1FD2XBZSZM7rRTrMA8JL3OtAaGifrIKhQ5yQ==",
      "dev": true,
      "license": "MPL-2.0",
      "dependencies": {
        "detect-libc": "^2.0.3"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      },
      "optionalDependencies": {
        "lightningcss-android-arm64": "1.32.0",
        "lightningcss-darwin-arm64": "1.32.0",
        "lightningcss-darwin-x64": "1.32.0",
        "lightningcss-freebsd-x64": "1.32.0",
        "lightningcss-linux-arm-gnueabihf": "1.32.0",
        "lightningcss-linux-arm64-gnu": "1.32.0",
        "lightningcss-linux-arm64-musl": "1.32.0",
        "lightningcss-linux-x64-gnu": "1.32.0",
        "lightningcss-linux-x64-musl": "1.32.0",
        "lightningcss-win32-arm64-msvc": "1.32.0",
        "lightningcss-win32-x64-msvc": "1.32.0"
      }
    },
    "node_modules/lightningcss-android-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-android-arm64/-/lightningcss-android-arm64-1.32.0.tgz",
      "integrity": "sha512-YK7/ClTt4kAK0vo6w3X+Pnm0D2cf2vPHbhOXdoNti1Ga0al1P4TBZhwjATvjNwLEBCnKvjJc2jQgHXH0NEwlAg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-arm64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-arm64/-/lightningcss-darwin-arm64-1.32.0.tgz",
      "integrity": "sha512-RzeG9Ju5bag2Bv1/lwlVJvBE3q6TtXskdZLLCyfg5pt+HLz9BqlICO7LZM7VHNTTn/5PRhHFBSjk5lc4cmscPQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-darwin-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-darwin-x64/-/lightningcss-darwin-x64-1.32.0.tgz",
      "integrity": "sha512-U+QsBp2m/s2wqpUYT/6wnlagdZbtZdndSmut/NJqlCcMLTWp5muCrID+K5UJ6jqD2BFshejCYXniPDbNh73V8w==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-freebsd-x64": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-freebsd-x64/-/lightningcss-freebsd-x64-1.32.0.tgz",
      "integrity": "sha512-JCTigedEksZk3tHTTthnMdVfGf61Fky8Ji2E4YjUTEQX14xiy/lTzXnu1vwiZe3bYe0q+SpsSH/CTeDXK6WHig==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm-gnueabihf": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm-gnueabihf/-/lightningcss-linux-arm-gnueabihf-1.32.0.tgz",
      "integrity": "sha512-x6rnnpRa2GL0zQOkt6rts3YDPzduLpWvwAF6EMhXFVZXD4tPrBkEFqzGowzCsIWsPjqSK+tyNEODUBXeeVHSkw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-gnu/-/lightningcss-linux-arm64-gnu-1.32.0.tgz",
      "integrity": "sha512-0nnMyoyOLRJXfbMOilaSRcLH3Jw5z9HDNGfT/gwCPgaDjnx0i8w7vBzFLFR1f6CMLKF8gVbebmkUN3fa/kQJpQ==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-arm64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-arm64-musl/-/lightningcss-linux-arm64-musl-1.32.0.tgz",
      "integrity": "sha512-UpQkoenr4UJEzgVIYpI80lDFvRmPVg6oqboNHfoH4CQIfNA+HOrZ7Mo7KZP02dC6LjghPQJeBsvXhJod/wnIBg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-gnu": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-gnu/-/lightningcss-linux-x64-gnu-1.32.0.tgz",
      "integrity": "sha512-V7Qr52IhZmdKPVr+Vtw8o+WLsQJYCTd8loIfpDaMRWGUZfBOYEJeyJIkqGIDMZPwPx24pUMfwSxxI8phr/MbOA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "glibc"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-linux-x64-musl": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-linux-x64-musl/-/lightningcss-linux-x64-musl-1.32.0.tgz",
      "integrity": "sha512-bYcLp+Vb0awsiXg/80uCRezCYHNg1/l3mt0gzHnWV9XP1W5sKa5/TCdGWaR/zBM2PeF/HbsQv/j2URNOiVuxWg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "libc": [
        "musl"
      ],
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-arm64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-arm64-msvc/-/lightningcss-win32-arm64-msvc-1.32.0.tgz",
      "integrity": "sha512-8SbC8BR40pS6baCM8sbtYDSwEVQd4JlFTOlaD3gWGHfThTcABnNDBda6eTZeqbofalIJhFx0qKzgHJmcPTnGdw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/lightningcss-win32-x64-msvc": {
      "version": "1.32.0",
      "resolved": "https://registry.npmjs.org/lightningcss-win32-x64-msvc/-/lightningcss-win32-x64-msvc-1.32.0.tgz",
      "integrity": "sha512-Amq9B/SoZYdDi1kFrojnoqPLxYhQ4Wo5XiL8EVJrVsB8ARoC1PWW6VGtT0WKCemjy8aC+louJnjS7U18x3b06Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MPL-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">= 12.0.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/parcel"
      }
    },
    "node_modules/locate-path": {
      "version": "6.0.0",
      "resolved": "https://registry.npmjs.org/locate-path/-/locate-path-6.0.0.tgz",
      "integrity": "sha512-iPZK6eYjbxRu3uB4/WZ3EsEIMJFMqAoopl3R+zuq0UjcAm/MO6KCweDgPfP3elTztoKP3KtnVHxTn2NHBSDVUw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-locate": "^5.0.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/lodash.merge": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/lodash.merge/-/lodash.merge-4.6.2.tgz",
      "integrity": "sha512-0KpjqXRVvrYyCsX1swR/XTK0va6VQkQM6MNo7PqW77ByjAhoARA8EfrP1N4+KlKj8YS0ZUCtRT/YUuhyYDujIQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/loose-envify": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/loose-envify/-/loose-envify-1.4.0.tgz",
      "integrity": "sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "js-tokens": "^3.0.0 || ^4.0.0"
      },
      "bin": {
        "loose-envify": "cli.js"
      }
    },
    "node_modules/lru-cache": {
      "version": "5.1.1",
      "resolved": "https://registry.npmjs.org/lru-cache/-/lru-cache-5.1.1.tgz",
      "integrity": "sha512-KpNARQA3Iwv+jTA0utUVVbrh+Jlrr1Fv0e56GGzAFOXN7dk/FviaDW8LHmK52DlcH4WP2n6gI8vN1aesBFgo9w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "yallist": "^3.0.2"
      }
    },
    "node_modules/magic-string": {
      "version": "0.30.21",
      "resolved": "https://registry.npmjs.org/magic-string/-/magic-string-0.30.21.tgz",
      "integrity": "sha512-vd2F4YUyEXKGcLHoq+TEyCjxueSeHnFxyyjNp80yg0XV4vUhnDer/lvvlqM/arB5bXQN5K2/3oinyCRyx8T2CQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/sourcemap-codec": "^1.5.5"
      }
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/merge2": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/merge2/-/merge2-1.4.1.tgz",
      "integrity": "sha512-8q7VEgMJW4J8tcfVPy8g09NcQwZdbwFEqhe/WZkoIzjn/3TGDwtOCYtXGxA3O8tPzpczCCDgv+P2P5y00ZJOOg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/micromatch": {
      "version": "4.0.8",
      "resolved": "https://registry.npmjs.org/micromatch/-/micromatch-4.0.8.tgz",
      "integrity": "sha512-PXwfBhYu0hBCPw8Dn0E+WDYb7af3dSLVWKi3HGv84IdF4TyFoC0ysxFd0Goxw7nSv4T/PzEJQxsYsEiFCKo2BA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "braces": "^3.0.3",
        "picomatch": "^2.3.1"
      },
      "engines": {
        "node": ">=8.6"
      }
    },
    "node_modules/minimatch": {
      "version": "3.1.5",
      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "brace-expansion": "^1.1.7"
      },
      "engines": {
        "node": "*"
      }
    },
    "node_modules/minimist": {
      "version": "1.2.8",
      "resolved": "https://registry.npmjs.org/minimist/-/minimist-1.2.8.tgz",
      "integrity": "sha512-2yyAR8qBkN3YuheJanUpWC5U3bb5osDywNB8RzDVlDwDHbocAJveqqj1u8+SVD7jkWT4yvsHCpWqqWqAxb0zCA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/nanoid": {
      "version": "3.3.19",
      "resolved": "https://registry.npmjs.org/nanoid/-/nanoid-3.3.19.tgz",
      "integrity": "sha512-Y2tUNy4ouw6tq5oDSKeQYGOyhkUBhNOcGV/02KC+6kd9eDGqdZd++mjMiIDilrBYvjEnCYvVtsuHCuP+okSfug==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "bin": {
        "nanoid": "bin/nanoid.cjs"
      },
      "engines": {
        "node": "^10 || ^12 || ^13.7 || ^14 || >=15.0.1"
      }
    },
    "node_modules/napi-postinstall": {
      "version": "0.3.4",
      "resolved": "https://registry.npmjs.org/napi-postinstall/-/napi-postinstall-0.3.4.tgz",
      "integrity": "sha512-PHI5f1O0EP5xJ9gQmFGMS6IZcrVvTjpXjz7Na41gTE7eE2hK11lg04CECCYEEjdc17EV4DO+fkGEtt7TpTaTiQ==",
      "dev": true,
      "license": "MIT",
      "bin": {
        "napi-postinstall": "lib/cli.js"
      },
      "engines": {
        "node": "^12.20.0 || ^14.18.0 || >=16.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/napi-postinstall"
      }
    },
    "node_modules/natural-compare": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
      "integrity": "sha512-OWND8ei3VtNC9h7V60qff3SVobHr996CTwgxubgyQYEpg290h9J0buyECNNJexkFm5sOajh5G116RYA1c8ZMSw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/next": {
      "version": "16.3.5",
      "resolved": "https://registry.npmjs.org/next/-/next-16.3.5.tgz",
      "integrity": "sha512-MdtsTgzyfCPRLC6uJ1mN8ao7lyJ4BB0U6Inhnx3gta1UcCIdHK3yxLG0E8OWQteWD8/Q0qb8A5o7wJaL8M9y2w==",
      "license": "MIT",
      "dependencies": {
        "@next/env": "16.3.5",
        "@swc/helpers": "0.5.23",
        "baseline-browser-mapping": "^2.9.19",
        "caniuse-lite": "^1.0.30001579",
        "postcss": "8.5.23",
        "styled-jsx": "5.1.6"
      },
      "bin": {
        "next": "dist/bin/next"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "optionalDependencies": {
        "@next/swc-darwin-arm64": "16.3.5",
        "@next/swc-darwin-x64": "16.3.5",
        "@next/swc-linux-arm64-gnu": "16.3.5",
        "@next/swc-linux-arm64-musl": "16.3.5",
        "@next/swc-linux-x64-gnu": "16.3.5",
        "@next/swc-linux-x64-musl": "16.3.5",
        "@next/swc-win32-arm64-msvc": "16.3.5",
        "@next/swc-win32-x64-msvc": "16.3.5",
        "sharp": "^0.35.4"
      },
      "peerDependencies": {
        "@opentelemetry/api": "^1.1.0",
        "@playwright/test": "^1.51.1",
        "babel-plugin-react-compiler": "*",
        "react": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "react-dom": "^18.2.0 || 19.0.0-rc-de68d2f4-20241204 || ^19.0.0",
        "sass": "^1.3.0"
      },
      "peerDependenciesMeta": {
        "@opentelemetry/api": {
          "optional": true
        },
        "@playwright/test": {
          "optional": true
        },
        "babel-plugin-react-compiler": {
          "optional": true
        },
        "sass": {
          "optional": true
        }
      }
    },
    "node_modules/next/node_modules/postcss": {
      "version": "8.5.23",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.23.tgz",
      "integrity": "sha512-g50586zr4bZmwFiTlflMu8E0bDTb5I5gertgwAKmsdUlTQIhZtunzUlD1WSzwcVWPoAVpsrA6vlfCD7oXvRwgg==",
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.16",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/node-exports-info": {
      "version": "1.6.2",
      "resolved": "https://registry.npmjs.org/node-exports-info/-/node-exports-info-1.6.2.tgz",
      "integrity": "sha512-kXs9Go0cah0qHVV2v389IXQLdLCeE1xfFtjOAF+iobu0OIoG1pje8At2vMHyaPMiPMnG/LWP50twML21eMcAag==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "array.prototype.flatmap": "^1.3.3",
        "es-errors": "^1.3.0",
        "object.entries": "^1.1.9",
        "semver": "^6.3.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/node-releases": {
      "version": "2.0.55",
      "resolved": "https://registry.npmjs.org/node-releases/-/node-releases-2.0.55.tgz",
      "integrity": "sha512-mIrE/Cw9y+9Au6dS5vDKDhQza9YvG6w+ZrS6X+ZzA7yFW/soAeaups4Qzn1bL6g5FVy8WtP79+0j82oPIbqRjQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object-keys": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/object-keys/-/object-keys-1.1.1.tgz",
      "integrity": "sha512-NuAESUOUMrlIXOfHKzD6bpPu3tYt3xvjNdRIQ+FeT0lNb4K8WR70CaDxhuNguS2XG+GjkyMwOzsN5ZktImfhLA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.assign": {
      "version": "4.1.7",
      "resolved": "https://registry.npmjs.org/object.assign/-/object.assign-4.1.7.tgz",
      "integrity": "sha512-nK28WOo+QIjBkDduTINE4JkF/UJJKyf2EJxvJKfblDpyg0Q+pkOHNTL0Qwy6NP6FhE/EnzV73BxxqcJaXY9anw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0",
        "has-symbols": "^1.1.0",
        "object-keys": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.entries": {
      "version": "1.1.9",
      "resolved": "https://registry.npmjs.org/object.entries/-/object.entries-1.1.9.tgz",
      "integrity": "sha512-8u/hfXFRBD1O0hPUjioLhoWFHRmt6tKA4/vZPyckBr18l1KE9uHrFaFaUi8MDRTpi4uak2goyPTSNJLXX2k2Hw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.fromentries": {
      "version": "2.0.8",
      "resolved": "https://registry.npmjs.org/object.fromentries/-/object.fromentries-2.0.8.tgz",
      "integrity": "sha512-k6E21FzySsSK5a21KRADBd/NGneRegFO5pLHfdQLpRDETUNJueLXs3WCzyQ3tFRDYgbq3KHGXfTbi2bs8WQ6rQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/object.groupby": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/object.groupby/-/object.groupby-1.0.3.tgz",
      "integrity": "sha512-+Lhy3TQTuzXI5hevh8sBGqbmurHbbIjAi0Z4S63nthVLmLxfbj4T54a4CfZrXIrt9iP4mVAPYMo/v99taj3wjQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/object.values": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/object.values/-/object.values-1.2.1.tgz",
      "integrity": "sha512-gXah6aZrcUxjWg2zR2MwouP2eHlCBzdV4pygudehaKXSGW4v2AsRQUK+lwwXhii6KFZcunEnmSUoYp5CXibxtA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "call-bound": "^1.0.3",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/optionator": {
      "version": "0.9.4",
      "resolved": "https://registry.npmjs.org/optionator/-/optionator-0.9.4.tgz",
      "integrity": "sha512-6IpQ7mKUxRcZNLIObR0hz7lxsapSSIYNZJwXPGeF0mTVqGKFIXj1DQcMoT22S3ROcLyY/rz0PWaWZ9ayWmad9g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "deep-is": "^0.1.3",
        "fast-levenshtein": "^2.0.6",
        "levn": "^0.4.1",
        "prelude-ls": "^1.2.1",
        "type-check": "^0.4.0",
        "word-wrap": "^1.2.5"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/own-keys": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/own-keys/-/own-keys-1.0.2.tgz",
      "integrity": "sha512-19YVAg7T+WTrxggPukVq7DjTv6+PJ867TmhCvBsYwmbFCsZd344rq2Ld1p0wo8f8Qrrhgp82c6FJRqdXWtSEhg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "object-keys": "^1.1.1",
        "safe-push-apply": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/p-limit": {
      "version": "3.1.0",
      "resolved": "https://registry.npmjs.org/p-limit/-/p-limit-3.1.0.tgz",
      "integrity": "sha512-TYOanM3wGwNGsZN2cVTYPArw454xnXj5qmWF1bEoAc4+cU/ol7GVh7odevjp1FNHduHc3KZMcFduxU5Xc6uJRQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "yocto-queue": "^0.1.0"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/p-locate": {
      "version": "5.0.0",
      "resolved": "https://registry.npmjs.org/p-locate/-/p-locate-5.0.0.tgz",
      "integrity": "sha512-LaNjtRWUBY++zB5nE/NwcaoMylSPk+S+ZHNB1TzdbMJMny6dynpAGt7X/tl/QYq3TIeE6nxHppbo2LGymrG5Pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "p-limit": "^3.0.2"
      },
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/parent-module": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/parent-module/-/parent-module-1.0.1.tgz",
      "integrity": "sha512-GQ2EWRpQV8/o+Aw8YqtfZZPfNRWZYkbidE9k5rpl/hC3vtHHBfGm2Ifi6qWV+coDGkrUKZAxE3Lot5kcsRlh+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "callsites": "^3.0.0"
      },
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/path-exists": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/path-exists/-/path-exists-4.0.0.tgz",
      "integrity": "sha512-ak9Qy5Q7jYb2Wwcey5Fpvg2KoAc/ZIhLSLOSBmRmygPsGwkVVt0fZa0qrtMz+m6tJTAHfZQ8FnmB4MG4LWy7/w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-key": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/path-key/-/path-key-3.1.1.tgz",
      "integrity": "sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/path-parse": {
      "version": "1.0.7",
      "resolved": "https://registry.npmjs.org/path-parse/-/path-parse-1.0.7.tgz",
      "integrity": "sha512-LDJzPVEEEPR+y48z93A0Ed0yXb8pAByGWo/k5YYdYgpY2/2EsOsksJrq7lOHxryrVOn1ejG6oAp8ahvOIQD8sw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/picocolors": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/picocolors/-/picocolors-1.1.1.tgz",
      "integrity": "sha512-xceH2snhtb5M9liqDsmEw56le376mTZkEX/jEb/RxNFyegNul7eNslCXP9FDj/Lcu0X8KEyMceP2ntpaHrDEVA==",
      "license": "ISC"
    },
    "node_modules/picomatch": {
      "version": "2.3.2",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz",
      "integrity": "sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/possible-typed-array-names": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/possible-typed-array-names/-/possible-typed-array-names-1.1.0.tgz",
      "integrity": "sha512-/+5VFTchJDoVj3bhoqi6UeymcD00DAwb1nJwamzPvHEszJ4FpF6SNNbUbOS8yI56qHzdV8eK0qEfOSiodkTdxg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/postcss": {
      "version": "8.5.28",
      "resolved": "https://registry.npmjs.org/postcss/-/postcss-8.5.28.tgz",
      "integrity": "sha512-RRuzqDtt5Y9h3quz5hWhK+TPnsmVs6WwSU6LkJMeY4HstUEDuYTG8UJSdawMRzmzAtV+KEoG8N3Qg2qLy5vM/A==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/postcss/"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/postcss"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "nanoid": "^3.3.18",
        "picocolors": "^1.1.1",
        "source-map-js": "^1.2.1"
      },
      "engines": {
        "node": "^10 || ^12 || >=14"
      }
    },
    "node_modules/prelude-ls": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.2.1.tgz",
      "integrity": "sha512-vkcDPrRZo1QZLbn5RLGPpg/WmIQ65qoWWhcGKf/b5eplkkarX0m9z8ppCat4mlOqUsWpyNuYgO3VRyrYHSzX5g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/prop-types": {
      "version": "15.8.1",
      "resolved": "https://registry.npmjs.org/prop-types/-/prop-types-15.8.1.tgz",
      "integrity": "sha512-oj87CgZICdulUohogVAR7AjlC0327U4el4L6eAvOqCeudMDVU0NThNaV+b9Df4dXgSP1gXMTnPdhfe/2qDH5cg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "loose-envify": "^1.4.0",
        "object-assign": "^4.1.1",
        "react-is": "^16.13.1"
      }
    },
    "node_modules/punycode": {
      "version": "2.3.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.3.1.tgz",
      "integrity": "sha512-vYt7UD1U9Wg6138shLtLOvdAu+8DsC/ilFtEVHcH+wydcSpNE20AfSOduf6MkRFahL5FY7X1oU7nKVZFtfq8Fg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/queue-microtask": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/queue-microtask/-/queue-microtask-1.2.3.tgz",
      "integrity": "sha512-NuaNSa6flKT5JaSYQzJok04JzTL1CA6aGhv5rfLW3PgqA+M2ChpZQnAC8h8i4ZFkBS8X5RqkDBHA7r4hej3K9A==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/react": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react/-/react-19.2.8.tgz",
      "integrity": "sha512-PWaYA1L/q9u2u7xYQi+Y3L3Yfnie7XyLeaJICV1MGD6LprsBxcAqGjYyr0eY3p+QdsA+x/Irkt4Qif8D63+Sbw==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/react-dom": {
      "version": "19.2.8",
      "resolved": "https://registry.npmjs.org/react-dom/-/react-dom-19.2.8.tgz",
      "integrity": "sha512-rVprimfGBG3DR+Tq0IQG2DT5PxKth1WIGDmj5yPmlzr4YBe7uyE+Du4oVqTDXZSHGGGXRtTJEGSSePyQCMBglQ==",
      "license": "MIT",
      "dependencies": {
        "scheduler": "^0.27.0"
      },
      "peerDependencies": {
        "react": "^19.2.8"
      }
    },
    "node_modules/react-is": {
      "version": "16.13.1",
      "resolved": "https://registry.npmjs.org/react-is/-/react-is-16.13.1.tgz",
      "integrity": "sha512-24e6ynE2H+OKt4kqsOvNd8kBpV65zoxbA4BVsEOB3ARVWQki/DHzaUoC5KuON/BiccDaCCTZBuOcfZs70kR8bQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/reflect.getprototypeof": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/reflect.getprototypeof/-/reflect.getprototypeof-1.0.10.tgz",
      "integrity": "sha512-00o4I+DVrefhv+nX0ulyi3biSHCPDe+yLv5o/p6d/UVlirijB8E16FtfwSAi4g3tcqrQ4lRAqQSoFEZJehYEcw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.9",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0",
        "get-intrinsic": "^1.2.7",
        "get-proto": "^1.0.1",
        "which-builtin-type": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/regexp.prototype.flags": {
      "version": "1.5.4",
      "resolved": "https://registry.npmjs.org/regexp.prototype.flags/-/regexp.prototype.flags-1.5.4.tgz",
      "integrity": "sha512-dYqgNSZbDwkaJ2ceRd9ojCGjBq+mOm9LmtXnAnEGyHhN/5R7iDW2TRw3h+o/jCFxus3P2LfWIIiwowAjANm7IA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "define-properties": "^1.2.1",
        "es-errors": "^1.3.0",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "set-function-name": "^2.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve": {
      "version": "2.0.0-next.7",
      "resolved": "https://registry.npmjs.org/resolve/-/resolve-2.0.0-next.7.tgz",
      "integrity": "sha512-tqt+NBWwyaMgw3zDsnygx4CByWjQEJHOPMdslYhppaQSJUtL/D4JO9CcBBlhPoI8lz9oJIDXkwXfhF4aWqP8xQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "is-core-module": "^2.16.2",
        "node-exports-info": "^1.6.0",
        "object-keys": "^1.1.1",
        "path-parse": "^1.0.7",
        "supports-preserve-symlinks-flag": "^1.0.0"
      },
      "bin": {
        "resolve": "bin/resolve"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/resolve-from": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/resolve-from/-/resolve-from-4.0.0.tgz",
      "integrity": "sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/resolve-pkg-maps": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/resolve-pkg-maps/-/resolve-pkg-maps-1.0.0.tgz",
      "integrity": "sha512-seS2Tj26TBVOC2NIc2rOe2y2ZO7efxITtLZcGSOnHHNOQ7CkiUBfw0Iw2ck6xkIhPwLhKNLS8BO+hEpngQlqzw==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/privatenumber/resolve-pkg-maps?sponsor=1"
      }
    },
    "node_modules/reusify": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/reusify/-/reusify-1.1.0.tgz",
      "integrity": "sha512-g6QUff04oZpHs0eG5p83rFLhHeV00ug/Yf9nZM6fLeUrPguBTkTQOdpAWWspMh55TZfVQDPaN3NQJfbVRAxdIw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "iojs": ">=1.0.0",
        "node": ">=0.10.0"
      }
    },
    "node_modules/run-parallel": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.2.0.tgz",
      "integrity": "sha512-5l4VyZR86LZ/lDxZTR6jqL8AFE2S0IFLMP26AbjsLVADxHdhB/c0GUsH+y39UfCi3dzz8OlQuPmnaJOMoDHQBA==",
      "dev": true,
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "queue-microtask": "^1.2.2"
      }
    },
    "node_modules/safe-array-concat": {
      "version": "1.1.4",
      "resolved": "https://registry.npmjs.org/safe-array-concat/-/safe-array-concat-1.1.4.tgz",
      "integrity": "sha512-wtZlHyOje6OZTGqAoaDKxFkgRtkF9CnHAVnCHKfuj200wAgL+bSJhdsCD2l0Qx/2ekEXjPWcyKkfGb5CPboslg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "get-intrinsic": "^1.3.0",
        "has-symbols": "^1.1.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">=0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-push-apply": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/safe-push-apply/-/safe-push-apply-1.0.0.tgz",
      "integrity": "sha512-iKE9w/Z7xCzUMIZqdBsp6pEQvwuEebH4vdpjcDWnyzaI6yl6O9FHvVpmGelvEHNsoY6wGblkxR6Zty/h00WiSA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "isarray": "^2.0.5"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/safe-regex-test": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/safe-regex-test/-/safe-regex-test-1.1.0.tgz",
      "integrity": "sha512-x/+Cz4YrimQxQccJf5mKEbIa1NzeCRNI5Ecl/ekmlYaampdNLPalVyIcCZNNH3MvmqBugV5TMYZXv0ljslUlaw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "is-regex": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/scheduler": {
      "version": "0.27.0",
      "resolved": "https://registry.npmjs.org/scheduler/-/scheduler-0.27.0.tgz",
      "integrity": "sha512-eNv+WrVbKu1f3vbYJT/xtiF5syA5HPIMtf9IgY/nKg0sWqzAUEvqY/xm7OcZc/qafLx/iO9FgOmeSAp4v5ti/Q==",
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "6.3.1",
      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      }
    },
    "node_modules/set-function-length": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/set-function-length/-/set-function-length-1.2.2.tgz",
      "integrity": "sha512-pgRc4hJ4/sNjWCSS9AmnS40x3bNMDTknHgL5UaMBTMyJnU90EgWh1Rz+MC9eFu4BuN/UwZjKQuY/1v3rM7HMfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2",
        "get-intrinsic": "^1.2.4",
        "gopd": "^1.0.1",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-function-name": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/set-function-name/-/set-function-name-2.0.2.tgz",
      "integrity": "sha512-7PGFlmtwsEADb0WYyvCMa1t+yke6daIG4Wirafur5kcf+MhUnPms1UeR0CKQdTZD81yESwMHbtn+TR+dMviakQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-data-property": "^1.1.4",
        "es-errors": "^1.3.0",
        "functions-have-names": "^1.2.3",
        "has-property-descriptors": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/set-proto": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/set-proto/-/set-proto-1.0.0.tgz",
      "integrity": "sha512-RJRdvCo6IAnPdsvP/7m6bsQqNnn1FCBX5ZNtFL98MmFF/4xAIJTIg1YbHW5DC2W5SKZanrC6i4HsJqlajw/dZw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/sharp": {
      "version": "0.35.4",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.35.4.tgz",
      "integrity": "sha512-n++8XWcj+jCOr2IOl7h8LbKnGBDY4aPbmprMONBNFdn0ImXqpGVv5zliDs0V9HbmbCQLpbuo2ej9rAoOQTvMDA==",
      "license": "Apache-2.0",
      "optional": true,
      "dependencies": {
        "@img/colour": "^1.1.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.8.5"
      },
      "engines": {
        "node": ">=20.9.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.35.4",
        "@img/sharp-darwin-x64": "0.35.4",
        "@img/sharp-freebsd-wasm32": "0.35.4",
        "@img/sharp-libvips-darwin-arm64": "1.3.3",
        "@img/sharp-libvips-darwin-x64": "1.3.3",
        "@img/sharp-libvips-linux-arm": "1.3.3",
        "@img/sharp-libvips-linux-arm64": "1.3.3",
        "@img/sharp-libvips-linux-ppc64": "1.3.3",
        "@img/sharp-libvips-linux-riscv64": "1.3.3",
        "@img/sharp-libvips-linux-s390x": "1.3.3",
        "@img/sharp-libvips-linux-x64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-arm64": "1.3.3",
        "@img/sharp-libvips-linuxmusl-x64": "1.3.3",
        "@img/sharp-linux-arm": "0.35.4",
        "@img/sharp-linux-arm64": "0.35.4",
        "@img/sharp-linux-ppc64": "0.35.4",
        "@img/sharp-linux-riscv64": "0.35.4",
        "@img/sharp-linux-s390x": "0.35.4",
        "@img/sharp-linux-x64": "0.35.4",
        "@img/sharp-linuxmusl-arm64": "0.35.4",
        "@img/sharp-linuxmusl-x64": "0.35.4",
        "@img/sharp-webcontainers-wasm32": "0.35.4",
        "@img/sharp-win32-arm64": "0.35.4",
        "@img/sharp-win32-ia32": "0.35.4",
        "@img/sharp-win32-x64": "0.35.4"
      },
      "peerDependenciesMeta": {
        "@types/node": {
          "optional": true
        }
      }
    },
    "node_modules/sharp/node_modules/semver": {
      "version": "7.8.5",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.8.5.tgz",
      "integrity": "sha512-Y7/KDsb8LjooZpwaqGyulO6DQlksgCncchHGk+sZIY4SBvUocMBEFH5Ur1fI4dV+Jvl0w6cjvucaIi40puRioA==",
      "license": "ISC",
      "optional": true,
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/shebang-command": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/shebang-command/-/shebang-command-2.0.0.tgz",
      "integrity": "sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "shebang-regex": "^3.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/shebang-regex": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/shebang-regex/-/shebang-regex-3.0.0.tgz",
      "integrity": "sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/side-channel": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.1.tgz",
      "integrity": "sha512-6x6dK6zJdpTzF4sQeNYxwtvBzf6Eg4GtlesS94HOvTudUeyK2WXAaIfmDgsyslYrRBeFIlsi54AYsFGUuhmvrQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4",
        "side-channel-list": "^1.0.1",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.1.tgz",
      "integrity": "sha512-mjn/0bi/oUURjc5Xl7IaWi/OJJJumuoJFQJfDDyO46+hBWsfaVM65TBHq2eoZBhzl9EchxOijpkbRC8SVBQU0w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.4"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/source-map-js": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.1.tgz",
      "integrity": "sha512-UXWMKhLOwVKb728IUtQPXxfYU+usdybtUrK/8uGE8CQMvrhOpwvzDBwj0QhSL7MQc7vIsISBG8VQ8+IDQxpfQA==",
      "license": "BSD-3-Clause",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/stable-hash": {
      "version": "0.0.5",
      "resolved": "https://registry.npmjs.org/stable-hash/-/stable-hash-0.0.5.tgz",
      "integrity": "sha512-+L3ccpzibovGXFK+Ap/f8LOS0ahMrHTf3xu7mMLSpEGU0EO9ucaysSylKo9eRDFNhWve/y275iPmIZ4z39a9iA==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/stop-iteration-iterator": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/stop-iteration-iterator/-/stop-iteration-iterator-1.1.0.tgz",
      "integrity": "sha512-eLoXW/DHyl62zxY4SCaIgnRhuMr6ri4juEYARS8E6sCEqzKpOiE521Ucofdx+KnDZl5xmvGYaaKCk5FEOxJCoQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "internal-slot": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.includes": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/string.prototype.includes/-/string.prototype.includes-2.0.1.tgz",
      "integrity": "sha512-o7+c9bW6zpAdJHTtujeePODAhkuicdAryFsfVKwA+wGw89wJ4GTY484WTucM9hLtDEOpOvI+aHnzqnC5lHp4Rg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.23.3"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/string.prototype.matchall": {
      "version": "4.1.0",
      "resolved": "https://registry.npmjs.org/string.prototype.matchall/-/string.prototype.matchall-4.1.0.tgz",
      "integrity": "sha512-tHNHTxInrYLCga9O9YGxWA3G9/nnzQw8UGAyqGx3Ar1pSTTzIuM4woFSq4SowkXCjJIwq5sIiQvEfRI9tCH1qQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.2",
        "get-intrinsic": "^1.3.0",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "internal-slot": "^1.1.0",
        "regexp.prototype.flags": "^1.5.4",
        "set-function-name": "^2.0.2",
        "side-channel": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.repeat": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/string.prototype.repeat/-/string.prototype.repeat-1.0.0.tgz",
      "integrity": "sha512-0u/TldDbKD8bFCQ/4f5+mNRrXwZ8hg2w7ZR8wa16e8z9XpePWl3eGEcUD0OXpEH/VJH/2G3gjUtR3ZOiBe2S/w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "define-properties": "^1.1.3",
        "es-abstract": "^1.17.5"
      }
    },
    "node_modules/string.prototype.trim": {
      "version": "1.2.11",
      "resolved": "https://registry.npmjs.org/string.prototype.trim/-/string.prototype.trim-1.2.11.tgz",
      "integrity": "sha512-PwvK7BU+CMTJGYQCTZb5RWXIML92lftJLhQz1tBzgKiqGxJaMlBAa48POXaNAC2s4y8jr3EFqrkF9+44neS46w==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-data-property": "^1.1.4",
        "define-properties": "^1.2.1",
        "es-abstract": "^1.24.2",
        "es-object-atoms": "^1.1.2",
        "has-property-descriptors": "^1.0.2",
        "safe-regex-test": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimend": {
      "version": "1.0.10",
      "resolved": "https://registry.npmjs.org/string.prototype.trimend/-/string.prototype.trimend-1.0.10.tgz",
      "integrity": "sha512-2+3aDAOmPTmuFwjDnmJG2ctEkQKVki7vOSqaxkv42Mowj1V6PnvuwFCRrR5lChUux1TBskPjfkeTOhqczDMxTw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/string.prototype.trimstart": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/string.prototype.trimstart/-/string.prototype.trimstart-1.0.8.tgz",
      "integrity": "sha512-UXSH262CSZY1tfu3G3Secr6uGLCFVPMhIqHjlgCUtCCcgihYc/xKs9djMTMUOb2j1mVSeU8EU6NWc/iQKU6Gfg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.7",
        "define-properties": "^1.2.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/strip-bom": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
      "integrity": "sha512-vavAMRXOgBVNF6nyEEmL3DBK19iRpDcoIwW+swQ+CbGiu7lju6t+JklA1MHweoWtadgt4ISVUsXLyDq34ddcwA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=4"
      }
    },
    "node_modules/strip-json-comments": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-3.1.1.tgz",
      "integrity": "sha512-6fPc+R4ihwqP6N/aIv2f1gMH8lOVtWQHoqC4yK6oSDVVocumAsfCqjkXnqiYMhmMwS/mEHLp7Vehlt3ql6lEig==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=8"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/styled-jsx": {
      "version": "5.1.6",
      "resolved": "https://registry.npmjs.org/styled-jsx/-/styled-jsx-5.1.6.tgz",
      "integrity": "sha512-qSVyDTeMotdvQYoHWLNGwRFJHC+i+ZvdBRYosOFgC+Wg1vx4frN2/RG/NA7SYqqvKNLf39P2LSRA2pu6n0XYZA==",
      "license": "MIT",
      "dependencies": {
        "client-only": "0.0.1"
      },
      "engines": {
        "node": ">= 12.0.0"
      },
      "peerDependencies": {
        "react": ">= 16.8.0 || 17.x.x || ^18.0.0-0 || ^19.0.0-0"
      },
      "peerDependenciesMeta": {
        "@babel/core": {
          "optional": true
        },
        "babel-plugin-macros": {
          "optional": true
        }
      }
    },
    "node_modules/supports-color": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-7.2.0.tgz",
      "integrity": "sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "has-flag": "^4.0.0"
      },
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/supports-preserve-symlinks-flag": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/supports-preserve-symlinks-flag/-/supports-preserve-symlinks-flag-1.0.0.tgz",
      "integrity": "sha512-ot0WnXS9fgdkgIcePe6RHNk1WA8+muPa6cSjeR3V8K27q9BB1rTE3R1p7Hv0z1ZyAc8s6Vvv8DIyWf681MAt0w==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/tailwindcss": {
      "version": "4.3.3",
      "resolved": "https://registry.npmjs.org/tailwindcss/-/tailwindcss-4.3.3.tgz",
      "integrity": "sha512-gOhV3P7ufE62QDGg1zVaTgCR+EtPv92k2nIhVcVKcLmxT1sUBsQGhnZj175j+MqRt4zLF7ic+sCYjfhxMxj7YQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/tapable": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/tapable/-/tapable-2.3.3.tgz",
      "integrity": "sha512-uxc/zpqFg6x7C8vOE7lh6Lbda8eEL9zmVm/PLeTPBRhh1xCgdWaQ+J1CUieGpIfm2HdtsUpRv+HshiasBMcc6A==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/webpack"
      }
    },
    "node_modules/tinyglobby": {
      "version": "0.2.17",
      "resolved": "https://registry.npmjs.org/tinyglobby/-/tinyglobby-0.2.17.tgz",
      "integrity": "sha512-wXR/dYpcqKmfWpEdZjiKJOwCNFndD0DMnrW/cYjVGttEkBfVgcLFHoNrlj47mjOVic9yyNu65alsgF4NQyTa2g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "fdir": "^6.5.0",
        "picomatch": "^4.0.4"
      },
      "engines": {
        "node": ">=12.0.0"
      },
      "funding": {
        "url": "https://github.com/sponsors/SuperchupuDev"
      }
    },
    "node_modules/tinyglobby/node_modules/fdir": {
      "version": "6.5.0",
      "resolved": "https://registry.npmjs.org/fdir/-/fdir-6.5.0.tgz",
      "integrity": "sha512-tIbYtZbucOs0BRGqPJkshJUYdL+SDH7dVM8gjy+ERp3WAUjLEFJE+02kanyHtwjWOnwrKYBiwAmM0p4kLJAnXg==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12.0.0"
      },
      "peerDependencies": {
        "picomatch": "^3 || ^4"
      },
      "peerDependenciesMeta": {
        "picomatch": {
          "optional": true
        }
      }
    },
    "node_modules/tinyglobby/node_modules/picomatch": {
      "version": "4.0.7",
      "resolved": "https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz",
      "integrity": "sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://github.com/sponsors/jonschlinkert"
      }
    },
    "node_modules/to-regex-range": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/to-regex-range/-/to-regex-range-5.0.1.tgz",
      "integrity": "sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-number": "^7.0.0"
      },
      "engines": {
        "node": ">=8.0"
      }
    },
    "node_modules/ts-api-utils": {
      "version": "2.5.0",
      "resolved": "https://registry.npmjs.org/ts-api-utils/-/ts-api-utils-2.5.0.tgz",
      "integrity": "sha512-OJ/ibxhPlqrMM0UiNHJ/0CKQkoKF243/AEmplt3qpRgkW8VG7IfOS41h7V8TjITqdByHzrjcS/2si+y4lIh8NA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.12"
      },
      "peerDependencies": {
        "typescript": ">=4.8.4"
      }
    },
    "node_modules/tsconfig-paths": {
      "version": "3.15.0",
      "resolved": "https://registry.npmjs.org/tsconfig-paths/-/tsconfig-paths-3.15.0.tgz",
      "integrity": "sha512-2Ac2RgzDe/cn48GvOe3M+o82pEFewD3UPbyoUHHdKasHwJKjds4fLXWf/Ux5kATBKN20oaFGu+jbElp1pos0mg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@types/json5": "^0.0.29",
        "json5": "^1.0.2",
        "minimist": "^1.2.6",
        "strip-bom": "^3.0.0"
      }
    },
    "node_modules/tsconfig-paths/node_modules/json5": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/json5/-/json5-1.0.2.tgz",
      "integrity": "sha512-g1MWMLBiz8FKi1e4w0UyVL3w+iJceWAFBAaBnnGKOpNa5f8TLktkbre1+s6oICydWAm+HRUGTmI+//xv2hvXYA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "minimist": "^1.2.0"
      },
      "bin": {
        "json5": "lib/cli.js"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "license": "0BSD"
    },
    "node_modules/type-check": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/type-check/-/type-check-0.4.0.tgz",
      "integrity": "sha512-XleUoc9uwGXqjWwXaUTZAmzMcFZ5858QA2vvx1Ur5xIcixXIP+8LnFDgRplU30us6teqdlskFfu+ae4K79Ooew==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "prelude-ls": "^1.2.1"
      },
      "engines": {
        "node": ">= 0.8.0"
      }
    },
    "node_modules/typed-array-buffer": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-buffer/-/typed-array-buffer-1.0.3.tgz",
      "integrity": "sha512-nAYYwfY3qnzX30IkA6AQZjVbtK6duGontcQm1WSG1MD94YLqK0515GNApXkoxKOWMusVssAHWLh9SeaoefYFGw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "es-errors": "^1.3.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/typed-array-byte-length": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/typed-array-byte-length/-/typed-array-byte-length-1.0.3.tgz",
      "integrity": "sha512-BaXgOuIxz8n8pIq3e7Atg/7s+DpiYrxn4vdot3w9KbnBhcRQq6o3xemQdIfynqSeXeDrF32x+WvfzmOjPiY9lg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.14"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-byte-offset": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/typed-array-byte-offset/-/typed-array-byte-offset-1.0.4.tgz",
      "integrity": "sha512-bTlAFB/FBYMcuX81gbL4OcpH5PmlFHqlCCpAl8AlEzMz5k53oNDvN8p1PNOWLEmI2x4orp3raOFB51tv9X+MFQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.8",
        "for-each": "^0.3.3",
        "gopd": "^1.2.0",
        "has-proto": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "reflect.getprototypeof": "^1.0.9"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typed-array-length": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/typed-array-length/-/typed-array-length-1.0.8.tgz",
      "integrity": "sha512-phPGCwqr2+Qo0fwniCE8e4pKnGu/yFb5nD5Y8bf0EEeiI5GklnACYA9GFy/DrAeRrKHXvHn+1SUsOWgJp6RO+g==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bind": "^1.0.9",
        "for-each": "^0.3.5",
        "gopd": "^1.2.0",
        "is-typed-array": "^1.1.15",
        "possible-typed-array-names": "^1.1.0",
        "reflect.getprototypeof": "^1.0.10"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/typescript-eslint": {
      "version": "8.70.0",
      "resolved": "https://registry.npmjs.org/typescript-eslint/-/typescript-eslint-8.70.0.tgz",
      "integrity": "sha512-P/W5cz70/cQAuKfY3xwQMWWTV7BvJ0mAQmi+9mBcsVPaBUpd6Ohpa+fECv9rBFrQcig86jAiNBFNWUqnTjr4pw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@typescript-eslint/eslint-plugin": "8.70.0",
        "@typescript-eslint/parser": "8.70.0",
        "@typescript-eslint/typescript-estree": "8.70.0",
        "@typescript-eslint/utils": "8.70.0"
      },
      "engines": {
        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/typescript-eslint"
      },
      "peerDependencies": {
        "eslint": "^8.57.0 || ^9.0.0 || ^10.0.0",
        "typescript": ">=4.8.4 <6.1.0"
      }
    },
    "node_modules/unbox-primitive": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/unbox-primitive/-/unbox-primitive-1.1.0.tgz",
      "integrity": "sha512-nWJ91DjeOkej/TA8pXQ3myruKpKEYgqvpw9lz4OPHj/NWFNluYrjbz9j01CJ8yKQd2g4jFoOkINCTW2I5LEEyw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.3",
        "has-bigints": "^1.0.2",
        "has-symbols": "^1.1.0",
        "which-boxed-primitive": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/undici-types": {
      "version": "6.21.0",
      "resolved": "https://registry.npmjs.org/undici-types/-/undici-types-6.21.0.tgz",
      "integrity": "sha512-iwDZqg0QAGrg9Rav5H4n0M64c3mkR59cJ6wQp+7C4nI0gsmExaedaYLNO44eT4AtBBwjbTiGPMlt2Md0T9H9JQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/unrs-resolver": {
      "version": "1.12.2",
      "resolved": "https://registry.npmjs.org/unrs-resolver/-/unrs-resolver-1.12.2.tgz",
      "integrity": "sha512-dmlRxBJJayXjqTwC+JtF1HhJmgf3ftQ3YejFcZrf4+KKtJv0qDsK1pjqaaVjG7wJ5NJ6UVP1OqRMQ71Z4C3rxQ==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "dependencies": {
        "napi-postinstall": "^0.3.4"
      },
      "funding": {
        "url": "https://opencollective.com/unrs-resolver"
      },
      "optionalDependencies": {
        "@unrs/resolver-binding-android-arm-eabi": "1.12.2",
        "@unrs/resolver-binding-android-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-arm64": "1.12.2",
        "@unrs/resolver-binding-darwin-x64": "1.12.2",
        "@unrs/resolver-binding-freebsd-x64": "1.12.2",
        "@unrs/resolver-binding-linux-arm-gnueabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm-musleabihf": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-arm64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-loong64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-ppc64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-riscv64-musl": "1.12.2",
        "@unrs/resolver-binding-linux-s390x-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-gnu": "1.12.2",
        "@unrs/resolver-binding-linux-x64-musl": "1.12.2",
        "@unrs/resolver-binding-openharmony-arm64": "1.12.2",
        "@unrs/resolver-binding-wasm32-wasi": "1.12.2",
        "@unrs/resolver-binding-win32-arm64-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-ia32-msvc": "1.12.2",
        "@unrs/resolver-binding-win32-x64-msvc": "1.12.2"
      }
    },
    "node_modules/update-browserslist-db": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/update-browserslist-db/-/update-browserslist-db-1.3.3.tgz",
      "integrity": "sha512-pJ2sYawQS0R/WI928Gj5GlPhTGzbMelq0+4INtSYNDV9ErKJcX6xjGWkoG/VnB3dpUm00zALaqkrUD77pO5TDQ==",
      "dev": true,
      "funding": [
        {
          "type": "opencollective",
          "url": "https://opencollective.com/browserslist"
        },
        {
          "type": "tidelift",
          "url": "https://tidelift.com/funding/github/npm/browserslist"
        },
        {
          "type": "github",
          "url": "https://github.com/sponsors/ai"
        }
      ],
      "license": "MIT",
      "dependencies": {
        "escalade": "^3.2.0",
        "picocolors": "^1.1.1"
      },
      "bin": {
        "update-browserslist-db": "cli.js"
      },
      "peerDependencies": {
        "browserslist": ">= 4.21.0"
      }
    },
    "node_modules/uri-js": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.4.1.tgz",
      "integrity": "sha512-7rKUyy33Q1yc98pQ1DAmLtwX109F7TIfWlW1Ydo8Wl1ii1SeHieeh0HHfPeL2fMXK6z0s8ecKs9frCuLJvndBg==",
      "dev": true,
      "license": "BSD-2-Clause",
      "dependencies": {
        "punycode": "^2.1.0"
      }
    },
    "node_modules/which": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/which/-/which-2.0.2.tgz",
      "integrity": "sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==",
      "dev": true,
      "license": "ISC",
      "dependencies": {
        "isexe": "^2.0.0"
      },
      "bin": {
        "node-which": "bin/node-which"
      },
      "engines": {
        "node": ">= 8"
      }
    },
    "node_modules/which-boxed-primitive": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/which-boxed-primitive/-/which-boxed-primitive-1.1.1.tgz",
      "integrity": "sha512-TbX3mj8n0odCBFVlY8AxkqcHASw3L60jIuF8jFP78az3C2YhmGvqbHBpAjTRH2/xqYunrJ9g1jSyjCjpoWzIAA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-bigint": "^1.1.0",
        "is-boolean-object": "^1.2.1",
        "is-number-object": "^1.1.1",
        "is-string": "^1.1.1",
        "is-symbol": "^1.1.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-builtin-type": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/which-builtin-type/-/which-builtin-type-1.2.1.tgz",
      "integrity": "sha512-6iBczoX+kDQ7a3+YJBnh3T+KZRxM/iYNPXicqk66/Qfm1b93iu+yOImkg0zHbj5LNOcNv1TEADiZ0xa34B4q6Q==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "function.prototype.name": "^1.1.6",
        "has-tostringtag": "^1.0.2",
        "is-async-function": "^2.0.0",
        "is-date-object": "^1.1.0",
        "is-finalizationregistry": "^1.1.0",
        "is-generator-function": "^1.0.10",
        "is-regex": "^1.2.1",
        "is-weakref": "^1.0.2",
        "isarray": "^2.0.5",
        "which-boxed-primitive": "^1.1.0",
        "which-collection": "^1.0.2",
        "which-typed-array": "^1.1.16"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-collection": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/which-collection/-/which-collection-1.0.2.tgz",
      "integrity": "sha512-K4jVyjnBdgvc86Y6BkaLZEN933SwYOuBFkdmBu9ZfkcAbdVbpITnDmjvZ/aQjRXQrv5EPkTnD1s39GiiqbngCw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "is-map": "^2.0.3",
        "is-set": "^2.0.3",
        "is-weakmap": "^2.0.2",
        "is-weakset": "^2.0.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/which-typed-array": {
      "version": "1.1.22",
      "resolved": "https://registry.npmjs.org/which-typed-array/-/which-typed-array-1.1.22.tgz",
      "integrity": "sha512-fvO4ExWMFsqyhG3AiPAObMuY1lxaqgYcxbc49CNdWDDECOJNgQyvsOWVwbZc+qf3rzRtxojBK+CMEv0Ld5CYpw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "available-typed-arrays": "^1.0.7",
        "call-bind": "^1.0.9",
        "call-bound": "^1.0.4",
        "for-each": "^0.3.5",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-tostringtag": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/word-wrap": {
      "version": "1.2.5",
      "resolved": "https://registry.npmjs.org/word-wrap/-/word-wrap-1.2.5.tgz",
      "integrity": "sha512-BN22B5eaMMI9UMtjrGd5g5eCYPpCPDUy0FJXbYsaT5zYxjFOckS53SQDE3pWkVoWpHXVb3BrYcEN4Twa55B5cA==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/yallist": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/yallist/-/yallist-3.1.1.tgz",
      "integrity": "sha512-a4UGQaWPH59mOXUYnAG2ewncQS4i4F43Tv3JoAM+s2VDAmS9NsK8GpDMLrCHPksFT7h3K6TOoUNn2pb7RoXx4g==",
      "dev": true,
      "license": "ISC"
    },
    "node_modules/yocto-queue": {
      "version": "0.1.0",
      "resolved": "https://registry.npmjs.org/yocto-queue/-/yocto-queue-0.1.0.tgz",
      "integrity": "sha512-rVksvsnNCdJ/ohGc6xgPwyN8eheCxsiLM8mxuE/t/mOVqJewPuO1miLpTHQiRgTKCLexL4MeAFVagts7HmNZ2Q==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=10"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/zod": {
      "version": "4.6.2",
      "resolved": "https://registry.npmjs.org/zod/-/zod-4.6.2.tgz",
      "integrity": "sha512-lh5RCAGFa1Cm2hjtNwLQhSs/AsqdWnTQaBER9fEwN/88pSh7KOtJavtBx/0VlkN/uFd61SwYmljLMDAsHlvzBQ==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/colinhacks"
      }
    },
    "node_modules/zod-validation-error": {
      "version": "4.0.2",
      "resolved": "https://registry.npmjs.org/zod-validation-error/-/zod-validation-error-4.0.2.tgz",
      "integrity": "sha512-Q6/nZLe6jxuU80qb/4uJ4t5v2VEZ44lzQjPDhYJNztRQ4wyWc6VF3D3Kb/fAuPetZQnhS3hnajCf9CsWesghLQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18.0.0"
      },
      "peerDependencies": {
        "zod": "^3.25.0 || ^4.0.0"
      }
    }
  }
}

```

### `package.json`

```json
{
  "name": "matterbridge",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.3.5",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.3.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

### `postcss.config.mjs`

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```

### `scripts/convert_excel_to_json.py`

```python
from openpyxl import load_workbook
from pathlib import Path
from datetime import datetime, date
import json, re, shutil, zipfile

SRC = Path('/mnt/data/MatterBridge_Database_Completed.xlsx')
OUT = Path('/mnt/data/MatterBridge_JSON_v1')
RAW = OUT/'raw'
MATTERS = OUT/'matters'
for d in [OUT, RAW, MATTERS]: d.mkdir(parents=True, exist_ok=True)

# Clean previous generated json files if rerun
for d in [RAW, MATTERS]:
    for f in d.glob('*.json'): f.unlink()


def ser(v):
    if isinstance(v, (datetime, date)):
        return v.strftime('%Y-%m-%d')
    return v

def norm_header(v, idx):
    if v is None or str(v).strip() == '':
        return f'column_{idx}'
    s = str(v).strip()
    s = re.sub(r'[^A-Za-z0-9_]+', '_', s).strip('_').lower()
    return s or f'column_{idx}'

def records(ws):
    raw_headers = [c.value for c in ws[1]]
    headers=[]; seen={}
    for i,h in enumerate(raw_headers,1):
        h2=norm_header(h,i)
        if h2 in seen:
            seen[h2]+=1; h2=f'{h2}_{seen[h2]}'
        else: seen[h2]=1
        headers.append(h2)
    out=[]
    for row in ws.iter_rows(min_row=2, values_only=True):
        if not any(v is not None and str(v).strip()!='' for v in row): continue
        rec={headers[i]:ser(row[i]) if i < len(row) else None for i in range(len(headers))}
        # trim strings
        rec={k:(v.strip() if isinstance(v,str) else v) for k,v in rec.items()}
        out.append(rec)
    return out

wb=load_workbook(SRC, data_only=True)
tables={ws.title:records(ws) for ws in wb.worksheets}

# Write raw per-sheet JSON
for name, rows in tables.items():
    (RAW/f'{name}.json').write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding='utf-8')

# Index helpers
def by(table, key):
    return {r.get(key):r for r in tables.get(table,[]) if r.get(key) not in (None,'')}

def group(table, key):
    d={}
    for r in tables.get(table,[]): d.setdefault(r.get(key),[]).append(r)
    return d

matter_types=by('matter_types','matter_type_id')
users=by('users','user_id')
parties=by('parties','party_id')
counsel=by('counsel','counsel_id')
assets=by('assets','asset_id')
security=by('security_interests','security_interest_id')
docs=by('documents','document_id')
sections_by_doc=group('document_sections','document_id')
workstreams_by_matter=group('workstreams','matter_id')
timeline_by_matter=group('matter_timeline','matter_id')
issues_by_matter=group('legal_issues','matter_id')
findings_by_matter=group('ai_findings','matter_id')
decisions_by_matter=group('decisions','matter_id')
access_by_matter=group('matter_access','matter_id')
engagements_by_matter=group('counsel_engagements','matter_id')
matter_assets_by_matter=group('matter_assets','matter_id')
asset_docs_by_asset=group('asset_documents','asset_id')
citations_by_finding=group('finding_citations','finding_id')
questions_by_brief=group('counsel_questions','brief_id')
briefs_by_eng=group('counsel_briefs','engagement_id')
outputs_by_eng=group('counsel_outputs','engagement_id')

# Policy and precedent lists are global in current workbook
policies=tables.get('company_policies',[])
precedents=tables.get('historical_matters',[])

def enrich_document(d):
    x=dict(d)
    x['sections']=sorted(sections_by_doc.get(d.get('document_id'),[]), key=lambda r:(r.get('section_order') or 0, r.get('section_id') or ''))
    return x

def enrich_finding(f):
    x=dict(f); x['citations']=citations_by_finding.get(f.get('finding_id'),[]); return x

def enrich_engagement(e):
    x=dict(e)
    x['counsel']=counsel.get(e.get('counsel_id'))
    briefs=[]
    for b in briefs_by_eng.get(e.get('engagement_id'),[]):
        bb=dict(b); bb['questions']=questions_by_brief.get(b.get('brief_id'),[]); briefs.append(bb)
    x['briefs']=briefs
    x['outputs']=outputs_by_eng.get(e.get('engagement_id'),[])
    return x

matter_outputs=[]
for m in tables.get('matters',[]):
    mid=m['matter_id']
    out={
        'matter':m,
        'matter_type':matter_types.get(m.get('matter_type_id')),
        'parties':{
            'client':parties.get(m.get('client_id')),
            'counterparty':parties.get(m.get('counterparty_id')),
        },
        'workstreams':[],
        'timeline':sorted(timeline_by_matter.get(mid,[]), key=lambda r:(r.get('event_date') or '', r.get('timeline_id') or '')),
        'issues':issues_by_matter.get(mid,[]),
        'findings':[enrich_finding(f) for f in findings_by_matter.get(mid,[])],
        'decisions':decisions_by_matter.get(mid,[]),
        'access':[],
        'counsel_engagements':[enrich_engagement(e) for e in engagements_by_matter.get(mid,[])],
        'assets':[],
        'company_policies':policies,
        'historical_precedents':precedents,
    }
    # access enriched with users
    for a in access_by_matter.get(mid,[]):
        aa=dict(a); aa['user']=users.get(a.get('user_id')); out['access'].append(aa)
    # assets enriched
    for ma in matter_assets_by_matter.get(mid,[]):
        aid=ma.get('asset_id')
        ax={
            'matter_asset':ma,
            'asset':assets.get(aid),
            'security_interest':security.get(ma.get('security_interest_id')),
            'documents':[]
        }
        for ad in asset_docs_by_asset.get(aid,[]):
            d=docs.get(ad.get('document_id'))
            if d:
                ax['documents'].append({'asset_document':ad,'document':enrich_document(d)})
        out['assets'].append(ax)
    # workstreams and docs
    for w in workstreams_by_matter.get(mid,[]):
        wid=w.get('workstream_id')
        wd=[enrich_document(d) for d in tables.get('documents',[]) if d.get('matter_id')==mid and d.get('workstream_id')==wid]
        ww=dict(w)
        ww['documents']=wd
        ww['timeline']=[r for r in timeline_by_matter.get(mid,[]) if r.get('workstream_id')==wid]
        ww['issues']=[r for r in issues_by_matter.get(mid,[]) if r.get('workstream_id')==wid]
        ww['findings']=[enrich_finding(r) for r in findings_by_matter.get(mid,[]) if r.get('workstream_id')==wid]
        ww['decisions']=[r for r in decisions_by_matter.get(mid,[]) if r.get('workstream_id')==wid]
        out['workstreams'].append(ww)
    matter_outputs.append(out)
    (MATTERS/f'{mid}.json').write_text(json.dumps(out,indent=2,ensure_ascii=False),encoding='utf-8')

# Retrieval chunks: one per document section + metadata and linked asset IDs
asset_links_by_doc={}
for ad in tables.get('asset_documents',[]):
    asset_links_by_doc.setdefault(ad.get('document_id'),[]).append(ad.get('asset_id'))
workstreams=by('workstreams','workstream_id')
matters=by('matters','matter_id')
chunks=[]
for d in tables.get('documents',[]):
    mid=d.get('matter_id'); wid=d.get('workstream_id')
    m=matters.get(mid,{})
    w=workstreams.get(wid,{})
    for s in sections_by_doc.get(d.get('document_id'),[]):
        chunks.append({
            'chunk_id':s.get('section_id'),
            'matter_id':mid,
            'matter_title':m.get('matter_title'),
            'matter_type_id':m.get('matter_type_id'),
            'risk_rating':m.get('risk_rating'),
            'workstream_id':wid,
            'workstream_name':w.get('workstream_name'),
            'parent_workstream_id':w.get('parent_workstream_id'),
            'document_id':d.get('document_id'),
            'document_title':d.get('document_title'),
            'document_type':d.get('document_type'),
            'document_date':d.get('document_date'),
            'document_source':d.get('document_source'),
            'document_status':d.get('document_status'),
            'asset_ids':asset_links_by_doc.get(d.get('document_id'),[]),
            'section_title':s.get('section_title'),
            'section_order':s.get('section_order'),
            'text':s.get('section_content'),
            'citation_label':f"{d.get('document_title')} — {s.get('section_title')} ({s.get('section_id')})"
        })
(OUT/'knowledge_chunks.json').write_text(json.dumps(chunks,indent=2,ensure_ascii=False),encoding='utf-8')

# Lightweight UI index
index=[]
for x in matter_outputs:
    m=x['matter']
    index.append({
        'matter_id':m['matter_id'],'title':m.get('matter_title'),'status':m.get('matter_status'),
        'risk_rating':m.get('risk_rating'),'matter_type_id':m.get('matter_type_id'),
        'outstanding_exposure_inr':m.get('outstanding_exposure_inr'),
        'workstreams':[{'workstream_id':w.get('workstream_id'),'name':w.get('workstream_name'),'status':w.get('workstream_status'),'parent_workstream_id':w.get('parent_workstream_id')} for w in x['workstreams']],
        'issue_count':len(x['issues']),'finding_count':len(x['findings']),'document_count':sum(len(w['documents']) for w in x['workstreams'])
    })
(OUT/'matter_index.json').write_text(json.dumps(index,indent=2,ensure_ascii=False),encoding='utf-8')

# Validation report for critical IDs/refs
errors=[]; warnings=[]
def check_ref(table, field, valid, label):
    for r in tables.get(table,[]):
        v=r.get(field)
        if v not in (None,'') and v not in valid:
            errors.append(f'{table}.{field}={v} references missing {label}')
check_ref('workstreams','matter_id',set(matters),'matter')
check_ref('documents','matter_id',set(matters),'matter')
check_ref('documents','workstream_id',set(workstreams),'workstream')
check_ref('document_sections','document_id',set(docs),'document')
check_ref('matter_assets','matter_id',set(matters),'matter')
check_ref('matter_assets','asset_id',set(assets),'asset')
check_ref('matter_assets','security_interest_id',set(security),'security interest')
check_ref('asset_documents','asset_id',set(assets),'asset')
check_ref('asset_documents','document_id',set(docs),'document')
check_ref('legal_issues','matter_id',set(matters),'matter')
check_ref('legal_issues','workstream_id',set(workstreams),'workstream')
check_ref('ai_findings','matter_id',set(matters),'matter')
check_ref('ai_findings','workstream_id',set(workstreams),'workstream')
check_ref('finding_citations','finding_id',set(by('ai_findings','finding_id')),'finding')
# Citation source IDs vary by source type
for c in tables.get('finding_citations',[]):
    st=c.get('source_type'); sid=c.get('source_id'); ss=c.get('source_section')
    if st=='DOCUMENT' and sid not in docs: errors.append(f"citation {c.get('citation_id')} missing document {sid}")
    if st=='DOCUMENT' and ss and ss not in by('document_sections','section_id'): errors.append(f"citation {c.get('citation_id')} missing section {ss}")
    if st=='LEGAL_ISSUE' and sid not in by('legal_issues','issue_id'): errors.append(f"citation {c.get('citation_id')} missing issue {sid}")
# Known semantic stale text check
for c in tables.get('finding_citations',[]):
    if c.get('citation_id')=='CITE-001' and '6 EMIs' in str(c.get('citation_text')):
        warnings.append('CITE-001 citation_text still says 6 EMIs overdue while repaired financial data says 5. IDs/retrieval are valid, but text should be corrected in Excel later.')
report={
    'source_file':SRC.name,
    'generated_at':datetime.now().isoformat(timespec='seconds'),
    'sheet_row_counts':{k:len(v) for k,v in tables.items()},
    'matter_count':len(matter_outputs),
    'knowledge_chunk_count':len(chunks),
    'critical_reference_errors':errors,
    'warnings':warnings,
    'status':'PASS' if not errors else 'FAIL'
}
(OUT/'validation_report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding='utf-8')

# README
readme=f'''# MatterBridge JSON v1\n\nGenerated from `{SRC.name}`.\n\n## Contents\n- `raw/` — one JSON array per Excel worksheet; closest representation of the workbook.\n- `matters/MAT-001.json`, `MAT-002.json` — nested application-ready matter objects.\n- `matter_index.json` — lightweight list for the dashboard.\n- `knowledge_chunks.json` — document-section chunks enriched with matter/workstream/document/asset metadata for retrieval.\n- `validation_report.json` — referential integrity report.\n- `convert_excel_to_json.py` — reusable converter.\n\n## Recommended Next.js usage\nUse `matter_index.json` for the dashboard and `matters/<matter_id>.json` for matter screens. Use `knowledge_chunks.json` in the retrieval service.\n\n## v1 retrieval strategy\n1. Filter chunks by `matter_id`.\n2. Optionally filter by `workstream_id`, `document_type`, `asset_ids`, or date.\n3. Rank/select the most relevant chunks using lexical matching or an LLM reranker.\n4. Pass only selected chunk text + citation metadata to the model.\n5. Require model outputs to return referenced `chunk_id` values.\n\nNo vector database is required for this dataset size.\n'''
(OUT/'README.md').write_text(readme, encoding='utf-8')

# Copy converter itself into package
shutil.copy2('/mnt/data/build_matterbridge_json.py', OUT/'convert_excel_to_json.py')

# zip package
zip_path=Path('/mnt/data/MatterBridge_JSON_v1.zip')
if zip_path.exists(): zip_path.unlink()
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
    for f in OUT.rglob('*'):
        if f.is_file(): z.write(f, f.relative_to(OUT.parent))

print(json.dumps(report,indent=2))
print('ZIP',zip_path,zip_path.stat().st_size)

```

### `scripts/create_project_export.py`

```python
"""Create a portable Markdown export of the MatterBridge project."""

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "MatterBridge-project-export.md"
EXCLUDED_DIRS = {".git", ".next", "node_modules", "__pycache__"}
EXCLUDED_NAMES = {".env.local", ".env", OUTPUT.name}
TEXT_EXTENSIONS = {
    ".css",
    ".json",
    ".mjs",
    ".md",
    ".py",
    ".ts",
    ".tsx",
    ".txt",
    ".yaml",
    ".yml",
}


def project_files() -> list[Path]:
    files = []
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        relative_parts = path.relative_to(ROOT).parts
        if any(part in EXCLUDED_DIRS for part in relative_parts):
            continue
        if path.name in EXCLUDED_NAMES or path.suffix.lower() not in TEXT_EXTENSIONS:
            continue
        files.append(path)
    return sorted(files, key=lambda path: str(path.relative_to(ROOT)))


def architecture_summary() -> str:
    return """## Technical architecture

### Runtime and framework

- Next.js App Router with TypeScript.
- Tailwind CSS and shared UI components.
- Server-rendered data-backed pages with route-level loading states.
- No database, external vector store, LangChain layer, or production auth layer.

### Application layers

```text
app/ routes and page composition
  ↓
components/ reusable navigation, cards, panels, issue workspace, AI review UI
  ↓
lib/data/ typed data access, correlation, retrieval, counsel/access helpers
  ↓
data/ JSON matter records, raw source structures, knowledge chunks
```

### Primary routes

- `/` — Legal Matter Intelligence dashboard.
- `/evidence` — Documentary Evidence library.
- `/counsel-review` — Overall Counsel Engagement Review.
- `/matters/[matterId]` — matter overview, timeline, and Counsel & Decisions.
- `/matters/[matterId]/workstreams/[workstreamId]` — issue-first workstream view.
- `/matters/[matterId]/counsel-brief` — counsel brief.
- `/matters/[matterId]/opinion-review` — counsel opinion review.
- `/matters/[matterId]/legal-decision` — internal legal decision.
- `/matters/[matterId]/institutional-memory` — precedents and reusable knowledge.
- `/counsel-workspace/[matterId]` — simulated scoped external counsel workspace.
- `/api/opinion-review` — server-side Gemini opinion-review workflow.

### Data and relationship model

Matter records are file-backed JSON. Workstreams contain documents, findings,
and issues. Issue support is correlated in `lib/data/issue-mapping.ts` by
matter/workstream scope first and topic/meaning second; multiple findings or
documents may support one issue. Source and chunk identifiers are preserved for
traceability.

### Retrieval and Gemini integration

`lib/data/evidence-service.ts` applies deterministic matter/workstream filters,
lexical ranking, and bounded evidence-packet construction over
`data/knowledge_chunks.json`. The API route sends only that bounded packet to
Gemini using server-side `GEMINI_API_KEY` and `GEMINI_MODEL` environment
variables. Structured output is validated, and returned source IDs must belong
to the retrieved evidence scope. Stored review data remains available when the
live provider is unavailable.

### Prototype boundaries

Uploads, comments, and live review results are not persisted. Authentication,
RBAC, production storage, deployment, and live-provider/browser verification are
outside this export's verified scope. `.env.local`, dependencies, build output,
Git metadata, and binary assets are intentionally omitted.
"""


def main() -> None:
    files = project_files()
    lines = [
        "# MatterBridge — Complete Project Export",
        "",
        "> Generated from the repository workspace. This Markdown file is a portable review/export bundle, not a replacement for the original project directory.",
        "",
        "## Contents",
        "",
        f"- {len(files)} portable text/config/source files included.",
        "- Dependencies, build output, Git metadata, secrets, and binary assets omitted.",
        "",
        architecture_summary().strip(),
        "",
        "## Project file tree",
        "",
        "```text",
    ]
    lines.extend(str(path.relative_to(ROOT)) for path in files)
    lines.extend(["```", "", "## File contents", ""])

    for path in files:
        relative = path.relative_to(ROOT)
        language = path.suffix.lower().lstrip(".") or "text"
        if language == "mjs":
            language = "javascript"
        elif language == "py":
            language = "python"
        lines.extend(
            [
                f"### `{relative}`",
                "",
                f"```{language}",
                path.read_text(encoding="utf-8"),
                "```",
                "",
            ]
        )

    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUTPUT} with {len(files)} files")


if __name__ == "__main__":
    main()

```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}

```
