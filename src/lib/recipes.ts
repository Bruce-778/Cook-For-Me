export type IngredientGroup = "主料" | "辅料" | "调料";
export type Heat = "大火" | "中火" | "小火" | "不适用";
export type WaterTemperature = "冷水" | "温水" | "热水" | "沸水" | "不适用";
export type Ingredient = { name: string; amount: number; unit: string; note?: string; group: IngredientGroup };
export type RecipeStep = {
  title: string; text: string; heat: Heat; waterTemperature: WaterTemperature;
  oilAmountMl?: number; oilTemperature: string; time: string; timerSeconds: number;
  cue: string; ingredients: string[]; ingredientAmounts?: Record<string, number>; safety?: string;
};
export type RecipeSource = { name: string; url: string; type: "guideline" | "article" | "video"; verifiedAt: string };
export type Recipe = {
  slug: string; title: string; summary: string; image: string; category: string; tags: string[]; aliases: string[];
  dietType: "荤" | "素" | "半荤素"; nutritionRoles: Array<"蛋白质" | "蔬菜" | "主食" | "汤羹" | "甜点">;
  cookingMethod: string; spiceLevel: 0 | 1 | 2 | 3; allergens: string[]; babyAge?: { min: number; max: number; texture: string };
  difficulty: 1 | 2 | 3 | 4 | 5; prepMinutes: number; activeMinutes: number; waitMinutes: number; cookMinutes: number; servings: number;
  likes: number; weeklyLikes: number; ingredients: Ingredient[]; steps: RecipeStep[]; tips: string[]; failurePoints: string[]; safetyNote: string;
  editorialStatus: "reviewed" | "draft"; reviewedAt?: string; imageVerified: boolean;
  bilibiliVideoUrl?: string; bilibiliSearchUrl: string; videoTitle?: string; videoCreator?: string; videoVerifiedAt?: string; sources: RecipeSource[];
};

type Method = "快炒" | "红烧" | "清蒸" | "水煮" | "炖汤" | "煎制" | "面食" | "蒸点" | "甜品" | "辅食" | "凉拌";
type Food = [name: string, amount: number, unit: string, note?: string];
type Spec = { slug: string; title: string; category: string; method: Method; primary: Food; extras?: Food[]; prep: number; active: number; wait: number; servings: number; spice?: 0 | 1 | 2 | 3; tags?: string[]; baby?: [number, number, string] };

