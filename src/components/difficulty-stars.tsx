import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeStarsForDifficulty } from "@/lib/difficulty";

export function DifficultyStars({ difficulty, className, showLabel = false }: { difficulty: number; className?: string; showLabel?: boolean }) {
  const value = Math.max(1, Math.min(5, Math.round(difficulty)));
  const filledStars = easeStarsForDifficulty(value);
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-label={`易做程度：五颗星中点亮 ${filledStars} 颗；原始难度 ${value}/5`} title={`易做程度 ${filledStars}/5 · 难度 ${value}/5`}>
      {showLabel && <span className="mr-1 text-xs font-semibold text-muted-foreground">易做程度</span>}
      {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className={cn("size-4", index < filledStars ? "fill-[#f3c75b] text-[#f3c75b]" : "fill-transparent text-[#d7cec7]")} />)}
      <span className="sr-only">易做程度 {filledStars}/5，难度 {value}/5</span>
    </span>
  );
}
