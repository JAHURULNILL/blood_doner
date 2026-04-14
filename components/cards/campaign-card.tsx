import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Campaign } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="border-border/70">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={campaign.banner_image_url ?? "https://placehold.co/1200x700"}
          alt={campaign.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {campaign.is_featured ? <Badge variant="success">ফিচার্ড</Badge> : null}
          <Badge variant="outline">{campaign.organizer}</Badge>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold">{campaign.title}</h3>
          <p className="line-clamp-3 text-sm leading-7 text-muted-foreground">{campaign.summary}</p>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {formatDate(campaign.event_date)}
          </div>
          <div className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {campaign.location}
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/campaigns/${campaign.slug}`}>বিস্তারিত</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
