import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Siren,
  Users
} from "lucide-react";
import { bloodGroups } from "@/lib/constants";
import { getHomeData } from "@/lib/data";
import { BlogCard } from "@/components/cards/blog-card";
import { CampaignCard } from "@/components/cards/campaign-card";
import { DonorCard } from "@/components/cards/donor-card";
import { BloodRequestCard } from "@/components/cards/request-card";
import { StatCard } from "@/components/cards/stat-card";
import { SectionHeader } from "@/components/sections/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const { donors, requests, campaigns, blogs, stats } = await getHomeData();

  return (
    <div className="pb-6">
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 ambient-grid opacity-[0.18]" />
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.08),transparent_62%)]" />

        <div className="container-shell relative py-12 sm:py-16 lg:py-20">
          <div className="space-y-8">
            <div className="space-y-8">
              <div className="space-y-5">
                <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  আপনার রক্তদান, একটি জীবন বাঁচাতে পারে
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  প্রয়োজন হলে দ্রুত রক্তদাতা খুঁজুন, আর রক্তদাতা হলে নিজের তথ্য যুক্ত করে অন্যের পাশে দাঁড়ান।
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-sm">
                  <Link href="/donors" prefetch>
                    ডোনার খুঁজুন
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-white/85">
                  <Link href="/requests?create=1" prefetch>
                    রক্তের অনুরোধ দিন
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="মোট ব্যবহারকারী" value={`${stats.totalUsers}+`} icon={Users} />
                <StatCard label="ভেরিফায়েড donor" value={`${stats.totalDonors}+`} icon={BadgeCheck} />
                <StatCard label="সক্রিয় অনুরোধ" value={`${stats.activeRequests}`} icon={Siren} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="জরুরি অনুরোধ"
          title="এখনই সাড়া প্রয়োজন এমন অনুরোধ"
          description="সক্রিয় request-গুলো এক নজরে দেখুন।"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {requests.map((request) => (
            <BloodRequestCard key={request.id} request={request} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="ভেরিফায়েড donor"
          title="কমিউনিটির সক্রিয় এবং প্রস্তুত donor"
          description="গ্রুপ, লোকেশন এবং availability দেখে donor বাছাই করুন।"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {donors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="রক্তের গ্রুপ"
          title="গ্রুপভিত্তিক donor খোঁজা সহজ করুন"
          description="রক্তের গ্রুপ select করে location filter-এর সাথে donor খোঁজা দ্রুত ও কম বিভ্রান্তিকর রাখা হয়েছে।"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bloodGroups.map((group) => (
            <Card key={group} className="border-border/70 bg-white/90 shadow-soft">
              <CardContent className="space-y-3 p-6">
                <div className="font-display text-4xl font-semibold tracking-tight text-primary">{group}</div>
                <p className="text-sm leading-7 text-muted-foreground">
                  এই গ্রুপের donor খুঁজতে location filter, verified profile এবং availability status দেখুন।
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="চলমান ক্যাম্পেইন"
          title="সচেতনতা, donor drive এবং community উপস্থিতি"
          description="রক্তদান সচেতনতা ও donor enrollment কার্যক্রমে অংশ নিতে upcoming campaign দেখুন।"
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="সাম্প্রতিক ব্লগ"
          title="সচেতনতা ও নিরাপদ রক্তদানের গাইড"
          description="eligibility, donor safety এবং সচেতনতা বিষয়ে বাংলা awareness content।"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} post={blog} />
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="premium-card grid gap-8 p-8 lg:grid-cols-[1fr_0.95fr] lg:p-12">
          <SectionHeader
            eyebrow="সাধারণ জিজ্ঞাসা"
            title="নিরাপদ ও দায়িত্বশীল রক্তদানের জন্য দরকারি তথ্য"
            description="যোগ্যতা, donation gap, donor response এবং initial safety understanding-এর জন্য সংক্ষিপ্ত উত্তর।"
          />

          <div className="grid gap-4">
            {[
              ["কে রক্ত দিতে পারেন?", "সাধারণত ১৮-৬০ বছর বয়সী, সুস্থ এবং নির্ধারিত ওজনের ব্যক্তি রক্ত দিতে পারেন।"],
              ["কতদিন পর আবার রক্ত দেওয়া যায়?", "সাধারণভাবে অন্তত ১২০ দিনের ব্যবধান রাখা ভালো।"],
              ["জরুরি donor response কীভাবে কাজ করে?", "request detail page থেকে donor interest জানানো হয় এবং যোগাযোগের পথ সহজ করা হয়।"]
            ].map(([title, body]) => (
              <Card key={title} className="border-border/70 bg-white shadow-sm">
                <CardContent className="space-y-2 p-5">
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
