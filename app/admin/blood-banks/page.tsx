import { requireAdmin } from "@/lib/auth";
import { getBloodBanks } from "@/lib/data";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBloodBankForm } from "@/components/forms/admin-forms";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminBloodBanksPage() {
  await requireAdmin();
  const banks = await getBloodBanks();

  return (
    <AdminShell
      currentPath="/admin/blood-banks"
      title="ব্লাড ব্যাংক ডিরেক্টরি ম্যানেজ"
      description="হাসপাতাল, ব্লাড ব্যাংক ও ক্লিনিকের এন্ট্রি যোগ বা আপডেট করুন।"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminBloodBankForm />
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-xl font-semibold">বিদ্যমান এন্ট্রি</h2>
            {banks.map((bank) => (
              <div key={bank.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{bank.name}</p>
                <p className="text-sm text-muted-foreground">
                  {bank.type} • {bank.district}, {bank.division}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
