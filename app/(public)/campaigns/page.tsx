import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";

const medicalCamps = [
  {
    id: "camp-1",
    title: "Free Medical Camp",
    location: "কাশিনাথপুর, পাবনা",
    dateLabel: "চলমান প্রদর্শনী",
    image: "/one.jpg"
  },
  {
    id: "camp-2",
    title: "Free Medical Camp",
    location: "বাংলাদেশ কমিউনিটি উদ্যোগ",
    dateLabel: "সাম্প্রতিক আয়োজন",
    image: "/two.jpg"
  }
] as const;

export default function CampaignsPage() {
  return (
    <PageShell
      eyebrow="ক্যাম্পেইন"
      title="Free Medical Camp"
      description="সাম্প্রতিক community medical camp-এর কিছু বাস্তব দৃশ্য এখানে রাখা হয়েছে।"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {medicalCamps.map((camp) => (
          <Card
            key={camp.id}
            className="overflow-hidden border border-border/70 bg-white/95 shadow-[0_24px_50px_-34px_rgba(15,23,42,0.18)]"
          >
            <div className="relative aspect-[16/11] overflow-hidden bg-slate-100">
              <Image src={camp.image} alt={camp.title} fill className="object-cover" />
            </div>

            <CardContent className="space-y-4 p-6">
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-semibold text-foreground">{camp.title}</h2>
                <p className="text-sm leading-7 text-muted-foreground">
                  স্থানীয় পর্যায়ে সচেতনতা, প্রাথমিক স্বাস্থ্য সহায়তা এবং কমিউনিটি অংশগ্রহণ নিয়ে এই আয়োজনগুলো করা হয়েছে।
                </p>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-primary" />
                  {camp.dateLabel}
                </div>
                <div className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {camp.location}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
