import { recipes, type Ingredient, type Recipe } from "@/lib/recipes";

export const DIETARY_OPTIONS = ["不吃辣","不吃香菜","海鲜过敏","不吃牛肉","不吃羊肉","不吃猪肉","蛋过敏","奶过敏","花生/坚果过敏","麸质限制"] as const;
export type DietaryOption = typeof DIETARY_OPTIONS[number];
export type BlindBoxInput = { servings: number; maxMinutes: 0 | 30 | 60; exclusions: DietaryOption[]; babyAge?: number; avoidSlugs?: string[]; replaceIndex?: number; currentSlugs?: string[] };
export type MenuResult = { recipes: Recipe[]; servings: number; estimatedMinutes: number; stapleSuggestion: string; reason: string; shoppingList: Array<Ingredient & { checked?: boolean }> };

function excluded(recipe: Recipe, exclusions: DietaryOption[]) {
  const text = `${recipe.title}${recipe.ingredients.map((item) => item.name).join("")}`;
  return exclusions.some((item) =>
    (item === "不吃辣" && recipe.spiceLevel > 0) ||
    (item === "不吃香菜" && text.includes("香菜")) ||
    (item === "海鲜过敏" && (recipe.category === "海鲜" || recipe.allergens.some((a) => ["鱼类","甲壳类","贝类"].includes(a)))) ||
    (item === "不吃牛肉" && text.includes("牛")) || (item === "不吃羊肉" && text.includes("羊")) || (item === "不吃猪肉" && text.includes("猪")) ||
    (item === "蛋过敏" && recipe.allergens.includes("蛋")) || (item === "奶过敏" && recipe.allergens.includes("奶")) ||
    (item === "花生/坚果过敏" && recipe.allergens.includes("花生")) || (item === "麸质限制" && recipe.allergens.includes("麸质"))
  );
}

function menuMinutes(items: Recipe[]) { return items.reduce((sum,item) => sum + item.prepMinutes + item.activeMinutes,0) + Math.max(0,...items.map((item) => item.waitMinutes)); }
function seeded(items: Recipe[], salt: number) { return [...items].sort((a,b) => ((a.slug.length*31+salt)%97)-((b.slug.length*31+salt)%97) || a.title.localeCompare(b.title,"zh-CN")); }

function mergeShoppingList(items: Recipe[], servings: number) {
  const merged = new Map<string, Ingredient>();
  for (const recipe of items) for (const ingredient of recipe.ingredients) {
    const amount = ingredient.amount * servings / recipe.servings;
    const key = `${ingredient.name}:${ingredient.unit}`;
    const current = merged.get(key);
    const priority={"主料":0,"辅料":1,"调料":2} as const;
    merged.set(key, current ? { ...current,group:priority[ingredient.group]<priority[current.group]?ingredient.group:current.group,amount:current.amount+amount } : { ...ingredient, amount });
  }
  return [...merged.values()].sort((a,b) => ["主料","辅料","调料"].indexOf(a.group)-["主料","辅料","调料"].indexOf(b.group));
}

