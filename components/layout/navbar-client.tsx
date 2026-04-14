"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  ArrowUpRight,
  Droplets,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X
} from "lucide-react";
import { publicNavItems, siteConfig } from "@/lib/constants";
import { logoutAction } from "@/lib/actions/auth-actions";
import { createClient } from "@/lib/supabase/client";
import type { UserRecord } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AuthState = "loading" | "ready";

export function NavbarClient() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [authState, setAuthState] = useState<AuthState>("loading");
  const router = useRouter();
  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setAuthState("ready");
      return;
    }

    let active = true;

    const syncUser = async () => {
      const {
        data: { user: authUser }
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!authUser) {
        setUser(null);
        setAuthState("ready");
        return;
      }

      const { data } = await supabase.from("users").select("*").eq("id", authUser.id).maybeSingle();

      if (!active) return;

      setUser(
        data
          ? (data as UserRecord)
          : {
              id: authUser.id,
              email: authUser.email ?? "",
              full_name: authUser.user_metadata.full_name ?? "নতুন ব্যবহারকারী",
              phone: authUser.user_metadata.phone ?? "",
              role: (authUser.app_metadata.role as "user" | "admin") ?? "user",
              avatar_url: authUser.user_metadata.avatar_url ?? null,
              created_at: authUser.created_at ?? new Date().toISOString()
            }
      );
      setAuthState("ready");
    };

    syncUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      void syncUser();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      setUser(null);
      router.push("/");
      router.refresh();
      setOpen(false);
    });
  };

  return (
    <>
      <div className="border-b border-border/70 bg-white/75">
        <div className="container-shell flex h-10 items-center justify-between gap-4 text-[11px] text-muted-foreground sm:text-xs">
          <p className="hidden sm:block">নিরাপদ donor coordination, verified requests এবং দায়িত্বশীল community response</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              সক্রিয় অনুরোধ পর্যবেক্ষণ
            </span>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              চিকিৎসা-সংবেদনশীল সাপোর্ট
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-2xl">
        <div className="container-shell flex h-[4.75rem] items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.35rem] bg-primary/10 text-primary shadow-sm ring-1 ring-primary/10">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold tracking-tight">{siteConfig.name}</p>
              <p className="text-xs text-muted-foreground">বিশ্বাসযোগ্য রক্ত সহায়তা নেটওয়ার্ক</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 xl:flex">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="hidden items-center gap-2 rounded-full border border-border/70 bg-white/85 px-4 py-2 text-xs text-muted-foreground xl:inline-flex">
              <HeartHandshake className="h-3.5 w-3.5 text-primary" />
              community-first সহায়তা
            </div>

            {authState === "loading" ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-28 animate-pulse rounded-full bg-secondary" />
                <div className="h-10 w-24 animate-pulse rounded-full bg-secondary" />
              </div>
            ) : user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href={dashboardHref} prefetch>
                    <LayoutDashboard className="h-4 w-4" />
                    {user.role === "admin" ? "অ্যাডমিন" : "ড্যাশবোর্ড"}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-border/80 bg-white/80">
                  <Link href="/dashboard/profile" prefetch>
                    <UserRound className="h-4 w-4" />
                    {user.full_name.split(" ")[0]}
                  </Link>
                </Button>
                <Button onClick={handleLogout} disabled={pending} className="shadow-sm">
                  <LogOut className="h-4 w-4" />
                  {pending ? "অপেক্ষা..." : "লগআউট"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login" prefetch>
                    লগইন
                  </Link>
                </Button>
                <Button asChild className="shadow-sm">
                  <Link href="/register" prefetch>
                    রেজিস্ট্রেশন
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
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
          open ? "pointer-events-auto bg-slate-950/28 opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "fixed right-0 top-0 z-[61] h-full w-[88vw] max-w-sm border-l border-border bg-background/95 p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 lg:hidden",
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
              prefetch
              onClick={() => setOpen(false)}
              className="flex items-center justify-between rounded-2xl border border-transparent px-4 py-3 text-sm text-foreground hover:border-border hover:bg-secondary/70"
            >
              {item.label}
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-3">
          {authState === "loading" ? (
            <>
              <div className="h-11 animate-pulse rounded-2xl bg-secondary" />
              <div className="h-11 animate-pulse rounded-2xl bg-secondary" />
            </>
          ) : user ? (
            <>
              <Button variant="outline" asChild>
                <Link href={dashboardHref} prefetch onClick={() => setOpen(false)}>
                  {user.role === "admin" ? "অ্যাডমিন প্যানেল" : "ড্যাশবোর্ড"}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/profile" prefetch onClick={() => setOpen(false)}>
                  আমার প্রোফাইল
                </Link>
              </Button>
              <Button onClick={handleLogout} disabled={pending}>
                {pending ? "অপেক্ষা..." : "লগআউট"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login" prefetch onClick={() => setOpen(false)}>
                  লগইন
                </Link>
              </Button>
              <Button asChild>
                <Link href="/register" prefetch onClick={() => setOpen(false)}>
                  রেজিস্ট্রেশন করুন
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-border/70 bg-secondary/60 p-4 text-sm leading-7 text-muted-foreground">
          জরুরি রক্তের প্রয়োজন হলে verified request flow ব্যবহার করুন এবং donor profile-এর donation gap দেখে যোগাযোগ করুন।
        </div>
      </div>
    </>
  );
}
