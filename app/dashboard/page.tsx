import Link from "next/link";
import { Activity, Droplets, PlusCircle, TimerReset } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { dashboardQuickActions } from "@/lib/constants";
import { getCurrentUserDonorProfile, getCurrentUserRequests } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileSummaryCard } from "@/components/cards/profile-summary-card";
import { StatCard } from "@/components/cards/stat-card";
import { BloodRequestCard } from "@/components/cards/request-card";
import { EmptyState } from "@/components/sections/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireUser();
  const donor = await getCurrentUserDonorProfile(user.id);
  const myRequests = (await getCurrentUserRequests(user.id)).slice(0, 2);
  const completion = donor
    ? [
        donor.full_name,
        donor.email,
        donor.phone,
        donor.blood_group,
        donor.division,
        donor.district,
        donor.upazila,
        donor.address,
        donor.emergency_contact,
        donor.bio
      ].filter(Boolean).length * 10
    : 20;

  return (
    <DashboardShell
      currentPath="/dashboard"
      title={`স্বাগতম, ${user.full_name}`}
      description="আপনার donor profile, request activity, donation overview এবং quick actions একসাথে দেখুন।"
      actions={
        <Button asChild>
          <Link href="/dashboard/profile/edit" prefetch>
            <PlusCircle className="h-4 w-4" />
            প্রোফাইল আপডেট
          </Link>
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard label="মোট রক্তদান" value={`${donor?.total_donations ?? 0}`} icon={Droplets} />
        <StatCard label="শেষ রক্তদান" value={donor?.last_donated_at?.slice(0, 10) ?? "তথ্য নেই"} icon={TimerReset} />
        <StatCard label="সাম্প্রতিক কার্যক্রম" value={`${myRequests.length}`} icon={Activity} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {donor ? (
          <ProfileSummaryCard donor={donor} completion={Math.min(completion, 100)} />
        ) : (
          <EmptyState
            title="ডোনার প্রোফাইল এখনো সম্পূর্ণ হয়নি"
            description="আপনার profile সম্পূর্ণ করলে donor search-এ দেখা যাবে এবং request response flow ব্যবহার করা যাবে।"
            actionLabel="এখনই প্রোফাইল পূরণ করুন"
            actionHref="/dashboard/profile/edit"
          />
        )}
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6">
            <h2 className="font-display text-xl font-semibold">দ্রুত কাজ</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {dashboardQuickActions.map((item) => (
                <Button key={item.href} variant="outline" asChild className="justify-start">
                  <Link href={item.href} prefetch>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">সাম্প্রতিক রক্তের অনুরোধ</h2>
        {myRequests.length ? (
          myRequests.map((request) => <BloodRequestCard key={request.id} request={request} />)
        ) : (
          <Card className="border-border/70">
            <CardContent className="p-6 text-sm text-muted-foreground">আপনার কোনো request এখনো নেই।</CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
