import { createClient } from "@supabase/supabase-js";
import { recipes } from "../src/lib/recipes";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const secret=process.env.SUPABASE_SECRET_KEY;
if(!url||!secret)throw new Error("请先设置 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SECRET_KEY");
const supabase=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const keepDraftsPrivate=process.env.KEEP_DRAFT_RECIPES_PRIVATE==="true";

for(const recipe of recipes){
 const canPublish=!keepDraftsPrivate||recipe.editorialStatus==="reviewed";
 const {data:row,error}=await supabase.from("recipes").upsert({slug:recipe.slug,title:recipe.title,summary:recipe.summary,image_path:recipe.image,category:recipe.category,tags:recipe.tags,aliases:recipe.aliases,diet_type:recipe.dietType,nutrition_roles:recipe.nutritionRoles,cooking_method:recipe.cookingMethod,spice_level:recipe.spiceLevel,allergens:recipe.allergens,baby_age_min:recipe.babyAge?.min??null,baby_age_max:recipe.babyAge?.max??null,difficulty:recipe.difficulty,prep_minutes:recipe.prepMinutes,active_minutes:recipe.activeMinutes,wait_minutes:recipe.waitMinutes,servings:recipe.servings,bilibili_video_url:recipe.bilibiliVideoUrl??null,bilibili_search_url:recipe.bilibiliSearchUrl,video_title:recipe.videoTitle??null,video_creator:recipe.videoCreator??null,video_verified_at:recipe.videoVerifiedAt??null,status:canPublish?"published":"review",reviewed_at:recipe.reviewedAt??null},{onConflict:"slug"}).select("id").single();
 if(error||!row)throw new Error(`${recipe.title} 主表写入失败：${error?.message}`);const recipeId=row.id as string;
 const cleanupResults=await Promise.all([supabase.from("recipe_ingredients").delete().eq("recipe_id",recipeId),supabase.from("recipe_steps").delete().eq("recipe_id",recipeId),supabase.from("recipe_tips").delete().eq("recipe_id",recipeId),supabase.from("recipe_sources").delete().eq("recipe_id",recipeId)]);
 const cleanupError=cleanupResults.find(result=>result.error)?.error;
 if(cleanupError)throw new Error(`${recipe.title} 旧明细清理失败：${cleanupError.message}`);
 const {data:ingredientRows,error:ingredientError}=await supabase.from("recipe_ingredients").insert(recipe.ingredients.map((item,index)=>({recipe_id:recipeId,name:item.name,amount:item.amount,unit:item.unit,note:item.note??null,group_name:item.group,sort_order:index}))).select("id,name");if(ingredientError)throw ingredientError;
 const {data:stepRows,error:stepError}=await supabase.from("recipe_steps").insert(recipe.steps.map((step,index)=>({recipe_id:recipeId,step_number:index+1,title:step.title,body:step.text,heat:step.heat,water_temperature:step.waterTemperature,oil_amount_ml:step.oilAmountMl??null,oil_temperature:step.oilTemperature,timer_seconds:step.timerSeconds,completion_cue:step.cue,safety_note:step.safety??null}))).select("id,step_number");if(stepError)throw stepError;
 const ingredientByName=new Map((ingredientRows??[]).map(item=>[item.name,item.id]));const links=(stepRows??[]).flatMap(stepRow=>{const step=recipe.steps[stepRow.step_number-1];return step.ingredients.flatMap(name=>{const ingredient=recipe.ingredients.find(item=>item.name===name);const ingredientId=ingredientByName.get(name);const amount=step.ingredientAmounts?.[name];return ingredient&&ingredientId?[{step_id:stepRow.id,ingredient_id:ingredientId,amount:amount??ingredient.amount}]:[]})});if(links.length){const {error:linkError}=await supabase.from("recipe_step_ingredients").insert(links);if(linkError)throw linkError;}
 const notes=[...recipe.tips.map((body,index)=>({recipe_id:recipeId,kind:"tip",body,sort_order:index})),...recipe.failurePoints.map((body,index)=>({recipe_id:recipeId,kind:"failure",body,sort_order:index})),{recipe_id:recipeId,kind:"safety",body:recipe.safetyNote,sort_order:0}];const {error:tipError}=await supabase.from("recipe_tips").insert(notes);if(tipError)throw tipError;
 const {error:sourceError}=await supabase.from("recipe_sources").insert(recipe.sources.map(source=>({recipe_id:recipeId,name:source.name,url:source.url,source_type:source.type,verified_at:source.verifiedAt??null})));if(sourceError)throw sourceError;
 console.log(`✓ ${recipe.title}`);
}
const publishedCount=recipes.filter(recipe=>!keepDraftsPrivate||recipe.editorialStatus==="reviewed").length;
console.log(`完成：${recipes.length} 道菜已同步；${publishedCount} 道可公开点赞，${recipes.length-publishedCount} 道保留为内部待复核；未写入任何点赞记录。`);