const CATALOG: Spec[] = [
  { slug:"tomato-scrambled-eggs",title:"番茄炒蛋",category:"荤菜",method:"快炒",primary:["番茄",400,"g","去蒂切 2cm 块"],extras:[["鸡蛋",3,"个","打散约 150g"],["清水",10,"ml","加入蛋液，使成品更嫩"]],prep:3,active:5,wait:0,servings:2,tags:["新手推荐","减脂餐"] },
  { slug:"cola-chicken-wings",title:"可乐鸡翅",category:"荤菜",method:"红烧",primary:["鸡中翅",500,"g","约 10 只，两面划刀"],extras:[["无糖可乐",330,"ml"]],prep:10,active:12,wait:18,servings:3,tags:["新手推荐"] },
  { slug:"pan-fried-chicken-wings",title:"香煎鸡翅",category:"荤菜",method:"煎制",primary:["鸡中翅",500,"g","约 10 只，擦干水分"],prep:10,active:18,wait:0,servings:3,tags:["新手推荐"] },
  { slug:"braised-pork",title:"红烧肉",category:"荤菜",method:"红烧",primary:["带皮五花肉",600,"g","切 3cm 方块"],extras:[["冰糖",20,"g"]],prep:15,active:20,wait:55,servings:4 },
  { slug:"pepper-pork",title:"青椒肉丝",category:"荤菜",method:"快炒",primary:["猪里脊",300,"g","逆纹切 4mm 丝"],extras:[["青椒",250,"g","去籽切丝"]],prep:12,active:7,wait:0,servings:3,tags:["新手推荐"] },
  { slug:"fish-fragrant-pork",title:"鱼香肉丝",category:"荤菜",method:"快炒",primary:["猪里脊",300,"g","切细丝"],extras:[["水发木耳",80,"g","切丝"],["胡萝卜",100,"g","切丝"]],prep:18,active:8,wait:0,servings:3,spice:2 },
  { slug:"sweet-sour-pork",title:"糖醋里脊",category:"荤菜",method:"煎制",primary:["猪里脊",400,"g","切 1.5cm 条"],extras:[["玉米淀粉",60,"g"],["番茄酱",45,"g"],["清水",30,"ml","调糖醋汁"]],prep:18,active:18,wait:0,servings:4 },
  { slug:"kung-pao-chicken",title:"宫保鸡丁",category:"荤菜",method:"快炒",primary:["去皮鸡腿肉",400,"g","切 1.5cm 丁"],extras:[["熟花生米",60,"g"],["干辣椒",8,"g","剪段"]],prep:18,active:9,wait:0,servings:4,spice:2 },
  { slug:"potato-beef",title:"土豆炖牛腩",category:"荤菜",method:"红烧",primary:["牛腩",600,"g","切 3cm 块"],extras:[["土豆",500,"g","切滚刀块"]],prep:18,active:18,wait:75,servings:5,tags:["老人友好"] },
  { slug:"black-pepper-beef",title:"黑椒牛柳",category:"荤菜",method:"快炒",primary:["牛里脊",350,"g","逆纹切 5mm 条"],extras:[["彩椒",250,"g","切条"],["黑胡椒碎",3,"g"]],prep:15,active:8,wait:0,servings:3 },
  { slug:"steamed-chicken-mushroom",title:"香菇蒸鸡",category:"荤菜",method:"清蒸",primary:["去骨鸡腿肉",500,"g","切 3cm 块"],extras:[["鲜香菇",180,"g","切厚片"]],prep:15,active:8,wait:20,servings:4,tags:["老人友好","清淡恢复"] },
  { slug:"yellow-braised-chicken",title:"黄焖鸡",category:"荤菜",method:"红烧",primary:["鸡腿",700,"g","剁 4cm 块"],extras:[["鲜香菇",180,"g"],["青椒",150,"g"]],prep:18,active:15,wait:25,servings:4 },
  { slug:"beijing-sauce-pork",title:"京酱肉丝",category:"荤菜",method:"快炒",primary:["猪里脊",350,"g","切细丝"],extras:[["甜面酱",35,"g"],["大葱白",100,"g","切丝"]],prep:18,active:8,wait:0,servings:4 },
  { slug:"minced-pork-steamed-egg",title:"肉末蒸蛋",category:"荤菜",method:"清蒸",primary:["鸡蛋",3,"个","约 150g"],extras:[["猪肉末",100,"g"],["温水",225,"ml","约蛋液 1.5 倍"]],prep:10,active:7,wait:12,servings:3,tags:["老人友好","新手推荐","清淡恢复"] },
  { slug:"moo-shu-pork",title:"木须肉",category:"荤菜",method:"快炒",primary:["猪里脊",250,"g","切薄片"],extras:[["鸡蛋",2,"个"],["水发木耳",100,"g"],["黄瓜",150,"g"]],prep:15,active:9,wait:0,servings:4 },
  { slug:"garlic-sprout-pork",title:"蒜薹炒肉",category:"荤菜",method:"快炒",primary:["猪里脊",280,"g","切条"],extras:[["蒜薹",350,"g","切 4cm 段"]],prep:12,active:8,wait:0,servings:3,tags:["新手推荐"] },
  { slug:"braised-pork-ribs",title:"红烧排骨",category:"荤菜",method:"红烧",primary:["猪肋排",700,"g","剁 4cm 段"],extras:[["冰糖",18,"g"]],prep:18,active:18,wait:45,servings:5 },
  { slug:"radish-lamb-stew",title:"白萝卜炖羊肉",category:"荤菜",method:"炖汤",primary:["羊腿肉",600,"g","切 3cm 块"],extras:[["白萝卜",600,"g","切滚刀块"]],prep:20,active:15,wait:65,servings:5,tags:["老人友好"] },
  { slug:"steamed-fish",title:"清蒸鲈鱼",category:"海鲜",method:"清蒸",primary:["鲜鲈鱼",600,"g","去鳞去鳃去内脏"],extras:[["姜",20,"g","切丝"],["大葱",30,"g","切丝"]],prep:12,active:8,wait:8,servings:3,tags:["减脂餐","老人友好","新手推荐","清淡恢复"] },
  { slug:"boiled-shrimp",title:"白灼虾",category:"海鲜",method:"水煮",primary:["活虾",500,"g","剪须去虾线"],extras:[["姜",15,"g","切片"]],prep:5,active:4,wait:0,servings:3,tags:["减脂餐","新手推荐"] },
  { slug:"garlic-scallops",title:"蒜蓉粉丝蒸扇贝",category:"海鲜",method:"清蒸",primary:["鲜扇贝",8,"个","刷净外壳"],extras:[["绿豆粉丝",80,"g","温水泡软"],["蒜",35,"g","切末"]],prep:20,active:10,wait:8,servings:4 },
  { slug:"braised-prawn",title:"油焖大虾",category:"海鲜",method:"红烧",primary:["大虾",600,"g","剪须开背去虾线"],extras:[["番茄酱",20,"g"]],prep:12,active:12,wait:0,servings:4 },
  { slug:"clams-loofah-soup",title:"蛤蜊丝瓜汤",category:"海鲜",method:"炖汤",primary:["蛤蜊",500,"g","吐沙洗净"],extras:[["丝瓜",350,"g","去棱切滚刀块"]],prep:15,active:10,wait:5,servings:4,tags:["清淡恢复","减脂餐"] },
  { slug:"braised-hairtail",title:"红烧带鱼",category:"海鲜",method:"红烧",primary:["带鱼段",600,"g","洗净擦干"],extras:[["玉米淀粉",25,"g"]],prep:15,active:18,wait:12,servings:4 },
  { slug:"ginger-scallion-crab",title:"葱姜炒蟹",category:"海鲜",method:"快炒",primary:["梭子蟹",800,"g","刷洗后斩件"],extras:[["大葱",60,"g"],["姜",35,"g"]],prep:22,active:12,wait:0,servings:4 },
  { slug:"clam-steamed-egg",title:"蛤蜊蒸蛋",category:"海鲜",method:"清蒸",primary:["蛤蜊",300,"g","吐沙洗净"],extras:[["鸡蛋",3,"个"],["温水",240,"ml"]],prep:15,active:8,wait:10,servings:3,tags:["老人友好","清淡恢复"] },
  { slug:"celery-squid",title:"芹菜炒鱿鱼",category:"海鲜",method:"快炒",primary:["鲜鱿鱼",400,"g","去膜切花刀"],extras:[["西芹",250,"g","斜切片"]],prep:18,active:7,wait:0,servings:3,tags:["减脂餐"] },
  { slug:"crucian-tofu-soup",title:"鲫鱼豆腐汤",category:"海鲜",method:"炖汤",primary:["鲫鱼",500,"g","处理干净并擦干"],extras:[["嫩豆腐",300,"g","切 3cm 块"]],prep:15,active:15,wait:25,servings:4,tags:["老人友好"] },
  { slug:"steamed-cod",title:"清蒸鳕鱼",category:"海鲜",method:"清蒸",primary:["鳕鱼块",400,"g","冷藏解冻并擦干"],extras:[["姜",15,"g"]],prep:10,active:6,wait:8,servings:3,tags:["减脂餐","老人友好","清淡恢复","新手推荐"] },
  { slug:"garlic-oysters",title:"蒜蓉蒸生蚝",category:"海鲜",method:"清蒸",primary:["带壳生蚝",8,"个","刷净撬开"],extras:[["蒜",40,"g","切末"]],prep:20,active:10,wait:7,servings:4 },
  { slug:"garlic-broccoli",title:"蒜蓉西兰花",category:"蔬菜",method:"快炒",primary:["西兰花",400,"g","切小朵"],extras:[["蒜",15,"g","切末"]],prep:8,active:6,wait:0,servings:3,tags:["减脂餐","新手推荐","清淡恢复"] },
  { slug:"shredded-potato",title:"酸辣土豆丝",category:"蔬菜",method:"快炒",primary:["土豆",450,"g","切 2mm 丝并冲洗淀粉"],extras:[["米醋",15,"ml"],["干辣椒",3,"g"]],prep:12,active:6,wait:0,servings:3,spice:1,tags:["新手推荐"] },
  { slug:"hand-torn-cabbage",title:"手撕包菜",category:"蔬菜",method:"快炒",primary:["包菜",500,"g","手撕 5cm 片并擦干"],extras:[["干辣椒",4,"g"]],prep:8,active:7,wait:0,servings:3,spice:1 },
  { slug:"celery-lily",title:"西芹百合",category:"蔬菜",method:"快炒",primary:["西芹",320,"g","斜切 5mm 片"],extras:[["鲜百合",150,"g","掰瓣洗净"]],prep:12,active:6,wait:0,servings:3,tags:["减脂餐","老人友好","清淡恢复"] },
  { slug:"baby-bok-choy-mushroom",title:"香菇青菜",category:"蔬菜",method:"快炒",primary:["上海青",400,"g","掰开洗净"],extras:[["鲜香菇",180,"g","切片"]],prep:10,active:7,wait:0,servings:3,tags:["减脂餐","新手推荐"] },
  { slug:"home-style-tofu",title:"家常豆腐",category:"蔬菜",method:"红烧",primary:["北豆腐",450,"g","切 1cm 厚片"],extras:[["青椒",120,"g"],["水发木耳",80,"g"]],prep:15,active:14,wait:5,servings:4,spice:1 },
  { slug:"mapo-tofu",title:"麻婆豆腐",category:"蔬菜",method:"红烧",primary:["嫩豆腐",450,"g","切 2cm 块"],extras:[["牛肉末",100,"g"],["郫县豆瓣酱",20,"g"]],prep:12,active:12,wait:5,servings:4,spice:3 },
  { slug:"braised-eggplant",title:"红烧茄子",category:"蔬菜",method:"红烧",primary:["长茄子",500,"g","切滚刀块"],extras:[["青椒",100,"g"]],prep:12,active:15,wait:5,servings:3 },
  { slug:"dry-fried-green-beans",title:"干煸四季豆",category:"蔬菜",method:"快炒",primary:["四季豆",500,"g","去筋掰 6cm 段"],extras:[["猪肉末",80,"g"],["干辣椒",6,"g"]],prep:12,active:16,wait:0,servings:4,spice:2 },
  { slug:"tomato-zucchini",title:"番茄炒西葫芦",category:"蔬菜",method:"快炒",primary:["西葫芦",400,"g","切 4mm 半圆片"],extras:[["番茄",250,"g","切块"]],prep:8,active:7,wait:0,servings:3,tags:["减脂餐","新手推荐","清淡恢复"] },
  { slug:"garlic-spinach",title:"蒜蓉菠菜",category:"蔬菜",method:"快炒",primary:["菠菜",450,"g","去根洗净"],extras:[["蒜",15,"g","切末"]],prep:3,active:3,wait:0,servings:3,tags:["减脂餐","新手推荐"] },
  { slug:"oyster-mushroom",title:"蚝油杏鲍菇",category:"蔬菜",method:"煎制",primary:["杏鲍菇",450,"g","切 5mm 片"],extras:[["蚝油",15,"ml"]],prep:8,active:10,wait:0,servings:3,tags:["新手推荐","减脂餐"] },
  { slug:"cabbage-tofu-pot",title:"白菜豆腐煲",category:"蔬菜",method:"炖汤",primary:["大白菜",500,"g","切 5cm 段"],extras:[["北豆腐",350,"g","切块"],["干香菇",20,"g","泡发"]],prep:12,active:10,wait:18,servings:4,tags:["老人友好","清淡恢复"] },
  { slug:"cucumber-salad",title:"凉拌黄瓜",category:"蔬菜",method:"凉拌",primary:["黄瓜",500,"g","拍裂切段"],extras:[["米醋",15,"ml"],["蒜",12,"g","切末"]],prep:10,active:3,wait:10,servings:3,tags:["减脂餐","新手推荐"] },
  { slug:"scallion-oil-noodles",title:"葱油拌面",category:"面食",method:"面食",primary:["鲜面条",300,"g"],extras:[["小葱",60,"g","切 5cm 段"]],prep:8,active:12,wait:0,servings:2,tags:["新手推荐"] },
  { slug:"homemade-dumplings",title:"家常猪肉饺子",category:"面食",method:"面食",primary:["饺子皮",40,"张"],extras:[["猪肉馅",450,"g"],["白菜",300,"g","切碎挤水"]],prep:40,active:18,wait:0,servings:5 },
  { slug:"yangchun-noodles",title:"阳春面",category:"面食",method:"面食",primary:["细面",300,"g"],extras:[["小葱",15,"g"]],prep:5,active:8,wait:0,servings:2,tags:["新手推荐","清淡恢复"] },
  { slug:"egg-fried-rice",title:"黄金蛋炒饭",category:"面食",method:"快炒",primary:["冷米饭",400,"g","提前打散"],extras:[["鸡蛋",3,"个"],["胡萝卜",60,"g","切小丁"]],prep:8,active:8,wait:0,servings:2,tags:["新手推荐"] },
  { slug:"beef-noodle-soup",title:"家常牛肉面",category:"面食",method:"面食",primary:["鲜面条",400,"g"],extras:[["牛腩",500,"g","切块"],["白萝卜",300,"g"]],prep:20,active:20,wait:75,servings:4 },
  { slug:"rice-cooker-chicken-rice",title:"电饭煲鸡腿饭",category:"面食",method:"红烧",primary:["大米",300,"g","淘洗沥水"],extras:[["去骨鸡腿肉",400,"g","切块"],["胡萝卜",120,"g"]],prep:15,active:10,wait:30,servings:3,tags:["新手推荐"] },
  { slug:"sesame-cold-noodles",title:"麻酱凉面",category:"面食",method:"面食",primary:["鲜面条",300,"g"],extras:[["黄瓜",150,"g","切丝"],["芝麻酱",35,"g"]],prep:10,active:10,wait:0,servings:2,tags:["新手推荐"] },
  { slug:"tomato-egg-noodles",title:"番茄鸡蛋面",category:"面食",method:"面食",primary:["鲜面条",300,"g"],extras:[["番茄",350,"g"],["鸡蛋",2,"个"]],prep:8,active:12,wait:0,servings:2,tags:["新手推荐","老人友好","清淡恢复"] },
  { slug:"pork-wontons",title:"鲜肉小馄饨",category:"面食",method:"面食",primary:["馄饨皮",40,"张"],extras:[["猪肉馅",300,"g"]],prep:30,active:10,wait:0,servings:4 },
  { slug:"zhajiang-noodles",title:"炸酱面",category:"面食",method:"面食",primary:["鲜面条",400,"g"],extras:[["猪肉末",250,"g"],["黄豆酱",45,"g"],["黄瓜",150,"g"]],prep:15,active:15,wait:0,servings:4 },
  { slug:"bean-braised-noodles",title:"豆角焖面",category:"面食",method:"红烧",primary:["鲜面条",400,"g"],extras:[["四季豆",350,"g","去筋掰段"],["五花肉",180,"g","切片"]],prep:15,active:15,wait:12,servings:4 },
  { slug:"scallion-pancake",title:"葱油饼",category:"面食",method:"煎制",primary:["中筋面粉",300,"g"],extras:[["温水",180,"ml"],["小葱",50,"g"]],prep:25,active:15,wait:20,servings:4 },
  { slug:"steamed-buns",title:"家常馒头",category:"面食",method:"蒸点",primary:["中筋面粉",500,"g"],extras:[["温水",260,"ml"],["干酵母",5,"g"]],prep:25,active:15,wait:70,servings:6 },
  { slug:"baby-pumpkin-buns",title:"无糖南瓜小馒头",category:"面食",method:"辅食",primary:["中筋面粉",250,"g"],extras:[["南瓜泥",160,"g"],["干酵母",3,"g"]],prep:25,active:15,wait:60,servings:4,tags:["宝宝辅食"],baby:[12,24,"柔软小块，掰成约 1cm 后由成人看护进食"] },
  { slug:"winter-melon-soup",title:"冬瓜排骨汤",category:"汤粥",method:"炖汤",primary:["猪肋排",500,"g","剁段"],extras:[["冬瓜",600,"g","去皮切块"]],prep:15,active:12,wait:55,servings:5,tags:["老人友好","清淡恢复"] },
  { slug:"seaweed-egg-soup",title:"紫菜蛋花汤",category:"汤粥",method:"炖汤",primary:["鸡蛋",2,"个","打散"],extras:[["干紫菜",8,"g","撕小片"]],prep:2,active:5,wait:0,servings:3,tags:["新手推荐","清淡恢复"] },
  { slug:"corn-rib-soup",title:"玉米排骨汤",category:"汤粥",method:"炖汤",primary:["猪肋排",500,"g"],extras:[["甜玉米",350,"g","切段"],["胡萝卜",180,"g"]],prep:15,active:12,wait:60,servings:5,tags:["老人友好","清淡恢复"] },
  { slug:"tomato-beef-soup",title:"番茄牛腩汤",category:"汤粥",method:"炖汤",primary:["牛腩",600,"g","切块"],extras:[["番茄",600,"g","切块"]],prep:18,active:18,wait:75,servings:5,tags:["老人友好"] },
  { slug:"pumpkin-millet-porridge",title:"南瓜小米粥",category:"汤粥",method:"炖汤",primary:["小米",100,"g","淘洗"],extras:[["南瓜",300,"g","切块"]],prep:6,active:7,wait:30,servings:3,tags:["老人友好","清淡恢复","新手推荐"] },
  { slug:"yam-pork-porridge",title:"山药瘦肉粥",category:"汤粥",method:"炖汤",primary:["大米",120,"g","淘洗"],extras:[["山药",250,"g","切小块"],["猪里脊",120,"g","切末"]],prep:12,active:10,wait:40,servings:3,tags:["老人友好","清淡恢复"] },
  { slug:"lotus-rib-soup",title:"莲藕排骨汤",category:"汤粥",method:"炖汤",primary:["猪肋排",500,"g"],extras:[["粉藕",500,"g","切块"]],prep:18,active:12,wait:70,servings:5,tags:["老人友好"] },
  { slug:"mushroom-chicken-soup",title:"香菇鸡汤",category:"汤粥",method:"炖汤",primary:["鸡腿",600,"g","剁块"],extras:[["干香菇",30,"g","泡发"]],prep:15,active:12,wait:55,servings:5,tags:["老人友好","清淡恢复"] },
  { slug:"tomato-tofu-soup",title:"番茄豆腐汤",category:"汤粥",method:"炖汤",primary:["番茄",400,"g","切块"],extras:[["嫩豆腐",300,"g","切块"]],prep:8,active:10,wait:5,servings:3,tags:["减脂餐","新手推荐","清淡恢复"] },
  { slug:"baby-pumpkin-cereal",title:"南瓜米糊",category:"汤粥",method:"辅食",primary:["婴儿米粉",20,"g"],extras:[["南瓜",40,"g","去皮切片"],["温开水",80,"ml"]],prep:5,active:8,wait:0,servings:1,tags:["宝宝辅食"],baby:[6,8,"顺滑泥糊，从勺上缓慢滴落，无颗粒"] },
  { slug:"baby-broccoli-chicken-porridge",title:"西兰花鸡肉粥",category:"汤粥",method:"辅食",primary:["大米",25,"g","浸泡 20 分钟"],extras:[["鸡胸肉",20,"g","剁成细泥"],["西兰花",20,"g","只取花冠切末"],["清水",250,"ml"]],prep:10,active:12,wait:30,servings:1,tags:["宝宝辅食"],baby:[9,11,"稠粥带 2–3mm 软碎末，可用舌头压碎"] },
  { slug:"baby-salmon-soft-rice",title:"三文鱼蔬菜软饭",category:"汤粥",method:"辅食",primary:["熟软米饭",70,"g"],extras:[["三文鱼",25,"g","仔细去刺切碎"],["胡萝卜",20,"g","切 3mm 丁"],["清水",100,"ml"]],prep:12,active:12,wait:8,servings:1,tags:["宝宝辅食"],baby:[12,24,"湿润软饭，颗粒不超过 5mm，鱼肉逐片检查鱼刺"] },
  { slug:"silver-ear-soup",title:"银耳莲子羹",category:"甜点",method:"甜品",primary:["干银耳",25,"g","冷水泡发去根撕小朵"],extras:[["干莲子",50,"g","去莲心"],["冰糖",30,"g"]],prep:15,active:8,wait:65,servings:5,tags:["老人友好"] },
  { slug:"brown-sugar-cake",title:"红糖发糕",category:"甜点",method:"蒸点",primary:["中筋面粉",300,"g"],extras:[["红糖",70,"g"],["温水",210,"ml"],["干酵母",3,"g"]],prep:15,active:12,wait:60,servings:6 },
  { slug:"mango-sago",title:"芒果西米露",category:"甜点",method:"甜品",primary:["小西米",100,"g"],extras:[["芒果肉",350,"g"],["椰奶",300,"ml"]],prep:10,active:20,wait:20,servings:4 },
  { slug:"oat-banana-pancake",title:"香蕉燕麦松饼",category:"甜点",method:"煎制",primary:["熟香蕉",200,"g","压泥"],extras:[["即食燕麦片",100,"g"],["鸡蛋",2,"个"]],prep:8,active:12,wait:0,servings:3,tags:["减脂餐","新手推荐","宝宝辅食"],baby:[12,24,"切成约 1cm 的柔软小条，可用牙龈压碎"] },
  { slug:"red-bean-rice-cake",title:"红豆糯米糕",category:"甜点",method:"蒸点",primary:["糯米粉",250,"g"],extras:[["熟红豆",180,"g"],["温水",210,"ml"],["白糖",35,"g"]],prep:15,active:10,wait:35,servings:6 },
  { slug:"double-skin-milk",title:"双皮奶",category:"甜点",method:"清蒸",primary:["全脂牛奶",500,"ml"],extras:[["蛋清",90,"g","约 3 个"],["白糖",35,"g"]],prep:15,active:12,wait:25,servings:4 },
  { slug:"pear-tremella",title:"雪梨银耳羹",category:"甜点",method:"甜品",primary:["雪梨",500,"g","去核切块"],extras:[["干银耳",20,"g","泡发撕小朵"],["冰糖",20,"g"]],prep:15,active:8,wait:55,servings:4,tags:["老人友好","清淡恢复"] },
  { slug:"baby-yam-blueberry",title:"山药蓝莓泥",category:"甜点",method:"辅食",primary:["铁棍山药",80,"g","去皮切片"],extras:[["蓝莓",20,"g","洗净加热压泥"],["温开水",20,"ml"]],prep:8,active:10,wait:12,servings:1,tags:["宝宝辅食"],baby:[9,11,"细腻厚泥，可保留极软的 2mm 小颗粒"] },
  { slug:"baby-carrot-potato-mash",title:"胡萝卜土豆泥",category:"甜点",method:"辅食",primary:["土豆",50,"g","去皮切薄片"],extras:[["胡萝卜",25,"g","去皮切薄片"],["温开水",30,"ml"]],prep:6,active:8,wait:15,servings:1,tags:["宝宝辅食"],baby:[6,8,"完全压成顺滑泥糊，不留纤维硬块"] },
  { slug:"baby-shrimp-tofu-egg",title:"虾仁豆腐蒸蛋",category:"甜点",method:"辅食",primary:["鸡蛋",1,"个","约 50g"],extras:[["鲜虾仁",15,"g","去虾线剁泥"],["嫩豆腐",30,"g","压碎"],["温水",75,"ml"]],prep:10,active:8,wait:10,servings:1,tags:["宝宝辅食"],baby:[12,24,"柔软蛋羹，虾仁剁至 3mm 以下；首次引入虾时单独观察"] },
];

