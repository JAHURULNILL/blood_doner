export function RouteLoading({
  badge,
  title,
  description
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-backdrop min-h-screen">
      <div className="container-shell py-10">
        <div className="mb-8 rounded-[2rem] border border-border/70 bg-white/80 p-7 shadow-soft backdrop-blur lg:p-8">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
              {badge}
            </div>
            <p className="font-display text-3xl font-semibold tracking-tight text-foreground/70">{title}</p>
            <p className="max-w-2xl text-muted-foreground">{description}</p>
            <div className="h-3 w-full max-w-lg animate-pulse rounded-full bg-secondary/90" />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="panel-muted h-fit p-3">
            <div className="space-y-3 p-3">
              <div className="h-4 w-28 animate-pulse rounded-full bg-secondary" />
              <div className="h-8 w-40 animate-pulse rounded-2xl bg-secondary" />
            </div>
            <div className="grid gap-2 pt-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-12 animate-pulse rounded-2xl bg-secondary" />
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-3xl border border-border/70 bg-white/80" />
              ))}
            </div>
            <div className="h-64 animate-pulse rounded-3xl border border-border/70 bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
