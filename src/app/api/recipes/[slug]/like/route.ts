import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser, getSupabaseAdmin } from "@/lib/supabase/admin";

async function counts(admin: NonNullable<ReturnType<typeof getSupabaseAdmin>>, recipeId: string) {
  const { count: totalLikes } = await admin.from("recipe_likes").select("*", { count: "exact", head: true }).eq("recipe_id", recipeId);
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: weeklyLikes } = await admin.from("recipe_likes").select("*", { count: "exact", head: true }).eq("recipe_id", recipeId).gte("created_at", since);
  return { totalLikes: totalLikes ?? 0, weeklyLikes: weeklyLikes ?? 0 };
}

async function context(request: NextRequest, slug: string) {
  const admin = getSupabaseAdmin();
  if (!admin) return { error: NextResponse.json({ code: "LIKES_NOT_CONFIGURED", message: "点赞服务尚未连接。" }, { status: 503 }) };
  const user = await getAuthenticatedUser(request.headers.get("authorization"));
  if (!user) return { error: NextResponse.json({ code: "AUTH_REQUIRED", message: "正在建立匿名身份，请稍后重试。" }, { status: 401 }) };
  const { data: recipe } = await admin.from("recipes").select("id").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!recipe) return { error: NextResponse.json({ code: "RECIPE_NOT_FOUND", message: "没有找到这道菜。" }, { status: 404 }) };
  return { admin, user, recipe };
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const value = await context(request, slug);
  if ("error" in value) return value.error;
  const { error } = await value.admin.from("recipe_likes").upsert(
    { recipe_id: value.recipe.id, user_id: value.user.id },
    { onConflict: "recipe_id,user_id", ignoreDuplicates: true },
  );
  if (error) return NextResponse.json({ code: "LIKE_FAILED", message: "点赞没有保存，请稍后重试。" }, { status: 500 });
  return NextResponse.json({ liked: true, ...(await counts(value.admin, value.recipe.id)) });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const value = await context(request, slug);
  if ("error" in value) return value.error;
  const { data } = await value.admin.from("recipe_likes").select("recipe_id").eq("recipe_id", value.recipe.id).eq("user_id", value.user.id).maybeSingle();
  return NextResponse.json({ liked: Boolean(data), ...(await counts(value.admin, value.recipe.id)) });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const value = await context(request, slug);
  if ("error" in value) return value.error;
  const { error } = await value.admin.from("recipe_likes").delete().eq("recipe_id", value.recipe.id).eq("user_id", value.user.id);
  if (error) return NextResponse.json({ code: "UNLIKE_FAILED", message: "取消点赞失败，请稍后重试。" }, { status: 500 });
  return NextResponse.json({ liked: false, ...(await counts(value.admin, value.recipe.id)) });
}
