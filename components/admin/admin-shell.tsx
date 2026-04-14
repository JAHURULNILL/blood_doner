import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminShellProps {
  currentPath: string;
  title: string;
  description: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminShell({ currentPath, title, description, children, actions }: AdminShellProps) {
  return (
    <div className="container-shell py-10">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
            অ্যাডমিন কনসোল
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="max-w-2xl text-muted-foreground">{description}</p>
        </div>
        {actions}
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar currentPath={currentPath} />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}
