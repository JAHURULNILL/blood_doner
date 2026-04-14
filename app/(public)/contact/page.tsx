import { Mail, MapPin, PhoneCall } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PageShell } from "@/components/layout/page-shell";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="যোগাযোগ"
      title="সহায়তা, অংশীদারিত্ব বা জরুরি সমন্বয়ের জন্য যোগাযোগ করুন"
      description="সংগঠন, হাসপাতাল, কমিউনিটি ভলান্টিয়ার বা donor support বিষয়ে যোগাযোগের জন্য আমাদের সাথে সংযুক্ত থাকুন।"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-6 text-sm text-muted-foreground">
            <p className="inline-flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-primary" />
              01710-000000
            </p>
            <p className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              support@roktosetu.com
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              ঢাকা, বাংলাদেশ
            </p>
          </CardContent>
        </Card>
        <ContactForm />
      </div>
    </PageShell>
  );
}
