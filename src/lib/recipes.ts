export type Ingredient = { name: string; amount: number; unit: string; note?: string; group: "主料" | "辅料" | "调料" };
export type RecipeStep = { title: string; text: string; heat?: string; time?: string; cue: string; ingredients?: string[] };
export type Recipe = {
  slug: string; title: string; summary: string; image: string; category: string; tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5; prepMinutes: number; cookMinutes: number; servings: number;
  likes: number; weeklyLikes: number; color: string; ingredients: Ingredient[]; steps: RecipeStep[]; tips: string[];
};

const commonSteps = {
  tomatoEgg: [
    { title: "处理食材", text: "番茄顶部划十字，用沸水烫 30 秒后去皮，切成约 2cm 块。鸡蛋加入盐 1g 和清水 10ml，充分打散。", time: "约 3 分钟", cue: "蛋液颜色均匀，表面有细密小泡。", ingredients: ["番茄", "鸡蛋", "盐"] },
    { title: "炒嫩鸡蛋", text: "炒锅中火预热 30 秒，倒入食用油 15ml。油面出现轻微波纹后倒入蛋液，用锅铲从边缘向中间推动。", heat: "中火", time: "40 秒", cue: "鸡蛋约八成熟，表面仍有少量湿润光泽时立即盛出。", ingredients: ["鸡蛋", "食用油"] },
    { title: "炒出番茄汁", text: "原锅加入食用油 5ml，放入番茄和盐 1g，中火翻炒并用锅铲轻压。", heat: "中火", time: "2 分钟", cue: "番茄变软，锅底出现鲜红汤汁。", ingredients: ["番茄", "盐"] },
    { title: "合炒出锅", text: "加入白糖 3g 和清水 20ml，倒回鸡蛋，大火快速翻炒均匀后关火。", heat: "大火", time: "30 秒", cue: "汤汁均匀裹住鸡蛋且仍保持湿润。", ingredients: ["白糖", "鸡蛋"] },
  ],
  simple: [
    { title: "备好全部食材", text: "按食材清单称量并切配，生熟食材使用不同砧板。", time: "5 分钟", cue: "全部食材已按顺序摆放，调料已称量。" },
    { title: "预热锅具", text: "空锅中火预热 30 秒，再加入食用油，转动锅身让油铺开。", heat: "中火", time: "30 秒", cue: "油面出现轻微波纹但没有冒烟。" },
    { title: "完成主要烹饪", text: "放入主料并持续翻动，根据食材厚度保持均匀受热。", heat: "中火", time: "4 分钟", cue: "食材表面上色均匀，中心完全熟透。" },
    { title: "调味并出锅", text: "加入已称量的调味料，大火快速翻匀后立即关火装盘。", heat: "大火", time: "30 秒", cue: "调味汁均匀包裹食材，锅底没有多余水分。" },
  ] satisfies RecipeStep[],
};

const images = {
  tomato: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1400&q=85",
  chicken: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1400&q=85",
  greens: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1400&q=85",
  dumpling: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1400&q=85",
  fish: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=85",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=85",
  dessert: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1400&q=85",
};

const baseIngredients: Ingredient[] = [
  { name: "主食材", amount: 300, unit: "g", note: "切成约 2cm 块", group: "主料" },
  { name: "食用油", amount: 20, unit: "ml", note: "约 1.5 瓷勺", group: "调料" },
  { name: "食盐", amount: 2, unit: "g", note: "约 1/3 瓷勺", group: "调料" },
  { name: "生抽", amount: 10, unit: "ml", note: "约 2 瓷勺", group: "调料" },
];

