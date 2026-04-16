"use client";

import { useEffect, useState } from "react";
import { Bell, Download } from "lucide-react";
import { toast } from "sonner";
import { webPushConfig } from "@/lib/push-config";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function PwaQuickActions() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notificationReady, setNotificationReady] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    const checkNotificationState = async () => {
      if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
        return;
      }

      setNotificationReady(Boolean(webPushConfig.publicKey));

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setNotificationEnabled(Boolean(subscription) && Notification.permission === "granted");
    };

    void checkNotificationState();
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      toast.success("অ্যাপ ইন্সটল শুরু হয়েছে");
      setDeferredPrompt(null);
    }
  };

  const enableNotifications = async () => {
    try {
      if (!webPushConfig.publicKey) {
        toast.error("Notification setup এখনো সম্পূর্ণ নয়");
        return;
      }

      const supabase = createClient();
      const userResponse = await supabase?.auth.getUser();
      if (!userResponse?.data.user) {
        toast.error("নোটিফিকেশন চালু করতে আগে লগইন করুন");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        toast.error("নোটিফিকেশন permission দেওয়া হয়নি");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(webPushConfig.publicKey)
        });
      }

      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Notification subscription save করা যায়নি");
      }

      setNotificationEnabled(true);
      toast.success("নতুন অনুরোধের নোটিফিকেশন চালু হয়েছে");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "নোটিফিকেশন চালু করা যায়নি");
    }
  };

  if (!deferredPrompt && (!notificationReady || notificationEnabled)) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] w-full max-w-md -translate-x-1/2 px-4">
      <div className="pointer-events-auto rounded-[1.6rem] border border-border/70 bg-white/92 p-3 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="grid gap-2 sm:grid-cols-2">
          {deferredPrompt ? (
            <Button onClick={() => void installApp()} className="h-11">
              <Download className="h-4 w-4" />
              অ্যাপ ইন্সটল করুন
            </Button>
          ) : null}

          {notificationReady && !notificationEnabled ? (
            <Button variant="outline" onClick={() => void enableNotifications()} className="h-11">
              <Bell className="h-4 w-4" />
              নোটিফিকেশন চালু করুন
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
