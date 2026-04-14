"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saveSettingsAction } from "@/lib/actions/platform-actions";
import { settingsSchema } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { z } from "zod";

type SettingsValues = z.infer<typeof settingsSchema>;

export function SettingsForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      publicPhone: false
    }
  });

  const submit = (values: SettingsValues) => {
    startTransition(async () => {
      const result = await saveSettingsAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
    });
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>নোটিফিকেশন ও গোপনীয়তা</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={form.handleSubmit(submit)}>
          {[
            { key: "emailNotifications", label: "ইমেইল নোটিফিকেশন" },
            { key: "smsNotifications", label: "এসএমএস নোটিফিকেশন" },
            { key: "publicPhone", label: "পাবলিক প্রোফাইলে ফোন নম্বর আংশিক দেখান" }
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between rounded-2xl border border-border p-4">
              <span className="text-sm font-medium">{item.label}</span>
              <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" {...form.register(item.key as keyof SettingsValues)} />
            </label>
          ))}
          <Button type="submit" disabled={pending}>
            {pending ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
