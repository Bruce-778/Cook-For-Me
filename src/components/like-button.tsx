"use client";

import { Heart, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { ensureAnonymousSession, isSupabaseConfigured } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";

export function LikeButton({ slug, initialCount = 0, compact = false, className }: { slug: string; initialCount?: number; compact?: boolean; className?: string }) {
  const configured = isSupabaseConfigured();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!configured) return;
    let active = true;
    void ensureAnonymousSession().then(async (session) => {
      if (!session) return;
      const response = await fetch(`/api/recipes/${slug}/like`, { headers: { authorization: `Bearer ${session.access_token}` } });
      if (!response.ok || !active) return;
      const data = await response.json() as { liked: boolean; totalLikes: number };
      setLiked(data.liked); setCount(data.totalLikes);
    }).catch(() => setMessage("暂时无法连接点赞服务"));
    return () => { active = false; };
  }, [configured, slug]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(""), 4200);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function toggle(event: React.MouseEvent) {
    event.preventDefault(); event.stopPropagation();
    if (!configured || busy) { setMessage(configured ? "正在处理" : "点赞服务尚未连接，请先配置 Supabase"); return; }
    const previousLiked = liked; const previousCount = count;
    setLiked(!liked); setCount(Math.max(0, count + (liked ? -1 : 1))); setBusy(true); setMessage("");
    try {
      const session = await ensureAnonymousSession();
      if (!session) throw new Error("no session");
      const response = await fetch(`/api/recipes/${slug}/like`, { method: liked ? "DELETE" : "POST", headers: { authorization: `Bearer ${session.access_token}` } });
      const data = await response.json() as { liked?: boolean; totalLikes?: number; message?: string };
      if (!response.ok) throw new Error(data.message ?? "点赞失败");
      setLiked(Boolean(data.liked)); setCount(data.totalLikes ?? 0);
      window.dispatchEvent(new CustomEvent("cfm:likes", { detail: { slug, count: data.totalLikes, liked: data.liked } }));
    } catch (error) { setLiked(previousLiked); setCount(previousCount); setMessage(error instanceof Error ? error.message : "点赞失败"); }
    finally { setBusy(false); }
  }

  return <div className={cn("relative inline-flex", className)}><button type="button" onClick={toggle} disabled={busy} aria-pressed={liked} aria-label={liked ? "取消点赞" : "点赞这道菜"} title={configured ? "真实点赞" : "点赞服务待配置"} className={cn("inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border bg-card/95 px-3 font-bold text-muted-foreground transition hover:text-primary disabled:opacity-65", compact && "size-10 px-0")}>
    {busy ? <LoaderCircle className="size-5 animate-spin" /> : <Heart className={cn("size-5", liked && "fill-primary text-primary")} />}{!compact && <span className="tabular-nums">{count}</span>}
  </button>{message && <span role="status" className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)] left-1/2 z-[70] w-max max-w-[calc(100vw-32px)] -translate-x-1/2 rounded-full bg-[#3a251e] px-4 py-2.5 text-center text-sm font-bold text-white shadow-xl md:bottom-8">{message}</span>}<span className="sr-only" aria-live="polite">{message}</span></div>;
}
