import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getSupabaseSecretKey, getSupabaseUrl } from "@/lib/supabase/config";

export function createSupabaseServerClient() {
  return createClient(getSupabaseUrl(), getSupabaseSecretKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
