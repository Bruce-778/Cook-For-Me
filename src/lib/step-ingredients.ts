import type { Recipe, RecipeStep } from "@/lib/recipes";

export function stepIngredientLabels(recipe: Recipe, step: RecipeStep, servings: number) {
  return step.ingredients.map(name => {
    const ingredient = recipe.ingredients.find(item => item.name === name);
    const portion = step.ingredientAmounts?.[name];
    // 回锅/装盘不是再次取用整道菜用量。缺少逐步分配时只显示名称。
    if (!ingredient || portion === undefined) return { name, amount: null };
    const amount = portion * servings / recipe.servings;
    const formatted = Number.isInteger(amount) ? String(amount) : amount.toFixed(1).replace(/\.0$/, "");
    return { name, amount: `${formatted}${ingredient.unit}` };
  });
}
