import { clsx, type ClassValue } from "clsx";
import { addMonths, format, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { DonorProfile } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string | null, fallback = "তথ্য নেই") {
  if (!date) return fallback;
  return format(new Date(date), "dd MMM yyyy");
}

export function formatRelative(date?: string | null, fallback = "তথ্য নেই") {
  if (!date) return fallback;
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getAvailabilityFromLastDonation(lastDonationDate?: string | null) {
  if (!lastDonationDate) {
    return { label: "সময় হয়েছে", tone: "success" as const, eligible: true };
  }

  const nextEligibleDate = addMonths(new Date(lastDonationDate), 3);
  const eligible = nextEligibleDate <= new Date();

  if (!eligible) {
    return { label: "সময় হয়নি", tone: "warning" as const, eligible: false };
  }

  return { label: "সময় হয়েছে", tone: "success" as const, eligible: true };
}

export function maskPhone(phone: string) {
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 4)}***${phone.slice(-3)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function calculateProfileCompletion(donor?: DonorProfile | null) {
  if (!donor) return 0;

  const completedFields = [
    donor.full_name,
    donor.email,
    donor.phone,
    donor.blood_group,
    donor.gender,
    donor.date_of_birth,
    donor.weight,
    donor.division,
    donor.district,
    donor.upazila,
    donor.address,
    donor.last_donated_at,
    donor.emergency_contact,
    donor.bio,
    donor.profile_photo_url
  ].filter(Boolean).length;

  return Math.min(Math.round((completedFields / 15) * 100), 100);
}
