import assert from "node:assert/strict";
import { recipes, type Recipe } from "../src/lib/recipes";
import { excluded, type MenuResult } from "../src/lib/blindbox";

const origin = process.env.LOCAL_BASE_URL ?? "http://localhost:3001";
assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname), "此冒烟测试仅允许本地地址");

async function request(path: string, expected = 200, body?: unknown) {
  const response = await fetch(new URL(path, origin), {
    signal: AbortSignal.timeout(20000),
    ...(body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  assert.equal(response.status, expected, `${path} HTTP 状态`);
  return response;
}

async function main() {
  for (const path of ["/", "/discover", "/favorites", "/ranking", "/blindbox", "/assistant"]) await request(path);
  const first = await (await request("/api/recipes?limit=80")).json();
  const second = await (await request("/api/recipes?limit=80&page=2")).json();
  assert.equal(first.total, recipes.length);
  assert.equal(new Set([...first.items, ...second.items].map((r: Recipe) => r.slug)).size, recipes.length);
  // 分批检查，避免给本机同时发出数百请求。
  for (let i = 0; i < recipes.length; i += 4) {
    await Promise.all(recipes.slice(i, i + 4).map(async recipe => {
      const detail = await (await request(`/api/recipes/${recipe.slug}`)).json() as Recipe;
      assert.equal(detail.title, recipe.title);
      assert.deepEqual(detail.ingredients, JSON.parse(JSON.stringify(recipe.ingredients)), `${recipe.slug} 服务与源码版本一致`);
      assert.deepEqual(detail.steps, JSON.parse(JSON.stringify(recipe.steps)));
      const html = await (await request(`/recipes/${recipe.slug}`)).text();
      assert.ok(html.includes(recipe.title), `${recipe.slug} 标题必须渲染`);
      if (recipe.bilibiliVideoUrl) assert.ok(html.includes(recipe.bilibiliVideoUrl), `${recipe.slug} 视频链接必须渲染`);
      await request(`/cook/${recipe.slug}`);
    }));
  }
  await request("/api/recipes?limit=-1", 400);
  await request("/api/recipes/not-a-real-recipe", 404);
  const result = await (await request("/api/blindbox", 200, { servings: 2, maxMinutes: 0, exclusions: ["海鲜过敏", "不吃猪肉"] })).json() as MenuResult;
  assert.equal(result.recipes.length, 2);
  assert.ok(result.recipes.every(recipe => !excluded(recipe, ["海鲜过敏", "不吃猪肉"])));
  assert.ok(result.shoppingList.length > 0);
  await request("/api/blindbox", 400, { servings: 2, maxMinutes: 0, exclusions: ["不吃猪肉"], currentSlugs: ["twice-cooked-pork", "celery-lily"], replaceIndex: 1 });
  await request("/api/blindbox", 413, { servings: 2, maxMinutes: 0, exclusions: [], currentSlugs: ["x".repeat(17_000)] });
  console.log(`✓ 6 个主页面、${recipes.length} 个详情页、${recipes.length} 个烹饪页、${recipes.length} 个详情 API、完整分页、忌口菜单及错误边界通过本地 HTTP 冒烟测试。`);
  console.log("未调用付费 AI、未写入点赞数据库；HTTP 检查不替代浏览器交互或实做复核。");
}

void main().catch(error => { console.error(error); process.exitCode = 1; });
