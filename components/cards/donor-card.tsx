import Link from "next/link";
import { MapPin, Phone, ShieldCheck, TimerReset } from "lucide-react";
import type { DonorProfile } from "@/lib/types";
import { formatDate, getAvailabilityFromLastDonation, maskPhone } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface DonorCardProps {
  donor: DonorProfile;
  revealPhone?: boolean;
}

export function DonorCard({ donor, revealPhone = false }: DonorCardProps) {
  const availability = getAvailabilityFromLastDonation(donor.last_donated_at);

  return (
    <Card className="border-border/70 bg-white/90 shadow-soft transition-transform duration-200 hover:-translate-y-1">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-14 w-14 rounded-[1.2rem] ring-1 ring-border/70">
            <AvatarImage src={donor.profile_photo_url ?? ""} alt={donor.full_name} />
            <AvatarFallback className="rounded-[1.2rem]">{donor.full_name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold">{donor.full_name}</h3>
              <Badge variant="danger">{donor.blood_group}</Badge>
              {donor.is_verified ? (
                <Badge variant="success" className="gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ভেরিফায়েড
                </Badge>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {donor.upazila}, {donor.district}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {revealPhone ? donor.phone : maskPhone(donor.phone)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] bg-secondary/55 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">সর্বশেষ রক্তদান</p>
            <p className="mt-1 font-medium">{formatDate(donor.last_donated_at)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">মোট রক্তদান</p>
            <p className="mt-1 font-medium">{donor.total_donations} বার</p>
          </div>
          <div>
            <p className="text-muted-foreground">উপস্থিতি</p>
            <div className="mt-1 flex items-center gap-2">
              <TimerReset className="h-4 w-4 text-primary" />
              <span className="font-medium">{availability.label}</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">জরুরি সাড়া</p>
            <p className="mt-1 font-medium">{donor.can_donate_urgently ? "হ্যাঁ" : "না"}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="line-clamp-2 flex-1 text-sm leading-7 text-muted-foreground">{donor.bio}</p>
          <Button variant="outline" asChild>
            <Link href={`/donors/${donor.id}`} prefetch>
              প্রোফাইল দেখুন
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
