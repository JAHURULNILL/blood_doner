create extension if not exists "pgcrypto";

create type public.user_role as enum ('user', 'admin');
create type public.blood_group as enum ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
create type public.donor_availability as enum ('available', 'resting', 'inactive');
create type public.urgency_level as enum ('Emergency', 'Urgent', 'Normal');
create type public.request_status as enum ('Open', 'In progress', 'Fulfilled', 'Cancelled');
create type public.request_response_status as enum ('interested', 'contacted', 'helped');
create type public.bank_type as enum ('hospital', 'blood_bank', 'clinic');
create type public.report_status as enum ('open', 'reviewing', 'resolved');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  phone text,
  role public.user_role not null default 'user',
  avatar_url text,
  is_blocked boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.donor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  blood_group public.blood_group not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  date_of_birth date,
  weight numeric(5,2),
  division text not null,
  district text not null,
  upazila text not null,
  address text not null,
  last_donated_at date,
  total_donations integer not null default 0 check (total_donations >= 0),
  availability_status public.donor_availability not null default 'available',
  emergency_contact text,
  bio text,
  can_donate_urgently boolean not null default false,
  is_verified boolean not null default false,
  profile_photo_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blood_requests (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.users(id) on delete cascade,
  patient_name text not null,
  blood_group public.blood_group not null,
  quantity_bags integer not null check (quantity_bags > 0),
  required_date date not null,
  hospital_name text not null,
  division text not null,
  district text not null,
  upazila text not null,
  address text not null,
  contact_name text not null,
  contact_phone text not null,
  urgency public.urgency_level not null default 'Normal',
  status public.request_status not null default 'Open',
  details text,
  proof_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.request_responses (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.blood_requests(id) on delete cascade,
  donor_id uuid not null references public.donor_profiles(id) on delete cascade,
  message text,
  status public.request_response_status not null default 'interested',
  created_at timestamptz not null default timezone('utc', now()),
  unique (request_id, donor_id)
);

create table if not exists public.blood_banks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type public.bank_type not null,
  division text not null,
  district text not null,
  address text not null,
  phone text not null,
  verified boolean not null default false,
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  cover_image_url text,
  author_name text not null,
  featured boolean not null default false,
  published_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text not null,
  location text not null,
  event_date timestamptz not null,
  organizer text not null,
  contact_info text not null,
  banner_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id) on delete set null,
  reporter_name text not null,
  category text not null,
  subject text not null,
  details text,
  status public.report_status not null default 'open',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.donation_history (
  id uuid primary key default gen_random_uuid(),
  donor_id uuid not null references public.donor_profiles(id) on delete cascade,
  donated_at date not null,
  hospital_name text not null,
  recipient_note text,
  units integer not null default 1 check (units > 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.users(id) on delete cascade,
  action_type text not null,
  target_table text not null,
  target_id uuid,
  action_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists donor_profiles_search_idx on public.donor_profiles (blood_group, division, district, upazila);
create index if not exists donor_profiles_verified_idx on public.donor_profiles (is_verified, availability_status);
create index if not exists blood_requests_search_idx on public.blood_requests (blood_group, division, district, urgency, status);
create index if not exists blood_requests_required_date_idx on public.blood_requests (required_date desc);
create index if not exists request_responses_request_idx on public.request_responses (request_id, status);
create index if not exists blood_banks_search_idx on public.blood_banks (division, district, type, verified);
create index if not exists blogs_slug_idx on public.blogs (slug);
create index if not exists campaigns_slug_idx on public.campaigns (slug);
create index if not exists reports_status_idx on public.reports (status, created_at desc);
create index if not exists donation_history_donor_idx on public.donation_history (donor_id, donated_at desc);

create trigger set_users_updated_at before update on public.users for each row execute function public.set_updated_at();
create trigger set_donor_profiles_updated_at before update on public.donor_profiles for each row execute function public.set_updated_at();
create trigger set_blood_requests_updated_at before update on public.blood_requests for each row execute function public.set_updated_at();
create trigger set_blood_banks_updated_at before update on public.blood_banks for each row execute function public.set_updated_at();
create trigger set_blogs_updated_at before update on public.blogs for each row execute function public.set_updated_at();
create trigger set_campaigns_updated_at before update on public.campaigns for each row execute function public.set_updated_at();
create trigger set_reports_updated_at before update on public.reports for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone, role, avatar_url)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'নতুন ব্যবহারকারী'),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_app_meta_data ->> 'role')::public.user_role, 'user'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      phone = excluded.phone,
      avatar_url = excluded.avatar_url,
      updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.users enable row level security;
alter table public.donor_profiles enable row level security;
alter table public.blood_requests enable row level security;
alter table public.request_responses enable row level security;
alter table public.blood_banks enable row level security;
alter table public.blogs enable row level security;
alter table public.campaigns enable row level security;
alter table public.reports enable row level security;
alter table public.donation_history enable row level security;
alter table public.admin_logs enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where id = uid and role = 'admin' and coalesce(is_blocked, false) = false
  );
$$;

create policy "users can read self" on public.users
for select using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "users can update self" on public.users
for update using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "admins can insert users" on public.users
for insert with check (public.is_admin(auth.uid()));

create policy "public can read donors" on public.donor_profiles
for select using (true);

create policy "owner or admin can manage donor profiles" on public.donor_profiles
for all using (auth.uid() = user_id or public.is_admin(auth.uid()))
with check (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "public can read blood requests" on public.blood_requests
for select using (true);

create policy "owner or admin can manage blood requests" on public.blood_requests
for all using (auth.uid() = created_by or public.is_admin(auth.uid()))
with check (auth.uid() = created_by or public.is_admin(auth.uid()));

create policy "authenticated donors can respond" on public.request_responses
for insert with check (auth.uid() is not null);

create policy "request responses read for requester, donor or admin" on public.request_responses
for select using (
  public.is_admin(auth.uid())
  or exists (select 1 from public.donor_profiles dp where dp.id = donor_id and dp.user_id = auth.uid())
  or exists (select 1 from public.blood_requests br where br.id = request_id and br.created_by = auth.uid())
);

create policy "admins manage blood banks" on public.blood_banks
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read blood banks" on public.blood_banks
for select using (true);

create policy "public read blogs" on public.blogs
for select using (true);

create policy "admins manage blogs" on public.blogs
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "public read campaigns" on public.campaigns
for select using (true);

create policy "admins manage campaigns" on public.campaigns
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "authenticated users create reports" on public.reports
for insert with check (auth.uid() is not null);

create policy "admins manage reports" on public.reports
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "donor or admin reads donation history" on public.donation_history
for select using (
  public.is_admin(auth.uid())
  or exists (select 1 from public.donor_profiles dp where dp.id = donor_id and dp.user_id = auth.uid())
);

create policy "donor or admin manages donation history" on public.donation_history
for all using (
  public.is_admin(auth.uid())
  or exists (select 1 from public.donor_profiles dp where dp.id = donor_id and dp.user_id = auth.uid())
)
with check (
  public.is_admin(auth.uid())
  or exists (select 1 from public.donor_profiles dp where dp.id = donor_id and dp.user_id = auth.uid())
);

create policy "admins manage admin logs" on public.admin_logs
for all using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public)
values
  ('profile-photos', 'profile-photos', true),
  ('request-proofs', 'request-proofs', false),
  ('blog-covers', 'blog-covers', true),
  ('campaign-banners', 'campaign-banners', true)
on conflict (id) do nothing;
