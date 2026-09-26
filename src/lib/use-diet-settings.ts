"use client";

import { useEffect, useState } from "react";
import { DIETARY_OPTIONS, type DietaryOption } from "@/lib/blindbox";

const KEY = "cfm:v2:diet-settings";

export function useDietSettings() {
  const [servings, setServings] = useState(4);
  const [babyAge, setBabyAge] = useState(0);
  const [exclusions, setExclusions] = useState<DietaryOption[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const task = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
        if (saved && typeof saved === "object") {
          if (Number.isInteger(saved.servings) && saved.servings >= 1 && saved.servings <= 8) setServings(saved.servings);
          if (Number.isInteger(saved.babyAge) && (saved.babyAge === 0 || saved.babyAge >= 6 && saved.babyAge <= 24)) setBabyAge(saved.babyAge);
          if (Array.isArray(saved.exclusions)) setExclusions(DIETARY_OPTIONS.filter(option => saved.exclusions.includes(option)));
        }
      } catch { /* 损坏或不可用的本机存储使用默认值。 */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(task);
  }, []);

  useEffect(() => {
    // 必须先完成读取，首次渲染的默认值不能覆盖用户已经保存的忌口。
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ servings, babyAge, exclusions }));
      window.dispatchEvent(new CustomEvent("cfm:settings"));
    } catch { /* 隐私模式下仍可在当前页面使用设置。 */ }
  }, [hydrated, servings, babyAge, exclusions]);

  return { servings, setServings, babyAge, setBabyAge, exclusions, setExclusions, hydrated };
}
