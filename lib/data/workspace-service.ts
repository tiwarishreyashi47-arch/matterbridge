import "server-only";

import { cookies } from "next/headers";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAllMatters } from "@/lib/data/matter-service";
import type { WorkspaceRole, WorkspaceUser } from "@/lib/types/workspace";

export const WORKSPACE_USER_COOKIE = "matterbridge_workspace_user";

const demoTeam: WorkspaceUser[] = [
  { user_id: "USER-001", user_name: "Aarav Mehta", user_email: "aarav.mehta@example.test", user_role: "MANAGER", department: "Legal" },
  ...Array.from({ length: 11 }, (_, index) => ({
    user_id: `USER-${String(index + 2).padStart(3, "0")}`,
    user_name: ["Priya Shah", "Rohan Iyer", "Ananya Rao", "Kabir Singh", "Nisha Menon", "Dev Patel", "Mira Kapoor", "Arjun Nair", "Tara Bose", "Ishaan Das", "Leena Joseph"][index],
    user_email: `legal.${index + 2}@example.test`,
    user_role: (index === 0 ? "LAWYER" : index === 1 ? "PARALEGAL" : "LAWYER") as WorkspaceRole,
    department: "Legal",
  })),
];

async function client() {
  return createSupabaseServerClient() as unknown as SupabaseClient;
}

export async function ensureLocalTeam() {
  const db = await client();
  const { data } = await db.from("app_user").select("user_id");
  if ((data ?? []).length > 0) return;
  await db.from("app_user").insert(demoTeam);
}

export async function getWorkspaceUsers() {
  await ensureLocalTeam();
  const db = await client();
  const { data, error } = await db.from("app_user").select("*").order("user_name");
  if (error) throw new Error(error.message);
  return (data ?? []) as WorkspaceUser[];
}

export async function getCurrentWorkspaceUser() {
  const users = await getWorkspaceUsers();
  const selected = (await cookies()).get(WORKSPACE_USER_COOKIE)?.value;
  return users.find((user) => user.user_id === selected) ?? users.find((user) => user.user_role === "MANAGER") ?? users[0];
}

export async function getWorkspaceSnapshot(userId?: string) {
  const users = await getWorkspaceUsers();
  const currentUser = users.find((user) => user.user_id === userId) ?? users.find((user) => user.user_role === "MANAGER") ?? users[0];
  const matters = await getAllMatters();
  const assignments = matters.flatMap((matterData) => (matterData.access ?? []) as { access_id: string; matter_id: string; user_id: string; access_level: string; granted_date?: string; granted_by?: string }[]);
  const visibleMatters = currentUser?.user_role === "MANAGER"
    ? matters
    : matters.filter((matterData) => assignments.some((assignment) => assignment.matter_id === matterData.matter.matter_id && assignment.user_id === currentUser?.user_id));
  return { users, currentUser, matters, visibleMatters, assignments };
}
