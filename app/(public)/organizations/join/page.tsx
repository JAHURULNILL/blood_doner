import { OrganizationForm } from "@/components/forms/organization-form";
import { PageShell } from "@/components/layout/page-shell";

export default function OrganizationJoinPage() {
  return (
    <PageShell eyebrow="সংগঠন" title="সংগঠন হিসাবে যুক্ত হোন">
      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="panel-muted p-6 sm:p-7">
          <h2 className="font-display text-2xl font-semibold">যা পাবেন</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
            <p>সংগঠনের নামে নিজস্ব public profile থাকবে।</p>
            <p>কে কে আপনার সংগঠনের হয়ে রেজিস্ট্রেশন করেছে তা দেখা যাবে।</p>
            <p>সংগঠনের মোট সদস্যসংখ্যা live count হিসেবে দেখা যাবে।</p>
          </div>
        </div>
        <OrganizationForm />
      </div>
    </PageShell>
  );
}
