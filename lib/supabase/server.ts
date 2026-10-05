import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/config";
import { ensureLocalDemoData, LocalClient } from "@/lib/local/local-store";

export function createSupabaseServerClient() {
  if (process.env.MATTERBRIDGE_STORAGE_MODE === "local") {
    ensureLocalDemoData();
    return new LocalClient() as never;
  }
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
