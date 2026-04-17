"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createOrganizationAction } from "@/lib/actions/organization-actions";
import { organizationSchema } from "@/lib/schemas";
import { bangladeshDivisions, getDistrictOptions, getUpazilaOptions } from "@/lib/bangladesh-address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { z } from "zod";

type OrganizationValues = z.infer<typeof organizationSchema>;

export function OrganizationForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<OrganizationValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      description: "",
      division: "",
      district: "",
      upazila: "",
      contactPhone: "",
      contactEmail: ""
    }
  });

  const selectedDivision = form.watch("division");
  const selectedDistrict = form.watch("district");
  const districtOptions = getDistrictOptions(selectedDivision);
  const upazilaOptions = getUpazilaOptions(selectedDistrict);

  const onSubmit = (values: OrganizationValues) => {
    startTransition(async () => {
      const result = await createOrganizationAction(values);
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      router.push(`/organizations/${result.slug}`);
      router.refresh();
    });
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>সংগঠন হিসাবে যুক্ত হোন</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">সংগঠনের নাম</Label>
            <Input id="name" {...form.register("name")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.name?.message}</p>
          </div>

          <div>
            <Label htmlFor="description">সংক্ষিপ্ত পরিচিতি</Label>
            <Textarea id="description" {...form.register("description")} />
            <p className="mt-2 text-xs text-primary">{form.formState.errors.description?.message}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="division">বিভাগ</Label>
              <Select
                id="division"
                {...form.register("division", {
                  onChange: () => {
                    form.setValue("district", "");
                    form.setValue("upazila", "");
                  }
                })}
              >
                <option value="">বিভাগ নির্বাচন করুন</option>
                {bangladeshDivisions.map((division) => (
                  <option key={division.id} value={division.name}>
                    {division.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="district">জেলা</Label>
              <Select
                id="district"
                {...form.register("district", {
                  onChange: () => form.setValue("upazila", "")
                })}
                disabled={!selectedDivision}
              >
                <option value="">জেলা নির্বাচন করুন</option>
                {districtOptions.map((district) => (
                  <option key={district.id} value={district.name}>
                    {district.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="upazila">উপজেলা / এলাকা</Label>
              <Select id="upazila" {...form.register("upazila")} disabled={!selectedDistrict}>
                <option value="">এলাকা নির্বাচন করুন</option>
                {upazilaOptions.map((upazila) => (
                  <option key={upazila.id} value={upazila.name}>
                    {upazila.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactPhone">যোগাযোগ নম্বর</Label>
              <Input id="contactPhone" {...form.register("contactPhone")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.contactPhone?.message}</p>
            </div>
            <div>
              <Label htmlFor="contactEmail">যোগাযোগ ইমেইল</Label>
              <Input id="contactEmail" type="email" {...form.register("contactEmail")} />
              <p className="mt-2 text-xs text-primary">{form.formState.errors.contactEmail?.message}</p>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "সংগঠন যুক্ত হচ্ছে..." : "সংগঠন যুক্ত করুন"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
