import type { MatterBundle } from "@/lib/types/matter";

export type MatterAccessRecord = {
  access_id: string;
  matter_id: string;
  user_id: string;
  access_level: string;
  granted_date?: string;
  user?: {
    user_id: string;
    user_name: string;
    user_email?: string;
    user_role?: string;
    department?: string;
  };
};

export function getExternalCounselAccess(matterData: MatterBundle) {
  const accessRecords = (matterData.access ?? []) as MatterAccessRecord[];

  return (
    accessRecords.find(
      (access) => access.user?.user_role === "EXTERNAL_COUNSEL"
    ) ?? null
  );
}
