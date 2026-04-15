import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

interface DashboardShellProps {
  currentPath: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardShell({ currentPath, title, description, actions, children }: DashboardShellProps) {
  return (
    <div className="page-backdrop min-h-screen">
      <div className="container-shell py-8">
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-white/80 p-7 shadow-soft backdrop-blur lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
                ব্যক্তিগত ড্যাশবোর্ড
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
              {description ? <p className="max-w-2xl text-muted-foreground">{description}</p> : null}
            </div>
            {actions}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <DashboardSidebar currentPath={currentPath} />
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
