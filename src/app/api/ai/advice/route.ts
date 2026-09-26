import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { aiAdviceSchema, aiChatRequestSchema, type AiAdvice } from "@/lib/ai/types";
import { buildRecipeContext, COOK_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { assessHealthRisk, emergencyAdvice, recipeMatchesConstraints } from "@/lib/ai/safeguards";
import { recipes, type Recipe } from "@/lib/recipes";

export const runtime = "nodejs";

type RateEntry = { count: number; resetAt: number };
const globalForAi = globalThis as typeof globalThis & { cookAiRateLimits?: Map<string, RateEntry> };
const rateLimits = globalForAi.cookAiRateLimits ?? new Map<string, RateEntry>();
globalForAi.cookAiRateLimits = rateLimits;

const MAX_RATE_ENTRIES = 10_000;
const RATE_WINDOW_MS = 60_000;

function jsonResponse(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);
  // Dietary questions may contain health information. Never let an intermediary
  // cache either the request result or a rate-limit/error response.
  response.headers.set("Cache-Control", "no-store");
  return response;
}

function requestIdentity(request: NextRequest) {
  const raw = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  return createHash("sha256").update(raw).digest("hex").slice(0, 24);
}

function withinRateLimit(id: string) {
  const now = Date.now();
  // This limiter is intentionally process-local, but it must not retain one
  // entry forever for every spoofed address. Prune expired entries periodically
  // and cap the map as a last-resort memory guard.
  if (rateLimits.size >= MAX_RATE_ENTRIES) {
    for (const [key, value] of rateLimits) {
      if (value.resetAt <= now) rateLimits.delete(key);
    }
    if (rateLimits.size >= MAX_RATE_ENTRIES) {
      const oldestKey = rateLimits.keys().next().value;
      if (oldestKey) rateLimits.delete(oldestKey);
    }
  }
  const entry = rateLimits.get(id);
  if (!entry || entry.resetAt <= now) {
    rateLimits.set(id, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= 8) return false;
  entry.count += 1;
  return true;
}

function safeFallback(message: string, medical: boolean): AiAdvice {
  const ingredientWords = ["鸡蛋", "番茄", "西红柿", "土豆", "豆腐", "鸡肉", "猪肉", "牛肉", "虾", "鱼", "面条", "米饭", "白菜", "西兰花"].filter((word) => message.includes(word));
  const eligible = recipes
    .filter((recipe) => recipeMatchesConstraints(recipe, message));
  const preferred = eligible
    .sort((a, b) => {
      const score = (recipe: Recipe) => ingredientWords.filter((word) => `${recipe.title}${recipe.aliases.join("")}${recipe.ingredients.map((item) => item.name).join("")}`.includes(word)).length * 10
        + (medical && recipe.tags.includes("清淡恢复") ? 4 : 0)
        + (recipe.tags.includes("新手推荐") ? 2 : 0);
      return score(b) - score(a) || (a.prepMinutes + a.activeMinutes + a.waitMinutes) - (b.prepMinutes + b.activeMinutes + b.waitMinutes);
    })
    .slice(0, 3);
  return {
    intent: medical ? "身体不适" : "日常选择",
    title: medical ? "先选温和、容易执行的一餐" : "先从这几道稳妥的家常菜开始",
    summary: preferred.length === 0
      ? "当前条件下没有足够明确且符合要求的站内菜谱，请放宽时间或补充食材与忌口信息。"
      : medical
        ? "AI 暂时没有返回完整结果，我先按你的条件筛选了几道站内菜。身体不适时，能否进食仍要以医生建议和实际症状为准。"
        : "AI 暂时没有返回完整结果，我先按你给出的条件挑了几道站内菜谱。",
    recommendations: preferred.map((recipe) => ({ slug: recipe.slug, reason: `${recipe.title}步骤完整，站内可以直接进入烹饪模式。`, adjustment: "按菜谱标注的用量、火候和成熟状态操作。" })),
    tips: ["告诉我人数、时间和现有食材，下一次推荐会更准确"],
    caution: medical ? "本站建议不能替代医生诊断；若症状明显、持续或加重，请及时就医。" : "",
    followUpQuestion: "你有忌口、过敏，或者必须优先用掉的食材吗？",
    urgency: medical ? "medical-caution" : "normal",
  };
}

function textValue(value: unknown, fallback: string, maxLength: number) {
  return (typeof value === "string" && value.trim() ? value.trim() : fallback).slice(0, maxLength);
}

function normalizeModelAdvice(value: unknown): AiAdvice {
  const raw = value && typeof value === "object" ? value as Record<string, unknown> : {};
  const allowedIntents: AiAdvice["intent"][] = ["日常选择", "现有食材", "减脂管理", "身体不适", "忌口过敏", "快速做饭", "家庭场景"];
  const intent = allowedIntents.includes(raw.intent as AiAdvice["intent"]) ? raw.intent as AiAdvice["intent"] : "日常选择";
  const allowedUrgencies: AiAdvice["urgency"][] = ["normal", "medical-caution", "emergency"];
  const urgency = allowedUrgencies.includes(raw.urgency as AiAdvice["urgency"]) ? raw.urgency as AiAdvice["urgency"] : "normal";
  const recommendations = Array.isArray(raw.recommendations) ? raw.recommendations.slice(0, 5).flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const entry = item as Record<string, unknown>;
    if (typeof entry.slug !== "string" || !entry.slug.trim()) return [];
    return [{ slug: entry.slug.trim(), reason: textValue(entry.reason, "这道菜符合你刚才说的条件。", 120), adjustment: textValue(entry.adjustment, "", 120) }];
  }) : [];
  const tips = Array.isArray(raw.tips) ? raw.tips.filter((tip): tip is string => typeof tip === "string" && tip.trim().length > 0).slice(0, 4).map((tip) => tip.trim().slice(0, 100)) : [];
  return aiAdviceSchema.parse({
    intent,
    title: textValue(raw.title, "给你几道今天能做的菜", 40),
    summary: textValue(raw.summary, "我按你给出的条件，从站内菜谱里缩小了选择。", 260),
    recommendations,
    tips,
    caution: textValue(raw.caution, "", 220),
    followUpQuestion: textValue(raw.followUpQuestion, "", 100),
    urgency,
  });
}