export const recipes: Recipe[] = [
  {
    slug: "tomato-scrambled-eggs", title: "番茄炒蛋", summary: "酸甜柔软、汤汁拌饭，新手第一次也能成功。", image: images.tomato,
    category: "家常快炒", tags: ["新手友好", "15分钟", "下饭菜"], difficulty: 1, prepMinutes: 5, cookMinutes: 6, servings: 2,
    likes: 1286, weeklyLikes: 186, color: "#FFE0CF",
    ingredients: [
      { name: "番茄", amount: 400, unit: "g", note: "约 2 个中等番茄", group: "主料" },
      { name: "鸡蛋", amount: 3, unit: "个", note: "去壳约 150g", group: "主料" },
      { name: "食用油", amount: 20, unit: "ml", note: "分两次使用", group: "调料" },
      { name: "盐", amount: 2, unit: "g", note: "分两次使用", group: "调料" },
      { name: "白糖", amount: 3, unit: "g", note: "约半瓷勺", group: "调料" },
      { name: "清水", amount: 30, unit: "ml", note: "蛋液与番茄各用一部分", group: "辅料" },
    ], steps: commonSteps.tomatoEgg, tips: ["鸡蛋八成熟就先盛出，余温会让它继续凝固。", "番茄先去皮，成品口感会更细腻。"],
  },
  { slug: "pan-fried-chicken-wings", title: "香煎鸡翅", summary: "外皮焦香、肉汁饱满，一口平底锅就能完成。", image: images.chicken, category: "家常荤菜", tags: ["下饭菜", "新手友好"], difficulty: 2, prepMinutes: 10, cookMinutes: 18, servings: 2, likes: 963, weeklyLikes: 154, color: "#FFE9C9", ingredients: [{ name: "鸡中翅", amount: 500, unit: "g", note: "约 10 只", group: "主料" }, ...baseIngredients.slice(1)], steps: commonSteps.simple, tips: ["鸡翅擦干后再下锅，更容易煎出焦香外皮。", "贴骨处没有粉红色血水才表示完全熟透。"] },
  { slug: "garlic-broccoli", title: "蒜蓉西兰花", summary: "脆嫩清爽，蒜香刚刚好，十分钟端上桌。", image: images.greens, category: "时令蔬菜", tags: ["减脂餐", "10分钟", "素食"], difficulty: 1, prepMinutes: 5, cookMinutes: 5, servings: 2, likes: 856, weeklyLikes: 132, color: "#E4F0DA", ingredients: [{ name: "西兰花", amount: 350, unit: "g", note: "切成小朵", group: "主料" }, { name: "蒜", amount: 15, unit: "g", note: "约 4 瓣，切末", group: "辅料" }, ...baseIngredients.slice(1)], steps: commonSteps.simple, tips: ["焯水时加入 2g 盐，颜色会更翠绿。"] },
  { slug: "scallion-oil-noodles", title: "葱油拌面", summary: "葱香浓郁、咸甜平衡，一个人的夜宵刚刚好。", image: images.noodles, category: "面食主食", tags: ["一人食", "15分钟"], difficulty: 2, prepMinutes: 5, cookMinutes: 10, servings: 1, likes: 742, weeklyLikes: 118, color: "#F7E6B8", ingredients: [{ name: "鲜面条", amount: 150, unit: "g", group: "主料" }, { name: "小葱", amount: 40, unit: "g", note: "切 5cm 段", group: "辅料" }, ...baseIngredients.slice(1)], steps: commonSteps.simple, tips: ["葱段要小火慢炸，变深金色立即关火。"] },
  { slug: "homemade-dumplings", title: "家常猪肉饺子", summary: "鲜嫩多汁的经典家常味，周末一起慢慢包。", image: images.dumpling, category: "面食主食", tags: ["家庭聚餐", "经典家常"], difficulty: 3, prepMinutes: 35, cookMinutes: 12, servings: 4, likes: 689, weeklyLikes: 96, color: "#F1E8D7", ingredients: [{ name: "饺子皮", amount: 40, unit: "张", group: "主料" }, { name: "猪肉馅", amount: 450, unit: "g", group: "主料" }, { name: "白菜", amount: 300, unit: "g", group: "辅料" }, ...baseIngredients.slice(1)], steps: commonSteps.simple, tips: ["肉馅分三次加水，每次完全吸收后再加。"] },
  { slug: "steamed-fish", title: "清蒸鲈鱼", summary: "鲜嫩清淡，掌握时间就能做出餐厅口感。", image: images.fish, category: "海鲜", tags: ["清淡", "减脂餐", "家庭聚餐"], difficulty: 2, prepMinutes: 10, cookMinutes: 10, servings: 3, likes: 633, weeklyLikes: 88, color: "#DDEEF1", ingredients: [{ name: "鲈鱼", amount: 600, unit: "g", note: "去鳞去内脏", group: "主料" }, { name: "姜", amount: 20, unit: "g", note: "切丝", group: "辅料" }, ...baseIngredients.slice(1)], steps: commonSteps.simple, tips: ["水沸后再放鱼，600g 鲈鱼蒸 8 分钟后焖 2 分钟。"] },
  { slug: "winter-melon-soup", title: "冬瓜排骨汤", summary: "清润温暖，汤清肉香，适合慢慢喝的一锅。", image: images.soup, category: "汤羹", tags: ["清淡", "家庭聚餐"], difficulty: 2, prepMinutes: 15, cookMinutes: 55, servings: 4, likes: 577, weeklyLikes: 76, color: "#EAF1DF", ingredients: [{ name: "排骨", amount: 500, unit: "g", note: "切 4cm 段", group: "主料" }, { name: "冬瓜", amount: 600, unit: "g", note: "去皮切块", group: "主料" }, ...baseIngredients.slice(1)], steps: commonSteps.simple, tips: ["排骨冷水下锅焯水，汤会更清澈。"] },
  { slug: "pumpkin-millet-porridge", title: "南瓜小米粥", summary: "细腻香甜、暖胃好消化，早晨喝一碗很舒服。", image: images.dessert, category: "粥品甜点", tags: ["早餐", "老人餐", "清淡"], difficulty: 1, prepMinutes: 5, cookMinutes: 35, servings: 3, likes: 524, weeklyLikes: 69, color: "#FBE1A8", ingredients: [{ name: "南瓜", amount: 300, unit: "g", note: "去皮切 2cm 块", group: "主料" }, { name: "小米", amount: 100, unit: "g", note: "淘洗 2 次", group: "主料" }, { name: "清水", amount: 1000, unit: "ml", group: "辅料" }], steps: commonSteps.simple, tips: ["小米下锅后转小火，锅盖留一道缝防止溢锅。"] },
];

