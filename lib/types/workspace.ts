export type WorkspaceRole = "MANAGER" | "LAWYER" | "PARALEGAL";

export interface WorkspaceUser {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: WorkspaceRole;
  department: string;
}

export interface WorkspaceAssignment {
  access_id: string;
  matter_id: string;
  user_id: string;
  access_level: string;
  granted_date?: string;
  granted_by?: string;
}
