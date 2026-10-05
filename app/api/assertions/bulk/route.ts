import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { promoteAcceptedCounselAssertions, promoteAcceptedOpenItem } from "@/lib/knowledge/promotion";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { assertionIds?: string[]; status?: "accepted" | "rejected"; actorUserId?: string } | null;
  if (!body?.assertionIds?.length || !body.status) return NextResponse.json({ error: "assertionIds and status are required." }, { status: 400 });
  const client = createSupabaseServerClient();
  const { data: current, error: currentError } = await client.from("assertion").select("*").in("assertion_id", body.assertionIds);
  if (currentError) return NextResponse.json({ error: currentError.message }, { status: 502 });
  const proposed = (current ?? []).filter((row) => row.status === "proposed");
  if (!proposed.length) return NextResponse.json({ updated: 0, assertionIds: [] });
  const { error } = await client.from("assertion").update({ status: body.status, updated_at: new Date().toISOString() }).in("assertion_id", proposed.map((row) => row.assertion_id));
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  if (body.status === "accepted") {
    for (const assertion of proposed) {
      await promoteAcceptedOpenItem(client, assertion as { assertion_id: string; matter_id: string; attribute: string; value: unknown });
      await promoteAcceptedCounselAssertions(client, assertion as never);
    }
  }
  const timestamp = Date.now();
  const { error: auditError } = await client.from("audit_event").insert(proposed.map((row) => ({ audit_event_id: `AUDIT-BULK-${row.assertion_id}-${timestamp}`, matter_id: row.matter_id, actor_user_id: body.actorUserId ?? null, event_type: "ASSERTION_REVIEWED", entity_type: "assertion", entity_id: row.assertion_id, payload: { status: body.status, bulk: true } })));
  if (auditError) return NextResponse.json({ error: auditError.message }, { status: 502 });
  return NextResponse.json({ updated: proposed.length, assertionIds: proposed.map((row) => row.assertion_id) });
}
