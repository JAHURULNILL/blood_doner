"use client";

import { useEffect, useState } from "react";
import { Bell, Download, Smartphone, X } from "lucide-react";
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

function isStandaloneMode() {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isMobileDevice() {
  if (typeof window === "undefined") return false;

  return /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent);
}

function setStandaloneClass(active: boolean) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("app-standalone", active);
}

export function PwaQuickActions() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notificationReady, setNotificationReady] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [installVisible, setInstallVisible] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [mobileDevice, setMobileDevice] = useState(false);

  useEffect(() => {
    const appInstalled = isStandaloneMode();
    setStandalone(appInstalled);
    setMobileDevice(isMobileDevice());
    setStandaloneClass(appInstalled);

    const displayMode = window.matchMedia("(display-mode: standalone)");

    const handleModeChange = () => {
      const installed = isStandaloneMode();
      setStandalone(installed);
      setStandaloneClass(installed);
      if (installed) {
        setInstallVisible(false);
      }
    };

    const handleAppInstalled = () => {
      setStandalone(true);
      setStandaloneClass(true);
      setInstallVisible(false);
      setDeferredPrompt(null);
    };

    displayMode.addEventListener("change", handleModeChange);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      displayMode.removeEventListener("change", handleModeChange);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (isMobileDevice() && !isStandaloneMode()) {
        setInstallVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  useEffect(() => {
    if (standalone || !mobileDevice) return;

    const timer = window.setTimeout(() => {
      setInstallVisible(true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [mobileDevice, standalone]);

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

  const dismissInstallModal = () => {
    setInstallVisible(false);
  };

  const installApp = async () => {
    if (!deferredPrompt) {
      toast.info("install ready hocche, ektu pore abar chapun");
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      toast.success("অ্যাপ ইন্সটল শুরু হয়েছে");
      setInstallVisible(false);
      setDeferredPrompt(null);
      return;
    }

    toast.info("ইচ্ছে হলে পরে আবার অ্যাপ ইন্সটল করতে পারবেন");
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

  const showNotificationButton = notificationReady && !notificationEnabled;

  return (
    <>
      {!standalone && mobileDevice && installVisible ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/45 p-4 backdrop-blur-[2px] sm:items-center">
          <div className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(247,248,250,0.98))] shadow-[0_40px_80px_-34px_rgba(15,23,42,0.45)]">
            <div className="flex justify-center pt-3">
              <div className="h-1.5 w-14 rounded-full bg-slate-200" />
            </div>

            <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.15rem] bg-primary text-white shadow-[0_18px_40px_-20px_rgba(190,24,38,0.7)]">
                  <Smartphone className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">অ্যাপ হিসাবে ইন্সটল করুন</h3>
              </div>
              <button
                type="button"
                onClick={dismissInstallModal}
                aria-label="Close install prompt"
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 px-5 pb-5 pt-2">
              <div className="grid gap-3">
                <Button onClick={() => void installApp()} className="h-12 text-base" disabled={!deferredPrompt}>
                  <Download className="h-4 w-4" />
                  {deferredPrompt ? "অ্যাপ ইন্সটল করুন" : "ইন্সটল প্রস্তুত হচ্ছে"}
                </Button>

                {showNotificationButton ? (
                  <Button variant="outline" onClick={() => void enableNotifications()} className="h-12 text-base">
                    <Bell className="h-4 w-4" />
                    নোটিফিকেশন চালু করুন
                  </Button>
                ) : null}

                <Button variant="ghost" onClick={dismissInstallModal} className="h-11 text-slate-600 hover:text-slate-900">
                  পরে দেখব
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {standalone && showNotificationButton ? (
        <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] w-full max-w-md -translate-x-1/2 px-4">
          <div className="pointer-events-auto rounded-[1.6rem] border border-border/70 bg-white/92 p-3 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.35)] backdrop-blur">
            <Button variant="outline" onClick={() => void enableNotifications()} className="h-11 w-full">
              <Bell className="h-4 w-4" />
              নোটিফিকেশন চালু করুন
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}
