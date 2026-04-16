import { Home, LayoutDashboard, ShieldCheck, UserRound, Users2 } from "lucide-react";

export const siteConfig = {
  name: "বেড়া রক্তদাতা ইউনিট",
  description:
    "প্রিমিয়াম, নির্ভরযোগ্য ও আধুনিক রক্তদাতা সংযোগ প্ল্যাটফর্ম। দ্রুত ডোনার খুঁজুন, রক্তের অনুরোধ প্রকাশ করুন এবং কমিউনিটিকে একসাথে রাখুন।",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://roktodaata.vercel.app",
  contactEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "",
  contactPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "",
  locationLabel: "বাংলাদেশভিত্তিক অনলাইন সমন্বয় প্ল্যাটফর্ম",
  brand: {
    top: "বেড়া",
    middle: "রক্তদাতা",
    bottom: "ইউনিট"
  }
};

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export const divisions = ["ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "বরিশাল", "সিলেট", "রংপুর", "ময়মনসিংহ"] as const;
export const urgencyLevels = ["Emergency", "Urgent", "Normal"] as const;
export const requestStatuses = ["Open", "In progress", "Fulfilled", "Cancelled"] as const;

export const publicNavItems = [
  { label: "রক্তদাতা খুঁজুন", href: "/donors" },
  { label: "রক্তের অনুরোধ", href: "/requests" },
  { label: "ব্লাড ব্যাংক", href: "/blood-banks" },
  { label: "ক্যাম্পেইন", href: "/campaigns" },
  { label: "যোগাযোগ", href: "/contact" }
];

export const dashboardNavItems = [
  { label: "ড্যাশবোর্ড", href: "/dashboard", icon: LayoutDashboard },
  { label: "আমার প্রোফাইল", href: "/dashboard/profile", icon: UserRound },
  { label: "রক্তের অনুরোধ", href: "/dashboard/requests", icon: Home },
  { label: "ডোনেশন ইতিহাস", href: "/dashboard/donations", icon: Users2 },
  { label: "সেটিংস", href: "/dashboard/settings", icon: ShieldCheck }
];

export const adminNavItems = [
  { label: "অ্যাডমিন ড্যাশবোর্ড", href: "/admin", icon: LayoutDashboard },
  { label: "ডোনার ম্যানেজ", href: "/admin/donors", icon: Users2 },
  { label: "রিকোয়েস্ট ম্যানেজ", href: "/admin/requests", icon: Home },
  { label: "ব্লাড ব্যাংক", href: "/admin/blood-banks", icon: ShieldCheck },
  { label: "ক্যাম্পেইন", href: "/admin/campaigns", icon: ShieldCheck },
  { label: "রিপোর্ট", href: "/admin/reports", icon: ShieldCheck },
  { label: "ইউজার", href: "/admin/users", icon: UserRound }
];

export const dashboardQuickActions = [
  { label: "প্রোফাইল আপডেট", href: "/dashboard/profile/edit" },
  { label: "নতুন রক্তের অনুরোধ", href: "/requests?create=1" },
  { label: "ডোনার সার্চ", href: "/donors" }
];
