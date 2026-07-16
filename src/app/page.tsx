import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Carrot, ChevronRight, Clock3, Gift, Search, Sparkles } from "lucide-react";
import { RecipeCard } from "@/components/recipe-card";
import { Brand } from "@/components/site-header";
import { ingredientShortcuts, recipes } from "@/lib/recipes";
import { ComingSoon } from "@/components/coming-soon";
import { getLikeCountMap } from "@/lib/likes";

const ingredientEmoji: Record<string, string> = { 鸡蛋: "🥚", 番茄: "🍅", 土豆: "🥔", 胡萝卜: "🥕", 青椒: "🫑", 豆腐: "◻️", 鸡肉: "🍗", 面条: "🍜" };

export default async function Home() {
  const counts = await getLikeCountMap();
  const withLikes = recipes.map((recipe) => { const value=counts.get(recipe.slug); return value?{...recipe,likes:value.totalLikes,weeklyLikes:value.weeklyLikes}:recipe; });
  const hasLikes = withLikes.some((recipe) => recipe.weeklyLikes > 0);
  const popular = [...withLikes].sort((a, b) => b.weeklyLikes - a.weeklyLikes || b.likes - a.likes).slice(0, 8);
  return <>
    <section className="relative overflow-hidden pb-10 pt-4 md:pb-16 md:pt-10">
      <div className="page-shell md:hidden"><Brand /></div>
      <div className="page-shell mt-5 md:mt-0"><div className="relative overflow-hidden rounded-[30px] bg-[#fff0e3] px-5 pb-6 pt-8 soft-shadow sm:px-8 md:grid md:min-h-[510px] md:grid-cols-[.9fr_1.1fr] md:items-center md:px-12 lg:px-16">
        <div className="relative z-10 max-w-xl"><span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-2 text-xs font-bold text-primary"><Sparkles className="size-3.5" />把每一道家常菜做明白</span><h1 className="mt-5 text-[42px] font-black leading-[1.08] tracking-[-.065em] text-balance sm:text-5xl md:text-6xl lg:text-[68px]">今天<span className="text-primary">吃什么</span>？</h1><p className="mt-4 max-w-md text-base leading-7 text-muted-foreground md:text-lg">搜菜名，也可以从手边的食材开始。用量、火候和时间都替你写清楚。</p>
          <form action="/discover" className="mt-7 flex h-[58px] items-center gap-2 rounded-[20px] border border-white bg-white p-1.5 shadow-[0_14px_36px_rgba(124,74,42,.12)] md:h-16"><Search className="ml-3 size-5 shrink-0 text-muted-foreground" /><input name="q" aria-label="搜索菜名或食材" placeholder="番茄、鸡蛋炒饭…" className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-[#a89589] md:text-base" /><button className="h-full shrink-0 rounded-[15px] bg-primary px-5 text-sm font-bold text-white transition hover:bg-[#da4d28] md:px-7 md:text-base">搜索</button></form>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"><span>大家常搜：</span>{["番茄炒蛋", "新手推荐", "清淡恢复"].map((item) => <Link key={item} href={`/discover?q=${item}`} className="font-semibold underline-offset-4 hover:text-primary hover:underline">{item}</Link>)}</div>
          <Link href="/blindbox" aria-label="打开食物盲盒，按人数、时间和忌口配一桌菜" className="group mt-5 inline-flex min-h-16 items-center gap-3 rounded-[20px] border border-white/90 bg-white/80 p-2 pr-4 text-left shadow-[0_12px_30px_rgba(121,66,35,.12)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_16px_36px_rgba(121,66,35,.17)]">
            <span className="relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ff8a60] to-primary text-white shadow-[0_8px_18px_rgba(240,100,58,.28)]">
              <Gift className="size-6" strokeWidth={2.2} />
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full border-2 border-white bg-[#f3c75b] text-[11px] font-black text-[#5b391d]">?</span>
            </span>
            <span>
              <span className="block text-[11px] font-bold tracking-wide text-muted-foreground">人数 · 时间 · 忌口</span>
              <span className="mt-0.5 block text-sm font-black text-foreground sm:text-base">打开食物盲盒</span>
            </span>
            <ArrowRight className="ml-1 size-4 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="relative mt-8 h-[260px] md:mt-0 md:h-[420px]"><div className="absolute -right-28 -top-28 size-80 rounded-full bg-[#f0643a]/10" /><div className="absolute inset-3 rotate-2 overflow-hidden rounded-[38%_62%_58%_42%/45%_42%_58%_55%] border-[10px] border-white/60 bg-[#f4c95d]/25 shadow-[0_25px_60px_rgba(105,57,30,.18)] md:inset-7"><Image src="/images/hero/steak-grilled.jpg" alt="香煎牛排配烤蔬菜" fill priority sizes="(max-width:768px) 90vw, 50vw" className="object-cover" /></div><span className="absolute left-1 top-4 rotate-[-10deg] text-5xl md:text-7xl">🥩</span><span className="absolute bottom-2 right-4 rotate-12 text-5xl md:text-7xl">🌿</span></div>
      </div></div>
    </section>

    <section className="page-shell py-3 md:py-6"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-[#5e8557]">从熟悉的味道开始</p><h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">常用食材</h2></div><Link href="/discover" className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary">更多食材<ChevronRight className="size-4" /></Link></div><div className="hide-scrollbar -mx-4 mt-5 flex gap-2.5 overflow-x-auto px-4 pb-3 md:mx-0 md:flex-wrap md:px-0">{ingredientShortcuts.map((item) => <Link key={item} href={`/discover?q=${item}`} className="flex h-12 shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 font-bold card-shadow transition hover:-translate-y-0.5 hover:border-primary/30"><span>{ingredientEmoji[item]}</span>{item}</Link>)}</div></section>

    <section className="page-shell py-8 md:py-12"><div className="grid gap-4 md:grid-cols-[1.15fr_.85fr] md:grid-rows-2">
      <Link href="/discover" className="group relative min-h-64 overflow-hidden rounded-[28px] bg-[#ffe2d1] p-6 md:row-span-2 md:min-h-[390px] md:p-9"><div className="relative z-10 max-w-sm"><span className="text-sm font-black text-primary">按食材找菜</span><h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">家里有什么，<br />就从什么开始。</h2><p className="mt-4 max-w-xs leading-7 text-muted-foreground">按鸡蛋、番茄、土豆等常用食材快速筛选，不用先想好菜名。</p><span className="mt-7 inline-flex size-12 items-center justify-center rounded-full bg-primary text-white transition group-hover:translate-x-1"><ArrowRight /></span></div><Carrot className="absolute -bottom-9 -right-8 size-56 rotate-[-18deg] text-primary/25 md:size-72" strokeWidth={1.2} /></Link>
      <Link href="/discover?sort=featured" className="group relative min-h-44 overflow-hidden rounded-[26px] bg-[#e9f3e4] p-6"><div className="relative z-10"><span className="text-sm font-black text-[#5e8557]">今日精选</span><h3 className="mt-2 text-2xl font-black">每天认真挑几道</h3><p className="mt-2 text-sm text-muted-foreground">新鲜，不重样。</p></div><CalendarDays className="absolute bottom-[-12px] right-3 size-32 text-[#5e8557]/28" strokeWidth={1.4} /></Link>
      <ComingSoon />
    </div></section>

    <section className="page-shell py-8 md:py-14"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-primary">{hasLikes?"🔥 最近 7 天的真实点赞":"刚上桌，不造热度"}</p><h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">{hasLikes?"本周人气菜谱":"新菜上桌"}</h2></div><Link href={hasLikes?"/ranking":"/discover"} className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary">{hasLikes?"查看排行":"查看全部"}<ChevronRight className="size-4" /></Link></div><div className="mt-6 grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-5 lg:grid-cols-4">{popular.map((recipe, index) => <RecipeCard key={recipe.slug} recipe={recipe} priority={index < 2} />)}</div></section>

    <section className="page-shell py-10 md:py-16"><div className="rounded-[30px] bg-[#3a251e] px-6 py-9 text-white md:flex md:items-center md:justify-between md:px-12 md:py-12"><div><p className="text-sm font-bold text-[#f3c75b]">第一次做也不慌</p><h2 className="mt-2 text-3xl font-black md:text-4xl">大字步骤，火候时间都醒目</h2><p className="mt-3 max-w-2xl leading-7 text-white/65">进入烹饪模式，一屏只看一步。计时、用量和完成状态都放在手边。</p></div><Link href={`/recipes/${recipes[0].slug}`} className="mt-6 inline-flex h-13 items-center gap-2 rounded-full bg-primary px-6 font-bold md:mt-0">试试烹饪模式<Clock3 className="size-5" /></Link></div></section>
  </>;
}
