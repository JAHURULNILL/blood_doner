import { getBloodBanks } from "@/lib/data";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/sections/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export default async function BloodBanksPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const banks = await getBloodBanks(params);

  return (
    <PageShell
      eyebrow="ব্লাড ব্যাংক ও হাসপাতাল"
      title="বিশ্বস্ত রক্ত সহায়তা কেন্দ্রসমূহ"
      description="ব্লাড ব্যাংক, হাসপাতাল ও ক্লিনিকের ডিরেক্টরি থেকে লোকেশন ও ধরণ অনুযায়ী প্রয়োজনীয় তথ্য দেখুন।"
    >
      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="panel-muted h-fit p-5">
          <form className="grid gap-4" action="/blood-banks">
            <Input name="name" placeholder="নাম" defaultValue={params.name} />
            <Input name="division" placeholder="বিভাগ" defaultValue={params.division} />
            <Input name="district" placeholder="জেলা" defaultValue={params.district} />
            <Select name="type" defaultValue={params.type ?? ""}>
              <option value="">সব ধরণ</option>
              <option value="blood_bank">Blood Bank</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
            </Select>
            <label className="flex items-center gap-3 rounded-2xl border border-border p-3 text-sm">
              <input type="checkbox" name="verified" value="true" defaultChecked={params.verified === "true"} />
              কেবল ভেরিফায়েড
            </label>
            <Button type="submit">সার্চ করুন</Button>
          </form>
        </aside>

        <div className="grid gap-6">
          {banks.length ? (
            banks.map((bank) => (
              <Card key={bank.id} className="border-border/70">
                <CardContent className="space-y-4 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold">{bank.name}</h2>
                    <Badge variant={bank.verified ? "success" : "outline"}>
                      {bank.verified ? "ভেরিফায়েড" : "অভেরিফায়েড"}
                    </Badge>
                    <Badge variant="outline">{bank.type}</Badge>
                  </div>
                  <p className="text-sm leading-7 text-muted-foreground">{bank.description}</p>
                  <div className="grid gap-2 text-sm text-muted-foreground">
                    <p>{bank.address}</p>
                    <p>
                      {bank.district}, {bank.division}
                    </p>
                    <p>{bank.phone}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState title="কোনো এন্ট্রি পাওয়া যায়নি" description="ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।" />
          )}
        </div>
      </div>
    </PageShell>
  );
}