export async function POST(request: NextRequest) {
  const id = requestIdentity(request);
  if (!withinRateLimit(id)) {
    return jsonResponse({ error: "问得有点快啦，请一分钟后再试。" }, { status: 429 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > 12_000) return jsonResponse({ error: "消息太长了，请精简后再试。" }, { status: 413 });

  let body: unknown;
  try {
    // Content-Length is optional and client-controlled. Read the actual body so
    // chunked requests cannot bypass the payload limit before JSON parsing.
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 12_000) {
      return jsonResponse({ error: "消息太长了，请精简后再试。" }, { status: 413 });
    }
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "请求格式不正确。" }, { status: 400 });
  }
  const parsed = aiChatRequestSchema.safeParse(body);
  if (!parsed.success) return jsonResponse({ error: parsed.error.issues[0]?.message || "请检查输入内容。" }, { status: 400 });

  const risk = assessHealthRisk(parsed.data.message);
  if (risk.emergency) return jsonResponse(emergencyAdvice());

  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) return jsonResponse(safeFallback(parsed.data.message, risk.medical), { status: 200 });

  const apiBaseUrl = (process.env.DEEPSEEK_API_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-flash";

  const messages = [
    { role: "system", content: COOK_ASSISTANT_SYSTEM_PROMPT },
    { role: "system", content: `站内菜谱目录（JSON）：${buildRecipeContext(recipes)}` },
    ...parsed.data.history,
    { role: "user", content: `${parsed.data.message}\n\n本地风险标记：medical=${risk.medical}; extreme_weight=${risk.extremeWeight}。请输出合法 JSON object。` },
  ];

  try {
    const response = await fetch(`${apiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages,
        thinking: { type: "disabled" },
        response_format: { type: "json_object" },
        max_tokens: 1200,
        temperature: 0.25,
      }),
      signal: AbortSignal.timeout(28_000),
    });

    if (!response.ok) {
      console.error("DeepSeek request failed", response.status);
      return jsonResponse(safeFallback(parsed.data.message, risk.medical), { status: 200 });
    }

    const responseText = await response.text();
    if (new TextEncoder().encode(responseText).byteLength > 100_000) {
      console.error("DeepSeek response exceeded the safety limit");
      return jsonResponse(safeFallback(parsed.data.message, risk.medical), { status: 200 });
    }
    const data = JSON.parse(responseText) as { choices?: Array<{ message?: { content?: string | null } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return jsonResponse(safeFallback(parsed.data.message, risk.medical));

    const advice = normalizeModelAdvice(JSON.parse(content));
    const recipeMap = new Map(recipes.map((recipe) => [recipe.slug, recipe]));
    const recommendations = advice.recommendations
      .filter((item) => recipeMap.has(item.slug))
      .filter((item) => recipeMatchesConstraints(recipeMap.get(item.slug)!, parsed.data.message))
      .slice(0, 5);
    if (advice.urgency === "emergency") return jsonResponse(emergencyAdvice());
    if (advice.recommendations.length > 0 && recommendations.length === 0) {
      return jsonResponse(safeFallback(parsed.data.message, risk.medical));
    }
    const result: AiAdvice = {
      ...advice,
      recommendations,
      urgency: risk.medical && advice.urgency === "normal" ? "medical-caution" : advice.urgency,
      caution: risk.extremeWeight
        ? "不建议极端节食、催吐、减肥药或用固定低热量硬扛。若已经出现头晕、停经、暴食或强烈进食焦虑，请尽快咨询医生或注册营养师。"
        : advice.caution,
    };
    return jsonResponse(result);
  } catch (error) {
    console.error("AI advice unavailable", error instanceof Error ? error.message : "unknown error");
    return jsonResponse(safeFallback(parsed.data.message, risk.medical));
  }
}
