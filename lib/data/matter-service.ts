import matter001 from "@/data/matters/MAT-001.json";
import matter002 from "@/data/matters/MAT-002.json";
import type { MatterBundle } from "@/lib/types/matter";

const matters: Record<string, MatterBundle> = {
  "MAT-001": matter001 as MatterBundle,
  "MAT-002": matter002 as MatterBundle,
};

export function getMatter(matterId: string) {
  return matters[matterId] ?? null;
}

export function getAllMatters() {
  return Object.values(matters);
}

export function getWorkstream(matterId: string, workstreamId: string) {
  const matterData = getMatter(matterId);

  if (!matterData) {
    return null;
  }

  return (
    matterData.workstreams.find(
      (workstream) => workstream.workstream_id === workstreamId
    ) ?? null
  );
}
