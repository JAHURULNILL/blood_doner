import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">404</p>
        <h1 className="font-display text-4xl font-semibold">পৃষ্ঠা খুঁজে পাওয়া যায়নি</h1>
        <p className="max-w-xl text-muted-foreground">
          আপনি যে পাতাটি খুঁজছেন সেটি হয়তো সরানো হয়েছে অথবা ঠিকানায় ভুল আছে।
        </p>
      </div>
      <Button asChild>
        <Link href="/">হোমে ফিরুন</Link>
      </Button>
    </div>
  );
}
