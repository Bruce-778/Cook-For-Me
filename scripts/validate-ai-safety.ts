import assert from "node:assert/strict";
import { COOK_ASSISTANT_SYSTEM_PROMPT } from "../src/lib/ai/prompt";
import { assessHealthRisk, emergencyAdvice, excludedAllergens, recipeConflicts, recipeMatchesConstraints } from "../src/lib/ai/safeguards";
import { aiChatRequestSchema } from "../src/lib/ai/types";
import { getRecipe } from "../src/lib/recipes";

assert.equal(assessHealthRisk("我严重胸痛而且喘不上气").emergency, true);
assert.equal(emergencyAdvice().recommendations.length, 0);
assert.equal(emergencyAdvice().urgency, "emergency");
assert.deepEqual(excludedAllergens("鸡蛋过敏，也不吃海鲜").sort(), ["甲壳类", "蛋", "鱼类"].sort());

const eggDish = getRecipe("tomato-scrambled-eggs");
assert.ok(eggDish, "番茄炒蛋应存在");
assert.equal(recipeConflicts(eggDish, "我对鸡蛋过敏"), true);

const fishDish = getRecipe("steamed-fish");
assert.ok(fishDish, "清蒸鲈鱼应存在");
assert.equal(recipeConflicts(fishDish, "我不吃海鲜"), true);
assert.equal(recipeMatchesConstraints(fishDish, "20分钟内做一道鱼"), false);
assert.equal(recipeConflicts(getRecipe("potato-beef")!, "我不吃牛肉"), true);
assert.equal(recipeConflicts(getRecipe("guo-bao-rou")!, "我不吃猪肉"), true);
assert.equal(recipeMatchesConstraints(getRecipe("shredded-potato")!, "我不吃辣"), false);

assert.equal(aiChatRequestSchema.safeParse({ message: "a", history: [] }).success, false);
assert.equal(aiChatRequestSchema.safeParse({ message: "今晚吃什么", history: [] }).success, true);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /不诊断、不治疗/);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /极端节食/);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /过敏原/);
assert.match(COOK_ASSISTANT_SYSTEM_PROMPT, /合法 JSON object/);
assert.equal(process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY, undefined, "DeepSeek 密钥不得暴露为 NEXT_PUBLIC 变量");

console.log("✓ AI 输入边界、紧急分流、过敏原过滤和提示词安全约束通过校验。");
