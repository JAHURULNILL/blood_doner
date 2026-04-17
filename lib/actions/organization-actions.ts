"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { organizationSchema } from "@/lib/schemas";
import { slugify } from "@/lib/utils";

export async function createOrganizationAction(values: unknown) {
  const parsed = organizationSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "সংগঠন যুক্ত করা যায়নি" };
  }

  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) {
    return { success: false, message: "সংগঠন যুক্ত করার সার্ভার সংযোগ পাওয়া যায়নি" };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user }
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data: existing } = await adminSupabase.from("organizations").select("id").eq("slug", slug).maybeSingle();
    if (!existing) break;
    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }

  const payload = {
    name: parsed.data.name,
    slug,
    description: parsed.data.description,
    division: parsed.data.division,
    district: parsed.data.district,
    upazila: parsed.data.upazila,
    contact_phone: parsed.data.contactPhone,
    contact_email: parsed.data.contactEmail || null,
    created_by: user?.id ?? null
  };

  const { error } = await adminSupabase.from("organizations").insert(payload);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/register");
  revalidatePath("/organizations");
  return {
    success: true,
    message: "সংগঠন সফলভাবে যুক্ত হয়েছে",
    slug
  };
}
