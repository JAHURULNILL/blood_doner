import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ChangePasswordForm } from "@/components/forms/change-password-form";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function DashboardSettingsPage() {
  await requireUser();

  return (
    <DashboardShell
      currentPath="/dashboard/settings"
      title="সেটিংস"
      description="নোটিফিকেশন, privacy preferences এবং account behavior এখান থেকে নিয়ন্ত্রণ করুন।"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsForm />
        <ChangePasswordForm />
      </div>
    </DashboardShell>
  );
}
