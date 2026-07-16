import { NextRequest, NextResponse } from "next/server";
import { recipes, totalMinutes } from "@/lib/recipes";
import { getLikeCountMap } from "@/lib/likes";

export async function GET(request: NextRequest){
  const p=request.nextUrl.searchParams;const q=p.get("q")??"";const category=p.get("category");const tags=p.getAll("tag");
  const maxTime=Number(p.get("maxTime")??0);const difficulty=Number(p.get("difficulty")??0);const spice=p.has("spice")?Number(p.get("spice")):-1;const rawPage=Number(p.get("page")??1);const rawLimit=Number(p.get("limit")??24);
  if(!Number.isFinite(maxTime)||maxTime<0||!Number.isInteger(difficulty)||difficulty<0||difficulty>5||!Number.isInteger(spice)||spice<-1||spice>3||!Number.isInteger(rawPage)||rawPage<1||!Number.isInteger(rawLimit)||rawLimit<1){return NextResponse.json({code:"INVALID_QUERY",message:"筛选、分页或排序参数无效。"},{status:400});}
  const page=rawPage;const limit=Math.min(80,rawLimit);const counts=await getLikeCountMap();
  const filtered=recipes.filter(recipe=>recipe.editorialStatus==="reviewed").map(recipe=>{const v=counts.get(recipe.slug);return v?{...recipe,likes:v.totalLikes,weeklyLikes:v.weeklyLikes}:recipe}).filter(r=>{const haystack=`${r.title}${r.aliases.join("")}${r.ingredients.map(i=>i.name).join("")}${r.tags.join("")}`;return(!q||haystack.includes(q))&&(!category||r.category===category)&&tags.every(t=>r.tags.includes(t))&&(!maxTime||totalMinutes(r)<=maxTime)&&(!difficulty||r.difficulty<=difficulty)&&(spice<0||r.spiceLevel===spice)});
  const start=(page-1)*limit;return NextResponse.json({items:filtered.slice(start,start+limit),total:filtered.length,page,limit});
}
