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
