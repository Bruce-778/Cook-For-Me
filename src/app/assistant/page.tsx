import type { Metadata } from "next";
import Image from "next/image";
import { AiFoodAssistant } from "@/components/ai-food-assistant";
import { recipes, totalMinutes } from "@/lib/recipes";

export const metadata: Metadata = { title: "问小厨 AI 饮食助手", description: "根据食材、时间、忌口和饮食目标，从 Cook for Me 的真实菜谱中挑选适合的一餐。" };

export default function AssistantPage() {
  const recipeIndex = recipes.map((recipe) => ({ slug: recipe.slug, title: recipe.title, totalMinutes: totalMinutes(recipe), difficulty: recipe.difficulty, featureTags: recipe.featureTags }));
  return <>
    <section className="page-shell pb-7 pt-6 md:pb-10 md:pt-10"><div className="relative overflow-hidden rounded-[30px] bg-[#3a251e] px-5 py-8 text-white md:px-10 md:py-11"><div className="relative z-10 max-w-2xl"><p className="text-xs font-black tracking-[.18em] text-[#f3c75b]">COOK FOR ME · AI</p><h1 className="mt-3 text-4xl font-black tracking-[-.055em] sm:text-5xl md:text-6xl">别纠结，<br className="sm:hidden" />把条件告诉小厨。</h1><p className="mt-4 max-w-xl text-sm leading-7 text-white/70 md:text-base">家里有什么、今天多累、想减脂还是身体不舒服——小厨会从站内真实菜谱里，帮你缩小到今晚能做的几道。</p></div><div className="absolute -right-12 -top-20 hidden size-96 rotate-6 overflow-hidden rounded-[42%_58%_45%_55%] border-[10px] border-white/10 opacity-45 md:block"><Image src="/images/hero/steak-grilled.jpg" alt="温暖厨房里的牛排料理" fill sizes="380px" className="object-cover" priority /></div><div className="absolute -bottom-24 right-[28%] size-48 rounded-full bg-primary/25 blur-3xl" /></div></section>
    <section className="page-shell pb-16"><AiFoodAssistant recipeIndex={recipeIndex} /><p className="mt-5 text-center text-[11px] leading-5 text-muted-foreground">AI 可能出错，重要的过敏、疾病、孕期和用药问题请咨询医生或注册营养师。由 DeepSeek 提供模型能力，菜谱范围与安全规则由 Cook for Me 约束。</p></section>
  </>;
}
