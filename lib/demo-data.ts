import type {
  BloodBank,
  BloodRequest,
  BlogPost,
  Campaign,
  DashboardSummary,
  DonationHistoryItem,
  DonorProfile,
  ReportItem,
  UserRecord
} from "@/lib/types";

export const demoUsers: UserRecord[] = [
  {
    id: "user-1",
    email: "tanjina@example.com",
    full_name: "তানজিনা রহমান",
    phone: "01711122334",
    role: "user",
    avatar_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    created_at: "2025-11-02T10:00:00.000Z"
  },
  {
    id: "admin-1",
    email: "admin@roktosetu.com",
    full_name: "মাহদী হাসান",
    phone: "01899112233",
    role: "admin",
    avatar_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    created_at: "2025-08-01T10:00:00.000Z"
  }
];

export const demoDonors: DonorProfile[] = [
  {
    id: "donor-1",
    user_id: "user-1",
    full_name: "তানজিনা রহমান",
    email: "tanjina@example.com",
    phone: "01711122334",
    blood_group: "A+",
    gender: "female",
    date_of_birth: "1998-04-11",
    weight: 56,
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "ধানমন্ডি",
    address: "রোড ৮/এ, ধানমন্ডি, ঢাকা",
    last_donated_at: "2025-11-25",
    total_donations: 7,
    availability_status: "available",
    emergency_contact: "01912345678",
    bio: "নিরাপদ ও সময়মতো রক্তদানে আগ্রহী। জরুরি প্রয়োজনে যোগাযোগ করতে পারেন।",
    can_donate_urgently: true,
    is_verified: true,
    profile_photo_url:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
    created_at: "2025-01-10T00:00:00.000Z",
    updated_at: "2026-03-15T00:00:00.000Z"
  },
  {
    id: "donor-2",
    user_id: "user-2",
    full_name: "আরিফুল ইসলাম",
    email: "arif@example.com",
    phone: "01834561234",
    blood_group: "O-",
    gender: "male",
    date_of_birth: "1996-07-21",
    weight: 68,
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    upazila: "পাঁচলাইশ",
    address: "পাঁচলাইশ আবাসিক, চট্টগ্রাম",
    last_donated_at: "2026-02-20",
    total_donations: 11,
    availability_status: "resting",
    emergency_contact: "01710223344",
    bio: "দুর্লভ রক্তের গ্রুপ হওয়ায় verified জরুরি অনুরোধে প্রাধান্য দিই।",
    can_donate_urgently: true,
    is_verified: true,
    profile_photo_url:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    created_at: "2025-02-10T00:00:00.000Z",
    updated_at: "2026-03-20T00:00:00.000Z"
  },
  {
    id: "donor-3",
    user_id: "user-3",
    full_name: "শামিমা আক্তার",
    email: "shamima@example.com",
    phone: "01677889900",
    blood_group: "B+",
    gender: "female",
    date_of_birth: "1999-11-30",
    weight: 53,
    division: "রাজশাহী",
    district: "রাজশাহী",
    upazila: "বোয়ালিয়া",
    address: "কোর্ট স্টেশন, রাজশাহী",
    last_donated_at: "2025-09-18",
    total_donations: 5,
    availability_status: "available",
    emergency_contact: "01544556677",
    bio: "শিক্ষার্থী ও স্বেচ্ছাসেবক। সন্ধ্যার পর যোগাযোগ করলে সুবিধা হয়।",
    can_donate_urgently: false,
    is_verified: false,
    profile_photo_url:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
    created_at: "2025-03-12T00:00:00.000Z",
    updated_at: "2026-02-25T00:00:00.000Z"
  }
];

