import { unstable_noStore as noStore } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getAvailabilityFromLastDonation } from "@/lib/utils";
import type {
  BloodBank,
  BloodRequest,
  BlogPost,
  Campaign,
  DashboardSummary,
  DonationHistoryItem,
  DonorProfile,
  Organization,
  UserRecord
} from "@/lib/types";

const emptySummary: DashboardSummary = {
  totalUsers: 0,
  totalDonors: 0,
  activeRequests: 0,
  fulfilledRequests: 0,
  bloodBankCount: 0,
  blogCount: 0,
  campaignCount: 0
};

export async function getHomeData() {
  noStore();

  const supabase = createPublicSupabaseClient();
  const adminSupabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      donors: [] as DonorProfile[],
      requests: [] as BloodRequest[],
      campaigns: [] as Campaign[],
      blogs: [] as BlogPost[],
      stats: emptySummary
    };
  }

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
    supabase.from("donor_profiles").select("*").eq("is_verified", true).order("updated_at", { ascending: false }).limit(3),
    supabase.from("blood_requests").select("*").in("status", ["Open", "In progress"]).order("created_at", { ascending: false }).limit(3),
    supabase.from("campaigns").select("*").order("event_date", { ascending: true }).limit(2),
    supabase.from("blogs").select("*").order("published_at", { ascending: false }).limit(3),
    (adminSupabase ?? supabase).from("users").select("*", { count: "exact", head: true }),
    (adminSupabase ?? supabase).from("donor_profiles").select("*", { count: "exact", head: true }),
    (adminSupabase ?? supabase).from("blood_requests").select("*", { count: "exact", head: true }).in("status", ["Open", "In progress"]),
    (adminSupabase ?? supabase).from("blood_requests").select("*", { count: "exact", head: true }).eq("status", "Fulfilled"),
    (adminSupabase ?? supabase).from("blood_banks").select("*", { count: "exact", head: true }),
    (adminSupabase ?? supabase).from("blogs").select("*", { count: "exact", head: true }),
    (adminSupabase ?? supabase).from("campaigns").select("*", { count: "exact", head: true })
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

export async function getDonors(filters?: Record<string, string | undefined>) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  let query = supabase.from("donor_profiles").select("*").order("updated_at", { ascending: false });
  if (filters?.bloodGroup) query = query.eq("blood_group", filters.bloodGroup);
  if (filters?.division) query = query.ilike("division", `%${filters.division}%`);
  if (filters?.district) query = query.ilike("district", `%${filters.district}%`);
  if (filters?.upazila) query = query.ilike("upazila", `%${filters.upazila}%`);
  if (filters?.verified === "true") query = query.eq("is_verified", true);
  const { data } = await query;

  let donors = (data ?? []) as DonorProfile[];

  if (filters?.availability === "true") {
    donors = donors.filter((donor) => getAvailabilityFromLastDonation(donor.last_donated_at).eligible);
  }

  return donors;
}

export async function getDonorById(id: string) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("donor_profiles").select("*").eq("id", id).maybeSingle();
  return (data as DonorProfile | null) ?? null;
}

export async function getBloodRequests(filters?: Record<string, string | undefined>) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  let query = supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
  if (filters?.bloodGroup) query = query.eq("blood_group", filters.bloodGroup);
  if (filters?.division) query = query.ilike("division", `%${filters.division}%`);
  if (filters?.district) query = query.ilike("district", `%${filters.district}%`);
  if (filters?.urgency) query = query.eq("urgency", filters.urgency);
  if (filters?.status) query = query.eq("status", filters.status);
  const { data } = await query;
  return (data ?? []) as BloodRequest[];
}

export async function getRequestById(id: string) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("blood_requests").select("*").eq("id", id).maybeSingle();
  return (data as BloodRequest | null) ?? null;
}

export async function getBloodBanks(filters?: Record<string, string | undefined>) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  let query = supabase.from("blood_banks").select("*").order("name");
  if (filters?.division) query = query.ilike("division", `%${filters.division}%`);
  if (filters?.district) query = query.ilike("district", `%${filters.district}%`);
  if (filters?.name) query = query.ilike("name", `%${filters.name}%`);
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.verified === "true") query = query.eq("verified", true);
  const { data } = await query;
  return (data ?? []) as BloodBank[];
}

