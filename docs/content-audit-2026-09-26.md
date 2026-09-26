# 2026-09-26 菜谱与视频检查记录

## 范围与结论

本轮保留 98 道菜和无单菜图片设计，检查配方结构、食材引用、总时间、荤素、过敏原、推荐筛选与视频入口。没有实际烹饪或完整播放视频，未新增任何 `reviewed`、`reviewedAt`、`videoVerifiedAt` 记录；原有状态仍为 1 道有复核记录、97 道待实做复核。

## 已修正

- 为 28 道基础菜建立独立做法：可乐鸡翅、香煎鸡翅、鱼香肉丝、宫保鸡丁、木须肉、京酱肉丝、葱油拌面、阳春面、南瓜小米粥、清蒸鲈鱼、家常豆腐、红烧茄子、凉拌黄瓜、西芹百合、香菇蒸鸡、清蒸鳕鱼、芹菜炒鱿鱼、葱姜炒蟹、蒜蓉粉丝蒸扇贝、蒜蓉蒸生蚝、青椒肉丝、蒜薹炒肉、黑椒牛柳、酸辣土豆丝、手撕包菜、香菇青菜、番茄炒西葫芦、蒜蓉菠菜。
- 可乐鸡翅改为含糖可乐 330ml，移除通用模板附加的 600ml 水；木须肉补上先炒鸡蛋；葱油拌面补上小火熬葱油；复合味菜明确腌料与碗汁分开、分次用油和糖醋分配。
- 麻婆豆腐区分焯水、200ml 炖煮水与 20ml 淀粉水；糖醋里脊、干煸四季豆等调整煎炒用油；调味专用配方可以正确覆盖主表里的同名用量。
- 移除步骤辅助函数自动填入“15ml 油”的行为；不再默默丢弃清单外食材引用。
- 烹饪模式不再把整道菜总量当作每一步用量；无明确分步定量时只显示食材名称。人数变化时醒目说明正文仍按原配方，已结构化的本步定量和油量标签按比例换算。
- 对全部菜应用保守过敏原/荤素规则，修复蚝油菜当素菜、酱油漏大豆/小麦、面皮漏麸质、皮蛋漏蛋、芝麻漏标、鱿鱼归错鱼类等问题。不辣不再自动显示为清淡。
- 总时长不低于顺序步骤计时之和；这不是实测耗时，也不覆盖所有灶具与烧水差异。
- 修正 AI 奶过敏标签不一致和盲盒猪油/五花肉漏排除，避免“不吃牛肉”误伤牛奶；换菜时复核当前菜单是否仍符合最新忌口。
- 正餐盲盒排除甜点，不再把含蛋奶甜品或仅用了蚝油的青菜当成蛋白质正餐，也不以粥代替配餐汤；豆腐可作蛋白质菜，单菜替换保持蛋白质菜、蔬菜、汤的角色。菜谱不足时不建议取消过敏限制。
- 修复饮食设置首次渲染先写默认值、随后才读取本机存储造成的覆盖问题；统一读取校验和写入时序，忌口按钮增加可访问的选中状态。

## 视频核查

2026-09-26 通过 B 站公开视频元数据接口检查了 22/22 条直链，BV、公开状态、标题及 UP 主均匹配。补全豉汁蒸排骨的视频原始标题。

新增 4 条同名做法入口，仅写入 `videoMetadataCheckedAt=2026-09-26`：

| 菜名 | BV | 作者 | 记录类型 |
| --- | --- | --- | --- |
| 番茄炒蛋 | BV13p411d7oQ | 美食作家王刚R | 元数据核对，未完整播放 |
| 可乐鸡翅 | BV1vE411h7VP | 美食作家王刚R | 元数据核对，未完整播放 |
| 鱼香肉丝 | BV1Gs411A7Vo | 美食作家王刚R | 元数据核对，未完整播放 |
| 葱油拌面 | BV1Pm4y1X796 | 美食作家王刚R | 元数据核对，未完整播放 |

其余 76 道保留对应 B 站搜索入口。视频配方可能不同，详情页提示不要混用两套用量。在线视频检查可通过 `CHECK_BILIBILI_ONLINE=1 pnpm validate:videos` 重跑，失败会返回非零退出状态。

## 资料依据

以下为本轮确实访问的参考资料；它们不是所有 98 道菜都已完成资料复核的证明：

- [China Sichuan Food：可乐鸡翅](https://www.chinasichuanfood.com/coca-cola-chicken-wings/)：对照煎香、可乐焖煮与收汁的顺序。
- [The Woks of Life：鱼香肉丝](https://thewoksoflife.com/pork-garlic-sauce/)：对照腌肉、碗汁与炒制分开的流程。
- [Made With Lau：清蒸鱼](https://www.madewithlau.com/recipes/steamed-fish)：对照鱼形态、蒸制和葱姜调味流程。
- [China Sichuan Food：酸辣土豆丝](https://www.chinasichuanfood.com/spicy-and-sour-potato/comment-page-1/)与 [Made With Lau：炒青菜](https://www.madewithlau.com/recipes/stir-fried-bok-choy)：对照洗去浮淀粉、醋后放、青菜沥水与梗叶分开下锅。
- [FoodSafety.gov 安全中心温度](https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)及 [USDA FSIS 温度表](https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart)：禽肉 74°C、肉末 71°C、鱼及贝类约 63°C 等安全判断，不以外表上色替代中心熟度。
- [FDA 食物过敏](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies)、[Kikkoman 酱油配料](https://kikkomanusa.com/products/soy-sauce-non-gmo/)和 [李锦记蚝油配料](https://uk.lkk.com/products/premium-oyster-sauce)：用于补充常见调味料的过敏原提示；品牌配方以实际标签为准。

## 未完成项

- 97 道菜尚无独立实做验收，不能承诺所有用量和时间在所有家庭厨房都已验证。
- 76 道尚无具体 BV 直链，只有同名搜索；新增 4 条未完成完整播放核验，原有 18 条历史播放日期未刷新。
- 本轮不部署、不新增远程数据库、不改历史提交日期，不提交本地密钥或用户迁移资料。

## 验证覆盖

- `pnpm lint`、`pnpm typecheck`、`pnpm validate:content`、`pnpm validate:ai`、`pnpm validate:videos`、`pnpm validate:supabase` 与生产构建通过；生成 210 个静态页面项。
- 新增 `pnpm test:local`，逐道检查 98 个详情页、98 个烹饪页、98 个详情 API，核对 API 食材/步骤与源码一致，并检查完整分页、忌口盲盒及错误边界。
- 浏览器可见页面已确认可乐鸡翅用量、独立步骤与新视频状态说明正确渲染。内置浏览器点击未得到可靠反馈，改用 Chrome 后浏览器连接超时；本轮未将刷新保存、点击生成菜单或移动端交互标记为已通过。HTTP 与函数回归通过不能替代这些交互验收。