export const demoRequests: BloodRequest[] = [
  {
    id: "request-1",
    created_by: "user-1",
    patient_name: "সুমাইয়া আক্তার",
    blood_group: "O-",
    quantity_bags: 2,
    required_date: "2026-04-16",
    hospital_name: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    division: "ঢাকা",
    district: "ঢাকা",
    upazila: "রমনা",
    address: "ইমার্জেন্সি ব্লক, ঢাকা মেডিকেল",
    contact_name: "সায়েম হোসেন",
    contact_phone: "01722334455",
    urgency: "Emergency",
    status: "Open",
    details: "অপারেশনের জন্য আগামীকাল সকাল ৯টার মধ্যে রক্ত প্রয়োজন।",
    created_at: "2026-04-14T07:00:00.000Z",
    responder_count: 3
  },
  {
    id: "request-2",
    created_by: "user-3",
    patient_name: "মো. করিম",
    blood_group: "A+",
    quantity_bags: 1,
    required_date: "2026-04-20",
    hospital_name: "চট্টগ্রাম মেডিকেল কলেজ",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    upazila: "পাঁচলাইশ",
    address: "সার্জারি ওয়ার্ড",
    contact_name: "রুবেল আহমেদ",
    contact_phone: "01844556677",
    urgency: "Urgent",
    status: "In progress",
    details: "একজন donor confirm করেছেন, আরও একজন standby donor প্রয়োজন।",
    created_at: "2026-04-13T11:30:00.000Z",
    responder_count: 1
  },
  {
    id: "request-3",
    created_by: "user-4",
    patient_name: "ফারহানা নাসরিন",
    blood_group: "B+",
    quantity_bags: 1,
    required_date: "2026-04-24",
    hospital_name: "রাজশাহী মেডিকেল",
    division: "রাজশাহী",
    district: "রাজশাহী",
    upazila: "বোয়ালিয়া",
    address: "গাইনি বিভাগ",
    contact_name: "মাহিন সরকার",
    contact_phone: "01799887766",
    urgency: "Normal",
    status: "Open",
    details: "ডাক্তারের পরামর্শ অনুযায়ী নির্ধারিত তারিখে রক্ত লাগবে।",
    created_at: "2026-04-12T09:45:00.000Z",
    responder_count: 0
  }
];

export const demoBloodBanks: BloodBank[] = [
  {
    id: "bank-1",
    name: "কোয়ান্টাম ব্লাড ল্যাব, ঢাকা",
    type: "blood_bank",
    division: "ঢাকা",
    district: "ঢাকা",
    address: "শান্তিনগর, ঢাকা",
    phone: "09666777777",
    verified: true,
    description: "২৪/৭ রক্ত সংগ্রহ, গ্রুপিং ও স্বেচ্ছা ডোনার সমন্বয়।"
  },
  {
    id: "bank-2",
    name: "ইম্পেরিয়াল হাসপাতাল",
    type: "hospital",
    division: "চট্টগ্রাম",
    district: "চট্টগ্রাম",
    address: "জাকির হোসেন রোড",
    phone: "09610101010",
    verified: true,
    description: "জরুরি ট্রান্সফিউশন সাপোর্টসহ আধুনিক হাসপাতাল।"
  },
  {
    id: "bank-3",
    name: "সিলেট কমিউনিটি ক্লিনিক",
    type: "clinic",
    division: "সিলেট",
    district: "সিলেট",
    address: "আম্বরখানা, সিলেট",
    phone: "0821712345",
    verified: false,
    description: "প্রাথমিক রক্ত সংযোগ ও রেফারাল সুবিধা।"
  }
];

export const demoBlogs: BlogPost[] = [
  {
    id: "blog-1",
    slug: "keno-raktdan-guruttopurno",
    title: "কেন রক্তদান গুরুত্বপূর্ণ",
    excerpt: "রক্তদানের সামাজিক, মানবিক ও চিকিৎসাগত গুরুত্ব নিয়ে সংক্ষিপ্ত আলোচনা।",
    content:
      "রক্তদান শুধু একজন রোগীর জীবন বাঁচায় না, এটি একটি দায়িত্বশীল সামাজিক চর্চা। নিরাপদ স্ক্রিনিং, সঠিক সময় নির্বাচন এবং স্বেচ্ছায় অংশগ্রহণ স্বাস্থ্যব্যবস্থাকে আরও শক্তিশালী করে।",
    cover_image_url:
      "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-04-10T10:00:00.000Z",
    author_name: "ডা. সায়মা কবীর",
    featured: true
  },
  {
    id: "blog-2",
    slug: "nirapod-raktdaner-niyom",
    title: "নিরাপদ রক্তদানের নিয়ম",
    excerpt: "রক্ত দেওয়ার আগে ও পরে কী বিষয়গুলো মাথায় রাখা জরুরি।",
    content:
      "স্বাস্থ্য পরীক্ষা, পর্যাপ্ত ঘুম, পানি পান এবং সঠিক ব্যবধানে রক্তদান করা নিরাপদ রক্তদানের মূল শর্ত।",
    cover_image_url:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-04-07T10:00:00.000Z",
    author_name: "রক্তসেতু সম্পাদকীয়"
  },
  {
    id: "blog-3",
    slug: "ke-rakto-dite-paren",
    title: "কে রক্ত দিতে পারেন",
    excerpt: "যোগ্যতা, ওজন, বয়স এবং ব্যবধানসহ গুরুত্বপূর্ণ নির্দেশনা।",
    content:
      "সাধারণত ১৮ থেকে ৬০ বছর বয়সী সুস্থ ব্যক্তি, নির্ধারিত ওজন ও অন্যান্য শর্ত পূরণ সাপেক্ষে রক্ত দিতে পারেন।",
    cover_image_url:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    published_at: "2026-04-03T10:00:00.000Z",
    author_name: "স্বাস্থ্য টিম"
  }
];

