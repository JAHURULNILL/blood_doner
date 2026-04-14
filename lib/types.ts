import type { bloodGroups, requestStatuses, urgencyLevels } from "@/lib/constants";

export type BloodGroup = (typeof bloodGroups)[number];
export type UrgencyLevel = (typeof urgencyLevels)[number];
export type RequestStatus = (typeof requestStatuses)[number];
export type UserRole = "user" | "admin";

export interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string | null;
  is_blocked?: boolean;
  created_at: string;
}

export interface DonorProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  blood_group: BloodGroup;
  gender: "male" | "female" | "other";
  date_of_birth?: string | null;
  weight?: number | null;
  division: string;
  district: string;
  upazila: string;
  address: string;
  last_donated_at?: string | null;
  total_donations: number;
  availability_status: "available" | "resting" | "inactive";
  emergency_contact?: string | null;
  bio?: string | null;
  can_donate_urgently: boolean;
  is_verified: boolean;
  profile_photo_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  created_by: string;
  patient_name: string;
  blood_group: BloodGroup;
  quantity_bags: number;
  required_date: string;
  hospital_name: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  details?: string | null;
  proof_image_url?: string | null;
  created_at: string;
  responder_count?: number;
}

export interface RequestResponse {
  id: string;
  request_id: string;
  donor_id: string;
  message?: string | null;
  status: "interested" | "contacted" | "helped";
  created_at: string;
}

export interface BloodBank {
  id: string;
  name: string;
  type: "hospital" | "blood_bank" | "clinic";
  division: string;
  district: string;
  address: string;
  phone: string;
  verified: boolean;
  description?: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url?: string | null;
  published_at: string;
  author_name: string;
  featured?: boolean;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  location: string;
  event_date: string;
  organizer: string;
  contact_info: string;
  banner_image_url?: string | null;
  is_featured?: boolean;
}

export interface ReportItem {
  id: string;
  reporter_name: string;
  category: string;
  subject: string;
  status: "open" | "reviewing" | "resolved";
  created_at: string;
}

export interface DonationHistoryItem {
  id: string;
  donor_id: string;
  donated_at: string;
  hospital_name: string;
  recipient_note?: string | null;
  units: number;
}

export interface DashboardSummary {
  totalUsers: number;
  totalDonors: number;
  activeRequests: number;
  fulfilledRequests: number;
  bloodBankCount: number;
  blogCount: number;
  campaignCount: number;
}
