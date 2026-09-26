import type { Metadata } from "next";
import { Flame, TrendingUp } from "lucide-react";
import { RankingList } from "@/components/ranking-list";
import { publicRecipes } from "@/lib/recipes";
import { getLikeCountMap } from "@/lib/likes";

export const metadata: Metadata = {
  title: "本周热门排行",
  description: "查看 Cook for Me 最近 7 天最受欢迎的家常菜谱。",
};

export default async function RankingPage() {
  const counts=await getLikeCountMap();
  const rankedRecipes=publicRecipes.map(recipe=>{const value=counts.get(recipe.slug);return value?{...recipe,likes:value.totalLikes,weeklyLikes:value.weeklyLikes}:recipe}).filter(recipe=>recipe.weeklyLikes>0).sort((a, b) => b.weeklyLikes - a.weeklyLikes || b.likes - a.likes || a.title.localeCompare(b.title, "zh-CN"));

  return (
    <div className="page-shell py-8 md:py-12 lg:py-16">
      <header className="relative overflow-hidden rounded-[30px] bg-[#3a251e] px-6 py-9 text-white soft-shadow md:px-10 md:py-12 lg:px-14">
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-bold text-[#f3c75b]"><Flame className="size-4 fill-[#f3c75b]" />最近 7 天的人气味道</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-5xl lg:text-6xl">本周热门排行</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/68 md:text-lg">按近 7 天点赞更新，看看大家最近在做什么。</p>
        </div>
        <TrendingUp className="absolute -bottom-12 -right-8 size-56 rotate-[-8deg] text-white/[0.07] md:right-8 md:size-72" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute right-8 top-6 hidden rotate-12 text-7xl lg:block" aria-hidden="true">🥢</span>
      </header>
      <RankingList recipes={rankedRecipes} />
    </div>
  );
}
