import type { Recipe } from "@/lib/recipes";

// 只记录实际完成的公开元数据检查，不把 API 可访问伪装成人工播放。
type VideoReference = Pick<Recipe, "bilibiliVideoUrl" | "videoTitle" | "videoCreator" | "videoMetadataCheckedAt">;
export const recipeVideoReferences: Record<string, VideoReference> = {
  "tomato-scrambled-eggs": {
    bilibiliVideoUrl: "https://www.bilibili.com/video/BV13p411d7oQ/",
    videoTitle: "厨师长教你一道：“番茄炒鸡蛋”非常很详细的讲解",
    videoCreator: "美食作家王刚R",
    videoMetadataCheckedAt: "2026-09-26",
  },
  "cola-chicken-wings": {
    bilibiliVideoUrl: "https://www.bilibili.com/video/BV1vE411h7VP/",
    videoTitle: "厨师长教你：“可乐鸡翅”的家常做法，味道鲜嫩可口，先收藏起来",
    videoCreator: "美食作家王刚R",
    videoMetadataCheckedAt: "2026-09-26",
  },
  "fish-fragrant-pork": {
    bilibiliVideoUrl: "https://www.bilibili.com/video/BV1Gs411A7Vo/",
    videoTitle: "厨师长教你：“鱼香肉丝”的老式做法，味道很赞，先收藏了",
    videoCreator: "美食作家王刚R",
    videoMetadataCheckedAt: "2026-09-26",
  },
  "scallion-oil-noodles": {
    bilibiliVideoUrl: "https://www.bilibili.com/video/BV1Pm4y1X796/",
    videoTitle: "厨师长分享：“葱油拌面”，葱香酱香十足，吃起来根本停不下来",
    videoCreator: "美食作家王刚R",
    videoMetadataCheckedAt: "2026-09-26",
  },
};
