import { requireAdmin } from "@/lib/auth";
import { demoDonors } from "@/lib/demo-data";
import { toggleDonorVerificationAction } from "@/lib/actions/platform-actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function AdminDonorsPage() {
  await requireAdmin();

  return (
    <AdminShell
      currentPath="/admin/donors"
      title="ডোনার ম্যানেজমেন্ট"
      description="ডোনার তালিকা, verification status, availability এবং basic donor profile oversight এখানে আছে।"
    >
      <Card className="border-border/70">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>নাম</TableHead>
                <TableHead>গ্রুপ</TableHead>
                <TableHead>লোকেশন</TableHead>
                <TableHead>স্ট্যাটাস</TableHead>
                <TableHead>অ্যাকশন</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoDonors.map((donor) => (
                <TableRow key={donor.id}>
                  <TableCell>{donor.full_name}</TableCell>
                  <TableCell>{donor.blood_group}</TableCell>
                  <TableCell>
                    {donor.upazila}, {donor.district}
                  </TableCell>
                  <TableCell>
                    <Badge variant={donor.is_verified ? "success" : "outline"}>
                      {donor.is_verified ? "ভেরিফায়েড" : "অভেরিফায়েড"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <form
                      action={async () => {
                        "use server";
                        await toggleDonorVerificationAction(donor.id, !donor.is_verified);
                      }}
                    >
                      <Button size="sm" variant="outline" type="submit">
                        {donor.is_verified ? "Unverify" : "Verify"}
                      </Button>
                    </form>
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
