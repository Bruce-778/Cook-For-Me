import { recipes } from "../src/lib/recipes";

const directVideoPattern = /^https:\/\/(?:www\.)?bilibili\.com\/video\/BV[0-9A-Za-z]+\/?(?:[?#].*)?$/;
const searchPattern = /^https:\/\/search\.bilibili\.com\/all\?keyword=.+/;
const errors: string[] = [];
let directCount = 0;

for (const recipe of recipes) {
  if (!searchPattern.test(recipe.bilibiliSearchUrl)) {
    errors.push(`${recipe.title}: B 站搜索兜底格式无效`);
  }

  if (!recipe.bilibiliVideoUrl) continue;
  directCount += 1;
  if (!directVideoPattern.test(recipe.bilibiliVideoUrl)) {
    errors.push(`${recipe.title}: 精选视频必须是 bilibili.com/video/BV... 具体直链`);
  }
  if (!recipe.videoTitle || !recipe.videoCreator || !/^\d{4}-\d{2}-\d{2}$/.test(recipe.videoVerifiedAt ?? "")) {
    errors.push(`${recipe.title}: 精选视频缺少标题、UP 主或 YYYY-MM-DD 核验日期`);
  }
}

if (process.env.REQUIRE_DIRECT_BILIBILI === "1" && directCount !== recipes.length) {
  errors.push(`要求全部菜谱有直链，但当前只有 ${directCount}/${recipes.length} 道已录入`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`✓ ${recipes.length} 道菜均有 B 站搜索兜底；${directCount} 道已录入结构有效的精选视频直链。`);
console.log("提示：结构校验不能证明视频内容正确；上线前仍需人工播放并核对菜名、主料和关键步骤。");
