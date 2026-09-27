import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  // Vercel can inject an environment variable with an empty value. Treat it
  // the same as an unset optional variable so static page collection does not
  // fail with `Invalid URL (input: '')`.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3001"),
  title: { default: "Cook for Me｜把每一道家常菜做明白", template: "%s｜Cook for Me" },
  description: "温暖、准确、适合新手的中文家常菜谱网站。精确用量、清楚火候，一步一步陪你做好饭。",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = { themeColor: "#FFF8ED", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className={geistMono.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen overflow-x-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <SiteHeader />
        <main>{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
