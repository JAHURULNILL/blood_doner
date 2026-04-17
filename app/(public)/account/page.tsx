"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccountRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      if (!supabase) {
        router.replace("/login");
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase.from("users").select("role").eq("id", user.id).maybeSingle();

      if (data?.role === "admin") {
        router.replace("/admin");
        return;
      }

      router.replace("/dashboard");
    };

    void run();
  }, [router]);

  return (
    <div className="container-shell py-12">
      <div className="panel-muted flex min-h-[30vh] items-center justify-center p-6 text-sm text-muted-foreground">
        account khultechi...
      </div>
    </div>
  );
}
