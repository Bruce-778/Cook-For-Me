"use client";
import Link from "next/link";
import { ChefHat, Flame, Gift, Heart, Home } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [{ href: "/", label: "首页", icon: Home }, { href: "/discover", label: "分类", icon: ChefHat }, { href: "/blindbox", label: "食物盲盒", icon: Gift }, { href: "/ranking", label: "排行", icon: Flame }, { href: "/favorites", label: "收藏", icon: Heart }];
export function BottomNav() {
  const pathname = usePathname();
  if (pathname.startsWith("/cook/")) return null;
  return <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-[#fffdf8]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"><div className="grid h-16 grid-cols-5">{items.map(({ href, label, icon: Icon }) => { const active = href === "/" ? pathname === "/" : pathname.startsWith(href); return <Link key={href} href={href} className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${active ? "text-primary" : "text-muted-foreground"}`}><Icon className={`size-[21px] ${active ? "stroke-[2.6]" : "stroke-2"}`} /><span>{label}</span></Link>; })}</div></nav>;
}
