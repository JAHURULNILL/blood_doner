import type { Metadata } from "next";
import { Hind_Siliguri, Manrope } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { siteConfig } from "@/lib/constants";

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
  icons: {
    icon: "/site-logo.jpg",
    shortcut: "/site-logo.jpg",
    apple: "/site-logo.jpg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={`${bengaliFont.variable} ${displayFont.variable}`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