const GUIDELINE: RecipeSource = { name:"中国居民膳食指南（2022）",url:"https://dg.cnsoc.org/",type:"guideline",verifiedAt:"2026-07-15" };
const INFANT_GUIDELINE: RecipeSource = { name:"WS/T 678—2020 婴幼儿辅食添加营养指南",url:"https://www.nhc.gov.cn/wjw/yingyang/202005/f3a01a3cfb5646e2a3fe33544e407a61.shtml",type:"guideline",verifiedAt:"2026-07-15" };
const IMAGE_BY_CATEGORY: Record<string,string> = {
  "荤菜":"https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1400&q=85",
  "海鲜":"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=85",
  "蔬菜":"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85",
  "面食":"https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1400&q=85",
  "汤粥":"https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=85",
  "甜点":"https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=1400&q=85",
};

// 这里只收录会明显改变成菜风味或工艺的专属调味，不能再由“快炒/红烧”默认值猜测。
// 审核人员仍需逐道确认这些总量在各步骤中的分配方式。
const FLAVORINGS_BY_SLUG: Record<string, Food[]> = {
  "tomato-scrambled-eggs":[["白糖",4,"g","番茄偏酸时用于平衡酸味"]],
  "cola-chicken-wings":[["姜",15,"g","切片"],["料酒",15,"ml"],["生抽",20,"ml"],["老抽",5,"ml"]],
  "pan-fried-chicken-wings":[["姜",10,"g","切丝"],["料酒",10,"ml"],["白胡椒粉",1,"g"]],
  "braised-pork":[["冰糖",20,"g"],["料酒",25,"ml"],["生抽",25,"ml"],["老抽",8,"ml"],["姜",15,"g"],["八角",2,"个"]],
  "pepper-pork":[["玉米淀粉",8,"g"],["料酒",10,"ml"],["生抽",15,"ml"],["白糖",2,"g"]],
  "fish-fragrant-pork":[["郫县豆瓣酱",18,"g"],["生抽",15,"ml"],["香醋",20,"ml"],["白糖",18,"g"],["玉米淀粉",10,"g"],["料酒",10,"ml"],["蒜",12,"g"],["姜",8,"g"]],
  "sweet-sour-pork":[["白糖",25,"g"],["香醋",25,"ml"],["生抽",10,"ml"]],
  "kung-pao-chicken":[["香醋",18,"ml"],["白糖",15,"g"],["生抽",15,"ml"],["料酒",10,"ml"],["玉米淀粉",10,"g"],["花椒",2,"g"],["姜",8,"g"],["蒜",10,"g"]],
  "potato-beef":[["生抽",25,"ml"],["老抽",6,"ml"],["料酒",20,"ml"],["冰糖",10,"g"],["姜",15,"g"],["八角",2,"个"]],
  "black-pepper-beef":[["黑胡椒碎",4,"g"],["蚝油",15,"ml"],["生抽",12,"ml"],["料酒",10,"ml"],["玉米淀粉",8,"g"],["白糖",3,"g"]],
  "yellow-braised-chicken":[["黄豆酱",20,"g"],["生抽",25,"ml"],["老抽",6,"ml"],["料酒",20,"ml"],["冰糖",8,"g"],["姜",15,"g"]],
  "beijing-sauce-pork":[["甜面酱",40,"g"],["白糖",8,"g"],["料酒",10,"ml"],["玉米淀粉",8,"g"],["生抽",8,"ml"]],
  "braised-pork-ribs":[["冰糖",18,"g"],["生抽",25,"ml"],["老抽",6,"ml"],["料酒",20,"ml"],["姜",15,"g"],["八角",2,"个"]],
  "braised-prawn":[["白糖",8,"g"],["料酒",15,"ml"],["生抽",15,"ml"],["姜",12,"g"],["大葱",20,"g"]],
  "braised-hairtail":[["香醋",12,"ml"],["白糖",8,"g"],["料酒",20,"ml"],["生抽",20,"ml"],["老抽",4,"ml"],["姜",15,"g"]],
  "ginger-scallion-crab":[["料酒",20,"ml"],["生抽",12,"ml"],["玉米淀粉",25,"g"],["白糖",3,"g"]],
  "shredded-potato":[["米醋",20,"ml"],["白糖",3,"g"],["干辣椒",3,"g"],["蒜",10,"g"]],
  "hand-torn-cabbage":[["香醋",12,"ml"],["生抽",12,"ml"],["白糖",4,"g"],["干辣椒",4,"g"],["蒜",10,"g"]],
  "home-style-tofu":[["郫县豆瓣酱",15,"g"],["生抽",15,"ml"],["白糖",4,"g"],["玉米淀粉",8,"g"],["蒜",10,"g"]],
  "mapo-tofu":[["郫县豆瓣酱",20,"g"],["豆豉",8,"g"],["花椒粉",2,"g"],["辣椒粉",3,"g"],["生抽",10,"ml"],["玉米淀粉",8,"g"],["蒜",10,"g"]],
  "braised-eggplant":[["生抽",15,"ml"],["香醋",10,"ml"],["白糖",8,"g"],["玉米淀粉",8,"g"],["蒜",12,"g"]],
  "dry-fried-green-beans":[["芽菜",20,"g"],["干辣椒",6,"g"],["花椒",2,"g"],["生抽",10,"ml"],["蒜",10,"g"]],
  "cucumber-salad":[["米醋",20,"ml"],["生抽",10,"ml"],["白糖",4,"g"],["蒜",12,"g"],["芝麻油",5,"ml"]],
  "scallion-oil-noodles":[["生抽",20,"ml"],["老抽",8,"ml"],["白糖",10,"g"],["食用油",35,"ml"]],
  "zhajiang-noodles":[["黄豆酱",45,"g"],["甜面酱",25,"g"],["白糖",5,"g"],["料酒",10,"ml"],["食用油",20,"ml"]],
};

