-- Safe demo seed data.
-- This file only inserts records that do not depend on auth.users existing first.
-- User, donor profile, and blood request records should be created from the app
-- after real users register through Supabase Auth.

insert into public.blood_banks (name, type, division, district, address, phone, verified, description)
values
  ('কোয়ান্টাম ব্লাড ল্যাব, ঢাকা', 'blood_bank', 'ঢাকা', 'ঢাকা', 'শান্তিনগর, ঢাকা', '09666777777', true, '২৪/৭ রক্ত সংগ্রহ ও সমন্বয়'),
  ('ইম্পেরিয়াল হাসপাতাল', 'hospital', 'চট্টগ্রাম', 'চট্টগ্রাম', 'জাকির হোসেন রোড', '09610101010', true, 'জরুরি ট্রান্সফিউশন সাপোর্ট'),
  ('সিলেট কমিউনিটি ক্লিনিক', 'clinic', 'সিলেট', 'সিলেট', 'আম্বরখানা, সিলেট', '0821712345', false, 'প্রাথমিক রক্ত সংযোগ ও রেফারাল সুবিধা')
on conflict do nothing;

insert into public.blogs (slug, title, excerpt, content, author_name, featured)
values
  (
    'keno-raktdan-guruttopurno',
    'কেন রক্তদান গুরুত্বপূর্ণ',
    'রক্তদানের সামাজিক ও চিকিৎসাগত গুরুত্ব।',
    'রক্তদান জীবন বাঁচায় এবং কমিউনিটিকে শক্তিশালী করে। নিয়মিত স্বেচ্ছায় রক্তদান নিরাপদ রক্ত সরবরাহে বড় ভূমিকা রাখে।',
    'ডা. সায়মা কবীর',
    true
  ),
  (
    'nirapod-raktdaner-niyom',
    'নিরাপদ রক্তদানের নিয়ম',
    'রক্ত দেওয়ার আগে ও পরে যা জানা প্রয়োজন।',
    'স্বাস্থ্য পরীক্ষা, পানি পান, বিশ্রাম এবং সঠিক ব্যবধান নিরাপদ রক্তদানের জন্য খুবই গুরুত্বপূর্ণ।',
    'রক্তসেতু সম্পাদকীয়',
    false
  )
on conflict (slug) do nothing;

insert into public.campaigns (slug, title, summary, description, location, event_date, organizer, contact_info)
values
  (
    'dhaka-spring-donation-drive',
    'ঢাকা স্প্রিং ডোনেশন ড্রাইভ',
    'একদিনের সমন্বিত donor drive',
    'ডোনার রেজিস্ট্রেশন, স্বাস্থ্য পরীক্ষা ও সচেতনতা সেশন থাকবে। আগ্রহীরা অগ্রিম নিবন্ধন করতে পারবেন।',
    'বাংলামোটর, ঢাকা',
    timezone('utc', now()) + interval '10 day',
    'রক্তসেতু কমিউনিটি',
    'campaigns@roktosetu.com'
  ),
  (
    'chattogram-campus-awareness',
    'চট্টগ্রাম ক্যাম্পাস সচেতনতা সপ্তাহ',
    'রক্তদান সচেতনতা ও donor enrollment',
    'বিশেষজ্ঞ ডাক্তার, সংগঠক ও স্বেচ্ছাসেবকদের নিয়ে সচেতনতামূলক আয়োজন এবং অন-স্পট donor enrollment থাকবে।',
    'চট্টগ্রাম বিশ্ববিদ্যালয়',
    timezone('utc', now()) + interval '18 day',
    'যুব স্বাস্থ্য নেটওয়ার্ক',
    '01811110000'
  )
on conflict (slug) do nothing;
