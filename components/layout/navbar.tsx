"use client";

import Link from "next/link";
import { useState } from "react";
import { X, Droplets, Menu, ShieldCheck, ArrowUpRight, HeartHandshake } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="border-b border-border/60 bg-white/70">
        <div className="container-shell flex h-11 items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="hidden sm:block">নিরাপদ, যাচাইকৃত ও কমিউনিটি-ভিত্তিক রক্ত সহায়তা প্ল্যাটফর্ম</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success" />
              লাইভ অনুরোধ ট্র্যাকিং
            </span>
            <span className="hidden sm:inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              ভেরিফায়েড donor support
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/92 backdrop-blur-xl">
        <div className="container-shell flex h-20 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">{siteConfig.name}</p>
              <p className="text-xs text-muted-foreground">বিশ্বাসযোগ্য রক্তদাতা নেটওয়ার্ক</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs text-muted-foreground xl:inline-flex">
              <HeartHandshake className="h-3.5 w-3.5 text-primary" />
              কমিউনিটি সাপোর্ট প্রথমে
            </div>
            <Button variant="ghost" asChild>
              <Link href="/login">লগইন</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                রেজিস্ট্রেশন
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button size="icon" variant="outline" aria-label="Menu" onClick={() => setOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-[60] transition-all duration-200 lg:hidden",
          open ? "pointer-events-auto bg-slate-950/24 opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "fixed right-0 top-0 z-[61] h-full w-[88vw] max-w-sm border-l border-border bg-background p-6 shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
              <p className="text-xs text-muted-foreground">দ্রুত donor সংযোগ</p>
            </div>
          </div>
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-sm text-foreground hover:border-border hover:bg-secondary/70"
            >
              {item.label}
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          <Button variant="outline" asChild>
            <Link href="/login" onClick={() => setOpen(false)}>
              লগইন
            </Link>
          </Button>
          <Button asChild>
            <Link href="/register" onClick={() => setOpen(false)}>
              রেজিস্ট্রেশন করুন
            </Link>
          </Button>
        </div>

        <div className="mt-8 rounded-3xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
          জরুরি রক্তের প্রয়োজন হলে donor search এবং verified request flow ব্যবহার করুন।
        </div>
      </div>
    </>
  );
}
