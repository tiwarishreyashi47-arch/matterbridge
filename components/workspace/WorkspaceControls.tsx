"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { WorkspaceUser } from "@/lib/types/workspace";

type Props = { users: WorkspaceUser[]; currentUser?: WorkspaceUser; matterIds: string[]; canAssign: boolean };

export default function WorkspaceControls({ users, currentUser, matterIds, canAssign }: Props) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(currentUser?.user_id ?? "");
  const [selectedMatter, setSelectedMatter] = useState(matterIds[0] ?? "");
  const [message, setMessage] = useState("");

  async function selectUser(userId: string) {
    setSelectedUser(userId);
    await fetch("/api/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "select_user", userId }) });
    router.refresh();
  }

  async function assignMatter() {
    setMessage("");
    const response = await fetch("/api/workspace", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "assign_matter", userId: selectedUser, matterId: selectedMatter }) });
    setMessage(response.ok ? "Matter assigned." : "Assignment could not be saved.");
    if (response.ok) router.refresh();
  }

  return <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
    <label className="block text-sm font-semibold text-slate-800">Viewing workspace as
      <select value={selectedUser} onChange={(event) => void selectUser(event.target.value)} className="mt-2 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-normal text-slate-700">
        {users.map((user) => <option key={user.user_id} value={user.user_id}>{user.user_name} · {user.user_role.toLowerCase()}</option>)}
      </select>
    </label>
    {canAssign ? <div className="flex flex-wrap items-end gap-2">
      <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assign matter
        <select value={selectedMatter} onChange={(event) => setSelectedMatter(event.target.value)} className="mt-2 block rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700">{matterIds.map((matterId) => <option key={matterId}>{matterId}</option>)}</select>
      </label>
      <button type="button" onClick={() => void assignMatter()} className="rounded-md bg-[#263c68] px-4 py-2.5 text-sm font-semibold text-white">Assign to selected user</button>
      {message ? <span className="text-xs text-emerald-700">{message}</span> : null}
    </div> : null}
  </div>;
}
