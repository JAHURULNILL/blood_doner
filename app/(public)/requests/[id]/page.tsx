import { notFound } from "next/navigation";
import { CalendarDays, Hospital, MapPinned, PhoneCall, UserRound } from "lucide-react";
import { getRequestById } from "@/lib/data";
import { respondToRequestAction } from "@/lib/actions/platform-actions";
import { formatDate, formatRelative } from "@/lib/utils";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function RequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const request = await getRequestById(id);
  if (!request) return notFound();

  return (
    <PageShell
      eyebrow="রিকোয়েস্ট ডিটেইলস"
      title={`${request.patient_name} এর জন্য ${request.blood_group} প্রয়োজন`}
      description="রোগী, হাসপাতাল, লোকেশন, urgency, যোগাযোগ এবং donor response action একসাথে দেখুন।"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="danger">{request.blood_group}</Badge>
              <Badge variant={request.urgency === "Emergency" ? "danger" : request.urgency === "Urgent" ? "warning" : "default"}>
                {request.urgency}
              </Badge>
              <Badge variant="outline">{request.status}</Badge>
            </div>
            <p className="text-base leading-8 text-muted-foreground">{request.details}</p>
            <div className="grid gap-4 rounded-2xl bg-secondary/60 p-5 text-sm">
              <p className="inline-flex items-center gap-2">
                <Hospital className="h-4 w-4 text-primary" />
                {request.hospital_name}
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPinned className="h-4 w-4 text-primary" />
                {request.address}
              </p>
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                প্রয়োজনের তারিখ: {formatDate(request.required_date)}
              </p>
              <p className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                যোগাযোগ: {request.contact_name}
              </p>
              <p className="inline-flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-primary" />
                {request.contact_phone}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-display text-xl font-semibold">Donor response</h2>
              <p className="text-sm leading-7 text-muted-foreground">
                যদি আপনি donor হন এবং সাহায্য করতে আগ্রহী থাকেন, তাহলে নিচের action ব্যবহার করুন। requester
                পরে আপনাকে যোগাযোগ করতে পারবেন।
              </p>
              <form
                action={async () => {
                  "use server";
                  await respondToRequestAction(request.id);
                }}
              >
                <Button type="submit" className="w-full">
                  আমি রক্ত দিতে আগ্রহী
                </Button>
              </form>
              <Button variant="outline" className="w-full" asChild>
                <a href={`tel:${request.contact_phone}`}>অনুরোধকারীর সাথে যোগাযোগ</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
              <p>প্রকাশিত: {formatRelative(request.created_at)}</p>
              <p>সাড়া দিয়েছেন: {request.responder_count ?? 0} জন donor</p>
              <p>লোকেশন: {request.upazila}, {request.district}, {request.division}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
