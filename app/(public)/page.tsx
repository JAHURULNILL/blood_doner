import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  Compass,
  HeartHandshake,
  MapPin,
  Search,
  ShieldPlus,
  Siren,
  Users
} from "lucide-react";
import { bloodGroups, divisions } from "@/lib/constants";
import { getHomeData } from "@/lib/data";
import { BlogCard } from "@/components/cards/blog-card";
import { CampaignCard } from "@/components/cards/campaign-card";
import { DonorCard } from "@/components/cards/donor-card";
import { BloodRequestCard } from "@/components/cards/request-card";
import { StatCard } from "@/components/cards/stat-card";
import { SectionHeader } from "@/components/sections/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default async function HomePage() {
  const { donors, requests, campaigns, blogs, stats } = await getHomeData();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 ambient-grid opacity-50" />
        <div className="container-shell relative grid gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
              নির্ভরযোগ্য রক্তদাতা ও জরুরি রক্ত অনুরোধ প্ল্যাটফর্ম
            </div>
            <div className="space-y-5">
              <h1 className="font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                প্রয়োজনের মুহূর্তে সঠিক donor, সঠিক তথ্য, সঠিক সমন্বয়
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                রক্তসেতু জরুরি রক্তের অনুরোধ, donor search, verified community response এবং
                স্বাস্থ্য-দায়িত্বশীল donor workflow-কে একটি পরিশীলিত ও ব্যবহারবান্ধব অভিজ্ঞতায় আনে।
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                "ভেরিফায়েড donor badge ও privacy-aware contact view",
                "রক্তদানের ব্যবধানভিত্তিক availability hint",
                "অনুরোধ, ব্লাড ব্যাংক, ক্যাম্পেইন ও awareness content একসাথে"
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-border/70 bg-white/80 p-4 text-sm text-muted-foreground shadow-sm">
                  <span className="inline-flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/donors">
                  ডোনার খুঁজুন
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/requests?create=1">জরুরি রক্তের অনুরোধ</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="মোট নিবন্ধিত ব্যবহারকারী" value={`${stats.totalUsers}+`} icon={Users} />
              <StatCard label="ভেরিফায়েড ডোনার" value={`${stats.totalDonors}+`} icon={BadgeCheck} />
              <StatCard label="সক্রিয় রক্ত অনুরোধ" value={`${stats.activeRequests}`} icon={Siren} />
            </div>
          </div>

          <div className="space-y-5">
            <Card className="soft-ring border-border/70 bg-white/90">
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-primary">দ্রুত ডোনার সার্চ</p>
                  <h2 className="font-display text-2xl font-semibold">রক্তের গ্রুপ ও লোকেশন দিয়ে খুঁজুন</h2>
                  <p className="text-sm leading-7 text-muted-foreground">
                    জরুরি পরিস্থিতিতে দ্রুত response পেতে filtered donor list দেখুন।
                  </p>
                </div>
                <form action="/donors" className="grid gap-4">
                  <Select name="bloodGroup" defaultValue="">
                    <option value="">রক্তের গ্রুপ</option>
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </Select>
                  <Select name="division" defaultValue="">
                    <option value="">বিভাগ</option>
                    {divisions.map((division) => (
                      <option key={division} value={division}>
                        {division}
                      </option>
                    ))}
                  </Select>
                  <Input name="district" placeholder="জেলা লিখুন" />
                  <Input name="upazila" placeholder="উপজেলা / এলাকা" />
                  <Button type="submit" className="w-full">
                    <Search className="h-4 w-4" />
                    অনুসন্ধান করুন
                  </Button>
                </form>
                <div className="grid gap-3 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                  <p className="inline-flex items-center gap-2">
                    <ShieldPlus className="h-4 w-4 text-primary" />
                    ফোন নম্বর visitor-দের জন্য privacy-aware mode-এ আংশিক masked
                  </p>
                  <p className="inline-flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-primary" />
                    সর্বশেষ রক্তদানের তারিখ অনুযায়ী donor availability hint
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-border/70 bg-white/90">
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                    <Compass className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">লোকেশন-ফার্স্ট discovery</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    বিভাগ, জেলা, উপজেলা ধরে donor ও রক্ত অনুরোধ quickly narrow down করুন।
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70 bg-white/90">
                <CardContent className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">জরুরি সাড়া সহজ করুন</h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    অনুরোধ detail, contact, urgency signal এবং donor response action একই flow-এ।
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: HeartHandshake,
              title: "কেন রক্তদান গুরুত্বপূর্ণ",
              description: "একজন donor অল্প সময়েই একাধিক জীবনরক্ষাকারী চিকিৎসায় ভূমিকা রাখতে পারেন।"
            },
            {
              icon: Activity,
              title: "কীভাবে কাজ করে",
              description: "প্রোফাইল তৈরি, donor সার্চ, verified request response এবং follow-up activity tracking।"
            },
            {
              icon: ShieldPlus,
              title: "বিশ্বাসযোগ্যতা ও নিরাপত্তা",
              description: "ভেরিফায়েড donor badge, moderated request, এবং structured admin oversight।"
            }
          ].map((item) => (
            <Card key={item.title} className="border-border/70">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="ফিচার্ড রক্তের অনুরোধ"
          title="এখনই সাড়া প্রয়োজন এমন অনুরোধ"
          description="সক্রিয় ও যাচাইকৃত অনুরোধগুলো এক নজরে দেখুন এবং donor হিসেবে দ্রুত সাড়া দিন।"
        />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/70 bg-white/80">
            <CardContent className="p-5 text-sm text-muted-foreground">জরুরি অনুরোধগুলো পরিষ্কার urgency badge ও location signal-সহ দেখানো হয়।</CardContent>
          </Card>
          <Card className="border-border/70 bg-white/80">
            <CardContent className="p-5 text-sm text-muted-foreground">প্রকাশের সময়, প্রয়োজনীয় unit এবং donor response count দ্রুত বোঝা যায়।</CardContent>
          </Card>
          <Card className="border-border/70 bg-white/80">
            <CardContent className="p-5 text-sm text-muted-foreground">request detail page থেকে donor interest বা সরাসরি contact flow শুরু করা যায়।</CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {requests.map((request) => (
            <BloodRequestCard key={request.id} request={request} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="ভেরিফায়েড ডোনার"
          title="কমিউনিটির নির্ভরযোগ্য সক্রিয় donor"
          description="প্রোফাইল completeness, সর্বশেষ রক্তদানের সময়, এবং জরুরি availability signal দেখে donor বেছে নিন।"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {donors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="রক্তের গ্রুপ তথ্য"
          title="যে গ্রুপ, সেই donor"
          description="রক্তের গ্রুপ match করা এবং সঠিক লোকেশনে donor খোঁজা দুইটিই সমান গুরুত্বপূর্ণ।"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bloodGroups.map((group) => (
            <Card key={group} className="border-border/70">
              <CardContent className="space-y-3 p-6">
                <div className="font-display text-3xl font-semibold text-primary">{group}</div>
                <p className="text-sm leading-7 text-muted-foreground">
                  verified donor search, recent request, এবং জরুরি availability badge সহ filtered result।
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="চলমান ক্যাম্পেইন"
          title="সচেতনতা, সংগ্রহ ও কমিউনিটি উপস্থিতি"
          description="রক্তদান সচেতনতা ও donor enrollment কার্যক্রমে অংশ নিন।"
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
          title="সচেতনতা ও গাইডলাইন"
          description="রক্তদান, eligibility, donor safety এবং কমিউনিটি সচেতনতা বিষয়ে পেশাদার বাংলা কনটেন্ট।"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} post={blog} />
          ))}
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="panel-muted grid gap-8 p-8 lg:grid-cols-[1fr_0.9fr] lg:p-12">
          <SectionHeader
            eyebrow="সাধারণ জিজ্ঞাসা"
            title="নিরাপদ ও দায়িত্বশীল রক্তদানের জন্য প্রয়োজনীয় তথ্য"
            description="যোগ্যতা, ব্যবধান, স্বাস্থ্য শর্ত এবং donor availability নিয়ে সংক্ষিপ্ত উত্তর।"
          />
          <div className="grid gap-4">
            {[
              ["কে রক্ত দিতে পারেন?", "সাধারণত ১৮-৬০ বছর বয়সী, সুস্থ, নির্ধারিত ওজনের ব্যক্তি রক্ত দিতে পারেন।"],
              ["কতদিন পর আবার রক্ত দেওয়া যায়?", "সাধারণভাবে অন্তত ১২০ দিন ব্যবধান রাখা ভালো।"],
              ["জরুরি donor response কীভাবে কাজ করে?", "request detail page থেকে donor interest নিবন্ধিত হয় এবং requester যোগাযোগ করতে পারেন।"]
            ].map(([title, body]) => (
              <Card key={title} className="border-border/70 bg-white">
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
