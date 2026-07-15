import Image from "next/image";
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import { Recipe, totalMinutes } from "@/lib/recipes";
import { FavoriteButton } from "./favorite-button";

export function RecipeCard({ recipe, priority = false }: { recipe: Recipe; priority?: boolean }) {
  return <article className="group overflow-hidden rounded-[22px] border border-border/80 bg-card card-shadow transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(111,67,42,.13)]"><Link href={`/recipes/${recipe.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted"><Image src={recipe.image} alt={recipe.title} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px" className="object-cover transition duration-500 group-hover:scale-[1.04]" priority={priority} /><span className="absolute left-3 top-3 rounded-full bg-[#3a251e]/82 px-3 py-1.5 text-xs font-bold text-white backdrop-blur"><Clock3 className="mr-1 inline size-3.5" />{totalMinutes(recipe)} 分钟</span></Link><div className="relative p-3.5 sm:p-4"><FavoriteButton slug={recipe.slug} className="absolute -top-7 right-3 size-10" /><Link href={`/recipes/${recipe.slug}`}><h3 className="pr-8 text-base font-black tracking-tight sm:text-lg">{recipe.title}</h3><p className="mt-1 line-clamp-1 text-xs text-muted-foreground sm:text-sm">{recipe.summary}</p><div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span className="flex items-center gap-1"><Star className="size-3.5 fill-[#f3c75b] text-[#f3c75b]" />难度 {recipe.difficulty}</span><span>本周 {recipe.weeklyLikes} 人喜欢</span></div></Link></div></article>;
}
