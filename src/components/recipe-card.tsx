import Link from "next/link";
import { Clock3 } from "lucide-react";
import { Recipe, totalMinutes } from "@/lib/recipes";
import { FavoriteButton } from "./favorite-button";
import { LikeButton } from "./like-button";
import { DifficultyStars } from "./difficulty-stars";

export function RecipeCard({ recipe }: { recipe: Recipe; priority?: boolean }) {
  return (
    <article className="group relative flex min-h-[250px] flex-col overflow-hidden rounded-[22px] border border-border/80 bg-card p-4 card-shadow transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_18px_40px_rgba(111,67,42,.13)] sm:min-h-[270px] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2e8] px-3 py-1.5 text-xs font-black text-[#8f472d]"><Clock3 className="size-3.5" />{totalMinutes(recipe)} 分钟</span>
        <span className="text-xs font-bold text-muted-foreground">{recipe.category}</span>
      </div>
      <Link href={`/recipes/${recipe.slug}`} className="mt-5 block">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-xl font-black tracking-tight sm:text-2xl">{recipe.title}</h3>
        </div>
        <div className="mt-4 flex min-h-16 flex-wrap content-start gap-2" aria-label={`${recipe.title}特点`}>
          {recipe.featureTags.slice(0, 2).map(tag => <span key={tag} className="rounded-full bg-[#fff2e8] px-3 py-1.5 text-xs font-bold text-[#a74e2b]">{tag}</span>)}
        </div>
      </Link>
      <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
        <div className="space-y-1.5 text-xs text-muted-foreground"><DifficultyStars difficulty={recipe.difficulty} /><p>{recipe.weeklyLikes ? `本周 ${recipe.weeklyLikes} 人点赞` : "暂无点赞"}</p></div>
        <div className="flex gap-1.5"><LikeButton slug={recipe.slug} initialCount={recipe.likes} compact /><FavoriteButton slug={recipe.slug} className="size-10" /></div>
      </div>
    </article>
  );
}
