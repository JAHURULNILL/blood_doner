import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Mail, PhoneCall } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white/80">
      <div className="container-shell py-12">
        <div className="mb-10 grid gap-6 rounded-[2rem] border border-border/70 bg-[linear-gradient(135deg,rgba(127,29,29,0.04),rgba(255,255,255,0.88),rgba(241,245,249,0.92))] p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
              কমিউনিটি সমন্বয় আরও সহজ করুন
            </div>
            <h3 className="font-display text-2xl font-semibold sm:text-3xl">
              donor network, request flow, আর trusted information এক জায়গায়
            </h3>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              প্ল্যাটফর্মটি জরুরি রক্ত সহায়তা, donor খোঁজা, awareness content এবং verified coordination-এর জন্য তৈরি।
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-4 sm:items-end">
            <div className="rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" />
                community-first platform experience
              </span>
            </div>
            <Button asChild>
              <Link href="/register">
                এখনই যুক্ত হোন
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="font-display text-2xl font-semibold">{siteConfig.name}</p>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground">{siteConfig.description}</p>
          <p className="text-sm text-muted-foreground">
            জরুরি সহায়তা, কমিউনিটি ডোনার খোঁজা, হাসপাতাল নির্দেশিকা ও সচেতনতা কনটেন্ট একসাথে।
          </p>
        </div>

        <div>
          <p className="mb-4 font-medium text-foreground">দ্রুত লিংক</p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 font-medium text-foreground">অতিরিক্ত</p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              আমাদের সম্পর্কে
            </Link>
            <Link href="/faq" className="hover:text-foreground">
              সাধারণ জিজ্ঞাসা
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              যোগাযোগ
            </Link>
          </div>
        </div>

        <div>
          <p className="mb-4 font-medium text-foreground">সহায়তা</p>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              01710-000000
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              support@roktosetu.com
            </span>
          </div>
        </div>
      </div>
      </div>
      <div className="border-t border-border/70">
        <div className="container-shell flex flex-col gap-2 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© ২০২৬ {siteConfig.name}. সেবা, সচেতনতা ও সমন্বয়ের জন্য নির্মিত।</p>
          <p>Next.js, Supabase ও Vercel-ready architecture</p>
        </div>
      </div>
    </footer>
  );
}
