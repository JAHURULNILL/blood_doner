import Link from "next/link";
import { ArrowUpRight, Home, ShieldCheck } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";

interface AdminShellProps {
  currentPath: string;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminShell({ currentPath, title, description, children, actions }: AdminShellProps) {
  return (
    <div className="page-backdrop min-h-screen">
      <div className="container-shell py-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 bg-white/75 px-4 py-3 text-sm text-muted-foreground shadow-sm">
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            admin workspace
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" prefetch>
                <Home className="h-4 w-4" />
                হোম
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" prefetch>
                ইউজার ড্যাশবোর্ড
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-white/80 p-7 shadow-soft backdrop-blur lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
                অ্যাডমিন কনসোল
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="max-w-2xl text-muted-foreground">{description}</p>
            </div>
            {actions}
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AdminSidebar currentPath={currentPath} />
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
