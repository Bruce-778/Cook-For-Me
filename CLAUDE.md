# Cook for Me 开发约定

- 主目录的 `main` 是当前集成版本。修改现有文件前先查看 `git status`，保留用户未提交的内容。
- 本地开发脚本使用 3001。若被其他项目占用，临时执行 `pnpm exec next dev -p 3101`；不要停止或覆盖其他项目的进程。
- 菜谱源数据在 `src/lib/recipes.ts`、`src/lib/verified-recipes.ts`、`src/lib/regional-recipes.ts`。新增菜谱须保持唯一 slug、明确用量、分步火候/时间/成熟状态与对应 B 站搜索入口。
- `editorialStatus=reviewed` 只用于留有逐道实做和资料复核记录的菜。自动结构校验、AI 生成内容、视频链接可打开均不能替代实做复核；不得伪造 `reviewedAt`、`videoVerifiedAt` 或资料日期。
- 菜谱卡片与详情采用无单菜图片设计；首页图片只作为氛围素材。不要把牛排或餐桌图片复用到具体菜谱。
- DeepSeek 密钥只从服务端 `DEEPSEEK_API_KEY` 读取。`.env.local` 不进入 Git；可提交的变量模板是 `.env.example`。
- 数据库同步默认允许草稿公开点赞，但 `reviewed_at` 只能取真实复核日期；如需仅公开已复核菜，使用 `KEEP_DRAFT_RECIPES_PRIVATE=true`。
- 修改后运行 `pnpm lint`、`pnpm typecheck`、`pnpm validate:content`、`pnpm validate:ai`、`pnpm validate:videos`、`pnpm validate:supabase` 和 `pnpm build`。各项的覆盖范围见 README，不能把结构检查称为菜谱实做验证。

深入说明：`README.md`（运行与页面）、`docs/content-maintenance.md`（菜谱及视频）、`docs/ai-assistant.md`（AI 边界）。
