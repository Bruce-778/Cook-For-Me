import type { AiAdvice } from "@/lib/ai/types";
import type { Recipe } from "@/lib/recipes";
import { containsPork } from "@/lib/food-metadata";

const EMERGENCY_PATTERN = /呼吸困难|喘不上气|失去意识|昏迷|抽搐|严重胸痛|胸口剧痛|嘴唇发紫|大量出血|呕血|便血|黑便|严重过敏|喉咙肿|吞咽困难|自杀|不想活|轻生/;
const MEDICAL_PATTERN = /生病|发烧|高烧|腹泻|呕吐|胃痛|肚子痛|糖尿病|高血压|肾病|肝病|痛风|孕妇|怀孕|哺乳|术后|化疗|过敏|乳糖不耐|胆囊|胰腺|冠心病|进食障碍|厌食|暴食/;
const EXTREME_WEIGHT_PATTERN = /一周瘦|快速瘦|不吃饭|断食|一天只吃|催吐|减肥药|瘦十斤|极低热量/;

export function assessHealthRisk(message: string) {
  return {
    emergency: EMERGENCY_PATTERN.test(message),
    medical: MEDICAL_PATTERN.test(message),
    extremeWeight: EXTREME_WEIGHT_PATTERN.test(message),
  };
}

export function emergencyAdvice(): AiAdvice {
  return {
    intent: "身体不适",
    title: "先处理紧急情况，暂时不要靠食物解决",
    summary: "你描述的情况可能需要立即获得专业帮助。请马上联系当地急救电话或尽快前往急诊；如果身边有人，请让对方陪同并告知你的症状。",
    recommendations: [],
    tips: ["不要独自驾车前往医院", "不要因为等待回复而延误求助", "意识不清或吞咽困难时不要强行喂水喂食"],
    caution: "本站不能进行诊断或替代医生。若你在中国大陆，可拨打 120；其他地区请联系当地急救服务。",
    followUpQuestion: "等你处于安全状态后，再告诉我医生给出的饮食要求，我可以帮你从站内筛选合适菜谱。",
    urgency: "emergency",
  };
}

const ALLERGEN_TERMS: Array<[RegExp, string[]]> = [
  [/鸡蛋过敏|蛋类过敏|蛋白过敏|蛋清过敏|蛋黄过敏|(?:鸡蛋|蛋类)不耐受|(?:不吃|不要|不能吃|忌)(?:鸡)?蛋/, ["蛋"]],
  [/牛奶过敏|奶过敏|乳制品过敏|奶制品过敏|乳糖不耐|(?:牛奶|奶|乳制品|奶制品)不耐受|(?:不喝|不吃|不要|不能喝|不能吃|忌)(?:牛)?奶|(?:不吃|不要|不能吃|忌)(?:乳制品|奶制品)/, ["奶"]],
  [/花生过敏|坚果过敏|花生不耐受|坚果不耐受|(?:不吃|不要|不能吃|忌)(?:花生|坚果)/, ["花生", "坚果"]],
  [/海鲜过敏|海鲜禁忌|海鲜不耐受|(?:不吃|不要|不能吃|忌)海鲜/, ["甲壳类", "鱼类", "贝类"]],
  [/甲壳类过敏|虾过敏|蟹过敏|(?:不吃|不要|不能吃|忌)虾|(?:不吃|不要|不能吃|忌)蟹/, ["甲壳类"]],
  [/贝类过敏|蚝过敏|蛤蜊过敏|鱿鱼过敏|(?:不吃|不要|不能吃|忌)(?:贝类|蚝|蛤蜊|鱿鱼)/, ["贝类"]],
  [/芝麻过敏|(?:不吃|不要|不能吃|忌)芝麻/, ["芝麻"]],
  [/鱼过敏|鱼类不耐受|(?:不吃|不要|不能吃|忌)鱼/, ["鱼类"]],
  [/大豆过敏|豆制品过敏|(?:不吃|不要|不能吃|忌)豆/, ["大豆"]],
  [/麸质过敏|小麦过敏|麸质不耐受|小麦不耐受|乳糜泻|无麸质|(?:不吃|不要|不能吃|忌)(?:麸质|小麦)/, ["麸质"]],
];

export function excludedAllergens(message: string) {
  return [...new Set(ALLERGEN_TERMS.flatMap(([pattern, allergens]) => pattern.test(message) ? allergens : []))];
}

export function recipeConflicts(recipe: Recipe, message: string) {
  const excluded = excludedAllergens(message);
  if (excluded.some((allergen) => recipe.allergens.includes(allergen))) return true;
  if (/(?:不吃|不能吃|忌)猪肉|猪肉过敏/.test(message) && containsPork(recipe.ingredients)) return true;
  const ingredients = recipe.ingredients.map((item) => item.name).join("、");
  return [
    [/(?:不吃|不能吃|忌)牛肉|牛肉过敏/, /牛肉|牛腩|牛里脊|牛肉末/],
    [/(?:不吃|不能吃|忌)猪肉|猪肉过敏/, /猪肉|猪里脊|猪肋排|五花肉|排骨|二刀肉/],
    [/(?:不吃|不能吃|忌)羊肉|羊肉过敏/, /羊肉|羊腿肉/],
    [/(?:不吃|不能吃|忌)鸡肉|鸡肉过敏/, /鸡肉|鸡腿|鸡翅|鸡胸|鸡胗/],
    [/(?:不吃|不能吃|忌)鸭肉|鸭肉过敏/, /鸭肉|鸭腿|鸭胸|鸭翅/],
    [/(?:不吃|不能吃|忌)香菜|香菜过敏/, /香菜/],
  ].some(([request, ingredient]) => request.test(message) && ingredient.test(ingredients));
}

export function recipeMatchesConstraints(recipe: Recipe, message: string) {
  if (recipeConflicts(recipe, message)) return false;
  if (/(?:纯素|严格素食|纯植物|纯植物性|vegan)/i.test(message) && recipe.dietType !== "素") return false;
  if (/(?:素食|吃素|不吃肉|不吃荤|vegetarian)/i.test(message) && !["素", "半荤素"].includes(recipe.dietType)) return false;
  if (/(?:清真|穆斯林)/.test(message) && containsPork(recipe.ingredients)) return false;
  const minutes = Number(message.match(/(\d{1,3})\s*分钟/)?.[1] || 0);
  if (minutes && recipe.prepMinutes + recipe.activeMinutes + recipe.waitMinutes > minutes) return false;
  if (/不辣|不吃辣|不要辣|不能吃辣|忌辣/.test(message) && recipe.spiceLevel > 0) return false;
  return true;
}
