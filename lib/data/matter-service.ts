import { createMatterDataService } from "@/lib/data/database-service";
import { isVisibleInLocalTestMode } from "@/lib/data/local-test-mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const service = createMatterDataService(createSupabaseServerClient() as never);

export async function getMatter(matterId: string) {
  const matter = await service.getMatter(matterId);
  return matter && isVisibleInLocalTestMode(matter) ? matter : null;
}

export async function getAllMatters() {
  const matters = await service.getAllMatters();
  return matters.filter(isVisibleInLocalTestMode);
}

export async function getWorkstream(matterId: string, workstreamId: string) {
  return service.getWorkstream(matterId, workstreamId);
}
