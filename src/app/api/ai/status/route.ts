import { NextRequest, NextResponse } from "next/server";
import { collectAiRuntimeStatus, isDiagnosticsRequestAuthorized } from "@/lib/ai/runtime-status";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!isDiagnosticsRequestAuthorized(request)) {
    // Deliberately do not reveal that the route exists to unauthorised visitors.
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const probe = new URL(request.url).searchParams.get("probe") === "1";
  const status = await collectAiRuntimeStatus(probe);
  return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
}
