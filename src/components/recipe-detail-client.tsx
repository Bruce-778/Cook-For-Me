"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Check,
  ChefHat,
  ChevronRight,
  Clock3,
  Flame,
  Minus,
  Plus,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";
import type { Ingredient, Recipe } from "@/lib/recipes";
import { FavoriteButton } from "@/components/favorite-button";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { DifficultyStars } from "@/components/difficulty-stars";

const CHECKS_EVENT = "cfm:ingredient-checks";

function checksKey(slug: string, servings: number) {
  return `cfm:v1:ingredient-checks:${slug}:${servings}`;
}

function readChecks(key: string) {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(key) ?? "[]";
}

function parseChecks(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string") ? parsed : [];
  } catch {
    return [];
  }
}

function formatNumber(value: number) {
  if (value < 10) return Number((Math.round(value * 2) / 2).toFixed(1)).toString();
  if (value <= 100) return Math.round(value).toString();
  return (Math.round(value / 5) * 5).toString();
}

function scaledNote(note: string | undefined, ratio: number) {
  if (!note || ratio === 1) return note;
  return note.replace(/约\s*(\d+(?:\.\d+)?)\s*(个|只|张|瓣)/, (_, amount: string, unit: string) => {
    const value = Number(amount) * ratio;
    if (Number.isInteger(value)) return `约 ${value} ${unit}`;
    return `约 ${Math.max(1, Math.floor(value))}–${Math.ceil(value)} ${unit}`;
  });
}

function scaleIngredient(ingredient: Ingredient, ratio: number) {
  const amount = ingredient.amount * ratio;
  const isDiscrete = ["个", "只", "张", "颗", "块"].includes(ingredient.unit);

  if (ingredient.unit === "个" && ingredient.name.includes("鸡蛋") && !Number.isInteger(amount)) {
    return {
      amount: `准备 ${Math.ceil(amount)} 个`,
      detail: `打散后取约 ${Math.round(amount * 50)}g`,
    };
  }

  if (isDiscrete && !Number.isInteger(amount)) {
    if (amount < 1) return { amount: `准备 1 ${ingredient.unit}`, detail: "取约一半使用" };
    return {
      amount: `约 ${Math.floor(amount)}–${Math.ceil(amount)} ${ingredient.unit}`,
      detail: scaledNote(ingredient.note, ratio),
    };
  }

  return {
    amount: `${formatNumber(amount)} ${ingredient.unit}`,
    detail: scaledNote(ingredient.note, ratio),
  };
}

