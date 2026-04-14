import { RouteLoading } from "@/components/shared/route-loading";

export default function DashboardLoading() {
  return (
    <RouteLoading
      badge="ব্যক্তিগত ড্যাশবোর্ড"
      title="ড্যাশবোর্ড লোড হচ্ছে"
      description="আপনার প্রোফাইল, অনুরোধ এবং সেটিংস দ্রুত প্রস্তুত করা হচ্ছে।"
    />
  );
}
