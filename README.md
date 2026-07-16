# Cook for Me

面向中国家庭、做饭新手和特定饮食场景的中文家常菜网站。当前包含 80 道结构化菜谱、分龄宝宝辅食、真实点赞/滚动 7 天排行榜、食物盲盒、忌口过滤、购物清单、人数换算和逐步烹饪模式。

## 本地启动

环境要求：Node.js 22+、pnpm 11+。不配置 Supabase 时可浏览菜谱预览和使用本地收藏；点赞会明确提示服务尚未连接，不会回退到假数据。食物盲盒和烹饪模式只使用已完成逐道复核的菜谱，复核数量不足时会明确停用，不用草稿凑数。

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3001](http://localhost:3001)。本项目将 3001 固定为本地开发端口，避免与其他项目占用的 3000 端口冲突。

## Supabase 与真实点赞

1. 为 Cook for Me 新建独立 Supabase 项目，在 Auth 设置中启用 Anonymous Sign-Ins；生产环境同时启用 Turnstile/hCaptcha 和匿名注册限流。
2. 复制 `.env.example` 为 `.env.local`，填入项目 URL、publishable key 和仅服务器可见的 secret key。任何 secret key 都不能使用 `NEXT_PUBLIC_` 前缀。
3. 连接项目并应用迁移：

```bash
pnpm dlx supabase login
pnpm dlx supabase link --project-ref YOUR_PROJECT_REF
pnpm dlx supabase db push
pnpm seed:supabase
```

种子命令只同步菜谱，不写入点赞记录。为避免把尚未完成编辑审核的内容直接推向公网，默认以 `review` 状态导入；逐道完成来源、用量和步骤复核后，再临时设置 `PUBLISH_REVIEWED_RECIPES=true` 重新同步。新项目所有菜的总赞和最近 7 天点赞都从 0 开始。同一匿名用户与同一道菜由数据库复合主键保证只能存在一个赞。

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
pnpm validate:supabase
pnpm validate:videos
pnpm build
```

## 当前页面

- `/`：原创暖橙色响应式首页
- `/discover`：菜名/食材搜索、分类、时间和排序筛选
- `/blindbox`：食物盲盒——按人数、时间、忌口和宝宝月龄生成整桌菜单与购物清单
- `/recipes/[slug]`：菜谱详情、人数换算和食材勾选
- `/cook/[slug]`：沉浸式逐步烹饪、计时和进度恢复
- `/ranking`：最近热门排行
- `/favorites`：浏览器本地收藏

## 数据与隐私

- 菜谱源数据位于 `src/lib/recipes.ts`，同步脚本为 `scripts/sync-recipes-to-supabase.ts`。
- 持续新增菜谱和核验 B 站具体视频的标准流程见 `docs/content-maintenance.md`；未核验直链时页面只展示搜索兜底，不伪装成精选视频。
- 收藏、忌口、食材勾选和烹饪进度只写入当前浏览器 localStorage。
- 点赞使用 Supabase 无感匿名身份和 RLS；网站不收集姓名、邮箱或诊断信息。
- 未通过视觉核验的 Unsplash 大类图片不再渲染；当前只启用匹配的本地番茄炒蛋图片，其余菜完成一菜一图核验后再开放。
- “清淡恢复”“老人友好”“减脂餐”是一般场景标签，不是医疗建议；特殊医学用途饮食请遵医嘱。

## Git worktrees

本项目采用多个独立 worktree 并行开发：

- `feature/cook-for-me-site`：设计系统、首页、发现与最终整合
- `feature/recipe-detail`：菜谱详情
- `feature/cooking-mode`：烹饪模式
- `feature/library-pages`：收藏与排行

各功能验证通过后合并回 `feature/cook-for-me-site`，主目录 `main` 保持稳定。

## 上线检查

- 在 Supabase Dashboard 确认所有 `public` 表已启用 RLS，并运行 Database Advisors。
- 确认生产域名已加入 Auth URL Configuration，匿名登录启用了验证码和合理的每 IP 限流。
- 托管平台只向服务器注入 `SUPABASE_SECRET_KEY`；浏览器只能访问 publishable key。
- 部署后从两台不同设备验证点赞、取消点赞和滚动 7 天排行榜。
