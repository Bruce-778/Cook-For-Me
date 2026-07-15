import Link from "next/link";
import { Heart, Search } from "lucide-react";

export function Brand() {
  return <Link href="/" className="group flex items-center gap-2.5" aria-label="Cook for Me 首页"><span className="grid size-10 place-items-center rounded-[14px] bg-primary text-xl shadow-[0_8px_20px_rgba(240,100,58,.22)]">🍳</span><span className="text-[20px] font-black tracking-[-0.04em]">Cook <span className="text-primary">for Me</span></span></Link>;
}

export function SiteHeader() {
  return <header className="sticky top-0 z-40 hidden border-b border-border/70 bg-[#fffaf1]/90 backdrop-blur-xl md:block"><div className="page-shell flex h-[72px] items-center justify-between"><Brand /><nav className="flex items-center gap-8 text-[15px] font-semibold"><Link href="/" className="transition-colors hover:text-primary">首页</Link><Link href="/discover" className="transition-colors hover:text-primary">发现菜谱</Link><Link href="/ranking" className="transition-colors hover:text-primary">热门排行</Link></nav><div className="flex items-center gap-2"><Link href="/discover" className="grid size-11 place-items-center rounded-full transition hover:bg-secondary" aria-label="搜索"><Search className="size-5" /></Link><Link href="/favorites" className="grid size-11 place-items-center rounded-full transition hover:bg-secondary" aria-label="收藏"><Heart className="size-5" /></Link></div></div></header>;
}
