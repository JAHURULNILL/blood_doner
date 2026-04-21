create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  description text not null,
  division text not null,
  district text not null,
  upazila text not null,
  contact_phone text not null,
  contact_email text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.organizations
add column if not exists logo_url text;

alter table public.users
add column if not exists organization_id uuid references public.organizations(id) on delete set null;

create index if not exists organizations_slug_idx on public.organizations (slug);
create index if not exists users_organization_idx on public.users (organization_id);

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

alter table public.organizations enable row level security;

create policy "public read organizations" on public.organizations
for select using (true);

create policy "authenticated create organizations" on public.organizations
for insert with check (auth.uid() is not null or created_by is null);

create policy "creator or admin manage organizations" on public.organizations
for all using (created_by = auth.uid() or public.is_admin(auth.uid()))
with check (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists "users can read self" on public.users;
create policy "users can read self" on public.users
for select using (
  auth.uid() = id
  or public.is_admin(auth.uid())
  or organization_id is not null
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, phone, role, avatar_url, organization_id)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'নতুন ব্যবহারকারী'),
    new.raw_user_meta_data ->> 'phone',
    coalesce((new.raw_app_meta_data ->> 'role')::public.user_role, 'user'),
    new.raw_user_meta_data ->> 'avatar_url',
    nullif(new.raw_user_meta_data ->> 'organization_id', '')::uuid
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      phone = excluded.phone,
      avatar_url = excluded.avatar_url,
      organization_id = excluded.organization_id,
      updated_at = timezone('utc', now());
  return new;
end;
$$;
