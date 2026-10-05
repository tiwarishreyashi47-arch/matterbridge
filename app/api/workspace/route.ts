import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureLocalTeam, WORKSPACE_USER_COOKIE } from "@/lib/data/workspace-service";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { action?: string; userId?: string; matterId?: string; accessLevel?: string } | null;
  await ensureLocalTeam();
  const db = createSupabaseServerClient() as unknown as SupabaseClient;

  if (body?.action === "select_user" && body.userId) {
    const { data: user } = await db.from("app_user").select("*").eq("user_id", body.userId).maybeSingle();
    if (!user) return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    (await cookies()).set(WORKSPACE_USER_COOKIE, body.userId, { httpOnly: true, sameSite: "lax", path: "/" });
    return NextResponse.json({ user });
  }

  if (body?.action === "assign_matter" && body.userId && body.matterId) {
    const { data: existing } = await db.from("matter_access").select("access_id").eq("matter_id", body.matterId).eq("user_id", body.userId).maybeSingle();
    if (!existing) {
      const { error } = await db.from("matter_access").insert({
        access_id: `ACCESS-${body.matterId}-${body.userId}`,
        matter_id: body.matterId,
        user_id: body.userId,
        access_level: body.accessLevel ?? "EDITOR",
        granted_date: new Date().toISOString().slice(0, 10),
        granted_by: "USER-001",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 502 });
    }
    return NextResponse.json({ assigned: true });
  }

  return NextResponse.json({ error: "Unsupported workspace action." }, { status: 400 });
}
