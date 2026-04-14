import { createClient } from "@supabase/supabase-js";
import { supabaseServiceRole, supabaseUrl } from "@/lib/supabase/env";

export function createAdminSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRole) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
