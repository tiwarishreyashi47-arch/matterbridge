import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates/catalog";

function nextId(prefix: string, ids: string[]) {
  const highest = ids.reduce((max, id) => {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
    return Math.max(max, match ? Number(match[1]) : 0);
  }, 0);
  return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}

function matterTypeForTemplate(templateId: string) {
  return { recovery: "MT-001", employment: "MT-002", financing: "MT-003", generic: "MT-GENERIC" }[templateId] ?? "MT-GENERIC";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { title?: string; description?: string; templateId?: string } | null;
  const title = body?.title?.trim();
  const template = body?.templateId ? getTemplate(body.templateId) : undefined;
  if (!title || !template) return NextResponse.json({ error: "A matter title and valid matter-type template are required." }, { status: 400 });

  const client = createSupabaseServerClient();
  const [{ data: matterRows, error: matterListError }, { data: workstreamRows, error: workstreamListError }] = await Promise.all([
    client.from("matter").select("matter_id"),
    client.from("workstream").select("workstream_id"),
  ]);
  if (matterListError) return NextResponse.json({ error: matterListError.message }, { status: 502 });
  if (workstreamListError) return NextResponse.json({ error: workstreamListError.message }, { status: 502 });

  const matterId = nextId("MAT", (matterRows ?? []).map((row) => row.matter_id as string));
  const workstreamIds = (workstreamRows ?? []).map((row) => row.workstream_id as string);
  const firstWorkstreamId = Number(nextId("WS", workstreamIds).replace("WS-", ""));
  const today = new Date().toISOString().slice(0, 10);
  const { error: matterError } = await client.from("matter").insert({
    matter_id: matterId,
    matter_type_id: matterTypeForTemplate(template.template_id),
    matter_title: title,
    matter_description: body?.description?.trim() || `${template.name} matter created from the ${template.version} template.`,
    matter_status: "OPEN",
    risk_rating: "UNASSESSED",
    stage: template.stages[0] ?? "Intake",
    template_id: template.template_id,
    template_version: template.version,
    created_date: today,
  });
  if (matterError) return NextResponse.json({ error: matterError.message }, { status: 502 });

  const workstreams = template.workstreams.map((workstream, index) => ({
    workstream_id: `WS-${String(firstWorkstreamId + index).padStart(3, "0")}`,
    matter_id: matterId,
    workstream_name: workstream.name,
    workstream_description: workstream.description,
    workstream_type: workstream.key,
    workstream_status: "NOT_STARTED",
    created_date: today,
  }));
  const { error: workstreamError } = await client.from("workstream").insert(workstreams);
  if (workstreamError) return NextResponse.json({ error: workstreamError.message }, { status: 502 });

  return NextResponse.json({ matterId, templateId: template.template_id, workstreamIds: workstreams.map((workstream) => workstream.workstream_id) }, { status: 201 });
}
