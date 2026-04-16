import Image from "next/image";
import Link from "next/link";
import { publicNavItems, siteConfig } from "@/lib/constants";
import { BrandText } from "@/components/layout/brand-text";

const footerLinks = [
  ...publicNavItems,
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "সাধারণ জিজ্ঞাসা", href: "/faq" }
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#0d1b2a] text-slate-100">
      <div className="container-shell py-12 sm:py-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex w-fit items-center gap-3">
            <div className="overflow-hidden rounded-[1.15rem] border border-white/10 bg-white shadow-sm ring-1 ring-white/10">
              <Image src="/bera.jpg" alt={siteConfig.name} width={52} height={52} className="h-[3.25rem] w-[3.25rem] object-cover" />
            </div>
            <BrandText align="center" inverted className="w-fit" />
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            নির্ভরযোগ্য রক্তদাতা, জরুরি অনুরোধ এবং প্রয়োজনীয় যোগাযোগকে সহজ ও পরিচ্ছন্নভাবে এক জায়গায় রাখার প্ল্যাটফর্ম।
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-300">
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch className="transition-colors hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6 text-sm text-slate-400">
            <p>© ২০২৬ {siteConfig.name}. দায়িত্বশীল রক্ত সহায়তার জন্য নির্মিত।</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
