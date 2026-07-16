import type { Metadata } from "next";
import { DiscoverClient } from "@/components/discover-client";
import { recipes } from "@/lib/recipes";
import { getLikeCountMap } from "@/lib/likes";
export const metadata: Metadata = { title: "发现菜谱", description: "按菜名、食材、时间和分类发现适合今天的家常菜。" };
export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ q?: string;category?:string;tag?:string|string[] }> }) { const { q = "",category="全部",tag=[] } = await searchParams;const counts=await getLikeCountMap();const enriched=recipes.map(recipe=>{const value=counts.get(recipe.slug);return value?{...recipe,likes:value.totalLikes,weeklyLikes:value.weeklyLikes}:recipe});return <DiscoverClient recipes={enriched} initialQuery={q} initialCategory={category} initialTags={Array.isArray(tag)?tag:tag?[tag]:[]} />; }