const REVIEWED_SLUGS = new Set(["tomato-scrambled-eggs"]);
const REVIEWED_SOURCES: Record<string, RecipeSource[]> = {
  "tomato-scrambled-eggs":[
    {name:"萬字酱油：番茄炒蛋",url:"https://www.kikkoman.com.cn/prd_info.php?id=51",type:"article",verifiedAt:"2026-07-16"},
    {name:"Second Harvest Food Bank：Tomato Egg Stir Fry",url:"https://www.shfb.org/wp-content/uploads/2020/11/RecipeCard-8.5x11-TomatoEggStirfry-_final-for-Nutrition-Center.pdf",type:"article",verifiedAt:"2026-07-16"},
  ],
};

function allergenFor(name: string) { return [["鸡蛋","蛋"],["蛋清","蛋"],["牛奶","奶"],["面粉","麸质"],["面条","麸质"],["馒头","麸质"],["虾","甲壳类"],["蟹","甲壳类"],["鱼","鱼类"],["鳕鱼","鱼类"],["三文鱼","鱼类"],["豆腐","大豆"],["花生","花生"],["扇贝","贝类"],["蛤蜊","贝类"],["生蚝","贝类"]] .filter(([key]) => name.includes(key)).map(([,value]) => value); }

function seasonings(spec: Spec): Ingredient[] {
  const tailored = (FLAVORINGS_BY_SLUG[spec.slug] ?? []).map(([name,amount,unit,note]): Ingredient => ({name,amount,unit,note,group:"调料"}));
  const merge = (defaults: Ingredient[]) => {
    const tailoredNames = new Set(tailored.map((item) => item.name));
    return [...defaults.filter((item) => !tailoredNames.has(item.name)), ...tailored];
  };
  if (spec.method === "辅食" || spec.baby) return [];
  if (spec.method === "蒸点") return merge([]);
  if (spec.method === "甜品") return merge([{name:"清水",amount:1200,unit:"ml",note:"用于煮制",group:"辅料"}]);
  if (spec.method === "凉拌") return merge([{name:"食盐",amount:2,unit:"g",note:"约 1/3 平茶匙",group:"调料"},{name:"芝麻油",amount:5,unit:"ml",note:"约 1 平茶匙",group:"调料"}]);
  const items: Ingredient[] = [{name:"食盐",amount:2,unit:"g",note:"约 1/3 平茶匙",group:"调料"}];
  if (["快炒","煎制","红烧"].includes(spec.method)) items.push({name:"食用油",amount:15,unit:"ml",note:"约 1 汤匙",group:"调料"});
  if (["快炒","煎制","红烧","面食"].includes(spec.method)) items.push({name:"生抽",amount:10,unit:"ml",note:"约 2 平茶匙",group:"调料"});
  if (["红烧","炖汤"].includes(spec.method)) items.push({name:"清水",amount:spec.method === "炖汤" ? 1200 : 600,unit:"ml",note:spec.method === "炖汤" ? "一次加足" : "热水",group:"辅料"});
  if (spec.method === "水煮") items.push({name:"清水",amount:1200,unit:"ml",note:"一次加足，烧至沸腾",group:"辅料"});
  return merge(items);
}

