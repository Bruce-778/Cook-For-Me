import Link from "next/link";
import { ChefHat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipeNotFound() {
  return <div className="page-shell grid min-h-[70vh] place-items-center py-20"><div className="max-w-lg text-center"><div className="mx-auto grid size-24 place-items-center rounded-[30px] bg-secondary text-primary soft-shadow"><ChefHat className="size-12" /></div><p className="mt-7 text-sm font-black text-primary">404 · RECIPE NOT FOUND</p><h1 className="mt-2 text-4xl font-black tracking-tight">这道菜暂时不在菜单里</h1><p className="mt-4 leading-7 text-muted-foreground">可能是菜谱改了名字，也可能正在重新整理。去发现页看看其他简单又好吃的家常菜吧。</p><Button asChild size="lg" className="mt-7 h-13 rounded-2xl px-6 font-black"><Link href="/discover"><Search />发现其他菜谱</Link></Button></div></div>;
}
