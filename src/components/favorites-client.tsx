"use client";

import Link from "next/link";
import { ArrowRight, ChefHat, Heart, SlidersHorizontal, Trash2 } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { RecipeCard } from "@/components/recipe-card";
import { FAVORITES_KEY, readStringList, writeStringList } from "@/lib/local-store";
import { Recipe, totalMinutes } from "@/lib/recipes";

type SortOption = "saved" | "time" | "difficulty";

function subscribeToFavorites(onStoreChange: () => void) {
  const onCustomStorage = (event: Event) => {
    const detail = (event as CustomEvent<{ key?: string }>).detail;
    if (!detail?.key || detail.key === FAVORITES_KEY) onStoreChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (!event.key || event.key === FAVORITES_KEY) onStoreChange();
  };

  window.addEventListener("cfm:storage", onCustomStorage);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("cfm:storage", onCustomStorage);
    window.removeEventListener("storage", onStorage);
  };
}

function getFavoritesSnapshot() {
  return JSON.stringify(readStringList(FAVORITES_KEY));
}

function FavoritesContent({ recipes }: { recipes: Recipe[] }) {
  const snapshot = useSyncExternalStore(subscribeToFavorites, getFavoritesSnapshot, () => "[]");
  const favoriteSlugs = useMemo(() => JSON.parse(snapshot) as string[], [snapshot]);
  const sort = useFavoritesSort();

  const favoriteRecipes = useMemo(() => {
    const recipeBySlug = new Map(recipes.map((recipe) => [recipe.slug, recipe]));
    const selected = favoriteSlugs.flatMap((slug) => {
      const recipe = recipeBySlug.get(slug);
      return recipe ? [recipe] : [];
    });
    if (sort.value === "time") return selected.toSorted((a, b) => totalMinutes(a) - totalMinutes(b));
    if (sort.value === "difficulty") return selected.toSorted((a, b) => a.difficulty - b.difficulty || totalMinutes(a) - totalMinutes(b));
    return selected;
  }, [favoriteSlugs, recipes, sort.value]);

  const unavailableCount = favoriteSlugs.length - favoriteRecipes.length;
  const availableSlugs = new Set(recipes.map((recipe) => recipe.slug));
  const unavailableSlugs = favoriteSlugs.filter((slug) => !availableSlugs.has(slug));
  const removeFavorite = (slug: string) => writeStringList(FAVORITES_KEY, readStringList(FAVORITES_KEY).filter((item) => item !== slug));

  if (favoriteSlugs.length === 0) {
    return (
      <section className="mt-8 overflow-hidden rounded-[30px] border border-dashed border-primary/25 bg-card px-6 py-14 text-center md:mt-10 md:py-20">
        <div className="relative mx-auto grid size-28 place-items-center rounded-full bg-[#fff0e3] md:size-32">
          <span className="text-6xl" aria-hidden="true">🍽️</span>
          <Heart className="absolute -right-1 top-2 size-9 rotate-12 fill-primary text-primary" aria-hidden="true" />
        </div>
        <h2 className="mt-6 text-2xl font-black tracking-tight md:text-3xl">还没有收藏的菜</h2>
        <p className="mx-auto mt-3 max-w-md leading-7 text-muted-foreground">遇到想做的，就点一下小爱心放进这里。下次不用再找，打开就能继续准备。</p>
        <Link href="/discover" className="mt-7 inline-flex h-13 items-center gap-2 rounded-full bg-primary px-6 font-bold text-white transition hover:bg-[#da4d28]">
          去看看菜谱 <ArrowRight className="size-4" />
        </Link>
      </section>
    );
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-y border-border/70 py-4 md:mt-10">
        <p className="flex items-center gap-2 text-sm font-bold"><Heart className="size-4 fill-primary text-primary" />已收藏 {favoriteRecipes.length} 道菜</p>
        <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <SlidersHorizontal className="size-4" />
          <span className="sr-only sm:not-sr-only">排序</span>
          <select
            value={sort.value}
            onChange={(event) => sort.setValue(event.target.value as SortOption)}
            aria-label="收藏排序方式"
            className="h-11 rounded-full border bg-card px-4 font-bold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <option value="saved">最近收藏</option>
            <option value="time">制作时间最短</option>
            <option value="difficulty">难度最低</option>
          </select>
        </label>
      </div>

      {unavailableCount > 0 && (
        <div className="mt-5 rounded-[20px] border border-dashed bg-card p-4 text-sm text-muted-foreground" role="status">
          <p>有 {unavailableCount} 道曾收藏的菜目前暂不可用。它们不会影响其他收藏的浏览。</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {unavailableSlugs.map((slug) => (
              <li key={slug} className="flex min-w-0 items-center justify-between gap-3 rounded-[14px] bg-muted/70 px-3 py-2">
                <span className="truncate font-mono text-xs">{slug}</span>
                <button
                  type="button"
                  onClick={() => removeFavorite(slug)}
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-destructive transition hover:bg-destructive/10"
                  aria-label={`移除不可用收藏 ${slug}`}
                >
                  <Trash2 className="size-3.5" />移除
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {favoriteRecipes.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3.5 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {favoriteRecipes.map((recipe) => <RecipeCard key={recipe.slug} recipe={recipe} />)}
        </div>
      ) : (
        <section className="mt-6 rounded-[24px] border border-dashed bg-card p-8 text-center">
          <ChefHat className="mx-auto size-10 text-primary" />
          <h2 className="mt-3 text-xl font-black">收藏的菜暂时不可用</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">去菜谱页收藏一些新的味道吧。</p>
          <Link href="/discover" className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-white">发现菜谱</Link>
        </section>
      )}
    </>
  );
}

function useFavoritesSort() {
  const key = "cfm:v1:favorites-sort";
  const subscribe = (onStoreChange: () => void) => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) onStoreChange();
    };
    const onCustom = (event: Event) => {
      if ((event as CustomEvent<{ key?: string }>).detail?.key === key) onStoreChange();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("cfm:storage", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cfm:storage", onCustom);
    };
  };
  const getSnapshot = (): SortOption => {
    const value = localStorage.getItem(key);
    return value === "time" || value === "difficulty" ? value : "saved";
  };
  const value = useSyncExternalStore(subscribe, getSnapshot, () => "saved" as SortOption);
  const setValue = (next: SortOption) => {
    localStorage.setItem(key, next);
    window.dispatchEvent(new CustomEvent("cfm:storage", { detail: { key } }));
  };
  return { value, setValue };
}

export function FavoritesClient({ recipes }: { recipes: Recipe[] }) {
  return <FavoritesContent recipes={recipes} />;
}
