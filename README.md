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
