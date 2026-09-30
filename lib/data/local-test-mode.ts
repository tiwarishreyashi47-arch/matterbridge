import type { MatterBundle } from "@/lib/types/matter";

// Keep the local PDF-ingestion test workspace free of the original demo matters.
// This only applies during local development; it never deletes or mutates Supabase data.
const originalSeedMatterIds = new Set(["MAT-001", "MAT-002", "MAT-003", "MAT-004", "MAT-005"]);

export function isLocalTestMode() {
  return process.env.NODE_ENV === "development" && process.env.MATTERBRIDGE_LOCAL_TEST_MODE !== "false";
}

export function isVisibleInLocalTestMode(matter: MatterBundle) {
  return !isLocalTestMode() || !originalSeedMatterIds.has(matter.matter.matter_id);
}
