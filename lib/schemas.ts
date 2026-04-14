import { z } from "zod";
import { bloodGroups } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে")
});

export const registerSchema = loginSchema
  .extend({
    fullName: z.string().min(3, "পূর্ণ নাম লিখুন"),
    phone: z.string().min(11, "সঠিক ফোন নম্বর লিখুন"),
    confirmPassword: z.string().min(6, "পাসওয়ার্ড মিলছে না")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ["confirmPassword"]
  });

export const donorProfileSchema = z.object({
  fullName: z.string().min(3, "পূর্ণ নাম লিখুন"),
  email: z.string().email("সঠিক ইমেইল লিখুন"),
  phone: z.string().min(11, "সঠিক ফোন নম্বর লিখুন"),
  bloodGroup: z.enum(bloodGroups),
  gender: z.enum(["male", "female", "other"]),
  dateOfBirth: z.string().optional(),
  weight: z.coerce.number().min(45, "সর্বনিম্ন ৪৫ কেজি হওয়া উচিত").optional(),
  division: z.string().min(2, "বিভাগ নির্বাচন করুন"),
  district: z.string().min(2, "জেলা নির্বাচন করুন"),
  upazila: z.string().min(2, "এলাকা লিখুন"),
  address: z.string().min(8, "পূর্ণ ঠিকানা লিখুন"),
  lastDonatedAt: z.string().optional(),
  totalDonations: z.coerce.number().min(0, "নেগেটিভ হতে পারবে না"),
  emergencyContact: z.string().min(11, "ইমার্জেন্সি নাম্বার লিখুন").optional(),
  bio: z.string().max(300, "সর্বোচ্চ ৩০০ অক্ষর").optional(),
  canDonateUrgently: z.boolean().default(false),
  availabilityStatus: z.enum(["available", "resting", "inactive"])
});

export const bloodRequestSchema = z.object({
  patientName: z.string().min(3, "রোগীর নাম লিখুন"),
  bloodGroup: z.enum(bloodGroups),
  quantityBags: z.coerce.number().min(1, "কমপক্ষে ১ ব্যাগ প্রয়োজন"),
  requiredDate: z.string().min(1, "তারিখ নির্বাচন করুন"),
  hospitalName: z.string().min(3, "হাসপাতালের নাম লিখুন"),
  division: z.string().min(2, "বিভাগ নির্বাচন করুন"),
  district: z.string().min(2, "জেলা লিখুন"),
  upazila: z.string().min(2, "এলাকা লিখুন"),
  address: z.string().min(8, "পূর্ণ ঠিকানা লিখুন"),
  contactName: z.string().min(3, "যোগাযোগ ব্যক্তির নাম লিখুন"),
  contactPhone: z.string().min(11, "ফোন নম্বর লিখুন"),
  urgency: z.enum(["Emergency", "Urgent", "Normal"]),
  details: z.string().max(500, "সর্বোচ্চ ৫০০ অক্ষর").optional(),
  status: z.enum(["Open", "In progress", "Fulfilled", "Cancelled"]).default("Open")
});

export const bloodBankSchema = z.object({
  name: z.string().min(2, "নাম লিখুন"),
  type: z.enum(["hospital", "blood_bank", "clinic"]),
  division: z.string().min(2, "বিভাগ লিখুন"),
  district: z.string().min(2, "জেলা লিখুন"),
  address: z.string().min(5, "ঠিকানা লিখুন"),
  phone: z.string().min(7, "ফোন লিখুন"),
  description: z.string().max(300).optional(),
  verified: z.boolean().default(false)
});

export const blogSchema = z.object({
  title: z.string().min(4, "শিরোনাম লিখুন"),
  excerpt: z.string().min(12, "সংক্ষিপ্ত বিবরণ লিখুন"),
  content: z.string().min(40, "বিস্তারিত লেখা লিখুন"),
  authorName: z.string().min(3, "লেখকের নাম লিখুন"),
  featured: z.boolean().default(false)
});

export const campaignSchema = z.object({
  title: z.string().min(4, "শিরোনাম লিখুন"),
  summary: z.string().min(12, "সংক্ষিপ্ত বিবরণ লিখুন"),
  description: z.string().min(30, "বিস্তারিত বর্ণনা লিখুন"),
  location: z.string().min(4, "লোকেশন লিখুন"),
  eventDate: z.string().min(1, "তারিখ নির্বাচন করুন"),
  organizer: z.string().min(3, "আয়োজকের নাম লিখুন"),
  contactInfo: z.string().min(5, "যোগাযোগ তথ্য লিখুন")
});

export const settingsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  publicPhone: z.boolean().default(false)
});
