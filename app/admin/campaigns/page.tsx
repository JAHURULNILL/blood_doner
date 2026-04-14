import { requireAdmin } from "@/lib/auth";
import { demoCampaigns } from "@/lib/demo-data";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminCampaignForm } from "@/components/forms/admin-forms";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminCampaignsPage() {
  await requireAdmin();

  return (
    <AdminShell
      currentPath="/admin/campaigns"
      title="ক্যাম্পেইন ম্যানেজ"
      description="ইভেন্ট, donor drive ও awareness campaign এখানে publish বা revise করুন।"
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <AdminCampaignForm />
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-xl font-semibold">চলমান ক্যাম্পেইন</h2>
            {demoCampaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-border p-4">
                <p className="font-medium">{campaign.title}</p>
                <p className="text-sm text-muted-foreground">
                  {campaign.location} • {campaign.event_date.slice(0, 10)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
