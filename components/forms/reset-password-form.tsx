"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { resetPasswordAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>নতুন পাসওয়ার্ড সেট করুন</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          action={(formData) =>
            startTransition(async () => {
              const password = String(formData.get("password") ?? "");
              const result = await resetPasswordAction(password);
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              router.push("/login");
            })
          }
        >
          <div>
            <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
            <Input id="password" name="password" type="password" minLength={6} required />
          </div>
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "আপডেট হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
