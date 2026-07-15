import type { Metadata } from "next";
import { Flame, TrendingUp } from "lucide-react";
import { RankingList } from "@/components/ranking-list";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "本周热门排行",
  description: "查看 Cook for Me 最近 7 天最受欢迎的家常菜谱。",
};

export default function RankingPage() {
  const rankedRecipes = [...recipes].sort((a, b) => b.weeklyLikes - a.weeklyLikes || b.likes - a.likes || a.title.localeCompare(b.title, "zh-CN"));

  return (
    <div className="page-shell py-8 md:py-12 lg:py-16">
      <header className="relative overflow-hidden rounded-[30px] bg-[#3a251e] px-6 py-9 text-white soft-shadow md:px-10 md:py-12 lg:px-14">
        <div className="relative z-10 max-w-2xl">
          <p className="flex items-center gap-2 text-sm font-bold text-[#f3c75b]"><Flame className="size-4 fill-[#f3c75b]" />最近 7 天的人气味道</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.045em] md:text-5xl lg:text-6xl">本周热门排行</h1>
          <p className="mt-4 max-w-xl leading-7 text-white/68 md:text-lg">排行统计最近 7×24 小时的点赞，每日滚动更新。看看这一周，大家最想端上桌的是哪些菜。</p>
        </div>
        <TrendingUp className="absolute -bottom-12 -right-8 size-56 rotate-[-8deg] text-white/[0.07] md:right-8 md:size-72" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute right-8 top-6 hidden rotate-12 text-7xl lg:block" aria-hidden="true">🥢</span>
      </header>
      <RankingList recipes={rankedRecipes} />
    </div>
  );
}
