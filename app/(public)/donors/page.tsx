import { bloodGroups, divisions } from "@/lib/constants";
import { getDonors } from "@/lib/data";
import { DonorCard } from "@/components/cards/donor-card";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/sections/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default async function DonorsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const donors = await getDonors(params);

  return (
    <PageShell
      eyebrow="ডোনার সার্চ"
      title="রক্তদাতা খুঁজুন"
      description="রক্তের গ্রুপ, বিভাগ, জেলা, উপজেলা এবং ভেরিফায়েড status দিয়ে filtered donor খুঁজুন।"
    >
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="panel-muted h-fit p-5">
          <form className="grid gap-4" action="/donors">
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
            <Input name="upazila" placeholder="উপজেলা / এলাকা" defaultValue={params.upazila} />
            <label className="flex items-center gap-3 rounded-2xl border border-border p-3 text-sm">
              <input type="checkbox" name="availability" value="true" defaultChecked={params.availability === "true"} />
              কেবল উপলভ্য donor
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-border p-3 text-sm">
              <input type="checkbox" name="verified" value="true" defaultChecked={params.verified === "true"} />
              কেবল ভেরিফায়েড donor
            </label>
            <Button type="submit">ফিল্টার প্রয়োগ করুন</Button>
          </form>
        </aside>

        <div className="space-y-6">
          {donors.length ? (
            donors.map((donor) => <DonorCard key={donor.id} donor={donor} />)
          ) : (
            <EmptyState
              title="কোনো donor পাওয়া যায়নি"
              description="ফিল্টার কিছুটা শিথিল করে আবার চেষ্টা করুন অথবা ব্লাড রিকোয়েস্ট প্রকাশ করুন।"
              actionLabel="রক্তের অনুরোধ প্রকাশ করুন"
              actionHref="/requests?create=1"
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