const additionalSeeds: Array<[string, string, string, keyof typeof images, string, string[], number, number, 1 | 2 | 3 | 4 | 5, string, number, string]> = [
  ["mapo-tofu", "麻婆豆腐", "麻辣鲜香，豆腐滑嫩，汤汁浓郁但不油腻。", "tomato", "家常快炒", ["下饭菜", "香辣"], 8, 12, 2, "嫩豆腐", 400, "g"],
  ["cola-chicken-wings", "可乐鸡翅", "咸甜入味、颜色红亮，大人小孩都喜欢。", "chicken", "家常荤菜", ["下饭菜", "新手友好"], 8, 25, 2, "鸡中翅", 500, "g"],
  ["sweet-sour-pork", "糖醋里脊", "外酥里嫩，酸甜汁均匀裹住每一块肉。", "chicken", "家常荤菜", ["酸甜", "家庭聚餐"], 18, 20, 3, "猪里脊", 400, "g"],
  ["shredded-potato", "酸辣土豆丝", "爽脆酸辣、十分钟快炒，特别适合配米饭。", "greens", "时令蔬菜", ["10分钟", "素食"], 8, 6, 1, "土豆", 400, "g"],
  ["hand-torn-cabbage", "手撕包菜", "锅气十足，菜叶脆嫩，家常快炒不出水。", "greens", "时令蔬菜", ["15分钟", "素食"], 6, 7, 2, "包菜", 500, "g"],
  ["boiled-shrimp", "白灼虾", "清甜弹嫩，用最简单的方式保留海鲜本味。", "fish", "海鲜", ["清淡", "15分钟"], 8, 5, 1, "鲜虾", 500, "g"],
  ["garlic-scallops", "蒜蓉粉丝蒸扇贝", "蒜香扑鼻，粉丝吸满鲜甜汤汁。", "fish", "海鲜", ["家庭聚餐", "蒸菜"], 15, 10, 3, "扇贝", 8, "个"],
  ["seaweed-egg-soup", "紫菜蛋花汤", "清鲜暖胃，蛋花轻盈，五分钟就能上桌。", "soup", "汤羹", ["5分钟", "新手友好"], 3, 4, 1, "鸡蛋", 2, "个"],
  ["corn-rib-soup", "玉米排骨汤", "汤色清亮，玉米清甜，排骨软嫩。", "soup", "汤羹", ["家庭聚餐", "清淡"], 15, 60, 2, "排骨", 500, "g"],
  ["yangchun-noodles", "阳春面", "一碗清汤细面，葱香和猪油香恰到好处。", "noodles", "面食主食", ["一人食", "10分钟"], 3, 7, 1, "细面", 150, "g"],
  ["egg-fried-rice", "黄金蛋炒饭", "米粒分明、蛋香均匀，剩米饭的最好归宿。", "noodles", "面食主食", ["一人食", "15分钟"], 5, 8, 2, "隔夜米饭", 300, "g"],
  ["beef-noodle-soup", "家常牛肉面", "牛肉酥软，汤头醇厚，周末慢炖一锅。", "noodles", "面食主食", ["暖胃", "家庭聚餐"], 20, 80, 3, "牛腩", 600, "g"],
  ["silver-ear-soup", "银耳莲子羹", "软糯清甜，银耳出胶，冷喝热喝都舒服。", "dessert", "粥品甜点", ["甜品", "清淡"], 15, 70, 2, "干银耳", 25, "g"],
  ["brown-sugar-cake", "红糖发糕", "蓬松柔软，红糖香温暖，早餐也很合适。", "dessert", "粥品甜点", ["甜品", "蒸制"], 50, 25, 3, "中筋面粉", 300, "g"],
  ["mango-sago", "芒果西米露", "果香清新，椰奶顺滑，冰冰凉凉不腻口。", "dessert", "粥品甜点", ["甜品", "夏日"], 10, 20, 2, "芒果", 400, "g"],
  ["black-pepper-beef", "黑椒牛柳", "牛肉滑嫩、黑椒浓郁，彩椒保持爽脆。", "chicken", "家常荤菜", ["下饭菜", "快炒"], 15, 8, 3, "牛里脊", 350, "g"],
  ["braised-pork", "家常红烧肉", "色泽红亮、肥而不腻，慢火收出浓厚酱香。", "chicken", "家常荤菜", ["经典家常", "家庭聚餐"], 15, 70, 3, "五花肉", 600, "g"],
  ["steamed-chicken-mushroom", "香菇蒸鸡", "鸡肉嫩滑、香菇鲜浓，蒸好直接上桌。", "chicken", "家常荤菜", ["蒸菜", "清淡"], 15, 20, 2, "鸡腿肉", 500, "g"],
  ["celery-lily", "西芹百合", "颜色清新，西芹爽脆，百合清甜。", "greens", "时令蔬菜", ["减脂餐", "素食"], 10, 6, 2, "西芹", 300, "g"],
  ["baby-bok-choy-mushroom", "香菇青菜", "青菜翠绿、香菇入味，简单却不寡淡。", "greens", "时令蔬菜", ["素食", "新手友好"], 8, 7, 1, "上海青", 400, "g"],
  ["home-style-tofu", "家常豆腐", "豆腐外香里嫩，彩椒木耳丰富又下饭。", "greens", "家常快炒", ["下饭菜", "半荤素"], 12, 10, 2, "北豆腐", 450, "g"],
  ["steamed-egg", "肉末蒸蛋", "蛋羹细滑无蜂窝，肉末咸香很适合拌饭。", "tomato", "家常快炒", ["老人餐", "新手友好"], 10, 12, 2, "鸡蛋", 3, "个"],
  ["lemon-seabass", "柠檬香煎鲈鱼", "鱼皮焦脆、鱼肉鲜嫩，柠檬带来清爽香气。", "fish", "海鲜", ["减脂餐", "西式家常"], 12, 12, 3, "鲈鱼柳", 400, "g"],
  ["braised-prawn", "油焖大虾", "虾肉弹嫩、酱汁红亮，葱姜香气充分。", "fish", "海鲜", ["下饭菜", "家庭聚餐"], 10, 12, 2, "大虾", 600, "g"],
  ["clams-loofah-soup", "蛤蜊丝瓜汤", "蛤蜊鲜甜，丝瓜柔嫩，汤清而有味。", "soup", "汤羹", ["夏日", "清淡"], 12, 10, 2, "蛤蜊", 500, "g"],
  ["tomato-beef-soup", "番茄牛腩汤", "番茄酸甜浓郁，牛腩炖到轻轻一夹就散。", "soup", "汤羹", ["暖胃", "家庭聚餐"], 18, 90, 3, "牛腩", 600, "g"],
  ["chicken-salad", "香煎鸡胸沙拉", "蛋白质充足、蔬菜清脆，饱腹但不负担。", "greens", "时令蔬菜", ["减脂餐", "高蛋白"], 15, 12, 2, "鸡胸肉", 300, "g"],
  ["oat-banana-pancake", "香蕉燕麦松饼", "不加精制糖，柔软香甜，早餐快速完成。", "dessert", "粥品甜点", ["早餐", "新手友好"], 8, 8, 1, "香蕉", 2, "根"],
  ["yam-pork-porridge", "山药瘦肉粥", "米粥绵软，山药细腻，清淡又有营养。", "soup", "粥品甜点", ["清淡", "老人餐"], 12, 45, 2, "大米", 120, "g"],
  ["rice-cooker-chicken-rice", "电饭煲鸡腿饭", "饭菜一锅出，鸡肉嫩、米饭吸满酱香。", "chicken", "面食主食", ["懒人餐", "一人食"], 15, 35, 2, "鸡腿", 2, "只"],
  ["sesame-cold-noodles", "麻酱凉面", "芝麻酱香浓，黄瓜爽脆，夏天吃格外舒服。", "noodles", "面食主食", ["一人食", "夏日"], 10, 8, 1, "鲜面条", 200, "g"],
  ["red-bean-rice-cake", "红豆糯米糕", "软糯微甜，红豆颗粒带来温柔口感。", "dessert", "粥品甜点", ["甜品", "家庭分享"], 20, 35, 3, "糯米粉", 250, "g"],
];

