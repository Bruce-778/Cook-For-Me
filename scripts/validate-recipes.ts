import { recipes } from "../src/lib/recipes";
import { easeStarsForDifficulty } from "../src/lib/difficulty";

const errors: string[]=[];const forbidden=["适量","少许","酌情","若干"];
const assert=(condition:unknown,message:string)=>{if(!condition)errors.push(message)};
assert(recipes.length===98,`应有 98 道菜，实际 ${recipes.length}`);
assert(new Set(recipes.map(r=>r.slug)).size===recipes.length,"slug 必须唯一");
assert([1,2,3,4,5].map(easeStarsForDifficulty).join(",")==="5,4,3,2,0","易做星级映射必须为难度 1→5、2→4、3→3、4→2、5→0");
for(const recipe of recipes){
 assert(new Set(recipe.ingredients.map(i=>i.name)).size===recipe.ingredients.length,`${recipe.title}: 食材名称重复`);
 assert((recipe.prepMinutes+recipe.activeMinutes+recipe.waitMinutes)*60>=recipe.steps.reduce((sum,step)=>sum+step.timerSeconds,0),`${recipe.title}: 总时长少于顺序步骤计时总和`);
 assert(recipe.steps.every(step=>Object.entries(step.ingredientAmounts??{}).every(([name,amount])=>step.ingredients.includes(name)&&Number.isFinite(amount)&&amount>=0)),`${recipe.title}: 本步定量引用了无效食材或数量`);
 const text=JSON.stringify(recipe);assert(recipe.steps.length>=5&&recipe.steps.length<=10,`${recipe.title}: 步骤数不是 5–10`);assert(recipe.sources.length>=2,`${recipe.title}: 来源少于 2`);assert(recipe.tips.length>=2,`${recipe.title}: 小贴士少于 2`);assert(recipe.failurePoints.length>=1,`${recipe.title}: 缺少翻车点`);assert(Boolean(recipe.safetyNote),`${recipe.title}: 缺少安全提醒`);assert(recipe.ingredients.every(i=>i.amount>0),`${recipe.title}: 食材数量无效`);assert(!forbidden.some(word=>text.includes(word)),`${recipe.title}: 包含模糊词`);assert(recipe.featureTags.length===3&&new Set(recipe.featureTags).size===3,`${recipe.title}: 必须有 3 个不重复的特点标签`);assert(recipe.featureTags.every(tag=>tag.length>=4&&tag.length<=8),`${recipe.title}: 特点标签应保持在 4–8 个字`);assert(recipe.steps.every(step=>step.timerSeconds>0&&step.heat&&step.waterTemperature&&step.oilTemperature&&step.cue),`${recipe.title}: 步骤结构字段不完整`);assert(recipe.steps.every(step=>step.ingredients.every(name=>recipe.ingredients.some(i=>i.name===name))),`${recipe.title}: 步骤引用了清单外食材`);assert(recipe.ingredients.every(ingredient=>recipe.steps.some(step=>step.ingredients.includes(ingredient.name))),`${recipe.title}: 食材表中存在没有进入任何步骤的食材`);assert(recipe.bilibiliSearchUrl.startsWith("https://search.bilibili.com/"),`${recipe.title}: B站搜索链接无效`);if(recipe.bilibiliVideoUrl){assert(/^https:\/\/www\.bilibili\.com\/video\/BV[0-9A-Za-z]+\/?$/.test(recipe.bilibiliVideoUrl),`${recipe.title}: B站视频直链格式无效`);assert(Boolean(recipe.videoTitle&&recipe.videoCreator&&(recipe.videoVerifiedAt||recipe.videoMetadataCheckedAt)),`${recipe.title}: B站视频核验信息不完整`);}
 if(recipe.babyAge){assert(recipe.tags.includes("宝宝辅食"),`${recipe.title}: 宝宝标签缺失`);assert(recipe.babyAge.min>=6&&recipe.babyAge.max<=24,`${recipe.title}: 月龄无效`);if(recipe.babyAge.max<12)assert(!/食盐|白糖|蜂蜜/.test(recipe.ingredients.map(i=>i.name).join("")),`${recipe.title}: 12月龄以下含盐糖蜂蜜`);}
 if(recipe.cookingMethod==="水煮"){assert(recipe.steps.some(step=>step.waterTemperature==="沸水"),`${recipe.title}: 水煮菜缺少沸水步骤`);assert(!recipe.steps.some(step=>step.text.includes("倒入食用油")),`${recipe.title}: 水煮菜错误使用炒油流程`);}
 if(recipe.cookingMethod==="炖汤"&&recipe.waitMinutes===0)assert(!recipe.steps.some(step=>step.timerSeconds>=1200),`${recipe.title}: 快手汤错误使用长炖流程`);
 if(recipe.editorialStatus==="reviewed"){
  assert(Boolean(recipe.reviewedAt),`${recipe.title}: 已复核但缺少复核日期`);
  assert(recipe.sources.length>=2&&recipe.sources.every(source=>!source.url.startsWith("https://search.bilibili.com/")),`${recipe.title}: 已复核内容仍使用搜索页充当来源`);
  assert(recipe.steps.every(step=>step.ingredients.every(name=>step.ingredientAmounts?.[name]!==undefined)),`${recipe.title}: 已复核步骤仍有未量化的本步用料`);
  for(const ingredient of recipe.ingredients){
   const allocated=recipe.steps.reduce((sum,step)=>sum+(step.ingredientAmounts?.[ingredient.name]??0),0);
   assert(Math.abs(allocated-ingredient.amount)<0.001,`${recipe.title}: ${ingredient.name} 分步合计 ${allocated}${ingredient.unit}，与总量 ${ingredient.amount}${ingredient.unit} 不一致`);
  }
 }
}
assert(recipes.every(recipe=>!recipe.image&&recipe.imageVerified===false),"菜谱当前采用无图模式，不应保留菜品图片路径");
for(const [tag,min] of [["宝宝辅食",8],["老人友好",12],["清淡恢复",12],["减脂餐",15],["新手推荐",20]] as const)assert(recipes.filter(r=>r.tags.includes(tag)).length>=min,`${tag} 少于 ${min} 道`);
if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`✓ ${recipes.length} 道菜通过结构校验；正式复核 ${recipes.filter(r=>r.editorialStatus==="reviewed").length}，待复核 ${recipes.filter(r=>r.editorialStatus==="draft").length}；宝宝 ${recipes.filter(r=>r.tags.includes("宝宝辅食")).length}，老人 ${recipes.filter(r=>r.tags.includes("老人友好")).length}，清淡恢复 ${recipes.filter(r=>r.tags.includes("清淡恢复")).length}，减脂 ${recipes.filter(r=>r.tags.includes("减脂餐")).length}，新手 ${recipes.filter(r=>r.tags.includes("新手推荐")).length}`);
