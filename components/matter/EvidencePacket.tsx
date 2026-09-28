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
