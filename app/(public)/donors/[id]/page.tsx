import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, HeartPulse, MapPin, PhoneCall, ShieldAlert } from "lucide-react";
import { getDonorById } from "@/lib/data";
import { formatDate, getAvailabilityFromLastDonation, maskPhone } from "@/lib/utils";
import { PageShell } from "@/components/layout/page-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function DonorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const donor = await getDonorById(id);
  if (!donor) return notFound();
  const availability = getAvailabilityFromLastDonation(donor.last_donated_at);

  return (
    <PageShell
      eyebrow="ডোনার প্রোফাইল"
      title={donor.full_name}
      description="ডোনারের রক্তের গ্রুপ, লোকেশন, availability, donation history signal এবং privacy-aware যোগাযোগ তথ্য।"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70 lg:sticky lg:top-28 lg:h-fit">
          <CardContent className="space-y-6 p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 rounded-3xl">
                <AvatarImage src={donor.profile_photo_url ?? ""} alt={donor.full_name} />
                <AvatarFallback className="rounded-3xl">{donor.full_name.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="danger">{donor.blood_group}</Badge>
                  <Badge variant={availability.tone}>{availability.label}</Badge>
                  {donor.is_verified ? (
                    <Badge variant="success" className="gap-1">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      ভেরিফায়েড
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">যোগাযোগের জন্য লগইন করলে সম্পূর্ণ নম্বর দেখা যাবে</p>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl bg-secondary/60 p-5 text-sm">
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {donor.address}
              </p>
              <p className="inline-flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-primary" />
                {maskPhone(donor.phone)}
              </p>
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                সর্বশেষ রক্তদান: {formatDate(donor.last_donated_at)}
              </p>
              <p className="inline-flex items-center gap-2">
                <HeartPulse className="h-4 w-4 text-primary" />
                মোট রক্তদান: {donor.total_donations} বার
              </p>
            </div>
            <p className="text-sm leading-7 text-muted-foreground">{donor.bio}</p>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/70">
            <CardContent className="grid gap-5 p-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">লিঙ্গ</p>
                <p className="mt-1 font-medium">{donor.gender === "male" ? "পুরুষ" : donor.gender === "female" ? "নারী" : "অন্যান্য"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ওজন</p>
                <p className="mt-1 font-medium">{donor.weight ?? "তথ্য নেই"} কেজি</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">জরুরি ডোনেশনে আগ্রহ</p>
                <p className="mt-1 font-medium">{donor.can_donate_urgently ? "হ্যাঁ" : "না"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">জরুরি যোগাযোগ</p>
                <p className="mt-1 font-medium">{maskPhone(donor.emergency_contact ?? donor.phone)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-secondary/60 p-4">
                <p className="text-sm text-muted-foreground">রক্তের গ্রুপ</p>
                <p className="mt-2 font-display text-2xl font-semibold text-primary">{donor.blood_group}</p>
              </div>
              <div className="rounded-2xl bg-secondary/60 p-4">
                <p className="text-sm text-muted-foreground">মোট ডোনেশন</p>
                <p className="mt-2 font-display text-2xl font-semibold">{donor.total_donations}</p>
              </div>
              <div className="rounded-2xl bg-secondary/60 p-4">
                <p className="text-sm text-muted-foreground">availability</p>
                <p className="mt-2 font-display text-2xl font-semibold">{availability.label}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-display text-xl font-semibold">Eligibility hint</h2>
              <div className="rounded-2xl border border-warning/20 bg-warning/8 p-4 text-sm leading-7 text-muted-foreground">
                <p className="inline-flex items-start gap-2">
                  <ShieldAlert className="mt-1 h-4 w-4 text-warning" />
                  donor-এর সর্বশেষ রক্তদানের তারিখ অনুযায়ী availability badge দেখানো হয়েছে। রোগী ও donor-এর
                  নিরাপত্তার জন্য যোগাযোগের আগে উপযুক্ত ব্যবধান ও শারীরিক সক্ষমতা নিশ্চিত করা উচিত।
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
