import { getCampaigns } from "@/lib/data";
import { CampaignCard } from "@/components/cards/campaign-card";
import { PageShell } from "@/components/layout/page-shell";

export default async function CampaignsPage() {
  const campaigns = await getCampaigns();

  return (
    <PageShell
      eyebrow="ক্যাম্পেইন"
      title="আসন্ন ও চলমান রক্তদান ক্যাম্পেইন"
      description="ডোনার engagement, community awareness এবং offline event coordination-এর জন্য upcoming আয়োজনগুলো দেখুন।"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </PageShell>
  );
}
