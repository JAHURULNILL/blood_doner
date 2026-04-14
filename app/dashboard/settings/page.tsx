import { requireUser } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsForm } from "@/components/forms/settings-form";

export default async function DashboardSettingsPage() {
  await requireUser();

  return (
    <DashboardShell
      currentPath="/dashboard/settings"
      title="সেটিংস"
      description="নোটিফিকেশন, privacy preferences এবং account behavior এখান থেকে নিয়ন্ত্রণ করুন।"
    >
      <SettingsForm />
    </DashboardShell>
  );
}
