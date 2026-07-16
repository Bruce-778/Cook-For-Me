import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration=readFileSync(resolve("supabase/migrations/20260715082834_cook_for_me_schema.sql"),"utf8");
const seed=readFileSync(resolve("supabase/seed.sql"),"utf8");
const config=readFileSync(resolve("supabase/config.toml"),"utf8");
const errors:string[]=[];
const assert=(condition:unknown,message:string)=>{if(!condition)errors.push(message)};
const tables=["recipes","recipe_ingredients","recipe_steps","recipe_step_ingredients","recipe_tips","recipe_sources","recipe_likes"];

for(const table of tables){
  assert(new RegExp(`create table public\\.${table}\\b`,"i").test(migration),`${table}: 缺少建表语句`);
  assert(new RegExp(`alter table public\\.${table} enable row level security`,"i").test(migration),`${table}: 未启用 RLS`);
}
assert(/primary key \(recipe_id, user_id\)/i.test(migration),"recipe_likes: 缺少设备用户幂等主键");
assert(/users read own likes[\s\S]*auth\.uid\(\)[\s\S]*user_id/i.test(migration),"recipe_likes: 缺少只读本人点赞策略");
assert(/users insert own likes[\s\S]*with check[\s\S]*auth\.uid\(\)[\s\S]*user_id/i.test(migration),"recipe_likes: 缺少本人插入约束");
assert(/users delete own likes[\s\S]*auth\.uid\(\)[\s\S]*user_id/i.test(migration),"recipe_likes: 缺少本人删除约束");
assert(/security invoker/i.test(migration),"点赞聚合函数必须使用 security invoker");
assert(/revoke all on function public\.recipe_like_counts\(\) from public/i.test(migration),"点赞聚合函数未撤销 PUBLIC 执行权限");
assert(/grant execute on function public\.recipe_like_counts\(\) to service_role/i.test(migration),"点赞聚合函数未限定 service_role");
assert(!/insert\s+into\s+public\.recipe_likes/i.test(`${migration}\n${seed}`),"迁移或种子禁止写入伪点赞");
assert(/enable_anonymous_sign_ins\s*=\s*true/.test(config),"本地匿名登录未启用");
assert(/anonymous_users\s*=\s*\d+/.test(config),"匿名注册缺少限流配置");
assert(/http:\/\/localhost:3001/.test(config),"Auth 回调地址缺少 localhost:3001");

if(errors.length){console.error(errors.join("\n"));process.exit(1)}
console.log(`✓ Supabase ${tables.length} 张公开表均启用 RLS；点赞幂等、所有权策略、聚合函数权限、匿名登录限流和零种子点赞通过静态校验`);
