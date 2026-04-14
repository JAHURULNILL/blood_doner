import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="container-shell grid min-h-screen items-center py-10 lg:grid-cols-[1fr_620px]">
      <div className="hidden max-w-2xl space-y-6 lg:block">
        <p className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
          নতুন রেজিস্ট্রেশন
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight">দায়িত্বশীল donor community-এর অংশ হোন</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          রক্তদাতা প্রোফাইল, verified request response, donation history এবং health-focused dashboard একসাথে পাবেন।
        </p>
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <RegisterForm />
      </div>
    </div>
  );
}
