import { unstable_cache } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
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
  DonationHistoryItem,
  DonorProfile
} from "@/lib/types";

function includesSafe(value: string, query?: string) {
  if (!query) return true;
  return value.toLowerCase().includes(query.toLowerCase());
}

const getCachedHomeData = unstable_cache(
  async () => {
    const supabase = createPublicSupabaseClient();

    if (supabase) {
      const [
        { data: donors },
        { data: requests },
        { data: campaigns },
        { data: blogs },
        { count: totalUsers },
        { count: totalDonors },
        { count: activeRequests },
        { count: fulfilledRequests },
        { count: bloodBankCount },
        { count: blogCount },
        { count: campaignCount }
      ] = await Promise.all([
        supabase.from("donor_profiles").select("*").eq("is_verified", true).order("created_at", { ascending: false }).limit(3),
        supabase.from("blood_requests").select("*").in("status", ["Open", "In progress"]).order("created_at", { ascending: false }).limit(3),
        supabase.from("campaigns").select("*").order("event_date", { ascending: true }).limit(2),
        supabase.from("blogs").select("*").order("published_at", { ascending: false }).limit(3),
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("donor_profiles").select("*", { count: "exact", head: true }),
        supabase.from("blood_requests").select("*", { count: "exact", head: true }).in("status", ["Open", "In progress"]),
        supabase.from("blood_requests").select("*", { count: "exact", head: true }).eq("status", "Fulfilled"),
        supabase.from("blood_banks").select("*", { count: "exact", head: true }),
        supabase.from("blogs").select("*", { count: "exact", head: true }),
        supabase.from("campaigns").select("*", { count: "exact", head: true })
      ]);

      return {
        donors: (donors ?? []) as DonorProfile[],
        requests: (requests ?? []) as BloodRequest[],
        campaigns: (campaigns ?? []) as Campaign[],
        blogs: (blogs ?? []) as BlogPost[],
        stats: {
          totalUsers: totalUsers ?? 0,
          totalDonors: totalDonors ?? 0,
          activeRequests: activeRequests ?? 0,
          fulfilledRequests: fulfilledRequests ?? 0,
          bloodBankCount: bloodBankCount ?? 0,
          blogCount: blogCount ?? 0,
          campaignCount: campaignCount ?? 0
        } satisfies DashboardSummary
      };
    }

    return {
      donors: demoDonors.slice(0, 3),
      requests: demoRequests.slice(0, 3),
      campaigns: demoCampaigns.slice(0, 2),
      blogs: demoBlogs.slice(0, 3),
      stats: demoDashboardSummary
    };
  },
  ["home-data"],
  { revalidate: 300 }
);

export async function getHomeData() {
  return getCachedHomeData();
}

export async function getDonors(filters?: Record<string, string | undefined>) {
  const supabase = createPublicSupabaseClient();
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
  const supabase = createPublicSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("donor_profiles").select("*").eq("id", id).single();
    if (data) return data as DonorProfile;
  }
  return demoDonors.find((item) => item.id === id) ?? null;
}

export async function getBloodRequests(filters?: Record<string, string | undefined>) {
  const supabase = createPublicSupabaseClient();
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
  const supabase = createPublicSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blood_requests").select("*").eq("id", id).single();
    if (data) return data as BloodRequest;
  }
  return demoRequests.find((item) => item.id === id) ?? null;
}

export async function getBloodBanks(filters?: Record<string, string | undefined>) {
  const supabase = createPublicSupabaseClient();
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
  const supabase = createPublicSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });
    if (data) return data as BlogPost[];
  }
  return demoBlogs;
}

export async function getBlogBySlug(slug: string) {
  const supabase = createPublicSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blogs").select("*").eq("slug", slug).single();
    if (data) return data as BlogPost;
  }
  return demoBlogs.find((item) => item.slug === slug) ?? null;
}

export async function getCampaigns() {
  const supabase = createPublicSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("campaigns").select("*").order("event_date", { ascending: true });
    if (data) return data as Campaign[];
  }
  return demoCampaigns;
}

export async function getCampaignBySlug(slug: string) {
  const supabase = createPublicSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("campaigns").select("*").eq("slug", slug).single();
    if (data) return data as Campaign;
  }
  return demoCampaigns.find((item) => item.slug === slug) ?? null;
}

export async function getDonationHistory() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("donation_history").select("*").order("donated_at", { ascending: false });
    if (data) return data as DonationHistoryItem[];
    return [];
  }
  return demoDonationHistory;
}

export async function getCurrentUserDonorProfile(userId: string) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("donor_profiles").select("*").eq("user_id", userId).maybeSingle();
    return (data as DonorProfile | null) ?? null;
  }

  return demoDonors.find((item) => item.user_id === userId) ?? null;
}

export async function getCurrentUserRequests(userId: string) {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from("blood_requests")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });
    return (data ?? []) as BloodRequest[];
  }

  return demoRequests.filter((item) => item.created_by === userId);
}

export async function getDonationHistoryForUser(userId: string) {
  const donor = await getCurrentUserDonorProfile(userId);
  if (!donor) return [];

  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase
      .from("donation_history")
      .select("*")
      .eq("donor_id", donor.id)
      .order("donated_at", { ascending: false });
    return (data ?? []) as DonationHistoryItem[];
  }

  return demoDonationHistory.filter((item) => item.donor_id === donor.id);
}

export async function getReports() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    if (data) return data;
    return [];
  }
  return demoReports;
}

export async function getAdminSummary(): Promise<DashboardSummary> {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const [
      { count: totalUsers },
      { count: totalDonors },
      { count: activeRequests },
      { count: fulfilledRequests },
      { count: bloodBankCount },
      { count: blogCount },
      { count: campaignCount }
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("donor_profiles").select("*", { count: "exact", head: true }),
      supabase.from("blood_requests").select("*", { count: "exact", head: true }).in("status", ["Open", "In progress"]),
      supabase.from("blood_requests").select("*", { count: "exact", head: true }).eq("status", "Fulfilled"),
      supabase.from("blood_banks").select("*", { count: "exact", head: true }),
      supabase.from("blogs").select("*", { count: "exact", head: true }),
      supabase.from("campaigns").select("*", { count: "exact", head: true })
    ]);

    return {
      totalUsers: totalUsers ?? 0,
      totalDonors: totalDonors ?? 0,
      activeRequests: activeRequests ?? 0,
      fulfilledRequests: fulfilledRequests ?? 0,
      bloodBankCount: bloodBankCount ?? 0,
      blogCount: blogCount ?? 0,
      campaignCount: campaignCount ?? 0
    };
  }

  return demoDashboardSummary;
}

export async function getUsers() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (data) return data;
    return [];
  }
  return demoUsers;
}

export async function getAdminDonors() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("donor_profiles").select("*").order("created_at", { ascending: false });
    if (data) return data as DonorProfile[];
    return [];
  }

  return demoDonors;
}

export async function getAdminRequests() {
  const supabase = await createServerSupabaseClient();
  if (supabase) {
    const { data } = await supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
    if (data) return data as BloodRequest[];
    return [];
  }

  return demoRequests;
}
