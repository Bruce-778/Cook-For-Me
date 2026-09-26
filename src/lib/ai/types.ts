import { z } from "zod";

export const aiChatRequestSchema = z.object({
  message: z.string().trim().min(2, "请再多告诉我一点").max(800, "一次最多输入 800 个字"),
  history: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(1200),
  })).max(6).default([]),
});

export const aiRecommendationSchema = z.object({
  slug: z.string(),
  reason: z.string().min(1).max(120),
  adjustment: z.string().max(120).default(""),
});

export const aiAdviceSchema = z.object({
  intent: z.enum(["日常选择", "现有食材", "减脂管理", "身体不适", "忌口过敏", "快速做饭", "家庭场景"]),
  title: z.string().min(1).max(40),
  summary: z.string().min(1).max(260),
  recommendations: z.array(aiRecommendationSchema).max(5),
  tips: z.array(z.string().min(1).max(100)).max(4),
  caution: z.string().max(220).default(""),
  followUpQuestion: z.string().max(100).default(""),
  urgency: z.enum(["normal", "medical-caution", "emergency"]).default("normal"),
});

export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;
export type AiAdvice = z.infer<typeof aiAdviceSchema>;