export function generateMenu(input: BlindBoxInput): MenuResult {
  if (!Number.isInteger(input.servings) || input.servings < 1 || input.servings > 8) throw new Error("就餐人数需在 1–8 人之间。");
  const pool = recipes.filter((recipe) => recipe.editorialStatus === "reviewed" && !excluded(recipe,input.exclusions) && !(input.avoidSlugs ?? []).includes(recipe.slug) && (input.babyAge ? (recipe.babyAge && input.babyAge >= recipe.babyAge.min && input.babyAge <= recipe.babyAge.max) : !recipe.babyAge));
  if(input.babyAge){const candidate=seeded(pool.filter(recipe=>!input.maxMinutes||totalRecipeMinutes(recipe)<=input.maxMinutes),Date.now()%997)[0];if(!candidate)throw new Error("当前月龄、时间和过敏条件下没有合适辅食，请放宽时间或减少限制。");return{recipes:[candidate],servings:1,estimatedMinutes:totalRecipeMinutes(candidate),stapleSuggestion:"继续母乳或配方奶；辅食量按宝宝接受程度逐步增加",reason:`适合 ${candidate.babyAge?.min}–${candidate.babyAge?.max} 月龄的单份辅食`,shoppingList:mergeShoppingList([candidate],1)}}
  const count = input.servings <= 2 ? 2 : input.servings <= 4 ? 4 : 5;
  const salt = Date.now()%997;
  const proteins = seeded(pool.filter((r) => r.nutritionRoles.includes("蛋白质") || r.dietType === "半荤素"),salt);
  const vegetables = seeded(pool.filter((r) => r.nutritionRoles.includes("蔬菜") && r.dietType === "素"),salt+7);
  const soups = seeded(pool.filter((r) => r.nutritionRoles.includes("汤羹")),salt+13);
  const neededProtein = input.servings <= 2 ? 1 : input.servings <= 4 ? 2 : 2;
  const neededVegetable = input.servings <= 4 ? 1 : 2;
  let selected = [...proteins.slice(0,neededProtein),...vegetables.slice(0,neededVegetable),...(count>=4?soups.slice(0,1):[])];
  selected = selected.filter((r,i,list) => list.findIndex((v) => v.slug===r.slug)===i).slice(0,count);
  if (input.currentSlugs?.length && input.replaceIndex !== undefined) {
    const current = input.currentSlugs.map((slug) => recipes.find((recipe) => recipe.slug===slug)).filter((recipe): recipe is Recipe => Boolean(recipe));
    const old = current[input.replaceIndex];
    const candidates = pool.filter((recipe) => recipe.slug!==old?.slug && recipe.nutritionRoles.some((role) => old?.nutritionRoles.includes(role)) && !current.some((item) => item.slug===recipe.slug));
    if (candidates[0]) { current[input.replaceIndex] = candidates[0]; selected = current; }
  }
  if (selected.length < count) throw new Error("当前已完成逐道复核的菜谱还不足以组成安全、均衡的整桌菜单。我们不会用待复核内容凑数，请稍后再试或先从已复核菜谱中选择。");
  let estimatedMinutes = menuMinutes(selected);
  if (input.maxMinutes && estimatedMinutes > input.maxMinutes) {
    const quickPool = pool.filter((r) => r.prepMinutes+r.activeMinutes+r.waitMinutes<=input.maxMinutes).sort((a,b) => (a.prepMinutes+a.activeMinutes+a.waitMinutes)-(b.prepMinutes+b.activeMinutes+b.waitMinutes));
    for (let i=0;i<selected.length && estimatedMinutes>input.maxMinutes;i++) {
      const replacement = quickPool.find((r) => !selected.some((item) => item.slug===r.slug) && r.nutritionRoles.some((role) => selected[i].nutritionRoles.includes(role)));
      if (replacement) selected[i]=replacement;
      estimatedMinutes=menuMinutes(selected);
    }
  }
  if (input.maxMinutes && estimatedMinutes > input.maxMinutes) throw new Error(`严格按一个人操作估算需要约 ${estimatedMinutes} 分钟，请放宽时间或减少菜数。`);
  return { recipes:selected,servings:input.servings,estimatedMinutes,stapleSuggestion:input.servings<=2?"米饭或杂粮饭 100–150g/人":"米饭或杂粮饭 100g/人",reason:`${selected.filter(r=>r.nutritionRoles.includes("蛋白质")).length} 道蛋白质菜 + ${selected.filter(r=>r.nutritionRoles.includes("蔬菜")).length} 道蔬菜${selected.some(r=>r.nutritionRoles.includes("汤羹"))?" + 1 道汤":""}`,shoppingList:mergeShoppingList(selected,input.servings) };
}

function totalRecipeMinutes(recipe:Recipe){return recipe.prepMinutes+recipe.activeMinutes+recipe.waitMinutes;}
