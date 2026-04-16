import { bloodGroups } from "@/lib/constants";
import { getDonors } from "@/lib/data";
import { DonorCard } from "@/components/cards/donor-card";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/sections/empty-state";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

export default async function DonorsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const donors = await getDonors(params);

  return (
    <PageShell eyebrow="রক্তদাতা খুঁজুন" title="রক্তের গ্রুপ দিয়ে রক্তদাতা খুঁজুন">
      <div className="space-y-6">
        <div className="panel-muted p-5 sm:p-6">
          <form action="/donors" className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
            <Select name="bloodGroup" defaultValue={params.bloodGroup ?? ""} className="h-12">
              <option value="">সব রক্তের গ্রুপ</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>

            <Button type="submit" className="h-12">
              রক্তদাতা খুঁজুন
            </Button>
          </form>
        </div>

        {donors.length ? (
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold">সকল রক্তদাতা</h2>
            <div className="grid gap-5">
              {donors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="কোনো রক্তদাতা পাওয়া যায়নি"
            description="অন্য গ্রুপ দিয়ে আবার খুঁজুন।"
            actionLabel="রক্তদাতা হোন"
            actionHref="/register"
          />
        )}
      </div>
    </PageShell>
  );
}
