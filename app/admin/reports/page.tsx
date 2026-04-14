import { requireAdmin } from "@/lib/auth";
import { getReports } from "@/lib/data";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminReportsPage() {
  await requireAdmin();
  const reports = await getReports();

  return (
    <AdminShell
      currentPath="/admin/reports"
      title="রিপোর্ট ও অভিযোগ"
      description="ব্যবহারকারীর রিপোর্ট, ভুয়া তথ্য, spam বা অনৈতিক ব্যবহার নিয়ে moderation workflow এখানেই।"
    >
      <div className="grid gap-4">
        {reports.map((report) => (
          <Card key={report.id} className="border-border/70">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">{report.subject}</p>
                <p className="text-sm text-muted-foreground">
                  রিপোর্টকারী: {report.reporter_name} • {report.category}
                </p>
              </div>
              <Badge variant={report.status === "resolved" ? "success" : report.status === "reviewing" ? "warning" : "outline"}>
                {report.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
