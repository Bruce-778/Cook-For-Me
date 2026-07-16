import { NextResponse } from "next/server";
import { z } from "zod";
import { DIETARY_OPTIONS, generateMenu } from "@/lib/blindbox";

const schema = z.object({ servings:z.number().int().min(1).max(8),maxMinutes:z.union([z.literal(0),z.literal(30),z.literal(60)]),exclusions:z.array(z.enum(DIETARY_OPTIONS)).default([]),babyAge:z.number().int().min(6).max(24).optional(),avoidSlugs:z.array(z.string()).optional(),replaceIndex:z.number().int().min(0).optional(),currentSlugs:z.array(z.string()).optional() });
export async function POST(request: Request) {
  try { const input=schema.parse(await request.json()); return NextResponse.json(generateMenu(input)); }
  catch(error) { return NextResponse.json({code:"NO_VALID_MENU",message:error instanceof Error?error.message:"无法生成菜单。"},{status:400}); }
}
