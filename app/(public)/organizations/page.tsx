import Link from "next/link";
import { Building2, Users } from "lucide-react";
import { getOrganizations } from "@/lib/data";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <PageShell eyebrow="সংগঠন" title="যুক্ত সংগঠনসমূহ">
      <div className="grid gap-5 md:grid-cols-2">
        {organizations.map((organization) => (
          <Link key={organization.id} href={`/organizations/${organization.slug}`} className="block">
            <Card className="h-full border-border/70 transition-transform duration-200 hover:-translate-y-1">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold">{organization.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {organization.upazila}, {organization.district}
                    </p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-muted-foreground">{organization.description}</p>
                <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                  <Users className="h-4 w-4" />
                  {organization.member_count ?? 0} জন যুক্ত
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
