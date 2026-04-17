"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { changePasswordSchema, loginSchema, registerSchema } from "@/lib/schemas";
import { ensureUserRecord } from "@/lib/user-sync";

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "লগইন ব্যর্থ হয়েছে" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, message: "ডেমো মোডে লগইন সফল হয়েছে" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user) {
    const syncResult = await ensureUserRecord({
      user: data.user,
      fullName: data.user.user_metadata.full_name,
      phone: data.user.user_metadata.phone,
      organizationId: data.user.user_metadata.organization_id
    });

    if (!syncResult.success) {
      return { success: false, message: syncResult.message };
    }
  }

  revalidatePath("/");
  return { success: true, message: "সফলভাবে লগইন হয়েছে" };
}

export async function registerAction(values: unknown) {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, message: "ডেমো মোডে রেজিস্ট্রেশন সম্পন্ন হয়েছে" };
  }

  const organizationId = parsed.data.organizationId && parsed.data.organizationId !== "none" ? parsed.data.organizationId : null;

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
        organization_id: organizationId
      }
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user) {
    const syncResult = await ensureUserRecord({
      user: data.user,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      organizationId
    });

    if (!syncResult.success) {
      return { success: false, message: syncResult.message };
    }
  }

  revalidatePath("/");
  revalidatePath("/organizations");
  return { success: true, message: "রেজিস্ট্রেশন সফল হয়েছে। ইমেইল ভেরিফিকেশন চেক করুন।" };
}

export async function forgotPasswordAction(email: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, message: "ডেমো মোডে রিসেট নির্দেশনা পাঠানো হয়েছে" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`
  });

  if (error) return { success: false, message: error.message };
  return { success: true, message: "পাসওয়ার্ড রিসেটের নির্দেশনা ইমেইলে পাঠানো হয়েছে" };
}

export async function resetPasswordAction(password: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, message: "ডেমো মোডে পাসওয়ার্ড আপডেট হয়েছে" };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { success: false, message: error.message };
  return { success: true, message: "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে" };
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  return { success: true };
}

export async function changePasswordAction(values: unknown) {
  const parsed = changePasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "পাসওয়ার্ড আপডেট করা যায়নি" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, message: "ডেমো মোডে পাসওয়ার্ড আপডেট দেখানো হয়েছে" };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "পাসওয়ার্ড পরিবর্তনের জন্য লগইন করুন" };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard/settings");
  return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে" };
}
