"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { forgotPasswordAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [pending, startTransition] = useTransition();

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>পাসওয়ার্ড রিসেট</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          action={(formData) =>
            startTransition(async () => {
              const result = await forgotPasswordAction(String(formData.get("email") ?? ""));
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
            })
          }
        >
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button className="w-full" type="submit" disabled={pending}>
            {pending ? "পাঠানো হচ্ছে..." : "রিসেট লিংক পাঠান"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
