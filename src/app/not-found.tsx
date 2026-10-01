import Link from "next/link";
import { ArrowLeft, ChefHat, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-[calc(100vh-72px)] items-center justify-center py-16">
      <section className="w-full max-w-2xl overflow-hidden rounded-[32px] border bg-card p-7 text-center shadow-[0_22px_70px_rgba(111,67,42,.10)] sm:p-12">
        <div className="mx-auto grid size-20 place-items-center rounded-[26px] bg-[#fff0e3] text-4xl">🍳</div>
        <p className="mt-7 text-sm font-black tracking-[.18em] text-primary">这页还没摆上桌</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">找不到这道菜</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">页面可能已经换了位置。回到菜谱列表，或者让小厨按手边食材帮你重新挑一道。</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-5 font-black text-white transition hover:bg-[#d94f2a]"><ArrowLeft className="size-4" />回到首页</Link>
          <Link href="/discover" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border bg-white px-5 font-black transition hover:border-primary/40 hover:text-primary"><Search className="size-4" />发现菜谱</Link>
          <Link href="/blindbox" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border bg-white px-5 font-black transition hover:border-primary/40 hover:text-primary"><ChefHat className="size-4" />开食物盲盒</Link>
        </div>
      </section>
    </main>
  );
}
