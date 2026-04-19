# বেড়া রক্তদাতা ইউনিট

প্রিমিয়াম, production-ready, Bengali-first blood donation platform built with Next.js App Router, TypeScript, Tailwind CSS, shadcn-style UI primitives, Supabase Auth/Postgres/Storage, React Hook Form, Zod, Lucide icons, and Vercel-ready deployment.

## 1. Project Folder Structure

```text
app/
  (public)/
    page.tsx
    donors/
    requests/
    blood-banks/
    campaigns/
    blog/
    about/
    contact/
    faq/
  (auth)/
    login/
    register/
    forgot-password/
    reset-password/
  dashboard/
    profile/
    requests/
    donations/
    settings/
  admin/
    donors/
    requests/
    blood-banks/
    campaigns/
    blogs/
    reports/
    users/
components/
  admin/
  cards/
  dashboard/
  forms/
  layout/
  sections/
  ui/
lib/
  actions/
  supabase/
  auth.ts
  constants.ts
  data.ts
  demo-data.ts
  schemas.ts
  types.ts
  uploads.ts
supabase/
  schema.sql
  seed.sql
```

## 2. Database Schema

### Core tables

1. `users`
2. `donor_profiles`
3. `blood_requests`
4. `request_responses`
5. `blood_banks`
6. `blogs`
7. `campaigns`
8. `reports`
9. `donation_history`
10. `admin_logs`

### Data model highlights

- `users.id` is a 1:1 foreign key to `auth.users.id`
- `donor_profiles.user_id` is unique so each user has one donor profile
- `blood_requests.created_by` links request ownership to the user
- `request_responses` uses a composite uniqueness guard on `(request_id, donor_id)`
- Storage-backed image URL fields are included for donor photo, request proof, blog cover, and campaign banner
- Search indexes target donor filters and request filters
- RLS policies keep self-service safe while enabling admin moderation

## 3. Supabase SQL

- Main SQL schema: [`supabase/schema.sql`](./supabase/schema.sql)
- Example seed data: [`supabase/seed.sql`](./supabase/seed.sql)

### Storage buckets used

- `profile-photos`
- `request-proofs`
- `blog-covers`
- `campaign-banners`

## 4. Auth Setup

### Features implemented

- Registration
- Login
- Logout server action
- Forgot password
- Reset password
- Protected dashboard helpers
- Admin-only guard helpers
- Supabase SSR session middleware

### Required Supabase setup

1. Create a Supabase project
2. Run `supabase/schema.sql` in SQL Editor
3. Optionally run `supabase/seed.sql`
4. Enable Email auth provider
5. Set the redirect URL for password reset to `https://your-domain.com/reset-password`
6. Create the storage buckets if you prefer using the dashboard instead of SQL

## 5. Public Pages

- Home
- Donor search
- Donor details
- Blood request list
- Blood request details
- Blood bank directory
- Campaign list and details
- Blog list and details
- About
- Contact
- FAQ

All visible content is written in Bengali and the layout uses a restrained, premium medical/community visual style.

## 6. Donor Profile System

### Supported fields

- Full name
- Profile photo
- Email
- Phone
- Blood group
- Gender
- Date of birth
- Weight
- Division
- District
- Upazila
- Full address
- Last donation date
- Total donation count
- Availability status
- Emergency contact
- Short bio
- Urgent donation willingness

### Business logic

- Last donation date informs donor availability hints
- Total donation count cannot be negative
- Blood group validation is strict
- Profile completion card is shown in the dashboard

## 7. Blood Request System

### Supported features

- Create request
- Filter by blood group, location, urgency, status
- Request details page
- Donor response action
- Optional proof image upload

### Statuses

- `Open`
- `In progress`
- `Fulfilled`
- `Cancelled`

## 8. Dashboard

### User dashboard pages

- Overview
- My profile
- Edit profile
- My requests
- Donation history
- Settings

### Admin panel pages

- Overview
- Manage donors
- Manage requests
- Manage blood banks
- Manage campaigns
- Manage blogs
- Manage reports
- Manage users

## 9. Demo Data

The app ships with local demo data in [`lib/demo-data.ts`](./lib/demo-data.ts) so the full UI remains browseable even before environment variables are configured.



## 10. Notes

- The app gracefully falls back to demo content when Supabase env vars are missing
- Once Supabase is configured, auth, storage, and database-backed CRUD paths activate automatically
- UI is mobile-friendly, restrained, and designed for a trustworthy healthcare/community experience
