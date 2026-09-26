/**
 * Check the environment that a real public deployment needs. This is opt-in so
 * local development and the documented DeepSeek/Supabase-free fallback remain
 * usable. Run with REQUIRE_PRODUCTION_CONFIG=1 in the deployment environment.
 */
if (process.env.REQUIRE_PRODUCTION_CONFIG !== "1") {
  console.log("跳过生产配置检查；部署前请运行 REQUIRE_PRODUCTION_CONFIG=1 pnpm validate:production。 ");
  process.exit(0);
}

const errors: string[] = [];
const warnings: string[] = [];
const required = (name: string) => {
  if (!process.env[name]?.trim()) errors.push(`${name} 未设置`);
};

for (const name of [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
  "DEEPSEEK_API_KEY",
]) required(name);

for (const name of ["DEEPSEEK_API_KEY", "SUPABASE_SECRET_KEY", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]) {
  const value = process.env[name]?.trim().toLowerCase();
  if (value && (/^replace-with|^your[-_ ]/.test(value) || value.includes("example-key"))) {
    errors.push(`${name} 仍是示例占位值`);
  }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (siteUrl) {
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "https:") errors.push("NEXT_PUBLIC_SITE_URL 必须使用 HTTPS");
    if (parsed.username || parsed.password) errors.push("NEXT_PUBLIC_SITE_URL 不应包含账号或密码");
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") errors.push("NEXT_PUBLIC_SITE_URL 不能指向本机");
  } catch {
    errors.push("NEXT_PUBLIC_SITE_URL 不是有效的网址");
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
if (supabaseUrl) {
  try {
    if (new URL(supabaseUrl).protocol !== "https:") errors.push("NEXT_PUBLIC_SUPABASE_URL 必须使用 HTTPS");
  } catch {
    errors.push("NEXT_PUBLIC_SUPABASE_URL 不是有效的网址");
  }
}

if (process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY) errors.push("禁止设置 NEXT_PUBLIC_DEEPSEEK_API_KEY，DeepSeek 密钥只能在服务端变量中");
const draftPolicy = process.env.KEEP_DRAFT_RECIPES_PRIVATE?.trim();
if (draftPolicy !== "true" && draftPolicy !== "false") {
  errors.push("KEEP_DRAFT_RECIPES_PRIVATE 必须明确设置为 true 或 false");
} else if (draftPolicy === "false") {
  warnings.push("KEEP_DRAFT_RECIPES_PRIVATE=false：公开页面、API、AI、盲盒和 Supabase 会包含待复核菜谱；页面会显示其待复核状态，不能把它们宣传为已实做复核。");
}

const baseUrl = process.env.DEEPSEEK_API_BASE_URL?.trim();
if (baseUrl) {
  try {
    if (new URL(baseUrl).protocol !== "https:") errors.push("DEEPSEEK_API_BASE_URL 必须使用 HTTPS");
  } catch {
    errors.push("DEEPSEEK_API_BASE_URL 不是有效的网址");
  }
}

if (errors.length) {
  console.error(`生产配置检查失败：\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}
if (warnings.length) console.warn(`生产配置提醒：\n${warnings.map((warning) => `- ${warning}`).join("\n")}`);
console.log("✓ 生产域名、HTTPS、AI/Supabase 密钥和待复核菜谱策略通过检查。");
