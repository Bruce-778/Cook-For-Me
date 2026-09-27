import { createHash, timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

export type AiProbeResult = {
  attempted: boolean;
  ok: boolean;
  httpStatus: number | null;
  latencyMs: number | null;
  errorCode: string | null;
};

export type AiRuntimeStatus = {
  generatedAt: string;
  environment: string;
  publicSiteUrl: string | null;
  draftPolicy: string | null;
  deepseek: {
    configured: boolean;
    baseUrl: string;
    endpoint: string;
    model: string;
    keyLength: number;
    keyFingerprint: string | null;
    probe: AiProbeResult;
  };
  supabase: {
    urlConfigured: boolean;
    publishableKeyConfigured: boolean;
    secretKeyConfigured: boolean;
  };
};

const DIAGNOSTICS_HEADER = "x-ai-diagnostics-token";

function secretFingerprint(value: string | undefined) {
  if (!value) return null;
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function configured(value: string | undefined) {
  return Boolean(value?.trim());
}

function classifyProbeFailure(status: number | null, error: unknown) {
  if (error instanceof Error && error.name === "TimeoutError") return "timeout";
  if (status === 401 || status === 403) return "invalid_key_or_forbidden";
  if (status === 404) return "endpoint_or_model_not_found";
  if (status === 429) return "rate_limited";
  if (status !== null && status >= 500) return "provider_unavailable";
  if (status !== null) return "upstream_error";
  return "network_error";
}

async function probeDeepSeek(baseUrl: string, model: string, apiKey: string | undefined): Promise<AiProbeResult> {
  if (!apiKey) return { attempted: false, ok: false, httpStatus: null, latencyMs: null, errorCode: "missing_api_key" };
  const startedAt = performance.now();
  let response: Response | null = null;
  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: "只回复 OK" }],
        max_tokens: 8,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(12_000),
      cache: "no-store",
    });
    return {
      attempted: true,
      ok: response.ok,
      httpStatus: response.status,
      latencyMs: Math.round(performance.now() - startedAt),
      errorCode: response.ok ? null : classifyProbeFailure(response.status, null),
    };
  } catch (error) {
    return {
      attempted: true,
      ok: false,
      httpStatus: response?.status ?? null,
      latencyMs: Math.round(performance.now() - startedAt),
      errorCode: classifyProbeFailure(response?.status ?? null, error),
    };
  }
}

function sameSecret(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isDiagnosticsRequestAuthorized(request: NextRequest) {
  const expectedToken = process.env.AI_DIAGNOSTICS_TOKEN?.trim();
  const suppliedToken = request.headers.get(DIAGNOSTICS_HEADER)?.trim() || "";
  if (expectedToken) return Boolean(suppliedToken) && sameSecret(suppliedToken, expectedToken);

  if (process.env.NODE_ENV === "production") return false;
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

export async function collectAiRuntimeStatus(probe = false): Promise<AiRuntimeStatus> {
  const baseUrl = (process.env.DEEPSEEK_API_BASE_URL || "https://api.deepseek.com").replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-flash";
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  return {
    generatedAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    publicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL?.trim() || null,
    draftPolicy: process.env.KEEP_DRAFT_RECIPES_PRIVATE?.trim() || null,
    deepseek: {
      configured: configured(apiKey),
      baseUrl,
      endpoint: `${baseUrl}/chat/completions`,
      model,
      keyLength: apiKey?.length || 0,
      keyFingerprint: secretFingerprint(apiKey),
      probe: probe ? await probeDeepSeek(baseUrl, model, apiKey) : { attempted: false, ok: false, httpStatus: null, latencyMs: null, errorCode: null },
    },
    supabase: {
      urlConfigured: configured(process.env.NEXT_PUBLIC_SUPABASE_URL),
      publishableKeyConfigured: configured(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
      secretKeyConfigured: configured(process.env.SUPABASE_SECRET_KEY),
    },
  };
}
