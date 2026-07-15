"use client";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { FAVORITES_KEY, readStringList, writeStringList } from "@/lib/local-store";
import { cn } from "@/lib/utils";

export function FavoriteButton({ slug, className }: { slug: string; className?: string }) {
  const [active, setActive] = useState(false);
  useEffect(() => setActive(readStringList(FAVORITES_KEY).includes(slug)), [slug]);
  const toggle = () => { const list = readStringList(FAVORITES_KEY); const next = list.includes(slug) ? list.filter((item) => item !== slug) : [slug, ...list]; writeStringList(FAVORITES_KEY, next); setActive(next.includes(slug)); };
  return <button type="button" onClick={toggle} aria-label={active ? "取消收藏" : "收藏菜谱"} className={cn("grid size-11 place-items-center rounded-full border border-border bg-card/95 text-muted-foreground transition hover:scale-105 hover:text-primary", className)}><Heart className={cn("size-5", active && "fill-primary text-primary")} /></button>;
}
