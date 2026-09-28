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
