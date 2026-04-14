"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>বার্তা পাঠান</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            toast.success("আপনার বার্তা গ্রহণ করা হয়েছে");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">নাম</Label>
              <Input id="name" required />
            </div>
            <div>
              <Label htmlFor="contactEmail">ইমেইল</Label>
              <Input id="contactEmail" type="email" required />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">বিষয়</Label>
            <Input id="subject" required />
          </div>
          <div>
            <Label htmlFor="message">বার্তা</Label>
            <Textarea id="message" required />
          </div>
          <Button type="submit">পাঠিয়ে দিন</Button>
        </form>
      </CardContent>
    </Card>
  );
}
