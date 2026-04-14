"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/schemas";

export async function loginAction(values: unknown) {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "লগইন ব্যর্থ হয়েছে" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: true, message: "ডেমো মোডে লগইন সফল হয়েছে" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password
  });

  if (error) {
    return { success: false, message: error.message };
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

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone
      }
    }
  });

  if (error) {
    return { success: false, message: error.message };
  }

  if (data.user) {
    await supabase.from("users").upsert({
      id: data.user.id,
      email: parsed.data.email,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
      role: "user"
    });
  }

  revalidatePath("/");
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
