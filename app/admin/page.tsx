import { Activity, FileWarning, Hospital, Newspaper, Users } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { getAdminSummary, getReports } from "@/lib/data";
import { AdminShell } from "@/components/admin/admin-shell";
import { StatCard } from "@/components/cards/stat-card";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const summary = await getAdminSummary();
  const reports = await getReports();

  return (
    <AdminShell
      currentPath="/admin"
      title="অ্যাডমিন ড্যাশবোর্ড"
      description="প্ল্যাটফর্ম analytics, moderation alerts, request status এবং content growth এক নজরে দেখুন।"
    >
      <div className="grid gap-4 xl:grid-cols-4">
        <StatCard label="মোট ইউজার" value={`${summary.totalUsers}`} icon={Users} />
        <StatCard label="সক্রিয় রিকোয়েস্ট" value={`${summary.activeRequests}`} icon={Activity} />
        <StatCard label="ব্লাড ব্যাংক" value={`${summary.bloodBankCount}`} icon={Hospital} />
        <StatCard label="ব্লগ ও ক্যাম্পেইন" value={`${summary.blogCount + summary.campaignCount}`} icon={Newspaper} />
      </div>
      <Card className="border-border/70">
        <CardContent className="space-y-4 p-6">
          <h2 className="font-display text-xl font-semibold">মডারেশন অ্যালার্ট</h2>
          <div className="grid gap-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between rounded-2xl border border-border p-4">
                <div className="space-y-1">
                  <p className="font-medium">{report.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.reporter_name} • {report.category}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-warning/10 px-3 py-1 text-xs text-warning">
                  <FileWarning className="h-3.5 w-3.5" />
                  {report.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
