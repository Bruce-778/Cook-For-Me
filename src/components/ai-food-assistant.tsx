"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AlertTriangle, ArrowRight, Bot, ChefHat, Clock3, LoaderCircle, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import type { AiAdvice } from "@/lib/ai/types";

type RecipeIndexItem = { slug: string; title: string; totalMinutes: number; difficulty: number; featureTags: string[] };
type HistoryItem = { role: "user" | "assistant"; content: string };

const starters = [
  "我想减脂，今晚吃什么更合适？",
  "最近胃口不好，想吃清淡一点",
  "家里有鸡蛋、番茄和土豆",
  "下班很累，20 分钟内能做什么？",
  "两个人吃，不辣，想要一荤一素",
  "我对海鲜过敏，帮我避开",
];

export function AiFoodAssistant({ recipeIndex }: { recipeIndex: RecipeIndexItem[] }) {
  const [message, setMessage] = useState("");
  const [answer, setAnswer] = useState<AiAdvice | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recipeMap = new Map(recipeIndex.map((recipe) => [recipe.slug, recipe]));

  async function ask(question: string) {
    const clean = question.trim();
    if (clean.length < 2 || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, history: history.slice(-6) }),
      });
      const raw = await response.json() as AiAdvice | { error: string };
      if (!response.ok || ("error" in raw && typeof raw.error === "string")) throw new Error("error" in raw ? raw.error : "暂时没有得到回答");
      const data = raw as AiAdvice;
      setAnswer(data);
      setHistory((current) => ([...current, { role: "user" as const, content: clean }, { role: "assistant" as const, content: `${data.title}。${data.summary}` }].slice(-6)));
      setMessage("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "暂时连接不上小厨，请稍后再试。 ");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(message);
  }

  function reset() {
    setAnswer(null);
    setHistory([]);
    setMessage("");
    setError("");
  }

  return <div className="grid items-start gap-5 lg:grid-cols-[.82fr_1.18fr] lg:gap-7">
    <aside className="rounded-[28px] border border-white/80 bg-white/55 p-5 shadow-[0_18px_50px_rgba(111,67,42,.08)] backdrop-blur md:p-7 lg:sticky lg:top-24">
      <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-primary text-white shadow-[0_10px_25px_rgba(240,100,58,.24)]"><Sparkles className="size-6" /></span><div><p className="text-xs font-bold tracking-[.16em] text-primary">DEEPSEEK 饮食助手</p><h2 className="mt-0.5 text-xl font-black">问小厨</h2></div></div>
      <p className="mt-5 text-sm leading-7 text-muted-foreground">不用先想好菜名。告诉我你有什么、想吃多快、有没有忌口，或者最近的饮食目标。</p>
      <div className="mt-5 grid gap-2.5">{starters.map((starter) => <button key={starter} type="button" onClick={() => void ask(starter)} disabled={loading} className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 text-left text-sm font-semibold transition hover:-translate-y-0.5 hover:border-primary/35 hover:text-primary disabled:opacity-55"><span>{starter}</span><ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-0.5" /></button>)}</div>
      <div className="mt-5 rounded-2xl bg-accent/70 p-4 text-xs leading-6 text-accent-foreground"><div className="flex items-center gap-2 font-bold"><ShieldCheck className="size-4" />推荐边界</div><p className="mt-1 text-accent-foreground/75">只从本站菜谱中选择。健康问题提供一般饮食参考，不诊断、不代替医生，也不会推荐极端节食。</p></div>
    </aside>

    <section className="min-h-[590px] rounded-[30px] border border-white/80 bg-card/90 p-4 shadow-[0_20px_55px_rgba(111,67,42,.10)] sm:p-6 md:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-[#5e8557]">说人话，就能找到今晚这一餐</p><h2 className="mt-1 text-2xl font-black tracking-tight md:text-3xl">你现在想怎么吃？</h2></div>{(answer || history.length > 0) && <button onClick={reset} type="button" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border bg-white px-3.5 text-xs font-bold text-muted-foreground transition hover:border-primary/30 hover:text-primary"><RotateCcw className="size-4" />重新问</button>}</div>

      <form onSubmit={submit} className="mt-6 rounded-[24px] border bg-white p-2 shadow-[0_12px_32px_rgba(111,67,42,.08)] focus-within:border-primary/45">
        <label htmlFor="ai-question" className="sr-only">告诉问小厨你的饮食需求</label>
        <textarea id="ai-question" value={message} onChange={(event) => setMessage(event.target.value.slice(0, 800))} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); if (message.trim().length >= 2) void ask(message); } }} placeholder="例如：我感冒了没胃口，今晚想吃点热乎、清淡、半小时能做好的……" className="min-h-28 w-full resize-none bg-transparent px-3 py-3 text-[15px] leading-7 outline-none placeholder:text-[#ad9a90] md:min-h-32 md:text-base" />
        <div className="flex items-center justify-between gap-3 border-t px-2 pt-2"><span className="text-xs text-muted-foreground">{message.length}/800 · 回车发送，Shift + 回车换行</span><button type="submit" disabled={loading || message.trim().length < 2} className="inline-flex h-11 items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-white transition hover:bg-[#d94f2a] disabled:cursor-not-allowed disabled:opacity-50">{loading ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}{loading ? "正在搭配" : "问小厨"}</button></div>
      </form>

      {error && <div role="alert" className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-5 shrink-0" /><span>{error}</span></div>}

      {!answer && !loading && <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#fff0e3] p-4"><Clock3 className="size-5 text-primary" /><h3 className="mt-3 font-black">先看现实条件</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">时间、人数、食材和厨具都算进去。</p></div><div className="rounded-2xl bg-[#eef6e9] p-4"><ChefHat className="size-5 text-[#5e8557]" /><h3 className="mt-3 font-black">只选站内菜谱</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">结果可以直接进入备菜和烹饪模式。</p></div><div className="rounded-2xl bg-[#f7ecf2] p-4"><ShieldCheck className="size-5 text-[#9b5d78]" /><h3 className="mt-3 font-black">健康问题有边界</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">不替代诊断，危险信号优先提醒就医。</p></div></div>}

      {loading && <div className="mt-8 space-y-3" aria-live="polite"><div className="h-7 w-44 animate-pulse rounded-full bg-muted" /><div className="h-20 animate-pulse rounded-2xl bg-muted" /><div className="grid gap-3 sm:grid-cols-2"><div className="h-36 animate-pulse rounded-2xl bg-muted" /><div className="h-36 animate-pulse rounded-2xl bg-muted" /></div></div>}

      {answer && !loading && <div className="mt-7" aria-live="polite">
        <div className={`rounded-[24px] p-5 md:p-6 ${answer.urgency === "emergency" ? "border border-destructive/25 bg-destructive/5" : answer.urgency === "medical-caution" ? "border border-[#e4bd66]/40 bg-[#fff7df]" : "bg-[#fff0e3]"}`}>
          <div className="flex items-center gap-2 text-xs font-black tracking-wide text-primary"><Bot className="size-4" />{answer.intent}</div><h3 className="mt-2 text-xl font-black md:text-2xl">{answer.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground md:text-[15px]">{answer.summary}</p>
          {answer.caution && <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-white/70 p-3.5 text-xs leading-6 text-[#75563e]"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#d08b2f]" /><span>{answer.caution}</span></div>}
        </div>

        {answer.recommendations.length > 0 && <div className="mt-6"><div className="flex items-end justify-between"><h3 className="text-lg font-black">小厨为你挑了这些</h3><span className="text-xs text-muted-foreground">来自本站 {recipeIndex.length} 道菜谱</span></div><div className="mt-3 grid gap-3 sm:grid-cols-2">{answer.recommendations.map((item) => { const recipe = recipeMap.get(item.slug); if (!recipe) return null; return <Link key={item.slug} href={`/recipes/${item.slug}`} className="group rounded-[22px] border bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_30px_rgba(111,67,42,.09)]"><div className="flex items-start justify-between gap-3"><div><h4 className="text-lg font-black group-hover:text-primary">{recipe.title}</h4><div className="mt-2 flex flex-wrap gap-1.5">{recipe.featureTags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-secondary/60 px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">{tag}</span>)}</div></div><span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{recipe.totalMinutes} 分钟</span></div><p className="mt-3 text-sm leading-6 text-muted-foreground">{item.reason}</p>{item.adjustment && <p className="mt-2 rounded-xl bg-muted/65 px-3 py-2 text-xs leading-5 text-[#6f5548]">这样调整：{item.adjustment}</p>}<span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-primary">查看备菜和步骤<ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" /></span></Link>; })}</div></div>}

        {answer.tips.length > 0 && <div className="mt-5 rounded-[22px] bg-accent/60 p-4"><h3 className="text-sm font-black text-accent-foreground">顺手记住</h3><ul className="mt-2 space-y-2 text-sm leading-6 text-accent-foreground/80">{answer.tips.map((tip) => <li key={tip} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#5e8557]" />{tip}</li>)}</ul></div>}
        {answer.followUpQuestion && <button type="button" onClick={() => { setMessage(answer.followUpQuestion); document.getElementById("ai-question")?.focus(); }} className="mt-4 w-full rounded-2xl border border-dashed border-primary/30 bg-primary/[.035] px-4 py-3 text-left text-sm font-bold text-primary transition hover:bg-primary/[.07]">继续聊：{answer.followUpQuestion}</button>}
      </div>}
    </section>
  </div>;
}
