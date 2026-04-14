import Link from "next/link";
import { publicNavItems, siteConfig } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white/80">
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1.5fr_1fr_1fr]">
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
