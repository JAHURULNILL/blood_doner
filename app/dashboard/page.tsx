import Link from "next/link";
import { Activity, Droplets, PlusCircle, TimerReset } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { demoDonors, demoRequests } from "@/lib/demo-data";
import { dashboardQuickActions } from "@/lib/constants";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileSummaryCard } from "@/components/cards/profile-summary-card";
import { StatCard } from "@/components/cards/stat-card";
import { BloodRequestCard } from "@/components/cards/request-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();
  const donor = demoDonors.find((item) => item.user_id === user.id) ?? demoDonors[0];
  const myRequests = demoRequests.filter((item) => item.created_by === user.id).slice(0, 2);
  const completion = donor ? 92 : 42;

  return (
    <DashboardShell
      currentPath="/dashboard"
      title={`স্বাগতম, ${user.full_name}`}
      description="আপনার donor profile, request activity, donation overview এবং quick actions একসাথে দেখুন।"
      actions={
        <Button asChild>
          <Link href="/dashboard/profile/edit">
            <PlusCircle className="h-4 w-4" />
            প্রোফাইল আপডেট
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="মোট রক্তদান" value={`${donor.total_donations}`} icon={Droplets} />
        <StatCard label="শেষ রক্তদান" value={donor.last_donated_at?.slice(0, 10) ?? "তথ্য নেই"} icon={TimerReset} />
        <StatCard label="সাম্প্রতিক কার্যক্রম" value={`${myRequests.length}`} icon={Activity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ProfileSummaryCard donor={donor} completion={completion} />
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-xl font-semibold">দ্রুত কাজ</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {dashboardQuickActions.map((item) => (
                <Button key={item.href} variant="outline" asChild className="justify-start">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">সাম্প্রতিক রক্তের অনুরোধ</h2>
        {myRequests.length ? myRequests.map((request) => <BloodRequestCard key={request.id} request={request} />) : <Card className="border-border/70"><CardContent className="p-6 text-sm text-muted-foreground">আপনার কোনো request এখনো নেই।</CardContent></Card>}
      </div>
    </DashboardShell>
  );
}
