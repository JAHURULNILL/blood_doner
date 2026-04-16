import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { siteConfig } from "@/lib/constants";
import { RegisterServiceWorker } from "@/components/pwa/register-service-worker";
import { PwaQuickActions } from "@/components/pwa/pwa-quick-actions";

const bengaliFont = Hind_Siliguri({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"]
});

const displayFont = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/site-logo.jpg",
    shortcut: "/site-logo.jpg",
    apple: "/site-logo.jpg"
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: "default"
  }
};

export const viewport: Viewport = {
  themeColor: "#0d1b2a"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={`${bengaliFont.variable} ${displayFont.variable}`}>
        <RegisterServiceWorker />
        <PwaQuickActions />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
