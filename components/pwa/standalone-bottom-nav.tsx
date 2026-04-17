"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartPulse, Home, LayoutDashboard, Phone, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "হোম", icon: Home },
  { href: "/donors", label: "খুঁজুন", icon: Search },
  { href: "/requests", label: "অনুরোধ", icon: HeartPulse },
  { href: "/contact", label: "যোগাযোগ", icon: Phone },
  { href: "/account", label: "অ্যাকাউন্ট", icon: LayoutDashboard }
];

export function StandaloneBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="app-bottom-nav fixed inset-x-0 bottom-0 z-[65] hidden border-t border-slate-200/80 bg-white/96 px-3 pb-[calc(env(safe-area-inset-bottom)+0.55rem)] pt-2 shadow-[0_-18px_44px_-28px_rgba(15,23,42,0.28)] backdrop-blur">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-[4.1rem] flex-col items-center justify-center gap-1 rounded-[1.4rem] px-2 text-[0.68rem] font-medium transition-all",
                active ? "bg-primary/8 text-primary" : "text-slate-500 hover:bg-slate-100/90 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-[1.12rem] w-[1.12rem]", active ? "text-primary" : "text-current")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
