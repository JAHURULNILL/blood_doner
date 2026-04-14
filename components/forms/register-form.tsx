"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerAction } from "@/lib/actions/auth-actions";
import { registerSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { z } from "zod";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });

  const onSubmit = (values: RegisterValues) => {
    startTransition(async () => {
      const result = await registerAction(values);
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
        <CardTitle>নতুন অ্যাকাউন্ট তৈরি করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="fullName">পূর্ণ নাম</Label>
            <Input id="fullName" {...form.register("fullName")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.fullName?.message}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="email">ইমেইল</Label>
              <Input id="email" type="email" {...form.register("email")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.email?.message}</p>
            </div>
            <div>
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input id="phone" {...form.register("phone")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.phone?.message}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input id="password" type="password" {...form.register("password")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.password?.message}</p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
              <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.confirmPassword?.message}</p>
            </div>
          </div>
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-primary">
              লগইন করুন
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
