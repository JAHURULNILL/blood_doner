"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { saveBloodBankAction, saveBlogAction, saveCampaignAction } from "@/lib/actions/platform-actions";
import { bloodBankSchema, blogSchema, campaignSchema } from "@/lib/schemas";
import { uploadFileToStorage } from "@/lib/uploads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import type { z } from "zod";

type BloodBankValues = z.infer<typeof bloodBankSchema>;
type BlogValues = z.infer<typeof blogSchema>;
type CampaignValues = z.infer<typeof campaignSchema>;

export function AdminBloodBankForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<BloodBankValues>({
    resolver: zodResolver(bloodBankSchema),
    defaultValues: {
      name: "",
      type: "blood_bank",
      division: "",
      district: "",
      address: "",
      phone: "",
      description: "",
      verified: true
    }
  });

  return (
    <Card className="border-border/70">
      <CardHeader><CardTitle>নতুন ব্লাড ব্যাংক / হাসপাতাল</CardTitle></CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) =>
            startTransition(async () => {
              const result = await saveBloodBankAction(values);
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              form.reset();
            })
          )}
        >
          <Input placeholder="নাম" {...form.register("name")} />
          <div className="grid gap-4 md:grid-cols-2">
            <Select {...form.register("type")}>
              <option value="blood_bank">Blood Bank</option>
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
            </Select>
            <Input placeholder="ফোন" {...form.register("phone")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="বিভাগ" {...form.register("division")} />
            <Input placeholder="জেলা" {...form.register("district")} />
          </div>
          <Input placeholder="ঠিকানা" {...form.register("address")} />
          <Textarea placeholder="সংক্ষিপ্ত বর্ণনা" {...form.register("description")} />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" {...form.register("verified")} />
            ভেরিফায়েড হিসেবে যোগ করুন
          </label>
          <Button disabled={pending}>{pending ? "সেভ হচ্ছে..." : "সেভ করুন"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminBlogForm() {
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<BlogValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", excerpt: "", content: "", authorName: "", featured: false }
  });

  return (
    <Card className="border-border/70">
      <CardHeader><CardTitle>নতুন ব্লগ প্রকাশ</CardTitle></CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) =>
            startTransition(async () => {
              let coverImageUrl: string | null = null;
              if (file) {
                coverImageUrl = (await uploadFileToStorage("blog-covers", file, "blogs")).publicUrl;
              }
              const result = await saveBlogAction({ ...values, coverImageUrl });
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              form.reset();
            })
          )}
        >
          <ImageUploader label="কভার ছবি" onFileSelect={setFile} />
          <Input placeholder="শিরোনাম" {...form.register("title")} />
          <Input placeholder="লেখকের নাম" {...form.register("authorName")} />
          <Textarea placeholder="সংক্ষিপ্ত বিবরণ" {...form.register("excerpt")} />
          <Textarea placeholder="মূল লেখা" className="min-h-48" {...form.register("content")} />
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" {...form.register("featured")} />
            ফিচার্ড ব্লগ হিসেবে দেখান
          </label>
          <Button disabled={pending}>{pending ? "প্রকাশ হচ্ছে..." : "ব্লগ প্রকাশ করুন"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminCampaignForm() {
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<CampaignValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      summary: "",
      description: "",
      location: "",
      eventDate: "",
      organizer: "",
      contactInfo: ""
    }
  });

  return (
    <Card className="border-border/70">
      <CardHeader><CardTitle>নতুন ক্যাম্পেইন</CardTitle></CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={form.handleSubmit((values) =>
            startTransition(async () => {
              let bannerImageUrl: string | null = null;
              if (file) {
                bannerImageUrl = (await uploadFileToStorage("campaign-banners", file, "campaigns")).publicUrl;
              }
              const result = await saveCampaignAction({ ...values, bannerImageUrl });
              if (!result.success) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              form.reset();
            })
          )}
        >
          <ImageUploader label="ব্যানার ছবি" onFileSelect={setFile} />
          <Input placeholder="শিরোনাম" {...form.register("title")} />
          <Textarea placeholder="সংক্ষিপ্ত সারাংশ" {...form.register("summary")} />
          <Textarea placeholder="বিস্তারিত" className="min-h-40" {...form.register("description")} />
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="লোকেশন" {...form.register("location")} />
            <Input type="datetime-local" {...form.register("eventDate")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="আয়োজক" {...form.register("organizer")} />
            <Input placeholder="যোগাযোগ" {...form.register("contactInfo")} />
          </div>
          <Button disabled={pending}>{pending ? "সেভ হচ্ছে..." : "ক্যাম্পেইন সেভ করুন"}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
