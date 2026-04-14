import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="panel-muted flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Inbox className="h-7 w-7" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </div>
      {actionHref && actionLabel ? (
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
