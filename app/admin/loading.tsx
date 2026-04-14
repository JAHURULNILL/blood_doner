import { RouteLoading } from "@/components/shared/route-loading";

export default function AdminLoading() {
  return (
    <RouteLoading
      badge="অ্যাডমিন কন্ট্রোল"
      title="অ্যাডমিন প্যানেল লোড হচ্ছে"
      description="ডোনার, রিকোয়েস্ট এবং কনটেন্ট ম্যানেজমেন্ট ডেটা প্রস্তুত করা হচ্ছে।"
    />
  );
}
