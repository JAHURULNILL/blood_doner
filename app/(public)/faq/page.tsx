import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function FAQPage() {
  const faqs = [
    {
      q: "ডোনার availability কীভাবে নির্ধারণ করা হয়?",
      a: "সর্বশেষ রক্তদানের তারিখ, প্রোফাইল তথ্য এবং donor-এর self-declared availability status মিলিয়ে hint দেখানো হয়।"
    },
    {
      q: "পাবলিক ভিজিটর কি পুরো ফোন নম্বর দেখতে পাবে?",
      a: "না, privacy-conscious behavior হিসেবে public visitor-দের জন্য ফোন নম্বর আংশিক লুকানো থাকতে পারে।"
    },
    {
      q: "রক্তের অনুরোধ কে প্রকাশ করতে পারে?",
      a: "নিবন্ধিত ব্যবহারকারীরা request create করতে পারেন এবং admin panel থেকে সেগুলো moderation করা যায়।"
    },
    {
      q: "ডোনার response কীভাবে কাজ করে?",
      a: "লগইন করা donor request detail page থেকে আগ্রহ জানাতে পারেন, তারপর requester সরাসরি যোগাযোগ করতে পারেন।"
    }
  ];

  return (
    <PageShell
      eyebrow="সাধারণ জিজ্ঞাসা"
      title="প্রায় জিজ্ঞাসিত প্রশ্ন"
      description="রক্তদান, donor eligibility, request flow, privacy এবং platform ব্যবহারের সাধারণ উত্তরগুলো এখানে পাওয়া যাবে।"
    >
      <div className="grid gap-4">
        {faqs.map((faq) => (
          <Card key={faq.q} className="border-border/70">
            <CardContent className="space-y-2 p-6">
              <h2 className="font-display text-xl font-semibold">{faq.q}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{faq.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
