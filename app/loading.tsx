export default function GlobalLoading() {
  return (
    <div className="container-shell py-16">
      <div className="grid gap-6">
        <div className="h-10 w-1/3 animate-pulse rounded-2xl bg-secondary" />
        <div className="h-28 animate-pulse rounded-3xl bg-secondary" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-56 animate-pulse rounded-3xl bg-secondary" />
          <div className="h-56 animate-pulse rounded-3xl bg-secondary" />
          <div className="h-56 animate-pulse rounded-3xl bg-secondary" />
        </div>
      </div>
    </div>
  );
}
