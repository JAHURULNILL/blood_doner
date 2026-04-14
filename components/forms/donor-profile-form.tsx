"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bloodGroups, divisions } from "@/lib/constants";
import { saveDonorProfileAction } from "@/lib/actions/platform-actions";
import { donorProfileSchema } from "@/lib/schemas";
import { uploadFileToStorage } from "@/lib/uploads";
import type { DonorProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import type { z } from "zod";

type DonorProfileValues = z.infer<typeof donorProfileSchema>;

interface DonorProfileFormProps {
  donor?: DonorProfile | null;
}

function getDateInputValue(value?: string | null) {
  if (!value) return "";
  return value.includes("T") ? value.slice(0, 10) : value;
}

export function DonorProfileForm({ donor }: DonorProfileFormProps) {
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const form = useForm<DonorProfileValues>({
    resolver: zodResolver(donorProfileSchema),
    defaultValues: {
      fullName: donor?.full_name ?? "",
      email: donor?.email ?? "",
      phone: donor?.phone ?? "",
      bloodGroup: donor?.blood_group ?? "A+",
      gender: donor?.gender ?? "male",
      dateOfBirth: getDateInputValue(donor?.date_of_birth),
      weight: donor?.weight ?? 50,
      division: donor?.division ?? divisions[0],
      district: donor?.district ?? "",
      upazila: donor?.upazila ?? "",
      address: donor?.address ?? "",
      lastDonatedAt: getDateInputValue(donor?.last_donated_at),
      totalDonations: donor?.total_donations ?? 0,
      emergencyContact: donor?.emergency_contact ?? "",
      bio: donor?.bio ?? "",
      canDonateUrgently: donor?.can_donate_urgently ?? false,
      availabilityStatus: donor?.availability_status ?? "available"
    }
  });

  const submit = (values: DonorProfileValues) => {
    startTransition(async () => {
      try {
        let profilePhotoUrl = donor?.profile_photo_url ?? null;

        if (file) {
          const upload = await uploadFileToStorage("profile-photos", file, "donors");
          profilePhotoUrl = upload.publicUrl;
        }

        const result = await saveDonorProfileAction({ ...values, profilePhotoUrl });
        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        router.push("/dashboard/profile");
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : "প্রোফাইল সেভ করার সময় অপ্রত্যাশিত সমস্যা হয়েছে";
        toast.error(message);
      }
    });
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>ডোনার প্রোফাইল</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(submit)}>
          <ImageUploader label="প্রোফাইল ছবি" initialPreview={donor?.profile_photo_url} onFileSelect={setFile} />
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <Label htmlFor="fullName">পূর্ণ নাম</Label>
              <Input id="fullName" {...form.register("fullName")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.fullName?.message}</p>
            </div>
            <div>
              <Label htmlFor="email">ইমেইল</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>ফোন নম্বর</Label>
              <Input {...form.register("phone")} />
            </div>
            <div>
              <Label>রক্তের গ্রুপ</Label>
              <Select {...form.register("bloodGroup")}>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>লিঙ্গ</Label>
              <Select {...form.register("gender")}>
                <option value="male">পুরুষ</option>
                <option value="female">নারী</option>
                <option value="other">অন্যান্য</option>
              </Select>
            </div>
            <div>
              <Label>জন্মতারিখ</Label>
              <Input type="date" {...form.register("dateOfBirth")} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>ওজন (কেজি)</Label>
              <Input type="number" {...form.register("weight")} />
            </div>
            <div>
              <Label>বিভাগ</Label>
              <Select {...form.register("division")}>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>জেলা</Label>
              <Input {...form.register("district")} />
            </div>
            <div>
              <Label>উপজেলা / এলাকা</Label>
              <Input {...form.register("upazila")} />
            </div>
          </div>

          <div>
            <Label>পূর্ণ ঠিকানা</Label>
            <Textarea {...form.register("address")} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>সর্বশেষ রক্তদানের তারিখ</Label>
              <Input type="date" {...form.register("lastDonatedAt")} />
            </div>
            <div>
              <Label>মোট রক্তদান</Label>
              <Input type="number" {...form.register("totalDonations")} />
            </div>
            <div>
              <Label>ইমার্জেন্সি কন্ট্যাক্ট</Label>
              <Input {...form.register("emergencyContact")} />
            </div>
            <div>
              <Label>বর্তমান স্ট্যাটাস</Label>
              <Select {...form.register("availabilityStatus")}>
                <option value="available">উপলভ্য</option>
                <option value="resting">বিশ্রামে</option>
                <option value="inactive">নিষ্ক্রিয়</option>
              </Select>
            </div>
          </div>

          <div>
            <Label>সংক্ষিপ্ত পরিচিতি</Label>
            <Textarea {...form.register("bio")} />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border p-4 text-sm">
            <input type="checkbox" className="h-4 w-4 accent-[hsl(var(--primary))]" {...form.register("canDonateUrgently")} />
            জরুরি রক্তের অনুরোধে দ্রুত সাড়া দিতে আগ্রহী
          </label>

          <Button type="submit" disabled={pending}>
            {pending ? "সেভ হচ্ছে..." : "প্রোফাইল সেভ করুন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
