import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  demoBloodBanks,
  demoBlogs,
  demoCampaigns,
  demoDashboardSummary,
  demoDonationHistory,
  demoDonors,
  demoReports,
  demoRequests,
  demoUsers
} from "@/lib/demo-data";
import type {
  BloodBank,
  BloodRequest,
  BlogPost,
  Campaign,
  DashboardSummary,
  DonorProfile
} from "@/lib/types";

function includesSafe(value: string, query?: string) {
  if (!query) return true;
  return value.toLowerCase().includes(query.toLowerCase());
}

export async function getHomeData() {
  return {
    donors: demoDonors.slice(0, 3),
    requests: demoRequests.slice(0, 3),
    campaigns: demoCampaigns.slice(0, 2),
    blogs: demoBlogs.slice(0, 3),
    stats: demoDashboardSummary
  };
}

export async function getDonors(filters?: Record<string, string | undefined>) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("donor_profiles").select("*").order("created_at", { ascending: false });
    if (filters?.bloodGroup) query = query.eq("blood_group", filters.bloodGroup);
    if (filters?.division) query = query.ilike("division", `%${filters.division}%`);
    if (filters?.district) query = query.ilike("district", `%${filters.district}%`);
    if (filters?.upazila) query = query.ilike("upazila", `%${filters.upazila}%`);
    if (filters?.availability === "true") query = query.eq("availability_status", "available");
    if (filters?.verified === "true") query = query.eq("is_verified", true);
    const { data } = await query;
    if (data) return data as DonorProfile[];
  }

  return demoDonors.filter((donor) => {
    if (filters?.bloodGroup && donor.blood_group !== filters.bloodGroup) return false;
    if (filters?.division && !includesSafe(donor.division, filters.division)) return false;
    if (filters?.district && !includesSafe(donor.district, filters.district)) return false;
    if (filters?.upazila && !includesSafe(donor.upazila, filters.upazila)) return false;
    if (filters?.availability === "true" && donor.availability_status !== "available") return false;
    if (filters?.verified === "true" && !donor.is_verified) return false;
    return true;
  });
}

export async function getDonorById(id: string) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("donor_profiles").select("*").eq("id", id).single();
    if (data) return data as DonorProfile;
  }
  return demoDonors.find((item) => item.id === id) ?? null;
}

export async function getBloodRequests(filters?: Record<string, string | undefined>) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
    if (filters?.bloodGroup) query = query.eq("blood_group", filters.bloodGroup);
    if (filters?.division) query = query.ilike("division", `%${filters.division}%`);
    if (filters?.district) query = query.ilike("district", `%${filters.district}%`);
    if (filters?.urgency) query = query.eq("urgency", filters.urgency);
    if (filters?.status) query = query.eq("status", filters.status);
    const { data } = await query;
    if (data) return data as BloodRequest[];
  }

  return demoRequests.filter((request) => {
    if (filters?.bloodGroup && request.blood_group !== filters.bloodGroup) return false;
    if (filters?.division && !includesSafe(request.division, filters.division)) return false;
    if (filters?.district && !includesSafe(request.district, filters.district)) return false;
    if (filters?.urgency && request.urgency !== filters.urgency) return false;
    if (filters?.status && request.status !== filters.status) return false;
    return true;
  });
}

export async function getRequestById(id: string) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blood_requests").select("*").eq("id", id).single();
    if (data) return data as BloodRequest;
  }
  return demoRequests.find((item) => item.id === id) ?? null;
}

export async function getBloodBanks(filters?: Record<string, string | undefined>) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    let query = supabase.from("blood_banks").select("*").order("name");
    if (filters?.division) query = query.ilike("division", `%${filters.division}%`);
    if (filters?.district) query = query.ilike("district", `%${filters.district}%`);
    if (filters?.name) query = query.ilike("name", `%${filters.name}%`);
    if (filters?.type) query = query.eq("type", filters.type);
    if (filters?.verified === "true") query = query.eq("verified", true);
    const { data } = await query;
    if (data) return data as BloodBank[];
  }

  return demoBloodBanks.filter((item) => {
    if (filters?.division && !includesSafe(item.division, filters.division)) return false;
    if (filters?.district && !includesSafe(item.district, filters.district)) return false;
    if (filters?.name && !includesSafe(item.name, filters.name)) return false;
    if (filters?.type && item.type !== filters.type) return false;
    if (filters?.verified === "true" && !item.verified) return false;
    return true;
  });
}

export async function getBlogs() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });
    if (data) return data as BlogPost[];
  }
  return demoBlogs;
}

export async function getBlogBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blogs").select("*").eq("slug", slug).single();
    if (data) return data as BlogPost;
  }
  return demoBlogs.find((item) => item.slug === slug) ?? null;
}

export async function getCampaigns() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("campaigns").select("*").order("event_date", { ascending: true });
    if (data) return data as Campaign[];
  }
  return demoCampaigns;
}

export async function getCampaignBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("campaigns").select("*").eq("slug", slug).single();
    if (data) return data as Campaign;
  }
  return demoCampaigns.find((item) => item.slug === slug) ?? null;
}

export async function getDonationHistory() {
  return demoDonationHistory;
}

export async function getReports() {
  return demoReports;
}

export async function getAdminSummary(): Promise<DashboardSummary> {
  return demoDashboardSummary;
}

export async function getUsers() {
  return demoUsers;
}