export const demoCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    slug: "dhaka-spring-donation-drive",
    title: "ঢাকা স্প্রিং ডোনেশন ড্রাইভ",
    summary: "কর্পোরেট ও কমিউনিটি ডোনারদের নিয়ে একদিনের সমন্বিত রক্তদান কর্মসূচি।",
    description:
      "সারাদিনব্যাপী ডোনার রেজিস্ট্রেশন, স্বাস্থ্য পরীক্ষা, রক্তগ্রুপিং এবং সচেতনতা সেশন থাকবে। আগ্রহীরা অগ্রিম নিবন্ধন করতে পারবেন।",
    location: "বাংলামোটর, ঢাকা",
    event_date: "2026-04-25T09:00:00.000Z",
    organizer: "রক্তসেতু কমিউনিটি",
    contact_info: "campaigns@roktosetu.com | 01710000000",
    banner_image_url:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    is_featured: true
  },
  {
    id: "campaign-2",
    slug: "chattogram-campus-awareness",
    title: "চট্টগ্রাম ক্যাম্পাস সচেতনতা সপ্তাহ",
    summary: "ছাত্র-ছাত্রীদের জন্য রক্তদান ও নিরাপদ ট্রান্সফিউশন বিষয়ে সচেতনতামূলক আয়োজন।",
    description:
      "বিশেষজ্ঞ ডাক্তার, সংগঠক ও স্বেচ্ছাসেবকদের নিয়ে প্যানেল সেশন এবং অন-স্পট donor enrollment থাকবে।",
    location: "চট্টগ্রাম বিশ্ববিদ্যালয়",
    event_date: "2026-05-03T10:00:00.000Z",
    organizer: "যুব স্বাস্থ্য নেটওয়ার্ক",
    contact_info: "01811110000"
  }
];

export const demoReports: ReportItem[] = [
  {
    id: "report-1",
    reporter_name: "সাব্বির",
    category: "ভুয়া তথ্য",
    subject: "একটি donor প্রোফাইলে ভুল ফোন নম্বর",
    status: "reviewing",
    created_at: "2026-04-12T09:00:00.000Z"
  },
  {
    id: "report-2",
    reporter_name: "তানভীর",
    category: "অপব্যবহার",
    subject: "একটি request বারবার repost করা হয়েছে",
    status: "open",
    created_at: "2026-04-14T06:15:00.000Z"
  }
];

export const demoDonationHistory: DonationHistoryItem[] = [
  {
    id: "history-1",
    donor_id: "donor-1",
    donated_at: "2025-11-25",
    hospital_name: "ঢাকা মেডিকেল কলেজ হাসপাতাল",
    recipient_note: "থ্যালাসেমিয়া রোগীর জন্য",
    units: 1
  },
  {
    id: "history-2",
    donor_id: "donor-1",
    donated_at: "2025-07-18",
    hospital_name: "স্কয়ার হাসপাতাল",
    recipient_note: "জরুরি অস্ত্রোপচার",
    units: 1
  }
];

export const demoDashboardSummary: DashboardSummary = {
  totalUsers: 8240,
  totalDonors: 2914,
  activeRequests: 39,
  fulfilledRequests: 187,
  bloodBankCount: 62,
  blogCount: 12,
  campaignCount: 8
};
