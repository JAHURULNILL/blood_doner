import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Compass,
  HeartHandshake,
  Hospital,
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

export const revalidate = 300;

export default async function HomePage() {
  const { donors, requests, campaigns, blogs, stats } = await getHomeData();

  const trustPoints = [
    "ভেরিফায়েড donor badge এবং privacy-aware contact view",
    "সর্বশেষ রক্তদানের তারিখভিত্তিক availability hint",
    "request, donor, campaign এবং awareness content একসাথে"
  ];

  const quickHighlights = [
    {
      icon: ShieldPlus,
      title: "বিশ্বাসযোগ্য সমন্বয়",
      text: "moderated request flow এবং structured admin oversight"
    },
    {
      icon: Compass,
      title: "লোকেশন-ভিত্তিক খোঁজ",
      text: "বিভাগ, জেলা ও এলাকা ধরে দ্রুত donor shortlist"
    },
    {
      icon: CalendarClock,
      title: "দায়িত্বশীল donation rhythm",
      text: "last donation gap দেখে safe donor যোগাযোগ"
    }
  ];

  return (
    <div className="pb-6">
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 ambient-grid opacity-[0.18]" />
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.08),transparent_62%)]" />

        <div className="container-shell relative py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="space-y-8">
              <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1.5 text-sm text-primary">
                প্রিমিয়াম, দায়িত্বশীল ও কমিউনিটি-ভিত্তিক রক্ত সহায়তা প্ল্যাটফর্ম
              </div>

              <div className="space-y-5">
                <h1 className="max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  প্রয়োজনের মুহূর্তে সঠিক donor, সঠিক দিকনির্দেশনা এবং শান্ত সমন্বয়
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  রক্ত খোঁজা, verified donor profile দেখা, জরুরি request প্রকাশ করা এবং community response সমন্বয়
                  করার জন্য একটি পরিশীলিত, পরিচ্ছন্ন ও medically-trustworthy অভিজ্ঞতা।
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {trustPoints.map((item) => (
                  <div key={item} className="premium-card rounded-[1.6rem] p-4 text-sm leading-7 text-muted-foreground">
                    <span className="inline-flex items-start gap-2">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </span>
                  </div>
                ))}
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
                    জরুরি রক্তের অনুরোধ
                  </Link>
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="মোট ব্যবহারকারী" value={`${stats.totalUsers}+`} icon={Users} />
                <StatCard label="ভেরিফায়েড donor" value={`${stats.totalDonors}+`} icon={BadgeCheck} />
                <StatCard label="সক্রিয় অনুরোধ" value={`${stats.activeRequests}`} icon={Siren} />
              </div>
            </div>

            <div className="space-y-5">
              <Card className="hero-glow border-border/70 shadow-soft">
                <CardContent className="space-y-6 p-6 lg:p-7">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-primary">দ্রুত donor search</p>
                    <h2 className="font-display text-2xl font-semibold tracking-tight">রক্তের গ্রুপ ও লোকেশন দিয়ে খুঁজুন</h2>
                    <p className="text-sm leading-7 text-muted-foreground">
                      জরুরি পরিস্থিতিতে nearby donor shortlist করতে filter ব্যবহার করুন।
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
                    <Button type="submit" className="w-full shadow-sm">
                      <Search className="h-4 w-4" />
                      অনুসন্ধান করুন
                    </Button>
                  </form>

                  <div className="grid gap-3 rounded-[1.5rem] bg-white/80 p-4 text-sm text-muted-foreground">
                    <p className="inline-flex items-start gap-2">
                      <ShieldPlus className="mt-0.5 h-4 w-4 text-primary" />
                      public visitor-এর জন্য phone number আংশিক masked দেখানো হয়
                    </p>
                    <p className="inline-flex items-start gap-2">
                      <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                      donation gap অনুযায়ী donor readiness বুঝতে সুবিধা হয়
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 sm:grid-cols-3">
                {quickHighlights.map((item) => (
                  <Card key={item.title} className="border-border/70 bg-white/90 shadow-soft">
                    <CardContent className="space-y-3 p-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[1.2rem] bg-primary/8 text-primary ring-1 ring-primary/10">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-6 py-16 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="premium-card p-7 lg:p-8">
          <SectionHeader
            eyebrow="কেন এই প্ল্যাটফর্ম"
            title="কম clutter, বেশি স্পষ্টতা"
            description="রক্তদাতা প্ল্যাটফর্মের সবচেয়ে গুরুত্বপূর্ণ কাজ হলো দ্রুত বোঝা, দ্রুত যোগাযোগ এবং দায়িত্বশীল সিদ্ধান্ত। তাই অভিজ্ঞতাটিকে শান্ত, পরিষ্কার ও বিশ্বাসযোগ্য রাখা হয়েছে।"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: HeartHandshake,
              title: "সমন্বিত community flow",
              body: "donor search, request response এবং campaign presence একই ecosystem-এ।"
            },
            {
              icon: Activity,
              title: "ব্যবহারবান্ধব dashboard",
              body: "profile update, request tracking এবং donation history এক জায়গা থেকে।"
            },
            {
              icon: Hospital,
              title: "বাস্তব সহায়তার জন্য",
              body: "blood bank, hospital directory এবং awareness content সংযুক্ত রয়েছে।"
            }
          ].map((item) => (
            <Card key={item.title} className="border-border/70 bg-white/90 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.35rem] bg-primary/8 text-primary ring-1 ring-primary/10">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="কীভাবে কাজ করে"
          title="৩ ধাপে donor connection"
          description="প্রথমে profile ও request data পরিষ্কারভাবে উপস্থাপন করা হয়, তারপর location-based matching, এরপর দ্রুত response coordination।"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["১", "প্রোফাইল ও request তৈরি", "donor profile, blood group, location এবং প্রয়োজনীয় তথ্য সংরক্ষণ করুন।"],
            ["২", "ফিল্টার করে খুঁজুন", "বিভাগ, জেলা, এলাকা এবং availability ধরে দ্রুত shortlist করুন।"],
            ["৩", "যোগাযোগ ও follow-up", "request detail, donor interest এবং dashboard activity থেকে সমন্বয় করুন।"]
          ].map(([step, title, body]) => (
            <Card key={step} className="border-border/70 bg-white/90 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {step}
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-xl font-semibold">{title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="জরুরি অনুরোধ"
          title="এখনই সাড়া প্রয়োজন এমন অনুরোধ"
          description="সক্রিয় request-গুলো urgency, location এবং প্রয়োজনীয় unitsসহ দ্রুত দেখা যায়।"
        />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <Card className="border-border/70 bg-white/90 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-3 py-1 text-sm text-primary">
                  request overview
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  জরুরি badge, required date, location এবং contact context-কে বেশি prominent করা হয়েছে যাতে decision নিতে সময় কম লাগে।
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/70 bg-white/90 shadow-soft">
              <CardContent className="space-y-4 p-6">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  লোকেশন-প্রথম matching
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  donor ও request দুটো ক্ষেত্রেই এলাকা-ভিত্তিক browsing-কে সহজ রাখা হয়েছে।
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6">
            {requests.map((request) => (
              <BloodRequestCard key={request.id} request={request} />
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell space-y-8 py-16">
        <SectionHeader
          eyebrow="ভেরিফায়েড donor"
          title="কমিউনিটির সক্রিয় এবং প্রস্তুত donor"
          description="last donation gap, donation count এবং verified status একসাথে দেখে donor বাছাই করুন।"
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
