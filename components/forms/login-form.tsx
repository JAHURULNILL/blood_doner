"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { loginAction } from "@/lib/actions/auth-actions";
import { loginSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { z } from "zod";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = (values: LoginValues) => {
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push("/dashboard");
      router.refresh();
    });
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>লগইন করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" type="email" {...form.register("email")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.email?.message}</p>
          </div>
          <div>
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input id="password" type="password" {...form.register("password")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.password?.message}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link href="/forgot-password" className="text-primary">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
            <Link href="/register" className="text-muted-foreground hover:text-foreground">
              নতুন অ্যাকাউন্ট
            </Link>
          </div>
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "লগইন হচ্ছে..." : "লগইন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
