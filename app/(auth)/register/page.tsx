import { RegisterForm } from "@/components/forms/register-form";
import { getOrganizations } from "@/lib/data";

export default async function RegisterPage() {
  const organizations = await getOrganizations();

  return (
    <div className="container-shell grid min-h-screen items-center py-10 lg:grid-cols-[1fr_620px]">
      <div className="hidden max-w-2xl space-y-6 lg:block">
        <p className="inline-flex rounded-full border border-primary/15 bg-primary/6 px-4 py-1 text-sm text-primary">
          নতুন রেজিস্ট্রেশন
        </p>
        <h1 className="font-display text-5xl font-semibold tracking-tight">দায়িত্বশীল donor community-র অংশ হোন</h1>
        <p className="text-lg leading-8 text-muted-foreground">
          চাইলে কোনো সংগঠনের অধীনে যুক্ত হতে পারবেন, আর না হলে নিজস্বভাবেও রেজিস্ট্রেশন করতে পারবেন।
        </p>
      </div>
      <div className="mx-auto w-full max-w-2xl">
        <RegisterForm organizations={organizations} />
      </div>
    </div>
  );
}
