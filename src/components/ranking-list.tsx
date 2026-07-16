import Image from "next/image";
import Link from "next/link";
import { ChefHat, Clock3, Crown, Heart, Medal, Sparkles, Star } from "lucide-react";
import { FavoriteButton } from "@/components/favorite-button";
import { Recipe, totalMinutes } from "@/lib/recipes";
import { cn } from "@/lib/utils";

const podiumStyles = [
  {
    label: "本周第一",
    badge: "金锅铲",
    surface: "bg-[#fff0d5]",
    accent: "bg-[#f3c75b] text-[#51370b]",
    ring: "ring-[#e9b63f]/45",
  },
  {
    label: "本周第二",
    badge: "银汤勺",
    surface: "bg-[#f2f1ed]",
    accent: "bg-[#d8d7d2] text-[#4f4a43]",
    ring: "ring-[#b8b5ae]/40",
  },
  {
    label: "本周第三",
    badge: "铜饭勺",
    surface: "bg-[#f7e5d8]",
    accent: "bg-[#c98258] text-white",
    ring: "ring-[#bd7147]/35",
  },
] as const;

function RankBadge({ rank, compact = false }: { rank: number; compact?: boolean }) {
  if (rank > 3) {
    return (
      <span className={cn("grid shrink-0 place-items-center rounded-full bg-muted font-black text-muted-foreground", compact ? "size-10 text-sm" : "size-12 text-base")}>
        {rank}
      </span>
    );
  }

  const style = podiumStyles[rank - 1];
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full ring-4",
        style.accent,
        style.ring,
        compact ? "size-11" : "size-14",
      )}
      aria-label={`第 ${rank} 名，${style.badge}`}
      title={style.badge}
    >
      {rank === 1 ? <Crown className={compact ? "size-5" : "size-6"} /> : <Medal className={compact ? "size-5" : "size-6"} />}
      <span className="sr-only">第 {rank} 名</span>
    </span>
  );
}

function PodiumCard({ recipe, rank }: { recipe: Recipe; rank: number }) {
  const style = podiumStyles[rank - 1];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-white/80 card-shadow",
        style.surface,
        rank === 1 && "md:col-span-2 lg:col-span-1 lg:row-span-2",
      )}
    >
      <Link
        href={`/recipes/${recipe.slug}`}
        className={cn("relative block overflow-hidden", rank === 1 ? "aspect-[16/11] lg:aspect-auto lg:h-[390px]" : "aspect-[16/10]")}
      >
        <Image
          src={recipe.image}
          alt={recipe.title}
          fill
          priority={rank === 1}
          loading={rank === 1 ? "eager" : "lazy"}
          sizes={rank === 1 ? "(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 42vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#2d1c16]/80 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#fffdf8]/92 px-3 py-2 backdrop-blur-sm">
          <RankBadge rank={rank} compact />
          <div>
            <p className="text-[11px] font-bold text-muted-foreground">{style.label}</p>
            <p className="text-sm font-black">{style.badge}</p>
          </div>
        </div>
        <p className="absolute bottom-4 left-5 text-sm font-bold text-white">本周 {recipe.weeklyLikes} 人喜欢</p>
      </Link>
      <div className="relative p-5 md:p-6">
        <FavoriteButton slug={recipe.slug} className="absolute -top-6 right-5 size-11" />
        <Link href={`/recipes/${recipe.slug}`} className="block pr-10">
          <h2 className={cn("font-black tracking-tight", rank === 1 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl")}>{recipe.title}</h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{recipe.summary}</p>
        </Link>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5"><Clock3 className="size-4 text-primary" />{totalMinutes(recipe)} 分钟</span>
          <span className="flex items-center gap-1.5"><Star className="size-4 fill-[#f3c75b] text-[#f3c75b]" />难度 {recipe.difficulty}</span>
          <span className="flex items-center gap-1.5"><Heart className="size-4 text-primary" />累计 {recipe.likes}</span>
        </div>
      </div>
    </article>
  );
}

export function RankingList({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) return <section className="mt-8 rounded-[28px] border border-dashed bg-card px-6 py-16 text-center"><div className="text-5xl">🥢</div><h2 className="mt-4 text-2xl font-black">本周还没有真实点赞</h2><p className="mt-2 text-muted-foreground">所有菜从 0 开始。去菜谱详情点下第一颗真心吧。</p><Link href="/discover" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 font-bold text-white">发现菜谱</Link></section>;
  const topThree = recipes.slice(0, 3);
  const rest = recipes.slice(3, 10);

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-[1.12fr_.88fr] lg:grid-rows-2 lg:gap-5">
        {topThree.map((recipe, index) => <PodiumCard key={recipe.slug} recipe={recipe} rank={index + 1} />)}
      </div>

      {rest.length > 0 && (
        <section className="mt-12 md:mt-16" aria-labelledby="weekly-list-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5 text-sm font-bold text-[#5e8557]"><ChefHat className="size-4" />这一周也很受欢迎</p>
              <h2 id="weekly-list-heading" className="mt-1 text-2xl font-black tracking-tight md:text-3xl">本周 Top 10</h2>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-card px-4 py-2 text-xs font-bold text-muted-foreground shadow-sm sm:flex"><Sparkles className="size-3.5 text-primary" />每日滚动更新</span>
          </div>

          <ol className="mt-6 grid gap-3 lg:grid-cols-2 lg:gap-4">
            {rest.map((recipe, index) => {
              const rank = index + 4;
              return (
                <li key={recipe.slug} className="group flex items-center gap-3 rounded-[22px] border bg-card p-3 card-shadow transition hover:-translate-y-0.5 hover:border-primary/25 sm:gap-4 sm:p-4">
                  <RankBadge rank={rank} compact />
                  <Link href={`/recipes/${recipe.slug}`} className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-[17px] bg-muted sm:w-24">
                    <Image src={recipe.image} alt={recipe.title} fill sizes="96px" className="object-cover transition duration-500 group-hover:scale-105" />
                  </Link>
                  <Link href={`/recipes/${recipe.slug}`} className="min-w-0 flex-1 py-1">
                    <h3 className="truncate text-base font-black sm:text-lg">{recipe.title}</h3>
                    <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span>{totalMinutes(recipe)} 分钟</span>
                      <span>难度 {recipe.difficulty}</span>
                    </p>
                    <p className="mt-2 text-xs font-bold text-primary sm:text-sm">本周 {recipe.weeklyLikes} 人喜欢 <span className="font-medium text-muted-foreground">· 累计 {recipe.likes}</span></p>
                  </Link>
                  <FavoriteButton slug={recipe.slug} className="size-10 shrink-0 border-0 bg-transparent shadow-none" />
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </>
  );
}
