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

export const ingredientShortcuts = ["鸡蛋", "番茄", "土豆", "胡萝卜", "青椒", "豆腐", "鸡肉", "面条"];
export const categories = ["全部", "家常快炒", "家常荤菜", "时令蔬菜", "面食主食", "海鲜", "汤羹", "粥品甜点"];
export const getRecipe = (slug: string) => recipes.find((recipe) => recipe.slug === slug);
export const totalMinutes = (recipe: Recipe) => recipe.prepMinutes + recipe.cookMinutes;
