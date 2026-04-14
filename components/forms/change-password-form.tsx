"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import type { z } from "zod";
import { changePasswordAction } from "@/lib/actions/auth-actions";
import { changePasswordSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  const submit = (values: ChangePasswordValues) => {
    startTransition(async () => {
      const result = await changePasswordAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.reset();
    });
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>পাসওয়ার্ড পরিবর্তন</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={form.handleSubmit(submit)}>
          <div>
            <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
            <Input id="password" type="password" {...form.register("password")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.password?.message}</p>
          </div>
          <div>
            <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড আবার লিখুন</Label>
            <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.confirmPassword?.message}</p>
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
