import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { demoDonors } from "@/lib/demo-data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileSummaryCard } from "@/components/cards/profile-summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardProfilePage() {
  const user = await requireUser();
  const donor = demoDonors.find((item) => item.user_id === user.id) ?? demoDonors[0];

  return (
    <DashboardShell
      currentPath="/dashboard/profile"
      title="আমার প্রোফাইল"
      description="ডোনার প্রোফাইল তথ্য, লোকেশন, availability এবং পরিচিতি একসাথে দেখুন।"
      actions={
        <Button asChild>
          <Link href="/dashboard/profile/edit">এডিট প্রোফাইল</Link>
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ProfileSummaryCard donor={donor} completion={92} />
        <Card className="border-border/70">
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">নাম</p>
              <p className="mt-1 font-medium">{donor.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ফোন</p>
              <p className="mt-1 font-medium">{donor.phone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ইমেইল</p>
              <p className="mt-1 font-medium">{donor.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">লোকেশন</p>
              <p className="mt-1 font-medium">
                {donor.upazila}, {donor.district}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">বায়ো</p>
              <p className="mt-1 font-medium leading-7">{donor.bio}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