function makeIngredients(spec: Spec): Ingredient[] {
  const foods = [spec.primary, ...(spec.extras ?? [])].map(([name,amount,unit,note],index): Ingredient => ({name,amount,unit,note,group:index === 0 ? "主料" : "辅料"}));
  const existing = new Set(foods.map((item) => item.name));
  return [...foods, ...seasonings(spec).filter((item) => !existing.has(item.name))];
}

function makeSteps(spec: Spec, ingredients: Ingredient[]): RecipeStep[] {
  const main = spec.primary[0]; const second = spec.extras?.[0]?.[0]; const names = ingredients.map((item) => item.name);
  const step = (title:string,text:string,heat:Heat,waterTemperature:WaterTemperature,oilTemperature:string,time:string,timerSeconds:number,cue:string,used:string[],safety?:string,ingredientAmounts?:Record<string,number>): RecipeStep => {
    const oilAmount = text.match(/(?:食用)?油\s*(\d+)\s*ml/i)?.[1];
    return {title,text,heat,waterTemperature,oilAmountMl:oilTemperature!=="不适用" ? Number(oilAmount ?? 15) : undefined,oilTemperature,time,timerSeconds,cue,ingredients:used.filter((name) => names.includes(name)),ingredientAmounts,safety};
  };
  if (spec.slug === "tomato-scrambled-eggs") return [
    step("处理番茄和鸡蛋","番茄顶部划十字，用沸水烫 30 秒后去皮，切成约 2cm 块。鸡蛋加入食盐 0.5g 和清水 10ml，充分打散。","不适用","沸水","不适用","3 分钟",180,"蛋液颜色均匀，番茄块大小接近。",["鸡蛋","食盐","清水"],undefined,{鸡蛋:3,食盐:0.5,清水:10}),
    step("炒到鸡蛋八成熟","炒锅中火预热 40 秒，倒入食用油 10ml。油面出现细小波纹后倒入蛋液，用锅铲从边缘向中间推动。","中火","不适用","油面出现细小波纹，不冒烟","45 秒",45,"鸡蛋约八成熟，表面仍有少量湿润光泽。",["食用油"],undefined,{食用油:10}),
    step("立即盛出鸡蛋","鸡蛋刚凝固成大块时立即盛到干净盘中，不要留在热锅里继续加热。","不适用","不适用","不适用","20 秒",20,"鸡蛋柔软成块，没有焦边。",[]),
    step("炒出番茄汤汁","原锅加入食用油 5ml，放入番茄、剩余食盐 1.5g 和白糖 4g，中火翻炒并用锅铲轻压 2 分钟。","中火","不适用","油可流动铺开","2 分钟",120,"番茄变软，锅底出现鲜红汤汁；尝味应酸甜平衡而不是明显发甜。",["番茄","食用油","食盐","白糖"],undefined,{番茄:400,食用油:5,食盐:1.5,白糖:4}),
    step("鸡蛋回锅合炒","倒回鸡蛋，沿锅边加入生抽 10ml，大火快速翻炒 30 秒，让汤汁裹住鸡蛋。","大火","不适用","不适用","30 秒",30,"番茄汁均匀附着鸡蛋，锅中仍保留少量汤汁。",["生抽"],undefined,{生抽:10}),
    step("及时离火装盘","关火后再翻两下，立即装盘，避免余温让鸡蛋变老。","不适用","不适用","不适用","20 秒",20,"鸡蛋柔软湿润，番茄酸甜多汁。",[],"鸡蛋应完全凝固，不保留流动生蛋液。"),
  ];
  if (spec.method === "辅食") return [
    step(`检查${main}`,`称量${main}，去除硬皮、筋、刺或受损部分；首次给宝宝尝试的新食材应一次只引入一种。`,`不适用`,`冷水`,`不适用`,`3 分钟`,180,`${main}无异物，刀具与砧板已清洁。`,[main],"制作前洗手，生熟工具分开。"),
    step(`切配到适龄大小`,`将${main}${second ? `和${second}` : ""}按页面标注处理；所有块状食材先切成不超过 1cm 的薄片以便彻底蒸软。`,`不适用`,`不适用`,`不适用`,`5 分钟`,300,`食材大小均匀，没有硬梗和鱼刺。`,[main,second ?? ""]),
    step(`彻底蒸熟`,`蒸锅加入足量清水并烧开，放入食材后保持中火蒸制；中途不要补冷水。`,`中火`,`沸水`,`不适用`,`${Math.max(8,spec.wait)} 分钟`,Math.max(480,spec.wait*60),`用勺背能轻松压碎，中心没有生硬部分。`,[main,second ?? ""],"肉、蛋、鱼虾必须完全熟透。"),
    step(`压泥或切碎`,`趁温热将熟食压泥、剁碎或与软饭混合，按月龄加入配方中的温开水调节稠度。`,`不适用`,`温水`,`不适用`,`3 分钟`,180,`达到“${spec.baby?.[2]}”的质地。`,names),
    step(`降温并试温`,`摊开食物降温，用干净勺背接触手腕内侧，确认温热不烫后再喂。`,`不适用`,`不适用`,`不适用`,`2 分钟`,120,`入口温热，食物中无硬块。`,names,"由成人坐在宝宝身边全程看护，进食时保持坐姿。"),
  ];
  if (spec.method === "水煮") return [
    step(`清理${main}`,`用流动冷水冲洗${main}，按食材备注去除不可食部分，再用厨房纸吸去表面水分。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`${main}洁净、无异物，大小基本一致。`,[main],"处理海鲜后洗手并清洁水槽周边。"),
    step(`把水烧至沸腾`,`锅中加入清水 1200ml 和${second ?? "配料"}，大火烧至整锅持续翻滚。`,`大火`,`沸水`,`不适用`,`3 分钟`,180,`水面连续出现大泡并有明显蒸汽。`,["清水",second ?? ""]),
    step(`沸水下入${main}`,`保持大火，将${main}分散放入沸水并立即轻推，避免相互粘连。`,`大火`,`沸水`,`不适用`,`30 秒`,30,`${main}均匀浸在水中，水温重新回升。`,[main]),
    step(`煮到刚好熟透`,`水重新沸腾后转中火煮 ${Math.max(2,spec.active-2)} 分钟；虾类以外壳完全变红、虾身弯成 C 形为准。`,`中火`,`沸水`,`不适用`,`${Math.max(2,spec.active-2)} 分钟`,Math.max(120,(spec.active-2)*60),`${main}中心熟透但没有久煮变老。`,[main],"贝类未开口的应丢弃；虾蟹中心不得呈半透明生色。"),
    step(`立即捞出`,`用漏勺沥净水分，静置约 30 秒后装盘，避免继续泡在热水中变老。`,`不适用`,`不适用`,`不适用`,`30 秒`,30,`${main}表面有光泽、肉质紧实弹嫩。`,[main]),
    step(`调味上桌`,`撒入食盐或搭配菜谱列出的蘸汁，趁温热食用。`,`不适用`,`不适用`,`不适用`,`1 分钟`,60,`${spec.title}保留食材本味，没有油腻感。`,["食盐"]),
  ];
  if (spec.method === "煎制") {
    if (spec.slug === "oat-banana-pancake") return [
      step("压好香蕉泥","熟香蕉去皮后用叉子压成细泥，检查并去除硬梗。","不适用","不适用","不适用","2 分钟",120,"香蕉泥细腻，没有大块。",["熟香蕉"]),
      step("混合燕麦蛋糊","加入鸡蛋和即食燕麦片，搅拌至无干粉后静置 5 分钟，让燕麦吸水。","不适用","不适用","不适用","5 分钟",300,"面糊浓稠，提起勺子能缓慢落下。",["熟香蕉","鸡蛋","即食燕麦片"],"首次引入鸡蛋时需单独观察过敏反应。"),
      step("预热不粘锅","不粘锅小火预热 40 秒，不放油；手放锅面上方能感到温热即可。","小火","不适用","干锅温热，不冒烟","40 秒",40,"锅温温和，没有烟和焦味。",[]),
      step("舀入小饼","每次舀入约 25g 面糊，摊成直径约 6cm、厚约 5mm 的小饼。","小火","不适用","不适用","1 分钟",60,"饼大小均匀，边缘开始定型。",["熟香蕉","鸡蛋","即食燕麦片"]),
      step("翻面煎熟","表面出现小气孔且边缘不粘时翻面，再煎 1 分钟。","小火","不适用","不适用","1 分钟",60,"两面浅金黄，中心完全凝固且柔软。",["熟香蕉","鸡蛋","即食燕麦片"],"给幼儿食用前掰开检查中心无湿生蛋糊。"),
      step("降温切条","出锅静置 3 分钟，切成约 1cm 宽的柔软短条，由成人看护进食。","不适用","不适用","不适用","3 分钟",180,"小饼温热不烫，可用手指轻松捏碎。",["熟香蕉","鸡蛋","即食燕麦片"]),
    ];
    if (spec.slug === "scallion-pancake") return [
      step("和成柔软面团","中筋面粉分次加入温水，用筷子搅成絮状后揉成无干粉面团。","不适用","温水","不适用","8 分钟",480,"面团柔软，盆底无干粉。",["中筋面粉","温水"]),
      step("醒面松弛","面团表面抹少量油并盖住，室温醒 20 分钟。","不适用","不适用","不适用","20 分钟",1200,"面团延展性增加，擀开时不明显回缩。",["中筋面粉"]),
      step("擀开撒葱","分成 4 份，每份擀成薄片，刷薄油并均匀撒小葱和食盐。","不适用","不适用","不适用","6 分钟",360,"葱花均匀分布，边缘留 1cm。",["小葱","食盐","食用油"]),
      step("卷起再擀圆","面片卷成长条后盘成圆饼，松弛 5 分钟，再擀成约 4mm 厚。","不适用","不适用","不适用","8 分钟",480,"饼坯厚薄均匀，没有破洞漏葱。",["中筋面粉","小葱"]),
      step("中小火煎第一面","平底锅中火预热，倒油后转中小火放入饼坯，盖盖煎 2 分钟。","中火","不适用","油面轻微波纹","2 分钟",120,"底面出现均匀金黄色斑点。",["食用油","中筋面粉"]),
      step("翻面煎透","翻面再煎 2 分钟，期间转动锅身让边缘受热；两面酥黄后出锅。","小火","不适用","不适用","2 分钟",120,"饼层鼓起，中心无生面，外酥内软。",["中筋面粉","小葱"]),
    ];
    if (spec.slug === "sweet-sour-pork") return [
      step("腌制里脊条","猪里脊加入食盐 1g 和生抽 5ml抓匀，静置 10 分钟。","不适用","不适用","不适用","10 分钟",600,"肉条均匀吸收调味，表面不滴水。",["猪里脊","食盐","生抽"],"生肉容器和筷子不得再接触熟食。"),
      step("均匀裹淀粉","加入玉米淀粉抓拌，使每条肉表面形成干爽薄层。","不适用","不适用","不适用","3 分钟",180,"肉条彼此分开，没有湿面糊堆积。",["猪里脊","玉米淀粉"]),
      step("分批煎熟里脊","平底锅中火预热后倒油，油面出现波纹时分批放肉条，每面煎约 2 分钟。","中火","不适用","油面出现波纹，不冒烟","4 分钟",240,"肉条表面金黄，中心无粉红色。",["猪里脊","食用油"],"切开最厚肉条确认完全熟透。"),
      step("调糖醋汁","番茄酱加入剩余生抽、食盐和清水 30ml搅匀。","不适用","温水","不适用","1 分钟",60,"酱汁均匀，无结块。",["番茄酱","生抽","食盐"]),
      step("熬至酱汁起泡","锅中留油 5ml，倒入糖醋汁，中火加热约 40 秒。","中火","不适用","温热即可","40 秒",40,"酱汁冒细密小泡并略微变稠。",["番茄酱","食用油"]),
      step("快速裹汁出锅","倒入里脊条，大火翻匀 30 秒立即装盘。","大火","不适用","不适用","30 秒",30,"每条里脊均匀挂汁，外层仍保持酥感。",["猪里脊","番茄酱"]),
    ];
    return [
      step(`处理${main}`,`称量${main}${second?`和${second}`:""}，按备注切配并用厨房纸吸干表面水分。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`${main}表面干爽，厚薄均匀。`,[main,second??""],"生鲜食材与熟食工具分开。"),
      step("提前调味","加入食盐和生抽抓匀或刷匀，静置 5 分钟。","不适用","不适用","不适用","5 分钟",300,"调味均匀，表面没有大量水分。",[main,"食盐","生抽"]),
      step("中火预热平底锅","平底锅中火预热 40 秒，倒入食用油并转动锅身铺开。","中火","不适用","油面出现细小波纹，不冒烟","40 秒",40,"油层均匀、可以顺畅流动。",["食用油"]),
      step(`平铺${main}`,`将${main}逐块平铺入锅，彼此留出空隙，保持中火煎 ${Math.max(2,Math.floor(spec.active/3))} 分钟。`,"中火","不适用","不适用",`${Math.max(2,Math.floor(spec.active/3))} 分钟`,Math.max(120,Math.floor(spec.active/3)*60),`底面金黄，能自然脱离锅底。`,[main]),
      step("翻面煎至熟透",`逐块翻面，转中小火继续煎 ${Math.max(2,Math.floor(spec.active/3))} 分钟。`,"小火","不适用","不适用",`${Math.max(2,Math.floor(spec.active/3))} 分钟`,Math.max(120,Math.floor(spec.active/3)*60),`${main}两面上色，中心完全熟透。`,[main],"肉禽类切开最厚处确认无血水。"),
      step("短暂静置后装盘","关火后静置 1 分钟，让余温均匀传入中心，再装盘食用。","不适用","不适用","不适用","1 分钟",60,`${spec.title}外层焦香、内部保持应有水分。`,[main,second??""]),
    ];
  }
  if (spec.slug === "mango-sago") return [
    step("烧开煮西米的水","锅中加入清水 1200ml，大火烧至持续沸腾。","大火","沸水","不适用","6 分钟",360,"水面连续翻滚。",["清水"]),
    step("沸水下西米","小西米缓慢撒入沸水并立即搅动 30 秒，防止粘底。","大火","沸水","不适用","30 秒",30,"西米均匀分散，没有结团。",["小西米"]),
    step("中火煮至留白芯","转中火煮 12 分钟，每 2 分钟搅动一次。","中火","沸水","不适用","12 分钟",720,"西米大部分透明，中心只剩针尖大小白点。",["小西米"]),
    step("关火焖至透明","关火盖盖焖 10 分钟，再用凉开水冲洗并沥干。","不适用","温水","不适用","10 分钟",600,"西米完全透明、颗粒分明。",["小西米"]),
    step("处理芒果","芒果肉切 1cm 丁，取一半与椰奶搅打成芒果奶浆。","不适用","不适用","不适用","5 分钟",300,"奶浆顺滑，保留的芒果丁大小均匀。",["芒果肉","椰奶"]),
    step("组合冷藏","西米、芒果奶浆和芒果丁拌匀，冷藏 20 分钟后食用。","不适用","不适用","不适用","20 分钟",1200,"西米悬浮均匀，整体顺滑不结块。",["小西米","芒果肉","椰奶"],"含椰奶的成品应冷藏并在当天食用。"),
  ];
  if (spec.method === "炖汤" && spec.wait === 0) return [
    step(`备好${main}${second ? `和${second}` : ""}`,`称量所有食材；鸡蛋充分打散，干制食材撕成小片，分别放置。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`食材处理完成，蛋液颜色均匀。`,[main,second ?? ""]),
    step(`清水烧开`,`锅中加入清水 1200ml，大火烧至水面连续翻滚。`,`大火`,`沸水`,`不适用`,`3 分钟`,180,`整锅持续沸腾并冒出蒸汽。`,["清水"]),
    step(`先煮${second ?? "汤料"}`,`放入${second ?? "汤料"}，中火煮 30 秒，使其充分舒展。`,`中火`,`沸水`,`不适用`,`30 秒`,30,`${second ?? "汤料"}均匀散开，没有结团。`,[second ?? ""]),
    step(`淋入${main}`,`保持汤面微沸，将${main}从高约 10cm 处沿锅边细流淋入，等待 10 秒再用勺轻推。`,`中火`,`沸水`,`不适用`,`40 秒`,40,`${main}形成轻薄均匀的片状，不成大块。`,[main],"蛋液必须完全凝固后再食用。"),
    step(`精确调味`,`加入食盐 2g，轻轻搅匀后立即关火。`,`小火`,`不适用`,`不适用`,`20 秒`,20,`汤清、蛋花完整，咸味均匀。`,["食盐"]),
    step(`静置盛汤`,`静置 30 秒让温度稍降，再分装到汤碗。`,`不适用`,`不适用`,`不适用`,`30 秒`,30,`${spec.title}清鲜不浑，入口温度合适。`,[],"给儿童或老人饮用前再次试温。"),
  ];
  if (["清蒸","蒸点"].includes(spec.method)) return [
    step(`处理${main}`,`称量并处理${main}，按食材说明切配；需要去腥的表面水分用厨房纸吸干。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`${main}处理干净、厚薄均匀。`,[main],"接触生鲜后立即清洗双手和刀具。"),
    step(`组合入盘`,`将${main}${second ? `与${second}` : ""}均匀铺入浅盘，加入清单中的调味料，避免堆得过厚。`,`不适用`,`不适用`,`不适用`,`3 分钟`,180,`食材平铺，蒸汽能从四周流通。`,names),
    step(`把水烧开`,`蒸锅加入约 1200ml 清水，大火烧至持续翻滚并有大量蒸汽。`,`大火`,`沸水`,`不适用`,`5 分钟`,300,`锅盖边缘连续冒出蒸汽。`,[]),
    step(`沸水上锅蒸${spec.title}`,`放入蒸盘后立刻盖盖，转中火连续蒸 ${Math.max(7,spec.wait)} 分钟；计时从重新冒汽开始。`,`中火`,`沸水`,`不适用`,`${Math.max(7,spec.wait)} 分钟`,Math.max(420,spec.wait*60),`中心完全熟透，质地达到菜谱描述。`,[main,second ?? ""],"开盖时让蒸汽朝远离面部方向散出。"),
    step(`静置定型`,`关火后静置 2 分钟再开盖，避免温度骤降影响口感。`,`不适用`,`不适用`,`不适用`,`2 分钟`,120,`表面稳定，没有大量生水。`,[]),
    step(`调味上桌`,`按食材表加入剩余调味，趁热端上桌；鱼禽类再次检查贴骨处。`,`不适用`,`不适用`,`不适用`,`1 分钟`,60,`${spec.title}香气清晰、中心熟透。`,names,"鱼刺、贝壳碎片和禽骨需在入口前再次检查。"),
  ];
  if (spec.method === "炖汤" || spec.method === "甜品") return [
    step(`清洗并切配`,`称量${main}${second ? `和${second}` : ""}，分别洗净并按食材备注切成大小一致的块。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`所有食材已分类放置，生熟没有混放。`,[main,second ?? ""]),
    step(`处理汤底`,`肉类冷水下锅焯至浮沫聚集后捞出温水洗净；非肉类直接进入下一步。`,`大火`,`冷水`,`不适用`,`5 分钟`,300,`肉类表面无血沫，锅中浮沫已倒掉。`,[main],"焯水不等于熟透，后续仍需足时加热。"),
    step(`一次加足水`,`锅中加入清单所列清水并放入${main}，大火加热至整锅沸腾。`,`大火`,`冷水`,`不适用`,`8 分钟`,480,`汤面持续翻滚，浮沫已撇净。`,[main,"清水"]),
    step(`转小火慢煮`,`盖盖留约 1cm 缝隙，转小火保持汤面偶尔冒泡，炖煮 ${Math.max(20,spec.wait)} 分钟。`,`小火`,`沸水`,`不适用`,`${Math.max(20,spec.wait)} 分钟`,Math.max(1200,spec.wait*60),`${main}能被筷子轻松插入，汤色自然。`,[main],"长时间炖煮需防止水分烧干。"),
    step(`加入后熟食材`,`${second ? `加入${second}` : "检查汤量"}，转中火煮至再次沸腾后继续煮 5–10 分钟。`,`中火`,`沸水`,`不适用`,`8 分钟`,480,`${second ?? "汤中食材"}完全熟软但没有碎烂。`,[second ?? ""]),
    step(`最后调味`,`关火前加入食盐并搅匀，静置 2 分钟后撇去表面多余油脂再盛出。`,`小火`,`不适用`,`不适用`,`2 分钟`,120,`${spec.title}味道均匀、入口不烫。`,["食盐"],"老人和儿童食用前需进一步降温并检查骨刺。"),
  ];
  if (spec.method === "面食") return [
    step(`备好${spec.title}配料`,`称量${main}${second ? `、${second}` : ""}及全部调料，蔬菜切配后与生肉分开放置。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`配料均匀，调味料已按量分装。`,names,"生肉馅与即食配菜使用不同筷子。"),
    step(`烧足量水`,`大锅加入约 1800ml 清水，大火烧至连续翻滚。`,`大火`,`沸水`,`不适用`,`8 分钟`,480,`水面持续出现大泡。`,[]),
    step(`下入${main}`,`保持大火，将${main}分散下锅并立即轻推，避免粘底和相互粘连。`,`大火`,`沸水`,`不适用`,`1 分钟`,60,`${main}在水中分散开。`,[main]),
    step(`煮到中心熟透`,`水再次沸腾后转中火，按厚度煮 ${Math.max(4,spec.active-3)} 分钟；面条夹断后中心无白芯。`,`中火`,`沸水`,`不适用`,`${Math.max(4,spec.active-3)} 分钟`,Math.max(240,(spec.active-3)*60),`${main}熟而不糊，中心无生粉。`,[main],"肉馅面点必须确认馅心无粉红色。"),
    step(`制作并加入浇头`,`${second ? `将${second}` : "将配料"}按清单调味，中火加热到完全熟透后与主食组合。`,`中火`,`不适用`,`油面轻微波纹，不冒烟`,`5 分钟`,300,`浇头成熟，酱汁均匀。`,names),
    step(`拌匀上桌`,`加入生抽和食盐，快速拌匀后趁热食用；凉面则过凉开水后充分沥干。`,`不适用`,`不适用`,`不适用`,`1 分钟`,60,`${spec.title}不粘成团，调味均匀。`,["生抽","食盐"]),
  ];
  if (spec.method === "红烧") return [
    step(`切配${main}`,`称量${main}${second ? `和${second}` : ""}，按备注切成均匀大小并擦去表面水分。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`块形均匀，锅边没有生食污染。`,[main,second ?? ""],"生肉刀板用后立即清洗消毒。"),
    step(`必要时焯水`,`肉块冷水下锅，大火煮开 3 分钟并撇净浮沫；非肉类可跳过焯水。`,`大火`,`冷水`,`不适用`,`5 分钟`,300,`表面无血沫，异味明显减少。`,[main]),
    step(`煎出香气`,`锅中火预热 40 秒，倒入食用油 15ml；油面出现细小波纹后下${main}，摊开煎至表面上色。`,`中火`,`不适用`,`油面出现细小波纹，约五成热`,`5 分钟`,300,`${main}表面金黄且能轻松翻动。`,[main,"食用油"]),
    step(`加入调味`,`加入生抽和本菜其余调料，中火翻动 1 分钟，让酱汁均匀包住${main}。`,`中火`,`不适用`,`不适用`,`1 分钟`,60,`酱汁出现细密泡沫并附着食材。`,names),
    step(`加热水焖熟`,`沿锅边加入清单中的热水，沸腾后转小火盖盖焖 ${Math.max(10,spec.wait)} 分钟。`,`小火`,`热水`,`不适用`,`${Math.max(10,spec.wait)} 分钟`,Math.max(600,spec.wait*60),`${main}中心熟透，可被筷子插入。`,[main,"清水"],"禽肉和肉块中心不得带血水。"),
    step(`大火收汁`,`开盖转大火翻动 1–3 分钟，汤汁变浓时立即关火，避免糖和酱油焦苦。`,`大火`,`不适用`,`不适用`,`2 分钟`,120,`酱汁能薄薄挂在食材表面，锅底仍有少量汁。`,names),
  ];
  if (spec.method === "凉拌") return [
    step(`洗净${main}`,`用流动水充分冲洗${main}，按备注切配；即食蔬菜使用清洁刀板。`,`不适用`,`冷水`,`不适用`,`5 分钟`,300,`${main}表面洁净并充分沥水。`,[main],"免烹食材不得接触处理生肉的工具。"),
    step(`处理口感`,`按菜谱拍裂或切段，加入食盐 1g 抓匀静置 5 分钟后倒掉析出水分。`,`不适用`,`不适用`,`不适用`,`5 分钟`,300,`${main}略微变软但仍脆。`,[main,"食盐"]),
    step(`调制料汁`,`将剩余食盐、米醋和芝麻油充分搅匀至盐溶解。`,`不适用`,`不适用`,`不适用`,`1 分钟`,60,`料汁均匀无盐粒。`,names),
    step(`拌匀`,`料汁淋在${main}上，从盆底向上翻拌 20 次。`,`不适用`,`不适用`,`不适用`,`1 分钟`,60,`每块食材表面都有薄薄料汁。`,names),
    step(`短暂入味`,`冷藏静置 10 分钟后食用，不在室温下长时间放置。`,`不适用`,`不适用`,`不适用`,`10 分钟`,600,`${spec.title}清脆、无大量出水。`,names,"制作后 2 小时内食用完毕。"),
  ];
  return [
    step(`切配${main}`,`称量${main}${second ? `和${second}` : ""}，按备注切成大小一致的片、丝或块，并彻底沥干。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`食材尺寸均匀，表面没有明显水珠。`,[main,second ?? ""],"生肉与即食蔬菜分板处理。"),
    step(`调好料汁`,`将生抽、食盐及本菜其余调味料按清单混合，炒制时一次加入。`,`不适用`,`不适用`,`不适用`,`1 分钟`,60,`食盐溶解，料汁均匀。`,names),
    step(`锅和油预热`,`空锅中火预热 40 秒，倒入食用油 15ml；看到油面细小波纹且没有冒烟时下料。`,`中火`,`不适用`,`油面出现细小波纹，木筷边缘有小泡`,`40 秒`,40,`油可流动铺开但没有烟。`,["食用油"]),
    step(`先炒${main}`,`下入${main}后摊开，以中火快速翻炒 ${Math.max(2,Math.floor(spec.active/2))} 分钟。`,`中火`,`不适用`,`不适用`,`${Math.max(2,Math.floor(spec.active/2))} 分钟`,Math.max(120,Math.floor(spec.active/2)*60),`${main}表面变色并接近成熟。`,[main],"肉禽海鲜需炒到中心无生色。"),
    step(`加入${second ?? "其余食材"}`,`加入${second ?? "其余食材"}，转大火持续翻动，让食材均匀受热且不过度出水。`,`大火`,`不适用`,`不适用`,`2 分钟`,120,`${second ?? "食材"}断生并保持应有的脆嫩度。`,[second ?? ""]),
    step(`调味离火`,`沿锅边倒入料汁，大火翻炒 30–60 秒；料汁均匀包裹后立即关火装盘。`,`大火`,`不适用`,`不适用`,`45 秒`,45,`${spec.title}表面有光泽，锅底没有焦黑调料。`,names),
  ];
}

