import { redirect } from "next/navigation";
import type { UserRecord } from "@/lib/types";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ensureUserRecord } from "@/lib/user-sync";

export async function getCurrentUser(): Promise<UserRecord | null> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

  if (!data) {
    await ensureUserRecord({
      user,
      fullName: user.user_metadata.full_name,
      phone: user.user_metadata.phone
    });

    const { data: syncedData } = await supabase.from("users").select("*").eq("id", user.id).maybeSingle();

    if (syncedData) {
      return syncedData;
    }
  }

  return (
    data ?? {
      id: user.id,
      email: user.email ?? "",
      full_name: user.user_metadata.full_name ?? "নতুন ব্যবহারকারী",
      phone: user.user_metadata.phone ?? "",
      role: (user.app_metadata.role as "user" | "admin") ?? "user",
      avatar_url: user.user_metadata.avatar_url ?? null,
      created_at: user.created_at ?? new Date().toISOString()
    }
  );
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    redirect("/login");
  }
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}
