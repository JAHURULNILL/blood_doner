"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { donorProfileSchema, bloodRequestSchema, bloodBankSchema, blogSchema, campaignSchema, settingsSchema } from "@/lib/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function saveDonorProfileAction(values: Record<string, unknown> & { profilePhotoUrl?: string | null }) {
  const parsed = donorProfileSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়" };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: true, message: "ডেমো মোডে প্রোফাইল সেভ হয়েছে" };

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "লগইন প্রয়োজন" };

  const payload = {
    user_id: user.id,
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    blood_group: parsed.data.bloodGroup,
    gender: parsed.data.gender,
    date_of_birth: parsed.data.dateOfBirth || null,
    weight: parsed.data.weight || null,
    division: parsed.data.division,
    district: parsed.data.district,
    upazila: parsed.data.upazila,
    address: parsed.data.address,
    last_donated_at: parsed.data.lastDonatedAt || null,
    total_donations: parsed.data.totalDonations,
    emergency_contact: parsed.data.emergencyContact || null,
    bio: parsed.data.bio || null,
    can_donate_urgently: parsed.data.canDonateUrgently,
    availability_status: parsed.data.availabilityStatus,
    profile_photo_url: values.profilePhotoUrl ?? null
  };

  const { error } = await supabase.from("donor_profiles").upsert(payload, { onConflict: "user_id" });
  if (error) return { success: false, message: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/donors");
  return { success: true, message: "প্রোফাইল সফলভাবে আপডেট হয়েছে" };
}

export async function createBloodRequestAction(values: Record<string, unknown> & { proofImageUrl?: string | null }) {
  const parsed = bloodRequestSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়" };

  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: true, message: "ডেমো মোডে রক্তের অনুরোধ তৈরি হয়েছে" };

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "লগইন প্রয়োজন" };

  const { error } = await supabase.from("blood_requests").insert({
    created_by: user.id,
    patient_name: parsed.data.patientName,
    blood_group: parsed.data.bloodGroup,
    quantity_bags: parsed.data.quantityBags,
    required_date: parsed.data.requiredDate,
    hospital_name: parsed.data.hospitalName,
    division: parsed.data.division,
    district: parsed.data.district,
    upazila: parsed.data.upazila,
    address: parsed.data.address,
    contact_name: parsed.data.contactName,
    contact_phone: parsed.data.contactPhone,
    urgency: parsed.data.urgency,
    details: parsed.data.details || null,
    status: parsed.data.status,
    proof_image_url: values.proofImageUrl ?? null
  });

  if (error) return { success: false, message: error.message };

  revalidatePath("/requests");
  revalidatePath("/dashboard/requests");
  return { success: true, message: "রক্তের অনুরোধ সফলভাবে প্রকাশ হয়েছে" };
}

export async function respondToRequestAction(requestId: string, message?: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: true, message: "ডেমো মোডে সাড়া রেকর্ড হয়েছে" };

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "সাড়া দিতে লগইন প্রয়োজন" };

  const { data: donor } = await supabase.from("donor_profiles").select("id").eq("user_id", user.id).single();
  if (!donor) return { success: false, message: "প্রথমে donor profile সম্পূর্ণ করুন" };

  const { error } = await supabase.from("request_responses").upsert(
    {
      request_id: requestId,
      donor_id: donor.id,
      message: message ?? null,
      status: "interested"
    },
    { onConflict: "request_id,donor_id" }
  );

  if (error) return { success: false, message: error.message };
  revalidatePath(`/requests/${requestId}`);
  return { success: true, message: "আপনার আগ্রহ সফলভাবে পাঠানো হয়েছে" };
}

export async function saveSettingsAction(values: unknown) {
  const parsed = settingsSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: "সেটিংস সেভ করা যায়নি" };
  return { success: true, message: "সেটিংস আপডেট হয়েছে" };
}

export async function saveBloodBankAction(values: Record<string, unknown> & { id?: string }) {
  const parsed = bloodBankSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়" };
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: true, message: "ডেমো মোডে ব্লাড ব্যাংক সেভ হয়েছে" };
  const payload = { id: values.id ?? randomUUID(), ...parsed.data };
  const { error } = await supabase.from("blood_banks").upsert(payload);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/blood-banks");
  revalidatePath("/blood-banks");
  return { success: true, message: "ব্লাড ব্যাংক তথ্য সেভ হয়েছে" };
}

export async function saveBlogAction(values: Record<string, unknown> & { id?: string; coverImageUrl?: string | null }) {
  const parsed = blogSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়" };
  const supabase = await createServerSupabaseClient();
  const slug = slugify(parsed.data.title);
  if (!supabase) return { success: true, message: "ডেমো মোডে ব্লগ সেভ হয়েছে" };
  const { error } = await supabase.from("blogs").upsert({
    id: values.id ?? randomUUID(),
    slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    author_name: parsed.data.authorName,
    cover_image_url: values.coverImageUrl ?? null,
    featured: parsed.data.featured,
    published_at: new Date().toISOString()
  });
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/blogs");
  revalidatePath("/blog");
  return { success: true, message: "ব্লগ প্রকাশ হয়েছে" };
}

export async function saveCampaignAction(values: Record<string, unknown> & { id?: string; bannerImageUrl?: string | null }) {
  const parsed = campaignSchema.safeParse(values);
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "তথ্য সঠিক নয়" };
  const supabase = await createServerSupabaseClient();
  const slug = slugify(parsed.data.title);
  if (!supabase) return { success: true, message: "ডেমো মোডে ক্যাম্পেইন সেভ হয়েছে" };
  const { error } = await supabase.from("campaigns").upsert({
    id: values.id ?? randomUUID(),
    slug,
    title: parsed.data.title,
    summary: parsed.data.summary,
    description: parsed.data.description,
    location: parsed.data.location,
    event_date: parsed.data.eventDate,
    organizer: parsed.data.organizer,
    contact_info: parsed.data.contactInfo,
    banner_image_url: values.bannerImageUrl ?? null
  });
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/campaigns");
  revalidatePath("/campaigns");
  return { success: true, message: "ক্যাম্পেইন সেভ হয়েছে" };
}

export async function toggleRequestStatusAction(requestId: string, status: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: true, message: "ডেমো মোডে স্ট্যাটাস আপডেট হয়েছে" };
  const { error } = await supabase.from("blood_requests").update({ status }).eq("id", requestId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/requests");
  revalidatePath("/requests");
  return { success: true, message: "রিকোয়েস্ট স্ট্যাটাস আপডেট হয়েছে" };
}

export async function toggleDonorVerificationAction(donorId: string, isVerified: boolean) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return { success: true, message: "ডেমো মোডে ভেরিফিকেশন আপডেট হয়েছে" };
  const { error } = await supabase.from("donor_profiles").update({ is_verified: isVerified }).eq("id", donorId);
  if (error) return { success: false, message: error.message };
  revalidatePath("/admin/donors");
  revalidatePath("/donors");
  return { success: true, message: "ডোনার ভেরিফিকেশন আপডেট হয়েছে" };
}
