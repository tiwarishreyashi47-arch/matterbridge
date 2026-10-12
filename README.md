# MatterBridge

MatterBridge is an AI-powered matter and document intelligence prototype. It explores how fragmented documents, matter context, and external advice can become structured evidence, review workflows, grounded AI assistance, and reusable institutional knowledge.

The legal domain supplies a demanding test case, but the underlying product problem is broader: how can a team turn unstructured records into traceable findings and coordinated decisions without hiding uncertainty?

## The system in one pass

1. Matter records and documents provide the working context.
2. Evidence is scoped by matter and workstream, then ranked into a bounded packet.
3. Findings connect issues to supporting documents and source/chunk identifiers.
4. Human review distinguishes supported evidence, inference, missing information, and matters requiring judgment.
5. External counsel advice and internal decisions remain separate records.
6. The Company Brain / matter graph exposes reusable context and the next workflow action.

The prototype’s shared workflow loop is **capture → extract → cite → queue → refer → decide**.

## What is demonstrated

- matter, workstream, document, issue, finding, counsel, decision, and precedent views;
- deterministic retrieval with matter/workstream filtering and lexical ranking;
- issue-to-finding/evidence relationships;
- a server-side Gemini opinion-review route with structured output;
- validation that model-returned source IDs belong to the retrieved evidence scope;
- human review state, scoped counsel views, counsel questions, and internal decisions;
- a Company Brain context graph and cross-matter counsel workspace.

The two demo matters use synthetic data. The app does not present an unresolved legal question as a settled conclusion, and final judgment remains with the user.

## Trust boundaries and important decisions

MatterBridge keeps four things visibly distinct:

- documentary evidence;
- MatterBridge findings and inferences;
- external counsel advice;
- internal decisions and rationale.

Retrieval is intentionally bounded rather than sending an entire matter to the model. Source references are checked before results are shown. This makes traceability and human review part of the product design rather than post-processing.

## Stack and architecture

This is a Next.js App Router application using TypeScript, Tailwind CSS, and ESLint.

- `app/` contains dashboard, matter, evidence, counsel, review, and decision routes.
- `components/` contains shared navigation and review/workspace UI.
- `lib/data/` provides typed data access, retrieval, correlation, and counsel helpers.
- `lib/local/local-store.ts` provides deterministic local JSON persistence and demo seeding.
- `app/api/opinion-review/route.ts` performs the optional server-side Gemini request.
- `scripts/` contains reset, seed, conversion, and evaluation utilities.

## Real versus simulated

Real in the local V1 demo:

- data-backed views and relationships;
- deterministic, scoped evidence retrieval;
- structured AI output with source validation;
- local review, upload/storage, processing-job, workspace, counsel, and decision flows.

Simulated or deferred:

- the local adapter is not production Postgres, object storage, authentication, or RBAC;
- the dataset is synthetic and bounded;
- Gemini is optional; grounded local retrieval works without a provider call;
- production deployment and production route verification are not established;
- the final outcome of the unresolved demo matter remains unknown.

## Run locally

```bash
npm install
npm run lint
npm run build
MATTERBRIDGE_STORAGE_MODE=local npm run dev
```

Then open `/matter-network` for the Company Brain and workflow loop or `/legal-counsel` for bounded cross-matter questions. To clear ignored local demo state and reseed the local records:

```bash
npm run demo:reset
```

Copy `.env.example` to `.env.local` for optional Gemini review. The relevant values are `GEMINI_API_KEY` and `GEMINI_MODEL`; never commit `.env.local` or expose the key client-side.

## Current status and limitations

MatterBridge is a proposal-ready, synthetic-data portfolio prototype focused on evidence grounding, reviewability, and workflow design. It is not a production legal system, does not provide legal advice, and should not be read as evidence of live authentication, permissions, OCR quality, persistence, or deployment readiness.

For the guided walkthrough, see [`PROPOSAL_DEMO.md`](./PROPOSAL_DEMO.md). Build-control and handoff files are retained for project history; they are not required to understand the public product in this README.
