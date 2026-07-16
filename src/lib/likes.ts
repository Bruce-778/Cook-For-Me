import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type LikeCounts = { totalLikes: number; weeklyLikes: number; lastLikedAt: string | null };

export async function getLikeCountMap() {
  const admin = getSupabaseAdmin();
  const bySlug = new Map<string, LikeCounts>();
  if (!admin) return bySlug;
  const [{data:counts,error:countError},{data:recipeRows,error:recipeError}]=await Promise.all([admin.rpc("recipe_like_counts"),admin.from("recipes").select("id,slug").eq("status","published")]);
  if(countError||recipeError){console.error("读取点赞汇总失败",countError?.message??recipeError?.message);return bySlug;}
  const byId=new Map((counts??[]).map(row=>[row.recipe_id,{totalLikes:Number(row.total_likes),weeklyLikes:Number(row.weekly_likes),lastLikedAt:row.last_liked_at}]));
  for (const recipe of recipeRows ?? []) bySlug.set(recipe.slug, byId.get(recipe.id) ?? { totalLikes: 0, weeklyLikes: 0, lastLikedAt: null });
  return bySlug;
}
