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
  if (!recipe.videoTitle || !recipe.videoCreator || !/^\d{4}-\d{2}-\d{2}$/.test(recipe.videoVerifiedAt ?? recipe.videoMetadataCheckedAt ?? "")) {
    errors.push(`${recipe.title}: 视频缺少标题、UP 主或明确区分类型的 YYYY-MM-DD 记录日期`);
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

async function checkOnline() {
  let checked = 0;
  for (const recipe of recipes.filter(recipe => recipe.bilibiliVideoUrl)) {
    const bvid = recipe.bilibiliVideoUrl!.match(/\/(BV[0-9A-Za-z]+)/)![1];
    try {
      const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`, { signal: AbortSignal.timeout(15000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json() as { code: number; message?: string; data?: { bvid: string; state: number; title: string; owner: { name: string } } };
      if (payload.code !== 0 || payload.data?.bvid !== bvid || payload.data.state !== 0) throw new Error(`视频不可用或身份不符：${payload.code} / ${payload.message ?? ""}`);
      const video = payload.data;
      if (video.title !== recipe.videoTitle || video.owner.name !== recipe.videoCreator) throw new Error(`元数据变化：${video.title} / ${video.owner.name}`);
      console.log(`✓ ${recipe.title}: ${bvid} 标题与作者匹配`);
      checked += 1;
    } catch (error) {
      errors.push(`${recipe.title}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.log(`在线元数据检查 ${checked}/${directCount} 通过；检查时间 ${new Date().toISOString()}。未进行完整播放，不修改人工核验日期。`);
  if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
}

if (process.env.CHECK_BILIBILI_ONLINE === "1") void checkOnline();
