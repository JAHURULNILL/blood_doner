import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, MapPin, PhoneCall, Users } from "lucide-react";
import { getOrganizationBySlug, getOrganizationMembers } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrganizationDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const organization = await getOrganizationBySlug(slug);

  if (!organization) return notFound();

  const members = await getOrganizationMembers(organization.id);

  return (
    <PageShell eyebrow="সংগঠন প্রোফাইল" title={organization.name}>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70">
          <CardContent className="space-y-5 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.6rem] bg-primary/10 text-primary">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <Badge variant="danger">সংগঠন</Badge>
                <p className="text-sm leading-7 text-muted-foreground">{organization.description}</p>
              </div>
            </div>

            <div className="grid gap-4 rounded-[1.5rem] bg-secondary/55 p-4 text-sm">
              <p className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                মোট যুক্ত সদস্য: {members.length} জন
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                {organization.upazila}, {organization.district}, {organization.division}
              </p>
              <p className="inline-flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-primary" />
                {organization.contact_phone}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="font-display text-2xl font-semibold">এই সংগঠনের হয়ে যারা যুক্ত হয়েছেন</h2>
          {members.length ? (
            <div className="grid gap-4">
              {members.map((member) => (
                <Card key={member.id} className="border-border/70">
                  <CardContent className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{member.full_name}</p>
                        {member.donor_profile?.blood_group ? <Badge variant="danger">{member.donor_profile.blood_group}</Badge> : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {member.donor_profile
                          ? `${member.donor_profile.upazila}, ${member.donor_profile.district}`
                          : "ডোনার প্রোফাইল এখনো সম্পূর্ণ হয়নি"}
                      </p>
                      <p className="text-xs text-muted-foreground">যুক্ত হয়েছেন: {formatDate(member.created_at)}</p>
                    </div>
                    {member.donor_profile ? (
                      <Link href={`/donors/${member.donor_profile.id}`} className="text-sm font-medium text-primary">
                        প্রোফাইল দেখুন
                      </Link>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-border/70">
              <CardContent className="p-6 text-sm text-muted-foreground">এখনো কেউ এই সংগঠনের হয়ে যুক্ত হয়নি।</CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
}
