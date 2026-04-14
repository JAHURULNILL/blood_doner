import { requireUser } from "@/lib/auth";
import { getDonationHistoryForUser } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmptyState } from "@/components/sections/empty-state";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardDonationsPage() {
  const user = await requireUser();
  const history = await getDonationHistoryForUser(user.id);

  return (
    <DashboardShell
      currentPath="/dashboard/donations"
      title="আমার ডোনেশন ইতিহাস"
      description="আগের donor activity, হাসপাতাল, unit count এবং recipient note এখানে থাকবে।"
    >
      <div className="grid gap-4">
        {history.length ? (
          history.map((item) => (
            <Card key={item.id} className="border-border/70">
              <CardContent className="grid gap-3 p-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">তারিখ</p>
                  <p className="mt-1 font-medium">{item.donated_at}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">হাসপাতাল</p>
                  <p className="mt-1 font-medium">{item.hospital_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ইউনিট</p>
                  <p className="mt-1 font-medium">{item.units}</p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-sm text-muted-foreground">নোট</p>
                  <p className="mt-1 font-medium">{item.recipient_note || "তথ্য নেই"}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            title="কোনো donation history পাওয়া যায়নি"
            description="আপনার donation history database-এ যোগ হলে এই page-এ live update হয়ে দেখা যাবে।"
          />
        )}
      </div>
    </DashboardShell>
  );
}
