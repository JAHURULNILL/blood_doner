import { requireUser } from "@/lib/auth";
import { demoRequests } from "@/lib/demo-data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { BloodRequestForm } from "@/components/forms/blood-request-form";
import { BloodRequestCard } from "@/components/cards/request-card";

export default async function DashboardRequestsPage() {
  const user = await requireUser();
  const requests = demoRequests.filter((item) => item.created_by === user.id);

  return (
    <DashboardShell
      currentPath="/dashboard/requests"
      title="আমার রক্তের অনুরোধ"
      description="আপনার প্রকাশিত request-গুলো দেখুন, নতুন request তৈরি করুন এবং status track করুন।"
    >
      <BloodRequestForm />
      <div className="space-y-4">
        {requests.map((request) => (
          <BloodRequestCard key={request.id} request={request} />
        ))}
      </div>
    </DashboardShell>
  );
}
