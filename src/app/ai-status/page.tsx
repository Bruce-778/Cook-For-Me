import type { Metadata } from "next";
import { AiStatusPanel } from "@/components/ai-status-panel";

export const metadata: Metadata = { title: "AI 运行状态 · Cook for Me", robots: { index: false, follow: false } };

export default function AiStatusPage() {
  return <main className="page-shell pb-16 pt-8 md:pt-12"><AiStatusPanel /></main>;
}
