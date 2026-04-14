import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Mail, PhoneCall, ShieldCheck } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="section-divider mt-20 bg-white/80">
      <div className="container-shell py-14">
        <div className="premium-card hero-glow mb-10 grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
              জরুরি মুহূর্তে দ্রুত সমন্বয়
            </div>
            <div className="space-y-3">
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                donor, request এবং trusted guidance এক জায়গায় রাখুন
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                রক্ত খোঁজা, রক্তের অনুরোধ প্রকাশ, blood bank directory এবং সচেতনতা কনটেন্টকে একটি শান্ত, পরিচ্ছন্ন ও
                দায়িত্বশীল অভিজ্ঞতায় আনা হয়েছে।
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start justify-between gap-5 lg:items-end">
            <div className="rounded-[1.5rem] border border-border/70 bg-white/90 px-5 py-4 text-sm text-muted-foreground shadow-sm">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                medical-trust oriented community platform
              </span>
            </div>
            <Button asChild size="lg" className="shadow-sm">
              <Link href="/register" prefetch>
                এখনই যুক্ত হন
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-display text-2xl font-semibold tracking-tight">{siteConfig.name}</p>
            <p className="max-w-xl text-sm leading-7 text-muted-foreground">{siteConfig.description}</p>
            <div className="rounded-[1.5rem] border border-border/70 bg-secondary/40 p-4 text-sm leading-7 text-muted-foreground">
              verified donor support, structured request flow এবং community-first যোগাযোগকে আরও সহজ করার জন্য তৈরি।
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-medium text-foreground">দ্রুত লিংক</p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              {publicNavItems.map((item) => (
                <Link key={item.href} href={item.href} prefetch className="hover:text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-medium text-foreground">প্ল্যাটফর্ম</p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <Link href="/about" prefetch className="hover:text-foreground">
                আমাদের সম্পর্কে
              </Link>
              <Link href="/faq" prefetch className="hover:text-foreground">
                সাধারণ জিজ্ঞাসা
              </Link>
              <Link href="/contact" prefetch className="hover:text-foreground">
                যোগাযোগ
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="font-medium text-foreground">সহায়তা</p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-primary" />
                01710-000000
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                support@roktodaata.com
              </span>
              <span className="inline-flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                কমিউনিটি সমন্বয় সহায়তা
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container-shell flex flex-col gap-2 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© ২০২৬ {siteConfig.name}. দায়িত্বশীল রক্ত সহায়তার জন্য নির্মিত।</p>
          <p>Next.js, Supabase এবং Vercel-ready architecture</p>
        </div>
      </div>
    </footer>
  );
}
