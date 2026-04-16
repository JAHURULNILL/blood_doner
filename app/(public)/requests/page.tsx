import Link from "next/link";
import { bloodGroups } from "@/lib/constants";
import { getBloodRequests } from "@/lib/data";
import { BloodRequestCard } from "@/components/cards/request-card";
import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/sections/empty-state";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default async function RequestsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const requests = await getBloodRequests(params);
  const showCreate = params.create === "1";

  return (
    <PageShell eyebrow="রক্তের অনুরোধ" title="সক্রিয় রক্তের অনুরোধসমূহ">
      <div className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="panel-muted p-5 sm:p-6">
            <form className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]" action="/requests">
              <Select name="bloodGroup" defaultValue={params.bloodGroup ?? ""} className="h-12">
                <option value="">সব রক্তের গ্রুপ</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Select>
              <Button type="submit" className="h-12">
                ফিল্টার করুন
              </Button>
            </form>
          </div>

          <Button className="h-12 w-full lg:h-auto" asChild>
            <Link href="/requests?create=1">নতুন রক্তের অনুরোধ</Link>
          </Button>
        </div>

        {showCreate ? <BloodRequestForm /> : null}

        {requests.length ? (
          <div className="grid gap-5">
            {requests.map((request) => (
              <BloodRequestCard key={request.id} request={request} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="কোনো রক্তের অনুরোধ পাওয়া যায়নি"
            description="অন্য গ্রুপ দিয়ে আবার দেখুন।"
            actionLabel="নতুন অনুরোধ"
            actionHref="/requests?create=1"
          />
        )}
      </div>
    </PageShell>
  );
}
