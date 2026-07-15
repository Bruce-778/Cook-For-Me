import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Cook for Me｜把每一道家常菜做明白", template: "%s｜Cook for Me" },
  description: "温暖、准确、适合新手的中文家常菜谱网站。精确用量、清楚火候，一步一步陪你做好饭。",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#FFF8ED", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={geistMono.variable}>
      <body className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
        <SiteHeader />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
