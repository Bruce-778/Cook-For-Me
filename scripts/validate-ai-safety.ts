import assert from "node:assert/strict";
import { COOK_ASSISTANT_SYSTEM_PROMPT } from "../src/lib/ai/prompt";
import { assessHealthRisk, emergencyAdvice, excludedAllergens, recipeConflicts, recipeMatchesConstraints } from "../src/lib/ai/safeguards";
import { aiChatRequestSchema } from "../src/lib/ai/types";
import { getRecipe } from "../src/lib/recipes";

assert.equal(assessHealthRisk("我严重胸痛而且喘不上气").emergency, true);
assert.equal(emergencyAdvice().recommendations.length, 0);
assert.equal(emergencyAdvice().urgency, "emergency");
assert.deepEqual(excludedAllergens("鸡蛋过敏，也不吃海鲜").sort(), ["甲壳类", "贝类", "蛋", "鱼类"].sort());
assert.deepEqual(excludedAllergens("不要奶制品，也不能吃虾").sort(), ["奶", "甲壳类"].sort());

const eggDish = getRecipe("tomato-scrambled-eggs");
assert.ok(eggDish, "番茄炒蛋应存在");
assert.equal(recipeConflicts(eggDish, "我对鸡蛋过敏"), true);
assert.equal(recipeConflicts(eggDish, "我不吃鸡蛋"), true);
assert.equal(recipeMatchesConstraints(eggDish, "我是纯素食者"), false);
assert.equal(recipeMatchesConstraints(getRecipe("garlic-broccoli")!, "我是素食者"), true);

const fishDish = getRecipe("steamed-fish");
assert.ok(fishDish, "清蒸鲈鱼应存在");
assert.equal(recipeConflicts(fishDish, "我不吃海鲜"), true);
assert.equal(recipeMatchesConstraints(fishDish, "20分钟内做一道鱼"), false);
assert.equal(recipeConflicts(getRecipe("potato-beef")!, "我不吃牛肉"), true);
assert.equal(recipeConflicts(getRecipe("guo-bao-rou")!, "我不吃猪肉"), true);
assert.equal(recipeConflicts(getRecipe("steamed-chicken-mushroom")!, "我不能吃鸡肉"), true);
assert.equal(recipeMatchesConstraints(getRecipe("braised-pork")!, "我是穆斯林，按清真饮食"), false);
assert.equal(recipeConflicts(getRecipe("double-skin-milk")!, "我牛奶过敏"), true);
assert.equal(recipeConflicts(getRecipe("double-skin-milk")!, "我不吃牛肉"), false);
assert.equal(recipeConflicts(getRecipe("garlic-broccoli")!, "我海鲜过敏"), true, "蚝油也属于海鲜来源");
assert.equal(recipeConflicts(getRecipe("celery-squid")!, "我不吃海鲜"), true);
assert.equal(recipeConflicts(getRecipe("yangchun-noodles")!, "我不吃猪肉"), true, "猪油同样排除");
assert.equal(recipeConflicts(getRecipe("scallion-oil-noodles")!, "我大豆过敏"), true, "普通酱油含大豆");
assert.equal(recipeConflicts(getRecipe("sesame-cold-noodles")!, "我芝麻过敏"), true);
assert.equal(recipeMatchesConstraints(getRecipe("shredded-potato")!, "我不吃辣"), false);

assert.equal(aiChatRequestSchema.safeParse({ message: "a", history: [] }).success, false);
assert.equal(aiChatRequestSchema.safeParse({ message: "今晚吃什么", history: [] }).success, true);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /不诊断、不治疗/);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /极端节食/);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /过敏原/);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /合法 JSON object/);
assert.equal(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY, undefined, "DeepSeek 密钥不得暴露为 NEXT_PUBLIC 变量");

console.log("✓ AI 输入边界、紧急分流、过敏原过滤和提示词安全约束通过校验。");
