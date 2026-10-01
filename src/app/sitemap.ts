import type { MetadataRoute } from "next";
import { publicRecipes } from "@/lib/recipes";

function siteOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  try {
    return new URL(configured || "http://localhost:3001");
  } catch {
    return new URL("http://localhost:3001");
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const pages: MetadataRoute.Sitemap = [
    { url: new URL("/", origin).toString(), changeFrequency: "weekly", priority: 1 },
    { url: new URL("/discover", origin).toString(), changeFrequency: "daily", priority: 0.9 },
    { url: new URL("/blindbox", origin).toString(), changeFrequency: "weekly", priority: 0.8 },
    { url: new URL("/assistant", origin).toString(), changeFrequency: "weekly", priority: 0.8 },
    { url: new URL("/ranking", origin).toString(), changeFrequency: "daily", priority: 0.7 },
  ];

  const reviewedRecipes = publicRecipes.filter((recipe) => recipe.editorialStatus === "reviewed");
  for (const recipe of reviewedRecipes) {
    pages.push({
      url: new URL(`/recipes/${recipe.slug}`, origin).toString(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
    pages.push({
      url: new URL(`/cook/${recipe.slug}`, origin).toString(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  return pages;
}
