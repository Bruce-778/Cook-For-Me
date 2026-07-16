import { recipeFeatureTags } from "@/lib/recipe-features";

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
  slug: string; title: string; summary: string; image: string; category: string; tags: string[]; featureTags: string[]; aliases: string[];
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
  "braised-prawn":[["白糖",8,"g"],["料酒",15,"ml"],["生抽",15,"ml"],["姜",12,"g"],["大葱",20,"g"],["清水",80,"ml","用于焖制"]],
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
  "steamed-chicken-mushroom":[["料酒",15,"ml"],["生抽",15,"ml"],["蚝油",10,"ml"],["玉米淀粉",8,"g"],["姜",12,"g"],["芝麻油",5,"ml"]],
  "minced-pork-steamed-egg":[["生抽",10,"ml"],["料酒",5,"ml"],["姜",5,"g"],["芝麻油",3,"ml"]],
  "moo-shu-pork":[["料酒",10,"ml"],["生抽",15,"ml"],["玉米淀粉",8,"g"],["白糖",2,"g"]],
  "garlic-sprout-pork":[["料酒",10,"ml"],["生抽",15,"ml"],["玉米淀粉",8,"g"],["白糖",2,"g"]],
  "radish-lamb-stew":[["姜",20,"g"],["大葱",30,"g"],["料酒",20,"ml"],["白胡椒粉",1,"g"]],
  "steamed-fish":[["蒸鱼豉油",20,"ml"],["食用油",15,"ml"]],
  "boiled-shrimp":[["料酒",10,"ml"],["大葱",20,"g"]],
  "garlic-scallops":[["生抽",12,"ml"],["食用油",15,"ml"]],
  "clams-loofah-soup":[["姜",10,"g"],["食用油",5,"ml"]],
  "clam-steamed-egg":[["生抽",8,"ml"],["芝麻油",3,"ml"],["姜",5,"g"]],
  "celery-squid":[["料酒",15,"ml"],["生抽",10,"ml"],["姜",8,"g"],["玉米淀粉",5,"g"]],
  "crucian-tofu-soup":[["姜",15,"g"],["料酒",10,"ml"],["食用油",15,"ml"]],
  "steamed-cod":[["蒸鱼豉油",15,"ml"],["大葱",20,"g"],["食用油",10,"ml"]],
  "garlic-oysters":[["生抽",12,"ml"],["食用油",15,"ml"]],
  "garlic-broccoli":[["蚝油",12,"ml"]],
  "celery-lily":[["白糖",2,"g"],["玉米淀粉",4,"g"]],
  "baby-bok-choy-mushroom":[["蚝油",12,"ml"]],
  "tomato-zucchini":[["白糖",3,"g"]],
  "garlic-spinach":[],
  "oyster-mushroom":[["生抽",10,"ml"],["白糖",3,"g"]],
  "cabbage-tofu-pot":[["姜",10,"g"],["白胡椒粉",1,"g"],["食用油",12,"ml"]],
  "homemade-dumplings":[["生抽",20,"ml"],["姜",15,"g"],["芝麻油",10,"ml"],["清水",60,"ml","分次打入肉馅"]],
  "yangchun-noodles":[["猪油",10,"g","不食猪油可换芝麻油 8ml"],["生抽",15,"ml"],["白胡椒粉",0.5,"g"]],
  "egg-fried-rice":[["食用油",20,"ml"],["白胡椒粉",0.5,"g"]],
  "beef-noodle-soup":[["生抽",25,"ml"],["老抽",5,"ml"],["料酒",20,"ml"],["姜",15,"g"],["八角",2,"个"],["清水",1500,"ml"]],
  "rice-cooker-chicken-rice":[["生抽",20,"ml"],["蚝油",12,"ml"],["料酒",10,"ml"],["姜",10,"g"],["清水",360,"ml"]],
  "sesame-cold-noodles":[["生抽",15,"ml"],["米醋",12,"ml"],["白糖",4,"g"],["芝麻油",5,"ml"],["凉开水",30,"ml","调开芝麻酱"]],
  "tomato-egg-noodles":[["食用油",15,"ml"],["生抽",10,"ml"],["白糖",3,"g"],["清水",900,"ml"]],
  "pork-wontons":[["生抽",15,"ml"],["姜",10,"g"],["芝麻油",8,"ml"],["清水",40,"ml","打入肉馅"]],
  "bean-braised-noodles":[["生抽",20,"ml"],["老抽",5,"ml"],["料酒",10,"ml"],["蒜",12,"g"],["清水",450,"ml"]],
  "scallion-pancake":[["食用油",35,"ml"],["食盐",4,"g"]],
  "steamed-buns":[],
  "baby-pumpkin-buns":[],
  "winter-melon-soup":[["姜",15,"g"],["料酒",15,"ml"]],
  "seaweed-egg-soup":[["芝麻油",3,"ml"],["白胡椒粉",0.5,"g"]],
  "corn-rib-soup":[["姜",15,"g"],["料酒",15,"ml"]],
  "tomato-beef-soup":[["姜",15,"g"],["料酒",20,"ml"],["白糖",4,"g"]],
  "pumpkin-millet-porridge":[],
  "yam-pork-porridge":[["姜",5,"g"],["玉米淀粉",4,"g"]],
  "lotus-rib-soup":[["姜",15,"g"],["料酒",15,"ml"]],
  "mushroom-chicken-soup":[["姜",15,"g"],["料酒",15,"ml"]],
  "tomato-tofu-soup":[["白糖",3,"g"],["食用油",8,"ml"]],
  "baby-pumpkin-cereal":[],
  "baby-broccoli-chicken-porridge":[],
  "baby-salmon-soft-rice":[],
  "silver-ear-soup":[],
  "brown-sugar-cake":[],
  "mango-sago":[],
  "oat-banana-pancake":[],
  "red-bean-rice-cake":[],
  "double-skin-milk":[],
  "pear-tremella":[],
  "baby-yam-blueberry":[],
  "baby-carrot-potato-mash":[],
  "baby-shrimp-tofu-egg":[],
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
  if (["scallion-pancake", "double-skin-milk", "zhajiang-noodles"].includes(spec.slug)) return merge([]);
  if (spec.slug === "egg-fried-rice" || spec.slug === "rice-cooker-chicken-rice") {
    return merge([{name:"食盐",amount:2,unit:"g",note:"约 1/3 平茶匙",group:"调料"}]);
  }
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
  const extraNames = (spec.extras ?? []).map(item => item[0]);
  const seasoningNames = ingredients.filter((item) => item.group === "调料").map((item) => item.name);
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
  if (["homemade-dumplings","pork-wontons"].includes(spec.slug)) return [
    step("调好肉馅",`把${second}与姜、生抽、芝麻油和清水分 3 次沿同一方向搅拌，直到肉馅发黏、盆底没有游离水。${extraNames[1]?`加入挤干水分的${extraNames[1]}拌匀。`:""}`,"不适用","不适用","不适用","8 分钟",480,"肉馅能抱团，提起筷子不会滴水。",names,"接触生肉的筷子和容器不得再接触熟食。"),
    step("逐个包好",`取一张${main}，中央放入馅料；饺子每个约 18g 馅，馄饨每个约 8g 馅。边缘蘸水后捏紧，排在撒有干粉的盘中。`,"不适用","冷水","不适用","15 分钟",900,"封口完整，没有露馅和破皮。",[main,second??"",extraNames[1]??""]),
    step("烧开足量水","大锅加入约 2000ml 清水，大火烧至整锅持续翻滚。","大火","沸水","不适用","8 分钟",480,"水面连续出现大泡。",[]),
    step("分批下锅",`将包好的${spec.title.includes("饺子")?"饺子":"馄饨"}分散下入沸水，用勺背沿锅底轻推 20 秒防粘。`,"大火","沸水","不适用","30 秒",30,"面点彼此分开，没有粘底。",[main,second??""]),
    step("煮到馅心熟透",`水再次沸腾后转中火；饺子煮 5–6 分钟，馄饨煮 3–4 分钟。捞一个切开，确认皮无白芯、肉馅中心无粉红色。`,"中火","沸水","不适用",spec.slug==="homemade-dumplings"?"6 分钟":"4 分钟",spec.slug==="homemade-dumplings"?360:240,"全部浮起，面皮透亮，馅心完全熟透。",[main,second??""],"猪肉馅中心温度应达到 71°C。"),
    step("沥水装碗","用漏勺捞出并沥水 20 秒，饺子直接装盘；馄饨加入已经烧开的清汤后食用。","不适用","不适用","不适用","1 分钟",60,`${spec.title}皮完整、不破不粘。`,[main,second??""]),
  ];
  if (spec.slug === "beef-noodle-soup") return [
    step("牛腩焯水","牛腩冷水下锅，大火煮开 3 分钟，撇去浮沫后捞出，用温水冲净。","大火","冷水","不适用","6 分钟",360,"牛腩表面无血沫。",["牛腩"],"焯水后的牛肉仍未熟透。"),
    step("炒香调味","锅中火预热后倒油，放姜和牛腩翻炒 3 分钟；加入料酒、生抽、老抽和八角炒匀。","中火","不适用","油面轻微波纹","4 分钟",240,"牛腩表面上色，酱香明显。",names),
    step("小火炖牛腩","加入清水 1500ml，煮沸后转小火盖盖炖 60 分钟。","小火","热水","不适用","60 分钟",3600,"牛腩可被筷子插入但仍保持块形。",["牛腩","清水"]),
    step("加入白萝卜","加入白萝卜继续小火炖 15 分钟，最后加盐调味。","小火","沸水","不适用","15 分钟",900,"萝卜透明软熟，牛腩软烂。",["白萝卜","食盐"]),
    step("另锅煮面","另锅烧开约 1800ml 清水，下鲜面条后立即拨散，中火煮至夹断无白芯。","中火","沸水","不适用","4 分钟",240,"面条熟而不糊。",["鲜面条"]),
    step("组合上桌","面条沥水放碗中，舀入牛腩、萝卜和滚热汤汁，趁热食用。","不适用","不适用","不适用","1 分钟",60,"面条不粘团，汤和浇头滚热。",["鲜面条","牛腩","白萝卜"]),
  ];
  if (spec.slug === "sesame-cold-noodles") return [
    step("调开麻酱","芝麻酱分 3 次加入凉开水搅顺滑，再加入生抽、米醋、白糖、盐和芝麻油。","不适用","冷水","不适用","3 分钟",180,"酱汁能连续流下，没有芝麻酱硬块。",names),
    step("准备黄瓜","黄瓜切细丝后冷藏备用，不加热。","不适用","冷水","不适用","3 分钟",180,"黄瓜丝脆嫩、表面无多余水分。",["黄瓜"]),
    step("煮熟面条","大锅水沸后下鲜面条，拨散并按包装时间煮至无白芯。","中火","沸水","不适用","4 分钟",240,"面条中心熟透且仍有弹性。",["鲜面条"]),
    step("迅速冷却","面条捞出后用凉开水冲凉，充分沥水；不可使用未经煮沸的生水。","不适用","冷水","不适用","2 分钟",120,"面条凉爽、根根分明。",["鲜面条"],"凉拌面应使用凉开水，并在制作后 2 小时内食用。"),
    step("拌匀装盘","面条先与麻酱汁充分拌匀，再放黄瓜丝，立即食用。","不适用","不适用","不适用","1 分钟",60,"每根面条均匀挂汁，黄瓜仍脆。",names),
  ];
  if (spec.slug === "egg-fried-rice") return [
    step("打散米饭和鸡蛋","冷米饭提前拨散；鸡蛋充分打散，胡萝卜切小丁。","不适用","冷水","不适用","4 分钟",240,"米饭无硬团，蛋液颜色均匀。",["冷米饭","鸡蛋","胡萝卜"]),
    step("炒嫩鸡蛋","锅中火预热，倒入食用油 10ml，蛋液下锅后快速推成小块，八成熟立即盛出。","中火","不适用","油面有细小波纹","45 秒",45,"鸡蛋刚凝固、仍有湿润光泽。",["鸡蛋","食用油"]),
    step("炒熟胡萝卜","原锅补食用油 10ml，下胡萝卜中火翻炒 2 分钟。","中火","不适用","油可流动铺开","2 分钟",120,"胡萝卜变亮并开始变软。",["胡萝卜","食用油"]),
    step("大火炒散米饭","加入冷米饭转大火持续翻炒 3 分钟，压散所有结块。","大火","不适用","不适用","3 分钟",180,"米饭粒粒分明，锅底没有湿团。",["冷米饭"]),
    step("回锅调味","鸡蛋回锅，加入食盐和白胡椒粉，大火翻炒 40 秒后离火。","大火","不适用","不适用","40 秒",40,"鸡蛋均匀分布，米饭松散热透。",["鸡蛋","食盐","白胡椒粉"],"鸡蛋必须完全凝固。"),
  ];
  if (spec.slug === "tomato-egg-noodles") return [
    step("炒好鸡蛋","鸡蛋打散；炒锅中火预热后加油 8ml，倒入蛋液推成嫩块，刚凝固立即盛出。","中火","不适用","油面出现细小波纹","1 分钟",60,"鸡蛋柔软成块，没有焦边。",["鸡蛋","食用油"],"蛋液不得保留流动部分。"),
    step("炒出番茄汤汁","原锅加油 7ml，下番茄、白糖和食盐，中火翻炒并轻压 3 分钟。","中火","不适用","油可流动铺开","3 分钟",180,"番茄明显变软，锅底有红色汤汁。",["番茄","白糖","食盐","食用油"]),
    step("煮番茄汤底","加入清水 900ml 和生抽，大火煮沸后转中火煮 3 分钟。","中火","热水","不适用","3 分钟",180,"汤色红亮，番茄味融入汤中。",["清水","生抽","番茄"]),
    step("下入面条","汤底保持沸腾，抖散鲜面条下锅，立即轻推防粘。","大火","沸水","不适用","1 分钟",60,"面条在汤中分散开。",["鲜面条"]),
    step("煮熟并回蛋","转中火煮至面条夹断无白芯，倒回鸡蛋再煮 30 秒。","中火","沸水","不适用","4 分钟",240,"面条熟而不烂，鸡蛋吸附番茄汤汁。",["鲜面条","鸡蛋"],"面条和鸡蛋均须彻底加热。"),
  ];
  if (spec.slug === "rice-cooker-chicken-rice") return [
    step("腌鸡腿肉","鸡腿肉加入姜、料酒、生抽和蚝油抓匀，冷藏腌 10 分钟。","不适用","不适用","不适用","10 分钟",600,"鸡肉表面均匀裹有料汁。",["去骨鸡腿肉","姜","料酒","生抽","蚝油"],"腌肉容器和筷子不得接触熟食。"),
    step("处理大米和配菜","大米淘洗后沥水；胡萝卜切小丁。","不适用","冷水","不适用","5 分钟",300,"淘米水基本清澈，胡萝卜丁大小均匀。",["大米","胡萝卜"]),
    step("铺入电饭煲","大米放锅底，加入清水 360ml，铺上胡萝卜和腌好的鸡腿肉，不要提前搅拌。","不适用","冷水","不适用","2 分钟",120,"米粒浸在水中，鸡肉单层铺开。",["大米","清水","胡萝卜","去骨鸡腿肉"]),
    step("完成煮饭程序","启动标准煮饭程序，过程中不要开盖；跳转保温后继续焖 10 分钟。","不适用","不适用","不适用","40 分钟",2400,"米饭熟透，鸡肉中心无粉红色。",["大米","去骨鸡腿肉"],"鸡腿肉中心温度达到 74°C。"),
    step("拌匀检查","开盖先取最厚鸡块切开检查熟度，加入食盐，再把鸡肉、胡萝卜和米饭翻拌均匀。","不适用","不适用","不适用","2 分钟",120,"米饭松软、锅底无生水，鸡肉完全熟透。",["大米","去骨鸡腿肉","胡萝卜","食盐"]),
  ];
  if (spec.slug === "bean-braised-noodles") return [
    step("煸香五花肉","锅中火预热后加油，下五花肉片煸 3 分钟至出油、边缘微黄，再加入料酒。","中火","不适用","油面轻微波纹","3 分钟",180,"肉片变色并析出油脂。",["五花肉","食用油","料酒"]),
    step("炒豆角调味","加入四季豆和蒜，大火翻炒 3 分钟；加入生抽、老抽和食盐炒匀。","大火","不适用","不适用","3 分钟",180,"豆角颜色变亮、表面均匀上色。",["四季豆","蒜","生抽","老抽","食盐"]),
    step("加水预煮","加入清水 450ml，大火煮沸后转中火煮 5 分钟。","中火","热水","不适用","5 分钟",300,"豆角开始变软，锅中仍有充足汤汁。",["清水","四季豆"]),
    step("铺面焖熟","舀出约一半汤汁备用，把鲜面条抖散铺在豆角上，不要接触锅底；沿锅边淋回汤汁，盖盖小火焖 8 分钟。","小火","沸水","不适用","8 分钟",480,"面条吸收汤汁并基本熟透，锅底仍湿润。",["鲜面条","四季豆","清水"]),
    step("翻拌收汁","开盖把面条、豆角和肉片从底部翻匀，中火加热 2 分钟至面条无白芯、汤汁基本收干。","中火","不适用","不适用","2 分钟",120,"面条松散入味，豆角完全熟透。",["鲜面条","四季豆","五花肉"],"四季豆必须完全熟透，不得带生青味。"),
  ];
  if (["steamed-buns","baby-pumpkin-buns"].includes(spec.slug)) return [
    step("激活酵母",`${spec.slug==="steamed-buns"?"温水":"南瓜泥"}控制在约 30°C，加入干酵母搅匀，静置 5 分钟；温度不可烫手。`,"不适用","温水","不适用","5 分钟",300,"液面出现细小气泡，酵母无结块。",[spec.slug==="steamed-buns"?"温水":"南瓜泥","干酵母"]),
    step("揉成光滑面团",`把酵母液分次加入中筋面粉，先搅成絮状，再揉 8–10 分钟至表面基本光滑。`,"不适用","温水","不适用","10 分钟",600,"面团柔软不粘手，切面无明显干粉。",["中筋面粉",spec.slug==="steamed-buns"?"温水":"南瓜泥","干酵母"]),
    step("第一次发酵","面团盖严，在温暖处发酵至约 2 倍大。用手指蘸粉戳洞，洞口不快速回缩即可。","不适用","不适用","不适用","50 分钟",3000,"体积约为原来的 2 倍，内部有均匀蜂窝。",["中筋面粉"]),
    step("排气整形","把面团充分揉压排气，分成等份并滚圆，放在蒸纸上，彼此留出至少 3cm。","不适用","不适用","不适用","10 分钟",600,"生坯表面光滑，大小接近。",["中筋面粉"]),
    step("二次醒发","蒸锅中放温水但不开火，生坯加盖醒发 15–20 分钟至明显变轻、体积约 1.5 倍。","不适用","温水","不适用","18 分钟",1080,"轻按表面能缓慢回弹。",["中筋面粉"]),
    step("蒸熟再开盖","大火烧至上汽后转中火蒸 12–15 分钟，关火后静置 3 分钟再缓慢开盖。","中火","沸水","不适用","15 分钟",900,"馒头蓬松，掰开中心无湿黏生面。",["中筋面粉"],"开盖时让蒸汽远离面部；宝宝食用需掰成小块并看护。"),
  ];
  if (spec.slug === "brown-sugar-cake") return [
    step("化开红糖","红糖加入温水搅至完全溶解，放凉到约 30°C 后加入干酵母。","不适用","温水","不适用","5 分钟",300,"糖液无颗粒且温热不烫。",["红糖","温水","干酵母"]),
    step("调成面糊","糖液分次倒入中筋面粉，搅拌 3 分钟至没有干粉和明显面疙瘩。","不适用","温水","不适用","3 分钟",180,"面糊浓稠顺滑，提起刮刀呈带状落下。",["中筋面粉","红糖","温水","干酵母"]),
    step("发酵至两倍大","模具薄薄刷油，倒入面糊不超过七分满，盖住发酵至约 2 倍大。","不适用","不适用","不适用","45 分钟",2700,"表面有均匀小气泡，体积明显增大。",["中筋面粉"]),
    step("排大气泡","用筷子轻搅面糊 10 圈排出大气泡，再静置 10 分钟。","不适用","不适用","不适用","10 分钟",600,"表面气泡细小均匀。",["中筋面粉"]),
    step("上汽后蒸熟","蒸锅水开后放入模具，中火蒸 30 分钟；关火焖 3 分钟再开盖。","中火","沸水","不适用","30 分钟",1800,"竹签插入中心取出无湿面糊。",["中筋面粉"],"开盖时注意高温蒸汽。"),
    step("放凉切块","脱模前放凉 10 分钟，再用干净刀切块。","不适用","不适用","不适用","10 分钟",600,"切面蜂窝均匀，不黏刀。",["中筋面粉"]),
  ];
  if (spec.slug === "red-bean-rice-cake") return [
    step("调糯米糊","温水分次加入糯米粉和白糖，搅拌至顺滑、无干粉。","不适用","温水","不适用","4 分钟",240,"面糊浓稠顺滑，没有粉团。",["糯米粉","温水","白糖"]),
    step("拌入熟红豆","加入熟红豆轻轻翻匀，避免把豆粒压碎。","不适用","不适用","不适用","2 分钟",120,"红豆均匀悬在面糊中。",["熟红豆","糯米粉"]),
    step("装模防粘","模具铺蒸纸或薄薄刷油，倒入面糊并刮平，厚度不超过 4cm。","不适用","不适用","不适用","2 分钟",120,"表面平整，模具边缘干净。",["糯米粉","熟红豆"]),
    step("上汽蒸透","蒸锅水开后放入模具，中火蒸 30–35 分钟。","中火","沸水","不适用","35 分钟",2100,"中心凝固，竹签取出没有白色生粉浆。",["糯米粉","熟红豆"],"糯米制品黏性强，儿童和老人应小口慢吃。"),
    step("完全放凉再切","出锅放凉至少 20 分钟，刀面蘸凉开水后切小块。","不适用","不适用","不适用","20 分钟",1200,"切面成型、不流浆。",["糯米粉","熟红豆"]),
  ];
  if (spec.slug === "double-skin-milk") return [
    step("加热牛奶","全脂牛奶小火加热到锅边冒细泡但不沸腾，立即倒入 4 个浅碗。","小火","不适用","不适用","5 分钟",300,"牛奶热而未翻滚。",["全脂牛奶"]),
    step("静置结奶皮","牛奶静置约 10 分钟，直到表面形成完整薄膜。","不适用","不适用","不适用","10 分钟",600,"轻碰碗边时奶皮不会散开。",["全脂牛奶"]),
    step("调蛋奶液","蛋清与白糖轻轻搅匀，不要打发；沿碗边留住奶皮，把牛奶倒出与蛋清混合并过筛。","不适用","不适用","不适用","5 分钟",300,"蛋奶液顺滑、少气泡，奶皮留在碗底。",["蛋清","白糖","全脂牛奶"]),
    step("回倒碗中","沿碗边慢慢把蛋奶液倒回，让原奶皮浮起；碗口盖耐热保鲜膜并扎 2 个小孔。","不适用","不适用","不适用","3 分钟",180,"奶皮完整浮在表面。",["蛋清","全脂牛奶"]),
    step("中小火蒸凝固","蒸锅上汽后放碗，中小火蒸 12 分钟，关火焖 5 分钟。","小火","沸水","不适用","17 分钟",1020,"轻晃碗时中心微颤但没有液体流动。",["蛋清","全脂牛奶"],"蛋清必须完全凝固；开盖防蒸汽烫伤。"),
  ];
  if (spec.slug === "baby-pumpkin-cereal") return [
    step("蒸软南瓜","南瓜放入已经上汽的蒸锅，中火蒸 10 分钟至勺背能轻松压碎。","中火","沸水","不适用","10 分钟",600,"南瓜完全软烂，无硬芯。",["南瓜"]),
    step("压成细泥","趁温热把南瓜压泥并过筛，去掉纤维和硬块。","不适用","不适用","不适用","2 分钟",120,"南瓜泥细腻顺滑。",["南瓜"]),
    step("准备温开水","把烧开的水放凉至米粉包装建议温度，量取 80ml。","不适用","温水","不适用","3 分钟",180,"水温温热不烫。",["温开水"]),
    step("冲调婴儿米粉","温开水倒入干净小碗，再分次撒入婴儿米粉，静置 30 秒后搅匀。","不适用","温水","不适用","2 分钟",120,"米糊无干粉结块。",["婴儿米粉","温开水"]),
    step("加入南瓜泥","把南瓜泥与米糊拌匀，达到能从勺上缓慢滴落的顺滑质地。","不适用","不适用","不适用","1 分钟",60,"完全顺滑、没有颗粒。",["婴儿米粉","南瓜","温开水"],"现做现吃，不加盐、糖或蜂蜜。"),
  ];
  if (spec.slug === "baby-broccoli-chicken-porridge") return [
    step("煮软米粥","大米与清水一同入锅，煮沸后转小火盖盖煮 25 分钟，每 8 分钟搅动防粘。","小火","冷水","不适用","25 分钟",1500,"米粒开花，粥体浓稠。",["大米","清水"]),
    step("处理鸡肉","鸡胸肉剁成细泥，加入一勺温粥搅散，避免成团。","不适用","不适用","不适用","3 分钟",180,"鸡肉泥均匀分散。",["鸡胸肉"]),
    step("鸡肉入粥煮熟","鸡肉泥分次加入微沸的粥中，边加边搅，小火煮 5 分钟。","小火","沸水","不适用","5 分钟",300,"鸡肉完全变白，无粉红色肉粒。",["鸡胸肉","大米"],"鸡肉必须彻底熟透。"),
    step("加入西兰花末","西兰花花冠焯水 1 分钟后切成 2–3mm 细末，加入粥中再煮 3 分钟。","中火","沸水","不适用","4 分钟",240,"西兰花软熟，颗粒不超过 3mm。",["西兰花","大米"]),
    step("降温试喂","盛出后搅拌降温，确认温热不烫且无硬块，再由成人看护喂食。","不适用","不适用","不适用","3 分钟",180,"稠粥可用舌头压碎。",names,"现做现吃，不加盐糖。"),
  ];
  if (spec.slug === "baby-salmon-soft-rice") return [
    step("逐片检查鱼刺","三文鱼用手指逐片按压检查并去净鱼刺，切成不超过 3mm 的碎末。","不适用","冷水","不适用","5 分钟",300,"鱼肉中没有硬刺和鱼皮。",["三文鱼"],"必须在生、熟两个阶段各检查一次鱼刺。"),
    step("煮软胡萝卜","胡萝卜丁与清水入小锅，煮沸后小火煮 5 分钟。","小火","冷水","不适用","5 分钟",300,"胡萝卜能被勺背压碎。",["胡萝卜","清水"]),
    step("加入米饭煮软","加入熟软米饭，保持小火煮 5 分钟并搅散。","小火","沸水","不适用","5 分钟",300,"米饭湿润软烂，没有硬团。",["熟软米饭","清水"]),
    step("加入三文鱼","鱼肉末分散入锅，小火边搅边煮 4 分钟。","小火","沸水","不适用","4 分钟",240,"鱼肉完全变色并能轻松压碎。",["三文鱼"],"三文鱼必须完全熟透。"),
    step("复查质地和鱼刺","关火后再逐勺检查鱼刺，把颗粒压到不超过 5mm，降至温热后喂食。","不适用","不适用","不适用","3 分钟",180,"软饭湿润，所有颗粒柔软。",names,"由成人全程看护进食。"),
  ];
  if (spec.slug === "baby-shrimp-tofu-egg") return [
    step("处理虾仁","虾仁去虾线后剁成 3mm 以下的细泥，检查无壳碎。","不适用","冷水","不适用","3 分钟",180,"虾泥细碎、无硬壳。",["鲜虾仁"]),
    step("调蛋液","鸡蛋打散，加入温水搅匀后过筛，撇去表面气泡。","不适用","温水","不适用","2 分钟",120,"蛋液细腻无明显气泡。",["鸡蛋","温水"]),
    step("组合入碗","嫩豆腐压碎铺碗底，放入虾泥，再倒入蛋液，碗口盖耐热盘。","不适用","不适用","不适用","2 分钟",120,"虾泥均匀分散，没有大团。",["嫩豆腐","鲜虾仁","鸡蛋"]),
    step("上汽蒸熟","蒸锅水开后放碗，中小火蒸 10 分钟，关火焖 2 分钟。","小火","沸水","不适用","12 分钟",720,"蛋羹完全凝固，虾肉变色熟透。",["鸡蛋","鲜虾仁","嫩豆腐"],"鸡蛋和虾必须彻底熟透；首次引入虾应单独观察过敏反应。"),
    step("降温检查","用勺划开中心确认无液态蛋，压碎到适龄大小并降至温热。","不适用","不适用","不适用","3 分钟",180,"蛋羹柔软、中心熟透且不烫。",names),
  ];
  if (spec.slug === "clams-loofah-soup") return [
    step("蛤蜊吐沙洗净","蛤蜊提前吐沙后反复搓洗外壳，挑出破壳或有异味的个体。","不适用","冷水","不适用","5 分钟",300,"外壳洁净，没有泥沙。",["蛤蜊"]),
    step("煮至开口","锅中加清水和姜，大火煮沸后下蛤蜊，盖盖煮 2–3 分钟，开口的立即捞出。","大火","沸水","不适用","3 分钟",180,"绝大多数蛤蜊张口。",["蛤蜊","清水","姜"],"加热后仍不开口的蛤蜊丢弃。"),
    step("过滤原汤","煮蛤蜊的汤静置 1 分钟，再通过细筛倒入干净锅中，避免底部泥沙进入。","不适用","热水","不适用","2 分钟",120,"汤底清澈、无沙粒。",["清水"]),
    step("煮熟丝瓜","汤重新煮沸，加入丝瓜和食用油，中火煮 3–4 分钟。","中火","沸水","不适用","4 分钟",240,"丝瓜变软但仍保持浅绿色。",["丝瓜","食用油"]),
    step("蛤蜊回锅调味","蛤蜊回锅，加食盐，再次煮沸 30 秒立即关火。","大火","沸水","不适用","30 秒",30,"汤清鲜，蛤蜊肉熟而不老。",["蛤蜊","食盐"]),
  ];
  if (spec.slug === "crucian-tofu-soup") return [
    step("擦干鲫鱼","鲫鱼处理干净后彻底擦干，鱼身两侧各划两刀；豆腐切块。","不适用","冷水","不适用","6 分钟",360,"鱼腹无黑膜和血污，表面干爽。",["鲫鱼","嫩豆腐"]),
    step("两面煎定型","锅中火预热后加油，放鲫鱼每面煎约 2 分钟至金黄，翻面只翻一次。","中火","不适用","油面出现细小波纹","4 分钟",240,"鱼皮定型，能自然离锅。",["鲫鱼","食用油"]),
    step("加热水滚汤","加入姜、料酒和足量热水，转大火煮 8 分钟。","大火","热水","不适用","8 分钟",480,"汤色逐渐变白并持续沸腾。",["鲫鱼","姜","料酒","清水"]),
    step("加入豆腐慢煮","加入嫩豆腐，转中小火继续煮 15 分钟。","小火","沸水","不适用","15 分钟",900,"豆腐热透，鱼肉熟透易离骨。",["嫩豆腐","鲫鱼"]),
    step("调味检查鱼刺","加食盐后关火；分食时先把鱼肉剔骨，再逐块检查细刺。","不适用","不适用","不适用","2 分钟",120,"汤鲜而不腥，入口鱼肉无刺。",["食盐","鲫鱼"],"鱼刺细小，儿童和老人食用必须由成人剔刺。"),
  ];
  if (spec.slug === "minced-pork-steamed-egg") return [
    step("调好蛋液","鸡蛋打散，加入温水和食盐搅匀，过筛到浅碗并撇去气泡。","不适用","温水","不适用","3 分钟",180,"蛋液细腻、表面少气泡。",["鸡蛋","温水","食盐"]),
    step("先蒸蛋羹","碗口盖耐热盘，蒸锅上汽后放入，中小火蒸 8 分钟。","小火","沸水","不适用","8 分钟",480,"蛋羹边缘凝固，中心仍轻微晃动。",["鸡蛋"],"开盖时防蒸汽烫伤。"),
    step("炒熟肉末","小锅中火放猪肉末、姜和料酒，利用肉末自身油脂翻炒至完全变色，再加生抽。","中火","不适用","锅温热而不冒烟","4 分钟",240,"肉末松散、无粉红色，锅底有少量肉汁。",["猪肉末","姜","料酒","生抽"],"猪肉末中心温度达到 71°C。"),
    step("铺肉末复蒸","熟肉末和肉汁均匀铺在蛋羹上，继续中小火蒸 3 分钟。","小火","沸水","不适用","3 分钟",180,"中心完全凝固，肉末热透。",["猪肉末","鸡蛋"]),
    step("淋香油上桌","关火焖 2 分钟，取出后淋芝麻油。","不适用","不适用","不适用","2 分钟",120,"蛋羹嫩滑无生水，肉末熟透。",["芝麻油"]),
  ];
  if (spec.slug === "clam-steamed-egg") return [
    step("煮蛤蜊开口","蛤蜊冷水洗净后放入沸水，加姜煮 2–3 分钟，开口的立即捞出，未开口的丢弃。","大火","沸水","不适用","3 分钟",180,"蛤蜊全部筛查完毕，无沙和破壳。",["蛤蜊","姜"],"加热后不开口的贝类不得食用。"),
    step("过滤蛤蜊汤","煮蛤蜊的水静置后通过细筛，取 240ml 放至温热。","不适用","温水","不适用","3 分钟",180,"汤中没有沙粒，温热不烫。",["温水"]),
    step("调制蛋液","鸡蛋打散，加入过滤后的温汤和食盐搅匀，再过筛。","不适用","温水","不适用","2 分钟",120,"蛋液细腻无泡。",["鸡蛋","温水","食盐"]),
    step("组合上汽蒸","蛤蜊排入浅碗，倒入蛋液并盖盘；上汽后中小火蒸 8–10 分钟。","小火","沸水","不适用","9 分钟",540,"中心凝固，轻晃只有整体微颤。",["蛤蜊","鸡蛋"],"蛋液和蛤蜊肉必须彻底熟透。"),
    step("调味上桌","关火焖 2 分钟，淋生抽和芝麻油后食用。","不适用","不适用","不适用","2 分钟",120,"蛋羹嫩滑，蛤蜊肉熟而不老。",["生抽","芝麻油"]),
  ];
  if (spec.slug === "braised-prawn") return [
    step("处理大虾","大虾剪须、开背去虾线并彻底擦干；姜和大葱切好。","不适用","冷水","不适用","8 分钟",480,"虾线去净，表面无水珠。",["大虾","姜","大葱"],"处理生虾后清洁双手和水槽。"),
    step("煎到虾壳变红","锅中火预热加油，大虾单层下锅，每面煎约 1 分钟。","中火","不适用","油面出现细小波纹","2 分钟",120,"虾壳大面积变红，虾身弯曲。",["大虾","食用油"]),
    step("爆香葱姜","把虾拨到锅边，加入姜和大葱炒 30 秒。","中火","不适用","不适用","30 秒",30,"葱姜香气明显但未焦。",["姜","大葱"]),
    step("加入焖汁","加入料酒、生抽、白糖、番茄酱、食盐和清水 80ml，翻匀后盖盖中火焖 3 分钟。","中火","热水","不适用","3 分钟",180,"虾肉完全不透明，酱汁开始浓缩。",["大虾","料酒","生抽","白糖","番茄酱","食盐","清水"]),
    step("开盖收汁","开盖大火翻动 30–60 秒，让酱汁裹住大虾后立即离火。","大火","不适用","不适用","45 秒",45,"虾身呈 C 形，酱汁薄薄挂壳。",["大虾"],"虾肉中心不得半透明；卷成紧 O 形通常表示过熟。"),
  ];
  if (spec.slug === "tomato-tofu-soup") return [
    step("准备番茄和豆腐","番茄切块，嫩豆腐切 2–3cm 块；豆腐用清水轻轻冲洗。","不适用","冷水","不适用","5 分钟",300,"块形均匀，豆腐没有碎裂。",["番茄","嫩豆腐"]),
    step("炒出番茄汁","锅中火加食用油，下番茄、白糖和一半食盐翻炒 3 分钟。","中火","不适用","油可流动铺开","3 分钟",180,"番茄变软，锅底出现红色汁水。",["番茄","食用油","白糖","食盐"]),
    step("加水煮汤底","加入清水，大火煮沸后转中火煮 3 分钟。","中火","热水","不适用","3 分钟",180,"汤色红亮，番茄味融入汤中。",["清水","番茄"]),
    step("加入豆腐","轻轻滑入嫩豆腐，中小火煮 4 分钟，不要大力搅动。","小火","沸水","不适用","4 分钟",240,"豆腐中心热透，仍保持完整。",["嫩豆腐"]),
    step("调味盛汤","加入剩余食盐，用勺背轻推两下后关火。","不适用","不适用","不适用","30 秒",30,"汤清鲜、豆腐完整。",["食盐"]),
  ];
  if (spec.slug === "yam-pork-porridge") return [
    step("煮开米粥","大米与清水入锅，大火煮开后转小火，盖盖留缝煮 25 分钟并定时搅动。","小火","冷水","不适用","25 分钟",1500,"米粒开花，粥体开始浓稠。",["大米","清水"]),
    step("处理山药和肉末","山药戴手套去皮切小块；猪里脊末加入姜和玉米淀粉抓匀。","不适用","冷水","不适用","6 分钟",360,"山药块均匀，肉末松散无大团。",["山药","猪里脊","姜","玉米淀粉"]),
    step("加入山药煮软","山药加入米粥，小火煮 12 分钟并搅动防粘。","小火","沸水","不适用","12 分钟",720,"山药能被勺背轻松压碎。",["山药","大米"]),
    step("分散加入瘦肉","把肉末分次撒入微沸的粥中，边加边搅，继续煮 5 分钟。","小火","沸水","不适用","5 分钟",300,"肉末完全变白且均匀分散。",["猪里脊"],"猪肉末必须彻底熟透。"),
    step("调味降温","加入食盐，关火静置 3 分钟；老人食用可再压碎山药。","不适用","不适用","不适用","3 分钟",180,"粥温热、米粒软烂、无生肉。",["食盐"]),
  ];
  if (spec.slug === "silver-ear-soup") return [
    step("泡发处理银耳","干银耳冷水泡发至完全舒展，剪去黄色硬根并撕成 2cm 小朵；莲子检查并去莲心。","不适用","冷水","不适用","15 分钟",900,"银耳无硬根，莲子无苦芯。",["干银耳","干莲子"]),
    step("银耳先煮出胶","银耳和清水一同入锅，大火煮沸后转小火盖盖留缝煮 35 分钟，中途搅动两次。","小火","冷水","不适用","35 分钟",2100,"汤体开始黏稠，银耳边缘透明。",["干银耳","清水"]),
    step("加入莲子","加入莲子继续小火煮 25 分钟。","小火","沸水","不适用","25 分钟",1500,"莲子一压即开，银耳胶质明显。",["干莲子"]),
    step("最后加入冰糖","加入冰糖搅至溶解，再小火煮 5 分钟。","小火","沸水","不适用","5 分钟",300,"糖完全溶解，汤羹均匀浓稠。",["冰糖"]),
    step("降温食用","关火静置至少 10 分钟，温热后食用；剩余成品尽快冷藏。","不适用","不适用","不适用","10 分钟",600,"入口温热不烫，莲子软烂。",names,"银耳羹不应长时间在室温放置。"),
  ];
  if (spec.slug === "pear-tremella") return [
    step("泡发银耳","干银耳冷水泡发，剪去硬根并撕成小朵；雪梨去核切 2–3cm 块。","不适用","冷水","不适用","15 分钟",900,"银耳无硬根，梨块大小均匀。",["干银耳","雪梨"]),
    step("银耳先煮","银耳加清水煮沸，转小火盖盖留缝煮 35 分钟。","小火","冷水","不适用","35 分钟",2100,"汤体微黏，银耳柔软。",["干银耳","清水"]),
    step("加入雪梨","加入雪梨块继续小火煮 15 分钟。","小火","沸水","不适用","15 分钟",900,"梨块透明变软但没有完全碎散。",["雪梨"]),
    step("冰糖调味","加入冰糖搅至完全溶解，再煮 5 分钟。","小火","沸水","不适用","5 分钟",300,"甜味均匀，汤羹清润。",["冰糖"]),
    step("放温保存","关火放至温热后食用，剩余部分在 2 小时内冷藏。","不适用","不适用","不适用","10 分钟",600,"银耳软糯、梨块柔软。",names),
  ];
  if (spec.slug === "garlic-broccoli") return [
    step("切小朵并洗净","西兰花沿花梗切成大小接近的小朵，放入清水中充分冲洗后沥干；蒜切末。","不适用","冷水","不适用","5 分钟",300,"花朵大小接近，切口洁净且没有积水。",["西兰花","蒜"]),
    step("沸水快速焯熟","锅中水完全沸腾后加一半食盐，放入西兰花焯 60–90 秒，立即捞出充分沥水。","大火","沸水","不适用","90 秒",90,"西兰花颜色鲜绿，花梗能被筷子穿入但仍有脆度。",["西兰花","食盐"]),
    step("低温爆香蒜末","炒锅中火预热后倒入食用油，转小火放蒜末炒约 20 秒。","小火","不适用","油温热、蒜末周围有细泡","20 秒",20,"蒜末香气明显但颜色仍浅。",["食用油","蒜"],"蒜末焦黄会发苦，出现深色前立即进入下一步。"),
    step("回锅快速翻炒","放入沥干的西兰花，转大火翻炒 40 秒，让蒜油均匀附着。","大火","不适用","不适用","40 秒",40,"西兰花表面有光泽，锅底没有明显积水。",["西兰花","蒜"]),
    step("蚝油调味离火","加入蚝油、生抽和剩余食盐，大火翻匀约 20 秒后立即关火装盘。","大火","不适用","不适用","20 秒",20,"调味薄而均匀，西兰花鲜绿脆嫩。",["蚝油","生抽","食盐","西兰花"]),
  ];
  if (spec.slug === "mapo-tofu") return [
    step("豆腐温盐水焯烫","嫩豆腐切块；锅中清水加一半食盐加热到微沸，豆腐滑入后小火焯 2 分钟，连水暂存。","小火","温水","不适用","2 分钟",120,"豆腐中心温热，块形完整且豆腥味减轻。",["嫩豆腐","清水","食盐"]),
    step("炒熟牛肉末","炒锅中火预热后倒入食用油，下牛肉末持续划散 3 分钟。","中火","不适用","油面出现细小波纹","3 分钟",180,"牛肉末松散、完全变色且略微焦香。",["牛肉末","食用油"],"牛肉末必须完全变色，不保留粉红肉粒。"),
    step("炒出红油香气","转小火，加入郫县豆瓣酱、豆豉、蒜和辣椒粉炒 1 分钟。","小火","不适用","不适用","1 分钟",60,"锅中出现红油，酱香明显但蒜和辣椒没有焦黑。",["郫县豆瓣酱","豆豉","蒜","辣椒粉"]),
    step("豆腐入锅烧透","加入清水和生抽煮沸，豆腐沥水后轻轻滑入，中小火不加盖烧 4 分钟，只推锅不大力翻动。","小火","热水","不适用","4 分钟",240,"豆腐中心热透，汤汁减少约三分之一。",["清水","生抽","嫩豆腐"]),
    step("分次勾芡","玉米淀粉加等量冷水调匀，分 2 次淋入，每次沿同一方向轻推至汤汁重新沸腾。","中火","冷水","不适用","1 分钟",60,"芡汁均匀包裹豆腐，锅底仍保留少量流动汤汁。",["玉米淀粉","嫩豆腐"]),
    step("花椒粉收尾","加入剩余食盐，关火后均匀撒花椒粉，端锅轻晃两下即可装盘。","不适用","不适用","不适用","30 秒",30,"豆腐完整，麻辣香气清晰且芡汁明亮。",["食盐","花椒粉","嫩豆腐"]),
  ];
  if (spec.slug === "dry-fried-green-beans") return [
    step("四季豆洗净擦干","四季豆去筋掰段，洗净后彻底擦干；干辣椒剪段，蒜切末。","不适用","冷水","不适用","8 分钟",480,"四季豆表面无水珠，长短接近。",["四季豆","干辣椒","蒜"]),
    step("煸到表皮起皱","炒锅中火预热后倒入食用油，放四季豆铺开，中火翻煸 7–9 分钟。","中火","不适用","油面出现细小波纹，不冒烟","8 分钟",480,"四季豆颜色转深、表皮起皱，折断后内部完全熟透且无生青味。",["四季豆","食用油"],"四季豆必须彻底熟透；不要通过缩短本步骤追求脆生口感。"),
    step("盛出控油","把四季豆盛到铺有吸油纸的盘中，锅内只留薄薄一层油。","不适用","不适用","不适用","1 分钟",60,"四季豆表面不滴油，锅中没有大量余油。",["四季豆"]),
    step("炒熟肉末和香料","原锅中火下猪肉末炒散至完全变色，再加入芽菜、干辣椒、花椒和蒜炒 40 秒。","中火","不适用","不适用","3 分钟",180,"肉末熟透松散，香料有香气但没有焦黑。",["猪肉末","芽菜","干辣椒","花椒","蒜"],"猪肉末中心温度应达到 71°C。"),
    step("回锅调味","四季豆回锅，加入生抽和食盐，转大火翻炒 45 秒后立即装盘。","大火","不适用","不适用","45 秒",45,"调味均匀，四季豆干香起皱且无生味。",["四季豆","生抽","食盐"]),
  ];
  if (spec.slug === "cabbage-tofu-pot") return [
    step("泡香菇并切配","干香菇用温水泡软后挤净泥沙、切片，泡发水静置后取上层清液；白菜梗和叶分开放，北豆腐切块。","不适用","温水","不适用","10 分钟",600,"香菇无硬芯，泡发水无底部泥沙，白菜梗叶分开。",["干香菇","大白菜","北豆腐"]),
    step("煎豆腐定型","锅中火预热后倒入食用油，豆腐擦干后单层放入，每面煎约 2 分钟至浅金黄。","中火","不适用","油面出现细小波纹","4 分钟",240,"豆腐两面定型，翻动时不易碎。",["北豆腐","食用油"]),
    step("炒香姜和白菜梗","把豆腐拨到一边，加入姜和白菜梗中火翻炒 2 分钟。","中火","不适用","不适用","2 分钟",120,"姜香明显，白菜梗开始变软。",["姜","大白菜"]),
    step("加汤炖香菇豆腐","加入香菇、清水和过滤后的香菇泡发水，大火煮沸后转小火盖盖炖 10 分钟。","小火","热水","不适用","10 分钟",600,"香菇熟透，豆腐中心热透，汤汁清香。",["干香菇","清水","北豆腐"]),
    step("最后加入白菜叶","放入白菜叶，加食盐和白胡椒粉，中火煮 3–4 分钟后关火。","中火","沸水","不适用","4 分钟",240,"白菜叶柔软但未煮烂，所有食材热透。",["大白菜","食盐","白胡椒粉"]),
  ];
  if (spec.slug === "zhajiang-noodles") return [
    step("备好肉末和菜码","黄瓜切细丝后冷藏；黄豆酱、甜面酱、白糖和料酒混合，猪肉末单独放置。","不适用","冷水","不适用","6 分钟",360,"黄瓜丝干爽，酱料混合均匀。",["黄瓜","黄豆酱","甜面酱","白糖","料酒","猪肉末"],"处理生肉的器具不得接触黄瓜丝。"),
    step("炒熟猪肉末","炒锅中火预热后倒入食用油，下猪肉末划散并炒 4 分钟。","中火","不适用","油面出现细小波纹","4 分钟",240,"肉末完全变色、松散并析出少量油脂。",["猪肉末","食用油"],"猪肉末中心温度应达到 71°C。"),
    step("小火熬炸酱","转小火倒入混合酱料，持续翻炒 4–5 分钟；过稠时加入两勺煮面水。","小火","热水","不适用","5 分钟",300,"炸酱油润浓稠，酱香明显且锅底没有焦点。",["黄豆酱","甜面酱","白糖","料酒","猪肉末"]),
    step("沸水煮面","另锅加入足量清水烧至沸腾，下鲜面条并立即拨散，中火煮至夹断无白芯。","中火","沸水","不适用","4 分钟",240,"面条熟而有弹性，彼此不粘连。",["鲜面条"]),
    step("沥水拌酱","面条捞出充分沥水，每碗先拌入炸酱，再铺黄瓜丝，立即食用。","不适用","不适用","不适用","1 分钟",60,"面条均匀挂酱，黄瓜丝保持清脆。",["鲜面条","猪肉末","黄豆酱","甜面酱","黄瓜"]),
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
    step(`把水烧至沸腾`,`锅中加入清水 1200ml、${[second, ...seasoningNames.filter((name) => name !== "食盐")].filter(Boolean).join("、") || "配料"}，大火烧至整锅持续翻滚。`,`大火`,`沸水`,`不适用`,`3 分钟`,180,`水面连续出现大泡并有明显蒸汽。`,["清水",second ?? "",...seasoningNames.filter((name) => name !== "食盐")]),
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
      step("调糖醋汁","番茄酱加入白糖 25g、香醋 25ml、剩余生抽、食盐和清水 30ml 搅匀。先尝一滴：应酸甜平衡，醋香清晰而不呛。","不适用","温水","不适用","1 分钟",60,"糖完全溶解，酱汁顺滑无结块。",["番茄酱","白糖","香醋","生抽","食盐","清水"]),
      step("熬至酱汁起泡","锅中留油 5ml，倒入糖醋汁，中火加热约 40 秒并持续搅动，避免糖沉底焦化。","中火","不适用","温热即可","40 秒",40,"酱汁冒细密小泡并略微变稠，锅底没有焦点。",["番茄酱","白糖","香醋","生抽","食盐","清水","食用油"]),
      step("快速裹汁出锅","倒入里脊条，大火翻匀 30 秒立即装盘。","大火","不适用","不适用","30 秒",30,"每条里脊均匀挂汁，外层仍保持酥感。",["猪里脊","番茄酱"]),
    ];
    return [
      step(`处理${main}`,`称量${main}${second?`和${second}`:""}，按备注切配并用厨房纸吸干表面水分。`,`不适用`,`冷水`,`不适用`,`${spec.prep} 分钟`,spec.prep*60,`${main}表面干爽，厚薄均匀。`,[main,second??""],"生鲜食材与熟食工具分开。"),
      step("提前调味",`加入${seasoningNames.filter((name) => name !== "食用油").join("、")}抓匀或刷匀，静置 5 分钟。`,"不适用","不适用","不适用","5 分钟",300,"调味均匀，表面没有大量水分。",[main,...seasoningNames.filter((name) => name !== "食用油")]),
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
    step(`精确调味`,`加入食盐 2g、白胡椒粉和芝麻油，轻轻搅匀后立即关火。`,`小火`,`不适用`,`不适用`,`20 秒`,20,`汤清、蛋花完整，咸味均匀。`,["食盐","白胡椒粉","芝麻油"]),
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
    step(`一次加足水`,`锅中加入清单所列清水、${main}${seasoningNames.filter((name) => name !== "食盐").length ? `以及${seasoningNames.filter((name) => name !== "食盐").join("、")}` : ""}，大火加热至整锅沸腾。`,`大火`,`冷水`,`不适用`,`8 分钟`,480,`汤面持续翻滚，浮沫已撇净。`,[main,"清水",...seasoningNames.filter((name) => name !== "食盐")]),
    step(`转小火慢煮`,`盖盖留约 1cm 缝隙，转小火保持汤面偶尔冒泡，先炖煮 ${Math.max(20,spec.wait-15)} 分钟。`,`小火`,`沸水`,`不适用`,`${Math.max(20,spec.wait-15)} 分钟`,Math.max(1200,(spec.wait-15)*60),`${main}接近软熟，汤色自然。`,[main],"长时间炖煮需防止水分烧干。"),
    step(`加入后熟食材`,`${extraNames.length ? `按成熟快慢加入${extraNames.join("、")}` : "检查汤量"}，肉类和根茎先下，易碎豆腐和叶菜最后加入；再次沸腾后中小火煮约 15 分钟。`,`中火`,`沸水`,`不适用`,`15 分钟`,900,`${extraNames.join("、") || "汤中食材"}全部熟透，易碎食材没有过度碎烂。`,extraNames),
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
    step(`加热水焖熟`,`沿锅边加入清单中的热水；香菇等耐煮辅料现在加入，土豆、萝卜等根茎在最后 15–20 分钟加入，青椒等易熟蔬菜在最后 3 分钟加入。沸腾后转小火盖盖焖 ${Math.max(10,spec.wait)} 分钟。`,`小火`,`热水`,`不适用`,`${Math.max(10,spec.wait)} 分钟`,Math.max(600,spec.wait*60),`${main}中心熟透，${extraNames.join("、") || "配菜"}达到各自应有熟度。`,[main,"清水",...extraNames],"禽肉和肉块中心不得带血水。"),
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
    step(`加入${extraNames.length ? extraNames.join("、") : "其余食材"}`,`按成熟快慢加入${extraNames.length ? extraNames.join("、") : "其余食材"}：较硬食材先下，鸡蛋等已提前炒熟的食材最后回锅。转大火持续翻动，让食材均匀受热且不过度出水。`,`大火`,`不适用`,`不适用`,`2 分钟`,120,`${extraNames.join("、") || "食材"}全部达到应有熟度并保持脆嫩。`,extraNames),
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
  const imageVerified = false;
  const featureTags = recipeFeatureTags(spec.slug, [spec.method, ...(spec.tags ?? [])]);
  return {
    slug:spec.slug,title:spec.title,summary:`${featureTags.join("、")}的${spec.title}。`,image:"",imageVerified,editorialStatus,reviewedAt:editorialStatus==="reviewed"?"2026-07-16":undefined,category:spec.category,tags,featureTags,aliases:spec.title.includes("番茄")?[spec.title.replaceAll("番茄","西红柿")]:[],
    dietType,nutritionRoles,cookingMethod:spec.method,spiceLevel:spec.spice ?? 0,allergens,babyAge:spec.baby?{min:spec.baby[0],max:spec.baby[1],texture:spec.baby[2]}:undefined,
    difficulty:Math.min(5,Math.max(1,Math.ceil((spec.prep+spec.active+spec.wait)/30))) as Recipe["difficulty"],prepMinutes:spec.prep,activeMinutes:spec.active,waitMinutes:spec.wait,cookMinutes:spec.active+spec.wait,servings:spec.servings,
    likes:0,weeklyLikes:0,ingredients,steps:makeSteps(spec,ingredients),tips:[`开始前把${ingredientNames}全部称量并按步骤摆放。`,`完成状态比固定钟表更重要，同时观察颜色、质地和香气。`],failurePoints:[`${mainFailure(spec.method)}；出现异常焦味时立即离火。`],safetyNote:safetyNoteFor(spec,ingredientNames),
    bilibiliSearchUrl:search,sources:REVIEWED_SOURCES[spec.slug]??[GUIDELINE,spec.baby?INFANT_GUIDELINE:{name:`${spec.title}视频搜索入口`,url:search,type:"video",verifiedAt:"2026-07-15"}],
  };
}