additionalSeeds.forEach(([slug, title, summary, imageKey, category, tags, prepMinutes, cookMinutes, difficulty, mainName, amount, unit], index) => {
  recipes.push({
    slug, title, summary, image: images[imageKey], category, tags, prepMinutes, cookMinutes, difficulty,
    servings: category === "面食主食" ? 2 : 3,
    likes: 480 - index * 7,
    weeklyLikes: 64 - Math.floor(index / 2),
    color: ["#FFE2D1", "#E9F3E4", "#DFF2F8", "#FBE8B8"][index % 4],
    ingredients: [{ name: mainName, amount, unit, group: "主料" }, ...baseIngredients.slice(1)],
    steps: commonSteps.simple,
    tips: ["下锅前把食材和调料全部称量好，烹饪过程会更从容。", "完成状态比固定时间更重要，请同时观察颜色和质地。"],
  });
});

export const ingredientShortcuts = ["鸡蛋", "番茄", "土豆", "胡萝卜", "青椒", "豆腐", "鸡肉", "面条"];
export const categories = ["全部", "家常快炒", "家常荤菜", "时令蔬菜", "面食主食", "海鲜", "汤羹", "粥品甜点"];
export const getRecipe = (slug: string) => recipes.find((recipe) => recipe.slug === slug);
export const totalMinutes = (recipe: Recipe) => recipe.prepMinutes + recipe.cookMinutes;
