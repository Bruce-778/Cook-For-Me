import { NextResponse } from "next/server";
import { getRecipe } from "@/lib/recipes";
import { getLikeCountMap } from "@/lib/likes";
export async function GET(_request:Request,{params}:{params:Promise<{slug:string}>}){const {slug}=await params;const recipe=getRecipe(slug);if(!recipe)return NextResponse.json({code:"RECIPE_NOT_FOUND",message:"没有找到这道菜。"},{status:404});const counts=(await getLikeCountMap()).get(slug);return NextResponse.json(counts?{...recipe,likes:counts.totalLikes,weeklyLikes:counts.weeklyLikes}:recipe);}
