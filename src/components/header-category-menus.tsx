"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { audienceCategories, categories } from "@/lib/recipes";
import { cn } from "@/lib/utils";

type MenuId = "dish" | "audience";

const menus = [
  {
    id: "dish" as const,
    label: "菜品类型",
    items: categories.filter((item) => item !== "全部").map((item) => ({
      label: item,
      href: `/discover?category=${encodeURIComponent(item)}`,
    })),
  },
  {
    id: "audience" as const,
    label: "人群与场景",
    items: audienceCategories.map((item) => ({
      label: item,
      href: `/discover?tag=${encodeURIComponent(item)}`,
    })),
  },
];

export function HeaderCategoryMenus() {
  const [open, setOpen] = useState<MenuId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="flex items-center gap-1">
      {menus.map((menu) => {
        const expanded = open === menu.id;
        return (
          <div key={menu.id} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : menu.id)}
              className={cn(
                "inline-flex min-h-11 items-center gap-1 rounded-full px-2.5 font-semibold transition-colors hover:bg-secondary hover:text-primary xl:px-3",
                expanded && "bg-secondary text-primary",
              )}
            >
              {menu.label}
              <ChevronDown className={cn("size-4 transition-transform", expanded && "rotate-180")} />
            </button>
            {expanded && (
              <div role="menu" aria-label={menu.label} className="absolute left-1/2 top-[calc(100%+10px)] w-64 -translate-x-1/2 rounded-[20px] border border-border/80 bg-[#fffdf8] p-2.5 shadow-[0_20px_55px_rgba(83,48,31,.16)]">
                <div className={cn("grid gap-1", menu.id === "dish" && "grid-cols-2")}>
                  {menu.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setOpen(null)}
                      className="flex min-h-11 items-center rounded-xl px-3 text-sm font-bold transition hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                <Link href="/discover" onClick={() => setOpen(null)} className="mt-2 flex min-h-11 items-center justify-center gap-1 border-t border-border/70 px-3 pt-2 text-sm font-bold text-primary transition hover:text-[#c94525]">
                  浏览全部<ChevronRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
