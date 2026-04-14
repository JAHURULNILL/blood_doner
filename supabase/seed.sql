-- Demo seed data. Replace the auth user UUIDs with real Supabase Auth user ids if needed.

insert into public.users (id, email, full_name, phone, role)
values
  ('11111111-1111-1111-1111-111111111111', 'admin@roktosetu.com', 'মাহদী হাসান', '01899112233', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'tanjina@example.com', 'তানজিনা রহমান', '01711122334', 'user')
on conflict (id) do nothing;

insert into public.donor_profiles (
  id, user_id, full_name, email, phone, blood_group, gender, date_of_birth, weight, division, district, upazila,
  address, last_donated_at, total_donations, availability_status, emergency_contact, bio, can_donate_urgently, is_verified
)
values
  (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'তানজিনা রহমান',
    'tanjina@example.com',
    '01711122334',
    'A+',
    'female',
    '1998-04-11',
    56,
    'ঢাকা',
    'ঢাকা',
    'ধানমন্ডি',
    'রোড ৮/এ, ধানমন্ডি, ঢাকা',
    '2025-11-25',
    7,
    'available',
    '01912345678',
    'নিরাপদ ও সময়মতো রক্তদানে আগ্রহী।',
    true,
    true
  )
on conflict (id) do nothing;

insert into public.blood_requests (
  id, created_by, patient_name, blood_group, quantity_bags, required_date, hospital_name, division, district, upazila,
  address, contact_name, contact_phone, urgency, status, details
)
values
  (
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    'সুমাইয়া আক্তার',
    'O-',
    2,
    current_date + interval '2 day',
    'ঢাকা মেডিকেল কলেজ হাসপাতাল',
    'ঢাকা',
    'ঢাকা',
    'রমনা',
    'ইমার্জেন্সি ব্লক',
    'সায়েম হোসেন',
    '01722334455',
    'Emergency',
    'Open',
    'অপারেশনের জন্য দ্রুত রক্ত প্রয়োজন।'
  )
on conflict (id) do nothing;

insert into public.blood_banks (name, type, division, district, address, phone, verified, description)
values
  ('কোয়ান্টাম ব্লাড ল্যাব, ঢাকা', 'blood_bank', 'ঢাকা', 'ঢাকা', 'শান্তিনগর, ঢাকা', '09666777777', true, '২৪/৭ রক্ত সংগ্রহ ও সমন্বয়'),
  ('ইম্পেরিয়াল হাসপাতাল', 'hospital', 'চট্টগ্রাম', 'চট্টগ্রাম', 'জাকির হোসেন রোড', '09610101010', true, 'জরুরি ট্রান্সফিউশন সাপোর্ট')
on conflict do nothing;

insert into public.blogs (slug, title, excerpt, content, author_name, featured)
values
  ('keno-raktdan-guruttopurno', 'কেন রক্তদান গুরুত্বপূর্ণ', 'রক্তদানের সামাজিক ও চিকিৎসাগত গুরুত্ব।', 'রক্তদান জীবন বাঁচায় এবং কমিউনিটিকে শক্তিশালী করে।', 'ডা. সায়মা কবীর', true),
  ('nirapod-raktdaner-niyom', 'নিরাপদ রক্তদানের নিয়ম', 'রক্ত দেওয়ার আগে ও পরে যা জানা প্রয়োজন।', 'স্বাস্থ্য পরীক্ষা, পানি পান, বিশ্রাম এবং সঠিক ব্যবধান জরুরি।', 'রক্তসেতু সম্পাদকীয়', false)
on conflict (slug) do nothing;

insert into public.campaigns (slug, title, summary, description, location, event_date, organizer, contact_info)
values
  (
    'dhaka-spring-donation-drive',
    'ঢাকা স্প্রিং ডোনেশন ড্রাইভ',
    'একদিনের সমন্বিত donor drive',
    'ডোনার রেজিস্ট্রেশন, স্বাস্থ্য পরীক্ষা ও সচেতনতা সেশন থাকবে।',
    'বাংলামোটর, ঢাকা',
    timezone('utc', now()) + interval '10 day',
    'রক্তসেতু কমিউনিটি',
    'campaigns@roktosetu.com'
  )
on conflict (slug) do nothing;
