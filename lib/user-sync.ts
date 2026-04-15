import type { User } from "@supabase/supabase-js";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface EnsureUserRecordInput {
  user: User;
  fullName?: string | null;
  phone?: string | null;
}

export async function ensureUserRecord({ user, fullName, phone }: EnsureUserRecordInput) {
  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) return { success: false as const, message: "Server admin client unavailable" };

  const payload = {
    id: user.id,
    email: user.email ?? "",
    full_name: fullName ?? user.user_metadata.full_name ?? "নতুন ব্যবহারকারী",
    phone: phone ?? user.user_metadata.phone ?? "",
    role: (user.app_metadata.role as "user" | "admin") ?? "user",
    avatar_url: user.user_metadata.avatar_url ?? null
  };

  const { error } = await adminSupabase.from("users").upsert(payload, { onConflict: "id" });

  if (error) {
    return { success: false as const, message: error.message };
  }

  return { success: true as const };
}