function buildRecipe(spec: Spec): Recipe {
  const ingredients = makeIngredients(spec);
  const ingredientNames = ingredients.map((item) => item.name).join("、");
  const allergens = [...new Set(ingredients.flatMap((item) => allergenFor(item.name)))];
  const tags = [...new Set([spec.category, ...(spec.tags ?? []), spec.baby ? "宝宝辅食" : "", spec.spice ? "香辣" : "清淡"].filter(Boolean))];
  const dietType = spec.category === "蔬菜" && !ingredientNames.match(/肉|鸡|蛋|虾|鱼/) ? "素" : spec.category === "蔬菜" || spec.title.includes("番茄炒蛋") ? "半荤素" : "荤";
  const nutritionRoles: Recipe["nutritionRoles"] = spec.category === "蔬菜" ? ["蔬菜"] : spec.category === "面食" ? ["主食"] : spec.category === "汤粥" ? ["汤羹"] : spec.category === "甜点" ? ["甜点"] : ["蛋白质"];
  const search = `https://search.bilibili.com/all?keyword=${encodeURIComponent(`${spec.title} 做法`)}`;
  const editorialStatus: Recipe["editorialStatus"] = REVIEWED_SLUGS.has(spec.slug) ? "reviewed" : "draft";
  const imageVerified = spec.slug === "tomato-scrambled-eggs";
  return {
    slug:spec.slug,title:spec.title,summary:editorialStatus==="reviewed"?`把${spec.title}的用量、火候和完成状态逐步写清楚，在家也能稳定复现。`:`${spec.title}正在逐项核对用量、火候与步骤，完成编辑复核后开放烹饪模式。`,image:imageVerified?"/images/recipes/tomato-scrambled-eggs.webp":IMAGE_BY_CATEGORY[spec.category],imageVerified,editorialStatus,reviewedAt:editorialStatus==="reviewed"?"2026-07-16":undefined,category:spec.category,tags,aliases:spec.title.includes("番茄")?[spec.title.replaceAll("番茄","西红柿")]:[],
    dietType,nutritionRoles,cookingMethod:spec.method,spiceLevel:spec.spice ?? 0,allergens,babyAge:spec.baby?{min:spec.baby[0],max:spec.baby[1],texture:spec.baby[2]}:undefined,
    difficulty:Math.min(5,Math.max(1,Math.ceil((spec.prep+spec.active+spec.wait)/30))) as Recipe["difficulty"],prepMinutes:spec.prep,activeMinutes:spec.active,waitMinutes:spec.wait,cookMinutes:spec.active+spec.wait,servings:spec.servings,
    likes:0,weeklyLikes:0,ingredients,steps:makeSteps(spec,ingredients),tips:[`开始前把${ingredientNames}全部称量并按步骤摆放。`,`完成状态比固定钟表更重要，同时观察颜色、质地和香气。`],failurePoints:[`${mainFailure(spec.method)}；出现异常焦味时立即离火。`],safetyNote:spec.baby?"需由成人全程看护进食；首次引入常见过敏原时一次只尝试一种，并观察 3–5 天。":"生熟分开处理；肉、禽、蛋、鱼贝类必须彻底熟透后食用。",
    bilibiliSearchUrl:search,sources:REVIEWED_SOURCES[spec.slug]??[GUIDELINE,spec.baby?INFANT_GUIDELINE:{name:`${spec.title}视频搜索入口`,url:search,type:"video",verifiedAt:"2026-07-15"}],
  };
}

