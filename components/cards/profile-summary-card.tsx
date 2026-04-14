import { CheckCircle2, Droplets, HeartPulse, PhoneCall } from "lucide-react";
import type { DonorProfile } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileSummaryCard({ donor, completion }: { donor: DonorProfile; completion: number }) {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>প্রোফাইল সারাংশ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">সম্পূর্ণতা</span>
            <span className="font-medium">{completion}%</span>
          </div>
          <Progress value={completion} />
        </div>
        <div className="grid gap-3 rounded-2xl bg-secondary/60 p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4" />
              রক্তের গ্রুপ
            </span>
            <span className="font-medium">{donor.blood_group}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <HeartPulse className="h-4 w-4" />
              সর্বশেষ রক্তদান
            </span>
            <span className="font-medium">{formatDate(donor.last_donated_at)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              মোট ডোনেশন
            </span>
            <span className="font-medium">{donor.total_donations}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <PhoneCall className="h-4 w-4" />
              জরুরি নম্বর
            </span>
            <span className="font-medium">{donor.emergency_contact ?? "যোগ হয়নি"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
