"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { bloodGroups } from "@/lib/constants";
import { getDistrictOptions, getUpazilaOptions, bangladeshDivisions } from "@/lib/bangladesh-address";
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

const defaultDivision = bangladeshDivisions.find((division) => division.name === "ঢাকা")?.name ?? bangladeshDivisions[0]?.name ?? "";

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
      division: defaultDivision,
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

  const selectedDivision = form.watch("division");
  const selectedDistrict = form.watch("district");
  const selectedUpazila = form.watch("upazila");
  const districtOptions = getDistrictOptions(selectedDivision);
  const upazilaOptions = getUpazilaOptions(selectedDistrict);

  useEffect(() => {
    if (!districtOptions.some((option) => option.name === selectedDistrict)) {
      form.setValue("district", "");
      form.setValue("upazila", "");
    }
  }, [districtOptions, form, selectedDistrict]);

  useEffect(() => {
    if (!upazilaOptions.some((option) => option.name === selectedUpazila)) {
      form.setValue("upazila", "");
    }
  }, [form, selectedUpazila, upazilaOptions]);

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
      form.reset({
        patientName: "",
        bloodGroup: "A+",
        quantityBags: 1,
        requiredDate: "",
        hospitalName: "",
        division: defaultDivision,
        district: "",
        upazila: "",
        address: "",
        contactName: "",
        contactPhone: "",
        urgency: "Emergency",
        details: "",
        status: "Open"
      });
      setFile(null);
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
                {bangladeshDivisions.map((division) => (
                  <option key={division.id} value={division.name}>
                    {division.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>জেলা</Label>
              <Select {...form.register("district")} disabled={!districtOptions.length}>
                <option value="">জেলা নির্বাচন করুন</option>
                {districtOptions.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>উপজেলা / এলাকা</Label>
              <Select {...form.register("upazila")} disabled={!upazilaOptions.length}>
                <option value="">উপজেলা নির্বাচন করুন</option>
                {upazilaOptions.map((upazila) => (
                  <option key={upazila.id} value={upazila.name}>
                    {upazila.name}
                  </option>
                ))}
              </Select>
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
