import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookingMode } from "@/components/cooking-mode";
import { getRecipe, recipes } from "@/lib/recipes";
import Link from "next/link";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  return recipe ? { title: `正在做：${recipe.title}`, description: `跟随 Cook for Me 一步一步完成${recipe.title}。` } : {};
}

export default async function CookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ servings?: string }>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const recipe = getRecipe(slug);
  if (!recipe) notFound();
  if (recipe.editorialStatus !== "reviewed") return <main className="page-shell grid min-h-[70vh] place-items-center py-12"><section className="max-w-xl rounded-[28px] border bg-card p-8 text-center card-shadow"><h1 className="text-3xl font-black">这道菜还不能开始做</h1><p className="mt-4 leading-7 text-muted-foreground">我们正在逐项核对食材总量、分步用量、火候、时间、完成状态和成品图。复核完成前不会让用户按未经验证的步骤下厨。</p><Link href={`/recipes/${recipe.slug}`} className="mt-6 inline-flex h-12 items-center rounded-full bg-primary px-6 font-black text-white">返回菜谱说明</Link></section></main>;

  const requestedServings = Number(query.servings);
  const servings = Number.isInteger(requestedServings) && requestedServings >= 1 && requestedServings <= 8
    ? requestedServings
    : recipe.servings;

  return <CookingMode recipe={recipe} servings={servings} />;
}
