import Link from "next/link";
import { BadgeCheck, Check, HeartPulse, Siren, Users } from "lucide-react";
import { getHomeData } from "@/lib/data";
import { StatCard } from "@/components/cards/stat-card";
import { SectionHeader } from "@/components/sections/section-header";
import { MedicalCampCarousel } from "@/components/sections/medical-camp-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const { stats } = await getHomeData();
  const benefitItems = [
    "হৃদরোগের ঝুঁকি কমাতে সহায়তা করে",
    "শরীরে নতুন রক্তকোষ তৈরিতে ভূমিকা রাখে",
    "নিয়মিত স্বাস্থ্য পরীক্ষার সুযোগ বাড়ায়",
    "মানসিক তৃপ্তি ও সামাজিক দায়িত্ববোধ জাগায়"
  ];

  return (
    <div className="pb-6">
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 ambient-grid opacity-[0.18]" />
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.08),transparent_62%)]" />

        <div className="container-shell relative py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
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
                    রক্তদাতা খুঁজুন
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="bg-white/85">
                  <Link href="/register" prefetch>
                    রক্তদাতা হোন
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-primary/12 bg-white/95 shadow-[0_24px_60px_-36px_rgba(220,38,38,0.35)] lg:mt-6">
              <CardContent className="space-y-6 p-6 sm:p-7">
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-[2rem]">
                    রক্তদানের উপকারিতা
                  </h2>
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    রক্তদান শরীর ও মনের জন্য ইতিবাচক। নিয়মিত রক্তদান জীবন বাঁচানোর পাশাপাশি নিজেকেও সচেতন ও দায়িত্বশীল রাখে।
                  </p>
                </div>

                <div className="space-y-4">
                  {benefitItems.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-7 text-foreground sm:text-base">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="rounded-[2rem] border border-primary/10 bg-[#fff1f1] px-6 py-10 shadow-soft sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl space-y-3 text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">আমাদের অর্জন</h2>
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              আমাদের অর্জনের গল্প দেখুন, জীবন বাঁচানো, দাতা সংযোগ এবং রক্তদানের মাধ্যমে কমিউনিটিকে আরও শক্তিশালী করার যাত্রা।
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="মোট ব্যবহারকারী" value={`${stats.totalUsers}+`} icon={Users} />
            <StatCard label="ভেরিফায়েড donor" value={`${stats.totalDonors}+`} icon={BadgeCheck} />
            <StatCard label="সক্রিয় অনুরোধ" value={`${stats.activeRequests}`} icon={Siren} />
            <StatCard label="সম্পন্ন অনুরোধ" value={`${stats.fulfilledRequests}+`} icon={HeartPulse} />
          </div>
        </div>
      </section>

      <MedicalCampCarousel />

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
              ["কতদিন পর আবার রক্ত দেওয়া যায়?", "সাধারণভাবে অন্তত ৩ মাসের ব্যবধান রাখা ভালো।"],
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
