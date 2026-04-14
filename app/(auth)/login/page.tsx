import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="container-shell grid min-h-screen items-center py-10 lg:grid-cols-[1fr_520px]">
      <div className="hidden max-w-2xl space-y-6 lg:block">
        <p className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
          সুরক্ষিত লগইন
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight">আপনার donor journey আবার শুরু করুন</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          ড্যাশবোর্ডে প্রবেশ করে প্রোফাইল আপডেট করুন, response history দেখুন এবং নতুন রক্তের অনুরোধ পরিচালনা করুন।
        </p>
      </div>
      <div className="mx-auto w-full max-w-xl space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          হোমে ফিরে যেতে চাইলে <Link href="/" className="text-primary">এখানে ক্লিক করুন</Link>
        </p>
      </div>
    </div>
  );
}
