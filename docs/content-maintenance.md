# 菜谱与 B 站视频维护流程

这套流程用于持续增加或更新菜谱。新内容默认留在审核状态，不允许为了更新速度跳过逐道核验。

## 新增或更新一道菜

1. 在 `src/lib/recipes.ts`、`src/lib/verified-recipes.ts` 或 `src/lib/regional-recipes.ts` 中新增或修改菜谱，保持 slug 稳定且唯一。基础目录的专用配方修正位于 `src/lib/recipe-methods.ts`；修改时先检查该 slug 是否有覆盖，避免只改通用模板而不生效。
2. 逐项核对食材克数/毫升、火候、水温、油温、时间和完成状态；不能使用“适量”“少许”等模糊词。
   - 先做一次台面复核：按页面称量全部食材，确认没有清单外临时加料。
   - 再做一次实烧复核：记录实际锅具、灶具档位、下锅状态、耗时和成品状态；只把本步首次实际取用的数量计入 `ingredientAmounts`，后续“回锅”“装盘”不重复计算。
   - 酸甜、红烧、鱼香、宫保等复合味必须单独核对糖、醋、酱油、料酒、淀粉和油的比例，不能继承通用炒菜模板。
3. 至少保留两个来源，并把来源名称、URL、核验日期写入菜谱数据。宝宝、老人和清淡恢复类还要对照权威膳食指南。
   - 两个来源应当直接描述同一道菜；搜索结果页、聚合页和 AI 成品图不能充当做法来源。
   - 正式标记为 `reviewed` 前，由另一位审核者按页面独立复做一次。当前本地预览允许 `draft` 进入烹饪模式和盲盒，因此详情页必须明确显示未完成复核；如果只想公开已复核菜，使用文末的数据库同步开关。
4. 运行 `pnpm validate:content`，修复全部结构与覆盖量错误。
5. 录入 B 站视频时，区分元数据核对与完整播放。新增的仅核对标题与作者的引用放在 `src/lib/recipe-videos.ts`，页面必须披露未完整播放；现存直链的历史字段不证明本次重新播放过：
   - `bilibiliVideoUrl`：`https://www.bilibili.com/video/BV...` 具体视频直链；不能填写搜索页。
   - `videoTitle`：视频原始标题。
   - `videoCreator`：UP 主名称。
   - `videoVerifiedAt`：最后人工播放核验日期，格式为 `YYYY-MM-DD`。
   - `videoMetadataCheckedAt`：实际通过公开接口检查 BV、标题、UP 主和公开状态的日期；只有元数据检查时填写此字段，不填写 `videoVerifiedAt`。
6. 每道菜都保留 `bilibiliSearchUrl`。详情页始终提供同名搜索入口；直链缺失或失效时由用户使用搜索入口查找。
7. 运行 `pnpm validate:videos` 检查结构；使用 `CHECK_BILIBILI_ONLINE=1 pnpm validate:videos` 顺序读取公开元数据，检查失效或标题/UP 主变化。联网失败会退出非零，不应伪装为通过；脚本不自动改日期。正式要求全部菜都已有直链时运行 `REQUIRE_DIRECT_BILIBILI=1 pnpm validate:videos`。
8. 数据库同步默认将全部菜设为 `published` 以启用点赞，但只对真正已复核的菜写入 `reviewed_at`。如需让待复核菜保留在 `review`，运行 `KEEP_DRAFT_RECIPES_PRIVATE=true pnpm seed:supabase`。不要用发布状态替代编辑复核状态。

## 图片原则

菜谱目前采用无单菜图片模式，`image` 为空且 `imageVerified=false`。首页的牛排照片与餐桌插画只是氛围素材，不得放在具体菜谱上冒充成品图。以后若恢复单菜图片，必须逐道核对主料、切法、成品形态和配菜，不能按大类复用。

## 视频复核标准

- 页面把具体 BV 视频页称为“B 站同名做法”；搜索结果页只作为查找入口。元数据检查仅确认视频身份和可访问性，不证明主料、操作或成品与本站完全一致。
- 视频只是帮助用户观察状态，不覆盖本站的精确用量、火候和食品安全说明。
- 视频失效、改标题、内容被替换或做法与本站明显冲突时，立即清空精选直链并保留搜索兜底。
- 建议每 30 天检查直链；只有真实完成完整播放后才能更新 `videoVerifiedAt`。

## 公共食材规则与回归

- `src/lib/food-metadata.ts` 根据当前食材推导过敏原与荤素，不按“面食/甜点”等类别猜测。普通酱油按大豆/小麦、普通蚝油按软体贝类/小麦保守提示，使用替代品牌仍需检查标签和交叉接触。
- “素”表示当前列出的配方未含动物性食材，不是对任意品牌调料或餐厅环境的无过敏保证。含蛋奶或蚝油的菜不会被当成纯素。
- 分步计时总和作为顺序操作时总时长的最低值；浸泡、烧水和不同锅具的实际差异仍可能延长耗时。不要以时间代替成熟状态。
- `step-ingredients.ts` 只展示明确填写的 `ingredientAmounts`，缺失时显示名称而不回退为整道菜总量。食材清单换算不代表步骤正文已自动换算，界面必须说明原配方份数与比例。
- 新增/修改食材时同步补充 `scripts/validate-dietary.ts` 与 `scripts/validate-ai-safety.ts`，尤其覆盖隐藏调味料、猪油、面皮和换菜时已改变的忌口。

## 发布前固定命令

```bash
pnpm lint
pnpm typecheck
pnpm validate:content
pnpm validate:ai
pnpm validate:videos
pnpm validate:supabase
pnpm build
```
