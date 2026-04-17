import Link from "next/link";
import { BadgeCheck, Check, HeartPulse, Siren, Users } from "lucide-react";
import { getHomeData } from "@/lib/data";
import { MedicalCampCarousel } from "@/components/sections/medical-camp-carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function HomePage() {
  const { stats } = await getHomeData();

  const benefitItems = [
    "হৃদরোগের ঝুঁকি কমাতে সহায়তা করে",
    "শরীরে নতুন রক্তকোষ তৈরিতে ভূমিকা রাখে",
    "নিয়মিত স্বাস্থ্য পরীক্ষার সুযোগ বাড়ায়",
    "মানসিক তৃপ্তি ও সামাজিক দায়বদ্ধতা জাগায়"
  ];

  const achievementItems = [
    { label: "মোট ব্যবহারকারী", value: `${stats.totalUsers}+`, icon: Users },
    { label: "ভেরিফায়েড donor", value: `${stats.totalDonors}+`, icon: BadgeCheck },
    { label: "সক্রিয় অনুরোধ", value: `${stats.activeRequests}`, icon: Siren },
    { label: "সম্পন্ন অনুরোধ", value: `${stats.fulfilledRequests}+`, icon: HeartPulse }
  ];

  const faqItems = [
    [
      "কে রক্ত দিতে পারেন?",
      "সাধারণত ১৮-৬০ বছর বয়সী, সুস্থ এবং নির্ধারিত ওজনের ব্যক্তি রক্ত দিতে পারেন।"
    ],
    [
      "নিরাপদ রক্তদানের নিয়ম কী?",
      "রক্তদানের আগে পর্যাপ্ত ঘুম, ভালো খাবার ও পরিচ্ছন্ন পরিবেশ নিশ্চিত করে চিকিৎসকের পরামর্শ মেনে চলা উচিত।"
    ],
    [
      "কতদিন পর আবার রক্ত দেওয়া যায়?",
      "সাধারণভাবে অন্তত ৩ মাসের ব্যবধান রাখা ভালো।"
    ]
  ] as const;

  return (
    <div className="app-home-root pb-6">
      <section className="app-home-hero relative overflow-hidden border-b border-border/70">
        <div className="absolute inset-0 ambient-grid opacity-[0.18]" />
        <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top,rgba(127,29,29,0.08),transparent_62%)]" />

        <div className="container-shell relative py-12 sm:py-16 lg:py-20">
          <div className="app-home-hero-grid grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="app-home-hero-copy space-y-8">
              <div className="app-home-headline space-y-5">
                <h1 className="app-home-title max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  আপনার এক ব্যাগ রক্ত, বাঁচাতে পারে একটি জীবন
                </h1>
                <p className="app-home-subtitle max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  প্রয়োজন হলে দ্রুত রক্তদাতা খুঁজুন, আর রক্তদাতা হলে নিজের তথ্য যুক্ত করে অন্যের পাশে দাঁড়ান।
                </p>
              </div>

              <div className="app-home-actions flex flex-wrap gap-3">
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
                <Button variant="outline" size="lg" asChild className="bg-white/85">
                  <Link href="/organizations/join" prefetch>
                    সংগঠন হিসাবে যুক্ত হোন
                  </Link>
                </Button>
              </div>

              <div className="app-home-shortcuts hidden grid-cols-3 gap-3">
                <Link href="/donors" className="rounded-[1.3rem] border border-border/70 bg-white px-4 py-4 text-center text-sm font-medium shadow-soft">
                  donor
                  <br />
                  খুঁজুন
                </Link>
                <Link href="/requests?create=1" className="rounded-[1.3rem] border border-border/70 bg-white px-4 py-4 text-center text-sm font-medium shadow-soft">
                  রক্তের
                  <br />
                  অনুরোধ
                </Link>
                <Link href="/dashboard" className="rounded-[1.3rem] border border-border/70 bg-white px-4 py-4 text-center text-sm font-medium shadow-soft">
                  আমার
                  <br />
                  অ্যাকাউন্ট
                </Link>
                <Link href="/organizations/join" className="rounded-[1.3rem] border border-border/70 bg-white px-4 py-4 text-center text-sm font-medium shadow-soft">
                  সংগঠন
                  <br />
                  যুক্ত হোন
                </Link>
              </div>
            </div>

            <Card className="app-home-benefits-card border-primary/12 bg-white/95 shadow-[0_24px_60px_-36px_rgba(220,38,38,0.35)] lg:mt-6">
              <CardContent className="space-y-6 p-6 sm:p-7">
                <div className="space-y-3">
                  <h2 className="app-home-benefits-title font-display text-2xl font-semibold tracking-tight text-primary sm:text-[2rem]">
                    রক্তদানের উপকারিতা
                  </h2>
                  <p className="app-home-benefits-copy text-sm leading-7 text-muted-foreground sm:text-base">
                    রক্তদান শরীর ও মনের জন্য ইতিবাচক। নিয়মিত রক্তদান জীবন বাঁচানোর পাশাপাশি নিজেকেও সচেতন ও দায়িত্বশীল রাখে।
                  </p>
                </div>

                <div className="app-home-benefits-list space-y-4">
                  {benefitItems.map((item) => (
                    <div key={item} className="app-home-benefit-item flex items-start gap-3">
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

      <section className="app-home-achievements container-shell py-10 sm:py-12">
        <div className="rounded-[1.75rem] border border-primary/10 bg-[#fff1f1] px-5 py-6 shadow-soft sm:px-7 sm:py-7 lg:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
            <div className="shrink-0">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
                আমাদের অর্জন
              </h2>
            </div>

            <div className="app-home-stats grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {achievementItems.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-[1.35rem] border border-primary/10 bg-white/80 px-4 py-4 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.25)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
                      <p className="font-display text-3xl font-semibold tracking-tight text-primary">{value}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <MedicalCampCarousel />

      <section className="app-home-faq container-shell py-16">
        <div className="premium-card px-6 py-10 sm:px-8 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              সাধারণ জিজ্ঞাসাবলি
            </h2>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-4 sm:gap-5">
            {faqItems.map(([title, body], index) => (
              <Card
                key={title}
                className="overflow-hidden border border-primary/10 bg-white shadow-[0_20px_45px_-32px_rgba(15,23,42,0.22)]"
              >
                <CardContent className="flex gap-4 p-5 sm:p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-semibold text-foreground sm:text-xl">{title}</h3>
                    <p className="text-sm leading-7 text-muted-foreground sm:text-[15px]">{body}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
