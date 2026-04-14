"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bloodGroups, divisions } from "@/lib/constants";
import { createBloodRequestAction } from "@/lib/actions/platform-actions";
import { bloodRequestSchema } from "@/lib/schemas";
import { uploadFileToStorage } from "@/lib/uploads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/forms/image-uploader";
import type { z } from "zod";

type BloodRequestValues = z.infer<typeof bloodRequestSchema>;

export function BloodRequestForm() {
  const [pending, startTransition] = useTransition();
  const [file, setFile] = useState<File | null>(null);
  const form = useForm<BloodRequestValues>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "A+",
      quantityBags: 1,
      requiredDate: "",
      hospitalName: "",
      division: divisions[0],
      district: "",
      upazila: "",
      address: "",
      contactName: "",
      contactPhone: "",
      urgency: "Emergency",
      details: "",
      status: "Open"
    }
  });

  const submit = (values: BloodRequestValues) => {
    startTransition(async () => {
      let proofImageUrl: string | null = null;
      if (file) {
        const upload = await uploadFileToStorage("request-proofs", file, "requests");
        proofImageUrl = upload.publicUrl;
      }
      const result = await createBloodRequestAction({ ...values, proofImageUrl });
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
        <CardTitle>নতুন রক্তের অনুরোধ</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit(submit)}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>রোগীর নাম</Label>
              <Input {...form.register("patientName")} />
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
              <Label>ব্যাগ / ইউনিট</Label>
              <Input type="number" {...form.register("quantityBags")} />
            </div>
            <div>
              <Label>প্রয়োজনের তারিখ</Label>
              <Input type="date" {...form.register("requiredDate")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>হাসপাতালের নাম</Label>
              <Input {...form.register("hospitalName")} />
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
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>জেলা</Label>
              <Input {...form.register("district")} />
            </div>
            <div>
              <Label>উপজেলা / এলাকা</Label>
              <Input {...form.register("upazila")} />
            </div>
            <div>
              <Label>যোগাযোগ ব্যক্তি</Label>
              <Input {...form.register("contactName")} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>যোগাযোগ নম্বর</Label>
              <Input {...form.register("contactPhone")} />
            </div>
            <div>
              <Label>অগ্রাধিকার</Label>
              <Select {...form.register("urgency")}>
                <option value="Emergency">জরুরি</option>
                <option value="Urgent">অতি দ্রুত</option>
                <option value="Normal">স্বাভাবিক</option>
              </Select>
            </div>
          </div>

          <div>
            <Label>পূর্ণ ঠিকানা</Label>
            <Textarea {...form.register("address")} />
          </div>
          <div>
            <Label>অতিরিক্ত তথ্য</Label>
            <Textarea {...form.register("details")} />
          </div>
          <ImageUploader label="প্রমাণপত্র / প্রেসক্রিপশন (ঐচ্ছিক)" onFileSelect={setFile} />

          <Button type="submit" disabled={pending}>
            {pending ? "প্রকাশ হচ্ছে..." : "রক্তের অনুরোধ প্রকাশ করুন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
