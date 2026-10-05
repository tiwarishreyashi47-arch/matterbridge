# MatterBridge

MatterBridge is a lawyer-focused legal matter intelligence prototype. It helps
legal teams move from matter facts and documentary evidence to queryable
company knowledge, workflow automation, external counsel communication, and an
explicitly owned internal decision. The proposal demo uses two small synthetic
matters so the reusable pattern is easy to follow without pretending that
unresolved legal questions or outcomes are settled.

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
- **Matter Network** shows the Company Brain context graph and the shared
  automation loop: capture, extract, cite, queue, refer, and decide.
- **Legal Counsel** answers bounded questions across matter records and links
  each answer back to the supporting matter workspace.

## Architecture

This is a Next.js App Router application using TypeScript and Tailwind CSS.
The repository supports a deterministic local V1 mode for demos and a Supabase
adapter for the Phase 2 persistence path:

- `lib/local/local-store.ts` provides local JSON persistence and seeds MAT-101
  (employment/HR) and MAT-102 (financing) on first run.
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

Implemented in the local V1 demo:

- data-backed matter, workstream, document, issue, finding, counsel, decision,
  and precedent views;
- deterministic evidence retrieval with metadata filtering and lexical
  ranking;
- issue-to-finding/evidence correlation using existing matter/workstream and
  topic relationships;
- server-side Gemini integration with structured output and source validation;
- local lawyer assessment/comment state in issue workspaces;
- loading, missing-record, configuration, and model-failure handling.
- local upload/storage, document processing jobs, assertions, review state,
  workspace assignment, the Company Brain graph, and external counsel
  question/advice records.

Intentionally simulated or deferred:

- the local adapter is proposal/demo-grade and is not a replacement for
  production Postgres, object storage, authentication, or RBAC;
- final MAT-001 recovery outcome remains open and unknown;
- Gemini remains optional; local grounded retrieval works without a provider
  call;
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

For a clean proposal demo, use the local adapter:

```bash
MATTERBRIDGE_STORAGE_MODE=local npm run dev
```

Open `/matter-network` for the Company Brain and workflow loop, or
`/legal-counsel` to query both demo matters. To reset only the ignored local
demo state and reseed MAT-101/MAT-102 on the next request:

```bash
npm run demo:reset
```

### Environment variables

Copy `.env.example` to `.env.local` and provide the values locally. Never
commit `.env.local` or expose the API key to client-side code.

```text
GEMINI_API_KEY=your-server-side-key
GEMINI_MODEL=gemini-3.5-flash-lite
```

The Gemini variables enable the guarded live opinion-review action. The stored
MatterBridge review remains available when the integration is not configured
or a provider request fails.

## Prototype limitations

This repository is a portfolio prototype, not a production legal system. The
dataset is synthetic, source completeness is bounded by the available JSON,
and no production deployment, persistence, authentication, or live-provider
verification should be inferred from a passing build alone.
