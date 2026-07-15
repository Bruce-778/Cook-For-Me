import type { Metadata } from "next";
import { DiscoverClient } from "@/components/discover-client";
import { recipes } from "@/lib/recipes";
export const metadata: Metadata = { title: "发现菜谱", description: "按菜名、食材、时间和分类发现适合今天的家常菜。" };
export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) { const { q = "" } = await searchParams; return <DiscoverClient recipes={recipes} initialQuery={q} />; }