function IngredientChecklist({ recipe, servings }: { recipe: Recipe; servings: number }) {
  const key = checksKey(recipe.slug, servings);
  const snapshot = useSyncExternalStore(
    (onChange) => {
      const handler = () => onChange();
      window.addEventListener("storage", handler);
      window.addEventListener(CHECKS_EVENT, handler);
      return () => {
        window.removeEventListener("storage", handler);
        window.removeEventListener(CHECKS_EVENT, handler);
      };
    },
    () => readChecks(key),
    () => "[]",
  );
  const checked = useMemo(() => parseChecks(snapshot), [snapshot]);
  const ratio = servings / recipe.servings;

  const update = (next: string[]) => {
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event(CHECKS_EVENT));
  };

  const groups = (["主料", "辅料", "调料"] as const)
    .map((name) => ({ name, ingredients: recipe.ingredients.filter((item) => item.group === name) }))
    .filter((group) => group.ingredients.length > 0);

  return (
    <section id="ingredients" className="scroll-mt-28">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-sm font-bold text-primary">INGREDIENTS</p>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">准备好这些食材</h2>
          <p className="mt-2 text-sm text-muted-foreground">当前为 {servings} 人份，点一下就能标记已经备好的食材。</p>
        </div>
        {checked.length > 0 && (
          <button type="button" onClick={() => update([])} className="shrink-0 text-sm font-bold text-muted-foreground transition hover:text-primary">
            全部取消
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-[24px] border bg-card card-shadow">
        {groups.map((group, groupIndex) => (
          <div key={group.name} className={groupIndex ? "border-t" : ""}>
            <div className="bg-[#fff7ee] px-4 py-3 text-sm font-black text-primary sm:px-6">{group.name}</div>
            <ul>
              {group.ingredients.map((ingredient, index) => {
                const id = `${group.name}-${ingredient.name}-${index}`;
                const active = checked.includes(id);
                const display = scaleIngredient(ingredient, ratio);
                return (
                  <li key={id} className="border-t first:border-t-0">
                    <label className="flex min-h-16 cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-secondary/25 sm:px-6">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={active}
                        onChange={() => update(active ? checked.filter((item) => item !== id) : [...checked, id])}
                      />
                      <span className="grid size-6 shrink-0 place-items-center rounded-lg border-2 border-border bg-white text-transparent transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                        <Check className="size-4 stroke-[3]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block font-bold transition ${active ? "text-muted-foreground line-through" : ""}`}>{ingredient.name}</span>
                        {display.detail && <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{display.detail}</span>}
                      </span>
                      <span className={`max-w-[42%] text-right font-black text-primary ${active ? "opacity-50" : ""}`}>{display.amount}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function RecipeDetailClient({ recipe, variant = "workspace" }: { recipe: Recipe; variant?: "actions" | "workspace" }) {
  const [servings, setServings] = useState(recipe.servings);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      const key = "cfm:v1:recent-recipes";
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      const recents = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && item !== recipe.slug) : [];
      localStorage.setItem(key, JSON.stringify([recipe.slug, ...recents].slice(0, 8)));
      window.dispatchEvent(new CustomEvent("cfm:storage", { detail: { key } }));
    } catch {
      // 浏览器禁用本地存储时，菜谱仍可正常浏览。
    }
  }, [recipe.slug]);

  const share = async () => {
    const data = { title: `${recipe.title}｜Cook for Me`, text: recipe.summary, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      // 用户取消系统分享时无需报错。
    }
  };

  if (variant === "actions") {
    return (
      <div className="flex items-center gap-2">
        <LikeButton slug={recipe.slug} initialCount={recipe.likes} />
        <FavoriteButton slug={recipe.slug} />
        <button type="button" onClick={share} className="grid size-11 place-items-center rounded-full border bg-card text-muted-foreground transition hover:scale-105 hover:text-primary" aria-label="分享菜谱">
          {shared ? <Check className="size-5 text-[#5e8557]" /> : <Share2 className="size-5" />}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <IngredientChecklist recipe={recipe} servings={servings} />

      <aside className="rounded-[26px] border bg-card p-5 card-shadow lg:sticky lg:top-24">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-muted-foreground">这次做几人份？</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><Users className="size-4" />食材会自动换算</div>
          </div>
          <div className="flex items-center rounded-full border bg-[#fff9f0] p-1">
            <button type="button" onClick={() => setServings((value) => Math.max(1, value - 1))} disabled={servings === 1} aria-label="减少一人份" className="grid size-10 place-items-center rounded-full transition hover:bg-secondary disabled:opacity-35"><Minus className="size-4" /></button>
            <span className="w-14 text-center text-lg font-black">{servings} 人</span>
            <button type="button" onClick={() => setServings((value) => Math.min(8, value + 1))} disabled={servings === 8} aria-label="增加一人份" className="grid size-10 place-items-center rounded-full transition hover:bg-secondary disabled:opacity-35"><Plus className="size-4" /></button>
          </div>
        </div>
        <div className="my-5 h-px bg-border" />
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground">
          <div className="rounded-2xl bg-[#fff7ed] p-3"><Clock3 className="mx-auto mb-1 size-5 text-primary" /><strong className="block text-sm text-foreground">{recipe.prepMinutes} 分钟</strong>准备</div>
          <div className="rounded-2xl bg-[#edf5e8] p-3"><Flame className="mx-auto mb-1 size-5 text-[#5e8557]" /><strong className="block text-sm text-foreground">{recipe.cookMinutes} 分钟</strong>烹饪</div>
          <div className="rounded-2xl bg-[#fff5d9] p-3"><Sparkles className="mx-auto mb-1 size-5 text-[#b67d08]" /><DifficultyStars difficulty={recipe.difficulty} className="justify-center" /><span className="mt-1 block">易做程度</span></div>
        </div>
        <Button asChild size="lg" className="mt-5 h-14 w-full rounded-2xl text-base font-black shadow-[0_12px_24px_rgba(240,100,58,.24)]"><Link href={`/cook/${recipe.slug}?servings=${servings}`}><ChefHat className="size-5" />开始做菜<ChevronRight className="size-5" /></Link></Button>
        <a href="#ingredients" className="mt-3 flex h-11 items-center justify-center text-sm font-bold text-muted-foreground transition hover:text-primary">先核对食材</a>
      </aside>
      </div>

      <div className="fixed inset-x-0 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 border-t bg-[#fffdf8]/95 p-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex items-center rounded-full border bg-white p-0.5">
            <button type="button" onClick={() => setServings((value) => Math.max(1, value - 1))} disabled={servings === 1} aria-label="减少一人份" className="grid size-9 place-items-center disabled:opacity-30"><Minus className="size-4" /></button>
            <span className="w-12 text-center text-sm font-black">{servings}人</span>
            <button type="button" onClick={() => setServings((value) => Math.min(8, value + 1))} disabled={servings === 8} aria-label="增加一人份" className="grid size-9 place-items-center disabled:opacity-30"><Plus className="size-4" /></button>
          </div>
          <Button asChild className="h-12 flex-1 rounded-2xl font-black"><Link href={`/cook/${recipe.slug}?servings=${servings}`}><ChefHat />开始做菜</Link></Button>
        </div>
      </div>
    </>
  );
}
