import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { getCampaignBySlug } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return notFound();

  return (
    <PageShell eyebrow="ক্যাম্পেইন ডিটেইলস" title={campaign.title} description={campaign.summary}>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardContent className="space-y-5 p-6">
            <p className="text-base leading-8 text-muted-foreground">{campaign.description}</p>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              {formatDate(campaign.event_date)}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {campaign.location}
            </p>
            <p className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {campaign.organizer}
            </p>
            <p>যোগাযোগ: {campaign.contact_info}</p>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
