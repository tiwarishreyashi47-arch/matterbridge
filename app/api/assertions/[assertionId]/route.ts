import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ assertionId: string }> };

export async function PATCH(request: Request, { params }: Props) {
  const { assertionId } = await params;
  const body = await request.json().catch(() => null) as { status?: string; value?: unknown; actorUserId?: string } | null;
  if (!body?.status || !["accepted", "rejected"].includes(body.status)) return NextResponse.json({ error: "status must be accepted or rejected." }, { status: 400 });
  const client = createSupabaseServerClient();
  const { data: current, error: currentError } = await client.from("assertion").select("*").eq("assertion_id", assertionId).maybeSingle();
  if (currentError) return NextResponse.json({ error: currentError.message }, { status: 502 });
  if (!current) return NextResponse.json({ error: "Assertion not found." }, { status: 404 });
  const { data, error } = await client.from("assertion").update({ status: body.status, value: body.value ?? current.value, source: body.status === "accepted" && body.value !== undefined ? "user" : current.source, updated_at: new Date().toISOString() }).eq("assertion_id", assertionId).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  await client.from("audit_event").insert({ audit_event_id: `AUDIT-${assertionId}-${Date.now()}`, matter_id: current.matter_id, actor_user_id: body.actorUserId ?? null, event_type: "ASSERTION_REVIEWED", entity_type: "assertion", entity_id: assertionId, payload: { status: body.status } });
  return NextResponse.json(data);
}
