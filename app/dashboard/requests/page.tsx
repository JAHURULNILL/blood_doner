import { requireUser } from "@/lib/auth";
import { getCurrentUserRequests } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { BloodRequestCard } from "@/components/cards/request-card";
import { EmptyState } from "@/components/sections/empty-state";

export default async function DashboardRequestsPage() {
  const user = await requireUser();
  const requests = await getCurrentUserRequests(user.id);

  return (
    <DashboardShell
      currentPath="/dashboard/requests"
      title="আমার রক্তের অনুরোধ"
      description="আপনার প্রকাশিত request-গুলো দেখুন, নতুন request তৈরি করুন এবং status track করুন।"
    >
      <BloodRequestForm />
      <div className="space-y-4">
        {requests.length ? (
          requests.map((request) => <BloodRequestCard key={request.id} request={request} />)
        ) : (
          <EmptyState
            title="আপনার কোনো রক্তের অনুরোধ নেই"
            description="নতুন request publish করলে সেটা এই page-এ live update হয়ে দেখা যাবে।"
          />
        )}
      </div>
    </DashboardShell>
  );
}
