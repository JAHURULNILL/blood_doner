import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="আমাদের সম্পর্কে"
      title="মানবিকতা, নির্ভরযোগ্যতা এবং পরিষ্কার প্রযুক্তির সমন্বয়"
      description="রক্তসেতু এমন একটি প্ল্যাটফর্ম যা donor, রোগীর স্বজন, হাসপাতাল এবং স্বেচ্ছাসেবকদের মধ্যে দ্রুত ও দায়িত্বশীল সংযোগ তৈরি করে।"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: HeartHandshake,
            title: "কমিউনিটি-ফার্স্ট",
            body: "প্রতিটি donor profile এবং request flow এমনভাবে সাজানো হয়েছে যাতে যোগাযোগ দ্রুত ও সহজ হয়।"
          },
          {
            icon: ShieldCheck,
            title: "বিশ্বাসযোগ্য অভিজ্ঞতা",
            body: "ভেরিফিকেশন, moderation এবং privacy-conscious তথ্য প্রদর্শনের মাধ্যমে আস্থা তৈরি করা হয়।"
          },
          {
            icon: Sparkles,
            title: "মিনিমাল কিন্তু শক্তিশালী",
            body: "ক্লাটারহীন premium UI, subtle motion, mobile-first layout এবং fast workflows।"
          }
        ].map((item) => (
          <Card key={item.title} className="border-border/70">
            <CardContent className="space-y-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-xl font-semibold">{item.title}</h2>
              <p className="text-sm leading-7 text-muted-foreground">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}
