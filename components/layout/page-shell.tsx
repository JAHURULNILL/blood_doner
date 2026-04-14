import { cn } from "@/lib/utils";

interface PageShellProps {
  title: string;
  description: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ title, description, eyebrow, children, className }: PageShellProps) {
  return (
    <div className={cn("page-backdrop", className)}>
      <div className="container-shell py-10 sm:py-12 lg:py-16">
        <div className="mb-10 rounded-[2rem] border border-border/70 bg-white/78 p-7 shadow-soft backdrop-blur sm:p-8 lg:p-10">
          <div className="max-w-3xl space-y-4">
            {eyebrow ? (
              <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
                {eyebrow}
              </div>
            ) : null}
            <h1 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <p className="text-base leading-8 text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
