"use client";

import { type ReactNode, useCallback, useEffect, useState } from "react";
import { CheckCircle2, CircleAlert, Eye, EyeOff, LoaderCircle, LockKeyhole, RefreshCw, ServerCog, ShieldCheck } from "lucide-react";
import type { AiRuntimeStatus } from "@/lib/ai/runtime-status";

const TOKEN_STORAGE_KEY = "cook-for-me-ai-diagnostics-token";
const DIAGNOSTICS_HEADER = "x-ai-diagnostics-token";

function ConfigRow({ label, value, good, children }: { label: string; value?: string; good?: boolean; children?: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 py-3 last:border-b-0"><span className="text-sm text-muted-foreground">{label}</span><span className={`max-w-full break-all text-right text-sm font-semibold ${good === false ? "text-destructive" : "text-foreground"}`}>{children ?? value}</span></div>;
}

function ProbeState({ status }: { status: AiRuntimeStatus }) {
  const probe = status.deepseek.probe;
  if (!probe.attempted) return <span className="text-muted-foreground">尚未测试</span>;
  if (probe.ok) return <span className="inline-flex items-center gap-1.5 text-[#456341]"><CheckCircle2 className="size-4" />连接正常 · {probe.latencyMs} ms</span>;
  const labels: Record<string, string> = { missing_api_key: "未配置密钥", invalid_key_or_forbidden: "密钥无效或无权限", endpoint_or_model_not_found: "地址或模型不存在", rate_limited: "请求频率受限", provider_unavailable: "服务商暂不可用", timeout: "请求超时", network_error: "网络连接失败", upstream_error: `上游返回 ${probe.httpStatus ?? "错误"}` };
  return <span className="inline-flex items-center gap-1.5 text-destructive"><CircleAlert className="size-4" />{labels[probe.errorCode || ""] || "连接失败"}</span>;
}

export function AiStatusPanel() {
  const [status, setStatus] = useState<AiRuntimeStatus | null>(null);
  const [token, setToken] = useState(() => typeof window === "undefined" ? "" : window.sessionStorage.getItem(TOKEN_STORAGE_KEY) || "");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [probeLoading, setProbeLoading] = useState(false);
  const [notAuthorised, setNotAuthorised] = useState(false);

  const load = useCallback(async (probe = false, suppliedToken = "") => {
    if (probe) setProbeLoading(true); else setLoading(true);
    setNotAuthorised(false);
    try {
      const headers: HeadersInit = {};
      if (suppliedToken.trim()) headers[DIAGNOSTICS_HEADER] = suppliedToken.trim();
      const response = await fetch(`/api/ai/status${probe ? "?probe=1" : ""}`, { headers, cache: "no-store" });
      if (response.status === 404) { setNotAuthorised(true); setStatus(null); return; }
      if (!response.ok) throw new Error("诊断接口暂时不可用");
      setStatus(await response.json() as AiRuntimeStatus);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
      setProbeLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(false, window.sessionStorage.getItem(TOKEN_STORAGE_KEY) || "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function saveToken(value: string) {
    setToken(value);
    if (value.trim()) window.sessionStorage.setItem(TOKEN_STORAGE_KEY, value.trim());
    else window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  return <div className="space-y-5">
    <div className="rounded-[24px] border border-[#e9d9cd] bg-white/80 p-5 shadow-[0_12px_35px_rgba(111,67,42,.07)] md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2 text-primary"><ServerCog className="size-5" /><span className="text-xs font-black tracking-[.16em]">COOK FOR ME · DIAGNOSTICS</span></div><h1 className="mt-2 text-2xl font-black md:text-3xl">AI 运行状态</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">这里显示接口是否配置、使用的模型和连接结果。完整 API Key 不会出现在网页里，只显示长度和指纹，避免被浏览器或截图泄露。</p></div><ShieldCheck className="size-8 text-[#5e8557]" /></div>
      <div className="mt-5 rounded-2xl bg-[#fff7df] p-4 text-sm leading-6 text-[#75563e]"><strong>关于“锁定”：</strong>部署平台把密钥显示为锁定是正常的安全策略。旧的完整密钥通常不能再次读取，只能重新设置或轮换。若生产环境设置了 <code>AI_DIAGNOSTICS_TOKEN</code>，请在下面输入它查看脱敏状态。</div>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row"><label className="relative flex min-h-11 flex-1 items-center rounded-xl border bg-white px-3"><LockKeyhole className="mr-2 size-4 text-muted-foreground" /><input value={token} onChange={(event) => saveToken(event.target.value)} type={showToken ? "text" : "password"} placeholder="生产诊断令牌（本地开发可留空）" className="min-w-0 flex-1 bg-transparent text-sm outline-none" aria-label="生产诊断令牌" /> <button type="button" onClick={() => setShowToken((value) => !value)} className="p-1 text-muted-foreground" aria-label={showToken ? "隐藏诊断令牌" : "显示诊断令牌"}>{showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></label><button type="button" onClick={() => void load(false, token)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-bold hover:border-primary/40 hover:text-primary"><RefreshCw className="size-4" />刷新状态</button><button type="button" onClick={() => void load(true, token)} disabled={probeLoading} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-white hover:bg-[#d94f2a] disabled:opacity-60">{probeLoading ? <LoaderCircle className="size-4 animate-spin" /> : <ServerCog className="size-4" />}测试 DeepSeek</button></div>
      {notAuthorised && <p role="alert" className="mt-4 text-sm text-destructive">没有权限读取诊断信息。生产环境请设置并输入 `AI_DIAGNOSTICS_TOKEN`；本地开发访问 `http://localhost:3001/ai-status` 不需要令牌。</p>}
      {!notAuthorised && loading && <p className="mt-5 text-sm text-muted-foreground">正在读取服务端配置状态…</p>}
    </div>

    {status && <>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[24px] border border-[#e9d9cd] bg-white/80 p-5 md:p-6"><h2 className="text-lg font-black">DeepSeek</h2><div className="mt-3"><ConfigRow label="站内调用接口" value="POST /api/ai/advice" /><ConfigRow label="密钥状态" value={status.deepseek.configured ? `已配置（${status.deepseek.keyLength} 位，指纹 ${status.deepseek.keyFingerprint}）` : "未配置，将使用站内规则推荐"} good={status.deepseek.configured} /><ConfigRow label="模型" value={status.deepseek.model} /><ConfigRow label="接口地址" value={status.deepseek.baseUrl} /><ConfigRow label="探测结果"><ProbeState status={status} /></ConfigRow></div></section>
        <section className="rounded-[24px] border border-[#e9d9cd] bg-white/80 p-5 md:p-6"><h2 className="text-lg font-black">其他运行信息</h2><div className="mt-3"><ConfigRow label="运行环境" value={status.environment} /><ConfigRow label="站点地址" value={status.publicSiteUrl || "未设置"} good={Boolean(status.publicSiteUrl)} /><ConfigRow label="Supabase URL" value={status.supabase.urlConfigured ? "已配置" : "未配置"} good={status.supabase.urlConfigured} /><ConfigRow label="Supabase publishable key" value={status.supabase.publishableKeyConfigured ? "已配置" : "未配置"} good={status.supabase.publishableKeyConfigured} /><ConfigRow label="Supabase secret key" value={status.supabase.secretKeyConfigured ? "已配置（仅服务端）" : "未配置"} good={status.supabase.secretKeyConfigured} /><ConfigRow label="草稿菜谱策略" value={status.draftPolicy || "未明确设置"} /></div></section>
      </div>
      <p className="text-center text-xs text-muted-foreground">状态生成时间：{new Date(status.generatedAt).toLocaleString("zh-CN")}</p>
    </>}
  </div>;
}
