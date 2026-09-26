import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChefHat, CircleAlert, Clock3, Droplets, Flame, Lightbulb, PlayCircle, ShieldCheck, Sparkles, ThermometerSun, Utensils } from "lucide-react";
import { RecipeDetailClient } from "@/components/recipe-detail-client";
import { RecipeCard } from "@/components/recipe-card";
import { getRecipe, recipes, totalMinutes } from "@/lib/recipes";
import { getLikeCountMap } from "@/lib/likes";
import { DifficultyStars } from "@/components/difficulty-stars";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) return { title: "菜谱没有找到" };
  return {
    title: `${recipe.title}做法`,
    description: `${recipe.summary} ${recipe.servings}人份，准备${recipe.prepMinutes}分钟，烹饪${recipe.cookMinutes}分钟。`,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: { title: `${recipe.title}做法｜Cook for Me`, description: recipe.summary, type: "article" },
    robots: recipe.editorialStatus==="reviewed"?undefined:{index:false,follow:true},
  };
}

export default async function RecipePage({ params }: PageProps) {
  const { slug } = await params;
  const baseRecipe = getRecipe(slug);
  if (!baseRecipe) notFound();
  const counts=await getLikeCountMap();const count=counts.get(slug);const recipe=count?{...baseRecipe,likes:count.totalLikes,weeklyLikes:count.weeklyLikes}:baseRecipe;

  const similar = recipes
    .filter((item) => item.slug !== recipe.slug)
    .sort((a, b) => {
      const scoreA = Number(a.category === recipe.category) * 3 + a.tags.filter((tag) => recipe.tags.includes(tag)).length;
      const scoreB = Number(b.category === recipe.category) * 3 + b.tags.filter((tag) => recipe.tags.includes(tag)).length;
      return scoreB - scoreA || b.weeklyLikes - a.weeklyLikes;
    })
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.summary,
    recipeYield: `${recipe.servings}人份`,
    prepTime: `PT${recipe.prepMinutes}M`,
    cookTime: `PT${recipe.cookMinutes}M`,
    totalTime: `PT${totalMinutes(recipe)}M`,
    recipeIngredient: recipe.ingredients.map((item) => `${item.amount}${item.unit} ${item.name}`),
    recipeInstructions: recipe.steps.map((step) => ({ "@type": "HowToStep", name: step.title, text: step.text })),
  };

  return (
    <div className="pb-32 md:pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="overflow-hidden border-b bg-[radial-gradient(circle_at_85%_12%,#ffe1c9_0,transparent_30%),linear-gradient(180deg,#fff8ed_0%,#fffdf8_100%)]">
        <div className="page-shell py-5 md:py-10">
          <Link href="/discover" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary"><ArrowLeft className="size-4" />返回发现菜谱</Link>
          <div className="max-w-4xl py-3 sm:py-6 lg:py-8">
            <div>
              <div className="mb-4 flex flex-wrap gap-2">{recipe.featureTags.map((tag) => <span key={tag} className="rounded-full bg-[#fff2e8] px-3 py-1.5 text-xs font-bold text-[#a74e2b]">{tag}</span>)}{recipe.tags.filter((tag) => tag !== recipe.category && !recipe.featureTags.includes(tag)).map((tag) => <span key={tag} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">{tag}</span>)}</div>
              <h1 className="text-balance text-4xl font-black tracking-[-.055em] sm:text-5xl lg:text-6xl">{recipe.title}</h1>
              <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">{recipe.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-bold">
                <span className="flex items-center gap-2"><Clock3 className="size-5 text-primary" />共 {totalMinutes(recipe)} 分钟</span>
                <span className="flex items-center gap-2"><Flame className="size-5 text-primary" /><DifficultyStars difficulty={recipe.difficulty} showLabel /></span>
                <span className="flex items-center gap-2"><Sparkles className="size-5 text-primary" />{recipe.weeklyLikes?`本周 ${recipe.weeklyLikes} 人点赞`:"本周还没有点赞"}</span>
              </div>
              <div className="mt-7"><RecipeDetailClient recipe={recipe} variant="actions" /></div>
          </div>
        </div>
        </div>
      </section>

      <div className="page-shell mt-10">
        <RecipeDetailClient recipe={recipe} />
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="min-w-0 space-y-14">

          <section>
            <p className="mb-1 text-sm font-bold text-primary">BEFORE COOKING</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">开火前，先准备好</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border bg-card p-5"><Utensils className="mb-3 size-7 text-primary" /><h3 className="font-black">厨具</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">炒锅、锅铲、砧板、厨刀和量勺</p></div>
              <div className="rounded-[22px] border bg-card p-5"><ChefHat className="mb-3 size-7 text-[#5e8557]" /><h3 className="font-black">食材摆放</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">按步骤称量切配，调料提前放在手边</p></div>
              <div className="rounded-[22px] border bg-card p-5"><ShieldCheck className="mb-3 size-7 text-[#b67d08]" /><h3 className="font-black">安全提醒</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">生熟分开处理，接触生肉后及时洗手和刀具</p></div>
            </div>
          </section>

          <section id="steps" className="scroll-mt-28">
            <p className="mb-1 text-sm font-bold text-primary">STEP BY STEP</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">一步一步，慢慢做好</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">以下文字用量按原配方 {recipe.servings} 人份。改变人数后，食材清单会换算；分次用量须按相同比例分配，火候与时间以实际成熟状态为准。</p>
            <div className="relative mt-7 space-y-5 before:absolute before:bottom-10 before:left-6 before:top-10 before:w-px before:bg-border sm:before:left-7">
              {recipe.steps.map((step, index) => (
                <article key={step.title} className="relative rounded-[24px] border bg-card p-5 pl-[4.5rem] card-shadow sm:p-7 sm:pl-[5.5rem]">
                  <span className="absolute left-4 top-5 z-10 grid size-11 place-items-center rounded-2xl bg-primary text-lg font-black text-white shadow-[0_8px_20px_rgba(240,100,58,.22)] sm:left-5 sm:top-7 sm:size-12">{index + 1}</span>
                  <h3 className="text-xl font-black sm:text-2xl">{step.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {step.heat !== "不适用" && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffe2d1] px-3 py-1.5 text-xs font-black text-[#9d3b20]"><Flame className="size-3.5" />{step.heat}</span>}
                    {step.waterTemperature !== "不适用" && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#dff2f8] px-3 py-1.5 text-xs font-black text-[#356777]"><Droplets className="size-3.5" />{step.waterTemperature}</span>}
                    {step.time && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff1c7] px-3 py-1.5 text-xs font-black text-[#845e0b]"><Clock3 className="size-3.5" />{step.time}</span>}
                    {step.oilTemperature !== "不适用" && <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e9f3e4] px-3 py-1.5 text-xs font-black text-[#456341]"><ThermometerSun className="size-3.5" />{step.oilAmountMl?`${step.oilAmountMl}ml · `:""}{step.oilTemperature}</span>}
                  </div>
                  <p className="mt-4 text-[17px] leading-8 text-[#4d3931]">{step.text}</p>
                  {step.ingredients && <p className="mt-3 text-sm text-muted-foreground"><strong className="text-foreground">本步用到：</strong>{step.ingredients.map(name=>{const ingredient=recipe.ingredients.find(item=>item.name===name);const amount=step.ingredientAmounts?.[name];return amount!==undefined&&ingredient?`${name} ${amount}${ingredient.unit}`:name}).join("、")}</p>}
                  <div className="mt-5 flex gap-3 rounded-2xl bg-[#edf5e8] p-4 text-sm leading-6 text-[#456341]"><CheckCircle2 className="mt-0.5 size-5 shrink-0" /><p><strong>看到这样就对了：</strong>{step.cue}</p></div>
                  {step.safety&&<div className="mt-3 flex gap-3 rounded-2xl bg-[#fff2ee] p-4 text-sm leading-6 text-[#8b3d32]"><ShieldCheck className="mt-0.5 size-5 shrink-0"/><p><strong>安全提醒：</strong>{step.safety}</p></div>}
                </article>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-1 text-sm font-bold text-primary">COOKING NOTES</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">让这道菜更好吃</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {recipe.tips.map((tip, index) => <div key={tip} className="flex gap-4 rounded-[22px] border bg-[#fff9e8] p-5"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#f3c75b]/25 text-[#9b6b00]"><Lightbulb className="size-5" /></span><div><h3 className="font-black">小贴士 {index + 1}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{tip}</p></div></div>)}
              {recipe.failurePoints.map(point=><div key={point} className="flex gap-4 rounded-[22px] border border-[#b83e32]/20 bg-[#fff2ee] p-5"><span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#b83e32]/10 text-destructive"><CircleAlert className="size-5" /></span><div><h3 className="font-black">常见翻车点</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{point}</p></div></div>)}
              <div className="flex gap-4 rounded-[22px] border bg-[#edf5e8] p-5 sm:col-span-2"><ShieldCheck className="size-6 shrink-0 text-[#456341]"/><div><h3 className="font-black">食品安全</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{recipe.safetyNote}</p></div></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">{recipe.bilibiliVideoUrl&&<a href={recipe.bilibiliVideoUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-2xl border bg-card px-5 font-bold transition hover:border-primary hover:text-primary"><PlayCircle className="size-5" />观看 B 站同名做法</a>}<a href={recipe.bilibiliSearchUrl} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center gap-2 rounded-2xl border bg-card px-5 font-bold transition hover:border-primary hover:text-primary"><PlayCircle className="size-5" />{recipe.bilibiliVideoUrl?"搜索更多做法":"去 B 站搜索同名做法"}</a></div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{recipe.bilibiliVideoUrl?`收录资料：${recipe.videoTitle} · ${recipe.videoCreator}。${recipe.videoVerifiedAt ? `历史播放核验记录：${recipe.videoVerifiedAt}。` : `标题与作者核对：${recipe.videoMetadataCheckedAt}；尚未完成完整播放核验。`}`:"暂未收录具体视频直链，当前提供同名搜索入口。"} 视频配方可能与本站不同，请勿混用两套用量；烹饪时以本站完整步骤、食材成熟状态与食品安全提示判断。</p>
          </section>

          <section>
            <p className="mb-1 text-sm font-bold text-primary">EDITORIAL REVIEW</p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">内容状态与参考资料</h2>
            <div className="mt-5 rounded-[22px] border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className={`mt-0.5 size-6 shrink-0 ${recipe.editorialStatus==="reviewed"?"text-[#4f7b48]":"text-[#b67d08]"}`} />
                <div>
                  <h3 className="font-black">{recipe.editorialStatus==="reviewed"?`已于 ${recipe.reviewedAt} 完成逐项复核`:"这道菜尚未完成逐道实做复核"}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{recipe.editorialStatus==="reviewed"?"已核对食材总量、分步取用、火候、计时、完成状态和食品安全。":"现有食材与步骤通过了结构检查，具体用量和实际耗时仍需实做校对。"} 不同灶具和锅具升温速度不同，请同时观察步骤中的成熟状态。</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2 border-t pt-4 text-sm leading-6">
                {recipe.sources.map((source)=><li key={`${source.name}-${source.url}`} className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between"><a href={source.url} target="_blank" rel="noreferrer" className="font-bold text-primary underline-offset-4 hover:underline">{source.name}</a><span className="text-xs text-muted-foreground">{source.type} · {source.verifiedAt ? `${recipe.editorialStatus==="reviewed"?"核验":"资料记录"}日期 ${source.verifiedAt}` : "日期待资料核验"}</span></li>)}
              </ul>
            </div>
          </section>
        </div>

        <div className="hidden lg:block">
          <div className="rounded-[24px] border bg-[#fff6ec] p-5 text-sm leading-6 text-muted-foreground"><strong className="mb-1 block text-base text-foreground">做菜不赶时间</strong>先把食材全部备齐，再开始第一步。页面中的完成状态比钟表更重要。</div>
        </div>
        </div>
      </div>

      {similar.length > 0 && <section className="page-shell mt-16 border-t pt-12"><div className="flex items-end justify-between"><div><p className="text-sm font-bold text-primary">KEEP COOKING</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">下一道，也想试试看</h2></div><Link href="/discover" className="text-sm font-black text-primary">查看全部</Link></div><div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">{similar.map((item) => <RecipeCard key={item.slug} recipe={item} />)}</div></section>}
    </div>
  );
}
