import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminShellProps {
  currentPath: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function AdminShell(props: AdminShellProps) {
  const { currentPath, title, children, actions } = props;

  return (
    <div className="page-backdrop min-h-screen">
      <div className="container-shell py-8">
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-white/80 p-7 shadow-soft backdrop-blur lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
                অ্যাডমিন কনসোল
              </div>
              <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
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
