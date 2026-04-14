import { requireUser } from "@/lib/auth";
import { getCurrentUserDonorProfile } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DonorProfileForm } from "@/components/forms/donor-profile-form";

export default async function DashboardProfileEditPage() {
  const user = await requireUser();
  const donor = await getCurrentUserDonorProfile(user.id);

  return (
    <DashboardShell
      currentPath="/dashboard/profile"
      title="প্রোফাইল এডিট"
      description="প্রোফাইল completeness, donor eligibility hint এবং availability status আপডেট করুন।"
    >
      <DonorProfileForm donor={donor} />
    </DashboardShell>
  );
}
