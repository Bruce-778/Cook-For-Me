# Cook for Me

面向中国家庭和做饭新手的中文家常菜网站。收录 98 道结构化菜谱，支持分类筛选、地方风味、食物盲盒、购物清单、人数换算、逐步烹饪模式与 DeepSeek「问小厨」。收藏保存在本机浏览器；配置 Supabase 后启用真实点赞和滚动 7 天排行榜。

内容状态必须区分：98 道菜均通过自动结构检查，其中 **1 道有逐项人工复核记录，97 道仍待实做复核**。结构检查不证明味道、时间和成熟状态在每种锅具上都正确；页面会保留该状态，不能把待复核菜写成已复核。

## 本地启动

环境要求：Node.js 22+、pnpm 11+。不配置 Supabase 时可浏览菜谱和使用本地收藏；点赞会提示服务尚未连接。待复核菜也可在本地查看、加入盲盒和进入烹饪模式，详情页会显示其复核状态。

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3001](http://localhost:3001)。开发脚本使用 3001；若该端口已被其他项目占用，可临时运行 `pnpm exec next dev -p 3101`，并访问对应端口。

要启用 AI 助手，复制 `.env.example` 为 `.env.local`，填入服务端 `DEEPSEEK_API_KEY`。没有密钥时接口会返回站内保守推荐。密钥不得使用 `NEXT_PUBLIC_` 前缀，也不得提交到 Git。

本地可打开 [AI 运行状态](http://localhost:3001/ai-status) 查看模型、接口地址、密钥是否配置、Supabase 变量状态，并点击“测试 DeepSeek”。页面只显示密钥长度和不可逆指纹，不显示完整 API Key。生产环境如需查看脱敏诊断状态，设置服务端变量 `AI_DIAGNOSTICS_TOKEN`，再在诊断页输入该令牌；部署平台里 API Key 显示锁定是正常的，旧密钥不能从网页恢复，只能重新设置或轮换。

## Supabase 与真实点赞

1. 为 Cook for Me 新建独立 Supabase 项目，在 Auth 设置中启用 Anonymous Sign-Ins；生产环境同时启用 Turnstile/hCaptcha 和匿名注册限流。
2. 在 `.env.local` 或托管平台变量中填入项目 URL、publishable key 和仅服务器可见的 secret key。任何 secret key 都不能使用 `NEXT_PUBLIC_` 前缀；同时明确设置 `KEEP_DRAFT_RECIPES_PRIVATE=true` 或 `false`。两种策略都不会伪造复核状态：设为 `true` 时公开页面、API、AI、盲盒和 Supabase 只提供已逐道实做复核的菜；设为 `false` 时待复核菜也能被浏览，但详情页必须保留“尚未完成逐道实做复核”提示。
3. 连接项目并应用迁移：

```bash
pnpm dlx supabase login
pnpm dlx supabase link --project-ref YOUR_PROJECT_REF
pnpm dlx supabase db push
pnpm seed:supabase
```

种子命令只同步菜谱，不写入点赞记录。默认将 98 道菜同步为可点赞的 `published`，但仅对真正完成复核的菜写入 `reviewed_at`；公开状态不等于内容已复核。若准备面向真实用户开放，建议先运行 `KEEP_DRAFT_RECIPES_PRIVATE=true pnpm seed:supabase`，让待复核菜保留在 `review`，前端也同步隐藏这些草稿；如果确实要让用户先浏览全部菜谱，运行 `KEEP_DRAFT_RECIPES_PRIVATE=false pnpm seed:supabase`，并在页面上如实保留复核状态。新项目的点赞从 0 开始。同一匿名用户对同一道菜由数据库复合主键保证只能有一个赞。

本地 Supabase 可使用：

```bash
pnpm dlx supabase start
pnpm dlx supabase db reset
pnpm seed:supabase
```

## 验证命令

```bash
pnpm lint
pnpm typecheck
pnpm validate:content
pnpm validate:ai
pnpm validate:supabase
pnpm validate:videos
pnpm build
```

`validate:content` 包含 98 道菜的结构、食材引用、分步时间下限及忌口/换菜回归测试；`validate:ai` 检查服务端推荐过滤；`validate:supabase` 仅检查 SQL 与调用约束，不代表远程数据库已部署。`validate:videos` 默认离线检查字段与 URL，联网检查标题、UP 主和公开状态时运行：

```bash
CHECK_BILIBILI_ONLINE=1 pnpm validate:videos
```

启动本地服务后执行 `LOCAL_BASE_URL=http://localhost:3001 pnpm test:local`（备用端口改为 3101）。它检查全部菜谱详情/烹饪页、详情 API、分页、盲盒忌口与错误边界，不调用付费 AI、不写入点赞。

联网检查也不代替完整播放或实做。2026-09-26 的内容修正见 [内容检查记录](docs/content-audit-2026-09-26.md)；本次上线前本地验收见 [上线前验收记录](docs/prelaunch-audit-2026-09-27.md)。

## 当前页面

- `/`：原创暖橙色响应式首页
- `/discover`：菜名/食材搜索、分类、时间和排序筛选
- `/assistant`：按现有食材、时间、忌口与一般饮食目标推荐站内菜谱
- `/blindbox`：食物盲盒——按人数、时间、忌口和宝宝月龄生成整桌菜单与购物清单
- `/recipes/[slug]`：菜谱详情、人数换算和食材勾选
- `/cook/[slug]`：沉浸式逐步烹饪、计时和进度恢复
- `/ranking`：最近热门排行
- `/favorites`：浏览器本地收藏

## 数据与隐私

- 菜谱源数据位于 `src/lib/recipes.ts`、`src/lib/verified-recipes.ts` 和 `src/lib/regional-recipes.ts`；同步脚本为 `scripts/sync-recipes-to-supabase.ts`。
- 新增菜谱和核对 B 站视频的流程见 `docs/content-maintenance.md`。22 道菜录有视频直链，其中 4 条仅核对公开元数据、尚未完整播放；其余 76 道使用同名搜索入口。链接可访问不等于做法已复核。
- 收藏、忌口、食材勾选和烹饪进度只写入当前浏览器 localStorage。
- 点赞使用 Supabase 无感匿名身份和 RLS；网站不收集姓名、邮箱或诊断信息。
- 菜谱卡片和菜谱详情不展示单菜图片；首页牛排照片与地方风味餐桌图只作氛围视觉，不作为任何一道菜的成品示例。
- “清淡恢复”“老人友好”“减脂餐”是一般场景标签，不是医疗建议；特殊医学用途饮食请遵医嘱。
- AI 助手的数据发送范围、提示词限制与降级机制见 `docs/ai-assistant.md`。

## Git worktrees

早期使用过以下独立分支开展并行开发，功能已合入主分支：

- `feature/cook-for-me-site`：设计系统、首页、发现与最终整合
- `feature/recipe-detail`：菜谱详情
- `feature/cooking-mode`：烹饪模式
- `feature/library-pages`：收藏与排行

后续维护以主目录 `main` 为准；不要把这些历史分支当作当前功能的唯一来源。

## 上线检查

- 部署前在托管平台配置 `.env.example` 中的变量，并运行 `REQUIRE_PRODUCTION_CONFIG=1 pnpm validate:production`。它会阻止缺少 HTTPS 域名、AI/Supabase 密钥或菜谱发布策略不明确的部署，也会阻止误用 `NEXT_PUBLIC_DEEPSEEK_API_KEY`。
- 若暂时开放待复核菜，生产配置必须显式写 `KEEP_DRAFT_RECIPES_PRIVATE=false`；这只是内容发布策略，不代表菜谱已经实做复核。正式公开做法前，建议改为 `true`，并在完成逐道实做后再逐步发布。
- 在 Supabase Dashboard 确认所有 `public` 表已启用 RLS，并运行 Database Advisors。
- 确认生产域名已加入 Auth URL Configuration，匿名登录启用了验证码和合理的每 IP 限流。
- 托管平台只向服务器注入 `SUPABASE_SECRET_KEY`；浏览器只能访问 publishable key。
- 生产环境需要配置 `DEEPSEEK_API_KEY`；未配置时系统会安全降级为站内规则推荐，不会暴露上游错误或密钥。
- 部署后从两台不同设备验证点赞、取消点赞和滚动 7 天排行榜。
