import { requireAdmin } from "@/lib/auth";
import { getAdminRequests } from "@/lib/data";
import { toggleRequestStatusAction } from "@/lib/actions/platform-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminRequestsPage() {
  await requireAdmin();
  const requests = await getAdminRequests();

  return (
    <AdminShell
      currentPath="/admin/requests"
      title="রক্তের অনুরোধ ম্যানেজ"
      description="রিকোয়েস্ট approve/remove, status update এবং জরুরি অনুরোধের moderation এখানে করা যাবে।"
    >
      <Card className="border-border/70">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>রোগী</TableHead>
                <TableHead>গ্রুপ</TableHead>
                <TableHead>হাসপাতাল</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.patient_name}</TableCell>
                  <TableCell>{request.blood_group}</TableCell>
                  <TableCell>{request.hospital_name}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell className="flex gap-2">
                    {["Open", "In progress", "Fulfilled"].map((status) => (
                      <form
                        key={status}
                        action={async () => {
                          "use server";
                          await toggleRequestStatusAction(request.id, status);
                        }}
                      >
                        <Button size="sm" variant="outline" type="submit">
                          {status}
                        </Button>
                      </form>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
