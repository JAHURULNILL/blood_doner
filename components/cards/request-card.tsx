import Link from "next/link";
import { CalendarDays, CircleAlert, Hospital, MapPinned, UserRound } from "lucide-react";
import type { BloodRequest } from "@/lib/types";
import { formatDate, formatRelative } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function urgencyVariant(urgency: BloodRequest["urgency"]) {
  if (urgency === "Emergency") return "danger" as const;
  if (urgency === "Urgent") return "warning" as const;
  return "default" as const;
}

export function BloodRequestCard({ request }: { request: BloodRequest }) {
  return (
    <Card className="border-border/70">
      <CardContent className="space-y-5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="danger">{request.blood_group}</Badge>
              <Badge variant={urgencyVariant(request.urgency)}>
                {request.urgency === "Emergency"
                  ? "জরুরি"
                  : request.urgency === "Urgent"
                    ? "অতি দ্রুত"
                    : "স্বাভাবিক"}
              </Badge>
              <Badge variant="outline">{request.status}</Badge>
            </div>
            <h3 className="font-display text-xl font-semibold">{request.patient_name}</h3>
            <p className="text-sm leading-7 text-muted-foreground">{request.details}</p>
          </div>
          <div className="rounded-2xl bg-secondary/60 px-4 py-3 text-right">
            <p className="text-xs text-muted-foreground">প্রয়োজন</p>
            <p className="font-display text-2xl font-semibold">{request.quantity_bags} ব্যাগ</p>
          </div>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="inline-flex items-center gap-2">
            <Hospital className="h-4 w-4" />
            {request.hospital_name}
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPinned className="h-4 w-4" />
            {request.upazila}, {request.district}
          </div>
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDate(request.required_date)}
          </div>
          <div className="inline-flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            {request.contact_name}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>প্রকাশিত {formatRelative(request.created_at)}</span>
            <span className="inline-flex items-center gap-1">
              <CircleAlert className="h-4 w-4 text-primary" />
              {request.responder_count ?? 0} জন সাড়া দিয়েছেন
            </span>
          </div>
          <Button asChild>
            <Link href={`/requests/${request.id}`}>বিস্তারিত দেখুন</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