export async function getBlogs() {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("blogs").select("*").order("published_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}

export async function getBlogBySlug(slug: string) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("blogs").select("*").eq("slug", slug).maybeSingle();
  return (data as BlogPost | null) ?? null;
}

export async function getCampaigns() {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("campaigns").select("*").order("event_date", { ascending: true });
  return (data ?? []) as Campaign[];
}

export async function getCampaignBySlug(slug: string) {
  noStore();

  const supabase = createPublicSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("campaigns").select("*").eq("slug", slug).maybeSingle();
  return (data as Campaign | null) ?? null;
}

export async function getOrganizations() {
  noStore();

  const supabase = createPublicSupabaseClient();
  const adminSupabase = createAdminSupabaseClient();
  const db = adminSupabase ?? supabase;

  if (!db) return [] as Organization[];

  const { data: organizations } = await db.from("organizations").select("*").order("name");
  const { data: users } = await db.from("users").select("id, organization_id");

  const counts = new Map<string, number>();
  for (const user of users ?? []) {
    const organizationId = user.organization_id as string | null;
    if (!organizationId) continue;
    counts.set(organizationId, (counts.get(organizationId) ?? 0) + 1);
  }

  return ((organizations ?? []) as Organization[]).map((organization) => ({
    ...organization,
    member_count: counts.get(organization.id) ?? 0
  }));
}

export async function getOrganizationBySlug(slug: string) {
  noStore();

  const supabase = createPublicSupabaseClient();
  const adminSupabase = createAdminSupabaseClient();
  const db = adminSupabase ?? supabase;

  if (!db) return null;

  const { data } = await db.from("organizations").select("*").eq("slug", slug).maybeSingle();
  return (data as Organization | null) ?? null;
}

export async function getOrganizationMembers(organizationId: string) {
  noStore();

  const adminSupabase = createAdminSupabaseClient();
  if (!adminSupabase) return [] as Array<UserRecord & { donor_profile?: DonorProfile | null }>;

  const { data: users } = await adminSupabase
    .from("users")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  const memberUsers = (users ?? []) as UserRecord[];
  if (!memberUsers.length) return [];

  const { data: donorProfiles } = await adminSupabase
    .from("donor_profiles")
    .select("*")
    .in(
      "user_id",
      memberUsers.map((user) => user.id)
    );

  const donorMap = new Map<string, DonorProfile>();
  for (const donor of (donorProfiles ?? []) as DonorProfile[]) {
    donorMap.set(donor.user_id, donor);
  }

  return memberUsers.map((user) => ({
    ...user,
    donor_profile: donorMap.get(user.id) ?? null
  }));
}

export async function getUserOrganization(userId: string) {
  noStore();

  const adminSupabase = createAdminSupabaseClient();
  const supabase = await createServerSupabaseClient();
  const db = adminSupabase ?? supabase;

  if (!db) return null;

  const { data: user } = await db.from("users").select("organization_id").eq("id", userId).maybeSingle();
  const organizationId = user?.organization_id as string | null | undefined;

  if (!organizationId) return null;

  const { data: organization } = await db.from("organizations").select("*").eq("id", organizationId).maybeSingle();
  return (organization as Organization | null) ?? null;
}

export async function getDonationHistory() {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("donation_history").select("*").order("donated_at", { ascending: false });
  return (data ?? []) as DonationHistoryItem[];
}

export async function getCurrentUserDonorProfile(userId: string) {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase.from("donor_profiles").select("*").eq("user_id", userId).maybeSingle();
  return (data as DonorProfile | null) ?? null;
}

export async function getCurrentUserRequests(userId: string) {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("blood_requests").select("*").eq("created_by", userId).order("created_at", { ascending: false });
  return (data ?? []) as BloodRequest[];
}

export async function getDonationHistoryForUser(userId: string) {
  noStore();

  const donor = await getCurrentUserDonorProfile(userId);
  if (!donor) return [];

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("donation_history").select("*").eq("donor_id", donor.id).order("donated_at", { ascending: false });
  return (data ?? []) as DonationHistoryItem[];
}

export async function getReports() {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminSummary(): Promise<DashboardSummary> {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return emptySummary;

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

export async function getUsers() {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminDonors() {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("donor_profiles").select("*").order("updated_at", { ascending: false });
  return (data ?? []) as DonorProfile[];
}

export async function getAdminRequests() {
  noStore();

  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data } = await supabase.from("blood_requests").select("*").order("created_at", { ascending: false });
  return (data ?? []) as BloodRequest[];
}
