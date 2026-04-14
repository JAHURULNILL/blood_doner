import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isAfter, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

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
    return { label: "উপলভ্য", tone: "success" as const, eligible: true };
  }

  const eligibleDate = subDays(new Date(), 120);
  const blocked = isAfter(new Date(lastDonationDate), eligibleDate);

  if (blocked) {
    return { label: "বিশ্রামে", tone: "warning" as const, eligible: false };
  }

  return { label: "উপলভ্য", tone: "success" as const, eligible: true };
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
