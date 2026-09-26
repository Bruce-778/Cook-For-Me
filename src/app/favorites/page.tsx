import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { FavoritesClient } from "@/components/favorites-client";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "我的收藏",
  description: "保存在这台设备上的 Cook for Me 菜谱收藏。",
};

export default function FavoritesPage() {
  return (
    <div className="page-shell py-8 md:py-12 lg:py-16">
      <header className="max-w-2xl">
        <p className="flex items-center gap-2 text-sm font-bold text-primary"><Heart className="size-4 fill-primary" />留住下一顿想吃的</p>
        <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] md:text-5xl">我的收藏</h1>
        <p className="mt-3 leading-7 text-muted-foreground md:text-lg">收藏保存在本机，无需登录。</p>
      </header>
      <FavoritesClient recipes={recipes} />
    </div>
  );
}
