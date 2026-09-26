import type { Ingredient, Recipe } from "@/lib/recipes";

// 按当前配方及普通市售调料保守标记；具体品牌仍须核对包装配料表。
export function inferAllergens(ingredients: Ingredient[]): string[] {
  const names = ingredients.map(({ name }) => name).join("、");
  const rules: Array<[string, RegExp]> = [
    ["蛋", /鸡蛋|蛋清|蛋黄|皮蛋|咸蛋|鸭蛋/],
    ["奶", /牛奶|奶粉|黄油|奶油|奶酪|酸奶|乳清/],
    ["麸质", /面粉|面条|鲜面|细面|宽面|饺子皮|馄饨皮|面皮|啤酒|燕麦|生抽|老抽|酱油|豉油|甜面酱|黄豆酱|豆瓣酱|蚝油/],
    ["大豆", /豆腐|豆浆|黄豆|大豆|豆豉|生抽|老抽|酱油|豉油|甜面酱/],
    ["花生", /花生/],
    ["坚果", /核桃|腰果|杏仁|扁桃仁|榛子|开心果|碧根果|松子/],
    ["芝麻", /芝麻|香油|麻油/],
    ["甲壳类", /虾|蟹/],
    ["贝类", /蛤蜊|扇贝|生蚝|牡蛎|蚝油|鱿鱼|章鱼|墨鱼|乌贼|贻贝|蛏子|鲍鱼/],
  ];
  const result = rules.filter(([, pattern]) => pattern.test(names)).map(([name]) => name);
  const fishNames = names.replaceAll(/蒸鱼豉油|鱿鱼|墨鱼/g, "");
  if (/鱼|鲈|鲫|鳕|鲑/.test(fishNames)) result.push("鱼类");
  return result;
}

export function containsPork(ingredients: Ingredient[]) {
  return ingredients.some(({ name }) => /猪|五花肉|排骨|肋排|里脊|二刀肉/.test(name) && !/牛|羊/.test(name));
}

export function inferDietType(ingredients: Ingredient[]): Recipe["dietType"] {
  const animal = ingredients.filter(({ name }) => /猪|牛肉|牛腩|羊肉|鸡|鸭|鹅|五花肉|瘦肉|里脊|排骨|肋排|二刀肉|虾|蟹|蛤蜊|扇贝|生蚝|蚝油|鲫|鲈|鳕|三文鱼|鱿鱼|带鱼|草鱼|蛋|牛奶|奶油|黄油/.test(name));
  if (!animal.length) return "素";
  const substantialPlants = ingredients.some(({ name, amount, unit }) =>
    /番茄|青椒|彩椒|土豆|胡萝卜|木耳|西芹|芹菜|蒜薹|蒜苗|香菇|白菜|丝瓜|豆腐|四季豆|茄子|西兰花|杏鲍菇|米饭|大米|小米|面条|鲜面|细面|宽面|面粉|韭菜|燕麦|香蕉/.test(name) && unit === "g" && amount >= 50);
  return substantialPlants || animal.every(({ name }) => /蛋|牛奶|蚝油/.test(name)) ? "半荤素" : "荤";
}
