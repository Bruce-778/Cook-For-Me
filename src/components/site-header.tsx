import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { HeaderCategoryMenus } from "@/components/header-category-menus";

export function Brand() {
  return <Link href="/" className="group flex items-center gap-2.5" aria-label="Cook for Me 首页"><span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-primary text-xl shadow-[0_8px_20px_rgba(240,100,58,.22)]">🍳</span><span className="brand-label whitespace-nowrap text-[20px] font-black tracking-[-0.04em]">Cook <span className="text-primary">for Me</span></span></Link>;
}

export function SiteHeader() {
  return <header className="sticky top-0 z-40 hidden border-b border-border/70 bg-[#fffaf1]/90 backdrop-blur-xl md:block md:[&_.brand-label]:hidden xl:[&_.brand-label]:inline"><div className="page-shell flex h-[72px] items-center justify-between gap-2 xl:gap-4"><Brand /><nav className="flex items-center gap-0 text-sm font-semibold xl:gap-1 xl:text-[15px]"><Link href="/" className="min-h-11 rounded-full px-2.5 py-3 transition-colors hover:bg-secondary hover:text-primary xl:px-3">首页</Link><HeaderCategoryMenus /><Link href="/blindbox" className="min-h-11 rounded-full px-2.5 py-3 transition-colors hover:bg-secondary hover:text-primary xl:px-3">食物盲盒</Link><Link href="/ranking" className="min-h-11 rounded-full px-2.5 py-3 transition-colors hover:bg-secondary hover:text-primary xl:px-3">热门排行</Link></nav><div className="flex items-center"><Link href="/discover" className="grid size-11 place-items-center rounded-full transition hover:bg-secondary" aria-label="搜索"><Search className="size-5" /></Link><Link href="/favorites" className="grid size-11 place-items-center rounded-full transition hover:bg-secondary" aria-label="收藏"><Heart className="size-5" /></Link></div></div></header>;
}
