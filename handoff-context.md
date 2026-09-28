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
