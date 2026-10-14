import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { AppProviders } from "@/components/layout/app-providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: "ระบบรายงานโรคพิษสุนัขบ้า จังหวัดกาฬสินธุ์",
  description: "ระบบฐานข้อมูลและรายงานสถานการณ์โรคพิษสุนัขบ้า จังหวัดกาฬสินธุ์ (Kalasin Rabies Surveillance)",
  manifest: "/rabies-dashboard/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Rabies Kalasin",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 overflow-x-hidden">
        <AppProviders>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
              <Header />
              <main className="flex-1 overflow-y-auto p-2.5 sm:p-4 md:p-6 bg-gray-50 pb-22 md:pb-6">
                {children}
              </main>
            </div>
          </div>
          {/* Bottom Navigation for Mobile (Android & iPhone) */}
          <MobileNav />
        </AppProviders>
      </body>
    </html>
  );
}
