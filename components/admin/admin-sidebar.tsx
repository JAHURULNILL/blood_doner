import Link from "next/link";
import { adminNavItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AdminSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="panel-muted h-fit p-3">
      <nav className="grid gap-1">
        {adminNavItems.map((item) => {
          const active = currentPath === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
