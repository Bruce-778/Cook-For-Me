import { NextResponse } from "next/server";
import { z } from "zod";
import { DIETARY_OPTIONS, generateMenu } from "@/lib/blindbox";

const schema = z.object({ servings:z.number().int().min(1).max(8),maxMinutes:z.union([z.literal(0),z.literal(30),z.literal(60)]),exclusions:z.array(z.enum(DIETARY_OPTIONS)).default([]),babyAge:z.number().int().min(6).max(24).optional(),avoidSlugs:z.array(z.string()).optional(),replaceIndex:z.number().int().min(0).optional(),currentSlugs:z.array(z.string()).optional() });
export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > 16_000) return NextResponse.json({ code: "PAYLOAD_TOO_LARGE", message: "请求内容过大，请重新选择条件。" }, { status: 413 });
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 16_000) return NextResponse.json({ code: "PAYLOAD_TOO_LARGE", message: "请求内容过大，请重新选择条件。" }, { status: 413 });
    const input=schema.parse(JSON.parse(rawBody));
    return NextResponse.json(generateMenu(input));
  }
  catch(error) { return NextResponse.json({code:"NO_VALID_MENU",message:error instanceof Error?error.message:"无法生成菜单。"},{status:400}); }
}
