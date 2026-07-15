import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CookingMode } from "@/components/cooking-mode";
import { getRecipe, recipes } from "@/lib/recipes";

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

  const requestedServings = Number(query.servings);
  const servings = Number.isInteger(requestedServings) && requestedServings >= 1 && requestedServings <= 8
    ? requestedServings
    : recipe.servings;

  return <CookingMode recipe={recipe} servings={servings} />;
}