function mainFailure(method: Method) {
  if (method === "清蒸") return "不要冷水上锅后直接计时，应从蒸汽重新充足时开始";
  if (method === "红烧") return "收汁时不要离开灶台，糖和酱油浓缩后很容易焦苦";
  if (method === "快炒") return "食材下锅前应沥干，锅温不足会大量出水";
  if (method === "炖汤") return "小火阶段只保持轻微冒泡，大滚会让肉柴且汤浑";
  if (method === "辅食") return "不要用盐、糖或蜂蜜调味，也不要保留硬块、骨刺和整粒坚果";
  return "严格按步骤判断中心熟度，不要只凭表面颜色提前出锅";
}

export const recipes: Recipe[] = CATALOG.map(buildRecipe);
export const ingredientShortcuts = ["鸡蛋","番茄","土豆","豆腐","鸡肉","猪肉","虾","面条"];
export const categories = ["全部","荤菜","海鲜","蔬菜","面食","汤粥","甜点"];
export const audienceCategories = ["宝宝辅食","老人友好","清淡恢复","减脂餐","新手推荐"];
export const getRecipe = (slug: string) => recipes.find((recipe) => recipe.slug === slug);
export const totalMinutes = (recipe: Recipe) => recipe.prepMinutes + recipe.activeMinutes + recipe.waitMinutes;
