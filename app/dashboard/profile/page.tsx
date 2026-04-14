import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getCurrentUserDonorProfile } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileSummaryCard } from "@/components/cards/profile-summary-card";
import { EmptyState } from "@/components/sections/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardProfilePage() {
  const user = await requireUser();
  const donor = await getCurrentUserDonorProfile(user.id);

  return (
    <DashboardShell
      currentPath="/dashboard/profile"
      title="আমার প্রোফাইল"
      description="ডোনার প্রোফাইল তথ্য, লোকেশন, availability এবং পরিচিতি একসাথে দেখুন।"
      actions={
        <Button asChild>
          <Link href="/dashboard/profile/edit" prefetch>
            এডিট প্রোফাইল
          </Link>
        </Button>
      }
    >
      {donor ? (
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
                <p className="mt-1 font-medium leading-7">{donor.bio || "তথ্য যোগ করা হয়নি"}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="আপনার donor profile এখনো তৈরি হয়নি"
          description="প্রোফাইল তৈরি করলে donor search-এ দেখা যাবে এবং আপনার account-এর live donor information এখানেই আপডেট হবে।"
          actionLabel="প্রোফাইল তৈরি করুন"
          actionHref="/dashboard/profile/edit"
        />
      )}
    </DashboardShell>
  );
}
