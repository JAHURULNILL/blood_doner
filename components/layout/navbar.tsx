import Link from "next/link";
import { Droplets, Menu, ShieldCheck } from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
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

        <div className="hidden items-center gap-3 sm:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">লগইন</Link>
          </Button>
          <Button asChild>
            <Link href="/register">রেজিস্ট্রেশন</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button size="icon" variant="outline" aria-label="Menu">
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          <div className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground">
            <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-success" />
            লাইভ রিকোয়েস্ট মনিটরিং
          </div>
          <div className="rounded-full border border-border bg-white px-3 py-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-primary" />
            ভেরিফায়েড ডোনার ফোকাস
          </div>
        </div>
      </div>
    </header>
  );
}
