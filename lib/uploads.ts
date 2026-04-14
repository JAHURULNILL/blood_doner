"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadFileToStorage(bucket: string, file: File, folder: string) {
  const supabase = createClient();
  if (!supabase) {
    return { path: "", publicUrl: URL.createObjectURL(file) };
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${folder}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return { path: filePath, publicUrl: data.publicUrl };
}
