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
      eyebrow="রক্তদাতা খুঁজুন"
      title="গ্রুপ ও এলাকা দিয়ে রক্তদাতা খুঁজুন"
      description="লগইন ছাড়াই রক্তের গ্রুপ, বিভাগ, জেলা ও এলাকা দিয়ে রেজিস্টার্ড রক্তদাতাদের তালিকা দেখুন এবং সরাসরি কল করুন।"
    >
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="panel-muted h-fit p-5 lg:sticky lg:top-28">
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

            <Input name="district" placeholder="জেলা লিখুন" defaultValue={params.district} />
            <Input name="upazila" placeholder="এলাকা / উপজেলা লিখুন" defaultValue={params.upazila} />

            <label className="flex items-center gap-3 rounded-2xl border border-border p-3 text-sm">
              <input type="checkbox" name="availability" value="true" defaultChecked={params.availability === "true"} />
              শুধু সময় হয়েছে এমন রক্তদাতা
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-border p-3 text-sm">
              <input type="checkbox" name="verified" value="true" defaultChecked={params.verified === "true"} />
              শুধু ভেরিফায়েড রক্তদাতা
            </label>

            <Button type="submit">রক্তদাতা খুঁজুন</Button>
          </form>
        </aside>

        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-border/70 bg-white/90 p-5 shadow-soft">
            <p className="text-sm text-muted-foreground">মোট রক্তদাতা</p>
            <p className="mt-2 font-display text-3xl font-semibold">{donors.length}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              নিচের সব card public visitor-এর জন্য visible। প্রয়োজন হলে সরাসরি কল করে যোগাযোগ করতে পারবেন।
            </p>
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
              description="ফিল্টার একটু কমিয়ে আবার খুঁজুন অথবা নতুন রক্তদাতা হিসেবে নিবন্ধন করুন।"
              actionLabel="রক্তদাতা হোন"
              actionHref="/register"
            />
          )}
        </div>
      </div>
    </PageShell>
  );
}
