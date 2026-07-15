# Cook for Me

面向年轻人和做饭新手的中文家常菜制作网站。首版是完全本地可运行的内容型应用：菜谱、分类、精选与排行数据均内置在项目中，收藏、食材勾选和烹饪进度保存在浏览器本地，不需要数据库、账号或 AI 服务。

## 本地启动

环境要求：Node.js 22+、pnpm 11+。

```bash
pnpm install
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 验证命令

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 当前页面

- `/`：原创暖橙色响应式首页
- `/discover`：菜名/食材搜索、分类、时间和排序筛选
- `/recipes/[slug]`：菜谱详情、人数换算和食材勾选
- `/cook/[slug]`：沉浸式逐步烹饪、计时和进度恢复
- `/ranking`：最近热门排行
- `/favorites`：浏览器本地收藏

## 数据与隐私

- 菜谱数据位于 `src/lib/recipes.ts`。
- 收藏、勾选、点赞反馈和烹饪进度只写入当前浏览器的 localStorage。
- 当前没有登录、用户画像、AI、远程数据库或分析埋点。
- 示例菜品摄影通过 Unsplash 图片 CDN 加载；正式发布前可替换为自有或统一授权的本地素材。

## Git worktrees

本项目采用多个独立 worktree 并行开发：

- `feature/cook-for-me-site`：设计系统、首页、发现与最终整合
- `feature/recipe-detail`：菜谱详情
- `feature/cooking-mode`：烹饪模式
- `feature/library-pages`：收藏与排行

各功能验证通过后合并回 `feature/cook-for-me-site`，主目录 `main` 保持稳定。

## 后续上线

首版上线只需要构建并托管当前 Next.js 项目，不依赖外部密钥。未来如需跨设备收藏、真实全站点赞排行或 AI 能力，再增加独立服务端数据适配层；现有页面和本地启动方式无需改变。
