import Link from "next/link";
import { bloodGroups, divisions } from "@/lib/constants";
import { getBloodRequests } from "@/lib/data";
import { BloodRequestCard } from "@/components/cards/request-card";
import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/sections/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <PageShell
      eyebrow="রক্তের অনুরোধ"
      title="সক্রিয় রক্তের অনুরোধসমূহ"
      description="লোকেশন, রক্তের গ্রুপ, urgency এবং status অনুযায়ী অনুরোধ দেখুন অথবা নতুন request প্রকাশ করুন।"
    >
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="panel-muted p-5">
            <form className="grid gap-4" action="/requests">
              <Select name="bloodGroup" defaultValue={params.bloodGroup ?? ""}>
                <option value="">সব রক্তের গ্রুপ</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Select>
              <Select name="division" defaultValue={params.division ?? ""}>
                <option value="">সব বিভাগ</option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </Select>
              <Input name="district" placeholder="জেলা" defaultValue={params.district} />
              <Select name="urgency" defaultValue={params.urgency ?? ""}>
                <option value="">সব অগ্রাধিকার</option>
                <option value="Emergency">জরুরি</option>
                <option value="Urgent">অতি দ্রুত</option>
                <option value="Normal">স্বাভাবিক</option>
              </Select>
              <Select name="status" defaultValue={params.status ?? ""}>
                <option value="">সব স্ট্যাটাস</option>
                <option value="Open">Open</option>
                <option value="In progress">In progress</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
              <Button type="submit">ফিল্টার প্রয়োগ করুন</Button>
            </form>
          </div>
          <Button className="w-full" asChild>
            <Link href="/requests?create=1">নতুন রক্তের অনুরোধ</Link>
          </Button>
        </aside>

        <div className="space-y-6">
          {showCreate ? <BloodRequestForm /> : null}
          {requests.length ? (
            requests.map((request) => <BloodRequestCard key={request.id} request={request} />)
          ) : (
            <EmptyState
              title="কোনো রক্তের অনুরোধ পাওয়া যায়নি"
              description="ফিল্টার পরিবর্তন করে আবার দেখুন অথবা নতুন অনুরোধ প্রকাশ করুন।"
              actionLabel="নতুন অনুরোধ"
              actionHref="/requests?create=1"
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
