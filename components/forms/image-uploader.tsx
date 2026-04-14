"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  label: string;
  onFileSelect: (file: File | null) => void;
  initialPreview?: string | null;
}

export function ImageUploader({ label, onFileSelect, initialPreview }: ImageUploaderProps) {
  const [preview, setPreview] = useState(initialPreview ?? "");

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">{label}</p>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/60">
          {preview ? (
            <Image src={preview} alt={label} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <ImagePlus className="h-5 w-5" />
            </div>
          )}
        </div>
        <Button variant="outline" asChild>
          <label className="cursor-pointer">
            ছবি নির্বাচন
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                onFileSelect(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </Button>
      </div>
    </div>
  );
}
