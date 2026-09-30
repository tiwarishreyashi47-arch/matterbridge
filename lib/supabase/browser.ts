import { createClient } from "@supabase/supabase-js";
import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  return createClient(getSupabaseUrl(), getSupabasePublishableKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