function safetyNoteFor(spec: Spec, ingredientNames: string) {
  if (spec.baby) return "需由成人全程看护进食；首次引入常见过敏原时一次只尝试一种，并连续观察是否出现不适。";
  const notes = ["生熟分开处理，接触生肉、蛋和水产的刀板及筷子不得再接触熟食。"];
  if (/鸡|鸡翅|禽/.test(ingredientNames)) notes.push("禽肉最厚处中心温度达到 74°C；不要只凭外皮上色判断熟度。");
  else if (/肉末|肉馅|猪肉馅|牛肉末/.test(ingredientNames)) notes.push("肉馅或肉末中心温度达到 71°C。 ");
  else if (/牛|猪|羊|排骨|里脊|五花肉/.test(ingredientNames)) notes.push("整块牛、猪、羊肉中心至少达到 63°C，并离火静置 3 分钟；中式炖煮菜应达到全熟口感。 ");
  if (/鱼|虾|蟹|蛤蜊|扇贝|生蚝|鱿鱼/.test(ingredientNames)) notes.push("鱼贝虾蟹中心至少达到 63°C；蛤蜊等双壳贝类加热后仍不开口的丢弃。 ");
  if (/鸡蛋|蛋清/.test(ingredientNames)) notes.push("蛋液应完全凝固；蛋类菜肴中心达到 71°C。 ");
  return notes.join("");
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
